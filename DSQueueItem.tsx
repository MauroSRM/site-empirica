import React, { useState } from 'react'
import { DSRiskBadge, RiskLevel } from './DSRiskBadge'
import { DSTag } from './DSTag'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type QueueItemState = 'default' | 'selected' | 'reviewed'

interface DSQueueItemProps {
  beneficiary: string
  value: string
  datetime: string
  type: string
  risk?: RiskLevel
  initialState?: QueueItemState
}

export function DSQueueItem({ beneficiary, value, datetime, type, risk = 'high', initialState = 'default' }: DSQueueItemProps) {
  const { tokens: t } = useTheme()
  const [state, setState] = useState<QueueItemState>(initialState)
  const [hovered, setHovered] = useState(false)

  const isSelected = state === 'selected'
  const isReviewed = state === 'reviewed'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isReviewed && setState(s => s === 'selected' ? 'default' : 'selected')}
      style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${t.borderDefault}`,
        backgroundColor: isSelected ? t.brandPrimaryLight : isReviewed ? t.surfaceSubtle : hovered ? t.surfaceSubtle : t.surfaceDefault,
        cursor: isReviewed ? 'default' : 'pointer',
        opacity: isReviewed ? 0.6 : 1,
        transition: 'background-color 0.12s',
        fontFamily: t.fontFamily,
        overflow: 'hidden',
        minHeight: '68px',
        paddingLeft: isSelected ? '16px' : '0',
      }}
    >
      {/* Indicator pill — only rendered when selected */}
      {isSelected && (
        <div style={{
          width: '4px',
          height: '42px',
          flexShrink: 0,
          borderRadius: t.radiusFull,
          backgroundColor: t.brandPrimary,
          alignSelf: 'center',
        }} />
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? t.brandPrimary : t.textPrimary, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {beneficiary}
        </span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: t.textPrimary, flexShrink: 0 }}>{value}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}>
        <span style={{ fontSize: '11px', color: t.textTertiary }}>{datetime} · {type}</span>
        {isReviewed
          ? <DSTag variant="success" size="sm">Concluído</DSTag>
          : <DSRiskBadge level={risk} label={risk === 'high' ? 'ALTO RISCO' : risk === 'medium' ? 'RISCO MÉDIO' : 'RISCO BAIXO'} />
        }
      </div>
      </div>
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSQueueItemSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Item de fila de compliance com seleção de estado (default, selected, reviewed), badge de risco e dados de beneficiário/valor. Agrupados em lista de revisão de operações PLD."
      whenToUse={['Fila de análise de compliance PLD', 'Lista de transações para revisão por analista', 'Painel de operações pendentes com classificação de risco']}
      whenNotToUse={['Tabela de dados históricos (use DSTable)', 'Item de aprovação com ações (use DSApprovalCard)', 'Lista de notificações (use DSNotificationDrawer)']}
      preview={
        <div style={{ fontFamily: t.fontFamily }}>
          <SectionLabel style={{ marginBottom: '12px' }}>Interativo — clique para selecionar</SectionLabel>
          <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusLg, overflow: 'hidden' }}>
            <Labeled component="DSQueueItem" props='risk="high" initialState="default"'>
              <DSQueueItem beneficiary="Fornecedor XYZ Materiais" value="R$ 150.000" datetime="Hoje · 11:42" type="TED" risk="high" initialState="default" />
            </Labeled>
            <Labeled component="DSQueueItem" props='risk="medium" initialState="selected"'>
              <DSQueueItem beneficiary="Tech Solutions Ltda" value="R$ 85.500" datetime="Hoje · 09:15" type="PIX" risk="medium" initialState="selected" />
            </Labeled>
            <Labeled component="DSQueueItem" props='risk="low" initialState="reviewed"'>
              <DSQueueItem beneficiary="ABC Importações" value="R$ 32.000" datetime="Ontem · 16:30" type="TED" risk="low" initialState="reviewed" />
            </Labeled>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Estado default', token: 't.surfaceDefault', descricao: 'Fundo do item não selecionado' },
          { elemento: 'Estado selected', token: 't.brandPrimaryLight', descricao: 'Fundo do item em análise' },
          { elemento: 'Estado reviewed', token: 't.surfaceSubtle', descricao: 'Fundo do item já revisado' },
          { elemento: 'Borda selecionado', token: 't.brandPrimary', descricao: 'Borda lateral do item selecionado' },
          { elemento: 'Separador', token: 't.borderDefault', descricao: 'Linha entre itens da fila' },
          { elemento: 'Badge risco', token: 'via DSRiskBadge', descricao: 'Herdado dos tokens de DSRiskBadge/DSTag' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'beneficiary', tipo: 'string', default: '—', descricao: 'Nome do beneficiário da operação (obrigatório)' },
          { prop: 'value', tipo: 'string', default: '—', descricao: 'Valor da transação (obrigatório)' },
          { prop: 'datetime', tipo: 'string', default: '—', descricao: 'Data e hora da operação (obrigatório)' },
          { prop: 'type', tipo: 'string', default: '—', descricao: 'Tipo de transação (PIX, TED, etc.) (obrigatório)' },
          { prop: 'risk', tipo: 'RiskLevel', default: 'undefined', descricao: "Nível de risco: 'high' | 'medium' | 'low' | 'unknown'" },
          { prop: 'initialState', tipo: 'QueueItemState', default: "'default'", descricao: 'Estado inicial do item na fila' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='button' ou role='listitem' com aria-selected · estado communicado via aria-pressed"
          keyboard="Tab para focar · Enter/Space para selecionar"
          screenReader="Leitura: beneficiário + valor + data + tipo + risco · Estado de seleção anunciado"
          contrast="brandPrimaryLight com texto textPrimary verificado · surfaceSubtle com texto verificado"
          focus="focusRing visível · item destacado visualmente ao ser selecionado"
        /> },
      ]}
    />
  )
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', fontFamily: t.fontFamily, ...style }}>{children}</p>
}
