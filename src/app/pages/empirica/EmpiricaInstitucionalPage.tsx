/**
 * EmpiricaInstitucionalPage — Quem Somos · /empirica/institucional
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React from "react";
import { EmpiricaLayout }   from "./EmpiricaLayout";
import { SiteSrmBanner }    from "../site/poc2/SiteSrmBanner";
import { SiteSrmCtaComp }   from "../site/poc2/SiteSrmCtaComp";
import { SiteSrmServiceCardGrid } from "../site/poc2/SiteSrmServiceCard";
import { useSrmViewport }   from "../site/poc2/useSrmViewport";
import { useTheme, DSTag } from "../../../design-system";
import { TrendingUp, Building2, Rocket, Scale } from "lucide-react";


function SectionTag({ c }: { c: React.ReactNode }) {
  return <DSTag variant="neutral-brand2" size="lg">{c}</DSTag>;
}

function SectionTitle({ c }: { c: React.ReactNode }) {
  const { tokens: t } = useTheme();
  return (
    <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: `${t.space3} 0 0`, lineHeight: 1.2, letterSpacing: "-0.03em" }}>
      {c}
    </h2>
  );
}

// ─── 1. Quem Somos ────────────────────────────────────────────────────────────
function QuemSomosSection({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  return (
    <section style={{ background: t.surfaceDefault, padding: isMobile ? "60px 24px" : "96px 80px", width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? t.space8 : t.space4, alignItems: "start" }}>
          <div>
            <SectionTag c="Quem Somos" />
            <SectionTitle c="A SRM Empírica" />
            <p style={{ fontFamily: t.fontFamily, fontSize: t.text16, color: t.textSecondary, lineHeight: 1.8, marginTop: 20 }}>
              A <strong style={{ color: t.primary800 }}>SRM Empírica</strong> nasce da aquisição da Empírica Investimentos pela SRM Asset, em novembro de 2025, unindo mais de 20 anos de experiência combinada no mercado de crédito estruturado.
            </p>
            <p style={{ fontFamily: t.fontFamily, fontSize: t.text16, color: t.textSecondary, lineHeight: 1.8, marginTop: 16 }}>
              A empresa reúne <strong style={{ color: t.primary800 }}>mais de 30 fundos sob gestão</strong>, sendo pioneira em FIDCs e especialista em operações não óbvias de crédito estruturado.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? t.space6 : t.space4 }}>
            {[
              { title: "SRM Asset",               tag: "Originação", desc: "Volume anual de operações de crédito superior a R$ 10 bilhões e pioneira em FIDCs. Desenvolveu o primeiro fundo multicedente e multisacado do País." },
              { title: "Empírica Investimentos",  tag: "Inovação",   desc: "Estruturação de soluções de funding e captação de recursos no mercado de capitais, como FIDCs e operações de crédito estruturado." },
            ].map((card, i) => (
              <div key={i} style={{ background: t.surfaceMuted, border: `1px solid ${t.borderDefault}`, borderRadius: t.cardRadius, padding: t.space6 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <h3 style={{ fontFamily: t.fontFamily, fontSize: t.text16, fontWeight: 700, color: t.primary800, margin: 0 }}>{card.title}</h3>
                  <DSTag variant="neutral-brand2" size="sm">{card.tag}</DSTag>
                </div>
                <p style={{ fontFamily: t.fontFamily, fontSize: t.textLg, color: t.textSecondary, lineHeight: 1.7, margin: "10px 0 0" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. Estratégias — SiteSrmServiceCard ──────────────────────────────────────
const ESTRATEGIAS = [
  { icon: <Scale size={22} />,      title: "Estruturação de soluções de funding",    desc: "Operações de crédito estruturado sob medida para diversificar e fortalecer a captação das empresas." },
  { icon: <TrendingUp size={22} />, title: "Diversificação de fontes de capital",    desc: "Menor dependência de uma única linha de crédito, com acesso a diferentes instrumentos e estratégias financeiras." },
  { icon: <Building2 size={22} />,  title: "Fortalecimento da estrutura financeira", desc: "Estrutura de capital mais sólida e eficiente, preparada para sustentar o crescimento do negócio." },
  { icon: <Rocket size={22} />,     title: "Especialização em crédito estruturado",  desc: "Soluções personalizadas para as necessidades específicas de cada empresa e setor de atuação." },
];

function EstrategiasSection({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  return (
    <section style={{ background: t.surfaceMuted, padding: isMobile ? "60px 24px" : "96px 80px", width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionTag c="Estratégias" />
        <SectionTitle c="Estratégias de Atuação" />
        <p style={{ fontFamily: t.fontFamily, fontSize: t.text16, color: t.textSecondary, margin: `${t.space4} 0 ${t.space10}`, lineHeight: 1.75 }}>
          Quatro frentes de investimento com abordagem especializada e gestão de riscos disciplinada.
        </p>
        <SiteSrmServiceCardGrid cards={ESTRATEGIAS} isMobile={isMobile} cols={4} />
      </div>
    </section>
  );
}

// ─── 3. Crença · Propósito · Valores ─────────────────────────────────────────
const PILARES_DATA = [
  { label: "Nossa Crença",    text: "O crédito é uma força impulsionadora que fortalece conexões, transforma vidas e realiza sonhos.",                                                                                  bgKey: "primary800" as const },
  { label: "Nosso Propósito", text: "Promover a expansão do crédito por meio de soluções inovadoras, integrando investidores e tomadores de crédito.",                                                                   bgKey: "primary700" as const },
  { label: "Nossos Valores",  text: "Ética e transparência · Empatia · Mentalidade inovadora · Agilidade · Atuação em rede · Cuidado com as pessoas · Prosperidade gerando valor compartilhado", bgKey: "primary900" as const },
];

function PilaresSection({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  const bgs = { primary800: t.primary800, primary700: t.primary700, primary900: t.primary900 };
  return (
    <section style={{ background: t.surfaceDefault, padding: isMobile ? "60px 24px" : "96px 80px", width: "100%", boxSizing: "border-box" as const }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <SectionTag c="Cultura" />
        <SectionTitle c="Crença, Propósito e Valores" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 0, marginTop: 40, borderRadius: t.cardRadius, overflow: "hidden" }}>
          {PILARES_DATA.map((p, i) => (
            <div key={i} style={{ background: bgs[p.bgKey], padding: isMobile ? 28 : 36 }}>
              <span style={{ fontFamily: t.fontFamily, fontSize: t.text10, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>{p.label}</span>
              <p style={{ fontFamily: t.fontFamily, fontSize: t.textXl, color: "rgba(255,255,255,0.88)", lineHeight: 1.75, margin: "14px 0 0" }}>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmpiricaInstitucionalPage() {
  const { isMobile } = useSrmViewport();
  return (
    <EmpiricaLayout>
      <SiteSrmBanner
        title="Quem Somos"
        subtitle="A SRM Empírica nasce da união de mais de 20 anos de experiência combinada no mercado de crédito estruturado."
        badge="Institucional"
        breadcrumbs={[{ label: "Quem Somos" }, { label: "Institucional" }]}
      />
      <QuemSomosSection   isMobile={isMobile} />
      <EstrategiasSection isMobile={isMobile} />
      <PilaresSection     isMobile={isMobile} />
      <SiteSrmCtaComp
        title="Pronto para investir com a SRM Empírica?"
        subtitle="Fale com nosso time e descubra qual estratégia se encaixa no seu perfil."
        buttonLabel="Falar com um especialista"
        href="/empirica/contato"
      />
    </EmpiricaLayout>
  );
}
