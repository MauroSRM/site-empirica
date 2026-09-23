import React from 'react'
import { DSTag } from './DSTag'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type AuditItemState = 'done' | 'active' | 'pending'

interface AuditItem {
  state: AuditItemState
  timestamp: string
  actor: string
  action: string
  tag?: { variant: 'info' | 'success' | 'warning' | 'neutral-brand1'; label: string }
}

interface DSAuditLineProps {
  items: AuditItem[]
}

export function DSAuditLine({ items }: DSAuditLineProps) {
  const { tokens: t } = useTheme()

  const dotColor = (s: AuditItemState) =>
    s === 'done' ? t.brandPrimary : s === 'active' ? t.brandAccent : 'transparent'
  const dotBorder = (s: AuditItemState) =>
    s === 'pending' ? `2px solid ${t.borderDefault}` : 'none'
  const lineColor = (s: AuditItemState) =>
    s === 'done' ? t.brandPrimaryLight : t.borderDefault

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: t.fontFamily }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '12px' }}>
          {/* Timeline column */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: t.radiusFull, marginTop: '14px',
              backgroundColor: dotColor(item.state),
              border: dotBorder(item.state),
              flexShrink: 0,
            }} />
            {i < items.length - 1 && (
              <div style={{ width: '1px', flex: 1, minHeight: '16px', backgroundColor: lineColor(item.state), marginTop: '2px', marginBottom: '2px' }} />
            )}
          </div>
          {/* Content */}
          <div style={{ paddingBottom: i < items.length - 1 ? '16px' : '0', paddingTop: '8px', minWidth: 0 }}>
            <span style={{ fontSize: '11px', color: t.textTertiary, display: 'block', lineHeight: '16px' }}>{item.timestamp}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary }}>{item.actor}</span>
              <span style={{ fontSize: '12px', fontWeight: 400, color: t.textSecondary }}>{item.action}</span>
              {item.tag && <DSTag variant={item.tag.variant} size="sm">{item.tag.label}</DSTag>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSAuditLineSection() {
  const { tokens: t } = useTheme()

  const items: AuditItem[] = [
    { state: 'done',    timestamp: '09:14', actor: 'Patricia Gomes', action: 'iniciou análise da transação #TRX-001' },
    { state: 'done',    timestamp: '09:18', actor: 'Patricia Gomes', action: 'solicitou confirmação ao Master', tag: { variant: 'info', label: 'Aguardando' } },
    { state: 'done',    timestamp: '09:22', actor: 'Carlos Mendes',  action: 'confirmou contrato vigente', tag: { variant: 'success', label: 'Aprovado' } },
    { state: 'active',  timestamp: '09:22', actor: 'Sistema',        action: 'processando liberação compliance' },
    { state: 'pending', timestamp: '—:—',   actor: 'Patricia Gomes', action: 'decisão final pendente' },
  ]

  return (
    <DSDocSection
      description="Linha do tempo vertical de auditoria com estados done, active e pending. Exibe sequência de ações de usuários e sistema em fluxos de compliance, aprovação e rastreabilidade de operações."
      whenToUse={['Rastreabilidade de análise de compliance PLD', 'Histórico de aprovações em fluxo de autorização', 'Log de ações em operação financeira auditável']}
      whenNotToUse={['Log técnico de sistema (use tabela de logs)', 'Progresso de formulário (use DSStepper)', 'Notificações sem contexto temporal (use DSNotificationDrawer)']}
      preview={
        <div style={{ maxWidth: '480px', fontFamily: t.fontFamily }}>
          <Labeled component="DSAuditLine" props="items={[...]}">
            <DSAuditLine items={items} />
          </Labeled>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Item done', token: 't.feedbackSuccess', descricao: 'Ícone e marcador de etapa concluída' },
          { elemento: 'Item active', token: 't.brandPrimary', descricao: 'Ícone e marcador de etapa ativa' },
          { elemento: 'Item pending', token: 't.borderMedium', descricao: 'Ícone e marcador de etapa pendente' },
          { elemento: 'Linha conectora', token: 't.borderDefault', descricao: 'Linha vertical entre itens' },
          { elemento: 'Timestamp', token: 't.textTertiary', descricao: 'Cor do horário da ação' },
          { elemento: 'Actor', token: 't.textPrimary', descricao: 'Nome do responsável pela ação' },
          { elemento: 'Ação', token: 't.textSecondary', descricao: 'Descrição da ação realizada' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'items', tipo: 'AuditItem[]', default: '—', descricao: 'Array de itens de auditoria (obrigatório)' },
          { prop: 'item.state', tipo: "'done' | 'active' | 'pending'", default: '—', descricao: 'Estado visual do item na linha do tempo' },
          { prop: 'item.timestamp', tipo: 'string', default: '—', descricao: 'Horário ou marcador temporal do evento' },
          { prop: 'item.actor', tipo: 'string', default: '—', descricao: 'Nome do usuário ou sistema responsável' },
          { prop: 'item.action', tipo: 'string', default: '—', descricao: 'Descrição da ação realizada' },
          { prop: 'item.tag', tipo: '{ variant, label }', default: 'undefined', descricao: 'Badge opcional no item (ex: Aprovado, Aguardando)' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='list' na timeline · role='listitem' em cada entrada · estados comunicados via texto visível"
          keyboard="Não interativo — não recebe foco"
          screenReader="Estado lido junto com ação: 'Concluído — Patricia Gomes iniciou análise às 09:14' · Tag com label descritivo"
          contrast="feedbackSuccess e brandPrimary verificados sobre fundo · borderMedium para pending com texto legível"
          focus="Sem foco — componente puramente de exibição"
        /> },
      ]}
    />
  )
}
