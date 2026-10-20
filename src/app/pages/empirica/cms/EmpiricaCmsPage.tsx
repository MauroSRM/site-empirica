/**
 * EmpiricaCmsPage — CMS de Gestão de Fundos
 * Rota: /painel-empirica
 * Login: 1:1 com SrmLoginScreen (DS Matriz v04)
 * 100% inline styles — zero Tailwind/className
 */
import React, { useState, useEffect, useRef, useCallback, startTransition } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ALL_FUNDS, FundInfo } from "../data/empirica-funds";
import {
  Lock, Plus, Pencil, Trash2,
  LogOut, FileText, Upload, X, Check,
  ChevronDown, ChevronUp, Download, FolderOpen,
  Megaphone, AlertCircle, Shield, GripVertical,
  UserPlus, Copy, CheckCheck, KeyRound, Users,
  Crown, UserX, RefreshCw,
} from "lucide-react";
import { LogoColor } from "../../../components/SiteLogos";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { DSDestructModal } from "../../../components/ds/DSDestructModal";
import { DSInput } from "../../../components/ds/DSInput";
import { DSDrawer, DSButton, useToast, DSEmptyState, useTheme } from "../../../../design-system";

const ENQUADRAMENTO_LABEL = "Texto Modal Tributação";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-57709921`;

// ── Auth session helpers — lightweight, no Supabase client library ────────────
const SB_AUTH = `https://${projectId}.supabase.co/auth/v1`;
const SESSION_KEY = "empCmsSession";

interface CmsSession { access_token: string; refresh_token: string; expires_at: number }

function saveSession(s: CmsSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("empCmsToken");
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("empCmsToken");
}
function loadSession(): CmsSession | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); }
  catch { return null; }
}

async function getFreshToken(): Promise<string> {
  const session = loadSession();

  if (!session) {
    // Structured session missing — try the raw token as a last resort
    const raw = localStorage.getItem("empCmsToken");
    if (raw) return raw;
    clearSession();
    window.location.replace("/srm-ops/emp-gstf");
    throw new Error("NO_SESSION");
  }

  // Token still valid (>60 s remaining, or no expiry stored)
  if (!session.expires_at || session.expires_at > Date.now() / 1000 + 60) {
    return session.access_token;
  }

  // Token expiring — refresh it
  try {
    const r = await fetch(`${SB_AUTH}/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": publicAnonKey,
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!r.ok) throw new Error(`refresh_failed:${r.status}`);
    const data = await r.json();
    saveSession({ access_token: data.access_token, refresh_token: data.refresh_token, expires_at: data.expires_at });
    return data.access_token;
  } catch {
    // Refresh failed — try the stored raw token as last resort before forcing re-login
    const raw = localStorage.getItem("empCmsToken");
    if (raw && raw === session.access_token) {
      // Same token, it's also expired — force re-login
      clearSession();
      window.location.replace("/srm-ops/emp-gstf");
      throw new Error("SESSION_EXPIRED");
    }
    if (raw) return raw;
    clearSession();
    window.location.replace("/srm-ops/emp-gstf");
    throw new Error("SESSION_EXPIRED");
  }
}

// ── Last-update stamp ─────────────────────────────────────────────────────────
const LAST_UPDATE_KEY = "empCmsLastUpdate";

function recordUpdate(iso?: string) {
  const stamp = iso ?? new Date().toISOString();
  const stored = localStorage.getItem(LAST_UPDATE_KEY);
  if (!stored || stamp > stored) {
    localStorage.setItem(LAST_UPDATE_KEY, stamp);
    window.dispatchEvent(new Event("empCmsUpdated"));
  }
}

function seedFromItems(items: Array<{ updatedAt?: string; createdAt?: string }>) {
  const stamps = items.map(i => i.updatedAt ?? i.createdAt).filter(Boolean) as string[];
  const max = stamps.sort().pop();
  if (max) recordUpdate(max);
}

function formatSP(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  } catch { return ""; }
}

// ── DS Matriz v04 tokens ──────────────────────────────────────────────────────
const T = {
  primary:       "#1d3f80",
  primaryHover:  "#162e6a",
  accent:        "#ff8200",
  bg:            "#f5f7fa",
  surfaceMuted:  "#f0f2f6",
  white:         "#ffffff",
  surfaceSubtle: "#f9fafb",
  gray:          "#6b7280",
  grayLight:     "#9ca3af",
  border:        "#e5e7eb",
  borderMed:     "#d1d5db",
  text:          "#0c0c0c",
  textSec:       "#6b7280",
  error:         "#d30000",
  errorBg:       "#fff0f0",
  success:       "#059669",
  successBg:     "#edfaf4",
  shadowCard:    "0 8px 24px rgba(0,8,30,0.10)",
  shadowModal:   "0 20px 30px rgba(0,8,30,0.3)",
  shadowSm:      "0 1px 3px rgba(0,0,0,0.08)",
  font:          "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  rSm:           "4px",
  rMd:           "6px",
  rLg:           "8px",
  rXl:           "12px",
} as const;

// ── HB Prism icon ─────────────────────────────────────────────────────────────
const HB_PATH =
  "M0.00489387 7.27925V21.8279L12.654 1.36185e-07L0.00489387 7.27925Z" +
  "M0.350909 22.4287L12.9999 29.7031L25.6491 22.4287H0.350909Z" +
  "M13.346 0.00493001L25.9951 21.8328V7.28418L13.346 0.00493001Z";

function HbIcon({ size = 26, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 29.7031 / 26)} viewBox="0 0 26 29.7031" fill="none">
      <path d={HB_PATH} fill={color} />
    </svg>
  );
}

// ── JWT helpers ───────────────────────────────────────────────────────────────
function decodeJwt(token: string): Record<string, any> {
  try {
    return JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch { return {}; }
}

function emailFromToken(token: string): string {
  const p = decodeJwt(token);
  return p.email ?? p.sub ?? "";
}

function isAdminFromToken(token: string): boolean {
  const p = decodeJwt(token);
  return p.app_metadata?.role === "admin";
}

// ── CmsAvatarColaborador — AvatarColaborador adaptado para header escuro ───────
function CmsAvatarColaborador({ email, isAdmin, onLogout }: { email: string; isAdmin: boolean; onLogout: () => void }) {
  const { tokens: t } = useTheme();
  const [open,    setOpen]    = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const displayEmail = email || "admin";
  const roleLabel    = isAdmin ? "Administrador" : "Colaborador";

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={open}
        aria-label="Menu do colaborador"
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "5px 10px", borderRadius: t.radiusLg,
          backgroundColor: hovered || open ? "rgba(255,255,255,0.08)" : "transparent",
          border: `1px solid ${open ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)"}`,
          cursor: "pointer", fontFamily: t.fontFamily,
          transition: "background-color 0.15s, border-color 0.15s",
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: t.radiusFull, flexShrink: 0,
          backgroundColor: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <HbIcon size={14} color="rgba(255,255,255,0.9)" />
        </div>
        <div style={{ textAlign: "left", minWidth: 0, maxWidth: 180 }}>
          <p style={{ fontSize: t.textMd, fontWeight: 600, color: "#fff", margin: 0, lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: t.fontFamily }}>{displayEmail}</p>
          <p style={{ fontSize: t.textSm, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "15px", fontFamily: t.fontFamily }}>{roleLabel}</p>
        </div>
        <ChevronDown
          size={14} color="rgba(255,255,255,0.5)"
          style={{ flexShrink: 0, marginLeft: 2, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
        />
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 200,
          width: 240, backgroundColor: t.surfaceDefault,
          borderRadius: t.radiusLg, border: `1px solid ${t.borderDefault}`,
          boxShadow: t.shadowCard, overflow: "hidden",
        }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${t.borderDefault}` }}>
            <p style={{ fontFamily: t.fontFamily, fontSize: t.textSm, fontWeight: 600, color: t.textPrimary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayEmail}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 4,
                background: isAdmin ? "#eef2ff" : t.surfaceMuted,
                fontFamily: t.fontFamily, fontSize: t.text2Xs, fontWeight: 600,
                color: isAdmin ? T.primary : t.textTertiary,
              }}>
                {isAdmin && <Crown size={10} />}
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            onClick={() => { onLogout(); setOpen(false); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 16px", background: "none", border: "none", cursor: "pointer",
              fontSize: t.textMd, fontFamily: t.fontFamily, color: t.feedbackError,
            }}
          >
            <LogOut size={14} color={t.feedbackError} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
type FundType = "FIDC" | "FIF" | "FII" | "FIP";

interface FundField    { label: string; value: string }
interface FundCategory { id: string; name: string }
interface FundDoc {
  id: string; fundId: string; categoryId: string;
  label: string; pdfPath: string; pdfName: string;
  pdfUrl?: string; createdAt: string; sortOrder?: number;
}
interface Fund {
  id: string; type: FundType; name: string; slug: string;
  fields: FundField[]; categories: FundCategory[];
  createdAt: string; updatedAt: string;
}

const FUND_TYPES: FundType[] = ["FIDC", "FIF", "FII", "FIP"];

// ── Default document categories per fund type ─────────────────────────────────
const CATS_FECHAMENTO = ["Fechamento de Fundo", "Assembleia de Fechamento", "Resultado da Assembleia de Fechamento", "Assembleia de Liquidação", "Principais Dúvidas", "Relatório e Comunicados Mensais"];
const CATS_DOCUMENTOS = ["Assembleias", "Convocações", "Fato Relevante", "Regulamento", "Documentos da Oferta"];
const CATS_LOTUS_FIF  = [...CATS_FECHAMENTO, ...CATS_DOCUMENTOS];

const DEFAULT_CATEGORIES: Record<FundType, string[]> = {
  FIF:  CATS_FECHAMENTO,
  FIDC: CATS_DOCUMENTOS,
  FII:  CATS_DOCUMENTOS,
  FIP:  CATS_DOCUMENTOS,
};

// Lotus FIF funds need both Fechamento + Documentos categories
const LOTUS_FIF_SLUGS = new Set([
  "empirica-lotus-fif-em-cotas-de-fim",
  "empirica-lotus-ipca-fif-em-cotas-de-fim",
]);

// ── API helpers ───────────────────────────────────────────────────────────────
async function apiGet(path: string) {
  return fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${publicAnonKey}` },
  });
}
async function apiAdmin(method: string, path: string, body: FormData | string, _token?: string) {
  let token: string;
  try {
    token = await getFreshToken();
  } catch {
    // Session invalid — return synthetic 401 so callers can handle it cleanly
    return new Response(
      JSON.stringify({ error: "Sessão expirada. Faça login novamente." }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }
  const isJson = typeof body === "string";
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isJson ? { "Content-Type": "application/json" } : {}),
    },
    body: body || undefined,
  });
  if (res.ok && method !== "GET") recordUpdate();
  return res;
}

// ── hooks ─────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

// ── InputRow ─────────────────────────────────────────────────────────────────
function InputRow({ label, type = "text", value, onChange, placeholder, right, required }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  right?: React.ReactNode; required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.gray }}>
        {label}{required && <span style={{ color: T.error }}> *</span>}
      </label>
      <div style={{
        background: T.white, border: `1px solid ${T.border}`,
        borderRadius: T.rLg, height: 48,
        display: "flex", alignItems: "center", padding: "0 13px",
      }}>
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "off"}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontFamily: T.font, fontSize: 13, color: T.text,
          }}
        />
        {right}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN — 1:1 com SrmLoginScreen
// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// INVITE USER MODAL
// ══════════════════════════════════════════════════════════════════════════════
function InviteUserModal({ token, onClose }: { token: string; onClose: () => void }) {
  const [email,   setEmail]   = useState("");
  const [name,    setName]    = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");
  const [copied,  setCopied]  = useState(false);
  const [result,  setResult]  = useState<{ email: string; tempPassword: string; isAdmin: boolean } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/admin/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, name, isAdmin }),
      });
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Erro ao convidar usuário"); return; }
      setResult(data);
    } catch { setErr("Erro de conexão. Tente novamente."); }
    finally { setLoading(false); }
  }

  function copyPassword() {
    if (!result) return;
    navigator.clipboard.writeText(result.tempPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`,
        padding: 28, width: "100%", maxWidth: 420, boxSizing: "border-box",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: T.rLg, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserPlus size={17} color={T.primary} />
            </div>
            <h2 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>
              Convidar usuário
            </h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: T.gray, padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {!result ? (
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DSInput type="text" label="E-mail" placeholder="usuario@empresa.com" value={email} onChange={setEmail} autoComplete="off" state={err ? "error" : "default"} />
            <DSInput type="text" label="Nome (opcional)" placeholder="Nome do colaborador" value={name} onChange={setName} autoComplete="off" />

            {/* Admin toggle */}
            <button
              type="button"
              onClick={() => setIsAdmin(a => !a)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: T.rLg,
                border: `1px solid ${isAdmin ? T.primary : T.border}`,
                background: isAdmin ? "#eef2ff" : T.bg,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Shield size={14} color={isAdmin ? T.primary : T.gray} />
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: isAdmin ? T.primary : T.text, margin: 0 }}>Acesso de Administrador</p>
                  <p style={{ fontFamily: T.font, fontSize: 11, color: T.gray, margin: 0 }}>Pode convidar e gerenciar usuários</p>
                </div>
              </div>
              <div style={{
                width: 36, height: 20, borderRadius: 10, position: "relative",
                background: isAdmin ? T.primary : T.border,
                transition: "background 0.15s", flexShrink: 0,
              }}>
                <div style={{
                  position: "absolute", top: 2,
                  left: isAdmin ? 18 : 2,
                  width: 16, height: 16, borderRadius: "50%",
                  background: T.white,
                  transition: "left 0.15s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </div>
            </button>

            {err && <p style={{ fontFamily: T.font, fontSize: 12, color: T.danger, margin: 0 }}>{err}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <DSButton type="button" variant="ghost" size="sm" fullWidth onClick={onClose}>Cancelar</DSButton>
              <DSButton type="submit" variant="primary" size="sm" fullWidth loading={loading} disabled={!email}>Convidar</DSButton>
            </div>
          </form>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: T.rLg, padding: "12px 14px" }}>
              <p style={{ fontFamily: T.font, fontSize: 13, color: "#15803d", fontWeight: 600, margin: "0 0 4px" }}>
                Usuário criado com sucesso!
              </p>
              <p style={{ fontFamily: T.font, fontSize: 12, color: "#166534", margin: 0 }}>
                Compartilhe as credenciais abaixo com <strong>{result.email}</strong>
                {result.isAdmin && <span style={{ marginLeft: 6, background: "#eef2ff", color: T.primary, borderRadius: 4, padding: "1px 6px", fontSize: 11, fontWeight: 600 }}>Admin</span>}
              </p>
            </div>

            <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.rLg, padding: "12px 14px" }}>
              <p style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.gray, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Senha temporária</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: "0.05em" }}>
                  {result.tempPassword}
                </span>
                <button
                  onClick={copyPassword}
                  style={{ background: "none", border: `1px solid ${T.border}`, borderRadius: T.rMd, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: copied ? "#15803d" : T.gray, fontFamily: T.font, fontSize: 11 }}
                >
                  {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            <p style={{ fontFamily: T.font, fontSize: 12, color: T.gray, margin: 0, lineHeight: 1.5 }}>
              No primeiro acesso, o usuário será solicitado a redefinir a senha.
            </p>

            <DSButton variant="primary" size="sm" fullWidth onClick={onClose}>Fechar</DSButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FORCE PASSWORD CHANGE — primeiro acesso
// ══════════════════════════════════════════════════════════════════════════════
function ForcePasswordChange({ token, onDone }: { token: string; onDone: () => void }) {
  const isMobile = useIsMobile();
  const [newPwd,   setNewPwd]   = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd.length < 8) { setErr("Mínimo 8 caracteres"); return; }
    if (newPwd !== confirm)  { setErr("As senhas não coincidem"); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/admin/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newPassword: newPwd }),
      });
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Erro ao redefinir senha"); return; }
      onDone();
    } catch { setErr("Erro de conexão. Tente novamente."); }
    finally { setLoading(false); }
  }

  const formCard = (
    <div style={{
      background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`,
      padding: isMobile ? "25px" : "33px",
      width: isMobile ? "100%" : 378, boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: T.rXl, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <KeyRound size={22} color={T.accent} />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 6px" }}>
            Redefinir senha
          </h2>
          <p style={{ fontFamily: T.font, fontSize: 13, color: T.gray, margin: 0, lineHeight: 1.5 }}>
            Esse é seu primeiro acesso. Crie uma senha pessoal para continuar.
          </p>
        </div>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DSInput
          type="password"
          label="Nova senha"
          placeholder="Mínimo 8 caracteres"
          value={newPwd}
          onChange={setNewPwd}
          autoComplete="new-password"
          state={err ? "error" : "default"}
        />
        <DSInput
          type="password"
          label="Confirmar senha"
          placeholder="Repita a nova senha"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          errorText={err || undefined}
          state={err ? "error" : "default"}
        />
        <div style={{ marginTop: 8 }}>
          <DSButton type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={!newPwd || !confirm}>
            Salvar e acessar
          </DSButton>
        </div>
      </form>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.white }}>
        <div style={{ background: T.primary, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <HbIcon size={22} />
          <span style={{ fontFamily: T.font, fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.99px", textTransform: "uppercase" }}>Capital em movimento</span>
        </div>
        <div style={{ flex: 1, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 22 }}>
          <LogoColor style={{ height: 24, width: "auto" }} />
          {formCard}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden" }}>
      <div style={{ width: 99, background: T.primary, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 22, position: "relative" }}>
        <HbIcon size={26} />
        <div style={{ position: "absolute", bottom: 150, left: 0, width: 99, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: T.font, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.28)", letterSpacing: "1.2px", textTransform: "uppercase" }}>capital em movimento</span>
          </div>
        </div>
      </div>
      <div style={{ width: 400, background: "#f0f2f6", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 40px" }}>
        <div>
          <h1 style={{ fontFamily: T.font, fontSize: 42, fontWeight: 700, color: T.text, letterSpacing: "-0.8px", margin: "0 0 18px" }}>SRM Empírica</h1>
          <div style={{ width: 48, height: 6, background: T.accent, borderRadius: 9999 }} />
        </div>
      </div>
      <div style={{ flex: 1, background: T.white, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, padding: "24px" }}>
          <LogoColor style={{ height: 29, width: "auto" }} />
          {formCard}
        </div>
        <div style={{ height: 52, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 40px" }}>
          <p style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight, margin: 0 }}>© SRM Empírica. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (token: string, mustChangePassword: boolean) => void }) {
  const isMobile = useIsMobile();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ email, password }),
      });
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Credenciais inválidas"); return; }
      saveSession({ access_token: data.token, refresh_token: data.refreshToken, expires_at: data.expiresAt });
      if (!data.mustChangePassword) localStorage.setItem("empCmsToken", data.token);
      onLogin(data.token, !!data.mustChangePassword);
    } catch { setErr("Erro de conexão. Tente novamente."); }
    finally { setLoading(false); }
  }

  const formCard = (
    <div style={{
      background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`,
      padding: isMobile ? "25px" : "33px",
      width: isMobile ? "100%" : 378, boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
        <h2 style={{
          fontFamily: T.font, fontSize: 22, fontWeight: 600,
          color: T.primary, letterSpacing: "-0.5px", margin: 0, textAlign: "center",
        }}>
          Acessar plataforma
        </h2>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.gray, margin: 0, textAlign: "center" }}>
          Entre com suas credenciais
        </p>
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <DSInput
          type="text"
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          state={err ? "error" : "default"}
        />
        <DSInput
          type="password"
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          errorText={err || undefined}
          state={err ? "error" : "default"}
        />

        <div style={{ marginTop: 8 }}>
          <DSButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!email || !password}
          >
            Acessar
          </DSButton>
        </div>

        <div style={{
          borderTop: `1px solid ${T.border}`, paddingTop: 21, marginTop: 8,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}>
          <Lock size={11} color={T.grayLight} />
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight }}>
            Conexão criptografada
          </span>
        </div>
      </form>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.white }}>
        <div style={{ background: T.primary, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <HbIcon size={22} />
          <span style={{ fontFamily: T.font, fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.99px", textTransform: "uppercase" }}>
            Capital em movimento
          </span>
        </div>
        <div style={{ background: "#eef0f4", padding: "24px 20px 32px" }}>
          <h1 style={{ fontFamily: T.font, fontSize: 26, fontWeight: 700, color: T.text, letterSpacing: "-0.6px", margin: "0 0 8px" }}>
            SRM Empírica
          </h1>
          <div style={{ width: 40, height: 5, background: T.accent, borderRadius: 9999 }} />
        </div>
        <div style={{ flex: 1, padding: "22px 24px", display: "flex", flexDirection: "column", gap: 22 }}>
          <LogoColor style={{ height: 24, width: "auto" }} />
          {formCard}
        </div>
        <div style={{ padding: "16px 40px", borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
          <p style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight, margin: 0 }}>
            © SRM Empírica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden" }}>
      {/* Painel azul */}
      <div style={{
        width: 99, background: T.primary, flexShrink: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingTop: 22, position: "relative",
      }}>
        <HbIcon size={26} />
        <div style={{ position: "absolute", bottom: 150, left: 0, width: 99, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: T.font, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.28)", letterSpacing: "1.2px", textTransform: "uppercase" }}>
              capital em movimento
            </span>
          </div>
        </div>
      </div>

      {/* Painel cinza */}
      <div style={{ width: 400, background: "#f0f2f6", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 40px" }}>
        <div>
          <h1 style={{ fontFamily: T.font, fontSize: 42, fontWeight: 700, color: T.text, letterSpacing: "-0.8px", margin: "0 0 18px" }}>
            SRM Empírica
          </h1>
          <div style={{ width: 48, height: 6, background: T.accent, borderRadius: 9999 }} />
        </div>
      </div>

      {/* Painel branco */}
      <div style={{ flex: 1, background: T.white, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, padding: "24px" }}>
          <LogoColor style={{ height: 29, width: "auto" }} />
          {formCard}
        </div>
        <div style={{ height: 52, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 40px" }}>
          <p style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight, margin: 0 }}>
            © SRM Empírica. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FUND FORM DRAWER — criar / editar fundo
// ══════════════════════════════════════════════════════════════════════════════
function FundFormDrawer({
  fund, token, isOpen, onClose, onSaved,
}: {
  fund?: Fund; token: string; isOpen: boolean;
  onClose: () => void; onSaved: () => void;
}) {
  const isEdit = !!fund;

  // Separa o campo especial "Texto Modal Tributação" dos campos genéricos
  const enquadramentoField = fund?.fields?.find(f => f.label === ENQUADRAMENTO_LABEL);
  const genericFields       = (fund?.fields ?? []).filter(f => f.label !== ENQUADRAMENTO_LABEL);

  const [type,              setType]              = useState<FundType>(fund?.type ?? "FIDC");
  const [name,              setName]              = useState(fund?.name ?? "");
  const [fields,            setFields]            = useState<FundField[]>(genericFields.length > 0 ? genericFields : [{ label: "", value: "" }]);
  const [categories,        setCategories]        = useState<string[]>(fund?.categories?.map(c => c.name) ?? [""]);
  const [enquadramentoText, setEnquadramentoText] = useState(enquadramentoField?.value ?? "");
  const [loading,           setLoading]           = useState(false);
  const [err,               setErr]               = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function addField() { setFields(f => [...f, { label: "", value: "" }]); }
  function removeField(i: number) { setFields(f => f.filter((_, idx) => idx !== i)); }
  function updateField(i: number, key: "label" | "value", val: string) {
    setFields(f => f.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  }

  function addCategory() { setCategories(c => [...c, ""]); }
  function removeCategory(i: number) { setCategories(c => c.filter((_, idx) => idx !== i)); }
  function updateCategory(i: number, val: string) {
    setCategories(c => c.map((item, idx) => idx === i ? val : item));
  }

  async function handleSave() {
    if (!name.trim()) { setErr("Nome do fundo é obrigatório"); return; }
    const validCategories = categories.filter(c => c.trim());
    if (validCategories.length === 0) { setErr("Adicione ao menos uma categoria"); return; }

    setLoading(true); setErr("");
    try {
      const enquadramentoFields = enquadramentoText.trim()
        ? [{ label: ENQUADRAMENTO_LABEL, value: enquadramentoText.trim() }]
        : [];
      const body = {
        type,
        name: name.trim(),
        fields: [...fields.filter(f => f.label.trim() && f.value.trim()), ...enquadramentoFields],
        categories: validCategories.map(n => ({ name: n })),
      };
      const path = isEdit ? `/empirica/fundos/${fund!.id}` : "/empirica/fundos";
      const r    = await apiAdmin(isEdit ? "PUT" : "POST", path, JSON.stringify(body), token);
      const data = await r.json();
      if (!r.ok) {
        if (r.status === 401) {
          setErr("Sessão expirada. Redirecionando para login…");
          setTimeout(() => { clearSession(); window.location.replace("/srm-ops/emp-gstf"); }, 1800);
        } else {
          console.error("Save fund error:", r.status, data);
          setErr(data.error ?? "Erro ao salvar");
        }
        return;
      }
      onSaved();
    } catch (err) {
      console.error("Save fund exception:", err);
      setErr("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  const footer = (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <DSButton
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
        onClick={handleSave}
      >
        {isEdit ? "Salvar alterações" : "Criar fundo"}
      </DSButton>
      <DSButton type="button" variant="secondary" size="lg" fullWidth onClick={onClose} disabled={loading}>
        Cancelar
      </DSButton>
    </div>
  );

  return (
    <DSDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Editar fundo" : "Cadastrar novo fundo"}
      width={580}
      footer={footer}
    >
      <form onSubmit={e => { e.preventDefault(); handleSave(); }} noValidate style={{ display: "flex", flexDirection: "column", gap: 28 }}>

        {/* Seção 1: Identificação */}
        <section>
          <SectionTitle>1. Identificação</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, marginTop: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.gray }}>
                Tipo <span style={{ color: T.error }}>*</span>
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as FundType)}
                style={{ height: 48, padding: "0 12px", border: `1px solid ${T.border}`, borderRadius: T.rLg, fontFamily: T.font, fontSize: 13, color: T.text, background: T.white, outline: "none", cursor: "pointer" }}
              >
                {FUND_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <DSInput
              label="Nome do fundo" value={name} onChange={setName}
              placeholder="Ex: BEFLY FIDC" required
              state={err && !name.trim() ? "error" : "default"}
              errorText={!name.trim() ? err : undefined}
            />
          </div>
        </section>

        {/* Seção 2: Informações do Produto */}
        <section>
          <SectionTitle>2. Informações do Produto</SectionTitle>
          <p style={{ fontFamily: T.font, fontSize: 12, color: T.textSec, margin: "6px 0 14px" }}>
            Campos que aparecem na tabela da página do fundo.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {fields.map((f, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 32px", gap: 8, alignItems: "center" }}>
                <input value={f.label} placeholder="Label (ex: CNPJ)" onChange={e => updateField(i, "label", e.target.value)} style={inputStyle} />
                <input value={f.value} placeholder="Valor" onChange={e => updateField(i, "value", e.target.value)} style={inputStyle} />
                <DSButton type="button" variant="destructive" size="sm" icon="only" iconEl={<X size={13} />} onClick={() => removeField(i)} style={{ flexShrink: 0 }} />
              </div>
            ))}
            <DSButton type="button" variant="ghost" size="sm" icon="left" iconEl={<Plus size={13} />} onClick={addField} style={{ marginTop: 4, width: "fit-content" }}>
              Adicionar campo
            </DSButton>
          </div>
        </section>

        {/* Seção 3: Categorias de documentos */}
        <section>
          <SectionTitle>3. Categorias de Documentos</SectionTitle>
          <p style={{ fontFamily: T.font, fontSize: 12, color: T.textSec, margin: "6px 0 10px" }}>
            Cada categoria vira um accordion na página do fundo.
          </p>
          {/* Preset loaders */}
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" as const }}>
            {([
              ...(fund?.slug && LOTUS_FIF_SLUGS.has(fund.slug) ? [{
                label: "Padrão Lótus FIF (Fechamento + Docs)",
                cats: CATS_LOTUS_FIF,
              }] : []),
              {
                label: "Padrão FIF / Fechamento",
                cats: CATS_FECHAMENTO,
              },
              {
                label: "Padrão Documentos",
                cats: CATS_DOCUMENTOS,
              },
            ] as Array<{ label: string; cats: readonly string[] }>).map(preset => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  const existing = categories.filter(c => c.trim());
                  const toAdd = [...preset.cats].filter(c => !existing.includes(c));
                  const merged = [...existing, ...toAdd];
                  setCategories(merged.length > 0 ? merged : [...preset.cats]);
                }}
                style={{
                  padding: "5px 12px", border: `1px solid ${T.borderMed}`,
                  borderRadius: T.rMd, background: T.surfaceMuted, cursor: "pointer",
                  fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.primary,
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e8eef9"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.surfaceMuted; }}
              >
                + {preset.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categories.map((cat, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 32px", gap: 8, alignItems: "center" }}>
                <input value={cat} placeholder={`Categoria ${i + 1} (ex: Assembleias)`} onChange={e => updateCategory(i, e.target.value)} style={inputStyle} />
                <DSButton type="button" variant="destructive" size="sm" icon="only" iconEl={<X size={13} />} onClick={() => removeCategory(i)} style={{ flexShrink: 0 }} />
              </div>
            ))}
            <DSButton type="button" variant="ghost" size="sm" icon="left" iconEl={<Plus size={13} />} onClick={addCategory} style={{ marginTop: 4, width: "fit-content" }}>
              Adicionar categoria
            </DSButton>
          </div>
        </section>

        {/* Seção 4: Texto Modal Tributação — só aparece se houver campo "Tributação" */}
        {fields.some(f => f.label.toLowerCase().includes("tributa")) && (
          <section>
            <SectionTitle>4. Texto Modal Tributação</SectionTitle>
            <p style={{ fontFamily: T.font, fontSize: 12, color: T.textSec, margin: "6px 0 14px" }}>
              Exibido no modal "Condições de Enquadramento" na página pública do fundo. Deixe em branco para não exibir o botão.
            </p>
            <textarea
              value={enquadramentoText}
              onChange={e => setEnquadramentoText(e.target.value)}
              placeholder="Cole aqui o texto completo das condições de enquadramento tributário..."
              rows={7}
              style={{ ...inputStyle, height: "auto", resize: "vertical" as const, padding: "10px 12px", lineHeight: 1.55, paddingTop: 10 }}
            />
          </section>
        )}

        {err && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <AlertCircle size={12} color={T.error} />
            <p style={{ fontFamily: T.font, fontSize: 11, color: T.error, margin: 0 }}>{err}</p>
          </div>
        )}
      </form>
    </DSDrawer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DOC UPLOAD MODAL
// ══════════════════════════════════════════════════════════════════════════════
function DocUploadModal({
  fund, token, onClose, onSaved, presetCategoryId,
}: {
  fund: Fund; token: string; onClose: () => void; onSaved: () => void;
  presetCategoryId?: string;
}) {
  const [categoryId, setCategoryId] = useState(presetCategoryId ?? fund.categories[0]?.id ?? "");
  const [label,      setLabel]      = useState("");
  const [file,       setFile]       = useState<File | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [err,        setErr]        = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && (dropped.type === "application/pdf" || dropped.name.endsWith(".pdf"))) {
      setFile(dropped);
    } else if (dropped) {
      setErr("Somente arquivos .pdf são aceitos.");
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) { setErr("Nome do botão é obrigatório"); return; }
    if (!file)         { setErr("Selecione um arquivo PDF"); return; }
    if (!categoryId)   { setErr("Selecione uma categoria"); return; }

    setLoading(true); setErr("");
    try {
      const form = new FormData();
      form.append("categoryId", categoryId);
      form.append("label", label.trim());
      form.append("pdf", file);
      const r = await apiAdmin("POST", `/empirica/fundos/${fund.id}/docs`, form, token);
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Erro ao enviar"); return; }
      onSaved();
    } catch { setErr("Erro de conexão."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,8,30,0.6)",
      zIndex: 1000, display: "flex", alignItems: "center",
      justifyContent: "center", padding: "16px",
      backdropFilter: "blur(2px)", fontFamily: T.font,
    }}>
      <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, padding: 32, width: "100%", maxWidth: 500, boxShadow: T.shadowModal }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>
            Adicionar documento
          </h2>
          <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<X size={16} />} onClick={onClose} />
        </div>

        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Categoria */}
          {presetCategoryId ? (
            <DSInput
              label="Categoria / Accordion"
              state="read-only"
              value={fund.categories.find(c => c.id === presetCategoryId)?.name ?? "—"}
              required
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.gray }}>
                Categoria / Accordion <span style={{ color: T.error }}>*</span>
              </label>
              <select
                value={categoryId} onChange={e => setCategoryId(e.target.value)}
                style={{ height: 48, padding: "0 12px", border: `1px solid ${T.border}`, borderRadius: T.rLg, fontFamily: T.font, fontSize: 13, color: T.text, background: T.white, outline: "none", cursor: "pointer" }}
              >
                {fund.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {/* Nome do botão */}
          <DSInput
            label="Nome do botão" value={label} onChange={setLabel}
            placeholder="Ex: Ata de Assembleia 2024" required
          />

          {/* Upload PDF */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: T.font, fontSize: 12, fontWeight: 500, color: T.gray }}>
              Arquivo PDF <span style={{ color: T.error }}>*</span>
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragEnter={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragOver ? T.primary : file ? T.primary : T.borderMed}`,
                borderRadius: T.rLg, padding: "24px 16px", textAlign: "center",
                cursor: "pointer",
                background: isDragOver ? "#e8eef9" : file ? "#f0f4fb" : T.surfaceMuted,
                transition: "all 0.15s",
                transform: isDragOver ? "scale(1.01)" : "scale(1)",
              }}
            >
              <Upload size={18} color={isDragOver ? T.primary : file ? T.primary : T.gray} style={{ margin: "0 auto 8px", display: "block" }} />
              <p style={{ fontFamily: T.font, fontSize: 13, color: isDragOver ? T.primary : file ? T.primary : T.gray, margin: 0, fontWeight: file || isDragOver ? 600 : 400 }}>
                {file ? `✓  ${file.name}` : isDragOver ? "Solte o PDF aqui" : "Clique ou arraste o PDF aqui"}
              </p>
              <p style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight, margin: "4px 0 0" }}>
                Somente arquivos .pdf
              </p>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,application/pdf"
              style={{ display: "none" }}
              onChange={e => { setFile(e.target.files?.[0] ?? null); setErr(""); }} />
          </div>

          {err && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={12} color={T.error} />
              <p style={{ fontFamily: T.font, fontSize: 11, color: T.error, margin: 0 }}>{err}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <DSButton type="button" variant="secondary" size="sm" onClick={onClose}>Cancelar</DSButton>
            <DSButton type="submit" variant="primary" size="sm" loading={loading}>Salvar documento</DSButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FUND DETAIL — docs por categoria
// ══════════════════════════════════════════════════════════════════════════════
function FundDetail({
  fund, token, onBack, onFundUpdated,
}: {
  fund: Fund; token: string; onBack: () => void; onFundUpdated: () => void;
}) {
  const { toast } = useToast();
  const [docs,         setDocs]         = useState<FundDoc[]>([]);
  const [loadingD,     setLoadingD]     = useState(false);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);
  const [deleteDocTarget, setDeleteDocTarget] = useState<FundDoc | null>(null);
  const [docModal,     setDocModal]     = useState<string | null>(null);
  const [editModal,    setEditModal]    = useState(false);
  const [openCats,     setOpenCats]     = useState<Set<string>>(new Set());
  const [dragId,       setDragId]       = useState<string | null>(null);
  const [dragOverId,   setDragOverId]   = useState<string | null>(null);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [savingLabel,  setSavingLabel]  = useState(false);

  const loadDocs = useCallback(async () => {
    setLoadingD(true);
    try {
      const r = await apiGet(`/empirica/fundos/${fund.id}/docs`);
      const d = await r.json();
      if (d.docs) setDocs(d.docs);
    } catch (e) { console.error("Erro ao carregar docs:", e); }
    finally { setLoadingD(false); }
  }, [fund.id]);

  useEffect(() => { loadDocs(); }, [loadDocs]);

  async function confirmDeleteDoc() {
    if (!deleteDocTarget) return;
    setDeletingId(deleteDocTarget.id);
    try {
      const r = await apiAdmin("DELETE", `/empirica/fundos/${fund.id}/docs/${deleteDocTarget.id}`, "", token);
      if (r.ok) {
        setDocs(prev => prev.filter(d => d.id !== deleteDocTarget.id));
        toast.success(`"${deleteDocTarget.label}" excluído com sucesso.`);
      } else {
        const d = await r.json();
        toast.error(d.error ?? "Erro ao excluir documento.");
      }
    } catch { toast.error("Erro de conexão ao excluir."); }
    finally { setDeletingId(null); setDeleteDocTarget(null); }
  }

  function toggleCat(id: string) {
    setOpenCats(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSaveLabel(doc: FundDoc) {
    const trimmed = editingLabel.trim();
    if (!trimmed || trimmed === doc.label) { setEditingDocId(null); return; }
    setSavingLabel(true);
    try {
      const r = await apiAdmin("PUT", `/empirica/fundos/${fund.id}/docs/${doc.id}`, JSON.stringify({ label: trimmed }), token);
      if (r.ok) {
        setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, label: trimmed } : d));
        toast.success("Nome do botão atualizado.");
      } else {
        const d = await r.json();
        toast.error(d.error ?? "Erro ao salvar nome.");
      }
    } catch { toast.error("Erro de conexão."); }
    finally { setSavingLabel(false); setEditingDocId(null); }
  }

  async function handleDrop(catId: string, dropDocId: string) {
    if (!dragId || dragId === dropDocId) { setDragId(null); setDragOverId(null); return; }
    const catDocs = docs.filter(d => d.categoryId === catId);
    const fromIdx = catDocs.findIndex(d => d.id === dragId);
    const toIdx   = catDocs.findIndex(d => d.id === dropDocId);
    if (fromIdx === -1 || toIdx === -1) { setDragId(null); setDragOverId(null); return; }

    // Reorder within category
    const reordered = [...catDocs];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    // Assign sortOrder values
    const withOrder = reordered.map((d, i) => ({ ...d, sortOrder: i }));

    // Optimistic update
    setDocs(prev => {
      const otherDocs = prev.filter(d => d.categoryId !== catId);
      return [...otherDocs, ...withOrder];
    });
    setDragId(null); setDragOverId(null);

    // Persist
    try {
      await apiAdmin("PUT", `/empirica/fundos/${fund.id}/docs/reorder`, JSON.stringify({
        order: withOrder.map(d => ({ id: d.id, sortOrder: d.sortOrder })),
      }), token);
    } catch {
      toast.error("Erro ao salvar ordem dos documentos.");
      loadDocs();
    }
  }

  const typeBadgeColor: Record<FundType, string> = {
    FIDC: "#e8f0fe", FIF: "#e8f4ff", FII: "#eef8ee", FIP: "#fdf4e7",
  };
  const typeBadgeText: Record<FundType, string> = {
    FIDC: "#1a47b8", FIF: "#0369a1", FII: "#166534", FIP: "#b45309",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      {/* sticky sub-header */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, padding: "0 40px", display: "flex", alignItems: "center", gap: 16, height: 56 }}>
        <DSButton type="button" variant="ghost" size="sm" icon="left" iconEl={<svg width={16} height={16} viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} onClick={onBack}>
          Voltar
        </DSButton>
        <div style={{ width: 1, height: 20, background: T.border }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text }}>{fund.name}</span>
          <span style={{ padding: "2px 8px", borderRadius: T.rSm, background: typeBadgeColor[fund.type], color: typeBadgeText[fund.type], fontFamily: T.font, fontSize: 11, fontWeight: 700 }}>
            {fund.type}
          </span>
          {fund.updatedAt && (
            <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight }}>
              atualizado {formatSP(fund.updatedAt)}
            </span>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <DSButton type="button" variant="secondary" size="sm" icon="left" iconEl={<Pencil size={13} />} onClick={() => setEditModal(true)}>
          Editar fundo
        </DSButton>
        <DSButton type="button" variant="primary" size="sm" icon="left" iconEl={<Plus size={13} />} onClick={() => setDocModal("")}>
          Documento
        </DSButton>
      </div>

      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>

          {/* Ficha do fundo */}
          <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, padding: 24, height: "fit-content", boxShadow: T.shadowSm }}>
            <p style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
              Ficha Técnica
            </p>
            {fund.fields.length === 0 ? (
              <p style={{ fontFamily: T.font, fontSize: 12, color: T.grayLight }}>Nenhum campo cadastrado.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {fund.fields.map((f, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < fund.fields.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <p style={{ fontFamily: T.font, fontSize: 10, fontWeight: 600, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>{f.label}</p>
                    <p style={{ fontFamily: T.font, fontSize: 13, color: T.text, margin: 0 }}>{f.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documentos por categoria */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                Documentos: {docs.length} arquivo{docs.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loadingD ? (
              [1, 2].map(i => (
                <div key={i} style={{ height: 52, background: T.white, borderRadius: T.rLg, border: `1px solid ${T.border}` }} />
              ))
            ) : fund.categories.length === 0 ? (
              <div style={{ background: T.white, borderRadius: T.rXl, border: `2px dashed ${T.border}`, padding: "40px 32px", textAlign: "center" }}>
                <FolderOpen size={28} color={T.grayLight} style={{ display: "block", margin: "0 auto 12px" }} />
                <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, margin: "0 0 4px" }}>Nenhuma categoria cadastrada.</p>
                <p style={{ fontFamily: T.font, fontSize: 12, color: T.grayLight, margin: 0 }}>Edite o fundo para adicionar categorias.</p>
              </div>
            ) : (() => {
              // For Lotus FIF funds: group categories into Fechamento / Documentos sections
              const isLotus = LOTUS_FIF_SLUGS.has(fund.slug);
              const fechSet = new Set(CATS_FECHAMENTO);
              const docsSet = new Set(CATS_DOCUMENTOS);

              type Row =
                | { kind: 'header'; label: string }
                | { kind: 'cat'; cat: FundCategory };

              let rows: Row[];
              if (isLotus) {
                const fechCats = fund.categories.filter(c => fechSet.has(c.name));
                const docsCats = fund.categories.filter(c => docsSet.has(c.name));
                const otherCats = fund.categories.filter(c => !fechSet.has(c.name) && !docsSet.has(c.name));
                rows = [
                  ...(fechCats.length > 0 ? [{ kind: 'header' as const, label: 'Fechamento' }, ...fechCats.map(c => ({ kind: 'cat' as const, cat: c }))] : []),
                  ...(docsCats.length > 0 ? [{ kind: 'header' as const, label: 'Documentos' }, ...docsCats.map(c => ({ kind: 'cat' as const, cat: c }))] : []),
                  ...otherCats.map(c => ({ kind: 'cat' as const, cat: c })),
                ];
              } else {
                rows = fund.categories.map(c => ({ kind: 'cat', cat: c }));
              }

              return rows.map((row, rowIdx) => {
                if (row.kind === 'header') {
                  return (
                    <div key={`header-${row.label}`} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      marginTop: rowIdx === 0 ? 0 : 8,
                    }}>
                      <span style={{
                        fontFamily: T.font, fontSize: 10, fontWeight: 700,
                        color: T.textSec, textTransform: "uppercase" as const,
                        letterSpacing: "0.1em",
                      }}>
                        {row.label}
                      </span>
                      <div style={{ flex: 1, height: 1, background: T.border }} />
                    </div>
                  );
                }

                const { cat } = row;
                const catDocs = docs.filter(d => d.categoryId === cat.id);
                const isOpen  = openCats.has(cat.id);
                return (
                  <div key={cat.id} style={{ background: T.white, borderRadius: T.rLg, border: `1px solid ${isOpen ? "#dce8fa" : T.border}`, overflow: "hidden", transition: "border-color 0.15s" }}>
                    {/* accordion header */}
                    <button
                      onClick={() => toggleCat(cat.id)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: isOpen ? "#f7fafd" : "transparent", border: "none", cursor: "pointer", borderBottom: isOpen ? `1px solid #dce8fa` : "none" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 3, height: 16, background: T.accent, borderRadius: 2, flexShrink: 0 }} />
                        <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.text }}>{cat.name}</span>
                        <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight, marginLeft: 4 }}>
                          {catDocs.length} doc{catDocs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {isOpen ? <ChevronUp size={16} color={T.textSec} /> : <ChevronDown size={16} color={T.textSec} />}
                    </button>

                    {/* accordion body */}
                    {isOpen && (
                      <div style={{ padding: "8px 0" }}>
                        {catDocs.length === 0 ? (
                          <p style={{ fontFamily: T.font, fontSize: 12, color: T.grayLight, padding: "12px 20px", margin: 0 }}>
                            Nenhum documento nesta categoria.
                          </p>
                        ) : (
                          catDocs.map(doc => {
                            const isDragging  = dragId === doc.id;
                            const isDragOver  = dragOverId === doc.id;
                            return (
                              <div key={doc.id}
                                draggable={editingDocId !== doc.id}
                                onDragStart={() => setDragId(doc.id)}
                                onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                                onDragOver={e => { e.preventDefault(); setDragOverId(doc.id); }}
                                onDragLeave={() => setDragOverId(null)}
                                onDrop={e => { e.preventDefault(); handleDrop(cat.id, doc.id); }}
                                style={{
                                  display: "flex", alignItems: "center", padding: "10px 20px",
                                  borderBottom: `1px solid ${T.border}`, gap: 12,
                                  opacity: isDragging ? 0.45 : 1,
                                  background: isDragOver ? "#f0f5ff" : "transparent",
                                  borderLeft: isDragOver ? `3px solid ${T.primary}` : "3px solid transparent",
                                  transition: "background 0.12s, border-left 0.12s",
                                  cursor: "grab",
                                }}
                              >
                                <GripVertical size={14} color={T.grayLight} style={{ flexShrink: 0, cursor: editingDocId === doc.id ? "default" : "grab" }} />
                                <FileText size={14} color={T.primary} style={{ flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  {editingDocId === doc.id ? (
                                    <input
                                      autoFocus
                                      value={editingLabel}
                                      onChange={e => setEditingLabel(e.target.value)}
                                      onKeyDown={e => {
                                        if (e.key === "Enter") { e.preventDefault(); handleSaveLabel(doc); }
                                        if (e.key === "Escape") setEditingDocId(null);
                                      }}
                                      style={{
                                        width: "100%", fontFamily: T.font, fontSize: 13, fontWeight: 600,
                                        color: T.primary, border: `1px solid ${T.accent}`,
                                        borderRadius: 4, padding: "2px 6px", outline: "none",
                                        background: "#f7faff", boxSizing: "border-box" as const,
                                      }}
                                    />
                                  ) : (
                                    <p style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.primary, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      {doc.label}
                                    </p>
                                  )}
                                  <p style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {doc.pdfName}
                                  </p>
                                </div>
                                {editingDocId === doc.id ? (
                                  <>
                                    <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Check size={12} />}
                                      onClick={() => handleSaveLabel(doc)} loading={savingLabel}
                                      style={{ color: T.accent, flexShrink: 0 }} />
                                    <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<X size={12} />}
                                      onClick={() => setEditingDocId(null)}
                                      style={{ flexShrink: 0 }} />
                                  </>
                                ) : (
                                  <>
                                    {doc.pdfUrl && (
                                      <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer"
                                        style={{ display: "flex", alignItems: "center", gap: 4, color: T.primary, textDecoration: "none", fontFamily: T.font, fontSize: 11, flexShrink: 0 }}>
                                        <Download size={12} /> Ver PDF
                                      </a>
                                    )}
                                    <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Pencil size={12} />}
                                      onClick={() => { setEditingDocId(doc.id); setEditingLabel(doc.label); }}
                                      style={{ flexShrink: 0 }} />
                                    <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Trash2 size={12} />} onClick={() => setDeleteDocTarget(doc)} disabled={deletingId === doc.id} style={{ border: `1px solid #fecaca`, background: "#fff5f5", color: T.error, flexShrink: 0 }} />
                                  </>
                                )}
                              </div>
                            );
                          })
                        )}
                        {/* add doc inline */}
                        <div style={{ padding: "10px 20px" }}>
                          <DSButton type="button" variant="ghost" size="sm" icon="left" iconEl={<Plus size={13} />} onClick={() => setDocModal(cat.id)}>
                            Adicionar documento aqui
                          </DSButton>
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>

      {docModal !== null && (
        <DocUploadModal
          fund={fund} token={token}
          presetCategoryId={docModal || undefined}
          onClose={() => setDocModal(null)}
          onSaved={() => { setDocModal(null); loadDocs(); toast.success("Documento adicionado com sucesso."); }}
        />
      )}
      <FundFormDrawer
        fund={fund} token={token}
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        onSaved={() => { setEditModal(false); onFundUpdated(); toast.success("Fundo atualizado com sucesso."); }}
      />

      <DSDestructModal
        open={deleteDocTarget !== null}
        title="Excluir documento"
        description={deleteDocTarget ? `Tem certeza que deseja excluir "${deleteDocTarget.label}"? Esta ação não pode ser desfeita.` : ""}
        confirmLabel="Excluir"
        loading={deletingId !== null}
        onConfirm={confirmDeleteDoc}
        onCancel={() => setDeleteDocTarget(null)}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TABLE ROW
// ══════════════════════════════════════════════════════════════════════════════
function FundRow({
  fund, index, isDeleting, onDetail, onEdit, onDelete,
}: {
  fund: Fund; index: number; isDeleting: boolean;
  onDetail: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const [hover, setHover] = useState(false);
  const typeBadgeColor: Record<FundType, string> = {
    FIDC: "#e8f0fe", FIF: "#e8f4ff", FII: "#eef8ee", FIP: "#fdf4e7",
  };
  const typeBadgeText: Record<FundType, string> = {
    FIDC: "#1a47b8", FIF: "#0369a1", FII: "#166534", FIP: "#b45309",
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "40px 1fr 80px 120px 140px",
        padding: "0 20px", borderBottom: `1px solid ${T.border}`,
        background: hover ? T.surfaceSubtle : T.white,
        transition: "background 0.15s", alignItems: "center", minHeight: 56,
      }}
    >
      <div style={{ fontFamily: T.font, fontSize: 12, color: T.grayLight, fontWeight: 500, padding: "0 8px" }}>
        {index}
      </div>
      <button
        onClick={onDetail}
        style={{ padding: "12px 8px", display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ width: 3, height: 20, background: T.accent, borderRadius: 2, flexShrink: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.primary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fund.name}</span>
          {fund.updatedAt && (
            <span style={{ fontFamily: T.font, fontSize: 10, color: T.grayLight }}>
              atualizado {formatSP(fund.updatedAt)}
            </span>
          )}
        </div>
      </button>
      <div style={{ padding: "0 8px" }}>
        <span style={{ padding: "2px 8px", borderRadius: T.rSm, background: typeBadgeColor[fund.type], color: typeBadgeText[fund.type], fontFamily: T.font, fontSize: 11, fontWeight: 700 }}>
          {fund.type}
        </span>
      </div>
      <div style={{ padding: "0 8px" }}>
        <span style={{ fontFamily: T.font, fontSize: 11, color: T.textSec }}>
          {fund.categories.length} categoria{fund.categories.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div style={{ padding: "8px", display: "flex", gap: 6 }}>
        <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<FolderOpen size={13} />} onClick={onDetail} style={{ border: `1px solid ${T.border}`, background: T.white, flexShrink: 0 }} />
        <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Pencil size={13} />} onClick={onEdit} style={{ border: `1px solid ${T.border}`, background: T.white, flexShrink: 0 }} />
        <DSButton type="button" variant="destructive" size="sm" icon="only" iconEl={<Trash2 size={13} />} onClick={onDelete} disabled={isDeleting} style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ── Seed helpers ─────────────────────────────────────────────────────────────

const CAT_MAP: Record<string, FundType> = { fidc: "FIDC", fif: "FIF", fii: "FII", fip: "FIP" };

function fundInfoToFields(f: FundInfo): FundField[] {
  const pairs: [string, string | undefined][] = [
    ["Nome Legal Completo",      f.fullName],
    ["CNPJ",                     f.cnpj],
    ["Regulamentação",           f.regulamentacao],
    ["Gestão",                   f.gestao],
    ["Público-Alvo",             f.publicoAlvo],
    ["Rentabilidade",            f.rentabilidade],
    ["Política de Investimento", f.politicaInvestimento],
    ["Tributação",               f.tributacao],
    ["Taxa de Administração",    f.taxaAdministracao],
    ["Taxa de Performance",      f.taxaPerformance],
    ["Taxa de Carência",         f.taxaCarencia],
    [ENQUADRAMENTO_LABEL,        f.enquadramentoText],
  ];
  return pairs
    .filter(([, v]) => v && v.trim())
    .map(([label, value]) => ({ label, value: value! }));
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════════════════════════════════════════
function AdminPanel({ token, onLogout, onFundDetail }: { token: string; onLogout: () => void; onFundDetail: (fund: Fund) => void }) {
  const { toast } = useToast();
  const [activeType,      setActiveType]      = useState<FundType>("FIDC");
  const [allFunds,        setAllFunds]        = useState<Fund[]>([]);
  const [loading,         setLoading]         = useState(false);
  const [deletingId,      setDeletingId]      = useState<string | null>(null);
  const [deleteTarget,    setDeleteTarget]    = useState<Fund | null>(null);
  const [modal,           setModal]           = useState<{ fund?: Fund } | null>(null);
  const [importing,       setImporting]       = useState(false);
  const [importProgress,  setImportProgress]  = useState<{ done: number; total: number; skipped: number } | null>(null);

  const typeFunds = allFunds.filter(f => f.type === activeType);

  const loadFunds = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiGet("/empirica/fundos");
      const d = await r.json();
      if (d.funds) { setAllFunds(d.funds as Fund[]); seedFromItems(d.funds); }
    } catch (e) { console.error("Erro ao carregar fundos:", e); }
    finally { setLoading(false); }
  }, []);

  async function confirmDeleteFund() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const r = await apiAdmin("DELETE", `/empirica/fundos/${deleteTarget.id}`, "", token);
      if (r.ok) {
        setAllFunds(prev => prev.filter(f => f.id !== deleteTarget.id));
        toast.success(`"${deleteTarget.name}" excluído com sucesso.`);
      } else {
        const d = await r.json();
        toast.error(d.error ?? "Erro ao excluir fundo.");
      }
    } catch { toast.error("Erro de conexão ao excluir."); }
    finally { setDeletingId(null); setDeleteTarget(null); }
  }

  async function handleImport() {
    if (!confirm(`Sincronizar ${ALL_FUNDS.length} fundos do site para o CMS?\n\nFundos novos serão criados com as categorias padrão do tipo. Fundos existentes terão seus campos atualizados; se ainda não tiverem categorias, receberão o padrão do tipo.`)) return;
    setImporting(true);
    setImportProgress({ done: 0, total: ALL_FUNDS.length, skipped: 0 });

    // Always fetch fresh state so we don't work off a stale React snapshot
    let currentFunds: Fund[] = [];
    try {
      const r = await apiGet("/empirica/fundos");
      const d = await r.json();
      currentFunds = (d.funds ?? []) as Fund[];
    } catch (e) {
      console.error("Erro ao buscar fundos antes de sincronizar:", e);
      toast.error("Não foi possível carregar os fundos. Tente novamente.");
      setImporting(false);
      setImportProgress(null);
      return;
    }

    // Remove duplicates: for funds with the same name, keep the one with the most
    // categories (most likely the "real" one) and delete the rest.
    const byName = new Map<string, Fund[]>();
    for (const fund of currentFunds) {
      const key = fund.name.toLowerCase();
      if (!byName.has(key)) byName.set(key, []);
      byName.get(key)!.push(fund);
    }
    for (const [, dupes] of byName) {
      if (dupes.length <= 1) continue;
      dupes.sort((a, b) => b.categories.length - a.categories.length);
      const [, ...toRemove] = dupes;
      for (const dup of toRemove) {
        try {
          await apiAdmin("DELETE", `/empirica/fundos/${dup.id}`, "", token);
          currentFunds = currentFunds.filter(f => f.id !== dup.id);
        } catch (e) {
          console.error("Erro ao remover duplicata:", dup.name, e);
        }
      }
    }

    let skipped = 0;

    for (let i = 0; i < ALL_FUNDS.length; i++) {
      const info     = ALL_FUNDS[i];
      const name     = info.shortName;
      const fundType = CAT_MAP[info.category];
      // Match by slug (most reliable) then fall back to name
      const existingFund = currentFunds.find(
        f => f.slug === info.slug || f.name.toLowerCase() === name.toLowerCase()
      );

      try {
        const newFields = fundInfoToFields(info);

        const isLotus   = LOTUS_FIF_SLUGS.has(info.slug);
        const defaultCats = (isLotus ? CATS_LOTUS_FIF : DEFAULT_CATEGORIES[fundType]).map(n => ({ name: n }));

        if (existingFund) {
          // Preserve existing categories; if none exist yet, seed with type defaults
          const existingCats = existingFund.categories.length > 0
            ? existingFund.categories.map(c => ({ name: c.name }))
            : defaultCats;
          const body = { type: fundType, name, fields: newFields, categories: existingCats };
          await apiAdmin("PUT", `/empirica/fundos/${existingFund.id}`, JSON.stringify(body), token);
          skipped++;
        } else {
          const body = { type: fundType, name, fields: newFields, categories: defaultCats };
          const r = await apiAdmin("POST", "/empirica/fundos", JSON.stringify(body), token);
          if (r.ok) {
            const d = await r.json();
            if (d.fund) {
              currentFunds = [...currentFunds, d.fund]; // keep local snapshot current
            }
          }
        }
      } catch (e) {
        console.error("Erro ao sincronizar fundo:", info.shortName, e);
      }

      setImportProgress({ done: i + 1, total: ALL_FUNDS.length, skipped });
    }

    setImporting(false);
    setImportProgress(null);
    loadFunds();
  }

  useEffect(() => { loadFunds(); }, [loadFunds]);

  return (
    <div style={{ background: T.bg, fontFamily: T.font }}>
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px" }}>
        {/* Pill tabs */}
        <div style={{ display: "flex", gap: 4, background: T.surfaceMuted, padding: 4, borderRadius: T.rXl, width: "fit-content", marginBottom: 32 }}>
          {FUND_TYPES.map(ft => (
            <button key={ft} onClick={() => setActiveType(ft)}
              style={{
                padding: "8px 24px", borderRadius: T.rLg, border: "none",
                background: activeType === ft ? T.white : "transparent",
                boxShadow: activeType === ft ? "0 8px 24px rgba(0,0,0,0.1)" : "none",
                color: activeType === ft ? T.text : T.textSec,
                fontFamily: T.font, fontSize: 13,
                fontWeight: activeType === ft ? 600 : 400,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {ft}
            </button>
          ))}
        </div>

        {/* Import progress banner */}
        {importProgress && (
          <div style={{ background: "#eef3ff", border: `1px solid #c7d7f8`, borderRadius: T.rLg, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.primary, margin: "0 0 4px" }}>
                Sincronizando fundos… {importProgress.done}/{importProgress.total}
              </p>
              <div style={{ height: 4, background: "#c7d7f8", borderRadius: 9999, overflow: "hidden" }}>
                <div style={{ height: "100%", background: T.primary, borderRadius: 9999, width: `${(importProgress.done / importProgress.total) * 100}%`, transition: "width 0.2s" }} />
              </div>
            </div>
            {importProgress.skipped > 0 && (
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.textSec, flexShrink: 0 }}>
                {importProgress.skipped} atualizados
              </span>
            )}
          </div>
        )}

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
          <div>
            <p style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>
              {activeType}
            </p>
            <h2 style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>
              {typeFunds.length} {typeFunds.length === 1 ? "fundo" : "fundos"}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <DSButton type="button" variant="secondary" size="md" icon="left" iconEl={<Download size={13} />} loading={importing} disabled={importing} onClick={handleImport}>
              Sincronizar fundos do site
            </DSButton>
            <DSButton type="button" variant="primary" size="md" icon="left" iconEl={<Plus size={15} />} onClick={() => setModal({})}>
              Novo fundo
            </DSButton>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: 56, background: T.white, borderBottom: `1px solid ${T.border}` }} />)}
          </div>
        ) : typeFunds.length === 0 ? (
          <DSEmptyState
            variant="empty"
            headline={`Nenhum fundo ${activeType} cadastrado.`}
            body={'Clique em "+ Novo fundo" para cadastrar o primeiro fundo, ou importe os fundos do site.'}
          />
        ) : (
          <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, boxShadow: T.shadowCard, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 80px 120px 140px", background: T.surfaceMuted, borderBottom: `1px solid ${T.border}`, padding: "0 20px" }}>
              {["#", "Nome do Fundo", "Tipo", "Categorias", "Ações"].map((h, i) => (
                <div key={i} style={{ padding: "12px 8px", fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                  {h}
                </div>
              ))}
            </div>
            {typeFunds.map((fund, idx) => (
              <FundRow
                key={fund.id}
                fund={fund}
                index={idx + 1}
                isDeleting={deletingId === fund.id}
                onDetail={() => onFundDetail(fund)}
                onEdit={() => setModal({ fund })}
                onDelete={() => setDeleteTarget(fund)}
              />
            ))}
          </div>
        )}
      </main>

      <FundFormDrawer
        key={modal?.fund?.id ?? "new"}
        fund={modal?.fund} token={token}
        isOpen={modal !== null}
        onClose={() => setModal(null)}
        onSaved={() => { setModal(null); loadFunds(); toast.success(modal?.fund ? "Fundo atualizado com sucesso." : "Fundo criado com sucesso."); }}
      />

      <DSDestructModal
        open={deleteTarget !== null}
        title="Excluir fundo"
        description={deleteTarget ? `Tem certeza que deseja excluir "${deleteTarget.name}" e todos os seus documentos? Esta ação não pode ser desfeita.` : ""}
        confirmLabel="Excluir"
        loading={deletingId !== null}
        onConfirm={confirmDeleteFund}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ── LastUpdateChip — auto-updates via empCmsUpdated event ────────────────────
function LastUpdateChip() {
  const [stamp, setStamp] = React.useState<string>(
    () => localStorage.getItem(LAST_UPDATE_KEY) ?? ""
  );
  React.useEffect(() => {
    const handler = () => setStamp(localStorage.getItem(LAST_UPDATE_KEY) ?? "");
    window.addEventListener("empCmsUpdated", handler);
    return () => window.removeEventListener("empCmsUpdated", handler);
  }, []);

  if (!stamp) return null;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 99,
      background: T.surfaceMuted, border: `1px solid ${T.border}`,
      fontFamily: T.font,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.success, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: T.textSec, fontWeight: 500 }}>
        Última atualização:
      </span>
      <span style={{ fontSize: 11, color: T.text, fontWeight: 600 }}>
        {formatSP(stamp)}
      </span>
    </div>
  );
}

