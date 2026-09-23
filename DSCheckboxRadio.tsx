import React, { useState } from 'react'
import { Check, Minus, AlertCircle } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

// ─── Checkbox ─────────────────────────────────────────────────

type CheckboxState = 'unchecked' | 'checked' | 'indeterminate' | 'disabled' | 'read-only'
type CheckboxSize  = 'sm' | 'md'

interface DSCheckboxProps {
  state?: CheckboxState
  size?: CheckboxSize
  label?: string
  error?: boolean
  onChange?: (checked: boolean) => void
  'aria-label'?: string
}

export function DSCheckbox({
  state = 'unchecked',
  size = 'md',
  label,
  error = false,
  onChange,
  'aria-label': ariaLabel,
}: DSCheckboxProps) {
  const { tokens: t } = useTheme()
  const [internal, setInternal] = useState<CheckboxState>(state)
  const [focused, setFocused]   = useState(false)

  const boxSize  = size === 'sm' ? '16px' : '20px'
  const iconSize = size === 'sm' ? 10 : 13

  const isDisabled  = internal === 'disabled'
  const isReadOnly  = internal === 'read-only'
  const isChecked   = internal === 'checked'
  const isIndeterminate = internal === 'indeterminate'
  const filled      = isChecked || isIndeterminate

  const handleClick = () => {
    if (isDisabled || isReadOnly) return
    const next = isChecked ? 'unchecked' : 'checked'
    setInternal(next)
    onChange?.(next === 'checked')
  }

  const getBorder = () => {
    if (isReadOnly) return `1.5px solid ${t.borderDefault}`
    if (isDisabled) return `2px solid ${t.borderDefault}`
    if (error)      return `2px solid ${t.borderError}`
    if (filled)     return `2px solid ${t.brandPrimary}`
    return `2px solid ${t.borderMedium}`
  }

  const getBg = () => {
    if (isReadOnly) return t.surfaceSubtle
    if (isDisabled) return t.surfaceMuted
    if (filled)     return t.brandPrimary
    return t.surfaceDefault
  }

  const getIconColor = () => {
    if (isReadOnly) return t.borderMedium
    return t.textOnBrand
  }

  return (
    <div
      role="checkbox"
      aria-checked={isIndeterminate ? 'mixed' : isChecked}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      tabIndex={isDisabled || isReadOnly ? -1 : 0}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space2,
        cursor: isDisabled ? 'not-allowed' : isReadOnly ? 'default' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        userSelect: 'none',
        fontFamily: t.fontFamily,
        pointerEvents: isReadOnly ? 'none' : undefined,
        outline: 'none',
      }}
      onClick={handleClick}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleClick() } }}
    >
      <div
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: t.radiusSm,
          border: getBorder(),
          backgroundColor: getBg(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.1s ease',
          boxShadow: focused && !isDisabled ? t.focusRing : 'none',
        }}
      >
        {isChecked      && <Check size={iconSize} color={getIconColor()} strokeWidth={2.5} />}
        {isIndeterminate && <Minus size={iconSize} color={getIconColor()} strokeWidth={2.5} />}
      </div>

      {label && (
        <span style={{ fontSize: t.textMd, color: isDisabled ? t.textDisabled : isReadOnly ? t.textSecondary : t.textPrimary, lineHeight: 1.5 }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Radio ────────────────────────────────────────────────────

type RadioState = 'unselected' | 'selected' | 'disabled' | 'read-only'

interface DSRadioProps {
  state?: RadioState
  size?: CheckboxSize
  label?: string
  checked?: boolean
  onChange?: () => void
}

export function DSRadio({ state = 'unselected', size = 'md', label, checked, onChange }: DSRadioProps) {
  const { tokens: t } = useTheme()
  const [internal, setInternal] = useState(state === 'selected')
  const [focused, setFocused]   = useState(false)

  const circleSize = size === 'sm' ? '16px' : '20px'
  const dotSize    = size === 'sm' ? '8px'  : '10px'
  const isDisabled = state === 'disabled'
  const isReadOnly = state === 'read-only'
  const isSelected = checked !== undefined ? checked : internal

  const handleClick = () => {
    if (isDisabled || isReadOnly) return
    setInternal(true)
    onChange?.()
  }

  const getDotColor = () => {
    if (isReadOnly) return t.borderMedium
    return t.brandPrimary
  }

  const getBorder = () => {
    if (isReadOnly) return `1.5px solid ${t.borderDefault}`
    return `2px solid ${isSelected ? t.brandPrimary : t.borderMedium}`
  }

  return (
    <div
      tabIndex={isDisabled || isReadOnly ? -1 : 0}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space2,
        cursor: isDisabled ? 'not-allowed' : isReadOnly ? 'default' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        userSelect: 'none',
        fontFamily: t.fontFamily,
        pointerEvents: isReadOnly ? 'none' : undefined,
        outline: 'none',
      }}
      onClick={handleClick}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleClick() } }}
    >
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: t.radiusFull,
          border: getBorder(),
          backgroundColor: t.surfaceDefault,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.1s ease',
          boxShadow: focused && !isDisabled ? t.focusRing : 'none',
        }}
      >
        {isSelected && (
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: t.radiusFull,
              backgroundColor: getDotColor(),
            }}
          />
        )}
      </div>

      {label && (
        <span style={{ fontSize: t.textMd, color: isDisabled ? t.textDisabled : isReadOnly ? t.textSecondary : t.textPrimary, lineHeight: 1.5 }}>
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Checkbox Group ───────────────────────────────────────────

interface DSCheckboxGroupProps {
  title?: string
  helperText?: string
  error?: string
  items: { label: string; defaultChecked?: boolean }[]
}

export function DSCheckboxGroup({ title, helperText, error, items }: DSCheckboxGroupProps) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space3, fontFamily: t.fontFamily }}>
      {title && <p style={{ fontSize: t.text2Xs, fontWeight: 600, color: t.textPrimary, margin: 0 }}>{title}</p>}
      {items.map((item, i) => (
        <DSCheckbox key={i} label={item.label} state={item.defaultChecked ? 'checked' : 'unchecked'} error={!!error} />
      ))}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: t.feedbackError }}>
          <AlertCircle size={12} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}
      {!error && helperText && (
        <span style={{ fontSize: '11px', color: t.textSecondary }}>{helperText}</span>
      )}
    </div>
  )
}

