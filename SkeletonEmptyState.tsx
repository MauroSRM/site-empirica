import React from 'react'
import { Inbox, AlertCircle, Search, WifiOff } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSButton } from './DSButton'

// ─── Skeleton ─────────────────────────────────────────────────

type SkeletonShape = 'line' | 'block' | 'circle' | 'card' | 'listItem' | 'avatar' | 'textGroup' | 'form'

interface DSSkeletonProps {
  shape?: SkeletonShape
  animated?: boolean
  width?: string | number
  height?: string | number
}

// ARQ-SKEL: keyframes definidos no módulo — DSSkeleton auto-suficiente, não depende de DSButton
const SHIMMER_CSS = `@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`

export function DSSkeleton({ shape = 'line', animated = true, width, height }: DSSkeletonProps) {
  const shimmerStyle: React.CSSProperties = animated
    ? {
        background: `linear-gradient(90deg, ${t.surfaceMuted} 25%, ${t.surfaceSubtle} 50%, ${t.surfaceMuted} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }
    : { backgroundColor: t.surfaceMuted }

  const getStyle = (): React.CSSProperties => {
    switch (shape) {
      case 'line':
        return { ...shimmerStyle, width: width || '100%', height: height || '14px', borderRadius: t.radiusSm }
      case 'block':
        return { ...shimmerStyle, width: width || '100%', height: height || '200px', borderRadius: t.cardRadius }
      case 'circle':
        return { ...shimmerStyle, width: '40px', height: '40px', borderRadius: t.radiusFull, flexShrink: 0 }
      case 'card':
        return { ...shimmerStyle, width: '313px', height: '180px', borderRadius: t.cardRadius }
      case 'avatar':
        return { ...shimmerStyle, width: width ?? 40, height: height ?? 40, borderRadius: t.radiusFull, flexShrink: 0 }
      default:
        return { ...shimmerStyle, width: '100%', height: '14px', borderRadius: t.radiusSm }
    }
  }

  if (shape === 'textGroup') {
    return (
      <>
        <style>{SHIMMER_CSS}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <DSSkeleton shape="line" width="100%" height={14} animated={animated} />
          <DSSkeleton shape="line" width="80%"  height={14} animated={animated} />
          <DSSkeleton shape="line" width="60%"  height={14} animated={animated} />
        </div>
      </>
    )
  }

  if (shape === 'form') {
    return (
      <>
        <style>{SHIMMER_CSS}</style>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2].map(i => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <DSSkeleton shape="line"  width={80}   height={12} animated={animated} />
              <DSSkeleton shape="block" width="100%" height={48} animated={animated} />
            </div>
          ))}
        </div>
      </>
    )
  }

  if (shape === 'listItem') {
    return (
      <>
        <style>{SHIMMER_CSS}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <div style={{ ...shimmerStyle, width: '40px', height: '40px', borderRadius: t.radiusFull, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ ...shimmerStyle, width: '100%', height: '14px', borderRadius: t.radiusSm }} />
            <div style={{ ...shimmerStyle, width: '60%', height: '12px', borderRadius: t.radiusSm }} />
          </div>
        </div>
      </>
    )
  }

  if (shape === 'card') {
    return (
      <>
        <style>{SHIMMER_CSS}</style>
        <div
          style={{
            width: '313px',
            padding: '24px',
            borderRadius: t.cardRadius,
            border: `1px solid ${t.borderDefault}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ ...shimmerStyle, width: '100%', height: '60px', borderRadius: t.cardRadius }} />
          <div style={{ ...shimmerStyle, width: '180px', height: '14px', borderRadius: t.radiusSm }} />
          <div style={{ ...shimmerStyle, width: '120px', height: '12px', borderRadius: t.radiusSm }} />
          <div style={{ ...shimmerStyle, width: '80px', height: '12px', borderRadius: t.radiusSm }} />
        </div>
      </>
    )
  }

  return (
    <>
      <style>{SHIMMER_CSS}</style>
      <div style={getStyle()} />
    </>
  )
}

// ─── Empty State ──────────────────────────────────────────────

type EmptyVariant = 'default' | 'error' | 'search' | 'offline'

interface DSEmptyStateProps {
  variant?: EmptyVariant
  withAction?: boolean
  onAction?: () => void
  customHeadline?: string
  customBody?: string
}

