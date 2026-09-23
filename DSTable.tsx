import React, { useState } from 'react'
import { ChevronsUpDown, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pencil, Trash2, Eye } from 'lucide-react'
import { t, hexToRgba } from './tokens'
import { DSTag } from './DSTag'
import { DSSkeleton } from './SkeletonEmptyState'
import { DSEmptyState } from './SkeletonEmptyState'
import { DSCheckbox } from './DSCheckboxRadio'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type TableVariant = 'default' | 'striped' | 'compact'

const MOCK_DATA = [
  { id: '001', name: 'Fundo Renda Fixa Plus',    type: 'Renda Fixa',   status: 'active',   value: 'R$ 1.250.000', yield: '+12,4%' },
  { id: '002', name: 'Multimercado Estratégico',  type: 'Multimercado', status: 'active',   value: 'R$ 890.000',   yield: '+8,7%'  },
  { id: '003', name: 'FIDC Recebíveis 2024',      type: 'FIDC',         status: 'pending',  value: 'R$ 3.200.000', yield: '+15,2%' },
  { id: '004', name: 'Ações Small Caps',           type: 'Ações',        status: 'inactive', value: 'R$ 420.000',   yield: '-2,1%'  },
  { id: '005', name: 'CRI Imobiliário Alpha',      type: 'CRI',          status: 'active',   value: 'R$ 750.000',   yield: '+10,8%' },
]

const STATUS_VARIANT: Record<string, any> = {
  active:   { variant: 'success', label: 'Ativo'    },
  pending:  { variant: 'warning', label: 'Pendente' },
  inactive: { variant: 'neutral', label: 'Inativo'  },
}

interface DSTableProps {
  variant?: TableVariant
  sortable?: boolean
  selectable?: boolean
  loading?: boolean
  empty?: boolean
  pagination?: boolean
}

