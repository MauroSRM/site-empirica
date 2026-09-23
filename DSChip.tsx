// PROMPT 4 — Chip / Filter
import React, { useState } from 'react'
import { Check, X, Filter, Tag, Search } from 'lucide-react'
import { t as staticT } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type ChipState = 'unselected' | 'selected' | 'disabled'
export type ChipType  = 'filter' | 'choice' | 'input'
export type ChipSize  = 'sm' | 'md' | 'lg'

interface DSChipProps {
  label: string
  type?: ChipType
  size?: ChipSize
  state?: ChipState
  icon?: boolean
  removable?: boolean
  onChange?: (selected: boolean) => void
}

const sizeMap = {
  sm: { height: '28px', px: '12px', fontSize: staticT.textSm, iconSize: 12 },
  md: { height: '32px', px: '16px', fontSize: staticT.textMd, iconSize: 12 },
  lg: { height: '36px', px: '20px', fontSize: staticT.textLg, iconSize: 14 },
}

export function DSChip({
  label,
  type = 'filter',
  size = 'md',
  state = 'unselected',
  icon = false,
  removable = false,
  onChange,
}: DSChipProps) {
  const { tokens: t } = useTheme()
  const [hover, setHover]     = useState(false)
  const [focused, setFocused] = useState(false)
  const s = sizeMap[size]
  const isSelected  = state === 'selected'
  const isDisabled  = state === 'disabled'

  let bg     = t.surfaceDefault
  let border = t.borderDefault
  let color  = t.textSecondary
  let cursor = 'pointer'

  if (isDisabled) {
    bg = t.surfaceSubtle; color = t.textDisabled; cursor = 'not-allowed'
  } else if (isSelected) {
    bg = t.brandPrimaryLight; border = t.brandPrimary; color = t.brandPrimary
  } else if (hover) {
    bg = t.surfaceSubtle; border = t.borderBrand; color = t.brandPrimary
  }

  const IconMap: Record<ChipType, React.ReactNode> = {
    filter: <Filter size={s.iconSize} />,
    choice: <Tag size={s.iconSize} />,
    input:  <Search size={s.iconSize} />,
  }

  return (
    <button
      disabled={isDisabled}
      onMouseEnter={() => !isDisabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={() => !isDisabled && onChange?.(!isSelected)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: t.space1,
        height: s.height,
        padding: `0 ${s.px}`,
        borderRadius: t.radiusFull,
        border: `2px solid ${border}`,
        backgroundColor: bg,
        color,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: t.fontFamily,
        cursor,
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        outline: 'none',
        boxShadow: focused && !isDisabled ? t.focusRing : 'none',
      }}
    >
      {isSelected ? <Check size={s.iconSize} /> : (icon && IconMap[type])}
      {label}
      {(type === 'input' || (isSelected && removable)) && (
        <X
          size={s.iconSize}
          style={{ opacity: 0.7 }}
          onClick={e => { e.stopPropagation(); onChange?.(false) }}
        />
      )}
    </button>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '10px', fontWeight: 600, color: staticT.textTertiary, textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: '100px' }}>{label}</span>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', fontWeight: 700, color: staticT.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '20px 0 8px', fontFamily: staticT.fontFamily }}>{children}</p>
}

function FilterGroupDemo() {
  const filters = ['Renda Fixa', 'Multimercado', 'FIDC', 'Ações', 'Debentures']
  const [selected, setSelected] = useState<string[]>(['Renda Fixa'])
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {filters.map(f => (
        <DSChip
          key={f}
          label={f}
          type="filter"
          size="md"
          state={selected.includes(f) ? 'selected' : 'unselected'}
          icon
          removable
          onChange={sel => setSelected(prev => sel ? [...prev, f] : prev.filter(x => x !== f))}
        />
      ))}
    </div>
  )
}

