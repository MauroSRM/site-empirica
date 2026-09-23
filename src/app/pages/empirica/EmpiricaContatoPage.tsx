/**
 * EmpiricaContatoPage — Contato · /empirica/contato
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState } from "react";
import { EmpiricaLayout } from "./EmpiricaLayout";
import { SiteSrmBanner } from "../site/poc2/SiteSrmBanner";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { useTheme, DSInput, DSButton, DSTag } from "../../../design-system";
import { MapPin, Phone, ArrowRight, CheckCircle2 } from "lucide-react";


function DsTextarea({ label, placeholder, required, value, onChange }: {
  label: string; placeholder?: string; required?: boolean;
  value: string; onChange: (v: string) => void;
}) {
  const { tokens: t } = useTheme();
  const [focus, setFocus] = React.useState(false);
  const id = `field-${label.toLowerCase().replace(/\s/g, "-")}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: t.fontFamily }}>
      <label htmlFor={id} style={{ display: "block", fontSize: t.text2Xs, fontWeight: 600, color: t.textPrimary, marginBottom: 8 }}>
        {label}{required && <span style={{ color: t.feedbackError, marginLeft: 3 }}>*</span>}
      </label>
      <textarea
        id={id} rows={4} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: "12px 16px",
          fontSize: t.textLg, fontFamily: t.fontFamily, fontWeight: 500,
          color: t.textPrimary, background: t.surfaceDefault,
          border: `1px solid ${focus ? t.borderBrand : t.borderDefault}`,
          borderRadius: t.inputRadius,
          outline: focus ? t.focusRing : "none",
          outlineOffset: 2,
          transition: "border-color 0.15s ease",
          resize: "vertical", boxSizing: "border-box" as const,
        }}
      />
    </div>
  );
}

export default function EmpiricaContatoPage() {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();
  const [submitted, setSubmitted] = useState(false);
  const [nome, setNome]       = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail]     = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");

  return (
    <EmpiricaLayout>
      <SiteSrmBanner
        title="Contato"
        subtitle="Entre em contato com a equipe SRM Empírica para dúvidas sobre fundos, investimentos e parcerias."
        badge="Fale Conosco"
        breadcrumbs={[{ label: "Contato" }]}
      />

      <section style={{ background: t.surfaceMuted, padding: isMobile ? "60px 24px" : "80px 80px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.3fr", gap: isMobile ? t.space4 : 80 }}>

            {/* Informações */}
            <div>
              <DSTag variant="neutral-brand2" size="lg">Informações</DSTag>
              <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: "12px 0 32px", letterSpacing: "-0.03em" }}>
                Fale com a equipe
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 40, height: 40, background: t.surfaceDefault, border: `1px solid ${t.borderDefault}`, borderRadius: t.cardRadius, display: "flex", alignItems: "center", justifyContent: "center", color: t.primary800, flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p style={{ fontFamily: t.fontFamily, fontSize: t.textMd, fontWeight: 600, color: t.primary800, margin: "0 0 4px" }}>Endereço</p>
                    <p style={{ fontFamily: t.fontFamily, fontSize: t.textLg, color: t.textSecondary, lineHeight: 1.65, margin: 0 }}>
                      Millennium Office Park<br />
                      Avenida Chedid Jafet, 222, 2º andar, Bloco C<br />
                      Vila Olímpia, SP · CEP 04551-050
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 40, height: 40, background: t.surfaceDefault, border: `1px solid ${t.borderDefault}`, borderRadius: t.cardRadius, display: "flex", alignItems: "center", justifyContent: "center", color: t.primary800, flexShrink: 0 }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <p style={{ fontFamily: t.fontFamily, fontSize: t.textMd, fontWeight: 600, color: t.primary800, margin: "0 0 4px" }}>Telefone</p>
                    <a href="tel:+551132257840" style={{ fontFamily: t.fontFamily, fontSize: t.textLg, color: t.textSecondary, textDecoration: "none" }}>
                      +55 (11) 3225-7840
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Formulário */}
            <div style={{ background: t.surfaceDefault, borderRadius: t.cardRadius, padding: isMobile ? 24 : 36, border: `1px solid ${t.borderDefault}` }}>
              {submitted ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 64, height: 64, background: t.feedbackSuccessBg, borderRadius: t.radiusFull, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <CheckCircle2 size={28} color={t.feedbackSuccess} />
                  </div>
                  <h3 style={{ fontFamily: t.fontFamily, fontSize: t.text2xl, fontWeight: 700, color: t.primary800, margin: "0 0 8px" }}>Mensagem enviada!</h3>
                  <p style={{ fontFamily: t.fontFamily, fontSize: t.textLg, color: t.textSecondary }}>Retornaremos em breve.</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <h3 style={{ fontFamily: t.fontFamily, fontSize: t.text2xl, fontWeight: 700, color: t.primary800, margin: "0 0 4px" }}>Envie uma mensagem</h3>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                    <DSInput label="Nome" placeholder="Seu nome completo" required value={nome} onChange={setNome} style={{ width: "100%" }} />
                    <DSInput label="Empresa" placeholder="Nome da empresa" value={empresa} onChange={setEmpresa} style={{ width: "100%" }} />
                  </div>
                  <DSInput label="E-mail" type="text" placeholder="seu@email.com.br" required value={email} onChange={setEmail} style={{ width: "100%" }} />
                  <DSInput label="Telefone" placeholder="(11) 9 0000-0000" value={telefone} onChange={setTelefone} style={{ width: "100%" }} />
                  <DsTextarea label="Mensagem" placeholder="Descreva sua necessidade ou dúvida..." required value={mensagem} onChange={setMensagem} />
                  <DSButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon="right"
                    iconEl={<ArrowRight size={16} />}
                  >
                    Enviar mensagem
                  </DSButton>
                  <p style={{ fontFamily: t.fontFamily, fontSize: t.textSm, color: t.textSecondary, margin: 0 }}>
                    Ao enviar, você concorda com nossa{" "}
                    <a href="/empirica/compliance" style={{ color: t.primary800, fontWeight: 600 }}>política de privacidade</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </EmpiricaLayout>
  );
}
