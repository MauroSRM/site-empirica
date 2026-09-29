/**
 * EmpiricaFundoDetailPage — Página individual do fundo
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { EmpiricaLayout }    from './EmpiricaLayout';
import { EmpiricaBanner }    from './EmpiricaBanner';
import { comBase }           from './comBase';
import { useSrmViewport }    from '../site/poc2/useSrmViewport';
import { EmpiricaGestorBar } from './EmpiricaGestorBar';
import { EmpiricaGestorModal } from './EmpiricaGestorModal';
import {
  FundCategory, FundInfo,
  getFundBySlug, CATEGORY_META,
} from './data/empirica-funds';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTheme, DSAccordion, DSAlertCard, DSButton, DSTabBar, DSModal, DSTag } from '../../../design-system';
import { EmpiricaFaqDrawer } from './EmpiricaFaqDrawer';
import { FUND_FAQS } from './data/fund-faqs';

const EMPTY    = 'Nenhum documento publicado no momento.';

const DOCUMENT_SECTIONS = [
  "Assembleias",
  "Convocações",
  "Fato Relevante",
  "Regulamento",
  "Documentos da Oferta",
];

const FECHAMENTO_SECTIONS = [
  "Fechamento de Fundo",
  "Assembleia de Fechamento",
  "Resultado da Assembleia de Fechamento",
  "Assembleia de Liquidação",
  "Principais Dúvidas",
  "Relatório e Comunicados Mensais",
];

const LOTUS_SPECIAL_SLUGS = new Set([
  'empirica-lotus-ipca-fif-em-cotas-de-fim',
  'empirica-lotus-fif-em-cotas-de-fim',
]);

const API = `https://${projectId}.supabase.co/functions/v1/make-server-57709921`;

interface CmsCategory { id: string; name: string }
interface CmsDoc { id: string; categoryId: string; label: string; pdfUrl: string }
interface CmsData { categories: CmsCategory[]; docs: CmsDoc[]; fund?: any }

function useCmsFundDocs(slug: string | undefined) {
  const [data,    setData]    = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!slug) { setData(null); setLoading(false); return; }
    let cancelled = false;
    // Limpa antes de buscar: sem isso, ao trocar de fundo a ficha montada a
    // partir do CMS ficaria com os dados do fundo anterior.
    setData(null);
    setLoading(true);
    async function load() {
      try {
        const r = await fetch(`${API}/empirica/fundos`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const json = await r.json();
        if (!json.funds) { if (!cancelled) setLoading(false); return; }
        // Match by exact slug or substring overlap
        const match = (json.funds as any[]).find(
          (f) => f.slug === slug || slug.includes(f.slug) || f.slug.includes(slug),
        );
        if (!match) { if (!cancelled) setLoading(false); return; }
        const r2 = await fetch(`${API}/empirica/fundos/${match.id}`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const json2 = await r2.json();
        if (!cancelled) {
          setData({
            categories: json2.fund?.categories ?? [],
            docs: json2.docs ?? [],
            fund: json2.fund ?? match,
          });
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);
  return { data, loading };
}


// Fundos criados direto no CMS não existem em empirica-funds.ts. Nesse caso a
// ficha é remontada a partir dos fields[] devolvidos pelo backend.
function fundInfoDoCms(cmsFund: any, category: FundCategory, slug: string): FundInfo | undefined {
  if (!cmsFund) return undefined;
  const v = (label: string) =>
    (cmsFund.fields ?? []).find((f: any) => f.label === label)?.value ?? '';
  return {
    slug,
    category,
    shortName:            cmsFund.name ?? '',
    fullName:             v('Nome') || cmsFund.name || '',
    cnpj:                 v('CNPJ'),
    regulamentacao:       v('Regulamentação'),
    gestao:               v('Gestão'),
    politicaInvestimento: v('Política de Investimento'),
    rentabilidade:        v('Rentabilidade'),
    publicoAlvo:          v('Público-Alvo'),
    tributacao:           v('Tributação Aplicável'),
    taxaAdministracao:    v('Taxa de Administração'),
    taxaPerformance:      v('Taxa de Performance'),
    taxaCarencia:         v('Taxa de Carência'),
    enquadramentoText:    v('Condições de Enquadramento'),
  } as FundInfo;
}

function InfoTable({ fund }: { fund: FundInfo }) {
  const { tokens: t } = useTheme();
  const [enquadramentoOpen, setEnquadramentoOpen] = useState(false);

  const rows: { label: string; value?: string }[] = [
    { label: 'Nome',                     value: fund.fullName },
    { label: 'CNPJ',                     value: fund.cnpj },
    { label: 'Regulamentação',           value: fund.regulamentacao },
    { label: 'Gestão',                   value: fund.gestao },
    { label: 'Política de Investimento', value: fund.politicaInvestimento },
    { label: 'Rentabilidade',            value: fund.rentabilidade },
    { label: 'Público-alvo',             value: fund.publicoAlvo },
    { label: 'Tributação Aplicável',     value: fund.tributacao },
    { label: 'Taxa de Administração',    value: fund.taxaAdministracao },
    { label: 'Taxa de Performance',      value: fund.taxaPerformance },
    { label: 'Taxa de Carência',         value: fund.taxaCarencia },
  ];

  return (
    <>
      <div style={{
        border: `1px solid ${t.borderDefault}`,
        borderRadius: t.cardRadius,
        overflow: 'hidden',
      }}>
        {rows.map((row) => {
          const isTributacao = row.label === 'Tributação Aplicável';
          return (
            <div key={row.label} style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${t.borderDefault}`,
            }}>
              <div style={{
                fontFamily: t.fontFamily, fontSize: t.text2Xs, fontWeight: 700,
                color: t.textPrimary, textTransform: 'uppercase' as const,
                letterSpacing: '0.07em', marginBottom: 4,
              }}>
                {row.label}
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
              }}>
                <div style={{
                  fontFamily: t.fontFamily, fontSize: t.textMd,
                  color: t.textSecondary, lineHeight: 1.65,
                }}>
                  {row.value || 'Informação não disponível no momento.'}
                </div>
                {isTributacao && fund.enquadramentoText && (
                  <DSButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setEnquadramentoOpen(true)}
                    style={{ color: t.brandAccentStrong, borderColor: t.brandAccentStrong }}
                  >
                    Condições de Enquadramento
                  </DSButton>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DSModal
        isOpen={enquadramentoOpen}
        onClose={() => setEnquadramentoOpen(false)}
        variant="default"
        title="Condições de Enquadramento"
        body={fund.enquadramentoText ?? ''}
        bodyAlign="justify"
        ghostLabel="Fechar"
      />
    </>
  );
}

function buildAccordionItems(cms: CmsData | null, fallback: string[], loading = false) {
  if (loading) {
    return fallback.map((title) => ({ title, body: '…' }));
  }
  if (cms && cms.categories.length > 0) {
    // Only show categories that actually exist in the CMS AND belong to this section.
    // Deleted categories are absent from cms.categories → they won't appear.
    // Preserve the predefined section order via fallback.
    const fallbackSet = new Set(fallback);
    return cms.categories
      .filter((c) => fallbackSet.has(c.name))
      .sort((a, b) => fallback.indexOf(a.name) - fallback.indexOf(b.name))
      .map((cat) => {
        const docs = cms.docs.filter((d) => d.categoryId === cat.id);
        return {
          title: cat.name,
          body: docs.length === 0 ? EMPTY : '',
          content: docs.length > 0 ? ('text-with-buttons' as const) : undefined,
          buttons: docs.map((doc) => ({
            label: doc.label,
            // Rota da aplicação: URL copiável, sem expor o Storage do Supabase
            onClick: () => window.open(comBase(`/documento/${doc.id}`), '_blank'),
          })),
        };
      });
  }
  return fallback.map((title) => ({ title, body: EMPTY }));
}

function FundFaqCard({ label, onClick }: { label: string; onClick: () => void }) {
  const { tokens: t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center',
        padding: 24, width: '100%', boxSizing: 'border-box' as const,
        background: hov ? t.primary50 : t.surfaceDefault,
        border: `1px solid ${hov ? t.primary200 : t.borderDefault}`,
        borderRadius: t.cardRadius,
        cursor: 'pointer', textAlign: 'left' as const, outline: 'none',
        transition: 'background 0.18s, border-color 0.18s, box-shadow 0.15s',
        boxShadow: hov ? t.shadowMd : 'none',
        fontFamily: t.fontFamily,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexGrow: 1, minWidth: 0 }}>
        <div style={{
          width: 3, height: 20, flexShrink: 0,
          borderRadius: t.radiusXs, background: t.brandAccent,
        }} />
        <span style={{
          fontSize: t.textXl, fontWeight: 600,
          color: t.textPrimary,
          lineHeight: 1.4, transition: 'color 0.18s',
        }}>
          {label}
        </span>
      </div>
      <ChevronRight size={20} color={t.textSecondary} strokeWidth={2} style={{ flexShrink: 0 }} />
    </button>
  );
}

function LotusIpcaContent({ isMobile, cms, cmsLoading, faqCards }: {
  isMobile: boolean;
  cms: CmsData | null;
  cmsLoading: boolean;
  faqCards?: Array<{ label: string; onClick: () => void }>;
}) {
  const { tokens: t } = useTheme();
  const [activeTab, setActiveTab] = useState('fechamento');

  const TABS = [
    { id: 'fechamento', label: 'Fechamento' },
    { id: 'documentos', label: 'Documentos' },
  ];

  // Exclude accordion items that have a dedicated card button
  const fechamentoItems = React.useMemo(() => {
    const items = buildAccordionItems(cms, FECHAMENTO_SECTIONS, cmsLoading);
    if (!faqCards?.length) return items;
    const cardLabels = new Set(faqCards.map((c) => c.label));
    return items.filter((item) => !cardLabels.has(item.title));
  }, [cms, cmsLoading, faqCards]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Tab pill */}
      <DSTabBar
        variant="pill"
        size="md"
        tabs={TABS}
        defaultActive="fechamento"
        onChange={setActiveTab}
      />

      {/* Conteúdo das abas */}
      {activeTab === 'fechamento' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqCards?.map((card) => (
            <FundFaqCard key={card.label} label={card.label} onClick={card.onClick} />
          ))}
          <DSAccordion items={fechamentoItems} defaultOpen={null} />
        </div>
      )}

      {activeTab === 'documentos' && (
        <DSAccordion
          items={buildAccordionItems(cms, DOCUMENT_SECTIONS, cmsLoading)}
          defaultOpen={null}
        />
      )}
    </div>
  );
}

