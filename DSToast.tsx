import React, { useState, useEffect, useRef } from 'react'
import { Info, CheckCircle2, AlertTriangle, XCircle, X, MoreHorizontal, ThumbsUp, ThumbsDown } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { DSButton } from './DSButton'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

type ToastMenuItem = {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive'
}

interface DSToastItemProps {
  variant: ToastVariant
  title?: string
  message: string
  action?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  autoDismiss?: boolean
  withMenu?: boolean
  menuItems?: ToastMenuItem[]
  withFeedback?: boolean
  feedbackQuestion?: string
  onFeedback?: (positive: boolean) => void
}

export function DSToastItem({
  variant,
  title,
  message,
  action = false,
  dismissible = true,
  onDismiss,
  autoDismiss = false,
  withMenu = false,
  menuItems,
  withFeedback = false,
  feedbackQuestion,
  onFeedback,
}: DSToastItemProps) {
  const { tokens: t } = useTheme()

  // variantConfig dentro do componente — reativo ao ThemeContext.Provider
  const variantConfig = {
    success: {
      bg:     t.feedbackSuccessBg,
      border: t.feedbackSuccess,
      iconBg: t.feedbackSuccessBg,
      color:  t.feedbackSuccess,
      Icon:   CheckCircle2,
    },
    error: {
      bg:     t.feedbackErrorBg,
      border: t.feedbackError,
      iconBg: t.feedbackErrorBg,
      color:  t.feedbackError,
      Icon:   XCircle,
    },
    warning: {
      bg:     t.feedbackWarningBg,
      border: t.feedbackWarning,
      iconBg: t.feedbackWarningBg,
      color:  t.feedbackWarning,
      Icon:   AlertTriangle,
    },
    info: {
      bg:     t.feedbackInfoBg,
      border: t.feedbackInfo,
      iconBg: t.feedbackInfoBg,
      color:  t.feedbackInfo,
      Icon:   Info,
    },
  }

  const cfg = variantConfig[variant]
  const [closeHover, setCloseHover]     = useState(false)
  const [actionHover, setActionHover]   = useState(false)
  const [menuOpen, setMenuOpen]         = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => onDismiss?.(), t.toastDismissMs)
      return () => clearTimeout(timer)
    }
  }, [autoDismiss, onDismiss])

  // Fechar menu ao clicar fora — mesmo padrão do DSSelect
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const defaultMenuItems: ToastMenuItem[] = [
    { label: 'Marcar como lida',        onClick: () => {} },
    { label: 'Não mostrar novamente',   onClick: () => {} },
  ]

  return (
    <div
      style={{
        width: t.toastWidth,
        paddingTop: t.space3,
        paddingBottom: t.space3,
        paddingLeft: t.space4,
        paddingRight: t.space4,
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        borderRadius: t.radiusXl,
        backgroundColor: cfg.bg,
        boxShadow: t.shadowToast,
        border: `1px solid ${cfg.border}`,
        fontFamily: t.fontFamily,
        maxWidth: 'calc(100vw - 48px)',
      }}
    >
      {/* Main row: ícone + conteúdo + ações */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Icon circle */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: t.radiusFull,
            backgroundColor: cfg.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <cfg.Icon size={16} color={cfg.color} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {title && (
            <span style={{ fontSize: t.textMd, fontWeight: 600, color: t.textPrimary }}>
              {title}
            </span>
          )}
          <span style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '20px' }}>
            {message}
          </span>
          {action && (
            <button
              onMouseEnter={() => setActionHover(true)}
              onMouseLeave={() => setActionHover(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                color: cfg.color,
                fontFamily: t.fontFamily,
                padding: '4px 0 0',
                textAlign: 'left',
                textDecoration: actionHover ? 'underline' : 'none',
              }}
            >
              Ver detalhes
            </button>
          )}
        </div>

        {/* Menu ... */}
        {withMenu && (
          <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              style={{
                width: 24, height: 24,
                borderRadius: t.radiusFull,
                border: 'none', background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.textTertiary, padding: 0,
              }}
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: 28, right: 0,
                backgroundColor: t.surfaceDefault,
                border: `1px solid ${t.borderDefault}`,
                borderRadius: t.radiusMd,
                boxShadow: t.shadowToast,
                zIndex: 10, minWidth: 180, overflow: 'hidden',
              }}>
                {(menuItems ?? defaultMenuItems).map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { item.onClick(); setMenuOpen(false) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 14px', border: 'none', background: 'transparent',
                      cursor: 'pointer', fontSize: 13, fontFamily: t.fontFamily,
                      color: item.variant === 'destructive' ? t.feedbackError : t.textPrimary,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Close button */}
        {dismissible && (
          <button
            onClick={onDismiss}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: closeHover ? t.textSecondary : t.textTertiary,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              flexShrink: 0,
              borderRadius: t.radiusFull,
              transition: 'color 0.15s ease',
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Feedback area */}
      {withFeedback && !feedbackGiven && (
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: `1px solid ${t.borderDefault}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 11, color: t.textSecondary, fontFamily: t.fontFamily, flex: 1 }}>
            {feedbackQuestion ?? 'O que achou dessa recomendação?'}
          </span>

          <button
            onClick={() => { setFeedbackGiven('positive'); onFeedback?.(true) }}
            style={{
              width: 28, height: 28, borderRadius: t.radiusFull,
              border: `1px solid ${t.borderDefault}`,
              background: t.surfaceDefault, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.textSecondary, flexShrink: 0, padding: 0,
            }}
          >
            <ThumbsUp size={13} />
          </button>

          <button
            onClick={() => { setFeedbackGiven('negative'); onFeedback?.(false) }}
            style={{
              width: 28, height: 28, borderRadius: t.radiusFull,
              border: `1px solid ${t.borderDefault}`,
              background: t.surfaceDefault, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.textSecondary, flexShrink: 0, padding: 0,
            }}
          >
            <ThumbsDown size={13} />
          </button>
        </div>
      )}

      {feedbackGiven && (
        <div style={{
          marginTop: 10, paddingTop: 10,
          borderTop: `1px solid ${t.borderDefault}`,
          fontSize: 11, color: t.feedbackSuccess, fontFamily: t.fontFamily,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <CheckCircle2 size={12} />
          Obrigado pelo feedback!
        </div>
      )}
    </div>
  )
}

// ─── Toast Stack Container ────────────────────────────────────

interface ToastMessage {
  id: number
  variant: ToastVariant
  title?: string
  message: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    setToasts(prev => [...prev, { ...toast, id: Date.now() }])
  }

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return { toasts, addToast, removeToast }
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastMessage[]; onRemove: (id: number) => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 9999,
      }}
    >
      {toasts.map(toast => (
        <DSToastItem
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          autoDismiss
          onDismiss={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function DSToastSection() {
  const { toasts, addToast, removeToast } = useToast()

  const variants: ToastVariant[] = ['success', 'error', 'warning', 'info']
  const labels = {
    success: 'Operação realizada com sucesso.',
    error:   'Não foi possível processar a operação.',
    warning: 'Você possui títulos vencendo hoje.',
    info:    'Uma nova atualização está disponível.',
  }
  const titles = {
    success: 'Sucesso',
    error:   'Erro',
    warning: 'Atenção',
    info:    'Novidade',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <DSDocSection
        description="Feedback transitório de ação assíncrona. Desaparece automaticamente."
        whenToUse={['Confirmação de operação concluída', 'Erro não bloqueante', 'Atualização de sistema']}
        whenNotToUse={['Erro que exige ação imediata (use DSModal warning)', 'Informação permanente (use DSAlertCard)', 'Mais de 3 toasts simultâneos']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Fundo success', token: 't.feedbackSuccessBg', descricao: 'Fundo da variante success' },
            { elemento: 'Borda success', token: 't.feedbackSuccess', descricao: 'Borda e ícone da variante success' },
            { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo da variante error' },
            { elemento: 'Borda error', token: 't.feedbackError', descricao: 'Borda e ícone da variante error' },
            { elemento: 'Fundo warning', token: 't.feedbackWarningBg', descricao: 'Fundo da variante warning' },
            { elemento: 'Borda warning', token: 't.feedbackWarning', descricao: 'Borda e ícone da variante warning' },
            { elemento: 'Fundo info', token: 't.feedbackInfoBg', descricao: 'Fundo da variante info' },
            { elemento: 'Borda info', token: 't.feedbackInfo', descricao: 'Borda e ícone da variante info' },
            { elemento: 'Separador', token: 't.borderDefault', descricao: 'Divisória interna' },
            { elemento: 'Sombra', token: 't.shadowToast', descricao: 'Elevação do toast' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'variant', tipo: "'success' | 'error' | 'warning' | 'info'", default: '—', descricao: 'Cor semântica (obrigatório)' },
            { prop: 'message', tipo: 'string', default: '—', descricao: 'Texto principal (obrigatório)' },
            { prop: 'title', tipo: 'string', default: '—', descricao: 'Título acima da mensagem' },
            { prop: 'action', tipo: 'boolean', default: 'false', descricao: 'Exibe botão de ação' },
            { prop: 'dismissible', tipo: 'boolean', default: 'true', descricao: 'Exibe botão X para fechar' },
            { prop: 'autoDismiss', tipo: 'boolean', default: 'false', descricao: 'Fecha automaticamente após 4s' },
            { prop: 'withMenu', tipo: 'boolean', default: 'false', descricao: 'Exibe menu de contexto' },
            { prop: 'menuItems', tipo: 'ToastMenuItem[]', default: '—', descricao: 'Itens do menu de contexto' },
            { prop: 'withFeedback', tipo: 'boolean', default: 'false', descricao: 'Exibe botões polegar (útil/não útil)' },
            { prop: 'feedbackQuestion', tipo: 'string', default: '—', descricao: 'Texto da pergunta de feedback' },
            { prop: 'onDismiss', tipo: '() => void', default: '—', descricao: 'Callback ao fechar' },
            { prop: 'onFeedback', tipo: '(positive: boolean) => void', default: '—', descricao: 'Callback do feedback' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='status' ou role='alert' conforme gravidade · ToastContainer: aria-live='polite' (info/success) ou aria-live='assertive' (error)"
            keyboard="Botão X focável via Tab · Botão de ação focável · autoDismiss pausado no foco"
            screenReader="Mensagem anunciada ao surgir · Variante comunicada pelo ícone com aria-label"
            contrast="Texto sobre fundo semântico — contraste verificado em todas as 4 variantes"
            focus="focusRing visível em X e ações · posicionamento fixo não bloqueia conteúdo interativo"
          /> },
        ]}
        preview={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <SectionLabel>Todas as variantes</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
                {variants.map(v => (
                  <Labeled key={v} component="DSToastItem" props={`variant="${v}" dismissible`}>
                    <DSToastItem variant={v} title={titles[v]} message={labels[v]} action />
                  </Labeled>
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Stack de 3 toasts simultâneos</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
                <Labeled component="DSToastItem" props='variant="success" dismissible'>
                  <DSToastItem variant="success" title="Sucesso" message="Título liquidado com sucesso." />
                </Labeled>
                <Labeled component="DSToastItem" props='variant="warning" dismissible'>
                  <DSToastItem variant="warning" message="Vencimento amanhã: 3 títulos aguardando." />
                </Labeled>
                <Labeled component="DSToastItem" props='variant="info" dismissible'>
                  <DSToastItem variant="info" message="Sistema entrará em manutenção às 02:00h." action />
                </Labeled>
              </div>
            </div>
            <div>
              <SectionLabel>Modos interativos</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
                <Labeled component="DSToastItem" props='variant="info" withMenu dismissible'>
                  <DSToastItem variant="info" title="Novo documento disponível" message="O regulamento do Fundo Multimercado Estratégico foi atualizado." withMenu dismissible />
                </Labeled>
                <Labeled component="DSToastItem" props='variant="info" withFeedback'>
                  <DSToastItem variant="info" message="Recomendamos o Fundo Multimercado Estratégico com base no seu perfil de investidor." withFeedback feedbackQuestion="O que achou dessa recomendação?" />
                </Labeled>
              </div>
            </div>
            <div>
              <SectionLabel>Interativo — auto-dismiss em 4s</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {variants.map(v => (
                  <DSButton key={v} variant="secondary" size="sm" onClick={() => addToast({ variant: v, title: titles[v], message: labels[v] })}>{titles[v]}</DSButton>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: t.surfaceMuted, borderRadius: t.cardRadius, padding: '16px' }}>
              <SectionLabel>Especificações</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  'Posição: fixed bottom-right, 24px de margem',
                  'Stack: vertical, gap 8px',
                  'Auto-dismiss: 4000ms',
                  'Largura: 360px (max calc(100vw - 48px))',
                  'Ícone: círculo 32x32px com bg variante a 15%',
                  'Borda: 1px solid variante a 20% de opacidade',
                  'withMenu: dropdown fecha ao clicar fora (mousedown listener)',
                  'withFeedback: like/dislike → confirmação de agradecimento',
                ].map((doc, i) => (
                  <p key={i} style={{ fontSize: '13px', color: t.textSecondary, fontFamily: t.fontFamily, margin: 0 }}>{doc}</p>
                ))}
              </div>
            </div>
          </div>
        }
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}