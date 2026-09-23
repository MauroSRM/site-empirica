/**
 * DSCheckbox, DSRadio, DSCheckboxGroup, DSRadioGroup
 *
 * Checkbox para seleção múltipla independente; Radio para seleção exclusiva em grupo.
 *
 * Estados:
 * - Desmarcado: Borda borderMedium, fundo surfaceDefault
 * - Checked: Fundo e borda brandPrimary; ícone Check ou ponto branco
 * - Indeterminate: Fundo brandPrimary; ícone Minus (somente checkbox)
 * - Error: Borda feedbackError
 * - Disabled: Opacidade 0.4, cursor not-allowed
 *
 * Sizes: sm (16×16px), md (20×20px)
 */

import React, { CSSProperties } from 'react';
import { useTheme } from '../tokens';
import { Check, Minus, AlertCircle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// DSCheckbox
// ═══════════════════════════════════════════════════════════

export interface DSCheckboxProps {
  /** Estado de seleção */
  checked?: boolean;

  /** Estado intermediário */
  indeterminate?: boolean;

  /** Desabilita interação */
  disabled?: boolean;

  /** Aplica borda de erro */
  error?: boolean;

  /** Texto ao lado */
  label?: string;

  /** Tamanho da célula */
  size?: 'sm' | 'md';

  /** Callback ao alternar */
  onChange?: (checked: boolean) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSCheckbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  error = false,
  label,
  size = 'md',
  onChange,
  style,
}: DSCheckboxProps) {
  const { tokens: t } = useTheme();

  const sizeConfig = {
    sm: { boxSize: 16, fontSize: 12 },
    md: { boxSize: 20, fontSize: 14 },
  };

  const szCfg = sizeConfig[size];

  const handleToggle = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  const isCheckedOrIndeterminate = checked || indeterminate;

  const boxStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: szCfg.boxSize,
    height: szCfg.boxSize,
    backgroundColor: isCheckedOrIndeterminate ? t.brandPrimary : t.surfaceDefault,
    border: `2px solid ${error ? t.feedbackError : isCheckedOrIndeterminate ? t.brandPrimary : t.borderMedium}`,
    borderRadius: t.radiusSm,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s ease',
    flexShrink: 0,
  };

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: t.fontFamily,
    ...style,
  };

  const labelStyle: CSSProperties = {
    fontSize: szCfg.fontSize,
    fontWeight: 500,
    color: disabled ? t.textDisabled : t.textPrimary,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <label style={containerStyle}>
      <div
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        style={boxStyle}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleToggle();
          }
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = error
              ? `0 0 0 3px rgba(211,0,0,0.18)`
              : t.focusRing;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {indeterminate ? (
          <Minus size={szCfg.boxSize - 8} color={t.textOnBrand} />
        ) : (
          checked && <Check size={szCfg.boxSize - 8} color={t.textOnBrand} />
        )}
      </div>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

// ═══════════════════════════════════════════════════════════
// DSRadio
// ═══════════════════════════════════════════════════════════

export interface DSRadioProps {
  /** Estado de seleção */
  checked?: boolean;

  /** Desabilita interação */
  disabled?: boolean;

  /** Aplica borda de erro */
  error?: boolean;

  /** Texto ao lado */
  label?: string;

  /** Tamanho da célula */
  size?: 'sm' | 'md';

  /** Callback ao alternar */
  onChange?: (checked: boolean) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSRadio({
  checked = false,
  disabled = false,
  error = false,
  label,
  size = 'md',
  onChange,
  style,
}: DSRadioProps) {
  const { tokens: t } = useTheme();

  const sizeConfig = {
    sm: { boxSize: 16, dotSize: 8, fontSize: 12 },
    md: { boxSize: 20, dotSize: 10, fontSize: 14 },
  };

  const szCfg = sizeConfig[size];

  const handleToggle = () => {
    if (disabled) return;
    onChange?.(!checked);
  };

  const boxStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: szCfg.boxSize,
    height: szCfg.boxSize,
    backgroundColor: checked ? t.brandPrimary : t.surfaceDefault,
    border: `2px solid ${error ? t.feedbackError : checked ? t.brandPrimary : t.borderMedium}`,
    borderRadius: t.radiusFull,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'all 0.15s ease',
    flexShrink: 0,
  };

