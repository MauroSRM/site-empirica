/**
 * EmpiricaFundoCategoryPage — Listagem de fundos por categoria
 * 100% inline styles via useTheme() — zero Tailwind, zero hardcoded values.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { EmpiricaLayout } from './EmpiricaLayout';
import { EmpiricaBanner } from './EmpiricaBanner';
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

// Busca ignorando acento: digitar "lotus" precisa achar "EMPÍRICA LÓTUS".
const semAcento = (s: string) =>
  (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const PAGE_SIZE = 10;
const API = `https://${projectId}.supabase.co/functions/v1/make-server-57709921`;

/**
 * Lista os fundos da categoria a partir do CMS, caindo no arquivo local
 * enquanto a requisição não volta (ou se ela falhar). Sem isso, um fundo
 * cadastrado no CMS não apareceria na listagem.
 */
export type EstadoDaBusca = 'carregando' | 'ok' | 'erro';

/**
 * Lista de fundos vinda do CMS.
 *
 * Não existe mais fallback para a lista estática do código: num site cuja
 * finalidade é publicar documento regulatório, mostrar um acervo antigo com
 * cara de atual é pior do que não mostrar nada. Quando o CMS não responde, o
 * estado vira 'erro' e a página avisa — em vez de exibir fundos que podem já
 * ter sido excluídos e cujos documentos não abrem.
 */
export function useFundosDaCategoria(category?: FundCategory): {
  funds: FundInfo[];
  estado: EstadoDaBusca;
} {
  const [funds,  setFunds]  = useState<FundInfo[]>([]);
  const [estado, setEstado] = useState<EstadoDaBusca>('carregando');

  useEffect(() => {
    let cancelado = false;
    setFunds([]);
    setEstado('carregando');

    const filtro = category ? `?type=${category.toUpperCase()}` : '';
    fetch(`${API}/empirica/fundos${filtro}`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: { funds?: any[] }) => {
        if (cancelado) return;
        if (!d.funds) throw new Error('resposta sem fundos');
        setFunds(d.funds.map(f => ({
          slug:      f.slug,
          shortName: f.name,
          fullName:  f.fields?.find((x: any) => x.label === 'Nome')?.value || f.name,
          category:  (f.type ?? category ?? '').toLowerCase() as FundCategory,
        } as FundInfo)));
        setEstado('ok');
      })
      .catch(() => { if (!cancelado) setEstado('erro'); });

    return () => { cancelado = true; };
  }, [category]);

  return { funds, estado };
}

/** Aviso exibido quando o acervo não pôde ser carregado. */
export function AvisoIndisponivel() {
  const { tokens: t } = useTheme();
  return (
    <div style={{
      border: `1px solid ${t.borderDefault}`,
      borderRadius: t.cardRadius,
      background: t.surfaceDefault,
      padding: 32,
      textAlign: 'center' as const,
      fontFamily: t.fontFamily,
    }}>
      <p style={{ fontSize: t.textXl, fontWeight: 600, color: t.primary800, margin: '0 0 8px' }}>
        Documentos temporariamente indisponíveis
      </p>
      <p style={{ fontSize: t.textMd, color: t.textSecondary, margin: 0, lineHeight: 1.6 }}>
        Não foi possível carregar o acervo agora. Atualize a página em alguns instantes.
        Se persistir, avise a Empírica — preferimos não exibir uma lista que pode estar
        desatualizada.
      </p>
    </div>
  );
}

// ─── Contador — separador ─────────────────────────────────────────────────────
export function FundDivider({ total, filtered, query }: {
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
export function FundCard({ fund, onClick }: { fund: FundInfo; onClick: () => void }) {
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

  const meta  = CATEGORY_META[category];
  const { funds, estado } = useFundosDaCategoria(category);

  const filtered = useMemo(() => {
    if (!query.trim()) return funds;
    const q = semAcento(query);
    return funds.filter(f =>
      semAcento(f.shortName).includes(q) ||
      semAcento(f.fullName).includes(q)
    );
  }, [funds, query]);

  const displayed = showAll ? filtered : filtered.slice(0, visibleCount);
  const hasMore   = !showAll && filtered.length > visibleCount;

  return (
    <EmpiricaLayout>
      <EmpiricaBanner
        title={meta.label}
        subtitle={meta.description}
        badge={meta.code}
      />

      {/* 2. Conteúdo principal */}
      <section style={{
        background: t.surfaceBackground,
        padding: isMobile ? '0 0 80px' : '0 0 80px',
        width: '100%',
        boxSizing: 'border-box' as const,
      }}>

        {/* Busca */}
        <div style={{
          padding: isMobile ? '20px 20px 0' : '28px 56px 0',
          display: 'flex',
          justifyContent: 'center',
          marginTop: isMobile ? 20 : 28,
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
            {estado === 'carregando' ? null : estado === 'erro' ? (
              <AvisoIndisponivel />
            ) : funds.length === 0 ? (
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
                      onClick={() => navigate(`/fundos/${category}/${fund.slug}`)}
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
