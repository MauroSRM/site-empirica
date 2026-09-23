import React, { useState } from 'react'
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { t, hexToRgba } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral'

interface DSAlertCardProps {
  variant?: AlertVariant
  title?: string
  body?: string
  dismissible?: boolean
  withAction?: boolean
  actionLabel?: string
  onAction?: () => void
}

export function DSAlertCard({
  variant = 'info',
  title,
  body,
  dismissible = false,
  withAction = false,
  actionLabel,
  onAction,
}: DSAlertCardProps) {
  const { tokens: t } = useTheme()
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const variantConfig = {
    info:    { color: t.feedbackInfo,    bg: t.feedbackInfoBg,    border: hexToRgba(t.feedbackInfo,    0.3), Icon: Info,          actionLabel: 'Saiba mais →' },
    success: { color: t.feedbackSuccess, bg: t.feedbackSuccessBg, border: hexToRgba(t.feedbackSuccess, 0.3), Icon: CheckCircle2,  actionLabel: 'Ver detalhes →' },
    warning: { color: t.feedbackWarning, bg: t.feedbackWarningBg, border: hexToRgba(t.feedbackWarning, 0.3), Icon: AlertTriangle, actionLabel: 'Entender o aviso →' },
    error:   { color: t.feedbackError,   bg: t.feedbackErrorBg,   border: hexToRgba(t.feedbackError,   0.3), Icon: XCircle,       actionLabel: 'Ver detalhes do erro →' },
    neutral: { color: t.textSecondary,   bg: t.surfaceMuted,      border: hexToRgba(t.textSecondary,   0.3), Icon: Info,          actionLabel: 'Ver detalhes →' },
  }

  const cfg = variantConfig[variant]

  const defaultTitles: Record<AlertVariant, string> = {
    info:    'Informação importante',
    success: 'Operação realizada com sucesso',
    warning: 'Atenção necessária',
    error:   'Ocorreu um erro',
    neutral: 'Aviso do sistema',
  }

  const defaultBodies: Record<AlertVariant, string> = {
    info:    'Sua solicitação está sendo processada. Você receberá uma notificação em breve.',
    success: 'O título foi liquidado com sucesso. O valor já está disponível para resgate.',
    warning: 'Você possui títulos com vencimento nos próximos 5 dias. Verifique sua carteira.',
    error:   'Não foi possível processar a operação. Tente novamente ou entre em contato.',
    neutral: 'Esta informação não requer ação imediata mas pode ser relevante para você.',
  }

  return (
    <div
      style={{
        borderRadius: t.radiusLg,
        border: `1px solid ${cfg.border}`,
        backgroundColor: cfg.bg,
        padding: t.space4,
        display: 'flex',
        flexDirection: 'column',
        gap: t.space2,
        fontFamily: t.fontFamily,
        position: 'relative',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: t.space2, paddingRight: dismissible ? t.space6 : 0 }}>
        <cfg.Icon size={18} color={cfg.color} style={{ flexShrink: 0 }} aria-hidden="true" />
        <span style={{ fontSize: t.textMd, fontWeight: 600, color: t.textPrimary, lineHeight: '18px' }}>
          {title || defaultTitles[variant]}
        </span>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fechar alerta"
            style={{
              position: 'absolute',
              top: t.space3,
              right: t.space3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: t.textSecondary,
              display: 'flex',
              padding: 0,
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* W-05: textPrimary garante contraste sobre todos os feedbackXBg e surfaceMuted */}
      <p style={{
        fontSize: t.textMd,
        color: t.textPrimary,
        paddingLeft: '26px', /* 18px icon + 8px gap */
        margin: 0,
        lineHeight: '20px',
      }}>
        {body || defaultBodies[variant]}
      </p>

      {withAction && (
        <button
          onClick={onAction}
          style={{
            paddingLeft: '26px', /* 18px icon + 8px gap */
            paddingTop: t.space2,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: t.text2Xs,
            fontWeight: 600,
            color: cfg.color,
            fontFamily: t.fontFamily,
            textAlign: 'left',
          }}
        >
          {actionLabel || cfg.actionLabel}
        </button>
      )}
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────────────────────

export function DSAlertCardSection() {
  const { tokens: t } = useTheme()
  const variants: AlertVariant[] = ['info', 'success', 'warning', 'error', 'neutral']

  return (
    <DSDocSection
      description="Aviso persistente em contexto de página ou seção. Use neutral para contextos sem semântica de feedback."
      whenToUse={['Alerta de sistema que persiste durante a sessão', 'Validação de formulário no topo', 'Mensagem de risco visível em tela', "neutral: informativo sem urgência ou categoria semântica"]}
      whenNotToUse={['Feedback de ação pontual (use DSToast)', 'Ajuda de campo (use helperText do DSInput)', 'Conteúdo que o usuário não precisa de ação']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo info',          token: 't.feedbackInfoBg',      descricao: 'Fundo da variante info' },
          { elemento: 'Ícone/borda info',    token: 't.feedbackInfo',        descricao: 'Cor do ícone e ação info' },
          { elemento: 'Fundo success',       token: 't.feedbackSuccessBg',   descricao: 'Fundo da variante success' },
          { elemento: 'Ícone/borda success', token: 't.feedbackSuccess',     descricao: 'Cor do ícone e ação success' },
          { elemento: 'Fundo warning',       token: 't.feedbackWarningBg',   descricao: 'Fundo da variante warning' },
          { elemento: 'Ícone/borda warning', token: 't.feedbackWarning',     descricao: 'Cor do ícone e ação warning' },
          { elemento: 'Fundo error',         token: 't.feedbackErrorBg',     descricao: 'Fundo da variante error' },
          { elemento: 'Ícone/borda error',   token: 't.feedbackError',       descricao: 'Cor do ícone e ação error' },
          { elemento: 'Fundo neutral',       token: 't.surfaceMuted',        descricao: 'Fundo cinza — sem semântica de feedback' },
          { elemento: 'Ícone/borda neutral', token: 't.textSecondary',       descricao: 'Cor do ícone e ação neutral' },
          { elemento: 'Borda (todas)',       token: 'hexToRgba(color, 0.3)', descricao: 'Borda semi-opaca derivada da cor da variante' },
          { elemento: 'Texto',               token: 't.textPrimary',         descricao: 'Título e corpo (W-05)' },
          { elemento: 'Fonte',               token: 't.fontFamily',          descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant',     tipo: "'info' | 'success' | 'warning' | 'error' | 'neutral'", default: "'info'",  descricao: 'Semântica visual · neutral: cinza sem feedback' },
          { prop: 'title',       tipo: 'string',     default: 'auto',  descricao: 'Título em destaque' },
          { prop: 'body',        tipo: 'string',     default: 'auto',  descricao: 'Texto descritivo' },
          { prop: 'dismissible', tipo: 'boolean',    default: 'false', descricao: 'Exibe botão X para fechar' },
          { prop: 'withAction',  tipo: 'boolean',    default: 'false', descricao: 'Exibe link de ação abaixo do corpo' },
          { prop: 'actionLabel', tipo: 'string',     default: 'auto',  descricao: 'Texto do link de ação' },
          { prop: 'onAction',    tipo: '() => void', default: '—',     descricao: 'Callback ao clicar na ação' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='alert' para error/warning · role='status' para info/success/neutral"
          keyboard="Dismiss focável via Tab · Enter/Space para fechar · link de ação focável"
          screenReader="Botão X com aria-label='Fechar alerta' · ícone decorativo aria-hidden"
          contrast="textPrimary sobre todos os feedbackXBg e surfaceMuted — W-05"
          focus="focusRing no botão X e no link de ação"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: t.space6 }}>

          <div>
            <SL>Base</SL>
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.space3 }}>
              {variants.map(v => (
                <Labeled key={v} component="DSAlertCard" props={`variant="${v}"`}>
                  <DSAlertCard variant={v} />
                </Labeled>
              ))}
            </div>
          </div>

          <div>
            <SL>Com ação</SL>
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.space3 }}>
              {variants.map(v => (
                <Labeled key={v} component="DSAlertCard" props={`variant="${v}" withAction`}>
                  <DSAlertCard variant={v} withAction />
                </Labeled>
              ))}
            </div>
          </div>

          <div>
            <SL>Dismissível</SL>
            <div style={{ display: 'flex', flexDirection: 'column', gap: t.space3 }}>
              {variants.map(v => (
                <Labeled key={v} component="DSAlertCard" props={`variant="${v}" dismissible withAction`}>
                  <DSAlertCard variant={v} dismissible withAction />
                </Labeled>
              ))}
            </div>
          </div>

        </div>
      }
    />
  )
}

function SL({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: t.space2, fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}
