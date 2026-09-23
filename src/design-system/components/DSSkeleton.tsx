/**
 * DSSkeleton — Placeholder de carregamento
 *
 * Exibe placeholders animados enquanto o conteúdo real está carregando.
 *
 * Variantes:
 * - text: Linha de texto (altura 12px, radius radiusSm)
 * - title: Título (altura 20px, radius radiusSm)
 * - avatar: Avatar circular (radiusFull)
 * - card: Card retangular (altura 120px, radius cardRadius)
 * - button: Botão (altura 40px, radius buttonRadius)
 *
 * Animação: Pulse suave de opacidade
 */

import React, { CSSProperties } from 'react';
import { useTheme } from '../tokens';

export interface DSSkeletonProps {
  /** Tipo de skeleton */
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';

  /** Largura (CSS value ou número de px) */
  width?: string | number;

  /** Altura (CSS value ou número de px) */
  height?: string | number;

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSSkeleton({
  variant = 'text',
  width,
  height,
  style,
}: DSSkeletonProps) {
  const { tokens: t } = useTheme();

  // ═══ VARIANT CONFIG (dentro do componente, após useTheme) ═══
  const variantConfig = {
    text: {
      width: width ?? '100%',
      height: height ?? 12,
      borderRadius: t.radiusSm,
    },
    title: {
      width: width ?? '60%',
      height: height ?? 20,
      borderRadius: t.radiusSm,
    },
    avatar: {
      width: width ?? 48,
      height: height ?? 48,
      borderRadius: t.radiusFull,
    },
    card: {
      width: width ?? '100%',
      height: height ?? 120,
      borderRadius: t.cardRadius,
    },
    button: {
      width: width ?? 120,
      height: height ?? 40,
      borderRadius: t.buttonRadius,
    },
  };

  const cfg = variantConfig[variant];

  // ═══ ESTILOS ═══
  const skeletonStyle: CSSProperties = {
    display: 'block',
    width: typeof cfg.width === 'number' ? `${cfg.width}px` : cfg.width,
    height: typeof cfg.height === 'number' ? `${cfg.height}px` : cfg.height,
    backgroundColor: t.surfaceMuted,
    borderRadius: cfg.borderRadius,
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    ...style,
  };

  return (
    <>
      <div style={skeletonStyle} />
      <style>
        {`
          @keyframes skeleton-pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}
      </style>
    </>
  );
}

/**
 * DSSkeletonGroup — Grupo de skeletons
 *
 * Facilita criação de múltiplos skeletons com gap
 */
export interface DSSkeletonGroupProps {
  /** Número de skeletons */
  count?: number;

  /** Tipo de skeleton */
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button';

  /** Gap entre skeletons */
  gap?: number;

  /** Estilos extras do container */
  style?: CSSProperties;
}

export function DSSkeletonGroup({
  count = 3,
  variant = 'text',
  gap = 12,
  style,
}: DSSkeletonGroupProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap,
    ...style,
  };

  return (
    <div style={containerStyle}>
      {Array.from({ length: count }).map((_, idx) => (
        <DSSkeleton key={idx} variant={variant} />
      ))}
    </div>
  );
}