  const dotStyle: CSSProperties = {
    width: szCfg.dotSize,
    height: szCfg.dotSize,
    backgroundColor: t.textOnBrand,
    borderRadius: t.radiusFull,
  };

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: t.fontFamily,
    ...style,
  };

  const labelStyle: CSSProperties = {
    fontSize: szCfg.fontSize,
    fontWeight: 500,
    color: disabled ? t.textDisabled : t.textPrimary,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <label style={containerStyle}>
      <div
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        style={boxStyle}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleToggle();
          }
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = error
              ? `0 0 0 3px rgba(211,0,0,0.18)`
              : t.focusRing;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {checked && <div style={dotStyle} />}
      </div>
      {label && <span style={labelStyle}>{label}</span>}
    </label>
  );
}

// ═══════════════════════════════════════════════════════════
// DSCheckboxGroup
// ═══════════════════════════════════════════════════════════

export interface DSCheckboxGroupProps {
  /** Lista de opções */
  options: { label: string; value: string; disabled?: boolean }[];

  /** Valores selecionados */
  value?: string[];

  /** Layout do grupo */
  direction?: 'horizontal' | 'vertical';

  /** Aplica erro a todas as células */
  error?: boolean;

  /** Mensagem de erro abaixo */
  errorText?: string;

  /** Callback ao alterar seleção */
  onChange?: (values: string[]) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSCheckboxGroup({
  options,
  value = [],
  direction = 'vertical',
  error = false,
  errorText,
  onChange,
  style,
}: DSCheckboxGroupProps) {
  const { tokens: t } = useTheme();

  const handleChange = (optValue: string, checked: boolean) => {
    const newValues = checked
      ? [...value, optValue]
      : value.filter((v) => v !== optValue);
    onChange?.(newValues);
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: direction === 'vertical' ? 12 : 16,
    fontFamily: t.fontFamily,
    ...style,
  };

  const errorStyle: CSSProperties = {
    fontSize: t.textSm,
    fontWeight: 500,
    color: t.feedbackError,
    marginTop: 8,
  };

  return (
    <div>
      <div style={containerStyle}>
        {options.map((opt) => (
          <DSCheckbox
            key={opt.value}
            checked={value.includes(opt.value)}
            disabled={opt.disabled}
            error={error}
            label={opt.label}
            onChange={(checked) => handleChange(opt.value, checked)}
          />
        ))}
      </div>
      {error && errorText && <div style={errorStyle}>{errorText}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DSRadioGroup
// ═══════════════════════════════════════════════════════════

export interface DSRadioGroupProps {
  /** Lista de opções */
  options: { label: string; value: string; disabled?: boolean }[];

  /** Valor selecionado */
  value?: string;

  /** Layout do grupo */
  direction?: 'horizontal' | 'vertical';

  /** Aplica erro a todas as células */
  error?: boolean;

  /** Mensagem de erro abaixo */
  errorText?: string;

  /** Callback ao alterar seleção */
  onChange?: (value: string) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSRadioGroup({
  options,
  value,
  direction = 'vertical',
  error = false,
  errorText,
  onChange,
  style,
}: DSRadioGroupProps) {
  const { tokens: t } = useTheme();

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'column' : 'row',
    gap: direction === 'vertical' ? 12 : 16,
    fontFamily: t.fontFamily,
    ...style,
  };

  const errorStyle: CSSProperties = {
    fontSize: t.textSm,
    fontWeight: 500,
    color: t.feedbackError,
    marginTop: 8,
  };

  return (
    <div>
      <div style={containerStyle}>
        {options.map((opt) => (
          <DSRadio
            key={opt.value}
            checked={value === opt.value}
            disabled={opt.disabled}
            error={error}
            label={opt.label}
            onChange={() => onChange?.(opt.value)}
          />
        ))}
      </div>
      {error && errorText && <div style={errorStyle}>{errorText}</div>}
    </div>
  );
}
