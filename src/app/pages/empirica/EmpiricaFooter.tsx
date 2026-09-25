/**
 * EmpiricaFooter — Footer do site SRM Empírica
 * 100% inline styles — usa useTheme() do DS Matriz (surfaceInverse para bg escuro)
 */
import React, { useState } from "react";
import { Link } from "react-router";
import svgPaths from "../../../imports/svg-zz0jnu9ee2";
import svgUnion from "../../../imports/Union/svg-5u4fc108dz";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { EmpiricaLogoSvg } from "./EmpiricaLogoSvg";
import { useTheme } from "../../../design-system";

// Selos em cinza médio: o rodapé passou de azul escuro para cinza claro
const SEAL_COLOR = "#6b7280";

function SealLogo({ viewBox, children, w, h }: {
  viewBox: string; children: React.ReactNode; w: number; h: number;
}) {
  return (
    <div style={{ position: "relative", width: w, height: h, flexShrink: 0 }}>
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        fill="none"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {children}
      </svg>
    </div>
  );
}

function FooterLink({ label, href = "#", external = false }: { label: string; href?: string; external?: boolean }) {
  const { tokens: t } = useTheme();
  const [hov, setHov] = useState(false);
  const base: React.CSSProperties = {
    display: "flex", alignItems: "center",
    fontFamily: t.fontFamily, fontSize: 13.5, fontWeight: 400,
    color: hov ? t.textPrimary : t.textSecondary,
    lineHeight: "20.25px", textDecoration: "none",
    whiteSpace: "nowrap", transition: "color 0.15s ease", cursor: "pointer",
  };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={base}>
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4 }}>
          <path d="M6.25 1.25H8.75V3.75" stroke="white" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833" />
          <path d="M4.17 5.83L8.75 1.25" stroke="white" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833" />
          <path d="M3.75 2.5H1.25V8.75H7.5V6.25" stroke="white" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833" />
        </svg>
      </a>
    );
  }
  return (
    <Link to={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={base}>
      {label}
    </Link>
  );
}

function ColLabel({ label }: { label: string }) {
  const { tokens: t } = useTheme();
  return (
    <span style={{ fontFamily: t.fontFamily, fontSize: t.textSm, fontWeight: 600, color: t.textPrimary, letterSpacing: "0.88px", textTransform: "uppercase", lineHeight: "16.5px" }}>
      {label}
    </span>
  );
}

function LinkCol({ label, links, isMobile }: {
  label: string; links: { text: string; href?: string; external?: boolean }[]; isMobile?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, width: isMobile ? "100%" : 184 }}>
      <ColLabel label={label} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 17 }}>
        {links.map(l => <FooterLink key={l.text} label={l.text} href={l.href} external={l.external} />)}
      </div>
    </div>
  );
}

function ColBrand() {
  const { tokens: t } = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, flexShrink: 0, width: 280 }}>
      <EmpiricaLogoSvg height={40} variant="color" />
      <p style={{ fontFamily: t.fontFamily, fontSize: 13.5, fontWeight: 400, color: t.neutral700, lineHeight: "22.95px", marginTop: 20, marginBottom: 0, width: 280 }}>
        Gestora CVM especializada em crédito estruturado com mais de 20 anos de experiência combinada e R$ 3bi+ em ativos sob gestão.
      </p>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 20 }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M6.5 1.5C4.29 1.5 2.5 3.29 2.5 5.5C2.5 8.5 6.5 11.5 6.5 11.5C6.5 11.5 10.5 8.5 10.5 5.5C10.5 3.29 8.71 1.5 6.5 1.5Z" stroke="white" strokeOpacity="0.4" strokeWidth="1.08" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="6.5" cy="5.5" r="1.5" stroke="white" strokeOpacity="0.4" strokeWidth="1.08" />
        </svg>
        <span style={{ fontFamily: t.fontFamily, fontSize: 12.5, fontWeight: 400, color: t.neutral700, whiteSpace: "nowrap" }}>
          Millennium Office Park, Av. Chedid Jafet, 222, 2º andar – Bl. C, Vila Olímpia – SP • CEP 04551-050
        </span>
      </div>
    </div>
  );
}

