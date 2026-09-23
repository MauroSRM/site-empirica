import React from 'react'
import { CheckCircle2, XCircle, Info } from 'lucide-react'
import { useTheme } from './ThemeContext'

export interface DocToken {
  element: string
  token: string
  description: string
}

export interface DocProp {
  prop: string
  type: string
  default: string
  description: string
}

interface DSDocBlockProps {
  description: string
  whenToUse: [string, string, string]
  notToUse: [string, string, string]
  tokens: DocToken[]
  props: DocProp[]
  note?: string
}

export function DSDocBlock({ description, whenToUse, notToUse, tokens, props, note }: DSDocBlockProps) {
  const { tokens: t } = useTheme()

  return (
    <div style={{
      backgroundColor: t.surfaceSubtle,
      borderRadius: t.radiusLg,
      padding: '20px 24px',
      marginBottom: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: t.fontFamily,
    }}>
      <p style={{
        fontSize: '13px',
        color: t.textSecondary,
        margin: 0,
        maxWidth: '640px',
        lineHeight: '20px',
      }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', backgroundColor: t.feedbackSuccessBg, borderRadius: t.radiusSm, padding: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
            Quando usar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {whenToUse.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <CheckCircle2 size={16} color={t.feedbackSuccess} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '13px', color: t.textPrimary, lineHeight: '18px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '200px', backgroundColor: t.feedbackErrorBg, borderRadius: t.radiusSm, padding: '12px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px' }}>
            Não usar
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {notToUse.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <XCircle size={16} color={t.feedbackError} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '13px', color: t.textPrimary, lineHeight: '18px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px' }}>
          Tokens
        </p>
        <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusSm, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: t.surfaceSubtle }}>
                {['Elemento', 'Token', 'Descrição'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: 600, color: t.textSecondary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tokens.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? t.surfaceDefault : t.surfaceSubtle }}>
                  <td style={{ fontSize: '12px', color: t.textPrimary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.element}</td>
                  <td style={{ fontSize: '12px', color: t.brandPrimary, fontWeight: 500, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.token}</td>
                  <td style={{ fontSize: '12px', color: t.textPrimary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 8px' }}>
          Props
        </p>
        <div style={{ border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusSm, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: t.surfaceSubtle }}>
                {['Prop', 'Tipo', 'Default', 'Descrição'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', fontWeight: 600, color: t.textSecondary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? t.surfaceDefault : t.surfaceSubtle }}>
                  <td style={{ fontSize: '12px', color: t.brandPrimary, fontWeight: 500, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, fontFamily: 'monospace, monospace', lineHeight: '18px' }}>{row.prop}</td>
                  <td style={{ fontSize: '12px', color: t.textTertiary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.type}</td>
                  <td style={{ fontSize: '12px', color: t.textSecondary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.default}</td>
                  <td style={{ fontSize: '12px', color: t.textPrimary, padding: '8px 12px', borderBottom: `1px solid ${t.borderDefault}`, lineHeight: '18px' }}>{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {note && (
        <div style={{ backgroundColor: t.feedbackInfoBg, borderRadius: t.radiusSm, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <Info size={14} color={t.feedbackInfo} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span style={{ fontSize: '12px', color: t.textPrimary, lineHeight: '18px' }}>{note}</span>
        </div>
      )}
    </div>
  )
}
