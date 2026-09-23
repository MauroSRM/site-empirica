/**
 * EmpiricaHomePage — Início · /empirica
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { EmpiricaLayout } from "./EmpiricaLayout";
import { SiteSrmCtaComp } from "../site/poc2/SiteSrmCtaComp";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { TrendingUp, Building2, Rocket, Scale, ArrowRight } from "lucide-react";
import { EmpiricaFundCategoryCard, FundCategoryCardData } from "./EmpiricaFundCategoryCard";
import { useTheme, DSButton, DSTag } from "../../../design-system";
import imgHeroPhoto from "figma:asset/92ddd32d9599822d1e09d779c788b332753640e9.png";
import { EmpiricaLogoSvg } from "./EmpiricaLogoSvg";

const svgHero = { p37f97400: "M0.00489387 7.27925V21.8279L12.654 1.36185e-07L0.00489387 7.27925ZM0.350909 22.4287L12.9999 29.7031L25.6491 22.4287H0.350909ZM13.346 0.00493001L25.9951 21.8328V7.28418L13.346 0.00493001Z" };


function EmpKeyframes() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes emp-mob-ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}} />
  );
}

const BN_DATA = [
  { display: "R$ 3bi+",   label: "Em ativos sob gestão"                         },
  { display: "30+",       label: "Fundos sob gestão"                            },
  { display: "20+ anos",  label: "Experiência combinada no crédito estruturado" },
];


function MobileBigNumbersTicker({ dark }: { dark?: boolean }) {
  const { tokens: t } = useTheme();
  const total   = BN_DATA.length;
  const doubled = [...BN_DATA, ...BN_DATA];
  const durS    = total * 7;

  return (
    <div style={{
      background: dark ? "transparent" : "rgba(0,0,0,0.22)",
      borderTop: dark ? "none" : "1px solid rgba(255,255,255,0.07)",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    }}>
      <EmpKeyframes />
      <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 2, background: t.brandAccent, zIndex: 2 }} />
      <div style={{
        display: "flex",
        width: `${doubled.length * 100}vw`,
        animation: `emp-mob-ticker ${durS}s linear infinite`,
        willChange: "transform",
      }}>
        {doubled.map((cell, i) => (
          <div key={i} style={{
            width: "100vw",
            flexShrink: 0,
            boxSizing: "border-box" as const,
            padding: "20px 24px",
            borderRight: "0.5px solid rgba(255,255,255,0.09)",
          }}>
            <p style={{
              fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 800,
              color: t.textOnBrand, lineHeight: "34px", letterSpacing: "-0.5px",
              margin: "0 0 4px", whiteSpace: "nowrap" as const,
            }}>{cell.display}</p>
            <p style={{
              fontFamily: t.fontFamily, fontSize: t.text10, fontWeight: 600,
              color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const,
              letterSpacing: "0.9px", lineHeight: "15px", margin: 0,
            }}>{cell.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const HERO_SIDEBAR_W = 99;
const HERO_BG = "linear-gradient(rgb(248,250,255) 0%, rgb(255,255,255) 37.98%, rgb(255,255,255) 60.1%, rgb(248,250,255) 100%)";
const HERO_BLUE = "#1d3f80"; // === t.brandPrimary

function HeroSidebar({ fullHeight }: { fullHeight?: boolean }) {
  const { tokens: t } = useTheme();
  return (
    <div style={{
      position: "absolute", left: 0, top: 0, bottom: 0,
      width: HERO_SIDEBAR_W, background: HERO_BLUE,
    }}>
      {/* HB diamond icon — white */}
      <svg
        width={26} height={29.703} viewBox="0 0 26 29.7031" fill="none"
        style={{ position: "absolute", top: 22, left: 36.5, display: "block" }}
      >
        <path d={svgHero.p37f97400} fill="white" />
      </svg>

      {/* "CAPITAL EM MOVIMENTO" rotated */}
      <div style={{
        position: "absolute", bottom: 20, left: 0, right: 0, height: 150,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          display: "block",
          transform: "rotate(-90deg)",
          fontFamily: t.fontFamily,
          fontSize: t.text10,
          fontWeight: 600,
          color: "rgba(255,255,255,0.28)",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          capital em movimento
        </span>
      </div>
    </div>
  );
}

