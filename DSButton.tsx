import React, { useRef, useState, useEffect } from 'react'
import { Loader2, ChevronRight } from 'lucide-react'
import { t, hexToRgba } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonIconPos = 'none' | 'left' | 'right' | 'only'
export type ButtonTheme = 'light' | 'dark'

interface DSButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  icon?: ButtonIconPos
  iconEl?: React.ReactNode
  children?: React.ReactNode
  onClick?: () => void
  fullWidth?: boolean
  theme?: ButtonTheme
  style?: React.CSSProperties
}

// fontSize via t.text* — escala tipográfica centralizada (ARQ-03)
const sizeMap = {
  sm: { paddingH: '16px', paddingV: '8px',  height: '32px', circleSize: 32 },
  md: { paddingH: '20px', paddingV: '12px', height: '40px', circleSize: 40 },
  lg: { paddingH: '24px', paddingV: '16px', height: '48px', circleSize: 48 },
}

export function DSButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = 'none',
  iconEl,
  children,
  onClick,
  fullWidth = false,
  theme = 'light',
  style: extraStyle,
}: DSButtonProps) {
  const { tokens: t } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [focused, setFocused] = useState(false)

  // BLOCO 4 — ripple dinâmico: tamanho calculado via getBoundingClientRect
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [rippleSize, setRippleSize] = useState(40)

  useEffect(() => {
    const updateSize = () => {
      if (buttonRef.current) {
        const { width, height } = buttonRef.current.getBoundingClientRect()
        if (width > 0) {
          setRippleSize(Math.ceil(Math.sqrt(width * width + height * height) * 2))
        }
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [size, fullWidth])

  const isDisabled = disabled || loading
  const isDark = theme === 'dark'
  const sz = sizeMap[size]
  const fontSize = size === 'sm' ? t.textSm : size === 'lg' ? t.textLg : t.textMd

  // loading usa o bg da variante — só disabled aplica estilo cinza
  const isVisuallyDisabled = disabled && !loading

  const getStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      height: sz.height,
      padding: `${sz.paddingV} ${sz.paddingH}`,
      borderRadius: t.buttonRadius,
      fontSize,
      fontWeight: 600,
      fontFamily: t.fontFamily,
      letterSpacing: '0.01em',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      border: 'none',
      outline: 'none',
      transition: 'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      width: fullWidth ? '100%' : undefined,
      position: 'relative',
      overflow: 'hidden',
      // V-14: destructive gets error-based focus ring; all others use brand focus ring
      boxShadow: focused && !isDisabled
        ? (variant === 'destructive' ? `0 0 0 3px ${hexToRgba(t.feedbackError, 0.35)}` : t.focusRing)
        : 'none',
      ...extraStyle,
    }

    if (variant === 'primary') {
      if (isDark) {
        return {
          ...base,
          // Primary dark: fundo branco, texto azul
          // Disabled: bg rgba(255,255,255,0.2), texto rgba(255,255,255,0.4)
          backgroundColor: isVisuallyDisabled
            ? 'rgba(255,255,255,0.2)'
            : pressed
            ? t.brandPrimaryLight
            : t.surfaceDefault,
          color: isVisuallyDisabled ? 'rgba(255,255,255,0.4)' : t.brandPrimary,
        }
      }
      return {
        ...base,
        backgroundColor: isVisuallyDisabled ? t.surfaceMuted : pressed ? t.primary900 : t.brandPrimary,
        color: isVisuallyDisabled ? t.textDisabled : t.textOnBrand,
        opacity: isVisuallyDisabled ? 0.5 : 1,
      }
    }

    if (variant === 'secondary') {
      if (isDark) {
        return {
          ...base,
          backgroundColor: pressed && !isDisabled ? 'rgba(255,255,255,0.1)' : 'transparent',
          // Border 2px — hover: 0.8 opacidade, default: 0.5, disabled: 0.2
          border: isVisuallyDisabled
            ? '2px solid rgba(255,255,255,0.2)'
            : hovered
            ? '2px solid rgba(255,255,255,0.8)'
            : '2px solid rgba(255,255,255,0.5)',
          color: isVisuallyDisabled ? t.textDisabled : t.textOnBrand,
        }
      }
      return {
        ...base,
        backgroundColor: 'transparent',
        border: `2px solid ${isVisuallyDisabled ? t.borderMedium : t.borderBrand}`,
        color: isVisuallyDisabled ? t.textDisabled : t.brandPrimary,
      }
    }

    if (variant === 'ghost') {
      if (isDark) {
        return {
          ...base,
          backgroundColor: pressed && !isDisabled
            ? 'rgba(255,255,255,0.15)'
            : hovered && !isDisabled
            ? 'rgba(255,255,255,0.08)'
            : 'transparent',
          color: isVisuallyDisabled ? t.textDisabled : t.textOnBrand,
        }
      }
      return {
        ...base,
        backgroundColor: pressed && !isDisabled
          ? t.surfaceMuted
          : hovered && !isDisabled
          ? t.surfaceSubtle
          : 'transparent',
        color: isVisuallyDisabled ? t.textDisabled : t.brandPrimary,
      }
    }

    if (variant === 'destructive') {
      return {
        ...base,
        backgroundColor: isVisuallyDisabled ? t.surfaceMuted : hovered ? t.error600 : t.feedbackError,
        color: isVisuallyDisabled ? t.textDisabled : t.textOnBrand,
        opacity: isVisuallyDisabled ? 0.5 : 1,
      }
    }

    return base
  }

  const defaultIcon = <ChevronRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />

  // Estilo comum do ripple — dinâmico (BLOCO 4)
  const rippleBase: React.CSSProperties = {
    position: 'absolute',
    width: rippleSize,
    height: rippleSize,
    borderRadius: '50%',
    pointerEvents: 'none',
    left: '50%',
    top: '50%',
    marginLeft: -(rippleSize / 2),
    marginTop: -(rippleSize / 2),
    transition: 'transform 250ms ease-out, opacity 200ms ease-out',
    zIndex: 0,
  }

  return (
    <button
      ref={buttonRef}
      style={getStyle()}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {/* Primary light — slide overlay da esquerda */}
      {variant === 'primary' && !isDark && !isDisabled && !loading && (
        <span aria-hidden style={{
          position: 'absolute', inset: 0,
          borderRadius: t.buttonRadius,
          backgroundColor: t.brandPrimaryHover,
          transform: hovered ? 'translateX(0)' : 'translateX(-101%)',
          transition: 'transform 200ms ease-out',
          zIndex: 0,
        }} />
      )}

      {/* Primary dark — slide overlay da esquerda com cor brandPrimaryLight */}
      {variant === 'primary' && isDark && !isDisabled && !loading && (
        <span aria-hidden style={{
          position: 'absolute', inset: 0,
          borderRadius: t.buttonRadius,
          backgroundColor: t.brandPrimaryLight,
          transform: hovered ? 'translateX(0)' : 'translateX(-101%)',
          transition: 'transform 200ms ease-out',
          zIndex: 0,
        }} />
      )}

      {/* Secondary light — ripple circular do centro (BLOCO 4: tamanho dinâmico) */}
      {variant === 'secondary' && !isDark && !isDisabled && !loading && (
        <span aria-hidden style={{
          ...rippleBase,
          backgroundColor: t.brandPrimaryLight,
          transform: hovered ? 'scale(1)' : 'scale(0)',
          opacity: hovered ? 1 : 0,
        }} />
      )}

      {/* Secondary dark — ripple branco (BLOCO 2: variante dark) */}
      {variant === 'secondary' && isDark && !isDisabled && !loading && (
        <span aria-hidden style={{
          ...rippleBase,
          backgroundColor: 'rgba(255,255,255,0.15)',
          transform: hovered ? 'scale(1)' : 'scale(0)',
          opacity: hovered ? 1 : 0,
        }} />
      )}

      {/* Conteúdo — sempre acima dos overlays */}
      <span style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {loading && (
          <>
            <style>{`@keyframes dsSpinLoader { to { transform: rotate(360deg); } }`}</style>
            <Loader2 size={16} style={{ animation: 'dsSpinLoader 1s linear infinite' }} />
          </>
        )}
        {!loading && icon === 'left' && (iconEl || defaultIcon)}
        {icon !== 'only' && (loading ? 'Aguarde...' : children)}
        {!loading && icon === 'right' && (iconEl || defaultIcon)}
        {!loading && icon === 'only' && (iconEl || defaultIcon)}
      </span>
    </button>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function DSButtonSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Aciona operações e navegações primárias. A variante define o peso visual da ação."
      whenToUse={['Ação principal de formulário', 'CTA de conversão ou confirmação', 'Ação em modal']}
      whenNotToUse={['Navegação entre páginas (use link)', 'Mais de 2 botões primários por tela', 'Label com mais de 4 palavras']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Variants */}
          <div>
            <SectionLabel>Variantes</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <Labeled component="DSButton" props='variant="primary"'><DSButton variant="primary">Primary</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="secondary"'><DSButton variant="secondary">Secondary</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="ghost"'><DSButton variant="ghost">Ghost</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="destructive"'><DSButton variant="destructive">Destructive</DSButton></Labeled>
            </div>
          </div>
          {/* Sizes */}
          <div>
            <SectionLabel>Tamanhos</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <Labeled component="DSButton" props='size="sm"'><DSButton size="sm">Small</DSButton></Labeled>
              <Labeled component="DSButton" props='size="md"'><DSButton size="md">Medium</DSButton></Labeled>
              <Labeled component="DSButton" props='size="lg"'><DSButton size="lg">Large</DSButton></Labeled>
            </div>
          </div>
          {/* States */}
          <div>
            <SectionLabel>Estados — Primary</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <Labeled component="DSButton" props='variant="primary"'><DSButton>Default</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="primary" disabled'><DSButton disabled>Disabled</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="primary" loading'><DSButton loading>Loading</DSButton></Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Estados — Secondary</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <Labeled component="DSButton" props='variant="secondary"'><DSButton variant="secondary">Default</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="secondary" disabled'><DSButton variant="secondary" disabled>Disabled</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="secondary" loading'><DSButton variant="secondary" loading>Loading</DSButton></Labeled>
            </div>
          </div>
          {/* Icon positions */}
          <div>
            <SectionLabel>Com Icone</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <Labeled component="DSButton" props='icon="left"'><DSButton icon="left">Icon Left</DSButton></Labeled>
              <Labeled component="DSButton" props='icon="right"'><DSButton icon="right">Icon Right</DSButton></Labeled>
              <Labeled component="DSButton" props='icon="only"'><DSButton icon="only" /></Labeled>
              <Labeled component="DSButton" props='variant="secondary" icon="left"'><DSButton variant="secondary" icon="left">Secondary Icon</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="ghost" icon="left"'><DSButton variant="ghost" icon="left">Ghost Icon</DSButton></Labeled>
            </div>
          </div>
          {/* V-06: hover / pressed static frames */}
          <div>
            <SectionLabel>Estados interativos — hover / pressed</SectionLabel>
            {([
              {
                variant: 'primary',
                hoverStyle: { backgroundColor: t.brandPrimaryHover, color: t.textOnBrand },
                pressedStyle: { backgroundColor: t.brandSecondary, color: t.textOnBrand, transform: 'scale(0.98)', boxShadow: t.focusRing },
              },
              {
                variant: 'secondary',
                hoverStyle: { backgroundColor: t.surfaceSubtle, border: `2px solid ${t.brandPrimaryHover}`, color: t.brandPrimaryHover },
                pressedStyle: { backgroundColor: t.primary50, border: `2px solid ${t.brandSecondary}`, color: t.brandSecondary, transform: 'scale(0.98)', boxShadow: t.focusRing },
              },
              {
                variant: 'ghost',
                hoverStyle: { backgroundColor: t.surfaceSubtle, color: t.brandPrimaryHover },
                pressedStyle: { backgroundColor: t.primary100, color: t.brandSecondary, transform: 'scale(0.98)', boxShadow: t.focusRing },
              },
              {
                variant: 'destructive',
                hoverStyle: { backgroundColor: t.feedbackError, filter: 'brightness(0.88)', color: t.textOnBrand },
                pressedStyle: { backgroundColor: t.feedbackError, filter: 'brightness(0.80)', color: t.textOnBrand, transform: 'scale(0.98)', boxShadow: `0 0 0 3px ${hexToRgba(t.feedbackError, 0.35)}` },
              },
            ] as { variant: ButtonVariant; hoverStyle: React.CSSProperties; pressedStyle: React.CSSProperties }[]).map(({ variant, hoverStyle, pressedStyle }) => (
              <div key={variant} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                {[
                  { label: 'Default', style: {} as React.CSSProperties, el: <DSButton variant={variant}>{variant}</DSButton> },
                  { label: 'Hover',   style: hoverStyle },
                  { label: 'Pressed', style: pressedStyle },
                ].map(({ label, style: overrideStyle, el }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    {el ?? (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        height: '40px', padding: '0 20px', borderRadius: t.buttonRadius,
                        fontSize: t.textMd, fontWeight: 600, fontFamily: t.fontFamily,
                        cursor: 'default', userSelect: 'none', whiteSpace: 'nowrap',
                        border: variant === 'secondary' ? `2px solid ${t.brandPrimary}` : 'none',
                        backgroundColor: variant === 'primary' ? t.brandPrimary : variant === 'destructive' ? t.feedbackError : 'transparent',
                        color: variant === 'primary' || variant === 'destructive' ? t.textOnBrand : t.brandPrimary,
                        ...overrideStyle,
                      }}>
                        {variant}
                      </div>
                    )}
                    <span style={{ fontSize: '11px', color: t.textTertiary, fontFamily: t.fontFamily, textAlign: 'center' }}>{label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Secondary fullWidth */}
          <div>
            <SectionLabel>Secondary fullWidth — ripple cobre toda a largura</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '480px' }}>
              <Labeled component="DSButton" props='variant="secondary" fullWidth'><DSButton variant="secondary" fullWidth>Confirmar operacao completa de titulo</DSButton></Labeled>
              <Labeled component="DSButton" props='variant="secondary" size="lg" fullWidth'><DSButton variant="secondary" size="lg" fullWidth>Botao largo com ripple dinamico</DSButton></Labeled>
            </div>
          </div>
          {/* Dark theme */}
          <div>
            <SectionLabel>Dark Theme</SectionLabel>
            <div style={{ backgroundColor: t.brandPrimary, borderRadius: t.cardRadius, padding: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Labeled component="DSButton" props='theme="dark" variant="primary"'><DSButton theme="dark" variant="primary">Primary dark</DSButton></Labeled>
              <Labeled component="DSButton" props='theme="dark" variant="primary" disabled'><DSButton theme="dark" variant="primary" disabled>Primary disabled</DSButton></Labeled>
              <Labeled component="DSButton" props='theme="dark" variant="primary" loading'><DSButton theme="dark" variant="primary" loading>Primary loading</DSButton></Labeled>
              <Labeled component="DSButton" props='theme="dark" variant="secondary"'><DSButton theme="dark" variant="secondary">Secondary dark</DSButton></Labeled>
              <Labeled component="DSButton" props='theme="dark" variant="secondary" disabled'><DSButton theme="dark" variant="secondary" disabled>Secondary disabled</DSButton></Labeled>
              <Labeled component="DSButton" props='theme="dark" variant="secondary" loading'><DSButton theme="dark" variant="secondary" loading>Secondary loading</DSButton></Labeled>
              <Labeled component="DSButton" props='theme="dark" variant="ghost"'><DSButton theme="dark" variant="ghost">Ghost dark</DSButton></Labeled>
              <Labeled component="DSButton" props='theme="dark" variant="ghost" disabled'><DSButton theme="dark" variant="ghost" disabled>Ghost disabled</DSButton></Labeled>
            </div>
          </div>
          {/* All variants × states — V-15b */}
          <div>
            <SectionLabel>Todas as variantes x estados</SectionLabel>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'separate', borderSpacing: '8px' }}>
                <thead>
                  <tr>
                    {['Variante', 'Default', 'Hover', 'Pressed', 'Disabled', 'Loading'].map(h => (
                      <th key={h} style={{ textAlign: 'left', fontSize: '11px', color: t.textTertiary, fontWeight: 600, padding: '0 8px 8px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    {
                      v: 'primary' as ButtonVariant,
                      hoverStyle: { backgroundColor: t.brandPrimaryHover, color: t.textOnBrand },
                      pressedStyle: { backgroundColor: t.brandSecondary, color: t.textOnBrand, transform: 'scale(0.98)', boxShadow: t.focusRing },
                    },
                    {
                      v: 'secondary' as ButtonVariant,
                      hoverStyle: { backgroundColor: t.surfaceSubtle, border: `2px solid ${t.brandPrimaryHover}`, color: t.brandPrimaryHover },
                      pressedStyle: { backgroundColor: t.primary50, border: `2px solid ${t.brandSecondary}`, color: t.brandSecondary, transform: 'scale(0.98)', boxShadow: t.focusRing },
                    },
                    {
                      v: 'ghost' as ButtonVariant,
                      hoverStyle: { backgroundColor: t.surfaceSubtle, color: t.brandPrimaryHover },
                      pressedStyle: { backgroundColor: t.primary100, color: t.brandSecondary, transform: 'scale(0.98)', boxShadow: t.focusRing },
                    },
                    {
                      v: 'destructive' as ButtonVariant,
                      hoverStyle: { backgroundColor: t.feedbackError, filter: 'brightness(0.88)', color: t.textOnBrand },
                      pressedStyle: { backgroundColor: t.feedbackError, filter: 'brightness(0.80)', color: t.textOnBrand, transform: 'scale(0.98)', boxShadow: `0 0 0 3px ${hexToRgba(t.feedbackError, 0.35)}` },
                    },
                  ]).map(({ v, hoverStyle, pressedStyle }) => {
                    const baseStyle: React.CSSProperties = {
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      height: '40px', padding: '0 20px', borderRadius: t.buttonRadius,
                      fontSize: t.textMd, fontWeight: 600, fontFamily: t.fontFamily,
                      cursor: 'default', userSelect: 'none', whiteSpace: 'nowrap',
                      border: v === 'secondary' ? `2px solid ${t.brandPrimary}` : 'none',
                      backgroundColor: v === 'primary' ? t.brandPrimary : v === 'destructive' ? t.feedbackError : 'transparent',
                      color: v === 'primary' || v === 'destructive' ? t.textOnBrand : t.brandPrimary,
                    }
                    return (
                      <tr key={v}>
                        <td style={{ fontSize: '11px', color: t.textSecondary, fontWeight: 600, paddingRight: '8px', textTransform: 'capitalize', verticalAlign: 'middle' }}>{v}</td>
                        <td style={{ padding: '4px 8px' }}><DSButton variant={v}>{v}</DSButton></td>
                        <td style={{ padding: '4px 8px' }}><div style={{ ...baseStyle, ...hoverStyle }}>{v}</div></td>
                        <td style={{ padding: '4px 8px' }}><div style={{ ...baseStyle, ...pressedStyle }}>{v}</div></td>
                        <td style={{ padding: '4px 8px' }}><DSButton variant={v} disabled>{v}</DSButton></td>
                        <td style={{ padding: '4px 8px' }}><DSButton variant={v} loading>{v}</DSButton></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo primary', token: 't.brandPrimary', descricao: 'Cor de fundo da variante primary' },
          { elemento: 'Hover overlay', token: 't.brandPrimaryHover', descricao: 'Overlay de hover no primary' },
          { elemento: 'Texto on-brand', token: 't.textOnBrand', descricao: 'Texto sobre fundo brandPrimary' },
          { elemento: 'Borda secondary', token: 't.brandPrimary', descricao: 'Borda e texto da variante secondary' },
          { elemento: 'Fundo disabled', token: 't.surfaceSubtle', descricao: 'Fundo quando desabilitado' },
          { elemento: 'Texto disabled', token: 't.textDisabled', descricao: 'Texto apagado no estado disabled' },
          { elemento: 'Fundo destructive', token: 't.feedbackError', descricao: 'Fundo da variante destructive' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco para acessibilidade' },
          { elemento: 'Border radius', token: 't.buttonRadius', descricao: 'Raio de borda do botão' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'primary' | 'secondary' | 'ghost' | 'destructive'", default: "'primary'", descricao: 'Hierarquia visual da ação' },
          { prop: 'size', tipo: "'sm' | 'md' | 'lg'", default: "'md'", descricao: 'Altura e padding do botão' },
          { prop: 'loading', tipo: 'boolean', default: 'false', descricao: 'Exibe spinner e bloqueia clique' },
          { prop: 'disabled', tipo: 'boolean', default: 'false', descricao: 'Desabilita interação visual e funcional' },
          { prop: 'icon', tipo: "'none' | 'left' | 'right' | 'only'", default: "'none'", descricao: 'Posição do ícone em relação ao label' },
          { prop: 'iconEl', tipo: 'ReactNode', default: '—', descricao: 'Elemento de ícone customizado' },
          { prop: 'fullWidth', tipo: 'boolean', default: 'false', descricao: 'Ocupa 100% da largura do pai' },
          { prop: 'theme', tipo: "'light' | 'dark'", default: "'light'", descricao: 'Tema visual (dark para fundos escuros)' },
          { prop: 'onClick', tipo: '() => void', default: '—', descricao: 'Callback de clique' },
          { prop: 'style', tipo: 'CSSProperties', default: '—', descricao: 'Estilos inline extras' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='button' nativo via elemento <button>"
          keyboard="Tab para focar · Space ou Enter para acionar"
          screenReader="Label obrigatório via children · aria-disabled quando disabled · aria-busy quando loading"
          contrast="Primary: textOnBrand sobre brandPrimary — ratio mínimo 4.5:1"
          focus="focusRing visível: 0 0 0 3px brandPrimary a 35% — nunca remover outline"
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