/**
 * DSInput — Campo de entrada de texto
 *
 * Coleta dados digitados. Variantes cobrem texto, busca, senha e OTP de 6 dígitos.
 * Para valor monetário use `CurrencyInput` do FormAdvanced.
 *
 * Variantes (type):
 * - text: Campo livre sem adornos
 * - password: Texto mascarado; botão Eye/EyeOff à direita
 * - search: Ícone Search à esquerda; X à direita quando há valor
 * - otp: 6 células 48×48px; separador após a 3ª célula; auto-avança ao digitar
 *
 * Estados: default, hover, focus, error, disabled, read-only
 *
 * Sizes: sm (40px), md (48px)
 */

import React, { CSSProperties, useState, ChangeEvent } from 'react';
import { useTheme } from '../tokens';
import { Eye, EyeOff, Search, X, AlertCircle } from 'lucide-react';

export interface DSInputProps {
  /** Tipo de entrada e layout do campo */
  type?: 'text' | 'password' | 'search' | 'otp';

  /** Estado visual */
  state?: 'default' | 'hover' | 'focus' | 'error' | 'disabled' | 'read-only';

  /** Altura do campo */
  size?: 'sm' | 'md';

  /** Label acima do campo */
  label?: string;

  /** Texto de placeholder */
  placeholder?: string;

  /** Texto auxiliar abaixo */
  helperText?: string;

  /** Mensagem de erro (substitui helperText no estado error) */
  errorText?: string;

  /** Valor inicial */
  value?: string;

  /** Callback a cada digitação */
  onChange?: (v: string) => void;

  /** Asterisco vermelho ao lado do label */
  required?: boolean;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSInput({
  type = 'text',
  state = 'default',
  size = 'md',
  label,
  placeholder = 'Digite aqui...',
  helperText,
  errorText,
  value: controlledValue,
  onChange,
  required = false,
  style,
}: DSInputProps) {
  const { tokens: t } = useTheme();

  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const value = controlledValue ?? internalValue;
  const isDisabled = state === 'disabled';
  const isReadOnly = state === 'read-only';
  const isError = state === 'error';

  // ═══ SIZE CONFIG ═══
  const sizeConfig = {
    sm: { height: 40, padding: 12, fontSize: 13 },
    md: { height: 48, padding: 12, fontSize: 13 },
  };

  const szCfg = sizeConfig[size];

  // ═══ BORDA E BACKGROUND ═══
  const getBorderColor = () => {
    if (isDisabled) return t.borderDefault;
    if (isError) return t.borderError;
    if (isFocused || state === 'focus') return t.borderBrand;
    if (state === 'hover') return t.borderMedium;
    return t.borderDefault;
  };

  const getBackgroundColor = () => {
    if (isDisabled || isReadOnly) return t.surfaceSubtle;
    if (isError) return t.feedbackErrorBg;
    return t.surfaceDefault;
  };

  // ═══ HANDLE CHANGE ═══
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  // ═══ CLEAR VALUE ═══
  const handleClear = () => {
    setInternalValue('');
    onChange?.('');
  };

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontFamily: t.fontFamily,
    ...style,
  };

  const labelStyle: CSSProperties = {
    fontSize: t.text2Xs,
    fontWeight: 600,
    color: isDisabled ? t.textDisabled : t.textPrimary,
  };

  const inputWrapperStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    height: szCfg.height,
    padding: type === 'search' ? `0 ${szCfg.padding + 32}px 0 ${szCfg.padding + 32}px` : `0 ${szCfg.padding}px`,
    fontSize: 16, // ≥16px obrigatório: previne zoom automático no iOS Safari
    fontFamily: t.fontFamily,
    fontWeight: 500,
    color: isDisabled ? t.textDisabled : t.textPrimary,
    backgroundColor: getBackgroundColor(),
    border: `1px solid ${getBorderColor()}`,
    borderRadius: t.inputRadius,
    outline: 'none',
    transition: 'all 0.15s ease',
  };

  const iconStyle: CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    color: isError ? t.feedbackError : t.textSecondary,
    cursor: type === 'password' || type === 'search' ? 'pointer' : 'default',
  };

  const helperStyle: CSSProperties = {
    fontSize: t.textSm,
    fontWeight: 500,
    color: isError ? t.feedbackError : t.textSecondary,
  };

  // ═══ OTP TYPE (6 células) ═══
  if (type === 'otp') {
    return (
      <div style={containerStyle}>
        {label && (
          <label style={labelStyle}>
            {label}
            {required && <span style={{ color: t.feedbackError, marginLeft: 4 }}>*</span>}
          </label>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <React.Fragment key={idx}>
              <input
                type="text"
                maxLength={1}
                style={{
                  width: 48,
                  height: 48,
                  fontSize: 20,
                  fontWeight: 700,
                  textAlign: 'center',
                  border: `1px solid ${isError ? t.borderError : t.borderDefault}`,
                  borderRadius: t.inputRadius,
                  backgroundColor: isError ? t.feedbackErrorBg : t.surfaceDefault,
                  color: t.textPrimary,
                  outline: 'none',
                  fontFamily: t.fontFamily,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = t.borderBrand;
                  e.currentTarget.style.boxShadow = isError
                    ? `0 0 0 3px rgba(211,0,0,0.18)`
                    : t.focusRing;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = isError ? t.borderError : t.borderDefault;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {idx === 2 && (
                <div
                  style={{
                    width: 16,
                    height: 2,
                    backgroundColor: t.borderDefault,
                    alignSelf: 'center',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        {(helperText || errorText) && (
          <span style={helperStyle}>{isError && errorText ? errorText : helperText}</span>
        )}
      </div>
    );
  }

  // ═══ STANDARD INPUT TYPES ═══
  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: t.feedbackError, marginLeft: 4 }}>*</span>}
        </label>
      )}

      <div style={inputWrapperStyle}>
        {/* Ícone Search à esquerda */}
        {type === 'search' && (
          <Search size={16} style={{ ...iconStyle, left: 12, pointerEvents: 'none' }} />
        )}

        {/* Input */}
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          style={inputStyle}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onFocusCapture={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.boxShadow = isError
                ? `0 0 0 3px rgba(211,0,0,0.18)`
                : t.focusRing;
            }
          }}
          onBlurCapture={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {/* Ícone Error */}
        {isError && (
          <AlertCircle size={16} style={{ ...iconStyle, right: 12, pointerEvents: 'none' }} />
        )}

        {/* Ícone Eye/EyeOff para senha */}
        {type === 'password' && !isError && (
          <div
            style={{ ...iconStyle, right: 12 }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </div>
        )}

        {/* Ícone X para search */}
        {type === 'search' && value && !isError && (
          <div style={{ ...iconStyle, right: 12 }} onClick={handleClear}>
            <X size={16} />
          </div>
        )}
      </div>

      {(helperText || errorText) && (
        <span style={helperStyle}>{isError && errorText ? errorText : helperText}</span>
      )}
    </div>
  );
}
