/**
 * SrmContactModal — Modal de contato do site SRM
 *
 * Integração HubSpot via Forms Submissions API v3
 *
 * Endpoint: POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formGuid}
 *
 * Campos mapeados:
 *   firstname, email, phone, cnpj, company
 *
 * 100% inline styles — usa useTheme() do DS Matriz
 */

import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useTheme, DSInput, DSButton } from "../../../../design-system";

// ─── HubSpot config ───────────────────────────────────────────────────────────
const HS_PORTAL_ID = "YOUR_PORTAL_ID";
const HS_FORM_GUID = "YOUR_FORM_GUID";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SrmContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  headline?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormData {
  firstname: string;
  email: string;
  phone: string;
  cnpj: string;
  company: string;
}

interface FormErrors {
  firstname?: string;
  email?: string;
  phone?: string;
  cnpj?: string;
  company?: string;
}

// ─── CNPJ mask ────────────────────────────────────────────────────────────────
function maskCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 2)  return digits;
  if (digits.length <= 5)  return `${digits.slice(0,2)}.${digits.slice(2)}`;
  if (digits.length <= 8)  return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8)}`;
  return `${digits.slice(0,2)}.${digits.slice(2,5)}.${digits.slice(5,8)}/${digits.slice(8,12)}-${digits.slice(12)}`;
}

// ─── Phone mask ───────────────────────────────────────────────────────────────
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2)  return `(${digits}`;
  if (digits.length <= 7)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
  return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstname.trim()) errors.firstname = "Nome é obrigatório";
  if (!data.email.trim()) {
    errors.email = "E-mail é obrigatório";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "E-mail inválido";
  }
  if (!data.phone.trim()) errors.phone = "Celular é obrigatório";
  if (!data.company.trim()) errors.company = "Empresa é obrigatória";
  return errors;
}

// ─── SrmContactModal ──────────────────────────────────────────────────────────
export function SrmContactModal({
  isOpen,
  onClose,
  headline = "Fale com um especialista",
}: SrmContactModalProps) {
  const { tokens: t } = useTheme();
  const [form, setForm] = useState<FormData>({
    firstname: "", email: "", phone: "", cnpj: "", company: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm({ firstname: "", email: "", phone: "", cnpj: "", company: "" });
        setErrors({});
        setStatus("idle");
      }, 300);
    }
  }, [isOpen]);

  const handleChange = (field: keyof FormData) => (v: string) => {
    let value = v;
    if (field === "phone") value = maskPhone(value);
    if (field === "cnpj")  value = maskCNPJ(value);
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");

    try {
      const payload = {
        fields: [
          { name: "firstname", value: form.firstname.trim() },
          { name: "email",     value: form.email.trim() },
          { name: "phone",     value: form.phone.trim() },
          { name: "cnpj",      value: form.cnpj.trim() },
          { name: "company",   value: form.company.trim() },
        ],
        context: {
          pageUri:  window.location.href,
          pageName: document.title,
        },
      };

      const res = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HS_PORTAL_ID}/${HS_FORM_GUID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,8,30,0.56)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px", fontFamily: t.fontFamily,
        backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
        animation: "srm-modal-fade-in 0.2s ease",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes srm-modal-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes srm-modal-slide-up {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}} />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: t.surfaceDefault, borderRadius: t.cardRadius,
          width: "100%", maxWidth: 520,
          maxHeight: "calc(100vh - 32px)", overflowY: "auto",
          position: "relative",
          boxShadow: t.shadowModal,
          animation: "srm-modal-slide-up 0.22s ease",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "28px 28px 0" }}>
          <div>
            <div style={{ width: 32, height: 3, background: t.brandAccent, borderRadius: 2, marginBottom: 16 }} />
            <h2 style={{ fontFamily: t.fontFamily, fontSize: 20, fontWeight: 700, color: t.primary900, margin: 0, lineHeight: 1.3, letterSpacing: "-0.4px" }}>
              {headline}
            </h2>
            <p style={{ fontFamily: t.fontFamily, fontSize: 13, fontWeight: 400, color: t.textSecondary, margin: "8px 0 0", lineHeight: 1.6 }}>
              Preencha o formulário e nossa equipe entrará em contato.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: 4, color: t.textSecondary,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: t.cardRadius, flexShrink: 0,
              transition: "color 0.15s ease, background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = t.primary800;
              (e.currentTarget as HTMLButtonElement).style.background = t.surfaceMuted;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: "24px 28px 28px" }}>

          {status === "success" ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "32px 0 16px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: t.primary50, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke={t.primary700} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: t.fontFamily, fontSize: 17, fontWeight: 700, color: t.primary900, margin: "0 0 8px" }}>
                  Mensagem enviada!
                </p>
                <p style={{ fontFamily: t.fontFamily, fontSize: 14, color: t.textSecondary, margin: 0, lineHeight: 1.6 }}>
                  Recebemos seu contato. Nossa equipe retornará em breve.
                </p>
              </div>
              <DSButton variant="outline" size="md" onClick={onClose} style={{ marginTop: 8 }}>
                Fechar
              </DSButton>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              <DSInput
                label="Nome"
                placeholder="Seu nome completo"
                value={form.firstname}
                onChange={handleChange("firstname")}
                state={errors.firstname ? "error" : "default"}
                errorText={errors.firstname}
              />

              <DSInput
                label="E-mail"
                placeholder="seu@email.com.br"
                value={form.email}
                onChange={handleChange("email")}
                state={errors.email ? "error" : "default"}
                errorText={errors.email}
              />

              <DSInput
                label="Celular"
                placeholder="(11) 99999-9999"
                value={form.phone}
                onChange={handleChange("phone")}
                state={errors.phone ? "error" : "default"}
                errorText={errors.phone}
              />

              <DSInput
                label="CNPJ"
                placeholder="00.000.000/0001-00"
                value={form.cnpj}
                onChange={handleChange("cnpj")}
                state={errors.cnpj ? "error" : "default"}
                errorText={errors.cnpj}
              />

              <DSInput
                label="Empresa"
                placeholder="Nome da empresa"
                value={form.company}
                onChange={handleChange("company")}
                state={errors.company ? "error" : "default"}
                errorText={errors.company}
              />

              {status === "error" && (
                <p style={{
                  fontFamily: t.fontFamily, fontSize: 13, color: t.feedbackError,
                  margin: 0, padding: "8px 12px",
                  background: t.feedbackErrorBg,
                  borderRadius: t.cardRadius, border: `1px solid rgba(211,0,0,0.18)`,
                }}>
                  Erro ao enviar. Tente novamente ou entre em contato pelo e-mail.
                </p>
              )}

              <div style={{ height: 1, background: t.borderDefault, margin: "4px 0" }} />

              <DSButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubmit}
              >
                {status === "submitting" ? "Enviando..." : "Enviar"}
              </DSButton>

              <p style={{ fontFamily: t.fontFamily, fontSize: 11, color: t.borderStrong, margin: 0, lineHeight: 1.6, textAlign: "center" }}>
                Ao enviar, você concorda com a{" "}
                <a href="/politica-de-privacidade" style={{ color: t.primary700, textDecoration: "none" }}>
                  Política de Privacidade
                </a>{" "}
                da SRM.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