function FooterSiteMap({ isMobile }: { isMobile: boolean }) {
  const linksNossosFundos = [
    { text: "Todos os fundos", href: "/fundos" },
    { text: "FIDC", href: "/fundos/fidc" },
    { text: "FIF",  href: "/fundos/fif"  },
    { text: "FII",  href: "/fundos/fii"  },
    { text: "FIP",  href: "/fundos/fip"  },
  ];
  const linksRegulatorio = [
    { text: "Compliance", href: "/compliance" },
  ];
  const linksLegal = [
    { text: "Política de Privacidade", href: "/politica-de-privacidade" },
    { text: "Canal de Denúncias",      href: "https://srmasset.legaletica.com.br/client/", external: true },
  ];
  return (
    <div style={{
      display: "flex", flexDirection: isMobile ? "column" : "row",
      alignItems: "flex-start", justifyContent: isMobile ? "flex-start" : "space-between",
      gap: isMobile ? 32 : 0,
      padding: isMobile ? "40px 20px" : "56px 56px",
      width: "100%", boxSizing: "border-box",
    }}>
      <ColBrand />
      {isMobile ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 16px", width: "100%" }}>
          <LinkCol label="Nossos Fundos" links={linksNossosFundos} isMobile />
          <LinkCol label="Regulatório"   links={linksRegulatorio}  isMobile />
          <LinkCol label="Legal"         links={linksLegal}        isMobile />
        </div>
      ) : (
        <>
          <LinkCol label="Nossos Fundos" links={linksNossosFundos} />
          <LinkCol label="Regulatório"   links={linksRegulatorio} />
          <LinkCol label="Legal"         links={linksLegal} />
        </>
      )}
    </div>
  );
}

function FooterBottom({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  const legalText = "A SRM Empírica distribui cotas de fundos de investimento sob sua gestão, observadas as políticas disponíveis neste website. Os fundos de investimento não são garantidos pelo administrador, gestor da carteira, qualquer mecanismo de seguro ou pelo Fundo Garantidor de Crédito – FGC. A rentabilidade divulgada não é líquida de impostos. A rentabilidade obtida no passado não representa garantia de resultados futuros. Recomenda-se a leitura cuidadosa, pelo investidor, do regulamento do fundo de investimento antes de aplicar os respectivos recursos.";

  if (isMobile) {
    return (
      <div style={{ width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 24, padding: "28px 24px 0" }}>
          <SealLogo viewBox="0 0 93.3984 35.2002" w={80} h={27}><path d={svgPaths.p30611d80} fill={SEAL_COLOR} /></SealLogo>
          <SealLogo viewBox="0 0 107.459 81" w={88} h={66}><path d={svgPaths.p16122a00} fill={SEAL_COLOR} /></SealLogo>
          <SealLogo viewBox="0 0 107.459 81" w={88} h={66}><path d={svgPaths.p1016000} fill={SEAL_COLOR} /></SealLogo>
          <SealLogo viewBox="0 0 107.459 81" w={88} h={66}><path d={svgUnion.p65ef800} fill={SEAL_COLOR} /></SealLogo>
        </div>
        <div style={{ padding: "20px 24px 40px" }}>
          <p style={{ fontFamily: t.fontFamily, fontSize: t.textSm, fontWeight: 400, color: t.neutral700, lineHeight: "19.25px", margin: 0 }}>
            {legalText}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", padding: "32px 56px 64px", width: "100%", boxSizing: "border-box", gap: 48 }}>
      <p style={{ fontFamily: t.fontFamily, fontSize: t.textSm, fontWeight: 400, color: t.neutral700, lineHeight: "19.25px", margin: 0, flexGrow: 1, flexShrink: 1, flexBasis: 0, minWidth: 0 }}>
        {legalText}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 46, flexGrow: 0, flexShrink: 0, flexBasis: "auto", flexDirection: "row" }}>
        <SealLogo viewBox="0 0 93.3984 35.2002" w={93} h={35}><path d={svgPaths.p30611d80} fill={SEAL_COLOR} /></SealLogo>
        <SealLogo viewBox="0 0 107.459 81" w={107} h={81}><path d={svgPaths.p16122a00} fill={SEAL_COLOR} /></SealLogo>
        <SealLogo viewBox="0 0 107.459 81" w={107} h={81}><path d={svgPaths.p1016000} fill={SEAL_COLOR} /></SealLogo>
        <SealLogo viewBox="0 0 107.459 81" w={107} h={81}><path d={svgUnion.p65ef800} fill={SEAL_COLOR} /></SealLogo>
      </div>
    </div>
  );
}

export function EmpiricaFooter() {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();
  return (
    <footer style={{ background: t.surfaceMuted, width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "flex-start", fontFamily: t.fontFamily }}>
      <FooterSiteMap isMobile={isMobile} />
      <div style={{ width: "100%", height: 1, background: t.borderDefault, flexShrink: 0 }} />
      <FooterBottom isMobile={isMobile} />
    </footer>
  );
}
