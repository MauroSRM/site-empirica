import React, { useState, useEffect, useRef, useId } from 'react'
import { X, Calendar, User, Hash, Percent } from 'lucide-react'
import { getSpacing } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSButton } from './DSButton'
import { DSListLabelGroup } from './DSListLabel'

interface DrawerAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
}

interface DSDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  primaryAction?: DrawerAction
  secondaryAction?: DrawerAction
  width?: number
}

export function DSDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  primaryAction,
  secondaryAction,
  width = 420,
}: DSDrawerProps) {
  const { tokens: t } = useTheme()
  // spacing via getSpacing(t.spacingScale) — reativo ao ThemeOverride.spacingScale
  const spacing = getSpacing(t.spacingScale)
  const titleId    = useId()
  const panelRef   = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      triggerRef.current = document.activeElement
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    } else {
      document.body.style.overflow = ''
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => !el.hasAttribute('disabled'))
        if (!focusable.length) { e.preventDefault(); return }
        const first = focusable[0]; const last = focusable[focusable.length - 1]
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
        else            { if (document.activeElement === last)  { e.preventDefault(); first.focus() } }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: t.overlayBackdropLight,
          backdropFilter: t.overlayBlur,
        }}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          position: 'relative',
          width: `${width}px`,
          maxWidth: '100vw',
          height: '100%',
          backgroundColor: t.surfaceDefault,
          boxShadow: t.shadowDrawer,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: t.fontFamily,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: t.space5,
            paddingBottom: t.space5,
            paddingLeft: t.space6,
            paddingRight: t.space6,
            borderBottom: `1px solid ${t.borderDefault}`,
            flexShrink: 0,
            gap: '12px',
          }}
        >
          <div>
            <h2 id={titleId} style={{ fontSize: t.text16, fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '22px' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ fontSize: t.text2Xs, color: t.textSecondary, margin: '2px 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              width: '32px', height: '32px',
              borderRadius: t.radiusLg,
              backgroundColor: t.surfaceSubtle,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.textSecondary, flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: spacing.paddingCard }}>
          {children}
        </div>

        {/* Footer with CTAs */}
        {(primaryAction || secondaryAction) && (
          <div
            style={{
              paddingTop: t.space4,
              paddingBottom: t.space4,
              paddingLeft: t.space6,
              paddingRight: t.space6,
              borderTop: `1px solid ${t.borderDefault}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              flexShrink: 0,
              backgroundColor: t.surfaceDefault,
            }}
          >
            {primaryAction && (
              <DSButton
                variant={primaryAction.variant ?? 'primary'}
                size="lg"
                fullWidth
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </DSButton>
            )}
            {secondaryAction && (
              <DSButton
                variant={secondaryAction.variant ?? 'ghost'}
                size="lg"
                fullWidth
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </DSButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSDrawerSection() {
  const { tokens: t } = useTheme()
  const [open, setOpen] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Painel lateral que desliza sobre o conteúdo principal. Usado para detalhes de operações, confirmação de transações e formulários contextuais sem abandonar a página."
        whenToUse={['Fluxo de confirmação de transação com resumo detalhado', 'Detalhes de operação sem navegar para nova rota', 'Formulário lateral de edição de dados contextuais']}
        whenNotToUse={['Ação simples de 1 clique (use Modal ou Toast)', 'Múltiplos drawers sobrepostos simultâneos', 'Conteúdo de navegação principal (use rota/página)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Fundo', token: 't.surfaceDefault', descricao: 'Cor de fundo do painel' },  // D-01: surfacePrimary não existe
            { elemento: 'Overlay', token: 'rgba(0,0,0,0.45)', descricao: 'Camada semi-transparente sobre o conteúdo' },
            { elemento: 'Borda', token: 't.borderDefault', descricao: 'Separador lateral do painel' },
            { elemento: 'Sombra', token: 't.shadowLg', descricao: 'Elevação do painel sobre o conteúdo' },
            { elemento: 'Radius', token: 't.radiusLg', descricao: 'Arredondamento das bordas do painel' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'isOpen', tipo: 'boolean', default: '—', descricao: 'Controla visibilidade do drawer (obrigatório)' },
            { prop: 'onClose', tipo: '() => void', default: '—', descricao: 'Callback ao fechar (obrigatório)' },
            { prop: 'title', tipo: 'string', default: '—', descricao: 'Título do drawer (obrigatório)' },
            { prop: 'subtitle', tipo: 'string', default: 'undefined', descricao: 'Subtítulo abaixo do título' },
            { prop: 'children', tipo: 'ReactNode', default: '—', descricao: 'Conteúdo interno do drawer' },
            { prop: 'primaryAction', tipo: 'DrawerAction', default: 'undefined', descricao: 'Botão de ação principal no rodapé' },
            { prop: 'secondaryAction', tipo: 'DrawerAction', default: 'undefined', descricao: 'Botão de ação secundária no rodapé' },
            { prop: 'width', tipo: 'number', default: '480', descricao: 'Largura do painel em px' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='dialog' com aria-modal='true' · aria-labelledby apontando para o título"
            keyboard="Esc fecha o drawer · Tab navega entre elementos focáveis · foco trapped dentro do drawer enquanto aberto"
            screenReader="Título lido ao abrir · Overlay não é focável · Botão X: aria-label='Fechar'"
            contrast="Texto sobre surfacePrimary — contraste verificado · Overlay escurece conteúdo de fundo"
            focus="Foco retorna ao elemento trigger ao fechar · focusRing visível em todos os controles internos"
          /> },
        ]}
        preview={
          <div>
            <SectionLabel>Abrir Drawers</SectionLabel>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Labeled component="DSDrawer" props='width={420} primaryAction secondaryAction'>
                <DSButton onClick={() => setOpen(true)}>Confirmar Operação</DSButton>
              </Labeled>
              <Labeled component="DSDrawer" props='width={420} primaryAction secondaryAction'>
                <DSButton variant="secondary" onClick={() => setOpenInfo(true)}>Detalhes do Título</DSButton>
              </Labeled>
            </div>
          </div>
        }
      />

      <DSDrawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Confirmar transferência"
        subtitle="Revise os dados antes de confirmar"
        primaryAction={{ label: 'Confirmar transferência', onClick: () => setOpen(false) }}
        secondaryAction={{ label: 'Cancelar', onClick: () => setOpen(false), variant: 'ghost' }}
      >
        <DSListLabelGroup
          title="Resumo da operação"
          items={[
            { label: 'Favorecido', value: 'Maria Fernanda S.', icon: <User size={14} /> },
            { label: 'CPF', value: '•••.345.678-••' },
            { label: 'Banco', value: 'Nubank' },
            { label: 'Tipo', value: 'Pix — Chave CPF' },
            { label: 'Data', value: '15/05/2026', icon: <Calendar size={14} /> },
            { label: 'Valor', value: 'R$ 1.500,00', valueHighlight: true, valueColor: t.feedbackSuccess },
          ]}
          separator
        />
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: t.feedbackWarningBg, borderRadius: t.radiusLg, fontSize: '12px', color: t.feedbackWarning, lineHeight: '18px' }}>
          Verifique os dados. Transferências Pix são instantâneas e irreversíveis.
        </div>
      </DSDrawer>

      <DSDrawer
        isOpen={openInfo}
        onClose={() => setOpenInfo(false)}
        title="Detalhes do título"
        subtitle="CDB Pós-fixado — Itaú"
        primaryAction={{ label: 'Investir agora', onClick: () => setOpenInfo(false) }}
        secondaryAction={{ label: 'Fechar', onClick: () => setOpenInfo(false), variant: 'ghost' }}
      >
        <DSListLabelGroup
          title="Especificações"
          items={[
            { label: 'Rentabilidade', value: '120% CDI', valueHighlight: true, icon: <Percent size={14} /> },
            { label: 'Prazo', value: '360 dias', icon: <Calendar size={14} /> },
            { label: 'Aplicação mínima', value: 'R$ 1.000,00' },
            { label: 'Resgate mínimo', value: 'R$ 500,00' },
            { label: 'Vencimento', value: '15/05/2027' },
            { label: 'Protocolo', value: '#CDB-4829', icon: <Hash size={14} /> },
          ]}
          separator
        />
      </DSDrawer>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}