// ── HeaderLastUpdate — versão para o header escuro ───────────────────────────
function HeaderLastUpdate() {
  const [stamp, setStamp] = React.useState<string>(
    () => localStorage.getItem(LAST_UPDATE_KEY) ?? ""
  );
  React.useEffect(() => {
    const handler = () => setStamp(localStorage.getItem(LAST_UPDATE_KEY) ?? "");
    window.addEventListener("empCmsUpdated", handler);
    return () => window.removeEventListener("empCmsUpdated", handler);
  }, []);

  if (!stamp) return null;

  return (
    <div style={{ textAlign: "right" }}>
      <p style={{ fontFamily: T.font, fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.35)", margin: 0, lineHeight: 1.4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        Última atualização
      </p>
      <p style={{ fontFamily: T.font, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.4 }}>
        {formatSP(stamp)}
      </p>
    </div>
  );
}

// ── AdminHeader (shared) ──────────────────────────────────────────────────────
function AdminHeader({ token, onLogout }: { token: string; onLogout: () => void }) {
  const email   = React.useMemo(() => emailFromToken(token), [token]);
  const isAdmin = React.useMemo(() => isAdminFromToken(token), [token]);

  const navigate  = useNavigate();
  const { pathname } = useLocation();
  const isGestor     = pathname.includes("/gestor");
  const isCompliance = pathname.includes("/compliance");
  const isUsuarios   = pathname.includes("/usuarios");
  const isFundos     = !isGestor && !isCompliance && !isUsuarios;

  const navBtn = (label: string, icon: React.ReactNode, active: boolean, to: string) => (
    <DSButton
      type="button"
      variant="ghost"
      size="sm"
      theme="dark"
      icon="left"
      iconEl={icon as React.ReactNode}
      onClick={() => startTransition(() => navigate(to))}
      style={{
        backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
        color: active ? "#ffffff" : "rgba(255,255,255,0.65)",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </DSButton>
  );

  return (
    <header style={{ background: T.primary, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, boxShadow: "0 4px 8px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <HbIcon size={22} />
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navBtn("Fundos",      <FolderOpen size={13} />, isFundos,     "/srm-ops/emp-gstf/fundos")}
          {navBtn("Comunicados", <Megaphone  size={13} />, isGestor,     "/srm-ops/emp-gstf/gestor")}
          {navBtn("Compliance",  <Shield     size={13} />, isCompliance, "/srm-ops/emp-gstf/compliance")}
          {isAdmin && navBtn("Usuários", <Users size={13} />, isUsuarios, "/srm-ops/emp-gstf/usuarios")}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <HeaderLastUpdate />
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />
        <CmsAvatarColaborador email={email} isAdmin={isAdmin} onLogout={onLogout} />
      </div>
    </header>
  );
}

// ── shared style helpers ──────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  height: 40, padding: "0 12px",
  border: `1px solid ${T.border}`, borderRadius: T.rLg,
  fontFamily: T.font, fontSize: 13, color: T.text,
  outline: "none", background: T.white, width: "100%", boxSizing: "border-box",
};

const outlineBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "0 16px", height: 40,
  border: `1px solid ${T.border}`, borderRadius: T.rMd,
  background: T.white, fontFamily: T.font, fontSize: 13,
  fontWeight: 500, cursor: "pointer", color: T.textSec,
};

const iconBtn: React.CSSProperties = {
  width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
  border: `1px solid ${T.border}`, borderRadius: T.rMd,
  background: T.white, cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 3, height: 16, background: T.accent, borderRadius: 2 }} />
      <h3 style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.text, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {children}
      </h3>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Login  →  /srm-ops/emp-gstf
// ══════════════════════════════════════════════════════════════════════════════
export default function EmpiricaCmsPage() {
  const navigate = useNavigate();
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const token = localStorage.getItem("empCmsToken");

  useEffect(() => {
    if (token) startTransition(() => navigate("/srm-ops/emp-gstf/fundos", { replace: true }));
  }, [token, navigate]);

  if (token) return null;

  if (pendingToken) {
    return (
      <ForcePasswordChange
        token={pendingToken}
        onDone={() => {
          localStorage.setItem("empCmsToken", pendingToken);
          startTransition(() => navigate("/srm-ops/emp-gstf/fundos", { replace: true }));
        }}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={(t, mustChangePassword) => {
        if (mustChangePassword) {
          setPendingToken(t);
        } else {
          localStorage.setItem("empCmsToken", t);
          startTransition(() => navigate("/srm-ops/emp-gstf/fundos", { replace: true }));
        }
      }}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Lista de Fundos  →  /srm-ops/emp-gstf/fundos
// ══════════════════════════════════════════════════════════════════════════════
export function CmsFundosPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("empCmsToken");

  useEffect(() => {
    if (!token) startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true }));
  }, [token, navigate]);

  if (!token) return null;

  function logout() {
    clearSession();
    startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true }));
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AdminHeader token={token} onLogout={logout} />
      <AdminPanel
        token={token}
        onLogout={logout}
        onFundDetail={(fund) => startTransition(() => navigate(`/srm-ops/emp-gstf/fundos/${fund.id}`))}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Detalhe do Fundo  →  /srm-ops/emp-gstf/fundos/:fundId
