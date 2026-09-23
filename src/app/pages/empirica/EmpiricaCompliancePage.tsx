/**
 * EmpiricaCompliancePage — Compliance · /empirica/compliance
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useEffect, useState } from "react";
import { EmpiricaLayout } from "./EmpiricaLayout";
import { SiteSrmBanner } from "../site/poc2/SiteSrmBanner";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { useTheme, DSAlertCard, DSTag } from "../../../design-system";
import { Download, FileText } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-57709921`;


interface DocItem {
  id: string;
  nome: string;
  href: string;
  atualizado?: string;
  pdfUrl?: string;
}

const DOCUMENTOS: DocItem[] = [
  { id: "formulario-de-referencia",             nome: "Formulário de Referência",                       href: "https://empirica.com.br/wp-content/uploads/2023/03/Formulario-de-Referencia-2023.pdf" },
  { id: "codigo-de-etica",                      nome: "Código de Ética",                                href: "https://empirica.com.br/wp-content/uploads/2024/01/Codigo-de-Conduta-Etica.pdf" },
  { id: "manual-de-compliance",                 nome: "Manual de Compliance",                           href: "https://empirica.com.br/wp-content/uploads/2024/01/Manual-de-Compliance.pdf" },
  { id: "manual-de-controles-internos",         nome: "Manual de Controles Internos",                   href: "https://empirica.com.br/wp-content/uploads/2023/02/Manual-de-Controles-Internos-e-Riscos-Operacionais.pdf" },
  { id: "manual-de-liquidez",                   nome: "Manual de Gerenciamento de Risco de Liquidez",   href: "https://empirica.com.br/wp-content/uploads/2023/05/Manual-de-Liquidez-2023-1.pdf" },
  { id: "politica-de-gestao-de-risco",          nome: "Política de Gestão de Risco",                    href: "https://empirica.com.br/wp-content/uploads/2022/09/Manual-de-Gestao-de-Riscos.pdf" },
  { id: "politica-de-negociacao",               nome: "Política de Negociação de Valores Mobiliários",  href: "https://empirica.com.br/wp-content/uploads/2024/01/Politica-de-Negociacao-de-Valores-Mobiliarios.pdf" },
  { id: "politica-de-rateio",                   nome: "Política de Rateio e Distribuição de Ordens",    href: "https://empirica.com.br/wp-content/uploads/2023/12/Politica-de-Rateio-e-Distribuicao-de-Ordens.pdf" },
  { id: "politica-de-exercicio-de-voto",        nome: "Política de Exercício de Voto",                  href: "https://empirica.com.br/wp-content/uploads/2023/12/Politica-de-Exercicio-de-Direito-de-Voto.pdf" },
  { id: "planilha-de-voto",                     nome: "Planilha de Exercício de Voto Consolidada",      href: "https://empirica.com.br/wp-content/uploads/2024/02/Site-EI-Janeiro-2024.pdf" },
  { id: "politica-de-privacidade",              nome: "Política de Privacidade de Dados",               href: "https://empirica.com.br/wp-content/uploads/2023/09/202309-Politica-de-Privacidade-de-Dados-Res-175_v-final.pdf" },
  { id: "politica-de-distribuicao",             nome: "Política de Distribuição",                       href: "https://empirica.com.br/wp-content/uploads/2024/01/Politica-de-Distribuicao-Empirica.pdf" },
  { id: "politica-de-remuneracao",              nome: "Política de Remuneração do Distribuidor",        href: "https://empirica.com.br/wp-content/uploads/2023/12/Politica-de-Remuneracao-do-Distribuidor.pdf" },
  { id: "politica-de-investimento-responsavel", nome: "Política de Investimento Responsável",           href: "https://empirica.com.br/wp-content/uploads/2024/01/Politica-de-Investimento-Responsavel.pdf" },
];

interface CmsDoc { id: string; nome?: string; atualizado?: string; pdfUrl?: string; }

// ── DS-standard column widths ──────────────────────────────────────────────────
const COL_NUM  = 52;    // "#" col
const COL_PDF  = 120;   // "Download" col

function TableHeader({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  const cellStyle: React.CSSProperties = {
    fontFamily: t.fontFamily,
    fontSize: t.textSm,
    fontWeight: 700,
    color: t.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  };
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `${COL_NUM}px 1fr ${COL_PDF}px`,
      alignItems: "center",
      height: 44,
      background: t.surfaceMuted,
      borderBottom: `1px solid ${t.borderDefault}`,
      paddingLeft: 4,
    }}>
      <span style={{ ...cellStyle, paddingLeft: 12, textAlign: "center" }}>#</span>
      <span style={{ ...cellStyle }}>Documento</span>
      <span style={{ ...cellStyle, paddingRight: 16 }}>Download</span>
    </div>
  );
}

function DocRow({
  doc, index, isLast, isMobile,
}: {
  doc: DocItem; index: number; isLast: boolean; isMobile: boolean;
}) {
  const { tokens: t } = useTheme();
  const [hov, setHov] = React.useState(false);
  const finalHref = doc.href;

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "grid",
        gridTemplateColumns: `${COL_NUM}px 1fr ${COL_PDF}px`,
        alignItems: "center",
        minHeight: 56,
        borderBottom: isLast ? "none" : `1px solid ${t.borderDefault}`,
        background: hov ? t.surfaceMuted : t.surfaceDefault,
        transition: "background 0.15s",
        textDecoration: "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* # */}
      <span style={{
        fontFamily: t.fontFamily,
        fontSize: t.textSm,
        color: t.textSecondary,
        textAlign: "center",
      }}>
        {index + 1}
      </span>

      {/* Documento — orange accent bar + title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 16 }}>
        <div style={{
          width: 3, height: 18,
          background: t.brandAccent,
          borderRadius: 2,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: t.fontFamily,
          fontSize: t.textMd,
          fontWeight: 600,
          color: hov ? t.brandPrimary : t.primary800,
          lineHeight: 1.4,
          transition: "color 0.15s",
        }}>
          {doc.nome}
        </span>
      </div>

      {/* Download button with label */}
      <div style={{ display: "flex", alignItems: "center", paddingRight: 16 }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 12px",
            border: `1px solid ${hov ? t.brandPrimary : t.borderDefault}`,
            borderRadius: t.radiusMd,
            background: hov ? t.brandPrimary : "transparent",
            color: hov ? t.surfaceDefault : t.brandPrimary,
            fontFamily: t.fontFamily,
            fontSize: t.textSm,
            fontWeight: 600,
            transition: "all 0.15s",
            whiteSpace: "nowrap" as const,
          }}
        >
          <Download size={13} />
          Baixar PDF
        </span>
      </div>
    </a>
  );
}