export function DSEmptyState({ variant = 'default', withAction = false, onAction, customHeadline, customBody }: DSEmptyStateProps) {
  const { tokens: t } = useTheme()

  const emptyConfig = {
    default: {
      Icon: Inbox,
      iconColor: t.textTertiary,
      iconBg: t.surfaceMuted,
      headline: 'Nenhum item encontrado',
      body: 'Não há itens para exibir no momento. Tente ajustar os filtros ou recarregar a página.',
      actionLabel: 'Recarregar',
    },
    error: {
      Icon: AlertCircle,
      iconColor: t.feedbackError,
      iconBg: t.feedbackErrorBg,
      headline: 'Algo deu errado',
      body: 'Ocorreu um erro ao carregar os dados. Por favor, tente novamente.',
      actionLabel: 'Tentar novamente',
    },
    search: {
      Icon: Search,
      iconColor: t.textTertiary,
      iconBg: t.surfaceMuted,
      headline: 'Sem resultados',
      body: 'Nenhum resultado encontrado para sua busca. Tente outros termos ou limpe os filtros.',
      actionLabel: 'Limpar filtros',
    },
    offline: {
      Icon: WifiOff,
      iconColor: t.textTertiary,
      iconBg: t.surfaceMuted,
      headline: 'Sem conexão',
      body: 'Verifique sua conexão com a internet e tente novamente.',
      actionLabel: 'Tentar novamente',
    },
  }

  const cfg = emptyConfig[variant]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: t.space10,
        gap: '16px',
        fontFamily: t.fontFamily,
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: t.radiusFull,
          backgroundColor: cfg.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <cfg.Icon size={28} color={cfg.iconColor} />
      </div>

      <h3 style={{ fontSize: t.textXl, fontWeight: 600, color: t.textPrimary, margin: 0, textAlign: 'center' }}>
        {customHeadline || cfg.headline}
      </h3>

      <p
        style={{
          fontSize: t.textMd,
          color: t.textSecondary,
          textAlign: 'center',
          maxWidth: '280px',
          margin: 0,
          lineHeight: '20px',
        }}
      >
        {customBody || cfg.body}
      </p>

      {withAction && (
        <DSButton variant={variant === 'error' || variant === 'offline' ? 'primary' : 'ghost'} onClick={onAction}>
          {cfg.actionLabel}
        </DSButton>
      )}
    </div>
  )
}

// ─── CSS for shimmer animation ────────────────────────────────

const shimmerCSS = `
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
`

// ─── Section Showcase ──────────────────────────────────────────