// ══════════════════════════════════════════════════════════════════════════════
export function CmsFundDetailPage() {
  const navigate  = useNavigate();
  const { fundId } = useParams<{ fundId: string }>();
  const token = localStorage.getItem("empCmsToken");
  const [fund, setFund] = useState<Fund | null>(null);
  const [err,  setErr]  = useState("");

  useEffect(() => {
    if (!token) { startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true })); return; }
    if (!fundId) return;
    apiGet(`/empirica/fundos/${fundId}`)
      .then(r => r.json())
      .then(d => { if (d.fund) setFund(d.fund); else setErr("Fundo não encontrado."); })
      .catch(() => setErr("Erro ao carregar fundo."));
  }, [fundId, token, navigate]);

  if (!token) return null;

  function logout() {
    clearSession();
    startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true }));
  }

  if (err) return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AdminHeader token={token} onLogout={logout} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 }}>
        <p style={{ fontFamily: T.font, fontSize: 14, color: T.error, margin: 0 }}>{err}</p>
        <DSButton type="button" variant="secondary" size="sm" onClick={() => startTransition(() => navigate("/srm-ops/emp-gstf/fundos"))}>
          Voltar para Fundos
        </DSButton>
      </div>
    </div>
  );

  if (!fund) return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AdminHeader token={token} onLogout={logout} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px", fontFamily: T.font, color: T.textSec, fontSize: 13 }}>
        Carregando…
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AdminHeader token={token} onLogout={logout} />
      <FundDetail
        fund={fund}
        token={token}
        onBack={() => startTransition(() => navigate("/srm-ops/emp-gstf/fundos"))}
        onFundUpdated={() => {
          apiGet(`/empirica/fundos/${fundId}`)
            .then(r => r.json())
            .then(d => { if (d.fund) setFund(d.fund); });
        }}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GESTOR: types + helpers
