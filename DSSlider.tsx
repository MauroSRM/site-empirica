// PROMPT 6 — Slider
import React, { useState, useRef } from 'react'
import { hexToRgba } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

interface DSSliderProps {
  type?: 'single' | 'range'
  size?: 'sm' | 'md'
  min?: number
  max?: number
  value?: number
  valueEnd?: number
  showValue?: boolean
  showTicks?: boolean
  disabled?: boolean
  onChange?: (val: number, valEnd?: number) => void
}

export function DSSlider({
  type = 'single',
  size = 'md',
  min = 0,
  max = 100,
  value = 30,
  valueEnd = 70,
  showValue = true,
  showTicks = false,
  disabled = false,
  onChange,
}: DSSliderProps) {
  const { tokens: t } = useTheme()
  const trackH = size === 'sm' ? 4 : 6
  const thumbS = size === 'sm' ? 16 : 20
  const [focused1, setFocused1] = useState(false)
  const [focused2, setFocused2] = useState(false)

  const pct = (v: number) => ((v - min) / (max - min)) * 100

  const commonInput: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    top: 0,
    height: '100%',
    opacity: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    margin: 0,
  }

  const focusRing = t.focusRing

  return (
    <div style={{ width: '100%', userSelect: 'none', opacity: disabled ? 0.5 : 1, fontFamily: t.fontFamily }}>
      <div style={{ position: 'relative', height: thumbS + 16, display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            height: trackH,
            borderRadius: t.radiusFull,
            backgroundColor: disabled ? t.surfaceMuted : t.borderDefault,
          }}
        >
          {/* Active fill */}
          <div
            style={{
              position: 'absolute',
              left: type === 'range' ? `${pct(value)}%` : '0%',
              width: type === 'range' ? `${pct(valueEnd) - pct(value)}%` : `${pct(value)}%`,
              height: '100%',
              borderRadius: t.radiusFull,
              backgroundColor: disabled ? t.borderMedium : t.brandPrimary,
              transition: 'left 0.1s, width 0.1s',
            }}
          />
        </div>

        {/* Ticks */}
        {showTicks && (
          <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'space-between', top: trackH + 8 }}>
            {[0, 25, 50, 75, 100].map(tick => (
              <div key={tick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 2, height: 6, backgroundColor: t.borderDefault }} />
                <span style={{ fontSize: '9px', color: t.textTertiary }}>{Math.round(min + (max - min) * tick / 100)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Thumb 1 */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct(value)}% - ${thumbS / 2}px)`,
            width: thumbS, height: thumbS,
            borderRadius: t.radiusFull,
            backgroundColor: t.surfaceDefault,
            border: `2px solid ${disabled ? t.borderMedium : t.brandPrimary}`,
            boxShadow: focused1 && !disabled ? focusRing : `0 1px 4px ${hexToRgba(t.brandPrimary, 0.3)}`,
            zIndex: 2,
            transition: 'left 0.1s',
            pointerEvents: 'none',
          }}
        />

        {/* Value label 1 */}
        {showValue && (
          <div
            style={{
              position: 'absolute',
              left: `calc(${pct(value)}% - 18px)`,
              bottom: thumbS + 4,
              backgroundColor: t.brandPrimary,
              color: t.textOnBrand,
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: t.radiusSm,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              transition: 'left 0.1s',
            }}
          >
            {value}
          </div>
        )}

        {type === 'range' && (
          <>
            {/* Thumb 2 */}
            <div
              style={{
                position: 'absolute',
                left: `calc(${pct(valueEnd)}% - ${thumbS / 2}px)`,
                width: thumbS, height: thumbS,
                borderRadius: t.radiusFull,
                backgroundColor: t.surfaceDefault,
                border: `2px solid ${t.brandPrimary}`,
                boxShadow: focused2 && !disabled ? focusRing : `0 1px 4px ${hexToRgba(t.brandPrimary, 0.3)}`,
                zIndex: 2,
                transition: 'left 0.1s',
                pointerEvents: 'none',
              }}
            />
            {showValue && (
              <div
                style={{
                  position: 'absolute',
                  left: `calc(${pct(valueEnd)}% - 18px)`,
                  bottom: thumbS + 4,
                  backgroundColor: t.brandPrimary,
                  color: t.textOnBrand,
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: t.radiusSm,
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'left 0.1s',
                }}
              >
                {valueEnd}
              </div>
            )}
          </>
        )}

        {/* Native range input(s) */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={e => onChange?.(Number(e.target.value), valueEnd)}
          onFocus={() => setFocused1(true)}
          onBlur={() => setFocused1(false)}
          style={commonInput}
        />
        {type === 'range' && (
          <input
            type="range"
            min={min}
            max={max}
            value={valueEnd}
            disabled={disabled}
            onChange={e => onChange?.(value, Number(e.target.value))}
            onFocus={() => setFocused2(true)}
            onBlur={() => setFocused2(false)}
            style={commonInput}
          />
        )}
      </div>
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

function SliderDemo(props: Partial<DSSliderProps>) {
  const [v, setV] = useState(props.value ?? 30)
  const [ve, setVe] = useState(props.valueEnd ?? 70)
  return (
    <DSSlider
      {...props}
      value={v}
      valueEnd={ve}
      onChange={(val, valE) => { setV(val); if (valE !== undefined) setVe(valE) }}
    />
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '10px', fontWeight: 600, color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <div style={{ maxWidth: '360px' }}>{children}</div>
    </div>
  )
}

export function DSSliderSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Seleção de valor dentro de um intervalo contínuo."
      whenToUse={['Filtro de faixa de valor ou prazo', 'Configuração de percentual ou volume', 'Range de datas com visualização']}
      whenNotToUse={['Valor exato obrigatório (use DSInput)', 'Mais de 2 thumbs simultâneos', 'Mobile sem área de toque adequada (mín. 44px)']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Track ativo', token: 't.brandPrimary', descricao: 'Faixa preenchida do slider' },
          { elemento: 'Track inativo', token: 't.borderDefault', descricao: 'Faixa não preenchida' },
          { elemento: 'Track disabled', token: 't.surfaceMuted', descricao: 'Faixa no estado disabled' },
          { elemento: 'Thumb', token: 't.neutral0', descricao: 'Botão circular de arraste' },
          { elemento: 'Thumb sombra', token: 'hexToRgba(t.brandPrimary, 0.3)', descricao: 'Sombra colorida do thumb' },
          { elemento: 'Tick', token: 't.borderDefault', descricao: 'Marcação de step' },
          { elemento: 'Valor', token: 't.brandPrimary', descricao: 'Texto do valor atual' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
          { elemento: 'Radius', token: 't.radiusFull', descricao: 'Track e thumb arredondados' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'type', tipo: "'single' | 'range'", default: "'single'", descricao: 'Um thumb ou dois (range)' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Espessura do track e thumb' },
          { prop: 'min', tipo: 'number', default: '0', descricao: 'Valor mínimo do range' },
          { prop: 'max', tipo: 'number', default: '100', descricao: 'Valor máximo do range' },
          { prop: 'value', tipo: 'number', default: '30', descricao: 'Valor inicial do thumb principal' },
          { prop: 'valueEnd', tipo: 'number', default: '70', descricao: 'Valor inicial do thumb final (range)' },
          { prop: 'showValue', tipo: 'boolean', default: 'true', descricao: 'Exibe valor numérico acima do thumb' },
          { prop: 'showTicks', tipo: 'boolean', default: 'false', descricao: 'Exibe marcações de step' },
          { prop: 'disabled', tipo: 'boolean', default: 'false', descricao: 'Desabilita interação' },
          { prop: 'onChange', tipo: '(val: number, valEnd?: number) => void', default: '—', descricao: 'Callback ao mover o thumb' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='slider' nativo via <input type='range'> · aria-valuemin · aria-valuemax · aria-valuenow"
          keyboard="Tab para focar o thumb · Arrow keys para incrementar/decrementar valor"
          screenReader="Anuncia valor atual ao mover · label obrigatório via <label> associado"
          contrast="Track ativo: brandPrimary — verificado · Thumb: neutral0 com sombra — verificado"
          focus="focusRing no thumb · não suprimir outline do input nativo"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: t.fontFamily }}>
          <Row label="Single — MD com valor">
            <Labeled component="DSSlider" props='type="single" size="md" showValue'>
              <SliderDemo size="md" showValue />
            </Labeled>
          </Row>
          <Row label="Single — SM">
            <Labeled component="DSSlider" props='type="single" size="sm" showValue'>
              <SliderDemo size="sm" showValue value={55} />
            </Labeled>
          </Row>
          <Row label="Single com ticks">
            <Labeled component="DSSlider" props='type="single" showTicks showValue'>
              <SliderDemo showTicks showValue value={40} />
            </Labeled>
          </Row>
          <Row label="Range — MD">
            <Labeled component="DSSlider" props='type="range" size="md" showValue'>
              <SliderDemo type="range" value={20} valueEnd={80} showValue />
            </Labeled>
          </Row>
          <Row label="Disabled">
            <Labeled component="DSSlider" props='type="single" disabled'>
              <SliderDemo disabled value={45} />
            </Labeled>
          </Row>
        </div>
      }
    />
  )
}