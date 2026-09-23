/**
 * DSSlider — Seleção de valor em range contínuo
 *
 * Seleção de valor em range contínuo. Use para filtros de faixa, percentual ou volume.
 *
 * Tipos:
 * - single: Um thumb; preenche da borda esquerda até o thumb
 * - range: Dois thumbs; preenche entre eles
 *
 * Sizes: sm (track 4px, thumb 16px), md (track 6px, thumb 20px)
 */

import React, { CSSProperties, useRef, useState, useEffect } from 'react';
import { useTheme } from '../tokens';

export interface DSSliderProps {
  /** Um ou dois thumbs */
  type?: 'single' | 'range';

  /** Espessura do track e tamanho do thumb */
  size?: 'sm' | 'md';

  /** Valor mínimo */
  min?: number;

  /** Valor máximo */
  max?: number;

  /** Valor do thumb principal */
  value?: number;

  /** Valor do thumb final (apenas range) */
  valueEnd?: number;

  /** Balão com valor acima do thumb */
  showValue?: boolean;

  /** Marcações em 0%, 25%, 50%, 75%, 100% */
  showTicks?: boolean;

  /** Desabilita interação */
  disabled?: boolean;

  /** Callback ao mover */
  onChange?: (val: number, valEnd?: number) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSSlider({
  type = 'single',
  size = 'md',
  min = 0,
  max = 100,
  value = 30,
  valueEnd = 70,
  showValue = true,
  showTicks = false,
  disabled = false,
  onChange,
  style,
}: DSSliderProps) {
  const { tokens: t } = useTheme();

  const [internalValue, setInternalValue] = useState(value);
  const [internalValueEnd, setInternalValueEnd] = useState(valueEnd);

  // ═══ SIZE CONFIG ═══
  const sizeConfig = {
    sm: { trackHeight: 4, thumbSize: 16 },
    md: { trackHeight: 6, thumbSize: 20 },
  };

  const szCfg = sizeConfig[size];

  // ═══ CALCULAR PERCENTUAL ═══
  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;

  const startPercent = getPercent(type === 'range' ? internalValue : min);
  const endPercent = getPercent(type === 'range' ? internalValueEnd : internalValue);

  // ═══ HANDLE CHANGE ═══
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInternalValue(newValue);
    onChange?.(newValue, type === 'range' ? internalValueEnd : undefined);
  };

  const handleValueEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInternalValueEnd(newValue);
    onChange?.(internalValue, newValue);
  };

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    padding: `${szCfg.thumbSize}px 0`,
    fontFamily: t.fontFamily,
    ...style,
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: szCfg.trackHeight,
    backgroundColor: t.surfaceMuted,
    borderRadius: t.radiusFull,
  };

  const fillStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: `${startPercent}%`,
    width: `${endPercent - startPercent}%`,
    height: '100%',
    backgroundColor: t.brandPrimary,
    borderRadius: t.radiusFull,
    pointerEvents: 'none',
  };

  const inputStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: szCfg.trackHeight,
    opacity: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    margin: 0,
    WebkitAppearance: 'none',
  };

  const thumbVisualStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    width: szCfg.thumbSize,
    height: szCfg.thumbSize,
    backgroundColor: t.brandPrimary,
    border: `2px solid ${t.surfaceDefault}`,
    borderRadius: t.radiusFull,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    boxShadow: t.shadowSm,
  };

  const valueBadgeStyle: CSSProperties = {
    position: 'absolute',
    bottom: szCfg.thumbSize + 8,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '2px 6px',
    fontSize: t.textSm,
    fontWeight: 600,
    color: t.textOnBrand,
    backgroundColor: t.brandPrimary,
    borderRadius: t.radiusSm,
    whiteSpace: 'nowrap',
  };

  return (
    <div style={containerStyle}>
      <div style={trackStyle}>
        {/* Fill */}
        <div style={fillStyle} />

        {/* Ticks */}
        {showTicks && (
          <div style={{ position: 'absolute', top: '100%', width: '100%', marginTop: 8 }}>
            {[0, 25, 50, 75, 100].map((tick) => (
              <div
                key={tick}
                style={{
                  position: 'absolute',
                  left: `${tick}%`,
                  transform: 'translateX(-50%)',
                  fontSize: t.textSm,
                  color: t.textTertiary,
                }}
              >
                {tick}
              </div>
            ))}
          </div>
        )}

        {/* Thumb 1 (início para range, único para single) */}
        {type === 'range' && (
          <>
            <input
              type="range"
              min={min}
              max={max}
              value={internalValue}
              onChange={handleValueChange}
              disabled={disabled}
              style={inputStyle}
            />
            <div
              style={{
                ...thumbVisualStyle,
                left: `${getPercent(internalValue)}%`,
              }}
            >
              {showValue && (
                <div style={valueBadgeStyle}>{internalValue}</div>
              )}
            </div>
          </>
        )}

        {/* Thumb 2 (fim para range, único para single) */}
        <input
          type="range"
          min={min}
          max={max}
          value={type === 'range' ? internalValueEnd : internalValue}
          onChange={type === 'range' ? handleValueEndChange : handleValueChange}
          disabled={disabled}
          style={inputStyle}
        />
        <div
          style={{
            ...thumbVisualStyle,
            left: `${type === 'range' ? getPercent(internalValueEnd) : getPercent(internalValue)}%`,
          }}
        >
          {showValue && (
            <div style={valueBadgeStyle}>
              {type === 'range' ? internalValueEnd : internalValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
