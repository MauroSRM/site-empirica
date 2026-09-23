import React, { useState, useEffect, useRef, useId } from 'react'
import { X, AlertTriangle, AlertOctagon, Info } from 'lucide-react'
import { t } from './tokens'
import { DSButton } from './DSButton'
import { DSAlertCard } from './DSAlertCard'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type ModalVariant = 'default' | 'warning' | 'destructive'

interface DSModalProps {
  variant?: ModalVariant
  showCallout?: boolean
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void        // chamado ao clicar no botão de ação em warning/destructive
  primaryLabel?: string         // override do label do botão de ação (default: 'Sim, cancelar')
  ghostLabel?: string           // override do label do botão ghost (default: 'Não, continuar')
  title?: string
  body?: string
}

export function DSModal({
  variant = 'default',
  showCallout = false,
  isOpen,
  onClose,
  onConfirm,
  primaryLabel,
  ghostLabel,
  title,
  body,
}: DSModalProps) {
  const titleId  = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<Element | null>(null)

  const isDestructive = variant === 'destructive'
  const isWarning     = variant === 'warning' || isDestructive

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      firstFocusable?.focus()
    } else {
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus()
    }
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

  const iconBg     = isDestructive ? t.feedbackErrorBg   : isWarning ? t.brandAccentLight : t.brandPrimaryLight
  // W-03: brandAccentStrong (~3.1:1 on brandAccentLight) replaces brandAccent (~1.5:1) for WCAG AA
  const iconColor  = isDestructive ? t.feedbackError     : isWarning ? t.brandAccentStrong : t.brandPrimary
  const IconComp   = isDestructive ? AlertOctagon        : isWarning ? AlertTriangle        : Info

  const defaultTitle = isDestructive ? 'Ação irreversível' : isWarning ? 'Confirmar ação' : 'Informação importante'
  const defaultBody  = isWarning
    ? 'Você tem certeza que deseja continuar? Esta ação não pode ser desfeita.'
    : 'Esta ação irá atualizar as configurações da sua conta. Revise as informações antes de confirmar.'

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: t.overlayBackdrop,
        backdropFilter: t.overlayBlurModal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          width: t.modalWidth,
          backgroundColor: t.surfaceDefault,
          borderRadius: t.radius3xl,
          boxShadow: t.shadowModal,
          padding: t.space8,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
          fontFamily: t.fontFamily,
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            backgroundColor: t.surfaceSubtle,
            borderRadius: t.radius2xl,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: t.textSecondary,
          }}
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: t.radiusFull,
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComp size={32} color={iconColor} />
          </div>
        </div>

        {/* Heading */}
        <h2
          id={titleId}
          style={{
            fontSize: t.text24,
            fontWeight: 600,
            color: isDestructive ? t.feedbackError : t.textPrimary,
            textAlign: 'center',
            margin: 0,
          }}
        >
          {title || defaultTitle}
        </h2>

        {/* Body */}
        <p
          style={{
            fontSize: t.textLg,
            color: t.textSecondary,
            textAlign: 'center',
            maxWidth: '360px',
            margin: '0 auto',
            lineHeight: '22px', // Sem token de line-height — limitação conhecida
          }}
        >
          {body || defaultBody}
        </p>

        {/* Callout */}
        {showCallout && (
          <div style={{ marginBottom: 4 }}>
            <DSAlertCard
              variant="warning"
              body="Atenção: esta operação afetará todos os títulos selecionados e não poderá ser revertida após a confirmação."
            />
          </div>
        )}

        {/* Footer — botões centralizados */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 24,
          width: '100%',
        }}>
          <div style={{ display: 'inline-flex', gap: 12 }}>
            {variant === 'default' && (
              <>
                <DSButton variant="secondary" size="md" onClick={onClose}>{ghostLabel ?? 'Cancelar'}</DSButton>
                <DSButton variant="primary"   size="md" onClick={onClose}>{primaryLabel ?? 'Confirmar'}</DSButton>
              </>
            )}
            {(variant === 'warning' || variant === 'destructive') && (
              <>
                <DSButton variant="ghost"       size="md" onClick={onClose}>{ghostLabel ?? 'Cancelar'}</DSButton>
                <DSButton variant="destructive" size="md" onClick={() => { onConfirm?.(); onClose() }}>{primaryLabel ?? 'Sim, aplicar'}</DSButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function DSModalSection() {
  const [openModal, setOpenModal] = useState<null | 'default' | 'warning' | 'destructive' | 'callout'>(null)

  return (
    <>
      <DSDocSection
        description="Interrompe o fluxo para confirmar ação crítica ou coletar dado pontual."
        whenToUse={['Confirmação de operação irreversível', 'Formulário de entrada simples', 'Preview de detalhe']}
        whenNotToUse={['Fluxo com mais de 3 etapas (use DSStepper)', 'Conteúdo maior que 70vh (use página)', 'Empilhar modais']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Overlay', token: 't.overlayBackdrop', descricao: 'Fundo escuro sobre a página' },
            { elemento: 'Blur overlay', token: 't.overlayBlurModal', descricao: 'Desfoque do backdrop' },
            { elemento: 'Sombra', token: 't.shadowModal', descricao: 'Elevação do painel modal' },
            { elemento: 'Ícone bg (default)', token: 't.brandPrimaryLight', descricao: 'Fundo do ícone na variante default' },
            { elemento: 'Ícone cor (default)', token: 't.brandPrimary', descricao: 'Cor do ícone na variante default' },
            { elemento: 'Ícone bg (warning)', token: 't.brandAccentLight', descricao: 'Fundo do ícone na variante warning' },
            { elemento: 'Ícone cor (warning)', token: 't.brandAccentStrong', descricao: 'Cor do ícone na variante warning (W-03: WCAG AA)' },
            { elemento: 'Ícone bg (destructive)', token: 't.feedbackErrorBg', descricao: 'Fundo do ícone na variante destructive' },
            { elemento: 'Ícone cor (destructive)', token: 't.feedbackError', descricao: 'Cor do ícone e título na variante destructive' },
            { elemento: 'Texto', token: 't.textPrimary', descricao: 'Título e corpo' },
            { elemento: 'Border radius', token: 't.radius3xl', descricao: 'Raio do painel' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'isOpen', tipo: 'boolean', default: '—', descricao: 'Controla visibilidade (obrigatório)' },
            { prop: 'onClose', tipo: '() => void', default: '—', descricao: 'Fecha o modal (obrigatório)' },
            { prop: 'variant', tipo: "'default' | 'warning' | 'destructive'", default: "'default'", descricao: 'Tom visual do modal' },
            { prop: 'showCallout', tipo: 'boolean', default: 'false', descricao: 'Exibe DSAlertCard dentro do modal' },
            { prop: 'onConfirm', tipo: '() => void', default: '—', descricao: 'Ação do botão principal em warning/destructive' },
            { prop: 'primaryLabel', tipo: 'string', default: 'auto por variant', descricao: 'Label do botão de ação' },
            { prop: 'ghostLabel', tipo: 'string', default: "'Cancelar'", descricao: 'Label do botão secundário' },
            { prop: 'title', tipo: 'string', default: 'auto por variant', descricao: 'Título do modal' },
            { prop: 'body', tipo: 'string', default: 'auto por variant', descricao: 'Texto do corpo' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='dialog' com aria-modal='true' · aria-labelledby apontando para o título"
            keyboard="Esc fecha o modal · Tab navega elementos focáveis · foco trapped dentro do modal enquanto aberto"
            screenReader="Título lido ao abrir · Overlay não é focável · Botão X: aria-label='Fechar'"
            contrast="Texto sobre surfaceDefault — contraste verificado · destructive usa feedbackError para título e ícone"
            focus="Foco move para o modal ao abrir · Retorna ao trigger ao fechar · focusRing visível em todos os controles"
          /> },
        ]}
        preview={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <SectionLabel>Abrir modais</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Labeled component="DSModal" props='variant="default"'>
                  <DSButton onClick={() => setOpenModal('default')}>Modal Default</DSButton>
                </Labeled>
                <Labeled component="DSModal" props='variant="warning"'>
                  <DSButton variant="destructive" onClick={() => setOpenModal('warning')}>Modal Warning</DSButton>
                </Labeled>
                <Labeled component="DSModal" props='variant="destructive"'>
                  <DSButton variant="destructive" onClick={() => setOpenModal('destructive')}>Modal Destructive</DSButton>
                </Labeled>
                <Labeled component="DSModal" props='variant="warning" showCallout'>
                  <DSButton variant="secondary" onClick={() => setOpenModal('callout')}>Modal com Callout</DSButton>
                </Labeled>
              </div>
            </div>

            {/* Preview cards */}
            <div>
              <SectionLabel>Preview — lado a lado</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
                <Labeled component="DSModal" props='variant="default"'>
                  <ModalPreview variant="default" />
                </Labeled>
                <Labeled component="DSModal" props='variant="warning" showCallout'>
                  <ModalPreview variant="warning" showCallout />
                </Labeled>
                <Labeled component="DSModal" props='variant="destructive"'>
                  <ModalPreview variant="destructive" />
                </Labeled>
              </div>
            </div>
          </div>
        }
      />

      {/* Actual modals */}
      <DSModal
        variant="default"
        isOpen={openModal === 'default'}
        onClose={() => setOpenModal(null)}
      />
      <DSModal
        variant="warning"
        isOpen={openModal === 'warning'}
        onClose={() => setOpenModal(null)}
      />
      <DSModal
        variant="destructive"
        isOpen={openModal === 'destructive'}
        onClose={() => setOpenModal(null)}
      />
      <DSModal
        variant="warning"
        showCallout
        isOpen={openModal === 'callout'}
        onClose={() => setOpenModal(null)}
      />
    </>
  )
}

function ModalPreview({ variant, showCallout }: { variant: ModalVariant; showCallout?: boolean }) {
  const isDestructive = variant === 'destructive'
  const isWarning     = variant === 'warning' || isDestructive
  const iconBg    = isDestructive ? t.feedbackErrorBg   : isWarning ? t.brandAccentLight : t.brandPrimaryLight
  // W-03: brandAccentStrong for warning icon (WCAG AA on brandAccentLight)
  const iconColor = isDestructive ? t.feedbackError     : isWarning ? t.brandAccentStrong : t.brandPrimary
  const IconComp  = isDestructive ? AlertOctagon        : isWarning ? AlertTriangle        : Info
  const titleColor = isDestructive ? t.feedbackError : t.textPrimary

  return (
    <div
      style={{
        width: '280px',
        backgroundColor: t.surfaceDefault,
        borderRadius: t.radius3xl,
        boxShadow: '0px 8px 24px rgba(22,46,97,0.1)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: `1px solid ${t.borderDefault}`,
        fontFamily: t.fontFamily,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: t.radiusFull, backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconComp size={24} color={iconColor} />
        </div>
      </div>
      <p style={{ fontSize: '15px', fontWeight: 600, color: titleColor, textAlign: 'center', margin: 0 }}>
        {isDestructive ? 'Ação irreversível' : isWarning ? 'Confirmar cancelamento' : 'Informação'}
      </p>
      <p style={{ fontSize: '12px', color: t.textSecondary, textAlign: 'center', margin: 0, lineHeight: '18px' }}>
        {isWarning ? 'Esta ação não pode ser desfeita.' : 'Revise as informações antes de confirmar.'}
      </p>
      {showCallout && (
        <DSAlertCard
          variant="warning"
          body="Atenção: esta operação afetará todos os títulos selecionados."
        />
      )}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', justifyContent: 'center' }}>
        {isWarning ? (
          <>
            <DSButton variant="ghost" size="sm">Não, continuar</DSButton>
            <DSButton variant="destructive" size="sm">Sim, cancelar</DSButton>
          </>
        ) : (
          <>
            <DSButton variant="secondary" size="sm">Cancelar</DSButton>
            <DSButton size="sm">Confirmar</DSButton>
          </>
        )}
      </div>
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