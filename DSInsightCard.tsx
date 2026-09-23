import React from 'react'
import { AlertTriangle, Info, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { DSTag } from './DSTag'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type InsightVariant = 'warning' | 'info' | 'success' | 'ai'

interface DSInsightCardProps {
  variant: InsightVariant
  title: string
  body: string
  linkLabel: string
  onLink?: () => void
}

const variantCfg = (t: ReturnType<typeof useTheme>['tokens']): Record<InsightVariant, {
  borderColor: string; bg: string; iconColor: string; Icon: React.ElementType
}> => ({
  warning: { borderColor: t.feedbackWarning, bg: t.feedbackWarningBg, iconColor: t.feedbackWarning, Icon: AlertTriangle },
  info:    { borderColor: t.feedbackInfo,    bg: t.feedbackInfoBg,    iconColor: t.feedbackInfo,    Icon: Info          },
  success: { borderColor: t.feedbackSuccess, bg: t.feedbackSuccessBg, iconColor: t.feedbackSuccess, Icon: TrendingUp    },
  // WCAG-NEW-02: brandAccent (#ff8200) sobre brandAccentLight = ~1.9:1 — falha 3:1. brandAccentStrong (#cc6600) = ~3.1:1 ✅
  ai:      { borderColor: t.brandAccent,     bg: t.brandAccentLight,  iconColor: t.brandAccentStrong, Icon: Sparkles      },
})

export function DSInsightCard({ variant, title, body, linkLabel, onLink }: DSInsightCardProps) {
  const { tokens: t } = useTheme()
  const cfg = variantCfg(t)[variant]
  const { Icon } = cfg

  return (
    <div style={{
      padding: t.space4,
      borderRadius: t.radiusLg,
      backgroundColor: cfg.bg,
      borderLeft: `3px solid ${cfg.borderColor}`,
      fontFamily: t.fontFamily,
      position: 'relative',
    }}>
      {variant === 'ai' && (
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <DSTag variant="neutral-brand2" size="sm">IA</DSTag>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: variant === 'ai' ? '48px' : '0' }}>
        <Icon size={16} color={cfg.iconColor} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: t.textMd, fontWeight: 600, color: t.textPrimary, lineHeight: '18px' }}>{title}</span>
      </div>
      <p style={{ fontSize: t.text2Xs, fontWeight: 400, color: t.textSecondary, margin: '6px 0 0', lineHeight: '18px', paddingLeft: '24px' }}>{body}</p>
      <button
        onClick={onLink}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '10px', marginLeft: '24px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: t.text2Xs, fontWeight: 500, color: t.brandPrimary, fontFamily: t.fontFamily }}
      >
        {linkLabel}
        <ArrowRight size={12} />
      </button>
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSInsightCardSection() {
  return (
    <DSDocSection
      description="Card de insight contextual com borda lateral colorida e link de ação. Exibe alertas operacionais, informações relevantes, oportunidades e sugestões geradas por IA no contexto de dashboards financeiros."
      whenToUse={['Alerta operacional não-bloqueante no dashboard (ex: falta de caixa prevista)', 'Sugestão de ação gerada por IA com link para detalhe', 'Indicador de oportunidade de crédito ou investimento']}
      whenNotToUse={['Erro crítico que bloqueia ação (use DSModal ou DSAlertCard)', 'Múltiplos insights empilhados sem hierarquia (máx. 3 por página)', 'Conteúdo de texto longo sem CTA claro']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Labeled component="DSInsightCard" props='variant="warning"'>
            <DSInsightCard variant="warning" title="Falta de caixa prevista para quinta-feira (14/05)" body="Saldo projetado negativo após folha de pagamento. Antecipar recebíveis resolveria o gap." linkLabel="Ver recomendação" />
          </Labeled>
          <Labeled component="DSInsightCard" props='variant="info"'>
            <DSInsightCard variant="info" title="3 aprovações aguardando sua decisão" body="Total de R$ 251.000 em pagamentos pendentes — incluindo folha de maio." linkLabel="Revisar aprovações" />
          </Labeled>
          <Labeled component="DSInsightCard" props='variant="success"'>
            <DSInsightCard variant="success" title="Você tem capacidade para até R$ 280k em capital de giro" body="Baseado no fluxo dos últimos 12 meses, taxa estimada de 1,89% a.m. com Conta Garantida." linkLabel="Simular contratação" />
          </Labeled>
          <Labeled component="DSInsightCard" props='variant="ai"'>
            <DSInsightCard variant="ai" title="Sugestão: automatizar folha de pagamento" body="Alta probabilidade de valor idêntico ao mês anterior. Automatizar economiza etapas no fluxo." linkLabel="Configurar automação" />
          </Labeled>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Borda warning', token: 't.feedbackWarning', descricao: 'Borda lateral da variante warning' },
          { elemento: 'Fundo warning', token: 't.feedbackWarningBg', descricao: 'Fundo da variante warning' },
          { elemento: 'Borda info', token: 't.feedbackInfo', descricao: 'Borda lateral da variante info' },
          { elemento: 'Fundo info', token: 't.feedbackInfoBg', descricao: 'Fundo da variante info' },
          { elemento: 'Borda success', token: 't.feedbackSuccess', descricao: 'Borda lateral da variante success' },
          { elemento: 'Fundo success', token: 't.feedbackSuccessBg', descricao: 'Fundo da variante success' },
          { elemento: 'Borda ai', token: 't.brandAccent', descricao: 'Borda lateral da variante AI' },
          { elemento: 'Fundo ai', token: 't.brandAccentLight', descricao: 'Fundo da variante AI' },
          { elemento: 'Link CTA', token: 't.brandPrimary', descricao: 'Cor do link de ação' },
          { elemento: 'Título', token: 't.textPrimary', descricao: 'Texto do título do insight' },
          { elemento: 'Body', token: 't.textSecondary', descricao: 'Texto do corpo do insight' },
          { elemento: 'Radius', token: 't.radiusLg', descricao: 'Arredondamento do card' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'warning' | 'info' | 'success' | 'ai'", default: '—', descricao: 'Variante semântica do insight (obrigatório)' },
          { prop: 'title', tipo: 'string', default: '—', descricao: 'Título principal do insight (obrigatório)' },
          { prop: 'body', tipo: 'string', default: '—', descricao: 'Texto de detalhamento do insight (obrigatório)' },
          { prop: 'linkLabel', tipo: 'string', default: '—', descricao: 'Texto do link de ação CTA (obrigatório)' },
          { prop: 'onLink', tipo: '() => void', default: 'undefined', descricao: 'Callback ao clicar no link de ação' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='status' para insights informativos · role='alert' para variante warning"
          keyboard="Link de ação: Tab para focar · Enter para acionar"
          screenReader="Conteúdo lido em sequência: título → body → link · Variante 'ai': tag IA lida como 'gerado por IA'"
          contrast="Ícones de variante sobre fundos semânticos verificados · brandPrimary no link verificado"
          focus="focusRing no botão de link · card não recebe foco diretamente"
        /> },
      ]}
    />
  )
}
