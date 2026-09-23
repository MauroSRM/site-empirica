import React from 'react'
import { TrendingUp, TrendingDown, Minus, Link2Off } from 'lucide-react'
import { DSAvatar } from './DSAvatar'
import { DSButton } from './DSButton'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type TrendDir = 'up' | 'down' | 'neutral'

interface DSAccountCardConnectedProps {
  connected: true
  initials: string
  avatarBg?: string
  name: string
  account: string
  value: string
  trend: TrendDir
  trendLabel: string
}

interface DSAccountCardDisconnectedProps {
  connected: false
  initials: string
  avatarBg?: string
  name: string
  account: string
}

type DSAccountCardProps = DSAccountCardConnectedProps | DSAccountCardDisconnectedProps

export function DSAccountCard(props: DSAccountCardProps) {
  const { tokens: t } = useTheme()
  const { connected, initials, avatarBg, name, account } = props

  if (!connected) {
    return (
      <div style={{
        height: '60px',
        padding: '0 16px',
        borderRadius: t.radiusLg,
        border: `1px solid ${t.borderDefault}`,
        backgroundColor: t.surfaceDefault,
        display: 'flex', alignItems: 'center', gap: '12px',
        fontFamily: t.fontFamily,
      }}>
        <div style={{ width: '24px', height: '24px', borderRadius: t.radiusFull, backgroundColor: t.surfaceMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Link2Off size={12} color={t.textTertiary} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name} · {account}</p>
          <p style={{ fontSize: '11px', color: t.textTertiary, margin: '2px 0 0', lineHeight: '14px' }}>Não conectada</p>
        </div>
        <DSButton variant="primary" size="sm">Conectar</DSButton>
      </div>
    )
  }

  const { value, trend, trendLabel } = props as DSAccountCardConnectedProps
  const trendColor = trend === 'up' ? t.feedbackSuccess : trend === 'down' ? t.feedbackError : t.textTertiary
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div style={{
      height: '60px',
      padding: '0 16px',
      borderRadius: t.radiusLg,
      border: `1px solid ${t.borderDefault}`,
      backgroundColor: t.surfaceDefault,
      display: 'flex', alignItems: 'center', gap: '12px',
      fontFamily: t.fontFamily,
    }}>
      <DSAvatar initials={initials} size="sm" bg={avatarBg} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name} · {account}</p>
        <p style={{ fontSize: '14px', fontWeight: 700, color: t.textPrimary, margin: '2px 0 0', lineHeight: '18px' }}>{value}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <TrendIcon size={12} color={trendColor} />
        <span style={{ fontSize: '11px', fontWeight: 600, color: trendColor }}>{trendLabel}</span>
      </div>
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSAccountCardSection() {
  const { tokens: t } = useTheme()

  return (
    <DSDocSection
      description="Card de conta Open Finance com estado conectado (exibe saldo, trend e avatar) e desconectado (exibe botão de reconexão). Usado em dashboards de visão consolidada de contas externas."
      whenToUse={['Lista de contas Open Finance conectadas no dashboard', 'Overview de saldo consolidado entre instituições', 'Painel de gestão de contas vinculadas']}
      whenNotToUse={['Conta interna da plataforma (use DSBalancePrimary)', 'Lista de transações (use DSTable)', 'KPI simples sem conta associada (use DSKPICard)']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: t.fontFamily }}>
          <div>
            <SectionLabel>Open Finance — contas conectadas</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '640px' }}>
              <Labeled component="DSAccountCard" props='connected initials="BB" trend="up"'><DSAccountCard connected initials="BB" avatarBg="#184987" name="Banco do Brasil" account="1234-5" value="R$ 350.320,12" trend="up" trendLabel="4,2%" /></Labeled>
              <Labeled component="DSAccountCard" props='connected initials="IT" trend="down"'><DSAccountCard connected initials="IT" avatarBg="#b45309" name="Itaú" account="9876-2" value="R$ 278.225,00" trend="down" trendLabel="1,8%" /></Labeled>
              <Labeled component="DSAccountCard" props='connected initials="SA" trend="up"'><DSAccountCard connected initials="SA" avatarBg="#be123c" name="Santander" account="4521-7" value="R$ 94.570,27" trend="up" trendLabel="12,5%" /></Labeled>
              <Labeled component="DSAccountCard" props='connected initials="NB" trend="neutral"'><DSAccountCard connected initials="NB" avatarBg="#7c3aed" name="Nubank" account="3310-0" value="R$ 15.000,00" trend="neutral" trendLabel="0,0%" /></Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Open Finance — conta desconectada</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '640px' }}>
              <Labeled component="DSAccountCard" props='connected={false} initials="CE"'><DSAccountCard connected={false} initials="CE" name="Caixa Econômica" account="5678-3" /></Labeled>
              <Labeled component="DSAccountCard" props='connected={false} initials="BV"'><DSAccountCard connected={false} initials="BV" name="Bradesco" account="0012-9" /></Labeled>
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo', token: 't.surfaceDefault', descricao: 'Fundo do card' },
          { elemento: 'Borda', token: 't.borderDefault', descricao: 'Contorno do card' },
          { elemento: 'Trend up', token: 't.feedbackSuccess', descricao: 'Cor do indicador de crescimento' },
          { elemento: 'Trend down', token: 't.feedbackError', descricao: 'Cor do indicador de queda' },
          { elemento: 'Trend neutral', token: 't.textSecondary', descricao: 'Cor do indicador neutro' },
          { elemento: 'Desconectado', token: 't.feedbackErrorBg', descricao: 'Fundo do estado desconectado' },
          { elemento: 'Radius', token: 't.radiusLg', descricao: 'Arredondamento do card' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'connected', tipo: 'boolean', default: '—', descricao: 'Define estado conectado ou desconectado (obrigatório)' },
          { prop: 'initials', tipo: 'string', default: '—', descricao: 'Iniciais do avatar da instituição (obrigatório)' },
          { prop: 'name', tipo: 'string', default: '—', descricao: 'Nome da instituição financeira (obrigatório)' },
          { prop: 'account', tipo: 'string', default: '—', descricao: 'Número/tipo de conta (obrigatório)' },
          { prop: 'value', tipo: 'string', default: '—', descricao: 'Saldo (apenas quando connected=true)' },
          { prop: 'trend', tipo: "'up' | 'down' | 'neutral'", default: '—', descricao: 'Direção de variação (apenas connected=true)' },
          { prop: 'trendLabel', tipo: 'string', default: '—', descricao: 'Texto do indicador de tendência' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='article' com aria-label='Conta [nome] — [estado]'"
          keyboard="Botão Reconectar: Tab para focar · Enter/Space para acionar"
          screenReader="Estado conectado: saldo e trend lidos · Trend: aria-label='variação de X%' · Desconectado: mensagem de erro descritiva"
          contrast="feedbackSuccess e feedbackError verificados · Fundo errorBg com textPrimary verificado"
          focus="focusRing no botão Reconectar · avatar não é focável"
        /> },
      ]}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>{children}</p>
}