// ─── Radio Group ──────────────────────────────────────────────

interface DSRadioGroupProps {
  title?: string
  helperText?: string
  items: string[]
  defaultSelected?: number
}

export function DSRadioGroup({ title, helperText, items, defaultSelected = 0 }: DSRadioGroupProps) {
  const { tokens: t } = useTheme()
  const [selected, setSelected] = useState(defaultSelected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space3, fontFamily: t.fontFamily }}>
      {title && <p style={{ fontSize: t.text2Xs, fontWeight: 600, color: t.textPrimary, margin: 0 }}>{title}</p>}
      {items.map((item, i) => (
        <DSRadio key={i} label={item} checked={selected === i} onChange={() => setSelected(i)} />
      ))}
      {helperText && (
        <span style={{ fontSize: '11px', color: t.textSecondary }}>{helperText}</span>
      )}
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function DSCheckboxRadioSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Seleção de uma (Radio) ou múltiplas (Checkbox) opções dentro de um conjunto."
      whenToUse={['Seleção múltipla em formulário (Checkbox)', 'Seleção exclusiva entre 2 a 4 opções (Radio)', 'Aceite de termos e condições']}
      whenNotToUse={['Mais de 6 opções (use DSSelect)', 'Toggle instantâneo sem submit (use DSSwitch)', 'Seleção de produto em lista (use DSChip choice)']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Borda unchecked', token: 't.borderMedium', descricao: 'Borda do checkbox/radio não marcado' },
          { elemento: 'Borda checked', token: 't.brandPrimary', descricao: 'Borda quando marcado' },
          { elemento: 'Borda error', token: 't.borderError', descricao: 'Borda no estado error' },
          { elemento: 'Fundo checked', token: 't.brandPrimary', descricao: 'Fundo preenchido quando marcado' },
          { elemento: 'Fundo read-only', token: 't.surfaceSubtle', descricao: 'Fundo no estado read-only' },
          { elemento: 'Fundo disabled', token: 't.surfaceMuted', descricao: 'Fundo no estado disabled' },
          { elemento: 'Ícone check', token: 't.textOnBrand', descricao: 'Cor do ícone Check/Minus' },
          { elemento: 'Ponto radio', token: 't.brandPrimary', descricao: 'Ponto central do radio selected' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
          { elemento: 'Radius checkbox', token: 't.radiusSm', descricao: 'Raio do quadrado do checkbox' },
          { elemento: 'Radius radio', token: 't.radiusFull', descricao: 'Formato circular do radio' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'state (Checkbox)', tipo: "'unchecked' | 'checked' | 'indeterminate' | 'disabled' | 'read-only'", default: "'unchecked'", descricao: 'Estado visual e interativo do checkbox' },
          { prop: 'state (Radio)', tipo: "'unselected' | 'selected' | 'disabled' | 'read-only'", default: "'unselected'", descricao: 'Estado visual e interativo do radio' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Tamanho da caixa/círculo' },
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Texto ao lado do controle' },
          { prop: 'error', tipo: 'boolean', default: 'false', descricao: 'Aplica borda borderError (Checkbox)' },
          { prop: 'checked', tipo: 'boolean', default: '—', descricao: 'Valor controlado externamente (Radio)' },
          { prop: 'onChange', tipo: '(checked: boolean) => void', default: '—', descricao: 'Callback ao marcar/desmarcar' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='checkbox' · role='radio' · Grupos: role='group' com aria-labelledby apontando para o título"
          keyboard="Tab para focar · Space para marcar/desmarcar (checkbox) · Arrow keys para navegar no grupo (radio)"
          screenReader="aria-checked='true/false/mixed' (indeterminate) · aria-required no grupo · aria-invalid + aria-describedby para erro"
          contrast="Checked: brandPrimary — verificado · Disabled: surfaceMuted + textDisabled — somente informativo"
          focus="focusRing na caixa/círculo · read-only: focável mas não interativo (aria-readonly='true')"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Checkbox states */}
          <div>
            <SectionLabel>Checkbox — estados</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {([
                { state: 'unchecked'     as CheckboxState, label: 'Unchecked' },
                { state: 'checked'       as CheckboxState, label: 'Checked' },
                { state: 'indeterminate' as CheckboxState, label: 'Indeterminate' },
                { state: 'read-only'     as CheckboxState, label: 'Read-only (checked)' },
                { state: 'disabled'      as CheckboxState, label: 'Disabled' },
                { state: 'unchecked'     as CheckboxState, label: 'Error state', error: true },
              ]).map((item, i) => (
                <Labeled key={i} component="DSCheckbox" props={`state="${item.state}" size="md"${item.error ? ' error' : ''}`}>
                  <DSCheckbox state={item.state} label={item.label} error={item.error} size="md" />
                </Labeled>
              ))}
            </div>
          </div>

          {/* Checkbox read-only comparison */}
          <div>
            <SectionLabel>Checkbox — checked vs read-only (diferenca visual)</SectionLabel>
            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, margin: 0, textTransform: 'uppercase' }}>Checked (interativo)</p>
                <Labeled component="DSCheckbox" props='state="checked"'>
                  <DSCheckbox state="checked" label="Aceito os termos" />
                </Labeled>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, margin: 0, textTransform: 'uppercase' }}>Read-only (não clicável)</p>
                <Labeled component="DSCheckbox" props='state="read-only"'>
                  <DSCheckbox state="read-only" label="Confirmado pelo sistema" />
                </Labeled>
              </div>
            </div>
          </div>

          {/* Radio states */}
          <div>
            <SectionLabel>Radio — estados</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Labeled component="DSRadio" props='state="unselected"'>
                <DSRadio state="unselected" label="Unselected" />
              </Labeled>
              <Labeled component="DSRadio" props='state="selected"'>
                <DSRadio state="selected"   label="Selected" checked />
              </Labeled>
              <Labeled component="DSRadio" props='state="read-only"'>
                <DSRadio state="read-only"  label="Read-only (selected)" checked />
              </Labeled>
              <Labeled component="DSRadio" props='state="disabled"'>
                <DSRadio state="disabled"   label="Disabled" />
              </Labeled>
            </div>
          </div>

          {/* Groups */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            <Labeled component="DSCheckboxGroup" props='size="md"'>
              <DSCheckboxGroup
                title="Tipo de fundo"
                helperText="Selecione todos que se aplicam"
                items={[
                  { label: 'Renda Fixa', defaultChecked: true },
                  { label: 'Multimercado' },
                  { label: 'Ações' },
                  { label: 'FIDC', defaultChecked: true },
                ]}
              />
            </Labeled>

            <Labeled component="DSRadioGroup" props='size="md"'>
              <DSRadioGroup
                title="Prazo de liquidação"
                helperText="Selecione apenas um"
                items={['D+0 (imediato)', 'D+1 (próximo dia útil)', 'D+30 (mensal)']}
                defaultSelected={1}
              />
            </Labeled>

            <Labeled component="DSCheckboxGroup" props='error="Selecione ao menos uma opção"'>
              <DSCheckboxGroup
                title="Com erro"
                error="Selecione ao menos uma opção"
                items={[
                  { label: 'Opção A' },
                  { label: 'Opção B' },
                ]}
              />
            </Labeled>
          </div>
        </div>
      }
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}