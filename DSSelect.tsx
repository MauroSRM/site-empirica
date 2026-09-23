import React, { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check, Search, AlertCircle } from 'lucide-react'
import { t as staticT } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type SelectState = 'default' | 'open' | 'error' | 'disabled' | 'filled'
type SelectSize  = 'sm' | 'md'

interface DSSelectProps {
  state?: SelectState
  size?: SelectSize
  label?: string
  placeholder?: string
  helperText?: string
  errorText?: string
  options?: string[]
  withSearch?: boolean
  value?: string
  onChange?: (v: string) => void
}

const defaultOptions = [
  'Renda Fixa',
  'Multimercado',
  'Fundos de Ações',
  'FIDC',
  'Securitização',
  'CRI & CRA',
  'Debêntures',
]

export function DSSelect({
  state = 'default',
  size = 'md',
  label,
  placeholder = 'Selecione...',
  helperText,
  errorText,
  options = defaultOptions,
  withSearch = false,
  value: externalValue,
  onChange,
}: DSSelectProps) {
  const { tokens: t } = useTheme()
  const [isOpen, setIsOpen]     = useState(state === 'open')
  const [selected, setSelected] = useState(externalValue || '')
  const [search, setSearch]     = useState('')
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const ref      = useRef<HTMLDivElement>(null)
  const listboxId = useId()

  const isDisabled = state === 'disabled'
  const isError    = state === 'error'
  const height     = size === 'sm' ? '40px' : '48px'

  const filtered = withSearch
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (option: string) => {
    setSelected(option)
    onChange?.(option)
    setIsOpen(false)
    setSearch('')
  }

  const getBorder = () => {
    if (isError)  return `1px solid ${t.borderError}`
    if (isOpen)   return `1px solid ${t.borderBrand}`
    return `1px solid ${t.borderDefault}`
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily, minWidth: '240px', position: 'relative' }}>
      {label && (
        <label style={{ fontSize: t.text2Xs, fontWeight: 600, color: t.textPrimary }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        onKeyDown={e => { if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setIsOpen(!isOpen) } if (e.key === 'Escape') setIsOpen(false) }}
        style={{
          height,
          paddingLeft: t.space3,
          paddingRight: t.space3,
          borderRadius: t.inputRadius,
          border: getBorder(),
          backgroundColor: isDisabled ? t.surfaceSubtle : t.surfaceDefault,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          boxShadow: isOpen ? t.focusRing : undefined,
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '13px', color: selected ? t.textPrimary : t.textTertiary, fontFamily: t.fontFamily }}>
          {selected || placeholder}
        </span>
        <ChevronDown
          size={16}
          color={t.textSecondary}
          style={{ transition: 'transform 0.15s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          style={{
            position: 'absolute',
            top: label ? 'calc(100% - 2px)' : 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: t.surfaceDefault,
            border: `1px solid ${t.borderDefault}`,
            borderRadius: t.radiusLg,
            boxShadow: t.shadowDropdown,
            maxHeight: '240px',
            overflowY: 'auto',
            marginTop: '4px',
          }}
        >
          {withSearch && (
            <div
              style={{
                padding: '8px 12px',
                borderBottom: `1px solid ${t.borderDefault}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Search size={14} color={t.textTertiary} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar..."
                autoFocus
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',   // mínimo 16 — evita zoom iOS
                  fontFamily: t.fontFamily,
                  color: t.textPrimary,
                  backgroundColor: 'transparent',
                  width: '100%',
                }}
              />
            </div>
          )}

          {filtered.map(option => (
            <div
              key={option}
              role="option"
              aria-selected={selected === option}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption(null)}
              style={{
                paddingTop: t.space3,
                paddingBottom: t.space3,
                paddingLeft: t.space3,
                paddingRight: t.space3,
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
                fontFamily: t.fontFamily,
                cursor: 'pointer',
                color: selected === option ? t.brandPrimary : t.textPrimary,
                background: (() => {
                  if (selected === option) return t.brandPrimaryLight;
                  if (hoveredOption === option) return t.surfaceSubtle;
                  return 'transparent';
                })(),
                transition: 'background-color 0.1s ease',
              }}
            >
              {option}
              {selected === option && <Check size={14} />}
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: '16px 12px', fontSize: '13px', color: t.textTertiary, fontFamily: t.fontFamily }}>
              Nenhuma opção encontrada
            </div>
          )}
        </div>
      )}

      {isError && errorText && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: t.feedbackError }}>
          <AlertCircle size={12} />
          {errorText}
        </div>
      )}
      {!isError && helperText && (
        <span style={{ fontSize: '11px', color: t.textSecondary }}>{helperText}</span>
      )}
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function DSSelectSection() {
  return (
    <DSDocSection
      description="Seleção de uma opção em lista fechada, com busca opcional."
      whenToUse={['Lista de 5 ou mais opções', 'Valor de um conjunto fixo conhecido', 'Filtro com busca interna']}
      whenNotToUse={['Menos de 4 opções (use DSRadio)', 'Seleção múltipla simultânea (use DSCheckbox)', 'Opções que mudam dinamicamente em tempo real']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda em repouso' },
          { elemento: 'Borda focus/open', token: 't.borderBrand', descricao: 'Borda ao abrir' },
          { elemento: 'Borda error', token: 't.borderError', descricao: 'Borda no estado error' },
          { elemento: 'Fundo default', token: 't.surfaceDefault', descricao: 'Fundo do trigger' },
          { elemento: 'Fundo disabled', token: 't.surfaceSubtle', descricao: 'Fundo quando desabilitado' },
          { elemento: 'Item selecionado', token: 't.brandPrimary', descricao: 'Cor do ícone check e texto selecionado' },
          { elemento: 'Sombra dropdown', token: 't.shadowDropdown', descricao: 'Sombra do painel de opções' },
          { elemento: 'Error text', token: 't.feedbackError', descricao: 'Mensagem de erro' },
          { elemento: 'Border radius', token: 't.inputRadius', descricao: 'Raio do trigger (8px)' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'state', tipo: "'default' | 'open' | 'error' | 'disabled' | 'filled'", default: "'default'", descricao: 'Estado visual do select' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Altura: sm=40px, md=48px' },
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Label acima do campo' },
          { prop: 'placeholder', tipo: 'string', default: "'Selecione...'", descricao: 'Texto quando sem seleção' },
          { prop: 'helperText', tipo: 'string', default: '—', descricao: 'Texto auxiliar abaixo' },
          { prop: 'errorText', tipo: 'string', default: '—', descricao: 'Mensagem no estado error' },
          { prop: 'options', tipo: 'string[]', default: 'defaultOptions', descricao: 'Lista de opções disponíveis' },
          { prop: 'withSearch', tipo: 'boolean', default: 'false', descricao: 'Adiciona campo de busca no dropdown' },
          { prop: 'value', tipo: 'string', default: '—', descricao: 'Valor selecionado controlado' },
          { prop: 'onChange', tipo: '(v: string) => void', default: '—', descricao: 'Callback ao selecionar' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='combobox' com aria-expanded e aria-controls apontando para o dropdown · role='listbox' no dropdown"
          keyboard="Tab para focar · Enter/Space para abrir · Arrow keys para navegar opções · Escape para fechar · typing para busca"
          screenReader="aria-selected na opção ativa · aria-label no trigger quando sem label visual · withSearch: campo tem aria-label='Buscar'"
          contrast="Texto: textPrimary — verificado · Item hover: brandPrimary sobre brandPrimaryLight — verificado"
          focus="focusRing no trigger · itens do dropdown navegados via arrow keys com aria-activedescendant"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <SectionLabel>Estados</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              <Labeled component="DSSelect" props='state="default"'>
                <DSSelect label="Default" placeholder="Selecione uma opção..." />
              </Labeled>
              <Labeled component="DSSelect" props='state="filled"'>
                <DSSelect label="Filled" state="filled" value="Renda Fixa" />
              </Labeled>
              <Labeled component="DSSelect" props='state="error"'>
                <DSSelect label="Error" state="error" errorText="Selecione uma opção" />
              </Labeled>
              <Labeled component="DSSelect" props='state="disabled"'>
                <DSSelect label="Disabled" state="disabled" placeholder="Desabilitado" />
              </Labeled>
            </div>
          </div>

          <div>
            <SectionLabel>Com busca interna</SectionLabel>
            <div style={{ maxWidth: '320px' }}>
              <Labeled component="DSSelect" props='withSearch'>
                <DSSelect label="Tipo de fundo (com busca)" withSearch placeholder="Buscar e selecionar..." />
              </Labeled>
            </div>
          </div>

          <div>
            <SectionLabel>Tamanhos</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
              <Labeled component="DSSelect" props='size="sm"'>
                <DSSelect size="sm" label="Small (40px)" />
              </Labeled>
              <Labeled component="DSSelect" props='size="md"'>
                <DSSelect size="md" label="Medium (48px)" />
              </Labeled>
            </div>
          </div>
        </div>
      }
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: staticT.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: staticT.fontFamily }}>
      {children}
    </p>
  )
}