function HeroBannerMobile() {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  return (
    <section style={{ width: "100%", overflow: "hidden" }}>
      <div style={{ background: HERO_BG, padding: "32px 24px 36px" }}>
        <h1 style={{
          fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 600,
          color: t.textPrimary, letterSpacing: "-0.7px", lineHeight: 1.35,
          margin: "0 0 16px",
        }}>
          Crédito Estruturado com estratégia, execução e escala
        </h1>
        <p style={{
          fontFamily: t.fontFamily, fontSize: t.textLg, fontWeight: 400,
          color: t.textSecondary, lineHeight: "24px", margin: "0 0 28px",
        }}>
          A SRM Empírica nasce da aquisição da Empírica Investimentos pela SRM Asset, unindo mais de 20 anos de experiência combinada no mercado de crédito estruturado.
        </p>
        <DSButton variant="primary" size="md" onClick={() => navigate("/empirica/nossos-fundos")}>
          Nossos Fundos
        </DSButton>
      </div>

      <div style={{ width: "100%", height: 260, overflow: "hidden", position: "relative" }}>
        <img
          src={imgHeroPhoto}
          alt="SRM Empírica"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%" }}
        />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
          background: HERO_BLUE, height: 44,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", boxSizing: "border-box" as const,
        }}>
          <svg width={16} height={18} viewBox="0 0 26 29.7031" fill="none">
            <path d={svgHero.p37f97400} fill="white" />
          </svg>
          <span style={{
            fontFamily: t.fontFamily, fontSize: t.textXs, fontWeight: 600,
            color: "rgba(255,255,255,0.35)", letterSpacing: "1.4px",
            textTransform: "uppercase" as const,
          }}>
            capital em movimento
          </span>
        </div>
      </div>

      <div style={{ background: t.primary800, overflow: "hidden" }}>
        <MobileBigNumbersTicker dark />
      </div>
    </section>
  );
}

