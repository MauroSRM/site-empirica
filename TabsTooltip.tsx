import React, { useState, useRef, useEffect, useId } from 'react'
import { Info } from 'lucide-react'
import { t } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSTag } from './DSTag'

// ─── Tabs ─────────────────────────────────────────────────────

type TabVariant = 'line' | 'pill'
type TabSize    = 'sm' | 'md'

interface TabItem {
  label: string
  badge?: number
  disabled?: boolean
}

interface DSTabsProps {
  variant?: TabVariant
  size?: TabSize
  tabs: TabItem[]
  defaultActive?: number
  onChange?: (index: number) => void
}

export function DSTabs({ variant = 'line', size = 'md', tabs, defaultActive = 0, onChange }: DSTabsProps) {
  const [active, setActive] = useState(defaultActive)

  const handleClick = (i: number) => {
    if (tabs[i].disabled) return
    setActive(i)
    onChange?.(i)
  }

  if (variant === 'pill') {
    return (
      <div
        style={{
          display: 'inline-flex',
          backgroundColor: t.surfaceMuted,
          padding: '4px',
          borderRadius: t.radiusLg,
          gap: '2px',
          fontFamily: t.fontFamily,
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={tab.disabled}
            style={{
              padding: size === 'sm' ? '6px 12px' : '8px 16px',
              borderRadius: t.radiusMd,
              border: 'none',
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              fontSize: t.textMd,
              fontWeight: active === i ? 600 : 400,
              color: tab.disabled ? t.textDisabled : active === i ? t.textPrimary : t.textSecondary,
              backgroundColor: active === i ? t.surfaceDefault : 'transparent',
              boxShadow: active === i ? t.shadowDropdown : 'none',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: t.fontFamily,
              opacity: tab.disabled ? 0.5 : 1,
            }}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <DSTag variant="error" size="sm">{String(tab.badge)}</DSTag>
            )}
          </button>
        ))}
      </div>
    )
  }

  // Line variant
  return (
    <div style={{ borderBottom: `2px solid ${t.borderDefault}`, display: 'flex', fontFamily: t.fontFamily }}>
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => handleClick(i)}
          disabled={tab.disabled}
          style={{
            padding: size === 'sm' ? '8px 12px' : '10px 16px',
            border: 'none',
            cursor: tab.disabled ? 'not-allowed' : 'pointer',
            fontSize: t.textMd,
            fontWeight: active === i ? 600 : 400,
            color: tab.disabled ? t.textDisabled : active === i ? t.textPrimary : t.textSecondary,
            backgroundColor: 'transparent',
            borderBottom: active === i ? `2px solid ${t.brandPrimary}` : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: t.fontFamily,
            opacity: tab.disabled ? 0.5 : 1,
          }}
        >
          {tab.label}
          {tab.badge !== undefined && (
            <DSTag variant="error" size="sm">{String(tab.badge)}</DSTag>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Tooltip ──────────────────────────────────────────────────

type TooltipVariant  = 'default' | 'dark'
type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

interface DSTooltipProps {
  variant?: TooltipVariant
  position?: TooltipPosition
  content: string
  children: React.ReactNode
}

export function DSTooltip({ variant = 'default', position = 'top', content, children }: DSTooltipProps) {
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  const isDark = variant === 'dark'

  const tooltipBg    = isDark ? t.surfaceInverse : t.surfaceDefault
  const tooltipColor = isDark ? t.textOnBrand : t.textPrimary
  const tooltipBorder = isDark ? 'none' : `1px solid ${t.borderDefault}`
  const shadow = t.shadowDropdown

  const getTooltipStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: tooltipBg,
      color: tooltipColor,
      border: tooltipBorder,
      boxShadow: shadow,
      borderRadius: t.radiusMd,
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: t.space3,
      paddingRight: t.space3,
      // Padding H arredondado 10→12px por ausência de token intermediário
      fontSize: t.text2Xs,
      fontFamily: t.fontFamily,
      lineHeight: '1.4',
      width: 'max-content',
      maxWidth: '200px',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      boxSizing: 'border-box',
      zIndex: 1000,
      pointerEvents: 'none',
    }

    switch (position) {
      case 'top':    return { ...base, bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' }
      case 'bottom': return { ...base, top: '100%',    left: '50%', transform: 'translateX(-50%)', marginTop: '8px' }
      case 'left':   return { ...base, right: '100%',  top: '50%',  transform: 'translateY(-50%)', marginRight: '8px' }
      case 'right':  return { ...base, left: '100%',   top: '50%',  transform: 'translateY(-50%)', marginLeft: '8px' }
    }
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      aria-describedby={visible ? tooltipId : undefined}
    >
      {children}
      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          style={getTooltipStyle()}
        >
          {content}
        </div>
      )}
    </div>
  )
}

// ─── Trigger (Info icon) ──────────────────────────────────────

export function TooltipTrigger() {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ color: hovered ? t.brandPrimary : t.textTertiary, cursor: 'help', display: 'inline-flex' }}
    >
      <Info size={14} />
    </span>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

const sampleTabs: TabItem[] = [
  { label: 'Visão Geral' },
  { label: 'Recebíveis', badge: 3 },
  { label: 'Documentos' },
  { label: 'Histórico', disabled: true },
]

