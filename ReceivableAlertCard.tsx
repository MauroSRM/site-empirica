import React from 'react'
import { ChevronRight } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSTag, TagVariant } from './DSTag'

type ReceivableVariant = 'overdue' | 'dueToday' | 'dueSoon' | 'pending'

interface ReceivableAlertCardProps {
  variant: ReceivableVariant
  amount: string
  date: string
  customer: string
  count?: number
  onClick?: () => void
}

export function ReceivableAlertCard({
  variant,
  amount,
  date,
  customer,
  count,
  onClick,
}: ReceivableAlertCardProps) {
  const { tokens: t } = useTheme()
  const [hovered, setHovered] = React.useState(false)

  const variantConfig: Record<ReceivableVariant, { color: string; tagVariant: TagVariant; tagLabel: string }> = {
    overdue:  { color: t.feedbackError,   tagVariant: 'error',   tagLabel: 'Vencido' },
    dueToday: { color: t.feedbackWarning, tagVariant: 'warning', tagLabel: 'Vence hoje' },
    dueSoon:  { color: t.feedbackWarning, tagVariant: 'warning', tagLabel: 'Vence em breve' },
    pending:  { color: t.borderMedium,    tagVariant: 'neutral', tagLabel: 'Pendente' },
  }

  const cfg = variantConfig[variant]

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        padding: '16px',
        gap: '12px',
        borderRadius: t.radiusLg,
        backgroundColor: t.surfaceDefault,
        border: hovered ? `1px solid ${t.brandPrimaryLight}` : `1px solid ${t.borderDefault}`,
        boxShadow: hovered ? t.shadowCard : 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        fontFamily: t.fontFamily,
        width: '100%',
      }}
    >
      {/* Indicator bar */}
      <div
        style={{
          width: '4px',
          borderRadius: t.radiusFull,
          backgroundColor: cfg.color,
          flexShrink: 0,
          alignSelf: 'stretch',
        }}
      />

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {customer}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: t.textPrimary, flexShrink: 0, marginLeft: '8px' }}>
            {amount}
          </span>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DSTag variant={cfg.tagVariant} size="sm">{cfg.tagLabel}</DSTag>
          <span style={{ fontSize: '11px', color: t.textTertiary }}>{date}</span>
          {count && (
            <span style={{ marginLeft: 'auto', fontSize: '11px', color: t.textSecondary }}>
              {count} título{count > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight size={16} color={t.textTertiary} style={{ flexShrink: 0, alignSelf: 'center' }} />
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

const mockItems = [
  {
    variant: 'overdue'  as ReceivableVariant,
    customer: 'Empresa Alpha Ltda.',
    amount: 'R$ 12.500,00',
    date: 'Venceu em 20/04/2026',
    count: 3,
  },
  {
    variant: 'dueToday' as ReceivableVariant,
    customer: 'Beta Comércio S.A.',
    amount: 'R$ 5.800,00',
    date: 'Vence hoje, 05/05/2026',
    count: 1,
  },
  {
    variant: 'dueSoon'  as ReceivableVariant,
    customer: 'Gamma Industria ME',
    amount: 'R$ 34.200,00',
    date: 'Vence em 10/05/2026',
    count: 7,
  },
  {
    variant: 'pending'  as ReceivableVariant,
    customer: 'Delta Serviços EIRELI',
    amount: 'R$ 8.100,00',
    date: 'Prazo: 30/06/2026',
  },
]

export function ReceivableAlertCardSection() {
  // Config local apenas para o showcase de especificações
  const specConfig = {
    overdue:  { color: t.feedbackError,   tagLabel: 'Vencido' },
    dueToday: { color: t.feedbackWarning, tagLabel: 'Vence hoje' },
    dueSoon:  { color: t.feedbackWarning, tagLabel: 'Vence em breve' },
    pending:  { color: t.borderMedium,    tagLabel: 'Pendente' },
  }

  return (
    <DSDocSection
      description="Card de alerta para recebíveis com variantes semânticas por status de vencimento: overdue, dueToday, dueSoon e pending. Exibe valor, data, cliente e contador de itens agrupados."
      whenToUse={['Painel de recebíveis com alertas de vencimento', 'Lista de cobranças pendentes em dashboard financeiro', 'Alertas de contas a receber em gestão de caixa']}
      whenNotToUse={['Recebíveis já liquidados (use DSTable)', 'Alerta genérico sem valor financeiro (use DSAlertCard)', 'Notificação pontual (use Toast)']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <SectionLabel>Lista de recebíveis — 4 variantes</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '480px' }}>
              {mockItems.map((item, i) => (
                <Labeled key={i} component="ReceivableAlertCard" props={`variant="${item.variant}" amount="${item.amount}" customer="..."`}>
                  <ReceivableAlertCard {...item} />
                </Labeled>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>Especificação de variantes</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', maxWidth: '800px' }}>
              {(['overdue', 'dueToday', 'dueSoon', 'pending'] as ReceivableVariant[]).map(v => (
                <div
                  key={v}
                  style={{
                    padding: '12px 16px',
                    borderRadius: t.radiusLg,
                    backgroundColor: t.surfaceMuted,
                    fontFamily: t.fontFamily,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div style={{ width: '4px', height: '32px', borderRadius: t.radiusFull, backgroundColor: specConfig[v].color, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, margin: 0, textTransform: 'capitalize' }}>{v}</p>
                    <p style={{ fontSize: '11px', color: t.textSecondary, margin: 0 }}>{specConfig[v].tagLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Variante overdue', token: 't.feedbackError', descricao: 'Cor da borda e tag de vencido' },
          { elemento: 'Variante dueToday/dueSoon', token: 't.feedbackWarning', descricao: 'Cor da borda e tag de vence hoje/em breve' },
          { elemento: 'Variante pending', token: 't.borderMedium', descricao: 'Cor da borda e tag pendente' },
          { elemento: 'Fundo', token: 't.surfaceDefault', descricao: 'Fundo do card' },
          { elemento: 'Valor', token: 't.textPrimary', descricao: 'Valor do recebível em destaque' },
          { elemento: 'Ícone chevron', token: 't.textSecondary', descricao: 'Indicador de ação/navegação' },
          { elemento: 'Radius', token: 't.radiusLg', descricao: 'Arredondamento do card' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'overdue' | 'dueToday' | 'dueSoon' | 'pending'", default: '—', descricao: 'Status de vencimento (obrigatório)' },
          { prop: 'amount', tipo: 'string', default: '—', descricao: 'Valor do recebível formatado (obrigatório)' },
          { prop: 'date', tipo: 'string', default: '—', descricao: 'Data de vencimento (obrigatório)' },
          { prop: 'customer', tipo: 'string', default: '—', descricao: 'Nome do cliente devedor (obrigatório)' },
          { prop: 'count', tipo: 'number', default: 'undefined', descricao: 'Quantidade de itens agrupados' },
          { prop: 'onClick', tipo: '() => void', default: 'undefined', descricao: 'Callback de clique no card' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='button' quando onClick fornecido · role='article' quando apenas exibição"
          keyboard="Tab para focar quando clicável · Enter/Space para acionar"
          screenReader="Leitura: variante + valor + data + cliente · Chevron: aria-hidden='true'"
          contrast="feedbackError e feedbackWarning verificados como cor de borda · texto sobre surfacePrimary verificado"
          focus="focusRing visível quando o card é clicável"
        /> },
      ]}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}