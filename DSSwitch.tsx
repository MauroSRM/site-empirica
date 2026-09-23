// PROMPT 5 — Switch
import React, { useState } from 'react'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

interface DSSwitchProps {
  on?: boolean
  size?: 'sm' | 'md'
  disabled?: boolean
  label?: string
  helper?: string
  onChange?: (on: boolean) => void
}

export function DSSwitch({ on = false, size = 'md', disabled = false, label, helper, onChange }: DSSwitchProps) {
  const { tokens: t } = useTheme()
  const [focused, setFocused] = useState(false)
  const isOn = on

  const track = size === 'sm'
    ? { w: 32, h: 18, thumb: 12, thumbOffset: 2 }
    : { w: 44, h: 24, thumb: 18, thumbOffset: 3 }

  const thumbX = isOn
    ? track.w - track.thumb - track.thumbOffset
    : track.thumbOffset

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: t.space2, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}
      onClick={() => !disabled && onChange?.(!isOn)}
    >
      {/* Track */}
      <div
        role="switch"
        aria-checked={isOn}
        tabIndex={disabled ? -1 : 0}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => e.key === ' ' && !disabled && onChange?.(!isOn)}
        style={{
          position: 'relative',
          width: track.w,
          height: track.h,
          borderRadius: t.radiusFull,
          backgroundColor: isOn ? t.brandPrimary : t.borderMedium,
          border: `1.5px solid ${isOn ? t.brandPrimary : t.borderMedium}`,
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          flexShrink: 0,
          boxShadow: focused ? t.focusRing : 'none',
          outline: 'none',
        }}
      >
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: thumbX,
            transform: 'translateY(-50%)',
            width: track.thumb,
            height: track.thumb,
            borderRadius: t.radiusFull,
            backgroundColor: t.surfaceDefault,
            boxShadow: t.shadowThumb,
            transition: 'left 0.2s ease',
          }}
        />
      </div>
      {/* Label */}
      {(label || helper) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {label && <span style={{ fontSize: t.textMd, fontWeight: 600, color: t.textPrimary, fontFamily: t.fontFamily }}>{label}</span>}
          {helper && <span style={{ fontSize: t.textSm, color: t.textSecondary, fontFamily: t.fontFamily }}>{helper}</span>}
        </div>
      )}
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '10px', fontWeight: 600, color: t.textTertiary, textTransform: 'uppercase', minWidth: '120px' }}>{label}</span>
      {children}
    </div>
  )
}

function SwitchDemo({ label, size, disabled }: { label?: string; size?: 'sm' | 'md'; disabled?: boolean }) {
  const [on, setOn] = useState(false)
  return (
    <DSSwitch
      on={on}
      size={size}
      disabled={disabled}
      label={label}
      onChange={setOn}
    />
  )
}

export function DSSwitchSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Toggle binário de preferência com efeito imediato."
      whenToUse={['Ativar/desativar notificações', 'Modo de exibição ou preferência visual', 'Feature sem confirmação extra']}
      whenNotToUse={['Escolha entre 3+ opções (use DSRadio)', 'Ação com efeito colateral importante (use DSModal)', 'Formulário com submit explícito']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Track ligado', token: 't.brandPrimary', descricao: 'Cor do trilho no estado on' },
          { elemento: 'Track desligado', token: 't.borderMedium', descricao: 'Cor do trilho no estado off' },
          { elemento: 'Thumb', token: 't.neutral0', descricao: 'Cor branca do botão circular' },
          { elemento: 'Sombra thumb', token: 't.shadowThumb', descricao: 'Elevação do botão circular' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco para acessibilidade' },
          { elemento: 'Radius', token: 't.radiusFull', descricao: 'Formato pílula do trilho e círculo' },
          { elemento: 'Label', token: 't.textPrimary', descricao: 'Texto do label' },
          { elemento: 'Helper', token: 't.textSecondary', descricao: 'Texto auxiliar' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'on', tipo: 'boolean', default: 'false', descricao: 'Estado atual do switch' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Tamanho do trilho e thumb' },
          { prop: 'disabled', tipo: 'boolean', default: 'false', descricao: 'Desabilita interação' },
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Label ao lado do switch' },
          { prop: 'helper', tipo: 'string', default: '—', descricao: 'Texto auxiliar abaixo do label' },
          { prop: 'onChange', tipo: '(on: boolean) => void', default: '—', descricao: 'Callback ao alternar' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='switch' com aria-checked='true/false' · label obrigatório via label prop ou aria-label"
          keyboard="Tab para focar · Space para alternar estado"
          screenReader="Anuncia 'ligado' ou 'desligado' ao alternar · label deve ser autoexplicativo sem contexto visual"
          contrast="Track on: brandPrimary — verificado · Track off: borderMedium — ratio borderline, usar label sempre"
          focus="focusRing no track — nunca ocultar"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: t.fontFamily }}>
          <Row label="MD — off / on">
            <Labeled component="DSSwitch" props='on={false} size="md"'>
              <SwitchDemo size="md" />
            </Labeled>
            <Labeled component="DSSwitch" props='on={true} size="md"'>
              <DSSwitch on size="md" />
            </Labeled>
          </Row>
          <Row label="SM — off / on">
            <Labeled component="DSSwitch" props='on={false} size="sm"'>
              <SwitchDemo size="sm" />
            </Labeled>
            <Labeled component="DSSwitch" props='on={true} size="sm"'>
              <DSSwitch on size="sm" />
            </Labeled>
          </Row>
          <Row label="Disabled off / on">
            <Labeled component="DSSwitch" props='on={false} size="md" disabled={true}'>
              <DSSwitch disabled size="md" />
            </Labeled>
            <Labeled component="DSSwitch" props='on={true} size="md" disabled={true}'>
              <DSSwitch on disabled size="md" />
            </Labeled>
          </Row>
          <Row label="Com label">
            <Labeled component="DSSwitch" props='on={false} size="md" label="..."'>
              <SwitchDemo size="md" label="Notificações por e-mail" />
            </Labeled>
            <Labeled component="DSSwitch" props='on={true} size="md" label="..."'>
              <DSSwitch on size="md" label="Alertas ativos" />
            </Labeled>
          </Row>
          <Row label="Com helper">
            <Labeled component="DSSwitch" props='on={true} size="md" label="..." helper="..."'>
              <DSSwitch
                on
                size="md"
                label="Reinvestimento automático"
                helper="Aplica rendimentos automaticamente ao fundo"
              />
            </Labeled>
          </Row>
        </div>
      }
    />
  )
}