import React, { useState } from 'react'
import { CheckCircle2, XCircle, Shield, Keyboard, Mic, Eye, MousePointer, ChevronDown } from 'lucide-react'
import { useTheme } from './ThemeContext'

// ─── Public Types ──────────────────────────────────────────────

export type DocTab = {
  label: string
  content: React.ReactNode
}

export type RelationRow = {
  component: string
  when: string
}

export type DSDocSectionProps = {
  description: string
  whenToUse: string[]
  whenNotToUse: string[]
  tabs: DocTab[]
  preview?: React.ReactNode
  composes?: string[]
  usedIn?: string[]
  alternatives?: RelationRow[]
}

export interface TokenRow {
  elemento: string
  token: string
  descricao: string
}

export interface PropRow {
  prop: string
  tipo: string
  default: string
  descricao: string
}

export interface A11yProps {
  role: string
  keyboard: string
  screenReader: string
  contrast: string
  focus: string
}

// ─── TokenTable ────────────────────────────────────────────────

export function TokenTable({ rows }: { rows: TokenRow[] }) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusSm, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: t.fontFamily }}>
        <thead>
          <tr style={{ backgroundColor: t.surfaceSubtle }}>
            {['Elemento', 'Token', 'Descrição'].map(h => (
              <th key={h} style={{
                textAlign: 'left', fontSize: '11px', fontWeight: 600,
                color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px',
                padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? t.surfaceDefault : t.surfaceSubtle }}>
              <td style={{ fontSize: '12px', color: t.textPrimary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.elemento}</td>
              <td style={{ fontSize: '12px', color: t.brandPrimary, fontWeight: 500, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px', fontFamily: 'monospace, monospace' }}>{row.token}</td>
              <td style={{ fontSize: '12px', color: t.textPrimary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── PropsTable ────────────────────────────────────────────────

export function PropsTable({ rows }: { rows: PropRow[] }) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusSm, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: t.fontFamily }}>
        <thead>
          <tr style={{ backgroundColor: t.surfaceSubtle }}>
            {['Prop', 'Tipo', 'Default', 'Descrição'].map(h => (
              <th key={h} style={{
                textAlign: 'left', fontSize: '11px', fontWeight: 600,
                color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px',
                padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? t.surfaceDefault : t.surfaceSubtle }}>
              <td style={{ fontSize: '12px', color: t.brandPrimary, fontWeight: 500, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px', fontFamily: 'monospace, monospace' }}>{row.prop}</td>
              <td style={{ fontSize: '12px', color: t.textTertiary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.tipo}</td>
              <td style={{ fontSize: '12px', color: t.textSecondary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.default}</td>
              <td style={{ fontSize: '12px', color: t.textPrimary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.descricao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── A11yBlock ─────────────────────────────────────────────────

export function A11yBlock({ role, keyboard, screenReader, contrast, focus }: A11yProps) {
  const { tokens: t } = useTheme()
  const items = [
    { Icon: Shield,       label: 'Role / ARIA',      value: role },
    { Icon: Keyboard,     label: 'Teclado',           value: keyboard },
    { Icon: Mic,          label: 'Leitor de tela',    value: screenReader },
    { Icon: Eye,          label: 'Contraste',         value: contrast },
    { Icon: MousePointer, label: 'Foco',              value: focus },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: t.fontFamily }}>
      {items.map(({ Icon, label, value }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Icon size={14} color={t.brandPrimary} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary }}>{label}: </span>
            <span style={{ fontSize: '12px', color: t.textSecondary }}>{value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── RelationsTab ──────────────────────────────────────────────

function RelationsTab({ composes, usedIn, alternatives }: { composes?: string[]; usedIn?: string[]; alternatives?: RelationRow[] }) {
  const { tokens: t } = useTheme()

  const Chip = ({ label }: { label: string }) => (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: t.radiusFull,
      backgroundColor: t.brandPrimaryLight,
      color: t.brandPrimary,
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: t.fontFamily,
    }}>{label}</span>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: t.fontFamily }}>
      {composes && composes.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Compõe</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {composes.map(c => <Chip key={c} label={c} />)}
          </div>
        </div>
      )}
      {usedIn && usedIn.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Usado em</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {usedIn.map(c => <Chip key={c} label={c} />)}
          </div>
        </div>
      )}
      {alternatives && alternatives.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>Alternativas</p>
          <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusSm, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: t.surfaceSubtle }}>
                  {['Componente', 'Quando usar no lugar deste'].map(h => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alternatives.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? t.surfaceDefault : t.surfaceSubtle }}>
                    <td style={{ fontSize: '12px', color: t.brandPrimary, fontWeight: 500, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, fontFamily: 'monospace, monospace' }}>{row.component}</td>
                    <td style={{ fontSize: '12px', color: t.textPrimary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}` }}>{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Labeled ──────────────────────────────────────────────────
// Envolve qualquer preview de variante e exibe abaixo o código de referência.
// Uso: <Labeled component="DSButton" props='variant="primary" size="md"'>
//        <DSButton variant="primary" size="md" />
//      </Labeled>

export interface LabeledProps {
  children: React.ReactNode
  component: string
  props?: string
}

export function Labeled({ children, component, props }: LabeledProps) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {children}
      <span style={{
        fontSize: t.textXs,
        fontFamily: 'monospace, monospace',
        color: t.textTertiary,
        paddingLeft: '2px',
        letterSpacing: '0.2px',
        lineHeight: '14px',
      }}>
        {'<'}{component}
        {props && (
          <span style={{ color: t.brandPrimary }}>{' '}{props}</span>
        )}
        {' />'}
      </span>
    </div>
  )
}

// ─── DSDocSection ──────────────────────────────────────────────

export function DSDocSection({ description, whenToUse, whenNotToUse, tabs, preview, composes, usedIn, alternatives }: DSDocSectionProps) {
  const { tokens: t } = useTheme()
  // V-16: accordion behavior — null means all collapsed initially
  const [openTab, setOpenTab] = useState<number | null>(null)

  const hasRelations = (composes && composes.length > 0) || (usedIn && usedIn.length > 0) || (alternatives && alternatives.length > 0)
  const allTabs: DocTab[] = [
    ...tabs,
    ...(hasRelations ? [{ label: 'Relações', content: <RelationsTab composes={composes} usedIn={usedIn} alternatives={alternatives} /> }] : []),
  ]

  const handleTabClick = (i: number) => {
    setOpenTab(prev => prev === i ? null : i)
  }

  return (
    <div style={{ marginBottom: '24px', fontFamily: t.fontFamily }}>
      {/* Description */}
      <p style={{
        fontSize: '13px', color: t.textSecondary,
        margin: '0 0 16px', maxWidth: '640px', lineHeight: '20px',
      }}>
        {description}
      </p>

      {/* Quando usar / Não usar — V-09: unified outer card with column divider */}
      <div style={{
        border: `1px solid ${t.borderDefault}`,
        borderRadius: t.radiusLg,
        backgroundColor: t.surfaceDefault,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        marginBottom: '24px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 16px', borderRight: `1px solid ${t.borderDefault}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <CheckCircle2 size={16} color={t.feedbackSuccess} />
            <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>
              Quando usar
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {whenToUse.map((item, i) => (
              <span key={i} style={{ fontSize: '13px', color: t.textPrimary, lineHeight: '18px' }}>{item}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <XCircle size={16} color={t.feedbackError} />
            <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px', margin: 0 }}>
              Não usar
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {whenNotToUse.map((item, i) => (
              <span key={i} style={{ fontSize: '13px', color: t.textPrimary, lineHeight: '18px' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* V-15: Preview visual — rendered before accordion tabs when provided */}
      {preview && (
        <div style={{
          border: `1px solid ${t.borderDefault}`,
          borderRadius: t.radiusLg,
          backgroundColor: t.surfaceSubtle,
          padding: '20px',
          marginBottom: '16px',
        }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px' }}>
            Preview
          </p>
          {preview}
        </div>
      )}

      {/* V-16: Accordion tabs — initial state none expanded; click to toggle */}
      <div style={{
        border: `1px solid ${t.borderDefault}`,
        borderRadius: t.radiusLg,
        backgroundColor: t.surfaceDefault,
        overflow: 'hidden',
      }}>
        {allTabs.map((tab, i) => {
          const isOpen = openTab === i
          return (
            <div key={tab.label} style={{ borderTop: i > 0 ? `1px solid ${t.borderDefault}` : 'none' }}>
              {/* Tab trigger */}
              <button
                onClick={() => handleTabClick(i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: isOpen ? t.surfaceSubtle : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: t.fontFamily,
                  outline: 'none',
                  transition: 'background-color 0.12s',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: isOpen ? 600 : 500, color: isOpen ? t.brandPrimary : t.textSecondary }}>
                  {tab.label}
                </span>
                <ChevronDown
                  size={14}
                  color={isOpen ? t.brandPrimary : t.textTertiary}
                  style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}
                />
              </button>

              {/* Tab content — V-16: accordion expand/collapse */}
              {isOpen && (
                <div style={{ padding: '16px 20px', borderTop: `1px solid ${t.borderDefault}`, backgroundColor: t.surfaceDefault }}>
                  {tab.content}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
