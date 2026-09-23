/**
 * EmpiricaFundoCategoryPage — Listagem de fundos por categoria
 * 100% inline styles via useTheme() — zero Tailwind, zero hardcoded values.
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { EmpiricaLayout } from './EmpiricaLayout';
import { SiteSrmBanner } from '../site/poc2/SiteSrmBanner';
import { useSrmViewport } from '../site/poc2/useSrmViewport';
import {
  FundCategory, FundInfo,
  CATEGORY_META, getFundsByCategory,
} from './data/empirica-funds';
import {
  useTheme,
  DSInput,
  DSButton,
  DSEmptyState,
} from '../../../design-system';
import { EmpiricaGestorBar } from './EmpiricaGestorBar';
import { EmpiricaGestorModal } from './EmpiricaGestorModal';

const PAGE_SIZE = 10;
const API = `https://${projectId}.supabase.co/functions/v1/make-server-57709921`;

/**
 * Lista os fundos da categoria a partir do CMS, caindo no arquivo local
 * enquanto a requisição não volta (ou se ela falhar). Sem isso, um fundo
 * cadastrado no CMS não apareceria na listagem.
 */
function useFundosDaCategoria(category: FundCategory): FundInfo[] {
  const [funds, setFunds] = useState<FundInfo[]>(() => getFundsByCategory(category));

  useEffect(() => {
    let cancelado = false;
    setFunds(getFundsByCategory(category));

    fetch(`${API}/empirica/fundos?type=${category.toUpperCase()}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then(r => r.json())
      .then((d: { funds?: any[] }) => {
        if (cancelado || !d.funds?.length) return;
        setFunds(d.funds.map(f => ({
          slug:      f.slug,
          shortName: f.name,
          fullName:  f.fields?.find((x: any) => x.label === 'Nome')?.value || f.name,
          category,
        } as FundInfo)));
      })
      .catch(() => { /* mantém o fallback local */ });

    return () => { cancelado = true; };
  }, [category]);

  return funds;
}

// ─── Contador — separador ─────────────────────────────────────────────────────
function FundDivider({ total, filtered, query }: {
  total: number; filtered: number; query: string;
}) {
  const { tokens: t } = useTheme();
  const count = query ? filtered : total;
  const label = query
    ? `${count} fundo${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''} de ${total}`
    : `${count} fundo${count !== 1 ? 's' : ''} disponíve${count !== 1 ? 'is' : 'l'}`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
      <div style={{ flexGrow: 1, height: 1, background: t.borderDefault }} />
      <span style={{
        fontFamily: t.fontFamily,
        fontSize: t.text2Xs,
        fontWeight: 500,
        color: t.textSecondary,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>{label}</span>
      <div style={{ flexGrow: 1, height: 1, background: t.borderDefault }} />
    </div>
  );
}

// ─── FundCard ─────────────────────────────────────────────────────────────────
function FundCard({ fund, onClick }: { fund: FundInfo; onClick: () => void }) {
  const { tokens: t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: 24,
        width: '100%',
        boxSizing: 'border-box',
        background: hov ? t.primary50 : t.surfaceDefault,
        border: `1px solid ${hov ? t.primary200 : t.borderDefault}`,
        borderRadius: t.cardRadius,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.18s, border-color 0.18s, box-shadow 0.15s',
        boxShadow: hov ? t.shadowMd : 'none',
        outline: 'none',
        fontFamily: t.fontFamily,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexGrow: 1, minWidth: 0 }}>
        <div style={{
          width: 3,
          alignSelf: 'stretch',
          minHeight: 20,
          borderRadius: t.radiusXs,
          background: t.brandAccent,
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: t.textLg,
          fontWeight: 700,
          color: hov ? t.primary700 : t.primary800,
          letterSpacing: '0.48px',
          textTransform: 'uppercase',
          lineHeight: '18px',
          transition: 'color 0.18s',
        }}>
          {fund.shortName}
        </span>
      </div>
      <ChevronRight
        size={20}
        color={hov ? t.primary700 : t.primary800}
        strokeWidth={2}
        style={{ flexShrink: 0 }}
      />
    </button>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props { category: FundCategory }

export function EmpiricaFundoCategoryPage({ category }: Props) {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [visibleCount, setVisible] = useState(PAGE_SIZE);
  const [showAll, setShowAll] = useState(false);
  const [gestorModalOpen, setGestorModalOpen] = useState(false);
  const closeGestorModal = useCallback(() => setGestorModalOpen(false), []);

  const isFif = category === 'fif';
  const meta  = CATEGORY_META[category];
  const funds = useFundosDaCategoria(category);

  const filtered = useMemo(() => {
    if (!query.trim()) return funds;
    const q = query.toLowerCase();
    return funds.filter(f =>
      f.shortName.toLowerCase().includes(q) ||
      f.fullName.toLowerCase().includes(q)
    );
  }, [funds, query]);

  const displayed = showAll ? filtered : filtered.slice(0, visibleCount);
  const hasMore   = !showAll && filtered.length > visibleCount;

  return (
    <EmpiricaLayout>
      {gestorModalOpen && <EmpiricaGestorModal onClose={closeGestorModal} />}

      <SiteSrmBanner
        title={meta.label}
        subtitle={meta.description}
        badge={meta.code}
        breadcrumbs={[
          { label: 'Nossos Fundos', href: '/empirica/nossos-fundos' },
          { label: meta.breadcrumb },
        ]}
      />

      {/* GestorBar mobile — fluxo normal, 32px abaixo do banner */}
      {isFif && isMobile && (
        <div style={{ background: t.surfaceBackground, padding: '32px 24px 32px', width: '100%', boxSizing: 'border-box' as const }}>
          <EmpiricaGestorBar onOpen={() => setGestorModalOpen(true)} />
        </div>
      )}

      {/* 2. Conteúdo principal */}
      <section style={{
        background: t.surfaceBackground,
        padding: isMobile ? '0 0 80px' : '0 0 80px',
        width: '100%',
        boxSizing: 'border-box' as const,
      }}>

        {/* GestorBar desktop — overlap sobre o banner */}
        {isFif && !isMobile && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '0 56px',
            marginTop: -38,
            marginBottom: 48,
            position: 'relative',
            zIndex: 10,
          }}>
            <div style={{ width: '100%', maxWidth: 554 }}>
              <EmpiricaGestorBar onOpen={() => setGestorModalOpen(true)} />
            </div>
          </div>
        )}

        {/* Busca */}
        <div style={{
          padding: isMobile ? '20px 20px 0' : '28px 56px 0',
          display: 'flex',
          justifyContent: 'center',
          marginTop: isFif ? 0 : (isMobile ? 20 : 28),
        }}>
          <div style={{ width: '100%', maxWidth: isMobile ? '100%' : 648 }}>
            <DSInput
              type="search"
              size="md"
              placeholder="Buscar fundo..."
              value={query}
              onChange={v => { setQuery(v); setVisible(PAGE_SIZE); setShowAll(false); }}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Lista */}
        <div style={{
          padding: isMobile ? '20px 20px 0' : '20px 56px 0',
        }}>
          <div style={{ maxWidth: isMobile ? '100%' : 648, margin: '0 auto' }}>
            {funds.length === 0 ? (
              <DSEmptyState
                variant="empty"
                headline={`Categoria ${category.toUpperCase()} em atualização`}
                body="Disponível em breve."
                style={{ padding: '60px 0' }}
              />
            ) : filtered.length === 0 ? (
              <DSEmptyState
                variant="search"
                headline="Nenhum fundo encontrado"
                body={`Não encontramos resultados para "${query}". Tente outras palavras-chave.`}
                withAction
                actionLabel="Limpar busca"
                onAction={() => { setQuery(''); setVisible(PAGE_SIZE); setShowAll(false); }}
                style={{ padding: '48px 0' }}
              />
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <FundDivider total={funds.length} filtered={filtered.length} query={query} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {displayed.map(fund => (
                    <FundCard
                      key={fund.slug}
                      fund={fund}
                      onClick={() => navigate(`/empirica/nossos-fundos/${category}/${fund.slug}`)}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div style={{
                    display: 'flex',
                    gap: 12,
                    marginTop: 24,
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'center',
                  }}>
                    <DSButton
                      variant="secondary"
                      size="md"
                      onClick={() => setVisible(c => c + PAGE_SIZE)}
                    >
                      Carregar mais ({Math.min(PAGE_SIZE, filtered.length - visibleCount)})
                    </DSButton>
                    <DSButton
                      variant="primary"
                      size="md"
                      onClick={() => setShowAll(true)}
                    >
                      Mostrar todos ({filtered.length})
                    </DSButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </EmpiricaLayout>
  );
}
