import React from 'react'
import { FileText, CheckCircle2, AlertTriangle, XCircle, Shield, TrendingUp, TrendingDown, Minus, BarChart2, Users, Clock, Zap, DollarSign, Activity } from 'lucide-react'
import { DSTag } from './DSTag'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type KPIVariant = 'default' | 'success' | 'warning' | 'error' | 'info'
export type KPITrend = 'up' | 'down' | 'neutral'

interface DSKPICardProps {
  variant?: KPIVariant
  label: string
  value: string
  hint?: string
  loading?: boolean
  valueFontSize?: string
  tag?: string
  trend?: KPITrend
  trendLabel?: string
  icon?: React.ElementType
}

const variantCfg = (t: ReturnType<typeof useTheme>['tokens']): Record<KPIVariant, { iconBg: string; iconColor: string; Icon: React.ElementType }> => ({
  default: { iconBg: t.surfaceMuted,       iconColor: t.textSecondary,   Icon: FileText     },
  success: { iconBg: t.feedbackSuccessBg,  iconColor: t.feedbackSuccess,  Icon: CheckCircle2 },
  warning: { iconBg: t.feedbackWarningBg,  iconColor: t.feedbackWarning,  Icon: AlertTriangle },
  error:   { iconBg: t.feedbackErrorBg,    iconColor: t.feedbackError,    Icon: XCircle      },
  info:    { iconBg: t.brandPrimaryLight,  iconColor: t.brandPrimary,     Icon: Shield       },
})

const trendCfg = (t: ReturnType<typeof useTheme>['tokens']): Record<KPITrend, { color: string; textColor?: string; Icon: React.ElementType }> => ({
  // WCAG W-07: feedbackSuccess (#059669) sobre surfaceDefault (#ffffff) = 4.5:1 — margem zero.
  // Se surfaceBackground for sobrescrito via ThemeOverride, verificar contraste manualmente.
  // Não usar feedbackSuccess como cor de texto sobre fundos não-brancos sem verificação.
  up:      { color: t.feedbackSuccess, textColor: t.feedbackSuccessText, Icon: TrendingUp   },
  down:    { color: t.feedbackError,   Icon: TrendingDown },
  neutral: { color: t.textTertiary,   Icon: Minus        },
})

