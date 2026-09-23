/**
 * DSInput — DS Matriz v04
 * Spec: seção 4.2
 * Regra: inline styles APENAS — ZERO Tailwind, ZERO CSS Modules
 * Exceção: className="ds-input" apenas no <input> (para ::placeholder)
 */
import React, { useState, useId } from "react";
import { Eye, EyeOff, Search, X, AlertCircle } from "lucide-react";
import { useTheme } from "../../../design-system";

export type InputType  = 'text' | 'password' | 'search';
export type InputState = 'default' | 'error' | 'disabled' | 'read-only';
export type InputSize  = 'sm' | 'md';

export interface DSInputProps {
  type?:         InputType;
  state?:        InputState;
  size?:         InputSize;
  label?:        string;
  placeholder?:  string;
  helperText?:   string;
  errorText?:    string;
  value?:        string;
  onChange?:     (v: string) => void;
  required?:     boolean;
  name?:         string;
  autoComplete?: string;
  id?:           string;
  style?:        React.CSSProperties;
}

export function DSInput({
  type = 'text', state = 'default', size = 'md',
  label, placeholder = 'Digite aqui...', helperText, errorText,
  value = '', onChange, required = false, name, autoComplete, id, style,
}: DSInputProps) {
  const { tokens: t } = useTheme();
  const genId   = useId();
  const inputId = id ?? genId;

  const [hover,   setHover]   = useState(false);
  const [focused, setFocused] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const isDisabled = state === 'disabled';
  const isReadOnly = state === 'read-only';
  const isError    = state === 'error';
  const height     = size === 'md' ? 48 : 40;

  let border: string; let bg: string; let boxShadow = 'none';

  if (isDisabled || isReadOnly) {
    border = `1px solid ${t.borderDefault}`; bg = t.surfaceMuted;
  } else if (isError) {
    border = `1px solid ${t.borderError}`;   bg = t.feedbackErrorBg;
  } else if (focused) {
    border = `1px solid ${t.borderBrand}`;   bg = t.surfaceDefault; boxShadow = t.focusRing;
  } else if (hover) {
    border = `1px solid ${t.borderMedium}`;  bg = t.surfaceDefault;
  } else {
    border = `1px solid ${t.borderDefault}`; bg = t.surfaceDefault;
  }

  const nativeType = type === 'password' ? (showPw ? 'text' : 'password') : 'text';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space1, width: "100%", ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontFamily: t.fontFamily, fontSize: t.text2Xs, fontWeight: 500,
          color: t.textSecondary, lineHeight: "18px",
          display: "flex", alignItems: "center", gap: 3,
        }}>
          {label}
          {required && <span style={{ color: t.feedbackError, fontSize: t.textMd, lineHeight: 1 }}>*</span>}
        </label>
      )}

      <div
        onMouseEnter={() => { if (!isDisabled && !isReadOnly) setHover(true); }}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "flex", alignItems: "center", gap: t.space2,
          height, border, borderRadius: t.inputRadius, background: bg, boxShadow,
          padding: "0 12px", transition: "border-color 0.15s, box-shadow 0.15s",
          opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? "not-allowed" : undefined,
          boxSizing: "border-box" as const,
        }}
      >
        {type === 'search' && (
          <span style={{ display: "flex", alignItems: "center", flexShrink: 0, pointerEvents: "none" }}>
            <Search size={16} color={t.textTertiary} />
          </span>
        )}

        <input
          id={inputId} name={name} type={nativeType}
          value={value} onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder} disabled={isDisabled} readOnly={isReadOnly}
          autoComplete={autoComplete}
          onFocus={() => { if (!isDisabled && !isReadOnly) setFocused(true); }}
          onBlur={() => setFocused(false)}
          className="ds-input"
          style={{
            flex: 1, minWidth: 0, border: "none", outline: "none",
            background: "transparent", fontFamily: t.fontFamily, fontSize: t.textMd,
            color: isDisabled ? t.textTertiary : t.textPrimary,
            cursor: isDisabled ? "not-allowed" : undefined, padding: 0,
          }}
        />

        {type === 'password' && (
          <button type="button" tabIndex={-1}
            onClick={() => !isDisabled && setShowPw(v => !v)}
            style={{
              background: "none", border: "none",
              cursor: isDisabled ? "not-allowed" : "pointer",
              padding: 0, color: t.textSecondary, display: "flex", flexShrink: 0, lineHeight: 0,
            }}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {type === 'search' && value && (
          <button type="button" onClick={() => onChange?.('')} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 0, color: t.textTertiary, display: "flex", flexShrink: 0, lineHeight: 0,
          }}>
            <X size={14} />
          </button>
        )}
      </div>

      {isError && errorText && (
        <div style={{ display: "flex", alignItems: "center", gap: t.space1 }}>
          <AlertCircle size={12} color={t.feedbackError} />
          <span style={{ fontFamily: t.fontFamily, fontSize: t.textSm, color: t.feedbackError }}>
            {errorText}
          </span>
        </div>
      )}

      {!isError && helperText && (
        <span style={{ fontFamily: t.fontFamily, fontSize: t.textSm, color: t.textSecondary }}>
          {helperText}
        </span>
      )}

      <style>{`
        .ds-input::placeholder { color: ${t.textTertiary}; opacity: 1; }
      `}</style>
    </div>
  );
}
