/**
 * EmpiricaPdfViewerPage
 *   /empirica/documento/:docId              → documento de fundo
 *   /empirica/documento/compliance/:docId   → documento de compliance
 *
 * O PDF é baixado pelo proxy do backend e exibido num iframe. A URL que fica na
 * barra do browser é a rota da aplicação: o link pode ser copiado e aberto de
 * qualquer lugar, sem blob: e sem expor o endpoint do Supabase.
 */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-57709921`;
const FONT = "Inter, system-ui, -apple-system, sans-serif";
const NAVY = "#0e2041";
const BLUE = "#1d3f80";

export default function EmpiricaPdfViewerPage() {
  const { docId } = useParams<{ docId: string }>();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isCompliance = location.pathname.includes("/documento/compliance/");

  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [docName, setDocName] = useState("Documento");
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    if (!docId) { setError("Documento não informado."); setLoading(false); return; }

    const url = isCompliance
      ? `${API}/pdf/compliance/${encodeURIComponent(docId)}`
      : `${API}/pdf/doc/${encodeURIComponent(docId)}`;

    fetch(url, { headers: { Authorization: `Bearer ${publicAnonKey}` } })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const cd = r.headers.get("Content-Disposition");
        if (cd) {
          const m = cd.match(/filename="?([^"]+)"?/i);
          if (m?.[1]) setDocName(decodeURIComponent(m[1].replace(/\.[^.]+$/, "")));
        }
        return r.blob();
      })
      .then(b => {
        const u = URL.createObjectURL(new Blob([b], { type: "application/pdf" }));
        blobRef.current = u;
        setBlobUrl(u);
      })
      .catch(e => setError(`Não foi possível carregar o documento. (${e.message})`))
      .finally(() => setLoading(false));

    return () => { if (blobRef.current) { URL.revokeObjectURL(blobRef.current); blobRef.current = null; } };
  }, [docId, isCompliance]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: NAVY, fontFamily: FONT }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 20px", height: 52, flexShrink: 0,
        background: `linear-gradient(148deg, ${BLUE} 0%, ${NAVY} 100%)`,
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.75)", fontSize: 13, fontFamily: FONT, padding: "6px 4px",
          }}
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
        <span style={{
          fontSize: 13, fontWeight: 600, color: "#fff",
          flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {docName}
        </span>
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {loading && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
          }}>
            <Loader2 size={32} style={{ animation: "empirica-spin 1s linear infinite" }} color="#fff" />
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>Carregando documento…</span>
            <style>{`@keyframes empirica-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", textAlign: "center", maxWidth: 340 }}>{error}</span>
            <button
              onClick={() => navigate(-1)}
              style={{
                marginTop: 8, padding: "8px 20px", borderRadius: 6,
                background: BLUE, color: "#fff", border: "none",
                fontSize: 13, fontFamily: FONT, cursor: "pointer",
              }}
            >
              Voltar
            </button>
          </div>
        )}

        {blobUrl && (
          <iframe
            src={blobUrl}
            title={docName}
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          />
        )}
      </div>
    </div>
  );
}
