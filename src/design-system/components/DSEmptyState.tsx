/**
 * DSEmptyState — Estado vazio
 *
 * Exibe mensagem quando não há dados para mostrar.
 *
 * Variantes:
 * - empty: Lista vazia (ícone Inbox)
 * - error: Erro ao carregar (ícone AlertCircle)
 * - search: Busca sem resultados (ícone Search)
 * - offline: Sem conexão (ícone WifiOff)
 *
 * Specs:
 * - Ícone: 48×48px, surfaceMuted bg, textSecondary color
 * - Headline: 15px (textXl), peso 600, textPrimary
 * - Body: 14px (textLg), textSecondary
 */

import React, { CSSProperties, ReactNode } from 'react';
import { useTheme } from '../tokens';
import { Inbox, AlertCircle, Search, WifiOff } from 'lucide-react';
import { DSButton } from './DSButton';

export interface DSEmptyStateProps {
  /** Variante semântica */
  variant?: 'empty' | 'error' | 'search' | 'offline';

  /** Ícone customizado (sobrescreve ícone padrão da variante) */
  icon?: React.ElementType;

  /** Headline */
  headline?: string;

  /** Texto descritivo */
  body?: string;

  /** Exibe botão de ação */
  withAction?: boolean;

  /** Label do botão */
  actionLabel?: string;

  /** Callback do botão */
  onAction?: () => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSEmptyState({
  variant = 'empty',
  icon,
  headline,
  body,
  withAction = false,
  actionLabel,
  onAction,
  style,
}: DSEmptyStateProps) {
  const { tokens: t } = useTheme();

  // ═══ VARIANT CONFIG (dentro do componente, após useTheme) ═══
  const variantConfig = {
    empty: {
      icon: Inbox,
      defaultHeadline: 'Nenhum item encontrado',
      defaultBody: 'Não há itens para exibir no momento.',
      defaultActionLabel: 'Adicionar item',
    },
    error: {
      icon: AlertCircle,
      defaultHeadline: 'Erro ao carregar',
      defaultBody: 'Não foi possível carregar os dados. Tente novamente.',
      defaultActionLabel: 'Tentar novamente',
    },
    search: {
      icon: Search,
      defaultHeadline: 'Nenhum resultado',
      defaultBody: 'Não encontramos resultados para sua busca. Tente outras palavras-chave.',
      defaultActionLabel: 'Limpar busca',
    },
    offline: {
      icon: WifiOff,
      defaultHeadline: 'Sem conexão',
      defaultBody: 'Verifique sua conexão com a internet e tente novamente.',
      defaultActionLabel: 'Verificar conexão',
    },
  };

  const cfg = variantConfig[variant];
  const IconComponent = icon ?? cfg.icon;

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    fontFamily: t.fontFamily,
    textAlign: 'center',
    ...style,
  };

  const iconWrapperStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: t.surfaceMuted,
    borderRadius: t.radiusFull,
    marginBottom: 24,
  };

  const headlineStyle: CSSProperties = {
    fontSize: t.textXl,
    fontWeight: 600,
    color: t.textPrimary,
    marginBottom: 8,
  };

  const bodyStyle: CSSProperties = {
    fontSize: t.textLg,
    fontWeight: 400,
    color: t.textSecondary,
    lineHeight: 1.5,
    maxWidth: 400,
    marginBottom: withAction ? 24 : 0,
  };

  return (
    <div style={containerStyle}>
      {/* Ícone */}
      <div style={iconWrapperStyle}>
        <IconComponent size={40} color={t.textSecondary} strokeWidth={2} />
      </div>

      {/* Headline */}
      <div style={headlineStyle}>{headline ?? cfg.defaultHeadline}</div>

      {/* Body */}
      <div style={bodyStyle}>{body ?? cfg.defaultBody}</div>

      {/* Ação */}
      {withAction && (
        <DSButton variant="primary" onClick={onAction}>
          {actionLabel ?? cfg.defaultActionLabel}
        </DSButton>
      )}
    </div>
  );
}
