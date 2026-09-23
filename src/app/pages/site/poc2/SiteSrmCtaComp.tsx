/**
 * SiteSrmCtaComp — CTA da home adaptado para páginas secundárias
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState } from "react";
import { useSrmViewport } from "./useSrmViewport";
import { DSButton } from "../../../../design-system";
import { useTheme } from "../../../../design-system";
import { SrmContactModal } from "./SrmContactModal";

interface SiteSrmCtaCompProps {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  href?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export const SiteSrmCtaComp: React.FC<SiteSrmCtaCompProps> = ({
  title = "Pronto para buscar o financiamento ideal para a sua empresa?",
  subtitle = "Fale com nossos especialistas e descubra como o Ecossistema Financeiro da SRM pode acelerar o crescimento da sua empresa.",
  buttonLabel = "Falar com um especialista",
  href = "/contato",
  secondaryLabel,
  secondaryHref,
}) => {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SrmContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} headline={buttonLabel} />

      <section style={{
        background: t.surfaceMuted,
        padding: isMobile ? "40px 24px 64px" : "80px 120px",
        fontFamily: t.fontFamily,
        boxSizing: "border-box",
        width: "100%",
      }}>
        <div data-name="CTA-Comp" style={{
          background: t.brandPrimary,
          borderRadius: t.cardRadius,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 20 : 24,
          padding: isMobile ? "28px 20px" : "40px 32px 40px 24px",
          width: "100%",
          boxSizing: "border-box",
          position: "relative",
        }}>
          {isMobile
            ? <div style={{ width: 48, height: 3, background: t.brandAccent, borderRadius: t.radiusXs, flexShrink: 0 }} />
            : <div style={{ width: 3, alignSelf: "stretch", background: t.brandAccent, borderRadius: t.radiusXs, flexShrink: 0 }} />
          }
          <div style={{ flex: isMobile ? "none" : "1 0 0", display: "flex", flexDirection: "column", gap: 8, minWidth: 0, width: isMobile ? "100%" : undefined }}>
            <p style={{ margin: 0, fontFamily: t.fontFamily, fontSize: isMobile ? 18 : 24, fontWeight: 500, color: t.textOnBrand, lineHeight: "normal" }}>{title}</p>
            <p style={{ margin: 0, fontFamily: t.fontFamily, fontSize: isMobile ? 14 : 16, fontWeight: 400, color: "rgba(227,232,241,0.9)", lineHeight: "21px" }}>{subtitle}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, flexWrap: isMobile ? "wrap" : "nowrap", width: isMobile ? "100%" : undefined }}>
            <DSButton
              variant="primary"
              size="md"
              theme="dark"
              onClick={() => setModalOpen(true)}
              style={isMobile ? { flexGrow: 1, minWidth: 0, justifyContent: "center" } : undefined}
            >
              {buttonLabel}
            </DSButton>
            {secondaryLabel && secondaryHref && (
              <DSButton
                variant="secondary"
                size="md"
                theme="dark"
                onClick={() => { window.location.href = secondaryHref; }}
                style={isMobile ? { flexGrow: 1, minWidth: 0, justifyContent: "center" } : undefined}
              >
                {secondaryLabel}
              </DSButton>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
