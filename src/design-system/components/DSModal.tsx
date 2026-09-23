/**
 * DSModal — Modal de confirmação
 *
 * Interrompe o fluxo para confirmar ação crítica.
 * Possui overlay com blur, focus trap, fechamento por Escape.
 *
 * Variantes:
 * - default: Ícone Info azul, botões Secondary + Primary
 * - warning: Ícone AlertTriangle laranja, botões Ghost + Destructive
 * - destructive: Ícone AlertOctagon vermelho, botões Ghost + Destructive
 *
 * Specs:
 * - Largura: 540px (modalWidth)
 * - Border radius: 24px (radius3xl)
 * - Padding interno: 32px
 * - Ícone — círculo: 80×80px
 * - Título: 24px, peso 600
 */

import React, { CSSProperties, useEffect } from 'react';
import { useTheme } from '../tokens';
import { Info, AlertTriangle, AlertOctagon, X } from 'lucide-react';
import { DSButton } from './DSButton';
import { DSAlertCard } from './DSAlertCard';

export interface DSModalProps {
  /** Controla visibilidade */
  isOpen: boolean;

  /** Fecha o modal (chamado por Escape, backdrop e X) */
  onClose: () => void;

  /** Tom visual */
  variant?: 'default' | 'warning' | 'destructive';

  /** Exibe DSAlertCard warning dentro do modal */
  showCallout?: boolean;

  /** Ação do botão principal */
  onConfirm?: () => void;

  /** Label do botão de ação */
  primaryLabel?: string;

  /** Label do botão secundário */
  ghostLabel?: string;

  /** Título */
  title?: string;

  /** Corpo da mensagem */
  body?: string;

  /** Alinhamento do texto do corpo (padrão: center) */
  bodyAlign?: 'left' | 'center' | 'justify';

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSModal({
  isOpen,
  onClose,
  variant = 'default',
  showCallout = false,
  onConfirm,
  primaryLabel,
  ghostLabel = 'Cancelar',
  title,
  body,
  bodyAlign = 'center',
  style,
}: DSModalProps) {
  const { tokens: t } = useTheme();

  // ═══ VARIANT CONFIG (dentro do componente, após useTheme) ═══
  const variantConfig = {
    default: {
      iconBg: t.brandPrimaryLight,
      iconColor: t.brandPrimary,
      icon: Info,
      defaultTitle: 'Confirmação',
      defaultBody: 'Tem certeza que deseja realizar esta ação?',
      defaultPrimaryLabel: 'Confirmar',
      primaryVariant: 'primary' as const,
      secondaryVariant: 'secondary' as const,
    },
    warning: {
      iconBg: t.brandAccentLight,
      iconColor: t.brandAccentStrong,
      icon: AlertTriangle,
      defaultTitle: 'Atenção',
      defaultBody: 'Esta ação requer confirmação.',
      defaultPrimaryLabel: 'Continuar',
      primaryVariant: 'destructive' as const,
      secondaryVariant: 'ghost' as const,
    },
    destructive: {
      iconBg: t.feedbackErrorBg,
      iconColor: t.feedbackError,
      icon: AlertOctagon,
      defaultTitle: 'Ação destrutiva',
      defaultBody: 'Esta ação não pode ser desfeita. Deseja continuar?',
      defaultPrimaryLabel: 'Sim, excluir',
      primaryVariant: 'destructive' as const,
      secondaryVariant: 'ghost' as const,
    },
  };

  const cfg = variantConfig[variant];
  const IconComponent = cfg.icon;

  // ═══ ESCAPE KEY ═══
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ═══ ESTILOS ═══
  const backdropStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: t.overlayBackdrop,
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: 24,
  };

  const modalStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: t.modalWidth,
    backgroundColor: t.surfaceDefault,
    borderRadius: t.radius3xl,
    boxShadow: t.shadowModal,
    padding: 32,
    fontFamily: t.fontFamily,
    ...style,
  };

  const closeButtonStyle: CSSProperties = {
    position: 'absolute',
    top: 20,
    right: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    background: 'none',
    border: 'none',
    borderRadius: t.radiusFull,
    cursor: 'pointer',
    color: t.textSecondary,
    transition: 'all 0.15s ease',
  };

  const iconCircleStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    backgroundColor: cfg.iconBg,
    borderRadius: t.radiusFull,
    margin: '0 auto 24px',
  };

  const titleStyle: CSSProperties = {
    fontSize: t.text24,
    fontWeight: 600,
    color: t.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  };

  const bodyStyle: CSSProperties = {
    fontSize: t.textLg,
    fontWeight: 400,
    color: t.textSecondary,
    textAlign: bodyAlign,
    lineHeight: 1.6,
    marginBottom: showCallout ? 24 : 32,
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    marginTop: 24,
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Botão Fechar */}
        <button
          style={closeButtonStyle}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = t.surfaceSubtle;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = t.focusRing;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          aria-label="Fechar modal"
        >
          <X size={20} />
        </button>

        {/* Ícone */}
        <div style={iconCircleStyle}>
          <IconComponent size={40} color={cfg.iconColor} strokeWidth={2} />
        </div>

        {/* Título */}
        <h2 style={titleStyle}>{title ?? cfg.defaultTitle}</h2>

        {/* Corpo */}
        <p style={bodyStyle}>{body ?? cfg.defaultBody}</p>

        {/* Callout (DSAlertCard) */}
        {showCallout && (
          <DSAlertCard
            variant="warning"
            title="Importante"
            body="Esta ação requer confirmação adicional."
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Ações */}
        <div style={actionsStyle}>
          <DSButton variant={cfg.secondaryVariant} size="lg" onClick={onClose}>
            {ghostLabel}
          </DSButton>
          <DSButton
            variant={cfg.primaryVariant}
            size="lg"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            {primaryLabel ?? cfg.defaultPrimaryLabel}
          </DSButton>
        </div>
      </div>
    </div>
  );
}