function HeroBannerDesktop() {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  return (
    <div>
      <section style={{
        position: "relative", overflow: "hidden",
        width: "100%", height: 474, background: HERO_BG,
      }}>
        <HeroSidebar />

        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "47%", overflow: "hidden", pointerEvents: "none",
        }}>
          <img
            src={imgHeroPhoto}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center center",
            }}
          />
        </div>

        <div style={{ position: "absolute", left: 164, top: 82, width: 382 }}>
          <h1 style={{
            fontFamily: t.fontFamily, fontSize: 32, fontWeight: 600,
            color: t.textPrimary, letterSpacing: "-0.92px",
            lineHeight: "42.3px", margin: 0,
          }}>
            Crédito Estruturado<br />com estratégia,<br />execução e escala
          </h1>
        </div>

        <div style={{ position: "absolute", left: 164, top: 225, width: 379 }}>
          <p style={{
            fontFamily: t.fontFamily, fontSize: t.text16, fontWeight: 400,
            color: t.textSecondary, lineHeight: "29.24px", margin: 0,
          }}>
            A SRM Empírica nasce da aquisição da Empírica Investimentos pela SRM Asset, unindo mais de 20 anos de experiência combinada no mercado de crédito estruturado.
          </p>
        </div>

        <div style={{ position: "absolute", left: 164, top: 374 }}>
          <DSButton variant="primary" size="lg" onClick={() => navigate("/empirica/nossos-fundos")}>
            Nossos Fundos
          </DSButton>
        </div>
      </section>

      <div style={{
        background: t.primary800, width: "100%",
        display: "flex", alignItems: "stretch",
      }}>
        {BN_DATA.map((item, i) => (
          <div key={i} style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center", padding: "28px 48px",
            borderRight: i < BN_DATA.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
          }}>
            <div style={{
              fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 800,
              color: t.textOnBrand, letterSpacing: "-0.04em",
              lineHeight: 1, marginBottom: 6,
            }}>
              {item.display}
            </div>
            <div style={{
              fontFamily: t.fontFamily, fontSize: t.text2Xs, fontWeight: 500,
              color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em",
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroBanner({ isMobile }: { isMobile: boolean }) {
  if (isMobile) return <HeroBannerMobile />;
  return <HeroBannerDesktop />;
}

const FUND_CARDS: FundCategoryCardData[] = [
  { code: "FIDC", label: "DIREITOS CREDITÓRIOS",  desc: "Fundos de direitos creditórios com foco em operações de crédito estruturado para diferentes setores da economia.",          href: "/empirica/nossos-fundos/fidc" },
  { code: "FIF",  label: "FUNDO FINANCEIRO",      desc: "Fundo financeiro com alocação em ativos de crédito privado, com diversificação setorial e monitoramento de risco.",          href: "/empirica/nossos-fundos/fif"  },
  { code: "FII",  label: "FUNDO IMOBILIÁRIO",     desc: "Fundo imobiliário com foco em ativos corporativos e operações estruturadas no setor imobiliário.",                            href: "/empirica/nossos-fundos/fii"  },
  { code: "FIP",  label: "FUNDO EM PARTICIPAÇÕES", desc: "Fundo em participações voltado a investimentos em empresas e projetos com potencial de crescimento.",                       href: "/empirica/nossos-fundos/fip"  },
];

function FundCategoriesSection({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  return (
    <section style={{ background: t.surfaceMuted, padding: isMobile ? "60px 24px" : "80px 80px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <DSTag variant="neutral-brand2" size="lg">Nossos Fundos</DSTag>
        <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: "12px 0 8px", lineHeight: 1.2, letterSpacing: "-0.03em" }}>
          Estratégias de Investimento
        </h2>
        <p style={{ fontFamily: t.fontFamily, fontSize: t.textXl, color: t.textSecondary, margin: "0 0 40px", lineHeight: 1.7, maxWidth: 560 }}>
          Fundos para diferentes perfis e estratégias, destinados a investidores profissionais e qualificados.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: isMobile ? t.space4 : 24 }}>
          {FUND_CARDS.map((card) => (
            <EmpiricaFundCategoryCard key={card.code} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

const ESTRATEGIAS = [
  { icon: <Scale size={22} />,      title: "Estruturação de soluções de funding",    desc: "Operações de crédito estruturado sob medida para diversificar e fortalecer a captação das empresas." },
  { icon: <TrendingUp size={22} />, title: "Diversificação de fontes de capital",    desc: "Menor dependência de uma única linha de crédito, com acesso a diferentes instrumentos e estratégias financeiras." },
  { icon: <Building2 size={22} />,  title: "Fortalecimento da estrutura financeira", desc: "Estrutura de capital mais sólida e eficiente, preparada para sustentar o crescimento do negócio." },
  { icon: <Rocket size={22} />,     title: "Especialização em crédito estruturado",  desc: "Soluções personalizadas para as necessidades específicas de cada empresa e setor de atuação." },
];

function EstrategiaCard({ card }: { card: typeof ESTRATEGIAS[0] }) {
  const { tokens: t } = useTheme();
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.surfaceDefault,
        border: `1px solid ${t.borderDefault}`,
        borderRadius: t.cardRadius,
        padding: 28,
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? t.shadowLg : "none",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        cursor: "default",
      }}
    >
      <div style={{
        width: 48, height: 48,
        background: t.primary50,
        borderRadius: t.cardRadius,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: t.primary700,
        marginBottom: 16,
      }}>
        {card.icon}
      </div>
      <h3 style={{ fontFamily: t.fontFamily, fontSize: t.text16, fontWeight: 700, color: t.primary800, margin: "0 0 8px" }}>{card.title}</h3>
      <p style={{ fontFamily: t.fontFamily, fontSize: t.textLg, color: t.textSecondary, lineHeight: 1.65, margin: 0 }}>{card.desc}</p>
    </div>
  );
}

function EstrategiasSection({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  return (
    <section style={{ background: t.surfaceDefault, padding: isMobile ? "60px 24px 80px" : "80px 80px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <DSTag variant="neutral-brand2" size="lg">Estratégias</DSTag>
        <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: "12px 0 8px", lineHeight: 1.2, letterSpacing: "-0.03em" }}>
          Estratégias de Atuação
        </h2>
        <p style={{ fontFamily: t.fontFamily, fontSize: t.textXl, color: t.textSecondary, margin: "0 0 40px", lineHeight: 1.75, maxWidth: 520 }}>
          Quatro frentes de investimento com abordagem especializada e gestão de riscos disciplinada.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: isMobile ? t.space4 : 16 }}>
          {ESTRATEGIAS.map((card, i) => (
            <EstrategiaCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

const BRIDGE_BG = "#0e2041"; // === t.primary800 — solid, harmoniza com numbers strip

function InstitucionalBridgeSection({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();

  const STATS = [
    { value: "2025",  label: "Ano da fusão SRM + Empírica"   },
    { value: "FIDCs", label: "Pioneiros no mercado brasileiro" },
    { value: "CVM",   label: "Gestora registrada e regulada"  },
  ];

  return (
    <section style={{
      background: BRIDGE_BG,
      width: "100%",
      boxSizing: "border-box",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Oversized diamond watermark — matches hero sidebar motif */}
      <svg
        viewBox="0 0 26 29.7031"
        fill="none"
        style={{
          position: "absolute",
          right: isMobile ? -80 : -40,
          bottom: -60,
          width: isMobile ? 340 : 480,
          height: "auto",
          opacity: 0.045,
          pointerEvents: "none",
        }}
      >
        <path d={svgHero.p37f97400} fill="white" />
      </svg>


      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1280, margin: "0 auto",
        padding: isMobile ? "60px 24px" : "80px 80px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: isMobile ? t.space4 : 80,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 20 }}>
            <DSTag variant="neutral-brand2" size="lg">Institucional</DSTag>
          </div>

          <h2 style={{
            fontFamily: t.fontFamily, fontSize: isMobile ? 26 : 36, fontWeight: 700,
            color: t.textOnBrand, margin: "0 0 20px",
            lineHeight: 1.18, letterSpacing: "-0.03em",
          }}>
            Mais de 20 anos de experiência<br />unindo forças pelo crédito
          </h2>

          <p style={{
            fontFamily: t.fontFamily, fontSize: isMobile ? t.textLg : t.text16,
            color: "rgba(255,255,255,0.68)",
            lineHeight: 1.75, margin: "0 0 32px",
            maxWidth: 520,
          }}>
            Estrutura soluções de funding e captação de recursos no mercado de capitais, como FIDCs e operações de crédito estruturado. Atuamos para diversificar fontes de capital e fortalecer a estrutura financeira das empresas.
          </p>

          <DSButton
            variant="primary"
            size="lg"
            theme="dark"
            icon="right"
            iconEl={<ArrowRight size={16} />}
            onClick={() => navigate("/empirica/institucional")}
          >
            Saiba mais
          </DSButton>
        </div>

        <div style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: isMobile ? "100%" : 260,
        }}>
          {STATS.map((item, i) => (
            <div key={i} style={{
              padding: "20px 24px",
              borderRadius: t.cardRadius,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}>
              <div style={{ fontFamily: t.fontFamily, fontSize: isMobile ? t.text3xl : t.text24, fontWeight: 800, color: t.textOnBrand, letterSpacing: "-0.04em", marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontFamily: t.fontFamily, fontSize: t.text2Xs, color: "rgba(255,255,255,0.45)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EmpiricaHomePage() {
  const { isMobile } = useSrmViewport();
  return (
    <EmpiricaLayout>
      <HeroBanner isMobile={isMobile} />
      <FundCategoriesSection isMobile={isMobile} />
      <EstrategiasSection isMobile={isMobile} />
      <InstitucionalBridgeSection isMobile={isMobile} />
      <SiteSrmCtaComp
        title="Pronto para investir com a SRM Empírica?"
        subtitle="Fale com nosso time e descubra qual estratégia se encaixa no seu perfil."
        buttonLabel="Falar com um especialista"
        href="/empirica/contato"
      />
    </EmpiricaLayout>
  );
}