export default function EmpiricaCompliancePage() {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();
  const [docs, setDocs] = useState<DocItem[]>(DOCUMENTOS);

  useEffect(() => {
    fetch(`${API}/empirica/compliance`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then(r => r.json())
      .then((d: { items?: CmsDoc[] }) => {
        if (!d.items?.length) return;
        // O CMS é a fonte: a lista estática só vale como fallback, e seus href
        // apontam para o site antigo (empirica.com.br), que saiu do ar.
        setDocs(d.items.map(item => ({
          id:         item.id,
          nome:       item.nome ?? "Documento",
          href:       `/empirica/documento/compliance/${item.id}`,
          atualizado: item.atualizado,
        })));
      })
      .catch(e => console.error("Erro ao carregar dados de compliance:", e));
  }, []);

  return (
    <EmpiricaLayout>
      <SiteSrmBanner
        title="Compliance"
        subtitle="Documentos regulatórios publicados em atendimento ao Art. 16 da Resolução CVM nº 21 de 25/02/2021."
        badge="CVM · Resolução 21/2021"
        breadcrumbs={[{ label: "Compliance" }]}
      />

      <section style={{ background: t.surfaceDefault, padding: isMobile ? "48px 24px" : "72px 80px", width: "100%", boxSizing: "border-box" as const }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <DSTag variant="neutral-brand2" size="lg">Regulatório</DSTag>
          <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: "12px 0 16px", letterSpacing: "-0.03em" }}>
            Documentos Obrigatórios
          </h2>
          <p style={{ fontFamily: t.fontFamily, fontSize: t.textXl, color: t.textSecondary, lineHeight: 1.75, margin: "0 0 40px", maxWidth: 760 }}>
            A SRM Empírica publica os documentos abaixo em atendimento ao <strong style={{ color: t.primary800 }}>Art. 16 da Resolução CVM nº 21 de 25/02/2021</strong>. Todos os documentos estão disponíveis para download em formato PDF.
          </p>

          {/* Table */}
          <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.cardRadius, overflow: "hidden" }}>
            <TableHeader isMobile={isMobile} />
            {docs.map((doc, i) => (
              <DocRow
                key={doc.id}
                doc={doc}
                index={i}
                isLast={i === docs.length - 1}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: t.surfaceMuted, padding: isMobile ? "40px 24px 64px" : "56px 80px", width: "100%", boxSizing: "border-box" as const }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <DSAlertCard
            variant="neutral"
            outline
            title="Aviso Legal"
            body="A SRM Empírica distribui cotas de fundos de investimento sob sua gestão. Os fundos não são garantidos pelo administrador, gestor, qualquer seguro ou pelo FGC. A rentabilidade divulgada não é líquida de impostos. Rentabilidade passada não representa garantia de resultados futuros. Leia o regulamento e o material de divulgação antes de investir."
          />
        </div>
      </section>
    </EmpiricaLayout>
  );
}