export function DSKPICard({
  variant = 'default', label, value, hint, loading = false,
  valueFontSize = '24px', tag, trend, trendLabel, icon: CustomIcon,
}: DSKPICardProps) {
  const { tokens: t } = useTheme()
  const cfg = variantCfg(t)[variant]
  const Icon = CustomIcon ?? cfg.Icon

  return (
    <div style={{
      minWidth: '220px',
      padding: '16px 20px',
      borderRadius: t.cardRadius,
      backgroundColor: t.surfaceDefault,
      border: `1px solid ${t.borderDefault}`,
      display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px',
      fontFamily: t.fontFamily,
      position: 'relative',
    }}>
      {tag && (
        <div style={{ position: 'absolute', top: '10px', right: '12px' }}>
          <DSTag variant="neutral-brand2" size="sm">{tag}</DSTag>
        </div>
      )}
      {loading ? (
        <>
          <div style={{ width: '36px', height: '36px', borderRadius: t.radiusFull, backgroundColor: t.surfaceMuted, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: '10px', width: '70px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm }} />
            <div style={{ marginTop: '8px', height: '22px', width: '90px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm }} />
            <div style={{ marginTop: '6px', height: '8px', width: '110px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm }} />
          </div>
        </>
      ) : (
        <>
          <div style={{ width: '36px', height: '36px', borderRadius: t.radiusFull, backgroundColor: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={18} color={cfg.iconColor} />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingRight: tag ? '56px' : '0' }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: t.textSecondary, margin: '0', lineHeight: '15px' }}>{label}</p>
            <p style={{ fontSize: valueFontSize, fontWeight: 700, color: t.textPrimary, margin: '2px 0 0', lineHeight: '1.15' }}>{value}</p>
            {(trend || (hint && !trend)) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                {trend && (() => {
                  const tc = trendCfg(t)[trend]
                  const TrendIcon = tc.Icon
                  return (
                    <>
                      <TrendIcon size={11} color={tc.color} />
                      {trendLabel && <span style={{ fontSize: '11px', fontWeight: 600, color: tc.textColor ?? tc.color }}>{trendLabel}</span>} {/* W-07: texto trend usa feedbackSuccessText (4.7:1) — feedbackSuccess falha WCAG para texto (3.8:1) */}
                    </>
                  )
                })()}
                {hint && !trend && <span style={{ fontSize: '11px', fontWeight: 400, color: t.textTertiary, lineHeight: '14px' }}>{hint}</span>}
              </div>
            )}
            {hint && trend && <p style={{ fontSize: '11px', fontWeight: 400, color: t.textTertiary, margin: '2px 0 0', lineHeight: '14px' }}>{hint}</p>}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSKPICardSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Card de indicador-chave de desempenho com variantes semânticas, trend e ícone. Usado em dashboards operacionais, painéis de compliance e resumos de processamento em lote."
      whenToUse={['KPI de dashboard operacional (transações, volume)', 'Indicador de status em painel de compliance PLD', 'Resumo de processamento em lote com taxa de sucesso']}
      whenNotToUse={['Exibição de saldo financeiro primário (use DSBalancePrimary)', 'Dado textual sem valor numérico destacado (use DSListLabel)', 'Mais de 8 KPIs na mesma tela (agrupe em seções)']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo default', token: 't.surfaceSubtle', descricao: 'Fundo padrão do card' },
          { elemento: 'Fundo success', token: 't.feedbackSuccessBg', descricao: 'Fundo da variante de sucesso' },
          { elemento: 'Fundo warning', token: 't.feedbackWarningBg', descricao: 'Fundo da variante de aviso' },
          { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo da variante de erro' },
          { elemento: 'Fundo info', token: 't.brandPrimaryLight', descricao: 'Fundo da variante informativa' },
          { elemento: 'Trend up', token: 't.feedbackSuccess', descricao: 'Cor do indicador de crescimento' },
          { elemento: 'Trend down', token: 't.feedbackError', descricao: 'Cor do indicador de queda' },
          { elemento: 'Radius', token: 't.radiusLg', descricao: 'Arredondamento do card' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'default' | 'success' | 'warning' | 'error' | 'info'", default: "'default'", descricao: 'Variante semântica do card' },
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Rótulo do indicador (obrigatório)' },
          { prop: 'value', tipo: 'string', default: '—', descricao: 'Valor principal em destaque (obrigatório)' },
          { prop: 'hint', tipo: 'string', default: 'undefined', descricao: 'Texto auxiliar abaixo do valor' },
          { prop: 'trend', tipo: "'up' | 'down' | 'neutral'", default: 'undefined', descricao: 'Direção do indicador de tendência' },
          { prop: 'trendLabel', tipo: 'string', default: 'undefined', descricao: 'Texto ao lado do ícone de trend' },
          { prop: 'icon', tipo: 'React.ElementType', default: 'undefined', descricao: 'Ícone do indicador (Lucide)' },
          { prop: 'loading', tipo: 'boolean', default: 'false', descricao: 'Exibe skeleton de carregamento' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='status' recomendado para KPIs que atualizam em tempo real"
          keyboard="Não interativo — não recebe foco"
          screenReader="Leitura: label + valor + hint em sequência · Trend: aria-label='tendência de alta/queda X%'"
          contrast="Todos os fundos semânticos verificados com texto textPrimary · Ícones de trend com cor verificada"
          focus="Sem foco — componente puramente de exibição"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: t.fontFamily }}>
          <div>
            <SectionLabel>5 variantes semânticas</SectionLabel>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Labeled component="DSKPICard" props='variant="default" label="..." value="15"'><DSKPICard variant="default" label="Total reconhecido" value="15" hint="pagamentos no arquivo" /></Labeled>
              <Labeled component="DSKPICard" props='variant="success"'><DSKPICard variant="success" label="Validados" value="14" hint="prontos para envio" /></Labeled>
              <Labeled component="DSKPICard" props='variant="warning"'><DSKPICard variant="warning" label="Em revisão" value="1" hint="novo fornecedor detectado" /></Labeled>
              <Labeled component="DSKPICard" props='variant="error"'><DSKPICard variant="error" label="Bloqueadas hoje" value="2" hint="escaladas para BACEN" /></Labeled>
              <Labeled component="DSKPICard" props='variant="info"'><DSKPICard variant="info" label="Perfis configurados" value="6" hint="2 customizados" /></Labeled>
            </div>
          </div>

          <div>
            <SectionLabel>Com tag de lançamento</SectionLabel>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Labeled component="DSKPICard" props='variant="info" tag="Novo"'><DSKPICard variant="info" label="Compliance AI" value="98,4%" tag="Novo" hint="score médio do mês" /></Labeled>
              <Labeled component="DSKPICard" props='variant="success" tag="Beta"'><DSKPICard variant="success" label="Pagamentos Pix" value="847" tag="Beta" hint="transações hoje" /></Labeled>
              <Labeled component="DSKPICard" props='variant="default" tag="Preview"'><DSKPICard variant="default" label="Open Finance" value="4" tag="Preview" hint="contas conectadas" /></Labeled>
            </div>
          </div>

          <div>
            <SectionLabel>Com indicador de tendência</SectionLabel>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Labeled component="DSKPICard" props='variant="success" trend="up"'><DSKPICard variant="success" label="Volume aprovado" value="R$ 2,4M" trend="up" trendLabel="+12,3% vs mês anterior" /></Labeled>
              <Labeled component="DSKPICard" props='variant="error" trend="down"'><DSKPICard variant="error" label="Rejeições" value="32" trend="down" trendLabel="-8% vs mês anterior" /></Labeled>
              <Labeled component="DSKPICard" props='variant="default" trend="neutral"'><DSKPICard variant="default" label="Tempo médio" value="4,2 min" trend="neutral" trendLabel="estável" /></Labeled>
              <Labeled component="DSKPICard" props='variant="warning" trend="up"'><DSKPICard variant="warning" label="Pendentes" value="18" trend="up" trendLabel="+5 hoje" hint="requer atenção" /></Labeled>
            </div>
          </div>

          <div>
            <SectionLabel>Variações de ícone</SectionLabel>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Labeled component="DSKPICard" props='variant="info" icon={Users}'><DSKPICard variant="info" label="Usuários ativos" value="24" icon={Users} trend="up" trendLabel="+3 esta semana" /></Labeled>
              <Labeled component="DSKPICard" props='variant="default" icon={Clock}'><DSKPICard variant="default" label="Tempo de resposta" value="142ms" icon={Clock} trend="down" trendLabel="-18ms" /></Labeled>
              <Labeled component="DSKPICard" props='variant="success" icon={DollarSign}'><DSKPICard variant="success" label="Receita do mês" value="R$ 890K" icon={DollarSign} trend="up" trendLabel="+22%" /></Labeled>
              <Labeled component="DSKPICard" props='variant="warning" icon={Activity}'><DSKPICard variant="warning" label="Alertas ativos" value="7" icon={Activity} trend="up" trendLabel="+2 hoje" /></Labeled>
              <Labeled component="DSKPICard" props='variant="info" icon={Zap}'><DSKPICard variant="info" label="Automações" value="156" icon={Zap} hint="execuções na semana" /></Labeled>
              <Labeled component="DSKPICard" props='variant="default" icon={BarChart2}'><DSKPICard variant="default" label="Relatórios" value="43" icon={BarChart2} hint="gerados este mês" /></Labeled>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <SectionLabel>Valor monetário</SectionLabel>
              <Labeled component="DSKPICard" props='valueFontSize="22px"'><DSKPICard variant="default" label="Vencimentos próximos" value="R$ 287.430" hint="vencimentos 12 a 16/05" valueFontSize="22px" /></Labeled>
            </div>
            <div>
              <SectionLabel>Com tag + trend</SectionLabel>
              <Labeled component="DSKPICard" props='variant="success" tag="Novo" trend="up"'><DSKPICard variant="success" label="NPS Score" value="87" tag="Novo" trend="up" trendLabel="+4 pts" valueFontSize="22px" /></Labeled>
            </div>
            <div>
              <SectionLabel>Loading (skeleton)</SectionLabel>
              <Labeled component="DSKPICard" props='loading'><DSKPICard variant="default" label="" value="" loading /></Labeled>
            </div>
          </div>
        </div>
      }
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>{children}</p>
}
