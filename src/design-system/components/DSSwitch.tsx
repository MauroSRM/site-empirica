/**
 * DSSwitch — Toggle binário
 *
 * Toggle binário com efeito imediato, sem confirmação.
 * Use para preferências que o usuário ativa/desativa instantaneamente.
 *
 * Estados:
 * - Off: Track borderMedium; thumb à esquerda
 * - On: Track brandPrimary; thumb à direita
 * - Disabled: Opacidade 0.4, cursor not-allowed
 * - Focused: focusRing no track
 *
 * Sizes: sm (32×18px, thumb 12px), md (44×24px, thumb 18px)
 */

import React, { CSSProperties } from 'react';
import { useTheme } from '../tokens';

export interface DSSwitchProps {
  /** Estado atual (controlado externamente) */
  on: boolean;

  /** Dimensões do track e thumb */
  size?: 'sm' | 'md';

  /** Desabilita interação */
  disabled?: boolean;

  /** Texto à direita do switch */
  label?: string;

  /** Texto auxiliar abaixo */
  helper?: string;

  /** Callback ao alternar */
  onChange?: (on: boolean) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSSwitch({
  on,
  size = 'md',
  disabled = false,
  label,
  helper,
  onChange,
  style,
}: DSSwitchProps) {
  const { tokens: t } = useTheme();

  // ═══ SIZE CONFIG ═══
  const sizeConfig = {
    sm: { trackWidth: 32, trackHeight: 18, thumbSize: 12 },
    md: { trackWidth: 44, trackHeight: 24, thumbSize: 18 },
  };

  const szCfg = sizeConfig[size];

  // ═══ HANDLE TOGGLE ═══
  const handleToggle = () => {
    if (disabled) return;
    onChange?.(!on);
  };

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontFamily: t.fontFamily,
    ...style,
  };

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: szCfg.trackWidth,
    height: szCfg.trackHeight,
    backgroundColor: on ? t.brandPrimary : 'transparent',
    border: `2px solid ${on ? t.brandPrimary : t.borderMedium}`,
    borderRadius: t.radiusFull,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.2s ease',
    flexShrink: 0,
    outline: 'none',
  };

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: on ? `calc(100% - ${szCfg.thumbSize + 2}px)` : '2px',
    width: szCfg.thumbSize,
    height: szCfg.thumbSize,
    backgroundColor: t.surfaceDefault,
    borderRadius: t.radiusFull,
    transform: 'translateY(-50%)',
    transition: 'left 0.2s ease',
    boxShadow: t.shadowSm,
  };

  const labelStyle: CSSProperties = {
    fontSize: t.textMd,
    fontWeight: 500,
    color: disabled ? t.textDisabled : t.textPrimary,
  };

  const helperStyle: CSSProperties = {
    fontSize: t.textSm,
    fontWeight: 400,
    color: t.textSecondary,
    marginLeft: szCfg.trackWidth + 12,
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        <div
          role="switch"
          aria-checked={on}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          style={trackStyle}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleToggle();
            }
          }}
          onFocus={(e) => {
            if (!disabled) {
              e.currentTarget.style.boxShadow = t.focusRing;
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={thumbStyle} />
        </div>
        {label && <span style={labelStyle}>{label}</span>}
      </div>
      {helper && <span style={helperStyle}>{helper}</span>}
    </div>
  );
}
