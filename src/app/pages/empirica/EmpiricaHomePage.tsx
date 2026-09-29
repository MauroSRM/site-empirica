/**
 * EmpiricaHomePage — home do site · /
 *
 * O site tem finalidade regulatória: existe para exibir e divulgar os materiais
 * dos fundos. A home é a própria listagem — navegação por categoria no topo e,
 * abaixo, a lista completa com busca para quem já sabe o que procura.
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { EmpiricaLayout } from './EmpiricaLayout';
import { EmpiricaBanner } from './EmpiricaBanner';
import { useSrmViewport } from '../site/poc2/useSrmViewport';
import { EmpiricaFundCategoryCard } from './EmpiricaFundCategoryCard';
import type { FundCategoryCardData } from './EmpiricaFundCategoryCard';
import { useFundosDaCategoria, FundCard } from './EmpiricaFundoCategoryPage';
import { FundCategory } from './data/empirica-funds';
import { useTheme, DSInput, DSTag, DSEmptyState, DSButton } from '../../../design-system';

// Busca ignorando acento: digitar "lotus" precisa achar "EMPÍRICA LÓTUS".
const semAcento = (s: string) =>
  (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const PAGE_SIZE = 12;

const CATEGORIAS: FundCategoryCardData[] = [
  { code: 'FIDC', label: 'DIREITOS CREDITÓRIOS',  desc: 'Fundos de direitos creditórios com foco em operações de crédito estruturado para diferentes setores da economia.', href: '/fundos/fidc' },
  { code: 'FIF',  label: 'FUNDO FINANCEIRO',      desc: 'Fundo financeiro com alocação em ativos de crédito privado, com diversificação setorial e monitoramento de risco.',  href: '/fundos/fif'  },
  { code: 'FII',  label: 'FUNDO IMOBILIÁRIO',     desc: 'Fundo imobiliário com foco em ativos corporativos e operações estruturadas no setor imobiliário.',                    href: '/fundos/fii'  },
  { code: 'FIP',  label: 'FUNDO EM PARTICIPAÇÕES',desc: 'Fundo em participações voltado a investimentos em empresas e projetos com potencial de crescimento.',                 href: '/fundos/fip'  },
];

const FILTROS: { id: FundCategory | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'fidc',  label: 'FIDC'  },
  { id: 'fif',   label: 'FIF'   },
  { id: 'fii',   label: 'FII'   },
  { id: 'fip',   label: 'FIP'   },
];

function FiltroChip({ ativo, label, onClick }: { ativo: boolean; label: string; onClick: () => void }) {
  const { tokens: t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '7px 16px',
        borderRadius: 999,
        border: `1px solid ${ativo ? t.neutral900 : t.borderDefault}`,
        background: ativo ? t.neutral900 : (hov ? t.surfaceMuted : t.surfaceDefault),
        color: ativo ? t.neutral0 : t.textSecondary,
        fontFamily: t.fontFamily,
        fontSize: t.textSm,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .15s',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </button>
  );
}

export default function EmpiricaHomePage() {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();
  const navigate = useNavigate();

  const todos = useFundosDaCategoria();           // sem categoria = todos os fundos
  const [query, setQuery]   = useState('');
  const [filtro, setFiltro] = useState<FundCategory | 'todos'>('todos');
  const [visiveis, setVisiveis] = useState(PAGE_SIZE);

  const filtrados = useMemo(() => {
    const q = semAcento(query);
    return todos.filter(f => {
      if (filtro !== 'todos' && f.category !== filtro) return false;
      if (!q) return true;
      return semAcento(f.shortName).includes(q) || semAcento(f.fullName).includes(q);
    });
  }, [todos, query, filtro]);

  const exibidos = filtrados.slice(0, visiveis);
  const temMais  = filtrados.length > visiveis;
  const resetar  = () => { setVisiveis(PAGE_SIZE); };

  return (
    <EmpiricaLayout>
      <EmpiricaBanner
        title="Fundos Empírica"
        subtitle="Materiais e documentos dos fundos sob gestão. Voltados a Investidores Profissionais e Qualificados."
        badge="Gestora CVM"
      />

      {/* ── Categorias ── */}
      <section style={{
        background: t.surfaceMuted,
        padding: isMobile ? '48px 0 56px' : '60px 0 72px',
        width: '100%', boxSizing: 'border-box' as const,
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: isMobile ? '0 24px' : '0 80px', boxSizing: 'border-box' as const }}>
          <DSTag variant="neutral" size="lg">Categorias</DSTag>
          <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: '12px 0 8px', letterSpacing: '-0.03em' }}>
            Navegue por categoria
          </h2>
          <p style={{ fontFamily: t.fontFamily, fontSize: t.textXl, color: t.textSecondary, margin: '0 0 40px', lineHeight: 1.7 }}>
            Selecione a categoria para conhecer os fundos disponíveis.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 20 }}>
            {CATEGORIAS.map(c => <EmpiricaFundCategoryCard key={c.code} card={c} />)}
          </div>
        </div>
      </section>

      {/* ── Lista completa com busca ── */}
      <section style={{
        background: t.surfaceBackground,
        padding: isMobile ? '48px 0 80px' : '64px 0 96px',
        width: '100%', boxSizing: 'border-box' as const,
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: isMobile ? '0 20px' : '0 56px', boxSizing: 'border-box' as const }}>
          <DSTag variant="neutral" size="lg">Todos os fundos</DSTag>
          <h2 style={{ fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700, color: t.primary800, margin: '12px 0 24px', letterSpacing: '-0.03em' }}>
            Encontre um fundo
          </h2>

          <div style={{ marginBottom: 16 }}>
            <DSInput
              type="search"
              size="md"
              placeholder="Buscar fundo..."
              value={query}
              onChange={v => { setQuery(v); resetar(); }}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 20 }}>
            {FILTROS.map(f => (
              <FiltroChip
                key={f.id}
                label={f.label}
                ativo={filtro === f.id}
                onClick={() => { setFiltro(f.id); resetar(); }}
              />
            ))}
          </div>

          <p style={{ fontFamily: t.fontFamily, fontSize: t.textSm, color: t.textSecondary, margin: '0 0 16px' }}>
            {filtrados.length} {filtrados.length === 1 ? 'fundo' : 'fundos'}
            {filtro !== 'todos' ? ` em ${filtro.toUpperCase()}` : ''}
            {query.trim() ? ` para "${query.trim()}"` : ''}
          </p>

          {filtrados.length === 0 ? (
            <DSEmptyState
              variant="search"
              headline="Nenhum fundo encontrado"
              body="Tente outras palavras-chave ou remova o filtro de categoria."
              withAction
              actionLabel="Limpar busca"
              onAction={() => { setQuery(''); setFiltro('todos'); resetar(); }}
              style={{ padding: '48px 0' }}
            />
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {exibidos.map(fund => (
                  <FundCard
                    key={`${fund.category}-${fund.slug}`}
                    fund={fund}
                    onClick={() => navigate(`/fundos/${fund.category}/${fund.slug}`)}
                  />
                ))}
              </div>

              {temMais && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                  <DSButton variant="secondary" size="md" onClick={() => setVisiveis(c => c + PAGE_SIZE)}>
                    Carregar mais ({Math.min(PAGE_SIZE, filtrados.length - visiveis)})
                  </DSButton>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </EmpiricaLayout>
  );
}
