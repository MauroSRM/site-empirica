/**
 * DSStepper — Progresso em fluxo sequencial
 *
 * Progresso em fluxo sequencial. Cada etapa tem estado independente.
 *
 * Variantes:
 * - default: Indicador + label + subtitle
 * - no-labels: Somente indicadores; label via tooltip ao hover (TODO: tooltip)
 * - numbered: Número da etapa no indicador
 * - checked: Ícone Check quando concluído
 * - vertical: Indicadores em coluna
 *
 * Estados de cada etapa:
 * - inactive: Borda borderDefault, sem ícone
 * - active: Fundo brandPrimary, ponto branco
 * - completed: Fundo brandPrimary, Check branco
 * - error: Fundo feedbackError, X branco
 * - completed-locked: Fundo surfaceMuted, Lock cinza
 *
 * Sizes: sm (indicador 28px, label 12px), md (indicador 32px, label 12px)
 */

import React, { CSSProperties } from 'react';
import { useTheme } from '../tokens';
import { Check, X, Lock } from 'lucide-react';

export interface Step {
  /** Label da etapa */
  label: string;

  /** Subtítulo (opcional) */
  subtitle?: string;

  /** Estado da etapa */
  state: 'inactive' | 'active' | 'completed' | 'error' | 'completed-locked';
}

export interface DSStepperProps {
  /** Array de etapas */
  steps: Step[];

  /** Layout visual */
  variant?: 'default' | 'no-labels' | 'numbered' | 'checked' | 'vertical';

  /** Tamanho dos indicadores */
  size?: 'sm' | 'md';

  /** Estilos extras */
  style?: CSSProperties;
}

export function DSStepper({
  steps,
  variant = 'default',
  size = 'md',
  style,
}: DSStepperProps) {
  const { tokens: t } = useTheme();

  // ═══ SIZE CONFIG ═══
  const sizeConfig = {
    sm: { indicatorSize: 28, fontSize: 12, lineWidth: 2 },
    md: { indicatorSize: 32, fontSize: 12, lineWidth: 2 },
  };

  const szCfg = sizeConfig[size];

  // ═══ STATE CONFIG (dentro do componente, após useTheme) ═══
  const stateConfig = {
    inactive: {
      bg: t.surfaceDefault,
      border: t.borderDefault,
      color: t.textSecondary,
      showIcon: false,
    },
    active: {
      bg: t.brandPrimary,
      border: t.brandPrimary,
      color: t.textOnBrand,
      showIcon: true,
      icon: 'dot',
    },
    completed: {
      bg: t.brandPrimary,
      border: t.brandPrimary,
      color: t.textOnBrand,
      showIcon: true,
      icon: 'check',
    },
    error: {
      bg: t.feedbackError,
      border: t.feedbackError,
      color: t.textOnBrand,
      showIcon: true,
      icon: 'x',
    },
    'completed-locked': {
      bg: t.surfaceMuted,
      border: t.borderDefault,
      color: t.textSecondary,
      showIcon: true,
      icon: 'lock',
    },
  };

  const isVertical = variant === 'vertical';
  const showLabels = variant !== 'no-labels';
  const useNumbered = variant === 'numbered';
  const useChecked = variant === 'checked';

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    alignItems: isVertical ? 'flex-start' : 'center',
    gap: isVertical ? 24 : 0,
    fontFamily: t.fontFamily,
    ...style,
  };

  const stepWrapperStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'row' : 'column',
    alignItems: isVertical ? 'flex-start' : 'center',
    gap: isVertical ? 16 : 8,
    flex: isVertical ? undefined : 1,
    position: 'relative',
  };

  const indicatorRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    width: isVertical ? undefined : '100%',
  };

  const indicatorStyle = (stepState: Step['state']): CSSProperties => {
    const cfg = stateConfig[stepState];
    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: szCfg.indicatorSize,
      height: szCfg.indicatorSize,
      backgroundColor: cfg.bg,
      border: `2px solid ${cfg.border}`,
      borderRadius: t.radiusFull,
      flexShrink: 0,
    };
  };

  const lineStyle = (isCompleted: boolean): CSSProperties => ({
    flex: 1,
    height: szCfg.lineWidth,
    backgroundColor: isCompleted ? t.brandPrimary : t.borderDefault,
    transition: 'background-color 0.3s ease',
  });

  const labelContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isVertical ? 'flex-start' : 'center',
    gap: 4,
    flex: isVertical ? 1 : undefined,
  };

  const labelStyle: CSSProperties = {
    fontSize: szCfg.fontSize,
    fontWeight: 600,
    color: t.textPrimary,
    textAlign: isVertical ? 'left' : 'center',
  };

  const subtitleStyle: CSSProperties = {
    fontSize: t.textSm,
    fontWeight: 400,
    color: t.textSecondary,
    textAlign: isVertical ? 'left' : 'center',
  };

  // ═══ RENDERIZAÇÃO DE ÍCONE ═══
  const renderIcon = (stepState: Step['state'], stepIndex: number) => {
    const cfg = stateConfig[stepState];

    if (useNumbered && stepState === 'inactive') {
      return (
        <span style={{ fontSize: szCfg.fontSize, fontWeight: 600, color: cfg.color }}>
          {stepIndex + 1}
        </span>
      );
    }

    if (!cfg.showIcon) {
      if (useNumbered) {
        return (
          <span style={{ fontSize: szCfg.fontSize, fontWeight: 600, color: cfg.color }}>
            {stepIndex + 1}
          </span>
        );
      }
      return null;
    }

    const iconSize = szCfg.indicatorSize - 16;

    if (cfg.icon === 'dot') {
      return (
        <div
          style={{
            width: 8,
            height: 8,
            backgroundColor: cfg.color,
            borderRadius: t.radiusFull,
          }}
        />
      );
    }

    if (cfg.icon === 'check' || (useChecked && stepState === 'completed')) {
      return <Check size={iconSize} color={cfg.color} />;
    }

    if (cfg.icon === 'x') {
      return <X size={iconSize} color={cfg.color} />;
    }

    if (cfg.icon === 'lock') {
      return <Lock size={iconSize} color={cfg.color} />;
    }

    return null;
  };

  return (
    <div style={containerStyle}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isCompletedOrActive = step.state === 'completed' || step.state === 'active';

        return (
          <div key={index} style={stepWrapperStyle}>
            {/* Indicador + Linha */}
            <div style={indicatorRowStyle}>
              <div style={indicatorStyle(step.state)}>
                {renderIcon(step.state, index)}
              </div>

              {/* Linha de conexão */}
              {!isLast && !isVertical && (
                <div style={lineStyle(isCompletedOrActive)} />
              )}
            </div>

            {/* Labels */}
            {showLabels && (
              <div style={labelContainerStyle}>
                <div style={labelStyle}>{step.label}</div>
                {step.subtitle && <div style={subtitleStyle}>{step.subtitle}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
