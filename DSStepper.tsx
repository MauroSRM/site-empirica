import React, { useState } from 'react'
import { Check, X, Lock } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { DSButton } from './DSButton'
import { DSTooltip } from './TabsTooltip'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type StepState = 'inactive' | 'active' | 'completed' | 'error' | 'completed-locked'
export type StepperVariant = 'default' | 'no-labels' | 'numbered' | 'checked' | 'vertical'

export interface Step {
  label: string
  subtitle?: string
  state: StepState
}

interface DSStepperProps {
  variant?: StepperVariant
  steps: Step[]
  size?: 'sm' | 'md'
}

// ─── Indicator sizes ───────────────────────────────────────────

const indicatorSize = { sm: '28px', md: '32px' }
const iconSize      = { sm: 12, md: 14 }

// ─── Indicator style (recebe tokens como parâmetro) ───────────

function getIndicatorStyle(step: Step, size: 'sm' | 'md', tk: typeof t): React.CSSProperties {
  const sz = indicatorSize[size]
  const base: React.CSSProperties = {
    width: sz, height: sz,
    borderRadius: tk.radiusFull,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  }
  switch (step.state) {
    case 'active':
      return { ...base, backgroundColor: tk.brandPrimary, border: `2px solid ${tk.brandPrimary}` }
    case 'completed':
      return { ...base, backgroundColor: tk.brandPrimary, border: `2px solid ${tk.brandPrimary}` }
    case 'error':
      return { ...base, backgroundColor: tk.feedbackError, border: `2px solid ${tk.feedbackError}` }
    case 'completed-locked':
      return { ...base, backgroundColor: tk.surfaceMuted, border: `2px solid ${tk.borderDefault}` }
    default:
      return { ...base, backgroundColor: tk.surfaceDefault, border: `2px solid ${tk.borderDefault}` }
  }
}

// ─── Indicator content (recebe tokens como parâmetro) ─────────

function IndicatorContent({ step, index, variant, size, tk }: {
  step: Step; index: number; variant: StepperVariant; size: 'sm' | 'md'; tk: typeof t
}) {
  const ic = iconSize[size]

  if (step.state === 'completed-locked') {
    return <Lock size={ic} color={tk.textTertiary} />
  }
  if (step.state === 'error') {
    return <X size={ic} color={tk.textOnBrand} strokeWidth={2.5} />
  }
  if (step.state === 'completed') {
    if (variant === 'numbered') {
      return <span style={{ fontSize: '13px', fontWeight: 600, color: tk.textOnBrand }}>{index + 1}</span>
    }
    return <Check size={ic} color={tk.textOnBrand} strokeWidth={2.5} />
  }
  if (variant === 'numbered') {
    return (
      <span style={{ fontSize: '13px', fontWeight: 600, color: step.state === 'active' ? tk.textOnBrand : tk.textTertiary }}>
        {index + 1}
      </span>
    )
  }
  if (step.state === 'active') {
    return <div style={{ width: '10px', height: '10px', borderRadius: tk.radiusFull, backgroundColor: tk.textOnBrand }} />
  }
  return null
}

// ─── Connector active state ───────────────────────────────────

function isConnectorActive(step: Step) {
  return step.state === 'completed' || step.state === 'completed-locked'
}

// ─── Horizontal Stepper ───────────────────────────────────────