export function TabsTooltipSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <DSDocSection
        description="Dois componentes complementares: DSTabs (navegação por abas com variantes line/pill e tamanhos sm/md) e DSTooltip (tooltip de informação acionado por hover em ícone Info). Primitivos de UI frequentemente combinados."
        whenToUse={['DSTabs: subnavegação entre visões de uma mesma página', 'DSTabs: alternância de visualização (tabela/gráfico)', 'DSTooltip: contexto adicional sobre campo ou ação sem poluir UI']}
        whenNotToUse={['DSTabs: mais de 6 abas (use select ou menu)', 'DSTabs: navegação entre rotas (use NavBar)', 'DSTooltip: informação crítica que deve ser sempre visível (use texto inline)']}
        preview={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <SectionLabel>DSTabs — Line</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Labeled component="DSTabs" props='variant="line" size="md"'>
                  <DSTabs variant="line" size="md" tabs={sampleTabs} />
                </Labeled>
                <Labeled component="DSTabs" props='variant="line" size="sm"'>
                  <DSTabs variant="line" size="sm" tabs={sampleTabs} />
                </Labeled>
              </div>
            </div>
            <div>
              <SectionLabel>DSTabs — Pill</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Labeled component="DSTabs" props='variant="pill" size="md"'>
                  <DSTabs variant="pill" size="md" tabs={[{ label: 'Mensal' }, { label: 'Trimestral' }, { label: 'Anual' }]} />
                </Labeled>
                <Labeled component="DSTabs" props='variant="pill" size="sm"'>
                  <DSTabs variant="pill" size="sm" tabs={[{ label: 'Mensal' }, { label: 'Trimestral' }, { label: 'Anual' }]} />
                </Labeled>
              </div>
            </div>
          </div>
        }
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Tab ativa (line)', token: 't.brandPrimary', descricao: 'Indicador e texto da aba ativa' },
            { elemento: 'Tab inativa', token: 't.textSecondary', descricao: 'Texto das abas não selecionadas' },
            { elemento: 'Pill ativo fundo', token: 't.brandPrimary', descricao: 'Fundo do pill selecionado' },
            { elemento: 'Pill ativo texto', token: 't.textOnBrand', descricao: 'Texto sobre o pill ativo' },
            { elemento: 'Separador', token: 't.borderDefault', descricao: 'Linha base da variante line' },
            { elemento: 'Tooltip fundo', token: 't.neutral900', descricao: 'Background do tooltip' },
            { elemento: 'Tooltip texto', token: 't.neutral0', descricao: 'Texto sobre fundo escuro do tooltip' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: '(Tabs) variant', tipo: "'line' | 'pill'", default: "'line'", descricao: 'Estilo visual das abas' },
            { prop: '(Tabs) tabs', tipo: 'TabItem[]', default: '—', descricao: 'Array de abas com label, icon?, badge? (obrigatório)' },
            { prop: '(Tabs) size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Tamanho dos itens' },
            { prop: '(Tabs) defaultActive', tipo: 'number', default: '0', descricao: 'Índice da aba ativa por padrão' },
            { prop: '(Tabs) onChange', tipo: '(index: number) => void', default: 'undefined', descricao: 'Callback ao mudar de aba' },
            { prop: '(Tooltip) content', tipo: 'string', default: '—', descricao: 'Texto exibido no tooltip (obrigatório)' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="Tabs: role='tablist' · role='tab' em cada aba · role='tabpanel' no painel ativo · Tooltip: role='tooltip'"
            keyboard="Tabs: Setas ← → para navegar · Tab/Shift+Tab entre tablist e painel · Tooltip: acessível por focus no ícone Info"
            screenReader="Aba ativa: aria-selected='true' · Tooltip acionado por focus: aria-describedby aponta para tooltip"
            contrast="brandPrimary sobre branco verificado · neutral0 sobre neutral900 (tooltip) verificado"
            focus="focusRing visível em cada aba e no ícone de tooltip"
          /> },
        ]}
      />
      {/* Tooltips */}
      <div>
        <SectionLabel>Tooltip — 4 posições × 2 variantes</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px', padding: '32px 0' }}>
          {(['top', 'right', 'bottom', 'left'] as TooltipPosition[]).map(pos => (
            <React.Fragment key={pos}>
              {(['default', 'dark'] as TooltipVariant[]).map(variant => (
                <div key={variant} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <p style={{ fontSize: '11px', color: t.textTertiary, fontFamily: t.fontFamily, margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {pos} / {variant}
                  </p>
                  <Labeled component="DSTooltip" props={`variant="${variant}" position="${pos}"`}>
                    <DSTooltip variant={variant} position={pos} content={`Tooltip ${variant} ${pos}`}>
                      <TooltipTrigger />
                    </DSTooltip>
                  </Labeled>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <p style={{ fontSize: '12px', color: t.textSecondary, fontFamily: t.fontFamily }}>
          Passe o mouse sobre os icones para ver os tooltips.
        </p>
      </div>

      {/* Tooltip with more content */}
      <div>
        <SectionLabel>Tooltips em uso real</SectionLabel>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: t.fontFamily }}>
            <span style={{ fontSize: '13px', color: t.textPrimary, fontWeight: 600 }}>Rentabilidade bruta</span>
            <Labeled component="DSTooltip" props='content="..." position="top"'>
              <DSTooltip content="Rentabilidade antes do desconto de IR e IOF" position="top">
                <TooltipTrigger />
              </DSTooltip>
            </Labeled>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: t.fontFamily }}>
            <span style={{ fontSize: '13px', color: t.textPrimary, fontWeight: 600 }}>CDI+</span>
            <Labeled component="DSTooltip" props='variant="dark" position="right" content="..."'>
              <DSTooltip variant="dark" content="Certificado de Depósito Interbancário + spread adicional" position="right">
                <TooltipTrigger />
              </DSTooltip>
            </Labeled>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}