// ══════════════════════════════════════════════════════════════════════════════
interface GestorItem {
  id: string;
  fundName: string;
  atualizado: string;
  cartaPath?: string;
  cartaName?: string;
  cartaUrl?: string;
  updatePath?: string;
  updateName?: string;
  updateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ── GestorFormModal — criar / editar nome e data ──────────────────────────────
function GestorFormModal({
  item, token, onClose, onSaved,
}: {
  item?: GestorItem; token: string; onClose: () => void; onSaved: (saved: GestorItem) => void;
}) {
  const isEdit = !!item;
  const [fundName,   setFundName]   = useState(item?.fundName ?? "");
  const [atualizado, setAtualizado] = useState(item?.atualizado ?? "");
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!fundName.trim()) { setErr("Nome do fundo é obrigatório"); return; }
    setLoading(true); setErr("");
    try {
      const path = isEdit ? `/empirica/gestor/${item!.id}` : "/empirica/gestor";
      const r    = await apiAdmin(isEdit ? "PUT" : "POST", path, JSON.stringify({ fundName: fundName.trim(), atualizado: atualizado.trim() }), token);
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Erro ao salvar"); return; }
      onSaved(data.item);
    } catch { setErr("Erro de conexão."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,8,30,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", backdropFilter: "blur(2px)", fontFamily: T.font }}>
      <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, padding: 32, width: "100%", maxWidth: 480, boxShadow: T.shadowModal }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>
            {isEdit ? "Editar comunicado" : "Novo comunicado"}
          </h2>
          <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<X size={16} />} onClick={onClose} />
        </div>
        <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DSInput label="Nome do fundo" value={fundName} onChange={setFundName} placeholder="Ex: Empírica Lótus" required state={err && !fundName.trim() ? "error" : "default"} errorText={err && !fundName.trim() ? err : undefined} />
          <DSInput label="Data de atualização" value={atualizado} onChange={setAtualizado} placeholder="Ex: 15/05/26" />
          {err && fundName.trim() && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={12} color={T.error} />
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.error }}>{err}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
            <DSButton type="button" variant="secondary" size="sm" onClick={onClose}>Cancelar</DSButton>
            <DSButton type="submit" variant="primary" size="sm" loading={loading}>{isEdit ? "Salvar" : "Criar"}</DSButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── GestorPdfUploadModal — upload/substituir PDF ──────────────────────────────