function HorizontalStepper({ steps, variant, size }: { steps: Step[]; variant: StepperVariant; size: 'sm' | 'md' }) {
  const { tokens: tk } = useTheme()
  const isNoLabels = variant === 'no-labels'

  return (
    <div role="list" style={{ display: 'flex', alignItems: 'flex-start', fontFamily: tk.fontFamily, width: '100%' }}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {/* Step item */}
          <div
            role="listitem"
            aria-current={step.state === 'active' ? 'step' : undefined}
            aria-label={`Etapa ${i + 1}: ${step.label}${step.subtitle ? ` — ${step.subtitle}` : ''} (${step.state === 'active' ? 'atual' : step.state === 'completed' ? 'concluída' : step.state === 'error' ? 'erro' : 'inativa'})`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '60px', position: 'relative' }}
          >
            {isNoLabels ? (
              <DSTooltip
                variant="dark"
                position="top"
                content={step.subtitle ? `${step.label} — ${step.subtitle}` : step.label}
              >
                <div style={getIndicatorStyle(step, size, tk)}>
                  <IndicatorContent step={step} index={i} variant={variant} size={size} tk={tk} />
                </div>
              </DSTooltip>
            ) : (
              <div style={getIndicatorStyle(step, size, tk)}>
                <IndicatorContent step={step} index={i} variant={variant} size={size} tk={tk} />
              </div>
            )}

            {/* Labels */}
            {!isNoLabels && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: step.state === 'completed-locked' ? 400 : 600,
                  color: step.state === 'active'
                    ? tk.textPrimary
                    : step.state === 'completed-locked'
                    ? tk.textTertiary
                    : tk.textSecondary,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}>
                  {step.label}
                </span>
                {step.subtitle && (
                  <span style={{ fontSize: '11px', color: tk.textTertiary, textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {step.subtitle}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Connector */}
          {i < steps.length - 1 && (
            <div style={{
              flex: 1,
              height: '2px',
              backgroundColor: isConnectorActive(step) ? tk.brandPrimary : tk.borderDefault,
              alignSelf: 'flex-start',
              marginTop: `calc(${indicatorSize[size]} / 2 - 1px)`,
              transition: 'background-color 0.2s ease',
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Vertical Stepper ─────────────────────────────────────────

function VerticalStepper({ steps, size }: { steps: Step[]; size: 'sm' | 'md' }) {
  const { tokens: tk } = useTheme()
  const gap = size === 'md' ? 24 : 16
  const indicatorW = parseInt(indicatorSize[size])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: tk.fontFamily }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            {/* Left: indicator + connector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${indicatorW}px`, flexShrink: 0 }}>
              <div style={getIndicatorStyle(step, size, tk)}>
                <IndicatorContent step={step} index={i} variant="default" size={size} tk={tk} />
              </div>
              {!isLast && (
                <div style={{
                  width: '2px',
                  flex: 1,
                  minHeight: `${gap}px`,
                  backgroundColor: isConnectorActive(step) ? tk.brandPrimary : tk.borderDefault,
                  transition: 'background-color 0.2s ease',
                }} />
              )}
            </div>

            {/* Right: labels */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '2px',
              paddingTop: '6px',
              paddingBottom: isLast ? 0 : `${gap}px`,
            }}>
              <span style={{
                fontSize: '13px',
                fontWeight: step.state === 'completed-locked' ? 400 : step.state === 'active' ? 600 : 500,
                color: step.state === 'active'
                  ? tk.textPrimary
                  : step.state === 'completed-locked'
                  ? tk.textTertiary
                  : tk.textSecondary,
              }}>
                {step.label}
              </span>
              {step.subtitle && (
                <span style={{ fontSize: '12px', color: tk.textTertiary }}>
                  {step.subtitle}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────

export function DSStepper({ variant = 'default', steps, size = 'md' }: DSStepperProps) {
  if (variant === 'vertical') {
    return <VerticalStepper steps={steps} size={size} />
  }
  return <HorizontalStepper steps={steps} variant={variant} size={size} />
}

// ─── Section Showcase ──────────────────────────────────────────

const makeSteps = (activeIndex: number, errorIndex?: number): Step[] => [
  {
    label: 'Dados pessoais',
    subtitle: 'CPF e nome',
    state: activeIndex > 0 ? 'completed' : activeIndex === 0 ? 'active' : 'inactive',
  },
  {
    label: 'Endereço',
    subtitle: 'CEP e cidade',
    state: errorIndex === 1
      ? 'error'
      : activeIndex > 1
      ? 'completed'
      : activeIndex === 1
      ? 'active'
      : 'inactive',
  },
  {
    label: 'Documentos',
    subtitle: 'RG ou CNH',
    state: activeIndex > 2 ? 'completed' : activeIndex === 2 ? 'active' : 'inactive',
  },
  {
    label: 'Confirmação',
    subtitle: 'Revisão',
    state: activeIndex > 3 ? 'completed' : activeIndex === 3 ? 'active' : 'inactive',
  },
]

const lockedSequence: Step[] = [
  { label: 'Dados pessoais', subtitle: 'CPF e nome',      state: 'completed' },
  { label: 'Endereço',       subtitle: 'CEP e cidade',    state: 'completed-locked' },
  { label: 'Documentos',     subtitle: 'RG ou CNH',       state: 'active' },
  { label: 'Confirmação',    subtitle: 'Revisão',         state: 'inactive' },
  { label: 'Finalizado',     subtitle: 'Concluído',       state: 'inactive' },
]

export function DSStepperSection() {
  const [activeStep, setActiveStep] = useState(1)

  return (
    <DSDocSection
      description="Representa progresso em fluxo sequencial com etapas obrigatórias."
      whenToUse={['Onboarding', 'Cadastro multi-passo', 'Fluxo de aprovação com etapas definidas']}
      whenNotToUse={['Navegação não-linear (use DSTabs)', 'Conteúdo paralelo sem sequência', 'Mais de 6 etapas em tela']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Indicador active/completed', token: 't.brandPrimary', descricao: 'Fundo do indicador ativo ou concluído' },
          { elemento: 'Indicador error', token: 't.feedbackError', descricao: 'Fundo do indicador com erro' },
          { elemento: 'Indicador inactive', token: 't.surfaceDefault', descricao: 'Fundo do indicador inativo' },
          { elemento: 'Indicador locked', token: 't.surfaceMuted', descricao: 'Fundo do indicador bloqueado' },
          { elemento: 'Conector inactive', token: 't.borderDefault', descricao: 'Linha entre etapas inativas' },
          { elemento: 'Conector completed', token: 't.brandPrimary', descricao: 'Linha entre etapas concluídas' },
          { elemento: 'Texto label', token: 't.textPrimary', descricao: 'Label da etapa ativa' },
          { elemento: 'Texto inactive', token: 't.textTertiary', descricao: 'Label de etapas inativas' },
          { elemento: 'Radius indicador', token: 't.radiusFull', descricao: 'Formato circular' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'steps', tipo: 'Step[]', default: '—', descricao: 'Array de etapas: { label, subtitle?, state } (obrigatório)' },
          { prop: 'variant', tipo: "'default' | 'no-labels' | 'numbered' | 'checked' | 'vertical'", default: "'default'", descricao: 'Layout visual do stepper' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Tamanho dos indicadores' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='list' no stepper · role='listitem' em cada etapa · aria-current='step' na etapa ativa"
          keyboard="Stepper é apresentacional — navegação ocorre pelos botões CTA do formulário, não pelas etapas"
          screenReader="Estado de cada etapa lido: 'ativo', 'concluído', 'erro' · Etapa ativa com aria-current='step'"
          contrast="Indicadores sobre surfaceDefault — contraste verificado · Conectores sobre surfaceCanvas"
          focus="Etapas não são focáveis; CTAs do fluxo recebem foco"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Interactive */}
          <div>
            <SectionLabel>Interativo — variant numbered</SectionLabel>
            <div style={{ maxWidth: '500px', marginBottom: '16px' }}>
              <Labeled component="DSStepper" props='variant="numbered"'>
                <DSStepper variant="numbered" steps={makeSteps(activeStep)} />
              </Labeled>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <DSButton variant="secondary" size="sm" onClick={() => setActiveStep(Math.max(0, activeStep - 1))}>Anterior</DSButton>
              <DSButton variant="primary" size="sm" onClick={() => setActiveStep(Math.min(3, activeStep + 1))}>Próximo</DSButton>
            </div>
          </div>

          {/* All horizontal variants */}
          {(['default', 'numbered', 'checked'] as StepperVariant[]).map(variant => (
            <div key={variant}>
              <SectionLabel>Variant: {variant}</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
                <Labeled component="DSStepper" props={`variant="${variant}" size="md"`}>
                  <DSStepper variant={variant} steps={makeSteps(0)} />
                </Labeled>
                <Labeled component="DSStepper" props={`variant="${variant}" size="md"`}>
                  <DSStepper variant={variant} steps={makeSteps(2)} />
                </Labeled>
                <Labeled component="DSStepper" props={`variant="${variant}" size="md"`}>
                  <DSStepper variant={variant} steps={makeSteps(2, 1)} />
                </Labeled>
              </div>
            </div>
          ))}

          {/* No-labels */}
          <div>
            <SectionLabel>Variant: no-labels (hover para ver tooltip)</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '320px' }}>
              <Labeled component="DSStepper" props='variant="no-labels" size="md"'>
                <DSStepper variant="no-labels" steps={makeSteps(1)} />
              </Labeled>
              <Labeled component="DSStepper" props='variant="no-labels" size="md"'>
                <DSStepper variant="no-labels" steps={makeSteps(2)} />
              </Labeled>
            </div>
          </div>

          {/* Vertical */}
          <div>
            <SectionLabel>Variant: vertical</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 600, color: t.textTertiary, textTransform: 'uppercase', margin: '0 0 16px', letterSpacing: '0.5px' }}>MD</p>
                <Labeled component="DSStepper" props='variant="vertical" size="md"'>
                  <DSStepper variant="vertical" steps={makeSteps(2)} size="md" />
                </Labeled>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 600, color: t.textTertiary, textTransform: 'uppercase', margin: '0 0 16px', letterSpacing: '0.5px' }}>SM</p>
                <Labeled component="DSStepper" props='variant="vertical" size="sm"'>
                  <DSStepper variant="vertical" steps={makeSteps(1)} size="sm" />
                </Labeled>
              </div>
            </div>
          </div>

          {/* completed-locked */}
          <div>
            <SectionLabel>Estado completed-locked — passo concluído em outro contexto</SectionLabel>
            <div style={{ maxWidth: '520px' }}>
              <Labeled component="DSStepper" props='variant="default" size="md"'>
                <DSStepper variant="default" steps={lockedSequence} />
              </Labeled>
            </div>
            <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: t.surfaceSubtle, borderRadius: t.cardRadius, border: `1px solid ${t.borderDefault}` }}>
              <p style={{ fontSize: '12px', color: t.textSecondary, fontFamily: t.fontFamily, margin: 0 }}>
                step1 = completed / step2 = completed-locked / step3 = active / step4-5 = inactive
              </p>
            </div>
          </div>
        </div>
      }
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}