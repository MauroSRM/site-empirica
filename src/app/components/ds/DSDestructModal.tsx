/**
 * DSDestructModal — DS Matriz v04
 * Spec: seção 4.16 DSModal variant="destructive"
 * Ícone: AlertOctagon (obrigatório — NÃO usar AlertTriangle)
 */
import React, { useEffect, useRef } from "react";
import { AlertOctagon, X } from "lucide-react";
import { useTheme, hexToRgba } from "../../../design-system";

export interface DSDestructModalProps {
  open:          boolean;
  title?:        string;
  description?:  string;
  confirmLabel?: string;
  cancelLabel?:  string;
  loading?:      boolean;
  onConfirm:     () => void;
  onCancel:      () => void;
}

export function DSDestructModal({
  open, title = "Confirmar exclusão",
  description = "Esta ação não pode ser desfeita.",
  confirmLabel = "Excluir", cancelLabel = "Cancelar",
  loading = false, onConfirm, onCancel,
}: DSDestructModalProps) {
  const { tokens: t } = useTheme();
  const firstFocusable = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    firstFocusable.current?.focus();
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onCancel(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: t.overlayBackdrop, backdropFilter: t.overlayBlurModal,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: t.fontFamily,
      }}
    >
      <div
        role="dialog" aria-modal="true" aria-labelledby="ds-destruct-title"
        style={{
          background: t.surfaceDefault, borderRadius: t.radiusXl,
          border: `1px solid ${t.borderDefault}`, padding: t.space8,
          width: t.modalWidth, maxWidth: "90vw", boxShadow: t.shadowModal,
          display: "flex", flexDirection: "column", gap: 0,
        }}
      >
        {/* Close */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
          <button ref={firstFocusable} onClick={onCancel} aria-label="Fechar" style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.borderStrong, display: "flex", padding: 4, borderRadius: t.radiusMd,
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Icon + content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: t.space4 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: t.feedbackErrorBg, border: `1.5px solid ${hexToRgba(t.feedbackError, 0.2)}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AlertOctagon size={22} color={t.feedbackError} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 380 }}>
            <h3 id="ds-destruct-title" style={{
              fontFamily: t.fontFamily, fontSize: t.text16, fontWeight: 700,
              color: t.textPrimary, margin: 0, letterSpacing: "-0.3px",
            }}>
              {title}
            </h3>
            <p style={{
              fontFamily: t.fontFamily, fontSize: t.textMd,
              color: t.textSecondary, margin: 0, lineHeight: 1.55,
            }}>
              {description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: t.space3, marginTop: 28, justifyContent: "center" }}>
          <button onClick={onCancel} disabled={loading} style={{
            flex: 1, height: 40, border: `1px solid ${t.borderDefault}`,
            borderRadius: t.buttonRadius, background: t.surfaceDefault,
            fontFamily: t.fontFamily, fontSize: t.textMd, fontWeight: 500,
            color: t.textSecondary, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1, transition: "background 0.15s",
          }}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={loading} style={{
            flex: 1, height: 40, border: "none", borderRadius: t.buttonRadius,
            background: t.feedbackError,
            fontFamily: t.fontFamily, fontSize: t.textMd, fontWeight: 600,
            color: t.textOnBrand, cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.15s", opacity: loading ? 0.75 : 1,
          }}>
            {loading ? "Excluindo..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