function GestorPdfUploadModal({
  item, slot, token, onClose, onSaved,
}: {
  item: GestorItem;
  slot: "carta" | "update-mensal";
  token: string;
  onClose: () => void;
  onSaved: (updated: GestorItem) => void;
}) {
  const label    = slot === "carta" ? "Carta do Gestor" : "Update Mensal";
  const existing = slot === "carta" ? item.cartaName : item.updateName;
  const [file,    setFile]    = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setErr("Selecione um arquivo PDF"); return; }
    setLoading(true); setErr("");
    try {
      const form = new FormData();
      form.append("pdf", file);
      const r    = await apiAdmin("POST", `/empirica/gestor/${item.id}/${slot}`, form, token);
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Erro no upload"); return; }
      onSaved(data.item);
    } catch { setErr("Erro de conexão."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,8,30,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", backdropFilter: "blur(2px)", fontFamily: T.font }}>
      <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, padding: 32, width: "100%", maxWidth: 480, boxShadow: T.shadowModal }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>
            {existing ? "Substituir" : "Enviar"}: {label}
          </h2>
          <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<X size={16} />} onClick={onClose} />
        </div>

        {existing && (
          <div style={{ background: T.surfaceMuted, borderRadius: T.rLg, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={13} color={T.primary} />
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.textSec, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Arquivo atual: <strong style={{ color: T.text }}>{existing}</strong>
            </span>
          </div>
        )}

        <form onSubmit={upload} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${file ? T.primary : T.border}`,
              borderRadius: T.rLg, padding: "24px 20px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              cursor: "pointer", background: file ? "#f0f5ff" : T.white, transition: "all 0.15s",
            }}
          >
            <Upload size={20} color={file ? T.primary : T.grayLight} />
            <span style={{ fontFamily: T.font, fontSize: 13, color: file ? T.primary : T.textSec, fontWeight: file ? 600 : 400 }}>
              {file ? file.name : "Clique para selecionar o PDF"}
            </span>
            {file && (
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight }}>
                {(file.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
          <input
            ref={fileRef} type="file" accept="application/pdf"
            style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); setErr(""); }}
          />
          {err && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={12} color={T.error} />
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.error }}>{err}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
            <DSButton type="button" variant="secondary" size="sm" onClick={onClose}>Cancelar</DSButton>
            <DSButton type="submit" variant="primary" size="sm" loading={loading} disabled={loading || !file}>Enviar PDF</DSButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── GestorCard — row de um comunicado ─────────────────────────────────────────
function GestorCard({
  item, token, onEdit, onDelete, onUpdated,
}: {
  item: GestorItem; token: string;
  onEdit: () => void; onDelete: () => void; onUpdated: (updated: GestorItem) => void;
}) {
  const { toast } = useToast();
  const [uploadSlot, setUploadSlot] = useState<"carta" | "update-mensal" | null>(null);

  const pdfStatus = (label: string, name: string | undefined, url: string | undefined, slot: "carta" | "update-mensal") => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: name ? T.success : T.grayLight, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</span>
        <p style={{ fontFamily: T.font, fontSize: 12, color: name ? T.text : T.grayLight, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          {name ?? "Sem arquivo"}
        </p>
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}`, borderRadius: T.rMd, background: T.white, color: T.primary, textDecoration: "none" }}>
            <Download size={12} />
          </a>
        )}
        <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Upload size={12} />} onClick={() => setUploadSlot(slot)} style={{ border: `1px solid ${T.border}`, background: T.white }} />
      </div>
    </div>
  );

  return (
    <>
      <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, boxShadow: T.shadowSm, overflow: "hidden" }}>
        {/* Header do card */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 3, height: 18, background: T.accent, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color: T.text }}>{item.fundName}</span>
            {item.atualizado && (
              <span style={{ padding: "2px 8px", borderRadius: T.rSm, background: T.surfaceMuted, fontFamily: T.font, fontSize: 11, color: T.textSec }}>
                atualizado {item.atualizado}
              </span>
            )}
            {item.updatedAt && (
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight }}>
                {formatSP(item.updatedAt)}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Pencil size={13} />} onClick={onEdit} style={{ border: `1px solid ${T.border}`, background: T.white }} />
            <DSButton type="button" variant="destructive" size="sm" icon="only" iconEl={<Trash2 size={13} />} onClick={onDelete} />
          </div>
        </div>
        {/* PDFs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          <div style={{ padding: "14px 20px", borderRight: `1px solid ${T.border}` }}>
            {pdfStatus("Carta do Gestor", item.cartaName, item.cartaUrl, "carta")}
          </div>
          <div style={{ padding: "14px 20px" }}>
            {pdfStatus("Update Mensal", item.updateName, item.updateUrl, "update-mensal")}
          </div>
        </div>
      </div>

      {uploadSlot && (
        <GestorPdfUploadModal
          item={item} slot={uploadSlot} token={token}
          onClose={() => setUploadSlot(null)}
          onSaved={(updated) => {
            const slot = uploadSlot;
            setUploadSlot(null);
            onUpdated(updated);
            toast.success(slot === "carta" ? "Carta do Gestor enviada com sucesso." : "Update Mensal enviado com sucesso.");
          }}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Comunicados do Gestor  →  /srm-ops/emp-gstf/gestor
// ══════════════════════════════════════════════════════════════════════════════
export function CmsGestorPage() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("empCmsToken");
  const { toast } = useToast();

  const [items,      setItems]      = useState<GestorItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState<{ item?: GestorItem } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GestorItem | null>(null);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiGet("/empirica/gestor");
      const d = await r.json();
      if (d.items) { setItems(d.items as GestorItem[]); seedFromItems(d.items); }
    } catch (e) { console.error("Erro ao carregar comunicados:", e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!token) { startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true })); return; }
    loadItems();
  }, [token, navigate, loadItems]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      const r = await apiAdmin("DELETE", `/empirica/gestor/${deleteTarget.id}`, "", token!);
      if (r.ok) {
        setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
        toast.success(`"${deleteTarget.fundName}" excluído.`);
      } else {
        const d = await r.json();
        toast.error(d.error ?? "Erro ao excluir.");
      }
    } catch { toast.error("Erro de conexão."); }
    finally { setDeletingId(null); setDeleteTarget(null); }
  }

  function logout() {
    clearSession();
    startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true }));
  }

  if (!token) return null;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AdminHeader token={token} onLogout={logout} />
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
          <div>
            <p style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>
              Comunicados
            </p>
            <h2 style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>
              Comunicados do Gestor
            </h2>
          </div>
          <DSButton type="button" variant="primary" size="md" icon="left" iconEl={<Plus size={15} />} onClick={() => setModal({})}>
            Novo comunicado
          </DSButton>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2].map(i => <div key={i} style={{ height: 96, background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}` }} />)}
          </div>
        ) : items.length === 0 ? (
          <DSEmptyState
            variant="empty"
            headline="Nenhum comunicado cadastrado."
            body='Clique em "+ Novo comunicado" para adicionar o primeiro.'
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map(item => (
              <GestorCard
                key={item.id}
                item={item}
                token={token}
                onEdit={() => setModal({ item })}
                onDelete={() => setDeleteTarget(item)}
                onUpdated={(updated) => setItems(prev => prev.map(i => i.id === updated.id ? updated : i))}
              />
            ))}
          </div>
        )}
      </main>

      {modal !== null && (
        <GestorFormModal
          item={modal.item} token={token}
          onClose={() => setModal(null)}
          onSaved={(saved) => {
            if (modal.item) {
              setItems(prev => prev.map(i => i.id === saved.id ? saved : i));
              toast.success("Comunicado atualizado.");
            } else {
              setItems(prev => [...prev, saved]);
              toast.success("Comunicado criado com sucesso.");
            }
            setModal(null);
          }}
        />
      )}

      <DSDestructModal
        open={deleteTarget !== null}
        title="Excluir comunicado"
        description={deleteTarget ? `Tem certeza que deseja excluir "${deleteTarget.fundName}"? Os PDFs vinculados também serão removidos.` : ""}
        confirmLabel="Excluir"
        loading={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export function CmsGestorPageWrapper() {
  return <CmsGestorPage />;
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPLIANCE: types + data
// ══════════════════════════════════════════════════════════════════════════════

interface ComplianceItem {
  id: string;
  nome: string;
  atualizado?: string;
  pdfPath?: string;
  pdfName?: string;
  pdfUrl?: string;
}

const COMPLIANCE_DOCS: ComplianceItem[] = [
  { id: "formulario-de-referencia",             nome: "Formulário de Referência" },
  { id: "codigo-de-etica",                      nome: "Código de Ética" },
  { id: "manual-de-compliance",                 nome: "Manual de Compliance" },
  { id: "manual-de-controles-internos",         nome: "Manual de Controles Internos" },
  { id: "manual-de-liquidez",                   nome: "Manual de Gerenciamento de Risco de Liquidez" },
  { id: "politica-de-gestao-de-risco",          nome: "Política de Gestão de Risco" },
  { id: "politica-de-negociacao",               nome: "Política de Negociação de Valores Mobiliários" },
  { id: "politica-de-rateio",                   nome: "Política de Rateio e Distribuição de Ordens" },
  { id: "politica-de-exercicio-de-voto",        nome: "Política de Exercício de Voto" },
  { id: "planilha-de-voto",                     nome: "Planilha de Exercício de Voto Consolidada" },
  { id: "politica-de-privacidade",              nome: "Política de Privacidade de Dados" },
  { id: "politica-de-distribuicao",             nome: "Política de Distribuição" },
  { id: "politica-de-remuneracao",              nome: "Política de Remuneração do Distribuidor" },
  { id: "politica-de-investimento-responsavel", nome: "Política de Investimento Responsável" },
];

// ── CompliancePdfModal ────────────────────────────────────────────────────────
function CompliancePdfModal({
  doc, token, onClose, onSaved,
}: {
  doc: ComplianceItem; token: string; onClose: () => void; onSaved: (updated: ComplianceItem) => void;
}) {
  const [file,    setFile]    = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setErr("Selecione um arquivo PDF"); return; }
    setLoading(true); setErr("");
    try {
      const form = new FormData();
      form.append("pdf", file);
      const r    = await apiAdmin("POST", `/empirica/compliance/${doc.id}/pdf`, form, token);
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Erro no upload"); return; }
      onSaved(data.item);
    } catch { setErr("Erro de conexão."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,8,30,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", backdropFilter: "blur(2px)", fontFamily: T.font }}>
      <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, padding: 32, width: "100%", maxWidth: 480, boxShadow: T.shadowModal }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>
            {doc.pdfName ? "Substituir PDF" : "Enviar PDF"}
          </h2>
          <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<X size={16} />} onClick={onClose} />
        </div>

        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, marginBottom: 16, marginTop: 0 }}>
          {doc.nome}
        </p>

        {doc.pdfName && (
          <div style={{ background: T.surfaceMuted, borderRadius: T.rLg, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={13} color={T.primary} />
            <span style={{ fontFamily: T.font, fontSize: 12, color: T.textSec, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Arquivo atual: <strong style={{ color: T.text }}>{doc.pdfName}</strong>
            </span>
          </div>
        )}

        <form onSubmit={upload} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border: `2px dashed ${file ? T.primary : T.border}`, borderRadius: T.rLg, padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", background: file ? "#f0f5ff" : T.white, transition: "all 0.15s" }}
          >
            <Upload size={20} color={file ? T.primary : T.grayLight} />
            <span style={{ fontFamily: T.font, fontSize: 13, color: file ? T.primary : T.textSec, fontWeight: file ? 600 : 400 }}>
              {file ? file.name : "Clique para selecionar o PDF"}
            </span>
            {file && <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight }}>{(file.size / 1024).toFixed(0)} KB</span>}
          </div>
          <input ref={fileRef} type="file" accept="application/pdf" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setErr(""); } }} />

          {err && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <AlertCircle size={12} color={T.error} />
              <span style={{ fontFamily: T.font, fontSize: 11, color: T.error }}>{err}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
            <DSButton type="button" variant="secondary" size="sm" onClick={onClose}>Cancelar</DSButton>
            <DSButton type="submit" variant="primary" size="sm" loading={loading} disabled={loading || !file}>Enviar PDF</DSButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── ComplianceDocRow ──────────────────────────────────────────────────────────
function ComplianceDocRow({
  doc, token, onUpdated, onDeleted,
}: {
  doc: ComplianceItem; token: string;
  onUpdated: (updated: ComplianceItem) => void;
  onDeleted: (id: string) => void;
}) {
  const [uploading,   setUploading]   = useState(false);
  const [editing,     setEditing]     = useState(false);
  const [editName,    setEditName]    = useState(doc.nome);
  const [savingName,  setSavingName]  = useState(false);
  const [deletingPdf, setDeletingPdf] = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(false);
  const [deletingItem,setDeletingItem]= useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  async function saveName() {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === doc.nome) { setEditing(false); return; }
    setSavingName(true);
    try {
      const r = await apiAdmin("PUT", `/empirica/compliance/${doc.id}`, JSON.stringify({ nome: trimmed }), token);
      const d = await r.json();
      if (r.ok) { onUpdated(d.item); toast.success("Nome atualizado."); setEditing(false); }
      else toast.error(d.error ?? "Erro ao salvar nome.");
    } catch { toast.error("Erro de conexão."); }
    finally { setSavingName(false); }
  }

  async function removePdf() {
    if (!doc.pdfName) return;
    setDeletingPdf(true);
    try {
      const r = await apiAdmin("DELETE", `/empirica/compliance/${doc.id}/pdf`, "", token);
      if (r.ok) { const d = await r.json(); onUpdated(d.item); toast.success("PDF removido."); }
      else { const d = await r.json(); toast.error(d.error ?? "Erro ao remover."); }
    } catch { toast.error("Erro de conexão."); }
    finally { setDeletingPdf(false); }
  }

  async function deleteItem() {
    setDeletingItem(true);
    try {
      const r = await apiAdmin("DELETE", `/empirica/compliance/${doc.id}`, "", token);
      if (r.ok) { toast.success(`"${doc.nome}" removido.`); onDeleted(doc.id); }
      else { const d = await r.json(); toast.error(d.error ?? "Erro ao excluir."); }
    } catch { toast.error("Erro de conexão."); }
    finally { setDeletingItem(false); setConfirmDel(false); }
  }

  return (
    <>
      <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, boxShadow: T.shadowSm, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
          <div style={{ width: 3, height: 16, background: doc.pdfName ? T.accent : T.border, borderRadius: 2, flexShrink: 0 }} />

          {editing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
              <input
                ref={inputRef}
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") { setEditName(doc.nome); setEditing(false); } }}
                style={{ flex: 1, height: 32, padding: "0 10px", border: `1px solid ${T.primary}`, borderRadius: T.rMd, fontFamily: T.font, fontSize: 13, color: T.text, outline: "none", background: T.white, minWidth: 0 }}
              />
              <DSButton type="button" variant="primary" size="sm" loading={savingName} onClick={saveName} icon="only" iconEl={<Check size={13} />} />
              <DSButton type="button" variant="ghost" size="sm" onClick={() => { setEditName(doc.nome); setEditing(false); }} icon="only" iconEl={<X size={13} />} style={{ border: `1px solid ${T.border}` }} />
            </div>
          ) : (
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {doc.nome}
              </p>
              {doc.pdfName ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                  <FileText size={11} color={T.primary} />
                  <span style={{ fontFamily: T.font, fontSize: 11, color: T.textSec, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.pdfName}</span>
                  {doc.atualizado && (
                    <span style={{ padding: "1px 7px", borderRadius: T.rSm, background: T.surfaceMuted, fontFamily: T.font, fontSize: 11, color: T.textSec, flexShrink: 0 }}>
                      {doc.atualizado}
                    </span>
                  )}
                </div>
              ) : (
                <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight }}>Sem PDF</span>
              )}
            </div>
          )}
        </div>

        {!editing && (
          <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Pencil size={13} />} onClick={() => { setEditName(doc.nome); setEditing(true); }} style={{ border: `1px solid ${T.border}`, background: T.white }} />
            {doc.pdfUrl && (
              <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ ...iconBtn, color: T.primary, textDecoration: "none" }}>
                <Download size={13} />
              </a>
            )}
            <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Upload size={13} />} onClick={() => setUploading(true)} style={{ border: `1px solid ${T.border}`, background: T.white }} />
            {doc.pdfName && (
              <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<Trash2 size={13} />} onClick={removePdf} disabled={deletingPdf} style={{ border: `1px solid ${T.border}`, background: T.white, color: T.textSec }} />
            )}
            <div style={{ width: 1, height: 28, background: T.border, margin: "0 2px" }} />
            <DSButton type="button" variant="destructive" size="sm" icon="only" iconEl={<Trash2 size={13} />} onClick={() => setConfirmDel(true)} />
          </div>
        )}
      </div>

      {uploading && (
        <CompliancePdfModal
          doc={doc} token={token}
          onClose={() => setUploading(false)}
          onSaved={(updated) => { setUploading(false); onUpdated(updated); }}
        />
      )}

      <DSDestructModal
        open={confirmDel}
        title="Excluir documento"
        description={`Tem certeza que deseja excluir "${doc.nome}"?${doc.pdfName ? " O PDF associado também será removido." : ""}`}
        confirmLabel="Excluir"
        loading={deletingItem}
        onConfirm={deleteItem}
        onCancel={() => setConfirmDel(false)}
      />
    </>
  );
}

// ── AddComplianceModal ────────────────────────────────────────────────────────
function AddComplianceModal({ token, onAdded, onClose }: {
  token: string;
  onAdded: (item: ComplianceItem) => void;
  onClose: () => void;
}) {
  const [nome,    setNome]    = useState("");
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");
  const { toast } = useToast();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nome.trim();
    if (!trimmed) return;
    setLoading(true); setErr("");
    try {
      const r = await apiAdmin("POST", "/empirica/compliance", JSON.stringify({ nome: trimmed }), token);
      const d = await r.json();
      if (!r.ok) { setErr(d.error ?? "Erro ao criar item."); return; }
      onAdded(d.item);
      toast.success(`"${trimmed}" adicionado.`);
      onClose();
    } catch { setErr("Erro de conexão."); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,8,30,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(2px)" }}>
      <div style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, padding: 28, width: "100%", maxWidth: 420, boxShadow: T.shadowModal, fontFamily: T.font }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.text, margin: 0 }}>Novo documento</h2>
          <DSButton type="button" variant="ghost" size="sm" icon="only" iconEl={<X size={16} />} onClick={onClose} />
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DSInput type="text" label="Nome do documento" placeholder="ex: Política de Continuidade de Negócios" value={nome} onChange={setNome} autoComplete="off" state={err ? "error" : "default"} />
          {err && <p style={{ fontFamily: T.font, fontSize: 12, color: T.danger, margin: 0 }}>{err}</p>}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <DSButton type="button" variant="ghost" size="sm" fullWidth onClick={onClose}>Cancelar</DSButton>
            <DSButton type="submit" variant="primary" size="sm" fullWidth loading={loading} disabled={!nome.trim()}>Adicionar</DSButton>
          </div>
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Compliance  →  /srm-ops/emp-gstf/compliance
// ══════════════════════════════════════════════════════════════════════════════
export function CmsCompliancePage() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("empCmsToken");
  const { toast } = useToast();

  const [items,    setItems]    = useState<ComplianceItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [addOpen,  setAddOpen]  = useState(false);
  const [seeding,  setSeeding]  = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const r = await apiGet("/empirica/compliance");
      const d = await r.json();
      const loaded: ComplianceItem[] = d.items ?? [];

      // Auto-seed defaults on first load if KV is empty
      if (loaded.length === 0 && token) {
        setSeeding(true);
        await Promise.all(
          COMPLIANCE_DOCS.map((doc, idx) =>
            apiAdmin("POST", "/empirica/compliance", JSON.stringify({ id: doc.id, nome: doc.nome }), token)
          )
        );
        setSeeding(false);
        const r2 = await apiGet("/empirica/compliance");
        const d2 = await r2.json();
        setItems(d2.items ?? []);
      } else {
        setItems(loaded);
      }
    } catch (e) { console.error("Erro ao carregar compliance:", e); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (!token) { startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true })); return; }
    loadItems();
  }, [token, navigate, loadItems]);

  function logout() {
    clearSession();
    startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true }));
  }

  if (!token) return null;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AdminHeader token={token} onLogout={logout} />
      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px" }}>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
          <div>
            <p style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>
              Regulatório
            </p>
            <h2 style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.02em" }}>
              Documentos de Compliance
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <p style={{ fontFamily: T.font, fontSize: 12, color: T.textSec, margin: 0 }}>
              {items.filter(d => d.pdfName).length}/{items.length} com PDF
            </p>
            <DSButton
              variant="primary" size="sm" icon="left" iconEl={<Plus size={13} />}
              onClick={() => setAddOpen(true)}
            >
              Novo documento
            </DSButton>
          </div>
        </div>

        {(loading || seeding) ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Array.from({ length: seeding ? COMPLIANCE_DOCS.length : 6 }).map((_, i) => (
              <div key={i} style={{ height: 58, background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, opacity: 0.5 }} />
            ))}
            {seeding && (
              <p style={{ fontFamily: T.font, fontSize: 12, color: T.textSec, textAlign: "center", margin: "8px 0 0" }}>
                Inicializando lista de documentos…
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map(doc => (
              <ComplianceDocRow
                key={doc.id}
                doc={doc}
                token={token}
                onUpdated={(updated) => {
                  setItems(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d));
                }}
                onDeleted={(id) => {
                  setItems(prev => prev.filter(d => d.id !== id));
                }}
              />
            ))}
            {items.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: T.gray }}>
                <p style={{ fontFamily: T.font, fontSize: 14, margin: "0 0 12px" }}>Nenhum documento cadastrado.</p>
                <DSButton variant="primary" size="sm" icon="left" iconEl={<Plus size={13} />} onClick={() => setAddOpen(true)}>
                  Adicionar primeiro documento
                </DSButton>
              </div>
            )}
          </div>
        )}
      </main>

      {addOpen && (
        <AddComplianceModal
          token={token}
          onAdded={(item) => setItems(prev => [...prev, item])}
          onClose={() => setAddOpen(false)}
        />
      )}
    </div>
  );
}

export function CmsCompliancePageWrapper() {
  return <CmsCompliancePage />;
}

// ══════════════════════════════════════════════════════════════════════════════
// PAGE: Usuários  →  /srm-ops/emp-gstf/usuarios
// ══════════════════════════════════════════════════════════════════════════════

interface CmsUser {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "colaborador";
  lastSignIn: string | null;
  createdAt: string;
  mustChangePassword: boolean;
}

function userInitials(user: CmsUser): string {
  if (user.name) {
    return user.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  }
  return (user.email[0] ?? "?").toUpperCase();
}

function formatRelative(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2)   return "agora";
  if (mins < 60)  return `${mins}min atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h atrás`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d atrás`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function CmsUsuariosPage() {
  const navigate = useNavigate();
  const token    = localStorage.getItem("empCmsToken");
  const { toast } = useToast();

  const [users,       setUsers]       = useState<CmsUser[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [inviteOpen,  setInviteOpen]  = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CmsUser | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const currentUserId = React.useMemo(() => {
    if (!token) return "";
    try { return decodeJwt(token).sub ?? ""; } catch { return ""; }
  }, [token]);

  const isAdmin = React.useMemo(() => token ? isAdminFromToken(token) : false, [token]);

  async function loadUsers() {
    if (!token) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (r.ok) setUsers(d.users ?? []);
      else toast.error(d.error ?? "Erro ao carregar usuários");
    } catch { toast.error("Erro de conexão."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (!token || !isAdmin) { startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true })); return; }
    loadUsers();
  }, [token, isAdmin, navigate]);

  async function toggleRole(user: CmsUser) {
    const newRole = user.role === "admin" ? "colaborador" : "admin";
    setActionLoading(user.id);
    try {
      const r = await fetch(`${API}/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      const d = await r.json();
      if (r.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        toast.success(newRole === "admin" ? "Promovido a Admin." : "Rebaixado a Colaborador.");
      } else {
        toast.error(d.error ?? "Erro ao alterar role.");
      }
    } catch { toast.error("Erro de conexão."); }
    finally { setActionLoading(null); }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      const r = await fetch(`${API}/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (r.ok) {
        setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
        toast.success("Usuário removido.");
      } else {
        toast.error(d.error ?? "Erro ao remover usuário.");
      }
    } catch { toast.error("Erro de conexão."); }
    finally { setActionLoading(null); setDeleteTarget(null); }
  }

  function logout() {
    clearSession();
    startTransition(() => navigate("/srm-ops/emp-gstf", { replace: true }));
  }

  if (!token || !isAdmin) return null;

  const admins      = users.filter(u => u.role === "admin");
  const colaboradores = users.filter(u => u.role === "colaborador");

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.font }}>
      <AdminHeader token={token} onLogout={logout} />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Gestão de Usuários</h1>
            <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, margin: 0 }}>
              {loading ? "Carregando…" : `${users.length} usuário${users.length !== 1 ? "s" : ""} no sistema`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <DSButton variant="ghost" size="sm" icon="left" iconEl={<RefreshCw size={13} />} onClick={loadUsers} disabled={loading}>
              Atualizar
            </DSButton>
            <DSButton variant="primary" size="sm" icon="left" iconEl={<UserPlus size={13} />} onClick={() => setInviteOpen(true)}>
              Convidar
            </DSButton>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`, padding: "16px 20px", height: 64, opacity: 0.5 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Admins */}
            {admins.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Crown size={13} color={T.accent} />
                  <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Administradores · {admins.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {admins.map(u => (
                    <UserRow
                      key={u.id}
                      user={u}
                      isSelf={u.id === currentUserId}
                      actionLoading={actionLoading === u.id}
                      onToggleRole={() => toggleRole(u)}
                      onDelete={() => setDeleteTarget(u)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Colaboradores */}
            {colaboradores.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Users size={13} color={T.textSec} />
                  <span style={{ fontFamily: T.font, fontSize: 11, fontWeight: 700, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Colaboradores · {colaboradores.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {colaboradores.map(u => (
                    <UserRow
                      key={u.id}
                      user={u}
                      isSelf={u.id === currentUserId}
                      actionLoading={actionLoading === u.id}
                      onToggleRole={() => toggleRole(u)}
                      onDelete={() => setDeleteTarget(u)}
                    />
                  ))}
                </div>
              </div>
            )}

            {users.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 0", color: T.gray }}>
                <Users size={32} color={T.border} style={{ marginBottom: 12 }} />
                <p style={{ fontFamily: T.font, fontSize: 14, margin: 0 }}>Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        )}
      </main>

      {inviteOpen && (
        <InviteUserModal
          token={token}
          onClose={() => { setInviteOpen(false); loadUsers(); }}
        />
      )}

      <DSDestructModal
        open={!!deleteTarget}
        title="Remover usuário"
        description={`Tem certeza que deseja remover ${deleteTarget?.email ?? ""}? O acesso será revogado imediatamente.`}
        confirmLabel="Remover"
        loading={actionLoading === deleteTarget?.id}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function UserRow({
  user, isSelf, actionLoading, onToggleRole, onDelete,
}: {
  user: CmsUser;
  isSelf: boolean;
  actionLoading: boolean;
  onToggleRole: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const initials = userInitials(user);
  const avatarBg = user.role === "admin" ? "#eef2ff" : T.surfaceMuted;
  const avatarColor = user.role === "admin" ? T.primary : T.textSec;

  return (
    <div style={{
      background: T.white, borderRadius: T.rXl, border: `1px solid ${T.border}`,
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
      transition: "box-shadow 0.15s",
    }}>
      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: T.radiusFull ?? "50%", flexShrink: 0,
        background: avatarBg, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.font, fontSize: 13, fontWeight: 700, color: avatarColor,
      }}>
        {initials}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {user.name ?? user.email}
          </span>
          {user.role === "admin" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", borderRadius: 4, background: "#eef2ff", fontFamily: T.font, fontSize: 11, fontWeight: 600, color: T.primary, flexShrink: 0 }}>
              <Crown size={10} /> Admin
            </span>
          )}
          {isSelf && (
            <span style={{ padding: "1px 7px", borderRadius: 4, background: T.surfaceMuted, fontFamily: T.font, fontSize: 11, color: T.gray, flexShrink: 0 }}>você</span>
          )}
          {user.mustChangePassword && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 7px", borderRadius: 4, background: "#fef9c3", fontFamily: T.font, fontSize: 11, fontWeight: 500, color: "#854d0e", flexShrink: 0 }}>
              <KeyRound size={10} /> Senha pendente
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 2 }}>
          {user.name && (
            <span style={{ fontFamily: T.font, fontSize: 11, color: T.gray }}>{user.email}</span>
          )}
          <span style={{ fontFamily: T.font, fontSize: 11, color: T.grayLight }}>
            último acesso: {formatRelative(user.lastSignIn)}
          </span>
        </div>
      </div>

      {/* Actions — disabled for self */}
      {!isSelf && (
        <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              background: "none", border: `1px solid ${T.border}`, borderRadius: T.rMd,
              padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
              fontFamily: T.font, fontSize: 12, color: T.textSec, transition: "all 0.12s",
            }}
          >
            Ações <ChevronDown size={12} style={{ transform: menuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 200,
              background: T.white, border: `1px solid ${T.border}`, borderRadius: T.rLg,
              boxShadow: T.shadowModal, minWidth: 180, overflow: "hidden",
            }}>
              <button
                onClick={() => { setMenuOpen(false); onToggleRole(); }}
                disabled={actionLoading}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "9px 14px", background: "none", border: "none", cursor: "pointer",
                  fontFamily: T.font, fontSize: 13, color: T.text, textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bg)}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <Crown size={13} color={T.primary} />
                {user.role === "admin" ? "Rebaixar para Colaborador" : "Promover a Admin"}
              </button>
              <div style={{ height: 1, background: T.border }} />
              <button
                onClick={() => { setMenuOpen(false); onDelete(); }}
                disabled={actionLoading}
                style={{
                  display: "flex", alignItems: "center", gap: 8, width: "100%",
                  padding: "9px 14px", background: "none", border: "none", cursor: "pointer",
                  fontFamily: T.font, fontSize: 13, color: T.danger, textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <UserX size={13} />
                Remover acesso
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CmsUsuariosPageWrapper() {
  return <CmsUsuariosPage />;
}
