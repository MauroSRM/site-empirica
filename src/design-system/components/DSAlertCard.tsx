/**
 * DSAlertCard — Aviso persistente em contexto de página
 *
 * Aviso persistente em contexto de página. Permanece visível até ser dispensado ou o usuário navegar.
 *
 * Variantes:
 * - info: feedbackInfoBg / feedbackInfo + ícone Info
 * - success: feedbackSuccessBg / feedbackSuccess + ícone CheckCircle2
 * - warning: feedbackWarningBg / feedbackWarning + ícone AlertTriangle
 * - error: feedbackErrorBg / feedbackError + ícone XCircle
 *
 * Specs:
 * - Padding: 16px
 * - Border radius: radiusLg
 * - Font-size título: 13px, peso 600
 * - Font-size corpo: 13px (textPrimary por decisão W-05)
 */

import React, { CSSProperties, useState } from 'react';
import { useTheme } from '../tokens';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';

export interface DSAlertCardProps {
  /** Cor semântica */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';

  /** Estilo outline — fundo transparente com borda colorida */
  outline?: boolean;

  /** Título */
  title?: string;

  /** Texto descritivo */
  body?: string;

  /** Exibe botão X */
  dismissible?: boolean;

  /** Exibe link de ação */
  withAction?: boolean;

  /** Texto do link */
  actionLabel?: string;

  /** Callback do link */
  onAction?: () => void;

  /** Callback ao dispensar */
  onDismiss?: () => void;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSAlertCard({
  variant = 'info',
  outline = false,
  title,
  body,
  dismissible = false,
  withAction = false,
  actionLabel,
  onAction,
  onDismiss,
  style,
}: DSAlertCardProps) {
  const { tokens: t } = useTheme();
  const [isDismissed, setIsDismissed] = useState(false);

  // ═══ VARIANT CONFIG (dentro do componente, após useTheme) ═══
  const variantConfig = {
    info: {
      bg: t.feedbackInfoBg,
      color: t.feedbackInfo,
      icon: Info,
      defaultTitle: 'Informação',
      defaultBody: 'Esta é uma mensagem informativa.',
    },
    success: {
      bg: t.feedbackSuccessBg,
      color: t.feedbackSuccess,
      icon: CheckCircle2,
      defaultTitle: 'Sucesso',
      defaultBody: 'Operação concluída com sucesso.',
    },
    warning: {
      bg: t.feedbackWarningBg,
      color: t.feedbackWarning,
      icon: AlertTriangle,
      defaultTitle: 'Atenção',
      defaultBody: 'Esta ação requer sua atenção.',
    },
    error: {
      bg: t.feedbackErrorBg,
      color: t.feedbackError,
      icon: XCircle,
      defaultTitle: 'Erro',
      defaultBody: 'Ocorreu um erro ao processar sua solicitação.',
    },
    neutral: {
      bg: t.surfaceMuted,
      color: t.textSecondary,
      icon: Info,
      defaultTitle: 'Aviso',
      defaultBody: '',
    },
  };

  const cfg = variantConfig[variant];
  const IconComponent = cfg.icon;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    gap: 12,
    padding: 16,
    backgroundColor: outline ? t.surfaceSubtle : cfg.bg,
    border: outline ? `1px solid ${cfg.color}` : 'none',
    borderRadius: t.radiusLg,
    fontFamily: t.fontFamily,
    ...style,
  };

  const iconWrapperStyle: CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'flex-start',
    paddingTop: 2,
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  };

  const titleStyle: CSSProperties = {
    fontSize: t.textMd,
    fontWeight: 600,
    color: cfg.color,
  };

  const bodyStyle: CSSProperties = {
    fontSize: t.textMd,
    fontWeight: 400,
    color: t.textPrimary, // W-05: sempre textPrimary
    lineHeight: 1.5,
  };

  const actionLinkStyle: CSSProperties = {
    fontSize: t.textMd,
    fontWeight: 600,
    color: cfg.color,
    textDecoration: 'underline',
    cursor: 'pointer',
    marginTop: 8,
  };

  const dismissButtonStyle: CSSProperties = {
    position: 'absolute',
    top: 12,
    right: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: cfg.color,
  };

  return (
    <div style={containerStyle} role="alert">
      {/* Ícone */}
      <div style={iconWrapperStyle}>
        <IconComponent size={20} color={cfg.color} />
      </div>

      {/* Conteúdo */}
      <div style={contentStyle}>
        <div style={titleStyle}>{title ?? cfg.defaultTitle}</div>
        <div style={bodyStyle}>{body ?? cfg.defaultBody}</div>
        {withAction && actionLabel && (
          <div style={actionLinkStyle} onClick={onAction}>
            {actionLabel}
          </div>
        )}
      </div>

      {/* Botão Dismiss */}
      {dismissible && (
        <button
          style={dismissButtonStyle}
          onClick={handleDismiss}
          aria-label="Fechar alerta"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