export function DSChipSection() {
  return (
    <DSDocSection
      description="Filtro ou seleção interativa. Muda de estado ao clicar."
      whenToUse={['Filtrar listagem (type: filter)', 'Seleção múltipla (type: choice)', 'Tag removível pelo usuário (type: input)']}
      whenNotToUse={['Indicar status estático (use DSTag)', 'Ação destrutiva', 'Campo obrigatório de formulário']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo default', token: 't.surfaceDefault', descricao: 'Fundo não selecionado' },
          { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda não selecionada' },
          { elemento: 'Texto default', token: 't.textSecondary', descricao: 'Texto não selecionado' },
          { elemento: 'Fundo selected', token: 't.brandPrimaryLight', descricao: 'Fundo quando selecionado' },
          { elemento: 'Borda selected', token: 't.brandPrimary', descricao: 'Borda quando selecionado' },
          { elemento: 'Texto selected', token: 't.brandPrimary', descricao: 'Texto quando selecionado' },
          { elemento: 'Hover borda', token: 't.borderBrand', descricao: 'Borda no hover' },
          { elemento: 'Fundo disabled', token: 't.surfaceSubtle', descricao: 'Fundo desabilitado' },
          { elemento: 'Texto disabled', token: 't.textDisabled', descricao: 'Texto desabilitado' },
          { elemento: 'Border radius', token: 't.radiusFull', descricao: 'Formato pílula' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Texto do chip (obrigatório)' },
          { prop: 'type', tipo: "'filter' | 'choice' | 'input'", default: "'filter'", descricao: 'Comportamento semântico' },
          { prop: 'size', tipo: "'sm' | 'md' | 'lg'", default: "'md'", descricao: 'Altura e padding' },
          { prop: 'state', tipo: "'unselected' | 'selected' | 'disabled'", default: "'unselected'", descricao: 'Estado visual e interativo' },
          { prop: 'icon', tipo: 'boolean', default: 'false', descricao: 'Exibe ícone à esquerda conforme type' },
          { prop: 'removable', tipo: 'boolean', default: 'false', descricao: 'Exibe X de remoção quando selecionado' },
          { prop: 'onChange', tipo: '(selected: boolean) => void', default: '—', descricao: 'Callback ao alternar estado' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='button' com aria-pressed para filter/choice · role='option' dentro de listbox para choice group"
          keyboard="Tab para focar · Space para selecionar/deselecionar · Delete/Backspace para remover (type:input)"
          screenReader="aria-pressed='true/false' · aria-label deve descrever o filtro: 'Renda Fixa, filtro ativo'"
          contrast="Selected: brandPrimary sobre brandPrimaryLight — verificado · Disabled: textDisabled — apenas informativo"
          focus="focusRing obrigatório · disabled não recebe foco (tabIndex=-1)"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: staticT.fontFamily }}>
          <SectionLabel>Estados — type: filter</SectionLabel>
          <Row label="Unselected">
            <Labeled component="DSChip" props='type="filter" state="unselected"'>
              <DSChip label="Categoria" type="filter" state="unselected" />
            </Labeled>
          </Row>
          <Row label="Hover / Brand">
            <Labeled component="DSChip" props='type="filter" state="unselected" icon'>
              <DSChip label="Categoria" type="filter" state="unselected" icon />
            </Labeled>
          </Row>
          <Row label="Selected">
            <Labeled component="DSChip" props='type="filter" state="selected" removable'>
              <DSChip label="Renda Fixa" type="filter" state="selected" removable />
            </Labeled>
          </Row>
          <Row label="Disabled">
            <Labeled component="DSChip" props='type="filter" state="disabled"'>
              <DSChip label="Bloqueado" type="filter" state="disabled" />
            </Labeled>
          </Row>

          <SectionLabel>Tamanhos</SectionLabel>
          <Row label="sm / md / lg">
            {(['sm','md','lg'] as ChipSize[]).map(sz => (
              <Labeled key={sz} component="DSChip" props={`size="${sz}" state="selected"`}>
                <DSChip label={sz.toUpperCase()} size={sz} state="selected" />
              </Labeled>
            ))}
          </Row>

          <SectionLabel>Types</SectionLabel>
          <Row label="filter">
            <Labeled component="DSChip" props='type="filter" icon'>
              <DSChip label="Filtrar" type="filter" icon />
            </Labeled>
            <Labeled component="DSChip" props='type="filter" state="selected" removable'>
              <DSChip label="Ativo" type="filter" state="selected" removable />
            </Labeled>
          </Row>
          <Row label="choice">
            <Labeled component="DSChip" props='type="choice" state="unselected"'>
              <DSChip label="Opção A" type="choice" />
            </Labeled>
            <Labeled component="DSChip" props='type="choice" state="selected"'>
              <DSChip label="Opção B" type="choice" state="selected" />
            </Labeled>
            <Labeled component="DSChip" props='type="choice" state="disabled"'>
              <DSChip label="Opção C" type="choice" state="disabled" />
            </Labeled>
          </Row>
          <Row label="input">
            <Labeled component="DSChip" props='type="input" state="selected"'>
              <DSChip label="react" type="input" state="selected" />
            </Labeled>
            <Labeled component="DSChip" props='type="input" state="selected"'>
              <DSChip label="typescript" type="input" state="selected" />
            </Labeled>
          </Row>

          <SectionLabel>Exemplo real — Filtros de Fundo</SectionLabel>
          <FilterGroupDemo />
        </div>
      }
    />
  )
}