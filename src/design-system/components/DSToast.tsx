/**
 * DSToast — DS Matriz v04
 *
 * Notificações temporárias de feedback ao usuário.
 *
 * Uso:
 *   1. Envolva a raiz com <DSToastProvider>
 *   2. Use o hook useToast() nos componentes filhos:
 *      const { toast } = useToast();
 *      toast.success("Salvo!");
 *      toast.error("Erro.");
 *      toast.info("Info.");
 *
 * Variantes: success | error | info
 * Auto-dismiss: t.toastDismissMs (default 4 000 ms)
 */

import React, {
  createContext, useContext, useState, useCallback, useEffect, ReactNode,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useTheme } from "../tokens";

type ToastType = "success" | "error" | "info";

interface ToastItem { id: string; type: ToastType; message: string }

export interface ToastAPI {
  success(message: string): void;
  error(message: string): void;
  info(message: string): void;
}

interface ToastCtx { toast: ToastAPI }

const ToastContext = createContext<ToastCtx>({
  toast: { success: () => {}, error: () => {}, info: () => {} },
});

export function useToast() { return useContext(ToastContext); }

// ── SingleToast ───────────────────────────────────────────────────────────────

function SingleToast({ item, onRemove }: { item: ToastItem; onRemove(id: string): void }) {
  const { tokens: t } = useTheme();

  const variantConfig: Record<ToastType, { accent: string; icon: ReactNode }> = {
    success: { accent: t.feedbackSuccess, icon: <CheckCircle2 size={15} color={t.feedbackSuccess} /> },
    error:   { accent: t.feedbackError,   icon: <XCircle      size={15} color={t.feedbackError}   /> },
    info:    { accent: t.feedbackInfo,    icon: <Info          size={15} color={t.feedbackInfo}    /> },
  };

  const cfg = variantConfig[item.type];

  useEffect(() => {
    const timer = setTimeout(() => onRemove(item.id), t.toastDismissMs);
    return () => clearTimeout(timer);
  }, [item.id, onRemove, t.toastDismissMs]);

  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: t.space2,
      background: t.surfaceDefault, border: `1px solid ${t.borderDefault}`,
      borderLeft: `4px solid ${cfg.accent}`, borderRadius: t.radiusLg,
      padding: `${t.space3} 14px ${t.space3} ${t.space3}`,
      minWidth: 280, maxWidth: t.toastWidth,
      boxShadow: t.shadowToast, fontFamily: t.fontFamily,
      animation: "dsToastIn 0.22s cubic-bezier(.22,.68,0,1.2) both",
    }}>
      <span style={{ flexShrink: 0, paddingTop: 1 }}>{cfg.icon}</span>
      <span style={{
        flex: 1, fontSize: t.textMd, color: t.textPrimary,
        fontWeight: 500, lineHeight: 1.45,
      }}>
        {item.message}
      </span>
      <button
        onClick={() => onRemove(item.id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: t.borderStrong, display: "flex", padding: 2,
          flexShrink: 0, marginTop: 1,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

// ── DSToastProvider ───────────────────────────────────────────────────────────

export interface DSToastProviderProps { children: ReactNode }

export function DSToastProvider({ children }: DSToastProviderProps) {
  const { tokens: t } = useTheme();
  const [items, setItems] = useState<ToastItem[]>([]);

  const add = useCallback((type: ToastType, message: string) =>
    setItems(p => [...p, { id: crypto.randomUUID(), type, message }]), []);

  const remove = useCallback((id: string) =>
    setItems(p => p.filter(i => i.id !== id)), []);

  const toast: ToastAPI = {
    success: m => add("success", m),
    error:   m => add("error",   m),
    info:    m => add("info",    m),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {items.length > 0 && (
        <div style={{
          position: "fixed", bottom: t.space6, right: t.space6,
          display: "flex", flexDirection: "column-reverse", gap: t.space2,
          zIndex: 9999, pointerEvents: "none",
        }}>
          {items.map(item => (
            <div key={item.id} style={{ pointerEvents: "auto" }}>
              <SingleToast item={item} onRemove={remove} />
            </div>
          ))}
        </div>
      )}
      <style>{`
        @keyframes dsToastIn {
          from { transform: translateX(24px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
