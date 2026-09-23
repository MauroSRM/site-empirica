/**
 * DSAccordion — Acordeão expansível
 *
 * Oculta conteúdo secundário expansível.
 * Comportamento padrão single-open: apenas um item aberto por vez.
 * Use multiOpen para permitir múltiplos itens abertos simultaneamente.
 *
 * Dependências internas: DSButton (no content 'text-with-buttons')
 *
 * Variantes de conteúdo:
 * - text-only: Corpo com parágrafo
 * - text-with-buttons: Lista de botões secondary
 *
 * Specs:
 * - Padding do header: 24px
 * - Padding do body: 16px top, 24px lateral e bottom
 * - Ícone chevron — círculo: 24×24px
 * - Border radius do item: radiusLg
 * - Font-size título: textXl (15px), peso 600
 * - Font-size corpo: textLg (14px)
 *
 * Props por item:
 * - badge: texto secundário ao lado do título (ex: "0 docs", "atualizado hoje")
 * - leftBar: exibe barra vertical na cor brandAccent à esquerda do header
 */

import React, { CSSProperties, useState } from 'react';
import { useTheme } from '../tokens';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { DSButton } from './DSButton';

export interface DSAccordionItem {
  /** Título do item */
  title: string;

  /** Corpo do item (texto simples) */
  body: string;

  /** Tipo de conteúdo */
  content?: 'text-only' | 'text-with-buttons';

  /** Botões (apenas para text-with-buttons) */
  buttons?: Array<{ label: string; onClick: () => void }>;

  /** Conteúdo rich customizado — substitui body quando fornecido */
  customBody?: React.ReactNode;

  /** Substitui o toggle de expansão por uma ação externa (ex: abre drawer) */
  onClickOverride?: () => void;

  /** Texto secundário exibido ao lado do título (ex: "0 docs", "3 arquivos") */
  badge?: string;

  /** Exibe barra vertical na cor brandAccent à esquerda do header */
  leftBar?: boolean;
}

export interface DSAccordionProps {
  /** Array de itens */
  items: DSAccordionItem[];

  /** Índice do item aberto por padrão (null = todos fechados) */
  defaultOpen?: number | null;

  /** Permite múltiplos itens abertos simultaneamente */
  multiOpen?: boolean;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSAccordion({ items, defaultOpen = null, multiOpen = false, style }: DSAccordionProps) {
  const { tokens: t } = useTheme();
  // single-open: tracks one index; multi-open: tracks a Set of indexes
  const [openIndex,  setOpenIndex]  = useState<number | null>(defaultOpen);
  const [openSet,    setOpenSet]    = useState<Set<number>>(() =>
    defaultOpen !== null && defaultOpen !== undefined ? new Set([defaultOpen]) : new Set()
  );

  const isItemOpen = (index: number) =>
    multiOpen ? openSet.has(index) : openIndex === index;

  const handleToggle = (index: number) => {
    if (multiOpen) {
      setOpenSet(prev => {
        const next = new Set(prev);
        next.has(index) ? next.delete(index) : next.add(index);
        return next;
      });
    } else {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    fontFamily: t.fontFamily,
    ...style,
  };

  const itemStyle = (isOpen: boolean): CSSProperties => ({
    backgroundColor: isOpen ? t.surfaceSelected : t.surfaceDefault,
    border: `1px solid ${isOpen ? t.borderSelected : t.borderDefault}`,
    borderRadius: t.radiusLg,
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  });

  const chevronCircleStyle = (isOpen: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    backgroundColor: isOpen ? t.brandPrimaryHover : t.surfaceMuted,
    borderRadius: t.radiusFull,
    flexShrink: 0,
    transition: 'background-color 0.2s ease',
  });

  const bodyStyle: CSSProperties = {
    padding: '16px 24px 24px',
    fontSize: t.textLg,
    fontWeight: 400,
    color: t.textSecondary,
    lineHeight: 1.6,
  };

  return (
    <div style={containerStyle}>
      {items.map((item, index) => {
        const hasOverride = typeof item.onClickOverride === 'function';
        const isOpen = !hasOverride && isItemOpen(index);

        const handleClick = () => {
          if (hasOverride) { item.onClickOverride!(); } else { handleToggle(index); }
        };

        return (
          <div key={index} style={itemStyle(isOpen)}>
            {/* Header */}
            <div
              onClick={handleClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 24,
                cursor: 'pointer',
                gap: 12,
              }}
            >
              {/* Left bar */}
              {item.leftBar && (
                <div style={{
                  width: 3,
                  alignSelf: 'stretch',
                  minHeight: 18,
                  borderRadius: 2,
                  background: t.brandAccent,
                  flexShrink: 0,
                }} />
              )}

              {/* Title + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: t.textXl, fontWeight: 600, color: t.textPrimary }}>
                  {item.title}
                </span>
                {item.badge !== undefined && (
                  <span style={{
                    fontSize: t.textSm,
                    fontWeight: 400,
                    color: t.textTertiary,
                    flexShrink: 0,
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Chevron */}
              <div style={chevronCircleStyle(isOpen)}>
                {hasOverride ? (
                  <ChevronRight size={14} color={t.textSecondary} />
                ) : isOpen ? (
                  <ChevronUp size={14} color={t.textOnBrand} />
                ) : (
                  <ChevronDown size={14} color={t.textSecondary} />
                )}
              </div>
            </div>

            {/* Body */}
            {isOpen && (
              <div style={bodyStyle}>
                {item.customBody ? (
                  item.customBody
                ) : (
                  <>
                    <p style={{ margin: 0, marginBottom: item.content === 'text-with-buttons' ? 16 : 0 }}>
                      {item.body}
                    </p>
                    {item.content === 'text-with-buttons' && item.buttons && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {item.buttons.map((btn, btnIdx) => (
                          <DSButton key={btnIdx} variant="secondary" size="sm" fullWidth onClick={btn.onClick}>
                            {btn.label}
                          </DSButton>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