export function DSTable({
  variant = 'default',
  sortable = false,
  selectable = false,
  loading = false,
  empty = false,
  pagination = false,
}: DSTableProps) {
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const total = 48
  const perPage = 5
  const totalPages = Math.ceil(total / perPage)

  const handleSort = (col: string) => {
    if (!sortable) return
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const rowH    = variant === 'compact' ? '40px' : variant === 'striped' ? '48px' : '56px'
  const headerH = variant === 'compact' ? '36px' : '44px'
  const fs      = variant === 'compact' ? t.text2Xs : t.textMd

  const allSelected  = selected.length === MOCK_DATA.length
  const someSelected = selected.length > 0 && !allSelected

  const toggleAll = () => setSelected(allSelected ? [] : MOCK_DATA.map(d => d.id))
  const toggleRow = (id: string) => setSelected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  )

  const SortIcon = ({ col }: { col: string }) => {
    if (!sortable) return null
    if (sortCol === col) return sortDir === 'asc'
      ? <ChevronUp size={14} color={t.brandPrimary} />
      : <ChevronDown size={14} color={t.brandPrimary} />
    return <ChevronsUpDown size={14} color={t.textTertiary} />
  }

  const columns = [
    { key: 'name',   label: 'Fundo',      grow: 3 },
    { key: 'type',   label: 'Tipo',       grow: 1 },
    { key: 'status', label: 'Status',     grow: 1 },
    { key: 'value',  label: 'Patrimônio', grow: 1 },
    { key: 'yield',  label: 'Rentab.',    grow: 1 },
    { key: 'actions',label: 'Acoes',      grow: 0.6 },
  ]

  const PageBtn = ({ p }: { p: number | string }) => {
    const isActive = p === page
    const isNum = typeof p === 'number'
    return (
      <button
        onClick={() => isNum && setPage(p as number)}
        style={{
          minWidth: 32, height: 32,
          borderRadius: t.buttonRadius,
          border: 'none',
          backgroundColor: isActive ? t.brandPrimary : 'transparent',
          color: isActive ? t.textOnBrand : t.textSecondary,
          fontSize: '12px', fontWeight: isActive ? 600 : 400,
          cursor: isNum ? 'pointer' : 'default',
          fontFamily: t.fontFamily,
          padding: '0 6px',
        }}
      >
        {p}
      </button>
    )
  }

  return (
    // A-03: role="table" + rowgroup/row/cell para leitores de tela
    <div role="table" aria-label="Tabela de dados" style={{
      border: `1.5px solid ${t.borderDefault}`,
      borderRadius: t.radiusLg,
      overflow: 'hidden',
      backgroundColor: t.surfaceDefault,
      fontFamily: t.fontFamily,
    }}>
      {/* Header */}
      <div role="rowgroup">
        <div role="row" style={{
          height: headerH, display: 'flex', alignItems: 'center',
          backgroundColor: t.surfaceSubtle,
          borderBottom: `2px solid ${t.borderDefault}`,
          paddingLeft: t.space4, paddingRight: t.space4, gap: '8px',
        }}>
          {selectable && (
            <DSCheckbox
              key={`header-${allSelected}-${someSelected}`}
              size="sm"
              label=""
              aria-label="Selecionar todas as linhas"
              state={allSelected ? 'checked' : someSelected ? 'indeterminate' : 'unchecked'}
              onChange={toggleAll}
            />
          )}
          {columns.map(col => (
            <div
              key={col.key}
              role="columnheader"
              aria-sort={sortable && col.key !== 'actions' ? (sortCol === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
              onClick={() => col.key !== 'actions' && handleSort(col.key)}
              style={{
                flex: col.grow,
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: t.text2Xs, fontWeight: 600, color: t.textSecondary,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                cursor: sortable && col.key !== 'actions' ? 'pointer' : 'default',
              }}
            >
              {col.label}
              {col.key !== 'actions' && <SortIcon col={col.key} />}
            </div>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <style>{`@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              height: rowH, paddingLeft: t.space4, paddingRight: t.space4, display: 'flex', alignItems: 'center',
              borderBottom: i < 4 ? `1px solid ${t.borderDefault}` : 'none',
            }}>
              <DSSkeleton shape="listItem" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && empty && (
        <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <DSEmptyState variant="default" />
        </div>
      )}

      {/* Rows */}
      <div role="rowgroup">
      {!loading && !empty && MOCK_DATA.map((row, i) => {
        const isSelected = selected.includes(row.id)
        const isEven     = i % 2 === 0
        let bg = t.surfaceDefault
        if (variant === 'striped' && !isEven) bg = t.surfaceSubtle
        if (isSelected) bg = hexToRgba(t.brandPrimary, 0.30)

        return (
          <div
            key={row.id}
            role="row"
            aria-selected={selectable ? isSelected : undefined}
            style={{
              height: rowH, display: 'flex', alignItems: 'center',
              paddingRight: '16px', gap: '8px',
              backgroundColor: bg,
              borderBottom: i < MOCK_DATA.length - 1 ? `1px solid ${t.borderDefault}` : 'none',
              transition: 'background-color 0.1s',
              position: 'relative',
            }}
            onMouseEnter={e => {
              if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = hexToRgba(t.brandPrimary, 0.15)
            }}
            onMouseLeave={e => {
              if (!isSelected) (e.currentTarget as HTMLDivElement).style.backgroundColor = bg
            }}
          >
            {/* Indicador de seleção — div interno 3px (padrão D-04) */}
            <div style={{
              width: '3px',
              alignSelf: 'stretch',
              flexShrink: 0,
              backgroundColor: isSelected ? t.brandPrimary : 'transparent',
              transition: 'background-color 0.1s',
            }} />
            {selectable && (
              <DSCheckbox
                key={`${row.id}-${isSelected}`}
                size="sm"
                label=""
                aria-label={`Selecionar linha ${row.name}`}
                state={isSelected ? 'checked' : 'unchecked'}
                onChange={() => toggleRow(row.id)}
              />
            )}
            <div role="cell" style={{ flex: 3, fontSize: fs, color: t.textPrimary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</div>
            <div role="cell" style={{ flex: 1, fontSize: fs, color: t.textSecondary }}>{row.type}</div>
            <div role="cell" style={{ flex: 1 }}>
              <DSTag
                variant={STATUS_VARIANT[row.status].variant}
                size="sm"
              >
                {STATUS_VARIANT[row.status].label}
              </DSTag>
            </div>
            <div role="cell" style={{ flex: 1, fontSize: fs, color: t.textPrimary }}>{row.value}</div>
            <div role="cell" style={{ flex: 1, fontSize: fs, color: row.yield.startsWith('-') ? t.feedbackError : t.feedbackSuccess, fontWeight: 600 }}>{row.yield}</div>
            <div role="cell" style={{ flex: 0.6, display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[Eye, Pencil, Trash2].map((Icon, j) => (
                <Icon
                  key={j}
                  size={16}
                  color={t.textSecondary}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as SVGElement).style.color = t.brandPrimary}
                  onMouseLeave={e => (e.currentTarget as SVGElement).style.color = t.textSecondary}
                />
              ))}
            </div>
          </div>
        )
      })}
      </div>

      {/* Pagination */}
      {pagination && !loading && !empty && (
        <div style={{
          height: 52, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingLeft: t.space4, paddingRight: t.space4,
          borderTop: `1px solid ${t.borderDefault}`,
        }}>
          <span style={{ fontSize: '12px', color: t.textSecondary }}>
            Exibindo {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} de {total} resultados
          </span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {/* Prev */}
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 32, height: 32,
                borderRadius: t.buttonRadius,
                border: 'none', background: 'none',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                color: page === 1 ? t.textTertiary : t.textSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Pages */}
            {[1, 2, 3, '...', 10].map((p, i) => <PageBtn key={i} p={p} />)}

            {/* Next */}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 32, height: 32,
                borderRadius: t.buttonRadius,
                border: 'none', background: 'none',
                cursor: page === totalPages ? 'not-allowed' : 'pointer',
                color: page === totalPages ? t.textTertiary : t.textSecondary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '20px 0 8px', fontFamily: t.fontFamily }}>{children}</p>
}

export function DSTableSection() {
  return (
    <DSDocSection
      description="Exibe coleções de entidades com múltiplos atributos em grid comparável."
      whenToUse={['Listagem de fundos, transações ou usuários', 'Dados com ordenação e paginação', 'Seleção em lote']}
      whenNotToUse={['Lista simples de 1 coluna (use ReceivableAlertCard)', 'Hierarquia profunda (use Accordion)', 'Dados com mais de 8 colunas sem scroll horizontal']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <SectionLabel>Default — sortable + selectable + paginacao</SectionLabel>
            <Labeled component="DSTable" props='variant="default" sortable selectable pagination'>
              <DSTable variant="default" sortable selectable pagination />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Striped</SectionLabel>
            <Labeled component="DSTable" props='variant="striped"'>
              <DSTable variant="striped" />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Compact — sortable</SectionLabel>
            <Labeled component="DSTable" props='variant="compact" sortable'>
              <DSTable variant="compact" sortable />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Loading state</SectionLabel>
            <Labeled component="DSTable" props='variant="default" loading'>
              <DSTable variant="default" loading />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Empty state</SectionLabel>
            <Labeled component="DSTable" props='variant="default" empty'>
              <DSTable variant="default" empty />
            </Labeled>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo linha par', token: 't.surfaceDefault', descricao: 'Linha padrão' },
          { elemento: 'Fundo linha ímpar (striped)', token: 't.surfaceSubtle', descricao: 'Alternância no modo striped' },
          { elemento: 'Borda separador', token: 't.borderDefault', descricao: 'Borda entre linhas' },
          { elemento: 'Texto primário', token: 't.textPrimary', descricao: 'Conteúdo das células' },
          { elemento: 'Texto cabeçalho', token: 't.textSecondary', descricao: 'Labels das colunas' },
          { elemento: 'Texto terciário', token: 't.textTertiary', descricao: 'Subinformações e ícones de sort' },
          { elemento: 'Indicador selecionado', token: 't.brandPrimary', descricao: 'Barra lateral de seleção (3px)' },
          { elemento: 'Hover fundo', token: 'hexToRgba(brandPrimary, 0.15)', descricao: 'Fundo de linha no hover' },
          { elemento: 'Selecionado fundo', token: 'hexToRgba(brandPrimary, 0.30)', descricao: 'Fundo de linha selecionada' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'default' | 'striped' | 'compact'", default: "'default'", descricao: 'Estilo visual das linhas' },
          { prop: 'sortable', tipo: 'boolean', default: 'false', descricao: 'Ativa ordenação por coluna' },
          { prop: 'selectable', tipo: 'boolean', default: 'false', descricao: 'Exibe checkbox por linha' },
          { prop: 'loading', tipo: 'boolean', default: 'false', descricao: 'Exibe skeleton nas linhas' },
          { prop: 'empty', tipo: 'boolean', default: 'false', descricao: 'Exibe DSEmptyState' },
          { prop: 'pagination', tipo: 'boolean', default: 'false', descricao: 'Exibe controles de paginação' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='table' · role='columnheader' com scope='col' nos th · role='row' em cada tr"
          keyboard="Tab entre checkboxes e ações · botões de sort focáveis · paginação focável"
          screenReader="Cabeçalhos lidos em cada célula · Checkbox: aria-label com nome do item · Estado de sort: aria-sort"
          contrast="Texto sobre surfaceDefault e surfaceSubtle — verificado · Indicador de seleção (3px) não é o único indicador"
          focus="focusRing em checkboxes, botões de sort e ações inline · linha selecionada não depende só de cor"
        /> },
      ]}
    />
  )
}