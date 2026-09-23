/**
 * empirica-cms.tsx — CMS Empírica: auth + gestão de fundos + documentos
 * Persiste em KV Store + Supabase Storage (bucket: srm-pdfs, path: funds/)
 */

import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const BUCKET = "srm-pdfs";
const MASTER_ADMIN_EMAIL = "luiz.oliveira@srmasset.com";

// ── helpers ──────────────────────────────────────────────────────────────────

function sbAdmin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function sbAnon() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
}

async function requireAdmin(c: any): Promise<string | null> {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return null;
  const { data } = await sbAdmin().auth.getUser(token);
  return data?.user?.id ?? null;
}

async function requireSuperAdmin(c: any): Promise<string | null> {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return null;
  const { data } = await sbAdmin().auth.getUser(token);
  const user = data?.user;
  if (!user?.id) return null;
  if (user.app_metadata?.role !== "admin") return null;
  return user.id;
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uid(): string {
  return crypto.randomUUID();
}

// ── types ─────────────────────────────────────────────────────────────────────

interface FundField    { label: string; value: string }
interface FundCategory { id: string; name: string }
interface FundDoc      { id: string; fundId: string; categoryId: string; label: string; pdfPath: string; pdfName: string; createdAt: string; sortOrder?: number }
interface Fund {
  id: string;
  type: "FIDC" | "FIF" | "FII" | "FIP";
  name: string;
  slug: string;
  fields: FundField[];
  categories: FundCategory[];
  createdAt: string;
  updatedAt: string;
}

// ── idempotent bucket setup ───────────────────────────────────────────────────

let bucketReady = false;
async function ensureBucket() {
  if (bucketReady) return;
  const sb = sbAdmin();
  const { data: buckets } = await sb.storage.listBuckets();
  if (!buckets?.some((b) => b.name === BUCKET)) {
    const { error } = await sb.storage.createBucket(BUCKET, { public: true });
    if (error) console.log(`Erro ao criar bucket ${BUCKET}: ${error.message}`);
    else console.log(`Bucket público criado: ${BUCKET}`);
  } else {
    await sb.storage.updateBucket(BUCKET, { public: true });
  }
  bucketReady = true;
}

function sanitizeStorageKey(filename: string): string {
  return filename
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// ── register routes ───────────────────────────────────────────────────────────

export function registerEmpricaCmsRoutes(app: Hono) {

  // ── AUTH ────────────────────────────────────────────────────────────────────

  app.post("/make-server-57709921/admin/login", async (c) => {
    try {
      const { email, password } = await c.req.json();
      if (!email || !password) return c.json({ error: "Email e senha obrigatórios" }, 400);

      const sb = sbAdmin();
      const { data, error } = await sb.auth.signInWithPassword({ email, password });

      if (error || !data?.session) {
        return c.json({ error: "Credenciais inválidas" }, 401);
      }

      // Idempotently stamp admin role on the master account.
      // If we had to update, re-sign to get a fresh JWT that already contains
      // app_metadata.role = "admin" — otherwise the current token won't have it.
      let session = data.session;
      if (email === MASTER_ADMIN_EMAIL && data.user?.app_metadata?.role !== "admin") {
        await sb.auth.admin.updateUserById(data.user!.id, {
          app_metadata: { role: "admin" },
        });
        const reauth = await sbAnon().auth.signInWithPassword({ email, password });
        if (reauth.data?.session) session = reauth.data.session;
      }

      const mustChangePassword = data.user?.user_metadata?.must_change_password === true;
      return c.json({
        token: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at,
        mustChangePassword,
      });
    } catch (e) {
      console.log("Login error:", e);
      return c.json({ error: `Erro interno: ${e}` }, 500);
    }
  });

  // ── INVITE — cria usuário convidado ─────────────────────────────────────────

  app.post("/make-server-57709921/admin/invite", async (c) => {
    try {
      const adminId = await requireSuperAdmin(c);
      if (!adminId) return c.json({ error: "Acesso restrito a administradores" }, 403);

      const { email, name, isAdmin } = await c.req.json();
      if (!email) return c.json({ error: "E-mail obrigatório" }, 400);

      const tempPassword = generateTempPassword();
      const sb = sbAdmin();

      const { error } = await sb.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: name || email.split("@")[0],
          must_change_password: true,
        },
        app_metadata: isAdmin ? { role: "admin" } : {},
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already exists")) {
          return c.json({ error: "Este e-mail já está cadastrado" }, 409);
        }
        return c.json({ error: `Erro ao criar usuário: ${error.message}` }, 500);
      }

      console.log(`Usuário convidado: ${email}${isAdmin ? " (admin)" : ""}`);
      return c.json({ email, tempPassword, isAdmin: !!isAdmin });
    } catch (e) {
      console.log("Invite error:", e);
      return c.json({ error: `Erro interno: ${e}` }, 500);
    }
  });

  // ── CHANGE PASSWORD — redefine senha no primeiro acesso ─────────────────────

  app.post("/make-server-57709921/admin/change-password", async (c) => {
    try {
      const userId = await requireAdmin(c);
      if (!userId) return c.json({ error: "Não autorizado" }, 401);

      const { newPassword } = await c.req.json();
      if (!newPassword || newPassword.length < 8) {
        return c.json({ error: "Senha deve ter no mínimo 8 caracteres" }, 400);
      }

      const sb = sbAdmin();
      const { error } = await sb.auth.admin.updateUserById(userId, {
        password: newPassword,
        user_metadata: { must_change_password: false },
      });

      if (error) return c.json({ error: `Erro ao atualizar senha: ${error.message}` }, 500);
      return c.json({ success: true });
    } catch (e) {
      console.log("Change password error:", e);
      return c.json({ error: `Erro interno: ${e}` }, 500);
    }
  });

  // ── USERS — gestão de usuários (admin only) ────────────────────────────────

  app.get("/make-server-57709921/admin/users", async (c) => {
    try {
      const adminId = await requireSuperAdmin(c);
      if (!adminId) return c.json({ error: "Acesso restrito a administradores" }, 403);

      const sb = sbAdmin();
      const { data, error } = await sb.auth.admin.listUsers({ perPage: 200 });
      if (error) return c.json({ error: `Erro ao listar usuários: ${error.message}` }, 500);

      const users = (data?.users ?? []).map((u) => ({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.name ?? null,
        role: u.app_metadata?.role === "admin" ? "admin" : "colaborador",
        lastSignIn: u.last_sign_in_at ?? null,
        createdAt: u.created_at,
        mustChangePassword: u.user_metadata?.must_change_password === true,
      }));

      return c.json({ users });
    } catch (e) {
      console.log("List users error:", e);
      return c.json({ error: `Erro interno: ${e}` }, 500);
    }
  });

  app.patch("/make-server-57709921/admin/users/:id/role", async (c) => {
    try {
      const adminId = await requireSuperAdmin(c);
      if (!adminId) return c.json({ error: "Acesso restrito a administradores" }, 403);

      const targetId = c.req.param("id");
      if (targetId === adminId) return c.json({ error: "Você não pode alterar sua própria role" }, 400);

      const { role } = await c.req.json();
      if (role !== "admin" && role !== "colaborador") return c.json({ error: "Role inválida" }, 400);

      const sb = sbAdmin();
      const { error } = await sb.auth.admin.updateUserById(targetId, {
        app_metadata: { role: role === "admin" ? "admin" : null },
      });
      if (error) return c.json({ error: `Erro ao atualizar role: ${error.message}` }, 500);

      return c.json({ success: true });
    } catch (e) {
      console.log("Update role error:", e);
      return c.json({ error: `Erro interno: ${e}` }, 500);
    }
  });

  app.delete("/make-server-57709921/admin/users/:id", async (c) => {
    try {
      const adminId = await requireSuperAdmin(c);
      if (!adminId) return c.json({ error: "Acesso restrito a administradores" }, 403);

      const targetId = c.req.param("id");
      if (targetId === adminId) return c.json({ error: "Você não pode excluir sua própria conta" }, 400);

      const sb = sbAdmin();
      const { error } = await sb.auth.admin.deleteUser(targetId);
      if (error) return c.json({ error: `Erro ao excluir usuário: ${error.message}` }, 500);

      return c.json({ success: true });
    } catch (e) {
      console.log("Delete user error:", e);
      return c.json({ error: `Erro interno: ${e}` }, 500);
    }
  });

  // ── FUNDOS — leitura pública ────────────────────────────────────────────────

  app.get("/make-server-57709921/empirica/fundos", async (c) => {
    try {
      const typeFilter = c.req.query("type");
      const all = await kv.getByPrefix("empirica-fund:");
      let funds: Fund[] = all.map((v: any) => JSON.parse(v));
      if (typeFilter) funds = funds.filter(f => f.type === typeFilter);
      funds.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      return c.json({ funds });
    } catch (e) {
      return c.json({ error: `Erro ao listar fundos: ${e}` }, 500);
    }
  });

  app.get("/make-server-57709921/empirica/fundos/:id", async (c) => {
    try {
      const id   = c.req.param("id");
      const raw  = await kv.get(`empirica-fund:${id}`);
      if (!raw) return c.json({ error: "Fundo não encontrado" }, 404);
      const fund = JSON.parse(raw as string) as Fund;

      // attach docs with public URLs
      const rawDocs = await kv.getByPrefix(`empirica-doc:${id}:`);
      const sb = sbAdmin();
      const docs = rawDocs.map((d: any) => {
        const doc = JSON.parse(d as string) as FundDoc;
        const pdfUrl = doc.pdfPath
          ? sb.storage.from(BUCKET).getPublicUrl(doc.pdfPath).data.publicUrl
          : "";
        return { ...doc, pdfUrl };
      });
      docs.sort((a: any, b: any) => {
        if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder;
        if (a.sortOrder != null) return -1;
        if (b.sortOrder != null) return 1;
        return a.createdAt.localeCompare(b.createdAt);
      });

      return c.json({ fund, docs });
    } catch (e) {
      return c.json({ error: `Erro ao buscar fundo: ${e}` }, 500);
    }
  });

  // ── FUNDOS — escrita (admin) ────────────────────────────────────────────────

  app.post("/make-server-57709921/empirica/fundos", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const body = await c.req.json();
      const { type, name, fields = [], categories = [] } = body;
      if (!type || !name) return c.json({ error: "type e name são obrigatórios" }, 400);

      const id: string   = uid();
      const now: string  = new Date().toISOString();
      const fund: Fund   = {
        id,
        type,
        name: name.trim(),
        slug: slugify(name.trim()),
        fields,
        categories: categories.map((cat: any) => ({ id: uid(), name: cat.name ?? cat })),
        createdAt: now,
        updatedAt: now,
      };

      await kv.set(`empirica-fund:${id}`, JSON.stringify(fund));
      return c.json({ fund }, 201);
    } catch (e) {
      return c.json({ error: `Erro ao criar fundo: ${e}` }, 500);
    }
  });

  app.put("/make-server-57709921/empirica/fundos/:id", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-fund:${id}`);
      if (!raw) return c.json({ error: "Fundo não encontrado" }, 404);

      const fund = JSON.parse(raw as string) as Fund;
      const body = await c.req.json();
      const updated: Fund = {
        ...fund,
        ...(body.type   && { type: body.type }),
        ...(body.name   && { name: body.name.trim(), slug: slugify(body.name.trim()) }),
        ...(body.fields && { fields: body.fields }),
        ...(body.categories && {
          categories: (body.categories as any[]).map((cat: any) => {
            const name = (cat.name ?? cat) as string;
            // preserve existing id if a category with same name already exists,
            // otherwise keep the cat's own id or generate a new one
            const existing = (fund.categories ?? []).find((ec) => ec.name === name);
            return { id: existing?.id ?? cat.id ?? uid(), name };
          }),
        }),
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`empirica-fund:${id}`, JSON.stringify(updated));
      return c.json({ fund: updated });
    } catch (e) {
      return c.json({ error: `Erro ao atualizar fundo: ${e}` }, 500);
    }
  });

  app.delete("/make-server-57709921/empirica/fundos/:id", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const id     = c.req.param("id");
      const rawDocs = await kv.getByPrefix(`empirica-doc:${id}:`);
      const sb     = sbAdmin();

      // remove all PDFs from storage
      const paths = rawDocs
        .map((d: any) => (JSON.parse(d as string) as FundDoc).pdfPath)
        .filter(Boolean);
      if (paths.length > 0) {
        await sb.storage.from(BUCKET).remove(paths);
      }

      // remove all doc KV entries
      const docKeys = rawDocs.map((_: any, i: number) => {
        const doc = JSON.parse(rawDocs[i] as string) as FundDoc;
        return `empirica-doc:${id}:${doc.id}`;
      });
      if (docKeys.length > 0) await kv.mdel(docKeys);

      await kv.del(`empirica-fund:${id}`);
      return c.json({ ok: true });
    } catch (e) {
      return c.json({ error: `Erro ao excluir fundo: ${e}` }, 500);
    }
  });

  // ── DOCUMENTOS ──────────────────────────────────────────────────────────────

  app.post("/make-server-57709921/empirica/fundos/:fundId/docs", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      await ensureBucket();
      const fundId = c.req.param("fundId");
      const raw    = await kv.get(`empirica-fund:${fundId}`);
      if (!raw) return c.json({ error: "Fundo não encontrado" }, 404);

      const form       = await c.req.formData();
      const categoryId = form.get("categoryId") as string;
      const label      = form.get("label") as string;
      const pdfFile    = form.get("pdf") as File | null;

      if (!categoryId || !label) return c.json({ error: "categoryId e label são obrigatórios" }, 400);
      if (!pdfFile) return c.json({ error: "Arquivo PDF obrigatório" }, 400);

      const docId   = uid();
      const rawExt  = pdfFile.name.split(".").pop() ?? "pdf";
      const ext     = sanitizeStorageKey(rawExt) || "pdf";
      const pdfPath = `funds/${fundId}/${docId}.${ext}`;

      const arrayBuf = await pdfFile.arrayBuffer();
      const sb       = sbAdmin();
      const { error: upErr } = await sb.storage
        .from(BUCKET)
        .upload(pdfPath, arrayBuf, { contentType: "application/pdf", upsert: false });

      if (upErr) {
        console.log("Upload error:", upErr.message);
        return c.json({ error: `Erro no upload: ${upErr.message}` }, 500);
      }

      const doc: FundDoc = {
        id: docId,
        fundId,
        categoryId,
        label: label.trim(),
        pdfPath,
        pdfName: pdfFile.name,
        createdAt: new Date().toISOString(),
      };

      await kv.set(`empirica-doc:${fundId}:${docId}`, JSON.stringify(doc));

      const pdfUrl = sb.storage.from(BUCKET).getPublicUrl(pdfPath).data.publicUrl;

      return c.json({ doc: { ...doc, pdfUrl } }, 201);
    } catch (e) {
      console.log("Add doc error:", e);
      return c.json({ error: `Erro ao adicionar documento: ${e}` }, 500);
    }
  });

  app.delete("/make-server-57709921/empirica/fundos/:fundId/docs/:docId", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const { fundId, docId } = c.req.param();
      const rawDoc = await kv.get(`empirica-doc:${fundId}:${docId}`);
      if (!rawDoc) return c.json({ error: "Documento não encontrado" }, 404);

      const doc = JSON.parse(rawDoc as string) as FundDoc;
      const sb  = sbAdmin();
      await sb.storage.from(BUCKET).remove([doc.pdfPath]);
      await kv.del(`empirica-doc:${fundId}:${docId}`);
      return c.json({ ok: true });
    } catch (e) {
      return c.json({ error: `Erro ao excluir documento: ${e}` }, 500);
    }
  });

  // ── DOCS — editar label ──────────────────────────────────────────────────────

  app.put("/make-server-57709921/empirica/fundos/:fundId/docs/:docId", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const { fundId, docId } = c.req.param();
      const rawDoc = await kv.get(`empirica-doc:${fundId}:${docId}`);
      if (!rawDoc) return c.json({ error: "Documento não encontrado" }, 404);

      const doc = JSON.parse(rawDoc as string) as FundDoc;
      const body = await c.req.json();

      if (body.label !== undefined) {
        const trimmed = (body.label as string).trim();
        if (!trimmed) return c.json({ error: "Label não pode ser vazio" }, 400);
        doc.label = trimmed;
      }

      await kv.set(`empirica-doc:${fundId}:${docId}`, JSON.stringify(doc));
      const sb = sbAdmin();
      const pdfUrl = doc.pdfPath
        ? sb.storage.from(BUCKET).getPublicUrl(doc.pdfPath).data.publicUrl
        : "";
      return c.json({ doc: { ...doc, pdfUrl } });
    } catch (e) {
      return c.json({ error: `Erro ao atualizar documento: ${e}` }, 500);
    }
  });

  // ── DOCS — reordenar ─────────────────────────────────────────────────────────

  app.put("/make-server-57709921/empirica/fundos/:fundId/docs/reorder", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const fundId = c.req.param("fundId");
      const body   = await c.req.json() as { order: { id: string; sortOrder: number }[] };
      if (!Array.isArray(body.order)) return c.json({ error: "order deve ser um array" }, 400);

      for (const item of body.order) {
        const raw = await kv.get(`empirica-doc:${fundId}:${item.id}`);
        if (!raw) continue;
        const doc = JSON.parse(raw as string) as FundDoc;
        doc.sortOrder = item.sortOrder;
        await kv.set(`empirica-doc:${fundId}:${item.id}`, JSON.stringify(doc));
      }
      return c.json({ ok: true });
    } catch (e) {
      return c.json({ error: `Erro ao reordenar: ${e}` }, 500);
    }
  });

  // ── DOCS públicos por fundo (para páginas de detalhe) ──────────────────────

  app.get("/make-server-57709921/empirica/fundos/:id/docs", async (c) => {
    try {
      const id      = c.req.param("id");
      const rawDocs = await kv.getByPrefix(`empirica-doc:${id}:`);
      const sb      = sbAdmin();
      const docs = rawDocs.map((d: any) => {
        const doc = JSON.parse(d as string) as FundDoc;
        const pdfUrl = doc.pdfPath
          ? sb.storage.from(BUCKET).getPublicUrl(doc.pdfPath).data.publicUrl
          : "";
        return { ...doc, pdfUrl };
      });
      docs.sort((a: any, b: any) => {
        if (a.sortOrder != null && b.sortOrder != null) return a.sortOrder - b.sortOrder;
        if (a.sortOrder != null) return -1;
        if (b.sortOrder != null) return 1;
        return a.createdAt.localeCompare(b.createdAt);
      });
      return c.json({ docs });
    } catch (e) {
      return c.json({ error: `Erro ao listar documentos: ${e}` }, 500);
    }
  });

  // ── COMUNICADOS DO GESTOR ────────────────────────────────────────────────────

  interface GestorItem {
    id: string;
    fundName: string;
    atualizado: string;
    cartaPath?: string;
    cartaName?: string;
    updatePath?: string;
    updateName?: string;
    createdAt: string;
    updatedAt: string;
  }

  function gestorWithUrls(item: GestorItem): GestorItem & { cartaUrl?: string; updateUrl?: string } {
    const sb = sbAdmin();
    const cartaUrl  = item.cartaPath  ? sb.storage.from(BUCKET).getPublicUrl(item.cartaPath).data.publicUrl  : undefined;
    const updateUrl = item.updatePath ? sb.storage.from(BUCKET).getPublicUrl(item.updatePath).data.publicUrl : undefined;
    return { ...item, cartaUrl, updateUrl };
  }

  // GET — público
  app.get("/make-server-57709921/empirica/gestor", async (c) => {
    try {
      const raws = await kv.getByPrefix("empirica-gestor:");
      const items: GestorItem[] = raws.map((v: any) => JSON.parse(v as string));
      items.sort((a, b) => a.fundName.localeCompare(b.fundName, "pt-BR"));
      return c.json({ items: items.map(gestorWithUrls) });
    } catch (e) {
      return c.json({ error: `Erro ao listar comunicados: ${e}` }, 500);
    }
  });

  // POST — criar item (admin)
  app.post("/make-server-57709921/empirica/gestor", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const { fundName, atualizado } = await c.req.json();
      if (!fundName?.trim()) return c.json({ error: "fundName é obrigatório" }, 400);
      const id  = uid();
      const now = new Date().toISOString();
      const item: GestorItem = {
        id, fundName: fundName.trim(),
        atualizado: atualizado?.trim() ?? "",
        createdAt: now, updatedAt: now,
      };
      await kv.set(`empirica-gestor:${id}`, JSON.stringify(item));
      return c.json({ item }, 201);
    } catch (e) {
      return c.json({ error: `Erro ao criar comunicado: ${e}` }, 500);
    }
  });

  // PUT — editar nome/data (admin)
  app.put("/make-server-57709921/empirica/gestor/:id", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-gestor:${id}`);
      if (!raw) return c.json({ error: "Comunicado não encontrado" }, 404);
      const item = JSON.parse(raw as string) as GestorItem;
      const body = await c.req.json();
      const updated: GestorItem = {
        ...item,
        ...(body.fundName   && { fundName: body.fundName.trim() }),
        ...(body.atualizado !== undefined && { atualizado: body.atualizado.trim() }),
        updatedAt: new Date().toISOString(),
      };
      await kv.set(`empirica-gestor:${id}`, JSON.stringify(updated));
      return c.json({ item: gestorWithUrls(updated) });
    } catch (e) {
      return c.json({ error: `Erro ao atualizar comunicado: ${e}` }, 500);
    }
  });

  // POST /:id/carta — upload/substituir Carta do Gestor (admin)
  app.post("/make-server-57709921/empirica/gestor/:id/carta", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      await ensureBucket();
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-gestor:${id}`);
      if (!raw) return c.json({ error: "Comunicado não encontrado" }, 404);
      const item = JSON.parse(raw as string) as GestorItem;

      const form = await c.req.formData();
      const file = form.get("pdf") as File | null;
      if (!file) return c.json({ error: "Arquivo PDF obrigatório" }, 400);

      const sb   = sbAdmin();
      const path = `gestor/${id}/carta.pdf`;

      // remove previous file if exists
      if (item.cartaPath) await sb.storage.from(BUCKET).remove([item.cartaPath]);

      const buf = await file.arrayBuffer();
      const { error: upErr } = await sb.storage
        .from(BUCKET)
        .upload(path, buf, { contentType: "application/pdf", upsert: true });
      if (upErr) return c.json({ error: `Upload error: ${upErr.message}` }, 500);

      const updated: GestorItem = {
        ...item, cartaPath: path, cartaName: file.name, updatedAt: new Date().toISOString(),
      };
      await kv.set(`empirica-gestor:${id}`, JSON.stringify(updated));
      return c.json({ item: gestorWithUrls(updated) });
    } catch (e) {
      return c.json({ error: `Erro ao fazer upload da carta: ${e}` }, 500);
    }
  });

  // POST /:id/update-mensal — upload/substituir Update Mensal (admin)
  app.post("/make-server-57709921/empirica/gestor/:id/update-mensal", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      await ensureBucket();
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-gestor:${id}`);
      if (!raw) return c.json({ error: "Comunicado não encontrado" }, 404);
      const item = JSON.parse(raw as string) as GestorItem;

      const form = await c.req.formData();
      const file = form.get("pdf") as File | null;
      if (!file) return c.json({ error: "Arquivo PDF obrigatório" }, 400);

      const sb   = sbAdmin();
      const path = `gestor/${id}/update-mensal.pdf`;

      if (item.updatePath) await sb.storage.from(BUCKET).remove([item.updatePath]);

      const buf = await file.arrayBuffer();
      const { error: upErr } = await sb.storage
        .from(BUCKET)
        .upload(path, buf, { contentType: "application/pdf", upsert: true });
      if (upErr) return c.json({ error: `Upload error: ${upErr.message}` }, 500);

      const updated: GestorItem = {
        ...item, updatePath: path, updateName: file.name, updatedAt: new Date().toISOString(),
      };
      await kv.set(`empirica-gestor:${id}`, JSON.stringify(updated));
      return c.json({ item: gestorWithUrls(updated) });
    } catch (e) {
      return c.json({ error: `Erro ao fazer upload do update: ${e}` }, 500);
    }
  });

  // DELETE — remover item + PDFs (admin)
  app.delete("/make-server-57709921/empirica/gestor/:id", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-gestor:${id}`);
      if (!raw) return c.json({ error: "Comunicado não encontrado" }, 404);
      const item = JSON.parse(raw as string) as GestorItem;
      const sb   = sbAdmin();
      const paths = [item.cartaPath, item.updatePath].filter(Boolean) as string[];
      if (paths.length > 0) await sb.storage.from(BUCKET).remove(paths);
      await kv.del(`empirica-gestor:${id}`);
      return c.json({ ok: true });
    } catch (e) {
      return c.json({ error: `Erro ao excluir comunicado: ${e}` }, 500);
    }
  });

  // ── Compliance routes ────────────────────────────────────────────────────────

  interface ComplianceDoc {
    id: string;
    nome: string;
    atualizado?: string;
    pdfPath?: string;
    pdfName?: string;
    sortOrder?: number;
    deleted?: boolean;
  }

  function complianceWithUrl(doc: ComplianceDoc): ComplianceDoc & { pdfUrl?: string } {
    if (!doc.pdfPath) return doc;
    const { data: { publicUrl } } = sbAdmin().storage.from(BUCKET).getPublicUrl(doc.pdfPath);
    return { ...doc, pdfUrl: publicUrl };
  }

  // GET — list all compliance docs (public)
  app.get("/make-server-57709921/empirica/compliance", async (c) => {
    try {
      const items = await kv.getByPrefix("empirica-compliance:");
      const parsed = (items ?? [])
        .map(raw => JSON.parse(raw as string) as ComplianceDoc)
        .filter(d => !d.deleted)
        .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
      return c.json({ items: parsed.map(complianceWithUrl) });
    } catch (e) {
      return c.json({ error: `Erro ao listar documentos: ${e}` }, 500);
    }
  });

  // POST — create new compliance item (admin)
  app.post("/make-server-57709921/empirica/compliance", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const body = await c.req.json();
      const { nome, id: bodyId } = body;
      if (!nome) return c.json({ error: "Nome obrigatório" }, 400);

      const id = bodyId || slugify(nome) + "-" + Date.now().toString(36);

      const existing = await kv.get(`empirica-compliance:${id}`);
      if (existing) return c.json({ error: "Item com esse ID já existe" }, 409);

      // count current items for sort order
      const all = await kv.getByPrefix("empirica-compliance:");
      const sortOrder = (all ?? []).length;

      const item: ComplianceDoc = { id, nome, sortOrder };
      await kv.set(`empirica-compliance:${id}`, JSON.stringify(item));
      return c.json({ item });
    } catch (e) {
      return c.json({ error: `Erro ao criar documento: ${e}` }, 500);
    }
  });

  // PUT /:id — update nome / atualizado (admin)
  app.put("/make-server-57709921/empirica/compliance/:id", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-compliance:${id}`);
      const existing: ComplianceDoc = raw
        ? JSON.parse(raw as string)
        : { id, nome: id };
      const body = await c.req.json();
      const updated: ComplianceDoc = {
        ...existing,
        ...(body.nome       !== undefined && { nome: body.nome }),
        ...(body.atualizado !== undefined && { atualizado: body.atualizado }),
      };
      await kv.set(`empirica-compliance:${id}`, JSON.stringify(updated));
      return c.json({ item: complianceWithUrl(updated) });
    } catch (e) {
      return c.json({ error: `Erro ao atualizar documento: ${e}` }, 500);
    }
  });

  // DELETE /:id — delete item + PDF (admin)
  app.delete("/make-server-57709921/empirica/compliance/:id", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-compliance:${id}`);
      if (!raw) return c.json({ error: "Item não encontrado" }, 404);
      const doc = JSON.parse(raw as string) as ComplianceDoc;

      // delete PDF from storage if exists
      if (doc.pdfPath) {
        await sbAdmin().storage.from(BUCKET).remove([doc.pdfPath]);
      }

      await kv.del(`empirica-compliance:${id}`);
      return c.json({ success: true });
    } catch (e) {
      return c.json({ error: `Erro ao excluir item: ${e}` }, 500);
    }
  });

  // POST /:id/pdf — upload/replace PDF (admin)
  app.post("/make-server-57709921/empirica/compliance/:id/pdf", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      await ensureBucket();
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-compliance:${id}`);
      const existing: ComplianceDoc = raw
        ? JSON.parse(raw as string)
        : { id, nome: id };

      const form = await c.req.formData();
      const file = form.get("pdf") as File | null;
      if (!file) return c.json({ error: "Arquivo PDF obrigatório" }, 400);

      const sb   = sbAdmin();
      const path = `compliance/${id}.pdf`;

      if (existing.pdfPath) await sb.storage.from(BUCKET).remove([existing.pdfPath]);

      const buf = await file.arrayBuffer();
      const { error: upErr } = await sb.storage
        .from(BUCKET)
        .upload(path, buf, { contentType: "application/pdf", upsert: true });
      if (upErr) return c.json({ error: `Upload error: ${upErr.message}` }, 500);

      // auto-set date to today dd/mm/aa
      const now  = new Date();
      const day  = String(now.getDate()).padStart(2, "0");
      const mon  = String(now.getMonth() + 1).padStart(2, "0");
      const year = String(now.getFullYear()).slice(2);
      const auto = form.get("atualizado") as string | null;
      const date = auto?.trim() || `${day}/${mon}/${year}`;

      const updated: ComplianceDoc = {
        ...existing, pdfPath: path, pdfName: file.name, atualizado: date,
      };
      await kv.set(`empirica-compliance:${id}`, JSON.stringify(updated));
      return c.json({ item: complianceWithUrl(updated) });
    } catch (e) {
      return c.json({ error: `Erro ao fazer upload do PDF: ${e}` }, 500);
    }
  });

  // ── PDF proxy — serve arquivo do Storage com Content-Disposition seguro ──────
  // GET /pdf/compliance/:id
  app.get("/make-server-57709921/pdf/compliance/:id", async (c) => {
    try {
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-compliance:${id}`);
      if (!raw) return c.json({ error: "Documento não encontrado" }, 404);
      const doc = JSON.parse(raw as string) as ComplianceDoc;
      if (!doc.pdfPath) return c.json({ error: "PDF não disponível" }, 404);
      const { data: { publicUrl } } = sbAdmin().storage.from(BUCKET).getPublicUrl(doc.pdfPath);
      const res = await fetch(publicUrl);
      if (!res.ok) return c.json({ error: `Erro ao buscar PDF: ${res.status}` }, 500);
      const safeFilename = sanitizeStorageKey(doc.pdfName || "document.pdf") || "document.pdf";
      return new Response(res.body, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${safeFilename}"`,
        },
      });
    } catch (e) {
      return c.json({ error: `Erro no proxy: ${e}` }, 500);
    }
  });

  // GET /pdf/doc/:docId  (fund documents — searches by docId across all funds)
  app.get("/make-server-57709921/pdf/doc/:docId", async (c) => {
    try {
      const docId = c.req.param("docId");
      // search for the doc across all fund doc entries
      const allDocs = await kv.getByPrefix("empirica-doc:");
      const match = allDocs.find((raw: any) => {
        try { return (JSON.parse(raw as string) as FundDoc).id === docId; } catch { return false; }
      });
      if (!match) return c.json({ error: "Documento não encontrado" }, 404);
      const doc = JSON.parse(match as string) as FundDoc;
      const { data: { publicUrl } } = sbAdmin().storage.from(BUCKET).getPublicUrl(doc.pdfPath);
      const res = await fetch(publicUrl);
      if (!res.ok) return c.json({ error: `Erro ao buscar PDF: ${res.status}` }, 500);
      const safeFilename = sanitizeStorageKey(doc.pdfName || "document.pdf") || "document.pdf";
      return new Response(res.body, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${safeFilename}"`,
        },
      });
    } catch (e) {
      return c.json({ error: `Erro no proxy: ${e}` }, 500);
    }
  });

  // DELETE /:id/pdf — remove PDF (admin)
  app.delete("/make-server-57709921/empirica/compliance/:id/pdf", async (c) => {
    const userId = await requireAdmin(c);
    if (!userId) return c.json({ error: "Não autorizado" }, 401);
    try {
      const id  = c.req.param("id");
      const raw = await kv.get(`empirica-compliance:${id}`);
      if (!raw) return c.json({ error: "Documento não encontrado" }, 404);
      const doc = JSON.parse(raw as string) as ComplianceDoc;
      if (doc.pdfPath) {
        await sbAdmin().storage.from(BUCKET).remove([doc.pdfPath]);
      }
      const updated: ComplianceDoc = { id: doc.id, nome: doc.nome, atualizado: doc.atualizado };
      delete (updated as any).pdfPath;
      delete (updated as any).pdfName;
      await kv.set(`empirica-compliance:${id}`, JSON.stringify(updated));
      return c.json({ item: updated });
    } catch (e) {
      return c.json({ error: `Erro ao remover PDF: ${e}` }, 500);
    }
  });
}
