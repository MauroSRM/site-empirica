/**
 * DSCard — Card de feature/destaque
 *
 * Exibe número, ícone, título e descrição.
 * Variantes de superfície: default (branco), muted (cinza claro), dark (navy)
 *
 * Specs:
 * - Border radius: cardRadius
 * - Padding: 28px
 * - Number: textSm 700 brandAccent
 * - Icon container: 36×36px, arredondado
 * - Title: textXl 700 textPrimary (dark: textOnBrand)
 * - Body: textMd 400 textSecondary (dark: rgba branco)
 */

import React, { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../tokens';

export interface DSCardProps {
  /** Número da etapa / índice (ex: "01") */
  number?: string;

  /** Ícone decorativo (ReactNode, ex: <Lightbulb size={18} />) */
  icon?: ReactNode;

  /** Título do card */
  title: string;

  /** Texto descritivo */
  description: string;

  /** Variante de superfície */
  variant?: 'default' | 'muted' | 'dark';

  /** Estilos extras (ex: gridColumn, gridRow) */
  style?: CSSProperties;
}

export function DSCard({
  number,
  icon,
  title,
  description,
  variant = 'default',
  style,
}: DSCardProps) {
  const { tokens: t } = useTheme();

  const isDark = variant === 'dark';
  const isMuted = variant === 'muted';

  const bg    = isDark  ? t.primary800 : isMuted ? t.primary50  : t.surfaceDefault;
  const bdr   = isDark  ? 'none'       : isMuted ? `1px solid ${t.primary200}` : `1px solid ${t.borderDefault}`;
  const iconBg = isDark ? t.brandAccentLight : isMuted ? t.primary100 : t.primary50;
  const iconColor = isDark ? t.brandAccent : t.primary700;
  const titleColor = isDark ? t.textOnBrand : t.primary800;
  const descColor  = isDark ? 'rgba(255,255,255,0.65)' : t.textSecondary;

  const cardStyle: CSSProperties = {
    background: bg,
    border: bdr,
    borderRadius: t.cardRadius,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    ...style,
  };

  const iconWrapStyle: CSSProperties = {
    width: 36,
    height: 36,
    background: iconBg,
    borderRadius: t.cardRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: iconColor,
    flexShrink: 0,
  };

  return (
    <div style={cardStyle}>
      {(number || icon) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {number && (
            <span style={{
              fontFamily: t.fontFamily,
              fontSize: t.textSm,
              fontWeight: 700,
              color: t.brandAccent,
              letterSpacing: '0.08em',
            }}>
              {number}
            </span>
          )}
          {icon && <div style={iconWrapStyle}>{icon}</div>}
        </div>
      )}

      <h3 style={{
        fontFamily: t.fontFamily,
        fontSize: t.textXl,
        fontWeight: 700,
        color: titleColor,
        margin: 0,
        lineHeight: 1.3,
      }}>
        {title}
      </h3>

      <p style={{
        fontFamily: t.fontFamily,
        fontSize: t.textMd,
        fontWeight: 400,
        color: descColor,
        lineHeight: 1.65,
        margin: 0,
      }}>
        {description}
      </p>
    </div>
  );
}
