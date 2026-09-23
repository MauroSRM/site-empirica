/**
 * DSTag — Etiqueta de status ou categoria
 *
 * Categoriza ou indica status. Sempre estática — sem interação.
 * Use para status de entidade em tabela ou categorias de produto.
 * NÃO use para ação clicável (use DSChip).
 *
 * Variantes:
 * - neutral-brand1: Azul (brandPrimaryLight / brandPrimary)
 * - neutral-brand2: Laranja (brandAccentLight / brandAccentStrong)
 * - success: Verde (feedbackSuccessBg / feedbackSuccessText)
 * - warning: Amarelo (feedbackWarningBg / feedbackWarning)
 * - error: Vermelho (feedbackErrorBg / feedbackError)
 * - neutral: Cinza (tagNeutralBg / tagNeutralColor)
 * - info: Azul info (feedbackInfoBg / feedbackInfo)
 *
 * Sizes: sm (20px), md (22px), lg (24px)
 */

import React, { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../tokens';
import { Tag, X } from 'lucide-react';

export interface DSTagProps {
  /** Cor semântica */
  variant?:
    | 'neutral-brand1'
    | 'neutral-brand2'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
    | 'info';

  /** Altura e padding */
  size?: 'sm' | 'md' | 'lg';

  /** Exibe botão X de remoção */
  removable?: boolean;

  /** Exibe ícone Tag à esquerda */
  icon?: boolean;

  /** Texto da etiqueta */
  children?: ReactNode;

  /** Callback ao clicar no X */
  onRemove?: () => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSTag({
  variant = 'neutral-brand1',
  size = 'md',
  removable = false,
  icon = false,
  children,
  onRemove,
  style,
}: DSTagProps) {
  const { tokens: t } = useTheme();

  // ═══ VARIANT CONFIG (dentro do componente, após useTheme) ═══
  const variantConfig = {
    'neutral-brand1': {
      bg: t.brandPrimaryLight,
      color: t.brandPrimary,
    },
    'neutral-brand2': {
      bg: t.brandAccentLight,
      color: t.brandAccentStrong, // WCAG W-03
    },
    success: {
      bg: t.feedbackSuccessBg,
      color: t.feedbackSuccessText, // WCAG Critical-1
    },
    warning: {
      bg: t.feedbackWarningBg,
      color: t.feedbackWarning,
    },
    error: {
      bg: t.feedbackErrorBg,
      color: t.feedbackError,
    },
    neutral: {
      bg: t.tagNeutralBg,
      color: t.tagNeutralColor,
    },
    info: {
      bg: t.feedbackInfoBg,
      color: t.feedbackInfo,
    },
  };

  const sizeConfig = {
    sm: { height: 20, padding: '5px 8px', fontSize: 9 },
    md: { height: 22, padding: '4px 8px', fontSize: 10 },
    lg: { height: 24, padding: '4px 12px', fontSize: 12 },
  };

  const cfg = variantConfig[variant];
  const szCfg = sizeConfig[size];

  // ═══ ESTILOS ═══
  const tagStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    height: szCfg.height,
    padding: szCfg.padding,
    fontSize: szCfg.fontSize,
    fontWeight: 600,
    fontFamily: t.fontFamily,
    backgroundColor: cfg.bg,
    color: cfg.color,
    borderRadius: t.radiusSm,
    whiteSpace: 'nowrap',
    ...style,
  };

  const removeButtonStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginLeft: 2,
  };

  return (
    <span style={tagStyle}>
      {icon && <Tag size={10} />}
      {children}
      {removable && (
        <button
          style={{
            ...removeButtonStyle,
            background: 'none',
            border: 'none',
            padding: 0,
            color: 'inherit',
          }}
          onClick={onRemove}
          aria-label="Remover tag"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}
