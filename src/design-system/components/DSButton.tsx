/**
 * DSButton — Botão de ação
 *
 * Aciona operações e navegações primárias. A variante define o peso visual da ação.
 *
 * Variantes:
 * - primary: Fundo brandPrimary, texto textOnBrand. Hover: slide overlay brandPrimaryHover.
 * - secondary: Transparente, borda 2px brandPrimary. Hover: ripple circular brandPrimaryLight.
 * - ghost: Sem fundo, sem borda. Hover: surfaceSubtle.
 * - destructive: Fundo feedbackError. Focus ring usa hexToRgba(feedbackError, 0.35).
 *
 * Estados: Default, Hover, Pressed, Disabled, Loading, Focused
 *
 * Sizes: sm (32px), md (40px), lg (48px)
 */

import React, { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../tokens';
import { hexToRgba } from '../tokens/utils';
import { Loader2, ChevronRight } from 'lucide-react';

export interface DSButtonProps {
  /** Hierarquia visual da ação */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';

  /** Altura e padding */
  size?: 'sm' | 'md' | 'lg';

  /** Exibe spinner e bloqueia clique */
  loading?: boolean;

  /** Desabilita interação visual e funcional */
  disabled?: boolean;

  /** Posição do ícone em relação ao label */
  icon?: 'none' | 'left' | 'right' | 'only';

  /** Elemento de ícone customizado */
  iconEl?: ReactNode;

  /** Ocupa 100% da largura do container pai */
  fullWidth?: boolean;

  /** Tema visual — `dark` para botões sobre fundos escuros */
  theme?: 'light' | 'dark';

  /** Callback de clique */
  onClick?: () => void;

  /** Estilos inline extras */
  style?: CSSProperties;

  /** Label do botão */
  children?: ReactNode;

  /** Tipo do botão (button, submit, reset) */
  type?: 'button' | 'submit' | 'reset';
}

export function DSButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = 'none',
  iconEl = <ChevronRight size={16} />,
  fullWidth = false,
  theme = 'light',
  onClick,
  style,
  children,
  type = 'button',
}: DSButtonProps) {
  const { tokens: t } = useTheme();

  // ═══ CONFIGURAÇÃO DE VARIANTES (dentro do componente, após useTheme) ═══
  const variantConfig = {
    primary: {
      bg: t.brandPrimary,
      bgHover: t.brandPrimaryHover,
      color: t.textOnBrand,
      border: 'none',
      hoverOverlay: t.brandPrimaryHover,
    },
    secondary: {
      bg: 'transparent',
      bgHover: t.brandPrimaryLight,
      color: t.brandPrimary,
      border: `2px solid ${t.brandPrimary}`,
      hoverOverlay: t.brandPrimaryLight,
    },
    ghost: {
      bg: 'transparent',
      bgHover: t.surfaceSubtle,
      color: t.textPrimary,
      border: 'none',
      hoverOverlay: t.surfaceSubtle,
    },
    destructive: {
      bg: t.feedbackError,
      bgHover: t.error600,
      color: t.textOnBrand,
      border: 'none',
      hoverOverlay: t.error600,
    },
  };

  const sizeConfig = {
    sm: { height: 32, paddingH: 16, paddingV: 8, fontSize: 11 },
    md: { height: 40, paddingH: 20, paddingV: 12, fontSize: 13 },
    lg: { height: 48, paddingH: 24, paddingV: 16, fontSize: 14 },
  };

  const darkVariantConfig = {
    primary: {
      bg: t.surfaceDefault,
      bgHover: t.neutral100,
      color: t.brandPrimary,
      border: 'none',
      hoverOverlay: t.neutral100,
    },
    secondary: {
      bg: 'transparent',
      bgHover: 'rgba(255,255,255,0.08)',
      color: t.surfaceDefault,
      border: `2px solid ${t.surfaceDefault}`,
      hoverOverlay: 'rgba(255,255,255,0.08)',
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'rgba(255,255,255,0.08)',
      color: t.surfaceDefault,
      border: 'none',
      hoverOverlay: 'rgba(255,255,255,0.08)',
    },
    destructive: {
      bg: t.feedbackError,
      bgHover: t.error600,
      color: t.textOnBrand,
      border: 'none',
      hoverOverlay: t.error600,
    },
  };

  const cfg = theme === 'dark' ? darkVariantConfig[variant] : variantConfig[variant];
  const szCfg = sizeConfig[size];

  // ═══ ESTADOS ═══
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const isDisabled = disabled || loading;

  // ═══ FOCUS RING ═══
  const focusRingStyle =
    variant === 'destructive'
      ? `0 0 0 3px ${hexToRgba(t.feedbackError, 0.35)}`
      : t.focusRing;

  // ═══ ESTILOS ═══
  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: icon === 'only' ? 0 : 8,
    height: szCfg.height,
    padding:
      icon === 'only'
        ? `${szCfg.paddingV}px`
        : `${szCfg.paddingV}px ${szCfg.paddingH}px`,
    fontSize: szCfg.fontSize,
    fontWeight: 600,
    fontFamily: t.fontFamily,
    color: isDisabled ? t.textDisabled : cfg.color,
    backgroundColor: isDisabled ? t.surfaceMuted : cfg.bg,
    border: isDisabled ? 'none' : cfg.border,
    borderRadius: t.buttonRadius,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    outline: 'none',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  // ═══ HOVER OVERLAY (slide da esquerda para primary) ═══
  const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: isHovered ? 0 : '-100%',
    width: '100%',
    height: '100%',
    backgroundColor: cfg.hoverOverlay,
    transition: 'left 0.3s ease',
    pointerEvents: 'none',
    opacity: variant === 'primary' ? 1 : 0.6,
  };

  // ═══ RENDERIZAÇÃO DE ÍCONE ═══
  const renderIcon = () => {
    if (loading) {
      return (
        <Loader2
          size={16}
          style={{ animation: 'spin 1s linear infinite' }}
        />
      );
    }
    if (icon === 'left' || icon === 'right' || icon === 'only') {
      return iconEl;
    }
    return null;
  };

  // ═══ RENDER ═══
  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={() => !isDisabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !isDisabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onFocus={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.boxShadow = focusRingStyle;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      disabled={isDisabled}
    >
      {/* Hover overlay */}
      {!isDisabled && <div style={overlayStyle} />}

      {/* Conteúdo */}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {(icon === 'left' || icon === 'only') && renderIcon()}
        {icon !== 'only' && (loading ? 'Aguarde...' : children)}
        {icon === 'right' && renderIcon()}
      </span>

      {/* Estilo de animação de spin inline */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
}
