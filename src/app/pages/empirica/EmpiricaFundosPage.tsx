/**
 * EmpiricaFundosPage — Nossos Fundos · /empirica/nossos-fundos
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React from "react";
import { EmpiricaLayout }           from "./EmpiricaLayout";
import { SiteSrmBanner }            from "../site/poc2/SiteSrmBanner";
import { useSrmViewport }           from "../site/poc2/useSrmViewport";
import { EmpiricaFundCategoryCard } from "./EmpiricaFundCategoryCard";
import type { FundCategoryCardData } from "./EmpiricaFundCategoryCard";
import { useTheme, DSAccordion, DSTag } from "../../../design-system";
import { EmpiricaVantagensBlock } from "./EmpiricaVantagensBlock";


const FUNDOS: FundCategoryCardData[] = [
  {
    code:  "FIDC",
    label: "DIREITOS CREDITÓRIOS",
    desc:  "Fundos de direitos creditórios com foco em operações de crédito estruturado para diferentes setores da economia.",
    href:  "/empirica/nossos-fundos/fidc",
  },
  {
    code:  "FIF",
    label: "FUNDO FINANCEIRO",
    desc:  "Fundo financeiro com alocação em ativos de crédito privado, com diversificação setorial e monitoramento de risco.",
    href:  "/empirica/nossos-fundos/fif",
  },
  {
    code:  "FII",
    label: "FUNDO IMOBILIÁRIO",
    desc:  "Fundo imobiliário com foco em ativos corporativos e operações estruturadas no setor imobiliário.",
    href:  "/empirica/nossos-fundos/fii",
  },
  {
    code:  "FIP",
    label: "FUNDO EM PARTICIPAÇÕES",
    desc:  "Fundo em participações voltado a investimentos em empresas e projetos com potencial de crescimento.",
    href:  "/empirica/nossos-fundos/fip",
  },
];

const EDUCACIONAL = [
  {
    title: "O que é Crédito Estruturado?",
    body:  "Consolidação em um produto de investimento de créditos gerados por movimentações cotidianas da economia: dívidas de cartão de crédito, carteiras de financiamento imobiliário, contas de concessionárias, entre outros.",
  },
  {
    title: "O que são Produtos de Crédito Estruturado?",
    body:  "Investimentos que aplicam recursos em créditos com ou sem garantia, aluguéis, desconto de duplicatas, entre outros, originados de crediários, financiamentos imobiliários/automotivos, adiantamento de recebíveis e cartões.",
  },
  {
    title: "FIDCs e Fintechs",
    body:  "Com o crescimento das fintechs, os FIDCs se tornaram alternativa para financiar capital de PMEs e startups, operando de forma 'desbancarizada', sem intermediação de grandes bancos, com taxas menores e agilidade.",
  },
];


export default function EmpiricaFundosPage() {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();

  return (
    <EmpiricaLayout>
      <SiteSrmBanner
        title="Nossos Fundos"
        subtitle="Fundos voltados a Investidores Profissionais e Qualificados."
        badge="Gestora CVM"
        breadcrumbs={[{ label: "Nossos Fundos" }]}
      />

      {/* ── 1. Categorias ── */}
      <section style={{ background: t.surfaceMuted, padding: isMobile ? "48px 0 60px" : "60px 0 80px", width: "100%", boxSizing: "border-box" as const }}>

        <div style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "0 24px" : "0 80px", boxSizing: "border-box" as const }}>
          <DSTag variant="neutral-brand2" size="lg">Categorias</DSTag>
          <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: "12px 0 8px", letterSpacing: "-0.03em" }}>Conheça nossa gestão</h2>
          <p style={{ fontFamily: t.fontFamily, fontSize: t.textXl, color: t.textSecondary, margin: "0 0 40px", lineHeight: 1.7 }}>Selecione a categoria para conhecer os fundos disponíveis.</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 20 }}>
            {FUNDOS.map(f => <EmpiricaFundCategoryCard key={f.code} card={f} />)}
          </div>
        </div>
      </section>

      {/* ── 2. Educação Financeira — DSAccordion ── */}
      <section style={{ background: t.surfaceDefault, padding: isMobile ? "60px 24px" : "80px 80px", width: "100%", boxSizing: "border-box" as const }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <DSTag variant="neutral-brand2" size="lg">Educação Financeira</DSTag>
          <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: "12px 0 40px", letterSpacing: "-0.03em" }}>Entenda o Crédito Estruturado</h2>

          <div style={{ marginBottom: 48 }}>
            <DSAccordion items={EDUCACIONAL} defaultOpen={0} />
          </div>

          <EmpiricaVantagensBlock isMobile={isMobile} />
        </div>
      </section>
    </EmpiricaLayout>
  );
}