function FundNotFound({ category }: { category?: string }) {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();
  return (
    <EmpiricaLayout>
      <div style={{ background: "linear-gradient(148deg, #1d3f80 0%, #0e2041 100%)", padding: '120px 56px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: t.fontFamily, color: t.textOnBrand, margin: '0 0 24px' }}>Fundo não encontrado</h1>
        <DSButton
          variant="primary"
          theme="dark"
          size="lg"
          onClick={() => navigate(`/fundos/${category ?? ''}`)}
        >
          Voltar à listagem
        </DSButton>
      </div>
    </EmpiricaLayout>
  );
}

export default function EmpiricaFundoDetailPage() {
  const { tokens: t } = useTheme();
  const { category, slug } = useParams<{ category: FundCategory; slug: string }>();
  const navigate = useNavigate();
  const { isMobile } = useSrmViewport();
  const { data: cms, loading: cmsLoading } = useCmsFundDocs(slug);

  // A ficha pode vir do arquivo local ou do CMS (fundos criados lá não existem
  // em empirica-funds.ts). Como a resolução via CMS é assíncrona, nenhum return
  // antecipado pode ficar antes dos hooks abaixo — isso mudaria a quantidade de
  // hooks entre renderizações e quebra as regras do React.
  const fund = category && slug
    ? getFundBySlug(category as FundCategory, slug)
        ?? fundInfoDoCms(cms?.fund, category as FundCategory, slug)
    : undefined;
  const meta = category ? CATEGORY_META[category as FundCategory] : undefined;

  const isLotusIpca = !!slug && LOTUS_SPECIAL_SLUGS.has(slug);
  const isIpca = slug === 'empirica-lotus-ipca-fif-em-cotas-de-fim';
  const fundFaq  = slug ? FUND_FAQS[slug] : undefined;
  const planoFaq = isLotusIpca
    ? FUND_FAQS[isIpca ? 'empirica-lotus-ipca-plano-acao'    : 'empirica-lotus-plano-acao']
    : undefined;
  const agcFaq   = isLotusIpca
    ? FUND_FAQS[isIpca ? 'empirica-lotus-ipca-agc-resultado' : 'empirica-lotus-agc-resultado']
    : undefined;
  const [faqOpen,    setFaqOpen]    = useState(false);
  const [planoOpen,  setPlanoOpen]  = useState(false);
  const [agcOpen,    setAgcOpen]    = useState(false);
  const [gestorOpen, setGestorOpen] = useState(false);

  const lotusFaqCards = React.useMemo(() => [
    ...(fundFaq  ? [{ label: 'Fechamento de Fundo',                    onClick: () => setFaqOpen(true)   }] : []),
    ...(planoFaq ? [{ label: 'Plano de Ação',                          onClick: () => setPlanoOpen(true) }] : []),
    ...(agcFaq   ? [{ label: 'Resultado da Assembleia de Fechamento',  onClick: () => setAgcOpen(true)   }] : []),
  ], [fundFaq, planoFaq, agcFaq]);

  // Só agora, com todos os hooks já executados, decide o que renderizar
  if (!category || !slug) return <FundNotFound />;
  if (!fund) return cmsLoading ? null : <FundNotFound category={category} />;

  return (
    <EmpiricaLayout>
      <EmpiricaFaqDrawer
        isOpen={faqOpen}
        faq={fundFaq ?? { fundTitle: '', pageTitle: '', items: [] }}
        onClose={() => setFaqOpen(false)}
        onBannerAction={{
          'Plano de Ação':          () => { setFaqOpen(false);  setPlanoOpen(true); },
          'Resultado da Assembleia':() => { setFaqOpen(false);  setAgcOpen(true);   },
        }}
      />
      <EmpiricaFaqDrawer isOpen={planoOpen} faq={planoFaq ?? { fundTitle: '', pageTitle: '', items: [] }} onClose={() => setPlanoOpen(false)} />
      <EmpiricaFaqDrawer isOpen={agcOpen}   faq={agcFaq   ?? { fundTitle: '', pageTitle: '', items: [] }} onClose={() => setAgcOpen(false)}   />
      {gestorOpen && <EmpiricaGestorModal filterFund={fund.shortName} onClose={() => setGestorOpen(false)} />}

      <EmpiricaBanner
        title={fund.shortName}
        badge={meta.code}
      />

      {/* GestorBar mobile — normal flow, 32px below banner */}
      {isLotusIpca && isMobile && (
        <div style={{
          background: t.surfaceMuted,
          padding: '32px 20px 32px',
          width: '100%',
          boxSizing: 'border-box' as const,
        }}>
          <EmpiricaGestorBar onOpen={() => setGestorOpen(true)} />
        </div>
      )}

      <section style={{
        background: t.surfaceMuted,
        paddingTop: isLotusIpca && isMobile ? 32 : 0,
        paddingRight: isMobile ? 20 : 56,
        paddingBottom: isMobile ? 64 : 80,
        paddingLeft: isMobile ? 20 : 56,
        width: '100%', boxSizing: 'border-box' as const,
      }}>
        {/* GestorBar desktop — overlaps banner with negative marginTop */}
        {isLotusIpca && !isMobile && (
          <div style={{
            display: 'flex', justifyContent: 'center',
            marginLeft: -56,
            marginRight: -56,
            paddingLeft: 56,
            paddingRight: 56,
            marginTop: -38,
            marginBottom: 40,
            position: 'relative',
            zIndex: 10,
          }}>
            <div style={{ width: '100%', maxWidth: 554 }}>
              <EmpiricaGestorBar onOpen={() => setGestorOpen(true)} />
            </div>
          </div>
        )}

        <div style={{ maxWidth: 1120, margin: '0 auto', paddingTop: isLotusIpca ? 0 : (isMobile ? 40 : 56) }}>

          {/* Back row */}
          <div style={{ marginBottom: 32 }}>
            <DSButton
              variant="ghost"
              size="sm"
              icon="left"
              iconEl={<ArrowLeft size={14} />}
              onClick={() => navigate(`/fundos/${category}`)}
              style={{ opacity: 0.75 }}
            >
              Voltar aos fundos {meta.code}
            </DSButton>
          </div>

          {isLotusIpca ? (
            /* Layout especial para Lótus IPCA — mesmas proporções do template padrão */
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
              gap: isMobile ? t.space4 : 48,
              alignItems: 'start',
            }}>
              {/* Coluna esq — conteúdo de fechamento + tabs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <LotusIpcaContent
                  isMobile={isMobile}
                  cms={cms}
                  cmsLoading={cmsLoading}
                  faqCards={lotusFaqCards}
                />
              </div>

              {/* Coluna dir — tabela de informações */}
              <div>
                <div style={{ marginBottom: 16 }}><DSTag variant="neutral" size="lg">Informações do Fundo</DSTag></div>
                <InfoTable fund={fund} />
              </div>
            </div>
          ) : (
            /* Layout padrão */
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
              gap: isMobile ? t.space4 : 48,
              alignItems: 'start',
            }}>
              {/* Coluna esq — documentos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ marginBottom: 16 }}><DSTag variant="neutral" size="lg">Documentos</DSTag></div>
                <DSAccordion
                  items={buildAccordionItems(cms, DOCUMENT_SECTIONS, cmsLoading)}
                />
              </div>

              {/* Coluna dir — tabela */}
              <div>
                <div style={{ marginBottom: 16 }}><DSTag variant="neutral" size="lg">Informações do Fundo</DSTag></div>
                <InfoTable fund={fund} />
              </div>
            </div>
          )}

          {/* Alertas legais */}
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DSAlertCard
              variant="info" outline
              title="Aviso Legal"
              body="A SRM Empírica distribui cotas de fundos de investimento sob sua gestão. Os fundos de investimento não são garantidos pelo administrador, gestor da carteira, qualquer mecanismo de seguro ou pelo Fundo Garantidor de Crédito – FGC. A rentabilidade divulgada não é líquida de impostos. A rentabilidade obtida no passado não representa garantia de resultados futuros. Recomenda-se a leitura cuidadosa do regulamento do fundo antes de aplicar os respectivos recursos."
            />
            <DSAlertCard
              variant="info" outline
              title="Público-alvo"
              body="Destinado exclusivamente a Investidores Profissionais e/ou Qualificados."
            />
          </div>
        </div>
      </section>
    </EmpiricaLayout>
  );
}
