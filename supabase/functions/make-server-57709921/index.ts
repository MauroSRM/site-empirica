import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";
import { registerEmpricaCmsRoutes } from "./empirica-cms.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const BUCKET = "srm-pdfs";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Health check
app.get("/make-server-57709921/health", (c) => {
  return c.json({ status: "ok" });
});

/**
 * GET /make-server-57709921/pdfs?path=FIDC/BEFLY%20FIDC/Assembleias
 * Lista todos os arquivos em um caminho do bucket srm-pdfs.
 * Retorna array de { name, url } com URLs públicas.
 */
app.get("/make-server-57709921/pdfs", async (c) => {
  const path = c.req.query("path") ?? "";
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(path, { limit: 200, sortBy: { column: "name", order: "asc" } });

  if (error) {
    console.log(`Error listing pdfs at path "${path}": ${error.message}`);
    return c.json({ error: `Erro ao listar arquivos: ${error.message}` }, 500);
  }

  // Filtra apenas arquivos (não pastas)
  const files = (data ?? []).filter((item) => item.id !== null);

  const result = files.map((file) => {
    const filePath = path ? `${path}/${file.name}` : file.name;
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);
    return {
      name: file.name,
      url: urlData.publicUrl,
      path: filePath,
    };
  });

  return c.json({ files: result });
});

/**
 * GET /make-server-57709921/pdfs/fund?category=FIDC&folder=BEFLY%20FIDC&section=Assembleias
 * Atalho para buscar documentos de um fundo/seção específica.
 */
app.get("/make-server-57709921/pdfs/fund", async (c) => {
  const category = c.req.query("category") ?? "";
  const folder   = c.req.query("folder") ?? "";
  const section  = c.req.query("section") ?? "";

  if (!category || !folder || !section) {
    return c.json({ error: "Parâmetros obrigatórios: category, folder, section" }, 400);
  }

  const path = `${category}/${folder}/${section}`;
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(path, { limit: 200, sortBy: { column: "name", order: "asc" } });

  if (error) {
    console.log(`Error listing fund docs at "${path}": ${error.message}`);
    return c.json({ error: `Erro ao listar documentos: ${error.message}` }, 500);
  }

  const files = (data ?? []).filter((item) => item.id !== null);

  const result = files.map((file) => {
    const filePath = `${path}/${file.name}`;
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);
    return {
      name: file.name,
      url: urlData.publicUrl,
      path: filePath,
    };
  });

  return c.json({ files: result });
});

/**
 * GET /make-server-57709921/pdfs/compliance
 * Lista todos os documentos de compliance.
 */
app.get("/make-server-57709921/pdfs/compliance", async (c) => {
  const supabase = getSupabase();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("Compliance", { limit: 200, sortBy: { column: "name", order: "asc" } });

  if (error) {
    console.log(`Error listing compliance docs: ${error.message}`);
    return c.json({ error: `Erro ao listar compliance: ${error.message}` }, 500);
  }

  const files = (data ?? []).filter((item) => item.id !== null);

  const result = files.map((file) => {
    const filePath = `Compliance/${file.name}`;
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath);
    return {
      name: file.name,
      url: urlData.publicUrl,
      path: filePath,
    };
  });

  return c.json({ files: result });
});

registerEmpricaCmsRoutes(app);

Deno.serve(app.fetch);
