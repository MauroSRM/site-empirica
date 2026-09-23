import React, { useState } from 'react'
import { User, Clock, Wallet, X, Check, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { DSButton } from './DSButton'
import { DSTag } from './DSTag'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type ApprovalState = 'default' | 'loading' | 'approved' | 'rejected'
export type ApprovalStatus = 'approved' | 'pending' | 'rejected'

interface DSApprovalCardProps {
  title: string
  sender: string
  time: string
  value: string
  tag?: string
  initialState?: ApprovalState
  status?: ApprovalStatus
  statusLabel?: string
}

export function DSApprovalCard({ title, sender, time, value, tag = 'Lote', initialState = 'default', status, statusLabel }: DSApprovalCardProps) {
  const { tokens: t } = useTheme()
  const [state, setState] = useState<ApprovalState>(initialState)

  const STATUS_MAP: Record<ApprovalStatus, { label: string; color: string; bg: string }> = {
    approved: { label: 'Aprovado',   color: t.feedbackSuccess, bg: t.feedbackSuccessBg },
    pending:  { label: 'Em análise', color: t.feedbackWarning, bg: t.feedbackWarningBg },
    rejected: { label: 'Reprovado',  color: t.feedbackError,   bg: t.feedbackErrorBg   },
  }
  const statusConfig = status ? STATUS_MAP[status] : null
  const displayLabel = statusLabel ?? statusConfig?.label

  const isApproved = state === 'approved'
  const isRejected = state === 'rejected'
  const isDone = isApproved || isRejected

  return (
    <div style={{
      width: '100%',
      padding: '16px',
      borderRadius: t.cardRadius,
      backgroundColor: t.surfaceDefault,
      border: `1px solid ${isApproved ? t.feedbackSuccess : isRejected ? t.feedbackError : t.borderDefault}`,
      fontFamily: t.fontFamily,
      transition: 'background-color 0.2s, border-color 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: t.textPrimary, lineHeight: '20px', flex: 1, minWidth: 0 }}>{title}</span>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {statusConfig && (
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: statusConfig.color,
              backgroundColor: statusConfig.bg,
              borderRadius: t.radiusFull,
              padding: '2px 8px',
              fontFamily: t.fontFamily,
            }}>
              {displayLabel}
            </span>
          )}
          <DSTag variant="neutral-brand1" size="sm">{tag}</DSTag>
        </div>
      </div>
      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: t.textSecondary }}>
          <User size={12} color={t.textTertiary} />{sender}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: t.textSecondary }}>
          <Clock size={12} color={t.textTertiary} />{time}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: t.textSecondary }}>
          <Wallet size={12} color={t.textTertiary} /><strong style={{ color: t.textPrimary }}>{value}</strong>
        </span>
      </div>
      {/* Actions */}
      <div style={{ marginTop: '16px' }}>
        {!isDone && state === 'loading' && (
          <p style={{ fontSize: '11px', color: t.textTertiary, textAlign: 'center', margin: '0 0 8px' }}>Processando...</p>
        )}
        {!isDone ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <DSButton variant="destructive" size="sm" icon="left" iconEl={<X size={14} />} loading={state === 'loading'} onClick={() => setState('rejected')}>
              Rejeitar
            </DSButton>
            <DSButton variant="primary" size="sm" icon="left" iconEl={<Check size={14} />} loading={state === 'loading'} onClick={() => setState('approved')}>
              Aprovar
            </DSButton>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isApproved
              ? <CheckCircle2 size={16} color={t.feedbackSuccess} />
              : <XCircle size={16} color={t.feedbackError} />}
            <span style={{ fontSize: '12px', color: isApproved ? t.feedbackSuccess : t.feedbackError, fontWeight: 500 }}>
              {isApproved ? 'Aprovado · Carlos Mendes · agora' : 'Rejeitado · Carlos Mendes · há 1min'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSApprovalCardSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Card de aprovação de operação com estados interativos (default → loading → approved/rejected). Usado em filas de compliance, aprovação de lotes de pagamento e fluxos de autorização de 2 fatores."
      whenToUse={['Fila de aprovação de lote de pagamentos', 'Autorização de operação por segundo fator humano', 'Dashboard de compliance com ações pendentes']}
      whenNotToUse={['Aprovação de documentos (use contexto de upload)', 'Validação de formulário (use feedback inline)', 'Confirmação simples de 1 clique (use Modal de confirmação)']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
          <div>
            <SectionLabel>Default (interativo — clique para aprovar/rejeitar)</SectionLabel>
            <Labeled component="DSApprovalCard" props='title="..." sender="..." time="..." value="..."'>
              <DSApprovalCard title="Importação Pagamentos · Lote #LP-2026-001" sender="João Silva" time="há 2h" value="R$ 287.430,00" />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Loading</SectionLabel>
            <Labeled component="DSApprovalCard" props='initialState="loading"'>
              <DSApprovalCard title="Importação Pagamentos · Lote #LP-2026-002" sender="Maria Souza" time="há 5min" value="R$ 45.000,00" initialState="loading" />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Aprovado</SectionLabel>
            <Labeled component="DSApprovalCard" props='initialState="approved"'>
              <DSApprovalCard title="Importação Pagamentos · Lote #LP-2026-003" sender="Pedro Costa" time="há 30min" value="R$ 120.000,00" initialState="approved" />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Rejeitado</SectionLabel>
            <Labeled component="DSApprovalCard" props='initialState="rejected"'>
              <DSApprovalCard title="Importação Pagamentos · Lote #LP-2026-004" sender="Ana Lima" time="há 1h" value="R$ 890.000,00" initialState="rejected" />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Com prop status (badge externo)</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Labeled component="DSApprovalCard" props='status="approved"'>
                <DSApprovalCard title="Pagamentos TED · Lote #LP-2026-010" sender="Carlos Melo" time="há 10min" value="R$ 32.000,00" status="approved" />
              </Labeled>
              <Labeled component="DSApprovalCard" props='status="pending"'>
                <DSApprovalCard title="Pagamentos Pix · Lote #LP-2026-011" sender="Julia Santos" time="há 20min" value="R$ 18.500,00" status="pending" />
              </Labeled>
              <Labeled component="DSApprovalCard" props='status="rejected" statusLabel="Reprovado pelo gestor"'>
                <DSApprovalCard title="Pagamentos CNAB · Lote #LP-2026-012" sender="Roberto Lima" time="há 45min" value="R$ 210.000,00" status="rejected" statusLabel="Reprovado pelo gestor" />
              </Labeled>
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo default', token: 't.surfaceDefault', descricao: 'Fundo do card no estado padrão' },
          { elemento: 'Borda', token: 't.borderDefault', descricao: 'Contorno do card' },
          { elemento: 'Estado aprovado', token: 't.feedbackSuccessBg / t.feedbackSuccess', descricao: 'Fundo e texto no estado approved' },
          { elemento: 'Estado rejeitado', token: 't.feedbackErrorBg / t.feedbackError', descricao: 'Fundo e texto no estado rejected' },
          { elemento: 'Tag de lote', token: 't.brandPrimary', descricao: 'Badge de identificação do tipo' },
          { elemento: 'Valor', token: 't.textPrimary', descricao: 'Valor da transação em destaque' },
          { elemento: 'Radius', token: 't.radiusLg', descricao: 'Arredondamento do card' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'title', tipo: 'string', default: '—', descricao: 'Título da operação (obrigatório)' },
          { prop: 'sender', tipo: 'string', default: '—', descricao: 'Nome do solicitante (obrigatório)' },
          { prop: 'time', tipo: 'string', default: '—', descricao: 'Tempo relativo da solicitação (obrigatório)' },
          { prop: 'value', tipo: 'string', default: '—', descricao: 'Valor da operação formatado (obrigatório)' },
          { prop: 'tag', tipo: 'string', default: "'Lote'", descricao: 'Label do badge de tipo' },
          { prop: 'initialState', tipo: 'ApprovalState', default: "'default'", descricao: 'Estado inicial do card' },
          { prop: 'status', tipo: "'approved' | 'pending' | 'rejected'", default: 'undefined', descricao: 'Status externo para exibir badge colorido no header' },
          { prop: 'statusLabel', tipo: 'string', default: 'undefined', descricao: 'Override do label padrão do status (ex: "Aprovado pelo gestor")' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='article' recomendado · Botões Aprovar/Rejeitar com role='button' nativo"
          keyboard="Tab navega entre botões · Enter/Space para acionar · Esc para cancelar loading"
          screenReader="Botões: aria-label='Aprovar operação [título]' / 'Rejeitar operação [título]' · Estado final anunciado via aria-live"
          contrast="feedbackSuccess e feedbackError sobre seus respectivos fundos — verificado"
          focus="focusRing nos botões de ação · foco movido para estado de resultado ao completar"
        /> },
      ]}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', fontFamily: t.fontFamily }}>{children}</p>
}
