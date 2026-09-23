/**
 * DSSelect — Seleção de uma opção em lista fechada
 *
 * Seleção de uma opção em lista fechada, com busca opcional.
 * Para menos de 4 opções use DSRadio; para seleção múltipla use DSCheckbox.
 *
 * Estados:
 * - default: Borda borderDefault
 * - open: Borda borderBrand + focusRing; ChevronDown rotaciona 180°
 * - filled: Valor selecionado em textPrimary
 * - error: Borda borderError + errorText
 * - disabled: Fundo surfaceSubtle, opacidade 0.5
 *
 * Sizes: sm (40px), md (48px)
 *
 * Dropdown: maxHeight 240px, borderRadius radiusLg, cada opção 40px de altura
 */

import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import { useTheme } from '../tokens';
import { ChevronDown, Check, Search, AlertCircle } from 'lucide-react';

export interface DSSelectProps {
  /** Estado visual */
  state?: 'default' | 'open' | 'error' | 'disabled' | 'filled';

  /** Altura do trigger */
  size?: 'sm' | 'md';

  /** Label acima */
  label?: string;

  /** Texto quando sem seleção */
  placeholder?: string;

  /** Texto auxiliar */
  helperText?: string;

  /** Mensagem de erro */
  errorText?: string;

  /** Opções disponíveis */
  options?: string[];

  /** Campo de busca no topo do dropdown */
  withSearch?: boolean;

  /** Valor selecionado */
  value?: string;

  /** Callback ao selecionar */
  onChange?: (v: string) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSSelect({
  state = 'default',
  size = 'md',
  label,
  placeholder = 'Selecione...',
  helperText,
  errorText,
  options = [],
  withSearch = false,
  value: controlledValue,
  onChange,
  style,
}: DSSelectProps) {
  const { tokens: t } = useTheme();

  const [isOpen, setIsOpen] = useState(state === 'open');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState(controlledValue ?? '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const value = controlledValue ?? selectedValue;
  const isDisabled = state === 'disabled';
  const isError = state === 'error';

  // ═══ SIZE CONFIG ═══
  const sizeConfig = {
    sm: { height: 40, padding: 12, fontSize: 13 },
    md: { height: 48, padding: 12, fontSize: 13 },
  };

  const szCfg = sizeConfig[size];

  // ═══ FILTRO DE OPÇÕES ═══
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ═══ HANDLE SELECT ═══
  const handleSelect = (opt: string) => {
    setSelectedValue(opt);
    onChange?.(opt);
    setIsOpen(false);
    setSearchQuery('');
  };

  // ═══ CLICK FORA ═══
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    position: 'relative',
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

  const triggerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: szCfg.height,
    padding: `0 ${szCfg.padding}px`,
    fontSize: szCfg.fontSize,
    fontWeight: 500,
    fontFamily: t.fontFamily,
    color: value ? t.textPrimary : t.textTertiary,
    backgroundColor: isDisabled ? t.surfaceSubtle : t.surfaceDefault,
    border: `1px solid ${isError ? t.borderError : isOpen ? t.borderBrand : t.borderDefault}`,
    borderRadius: t.inputRadius,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    outline: 'none',
    transition: 'all 0.15s ease',
  };

  const dropdownStyle: CSSProperties = {
    position: 'absolute',
    top: `calc(100% + 8px)`,
    left: 0,
    right: 0,
    maxHeight: 240,
    backgroundColor: t.surfaceDefault,
    border: `1px solid ${t.borderDefault}`,
    borderRadius: t.radiusLg,
    boxShadow: t.shadowDropdown,
    overflow: 'auto',
    zIndex: 1000,
  };

  const optionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    padding: `0 12px`,
    fontSize: t.textMd,
    fontWeight: 500,
    color: t.textPrimary,
    cursor: 'pointer',
    transition: 'background 0.1s ease',
  };

  const helperStyle: CSSProperties = {
    fontSize: t.textSm,
    fontWeight: 500,
    color: isError ? t.feedbackError : t.textSecondary,
  };

  return (
    <div ref={dropdownRef} style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}

      {/* Trigger */}
      <div
        style={triggerStyle}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        onFocus={(e) => {
          if (!isDisabled && isOpen) {
            e.currentTarget.style.boxShadow = t.focusRing;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
        tabIndex={isDisabled ? -1 : 0}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={16}
          style={{
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
        {isError && (
          <AlertCircle
            size={16}
            style={{ position: 'absolute', right: 36, color: t.feedbackError }}
          />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !isDisabled && (
        <div style={dropdownStyle}>
          {/* Search */}
          {withSearch && (
            <div style={{ padding: 12, borderBottom: `1px solid ${t.borderDefault}` }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: t.textSecondary,
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 8px 0 28px',
                    fontSize: t.textMd,
                    fontFamily: t.fontFamily,
                    color: t.textPrimary,
                    backgroundColor: t.surfaceSubtle,
                    border: `1px solid ${t.borderDefault}`,
                    borderRadius: t.radiusSm,
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Options */}
          {filteredOptions.length === 0 ? (
            <div
              style={{
                padding: 16,
                textAlign: 'center',
                fontSize: t.textSm,
                color: t.textTertiary,
              }}
            >
              Nenhuma opção encontrada
            </div>
          ) : (
            filteredOptions.map((opt, idx) => (
              <div
                key={idx}
                style={optionStyle}
                onClick={() => handleSelect(opt)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = t.brandPrimaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{opt}</span>
                {value === opt && <Check size={14} color={t.brandPrimary} />}
              </div>
            ))
          )}
        </div>
      )}

      {/* Helper/Error */}
      {(helperText || errorText) && (
        <span style={helperStyle}>{isError && errorText ? errorText : helperText}</span>
      )}
    </div>
  );
}
