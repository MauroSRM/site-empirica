/**
 * DSChip — Filtro ou seleção interativa
 *
 * Filtro ou seleção interativa que alterna estado ao clicar.
 * Ao contrário de DSTag, é clicável.
 *
 * Tipos:
 * - filter: Filtro com ícone Filter quando icon={true}
 * - choice: Escolha com ícone Tag quando icon={true}
 * - input: Input com ícone Search à esquerda; X sempre à direita
 *
 * Estados:
 * - unselected: Fundo surfaceDefault, borda borderDefault, texto textSecondary
 * - selected: Fundo brandPrimaryLight, borda brandPrimary, ícone Check
 * - disabled: Fundo surfaceSubtle, cursor not-allowed
 *
 * Sizes: sm (28px), md (32px), lg (36px)
 */

import React, { CSSProperties, useState } from 'react';
import { useTheme } from '../tokens';
import { Check, X, Filter, Tag as TagIcon, Search } from 'lucide-react';

export interface DSChipProps {
  /** Texto do chip */
  label: string;

  /** Comportamento semântico e ícone padrão */
  type?: 'filter' | 'choice' | 'input';

  /** Altura e padding */
  size?: 'sm' | 'md' | 'lg';

  /** Estado visual */
  state?: 'unselected' | 'selected' | 'disabled';

  /** Exibe ícone à esquerda */
  icon?: boolean;

  /** Exibe X quando selecionado */
  removable?: boolean;

  /** Callback ao alternar */
  onChange?: (selected: boolean) => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSChip({
  label,
  type = 'filter',
  size = 'md',
  state: controlledState,
  icon = false,
  removable = false,
  onChange,
  style,
}: DSChipProps) {
  const { tokens: t } = useTheme();

  const [internalState, setInternalState] = useState<'unselected' | 'selected' | 'disabled'>(
    'unselected'
  );

  const state = controlledState ?? internalState;
  const isSelected = state === 'selected';
  const isDisabled = state === 'disabled';

  // ═══ SIZE CONFIG ═══
  const sizeConfig = {
    sm: { height: 28, padding: 12, fontSize: 11 },
    md: { height: 32, padding: 16, fontSize: 13 },
    lg: { height: 36, padding: 20, fontSize: 14 },
  };

  const szCfg = sizeConfig[size];

  // ═══ HANDLE CLICK ═══
  const handleClick = () => {
    if (isDisabled) return;
    const newState = isSelected ? 'unselected' : 'selected';
    setInternalState(newState);
    onChange?.(newState === 'selected');
  };

  // ═══ ESTILOS ═══
  const chipStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: szCfg.height,
    padding: `0 ${szCfg.padding}px`,
    fontSize: szCfg.fontSize,
    fontWeight: 500,
    fontFamily: t.fontFamily,
    backgroundColor: isDisabled
      ? t.surfaceSubtle
      : isSelected
      ? t.brandPrimaryLight
      : t.surfaceDefault,
    color: isDisabled ? t.textDisabled : isSelected ? t.brandPrimary : t.textSecondary,
    border: `1px solid ${isSelected ? t.brandPrimary : t.borderDefault}`,
    borderRadius: t.radiusFull,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    ...style,
  };

  // ═══ ÍCONE POR TIPO ═══
  const renderLeftIcon = () => {
    if (!icon) return null;
    if (type === 'filter') return <Filter size={14} />;
    if (type === 'choice') return <TagIcon size={14} />;
    if (type === 'input') return <Search size={14} />;
    return null;
  };

  const renderRightIcon = () => {
    if (type === 'input' || (removable && isSelected)) {
      return <X size={14} />;
    }
    if (isSelected) {
      return <Check size={14} />;
    }
    return null;
  };

  return (
    <button
      style={chipStyle}
      onClick={handleClick}
      disabled={isDisabled}
      onFocus={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.boxShadow = t.focusRing;
        }
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {renderLeftIcon()}
      <span>{label}</span>
      {renderRightIcon()}
    </button>
  );
}