export function SkeletonEmptyStateSection() {
  return (
    <>
      <style>{shimmerCSS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <DSDocSection
          description="Dois componentes complementares: DSkeleton (placeholder animado de carregamento em múltiplas formas) e DSEmptyState (estado vazio com ícone, mensagem e CTA). Cobrem os estados de loading e sem dados."
          whenToUse={['DSkeleton: enquanto dados assíncronos carregam (listas, tabelas, cards)', 'DSEmptyState: quando query retorna 0 resultados', 'DSEmptyState: estado inicial antes de qualquer ação do usuário']}
          whenNotToUse={['Spinner para operações rápidas < 200ms (invisível)', 'Mensagem de erro (use DSAlertCard)', 'Loading de ação em botão (use estado loading no DSButton)']}
          tabs={[
            { label: 'Tokens', content: <TokenTable rows={[
              { elemento: 'Skeleton fundo', token: 't.surfaceSubtle', descricao: 'Cor base do placeholder' },
              { elemento: 'Skeleton shimmer', token: 't.surfaceMuted', descricao: 'Cor do efeito shimmer animado' },
              { elemento: 'EmptyState ícone', token: 't.textTertiary', descricao: 'Cor do ícone ilustrativo' },
              { elemento: 'EmptyState título', token: 't.textPrimary', descricao: 'Texto principal do estado vazio' },
              { elemento: 'EmptyState body', token: 't.textSecondary', descricao: 'Mensagem descritiva do estado vazio' },
              { elemento: 'Radius', token: 't.radiusMd', descricao: 'Arredondamento dos blocos skeleton' },
            ]} /> },
            { label: 'Props', content: <PropsTable rows={[
              { prop: '(Skeleton) shape', tipo: "'line' | 'block' | 'circle' | 'card' | 'listItem' | 'avatar' | 'textGroup' | 'form'", default: "'line'", descricao: 'Forma do placeholder' },
              { prop: '(Skeleton) animated', tipo: 'boolean', default: 'true', descricao: 'Ativa animação shimmer' },
              { prop: '(Skeleton) width/height', tipo: 'string | number', default: 'auto', descricao: 'Dimensões customizadas' },
              { prop: '(EmptyState) variant', tipo: "'default' | 'error' | 'search' | 'offline'", default: "'default'", descricao: 'Tipo de estado vazio' },
              { prop: '(EmptyState) title', tipo: 'string', default: 'auto', descricao: 'Título customizado' },
              { prop: '(EmptyState) action', tipo: '{ label, onClick }', default: 'undefined', descricao: 'Botão de CTA no estado vazio' },
            ]} /> },
            { label: 'Acessibilidade', content: <A11yBlock
              role="Skeleton: role='status' com aria-label='Carregando...' · EmptyState: role='status' com aria-live='polite'"
              keyboard="EmptyState com CTA: Tab para o botão · Enter/Space para acionar"
              screenReader="Skeleton: conteúdo oculto com aria-hidden · EmptyState: mensagem lida ao aparecer via aria-live"
              contrast="textTertiary sobre surfacePrimary — verificado para ícones · textSecondary verificado"
              focus="Apenas o botão de CTA do EmptyState recebe foco"
            /> },
          ]}
        />
        {/* Skeletons base */}
        <div>
          <SectionLabel>Skeleton — shapes base</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
            <div>
              <p style={labelStyle}>Line (texto)</p>
              <Labeled component="DSSkeleton" props='shape="line"'>
                <DSSkeleton shape="line" />
              </Labeled>
            </div>
            <div>
              <p style={labelStyle}>Line (secundário, 60%)</p>
              <Labeled component="DSSkeleton" props='shape="line" height="12px" width="60%"'>
                <DSSkeleton shape="line" height="12px" width="60%" />
              </Labeled>
            </div>
            <div>
              <p style={labelStyle}>Block (200px)</p>
              <Labeled component="DSSkeleton" props='shape="block"'>
                <DSSkeleton shape="block" />
              </Labeled>
            </div>
          </div>
        </div>

        {/* Shapes adicionais — BLOCO 8 */}
        <div>
          <SectionLabel>Shapes adicionais</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
            <div>
              <p style={labelStyle}>Avatar (40×40)</p>
              <Labeled component="DSSkeleton" props='shape="avatar"'>
                <DSSkeleton shape="avatar" />
              </Labeled>
            </div>
            <div style={{ minWidth: 280 }}>
              <p style={labelStyle}>TextGroup (parágrafo)</p>
              <Labeled component="DSSkeleton" props='shape="textGroup"'>
                <DSSkeleton shape="textGroup" />
              </Labeled>
            </div>
            <div style={{ minWidth: 280 }}>
              <p style={labelStyle}>Form (2 campos)</p>
              <Labeled component="DSSkeleton" props='shape="form"'>
                <DSSkeleton shape="form" />
              </Labeled>
            </div>
          </div>
        </div>

        <div>
          <SectionLabel>Skeleton — presets</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
            <div>
              <p style={labelStyle}>CardFundo preset</p>
              <Labeled component="DSSkeleton" props='shape="card"'>
                <DSSkeleton shape="card" />
              </Labeled>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '360px' }}>
              <p style={labelStyle}>ListItem preset (3 items)</p>
              <Labeled component="DSSkeleton" props='shape="listItem"'>
                <DSSkeleton shape="listItem" />
              </Labeled>
              <Labeled component="DSSkeleton" props='shape="listItem"'>
                <DSSkeleton shape="listItem" />
              </Labeled>
              <Labeled component="DSSkeleton" props='shape="listItem"'>
                <DSSkeleton shape="listItem" />
              </Labeled>
            </div>
          </div>
        </div>

        {/* Empty States */}
        <div>
          <SectionLabel>Empty State — 4 variantes</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {(['default', 'error', 'search', 'offline'] as EmptyVariant[]).map(v => (
              <div key={v} style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.cardRadius }}>
                <Labeled component="DSEmptyState" props={`variant="${v}"`}>
                  <DSEmptyState variant={v} />
                </Labeled>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionLabel>Empty State — com ação</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {(['default', 'error', 'search', 'offline'] as EmptyVariant[]).map(v => (
              <div key={v} style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.cardRadius }}>
                <Labeled component="DSEmptyState" props={`variant="${v}" withAction`}>
                  <DSEmptyState variant={v} withAction />
                </Labeled>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  color: t.textTertiary,
  fontFamily: t.fontFamily,
  margin: '0 0 6px',
  textTransform: 'uppercase',
  letterSpacing: '0.4px',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}