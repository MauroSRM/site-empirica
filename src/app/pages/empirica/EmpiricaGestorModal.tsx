import React, { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import { useTheme, DSButton, DSTag } from "../../../design-system";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-57709921`;

interface GestorItem {
  fundName: string;
  atualizado?: string;
  cartaUrl?: string;
  updateUrl?: string;
}

interface Props {
  onClose: () => void;
  /** Quando fornecido, exibe apenas o card cujo fundName contém esse valor (case-insensitive) */
  filterFund?: string;
}

export function EmpiricaGestorModal({ onClose, filterFund }: Props) {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();
  const [items, setItems] = useState<GestorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/empirica/gestor`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.items) setItems(d.items as GestorItem[]);
      })
      .catch(e => console.error("Erro ao carregar comunicados:", e))
      .finally(() => setLoading(false));
  }, []);

  const visibleItems = filterFund
    ? items.filter(i => i.fundName.toLowerCase().includes(filterFund.toLowerCase()))
    : items;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: t.overlayBackdrop,
        backdropFilter: "blur(2px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: t.space6,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: t.surfaceDefault,
          borderRadius: t.radiusXl,
          boxShadow: t.shadowModal,
          width: "100%",
          maxWidth: t.modalWidth,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${t.space5} ${t.space8}`,
          borderBottom: `1px solid ${t.borderDefault}`,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: t.space3 }}>
            <div style={{
              width: 36, height: 36,
              background: t.brandAccentLight,
              borderRadius: t.radiusMd,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Megaphone size={18} color={t.brandAccent} strokeWidth={1.5} />
            </div>
            <span style={{
              fontFamily: t.fontFamily,
              fontSize: t.text24,
              fontWeight: 700,
              color: t.textPrimary,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}>
              Comunicados do Gestor
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: t.radiusMd,
              color: t.textSecondary, flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ overflowY: "auto", padding: t.space8 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: t.space5 }}>
              {Array.from({ length: filterFund ? 1 : 3 }).map((_, i) => (
                <div key={i} style={{ height: 110, borderRadius: t.radiusXl, background: t.surfaceMuted }} />
              ))}
            </div>
          ) : visibleItems.length === 0 ? (
            <p style={{ fontFamily: t.fontFamily, fontSize: t.textMd, color: t.textSecondary, textAlign: "center", padding: `${t.space8} 0` }}>
              Nenhum comunicado disponível no momento.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: t.space5 }}>
              {visibleItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    border: `1px solid ${t.borderDefault}`,
                    borderRadius: t.radiusXl,
                    overflow: "hidden",
                  }}
                >
                  {/* Linha do nome + tag */}
                  <div style={{
                    padding: `${t.space4} ${t.space5} ${t.space3}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: t.space3,
                  }}>
                    <span style={{
                      fontFamily: t.fontFamily,
                      fontSize: t.textXl,
                      fontWeight: 600,
                      color: t.textPrimary,
                      letterSpacing: "-0.01em",
                    }}>
                      {item.fundName}
                    </span>
                    {item.atualizado && (
                      <DSTag variant="neutral" size="md">
                        atualizado {item.atualizado}
                      </DSTag>
                    )}
                  </div>

                  {/* Linha laranja accent */}
                  <div style={{ padding: `0 ${t.space5} ${t.space3}` }}>
                    <div style={{ width: 40, height: 3, background: t.brandAccent, borderRadius: 2 }} />
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: t.borderDefault }} />

                  {/* Botões */}
                  <div style={{ padding: `${t.space4} ${t.space5}`, display: "flex", flexDirection: isMobile ? "column" : "row", gap: t.space3 }}>
                    <DSButton
                      variant="secondary"
                      size="md"
                      fullWidth={isMobile}
                      disabled={!item.cartaUrl}
                      onClick={() => item.cartaUrl && window.open(item.cartaUrl, "_blank")}
                    >
                      Carta do Gestor
                    </DSButton>
                    <DSButton
                      variant="secondary"
                      size="md"
                      fullWidth={isMobile}
                      disabled={!item.updateUrl}
                      onClick={() => item.updateUrl && window.open(item.updateUrl, "_blank")}
                    >
                      Update Mensal
                    </DSButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
