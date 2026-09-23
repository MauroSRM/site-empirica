/**
 * DSDrawer — Painel lateral deslizante (right-side)
 *
 * Uso: formulários longos, detalhes, edição inline.
 * Fecha por: Escape, clique no backdrop, botão X no header.
 *
 * Specs:
 * - Largura padrão: 560px
 * - Header: 64px — título + botão X
 * - Conteúdo: scrollável, padding 28px 32px
 * - Footer: slot opcional para ações
 * - Animação: slide-in/out via CSS transform (300ms ease)
 */

import React, { CSSProperties, useEffect, useState } from 'react';
import { useTheme } from '../tokens';
import { X } from 'lucide-react';

export interface DSDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
  /** Substitui o header padrão por conteúdo customizado */
  customHeader?: React.ReactNode;
}

export function DSDrawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = 560,
  customHeader,
}: DSDrawerProps) {
  const { tokens: t } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // dois frames para garantir que o transition dispara após o mount
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const backdropStyle: CSSProperties = {
    position: 'absolute', inset: 0,
    backgroundColor: t.overlayBackdrop,
    backdropFilter: 'blur(2px)',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s ease',
  };

  const panelStyle: CSSProperties = {
    position: 'absolute', top: 0, right: 0, bottom: 0,
    width: '100%', maxWidth: width,
    backgroundColor: t.surfaceDefault,
    boxShadow: t.shadowModal,
    display: 'flex', flexDirection: 'column',
    transform: visible ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
    fontFamily: t.fontFamily,
    overflowY: 'hidden',
  };

  const headerStyle: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px',
    height: 64,
    borderBottom: `1px solid ${t.borderDefault}`,
    flexShrink: 0,
  };

  const closeBtnStyle: CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32,
    background: 'none', border: 'none',
    borderRadius: t.radiusFull, cursor: 'pointer',
    color: t.textSecondary, transition: 'background 0.15s',
  };

  const contentStyle: CSSProperties = {
    flex: 1, overflowY: 'auto',
    padding: '28px 32px',
  };

  const footerStyle: CSSProperties = {
    padding: '16px 32px',
    borderTop: `1px solid ${t.borderDefault}`,
    flexShrink: 0,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
      <div style={backdropStyle} onClick={onClose} />
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header — custom ou padrão */}
        {customHeader ?? (
          <div style={headerStyle}>
            <h2 style={{
              fontFamily: t.fontFamily, fontSize: t.text16,
              fontWeight: 700, color: t.textPrimary, margin: 0,
            }}>
              {title}
            </h2>
            <button
              style={closeBtnStyle}
              onClick={onClose}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = t.surfaceSubtle; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div style={contentStyle}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
