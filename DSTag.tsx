import React from 'react'
import { Tag, X } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type TagVariant =
  | 'neutral-brand1'
  | 'neutral-brand2'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | 'info'

export type TagSize = 'sm' | 'md' | 'lg'

interface DSTagProps {
  variant?: TagVariant
  size?: TagSize
  removable?: boolean
  icon?: boolean
  children: React.ReactNode
  onRemove?: () => void
}

const sizeMap = {
  sm: { height: '20px', padding: '5px 8px',  fontSize: '9px' },
  md: { height: '22px', padding: '4px 8px',  fontSize: t.text10 },
  lg: { height: '24px', padding: '4px 12px', fontSize: '12px' },
}

const variantLabels: Record<TagVariant, string> = {
  'neutral-brand1': 'Azul',
  'neutral-brand2': 'Laranja',
  'success':        'Sucesso',
  'warning':        'Aviso',
  'error':          'Erro',
  'neutral':        'Neutro',
  'info':           'Info',
}

export function DSTag({
  variant = 'neutral-brand1',
  size = 'md',
  removable = false,
  icon = false,
  children,
  onRemove,
}: DSTagProps) {
  const { tokens: t } = useTheme()

  const variantStyles: Record<TagVariant, { bg: string; color: string }> = {
    'neutral-brand1': { bg: t.brandPrimaryLight, color: t.brandPrimary },
    // W-03/W-04: brandAccentStrong (~3.1:1 on brandAccentLight) — brandAccent fails WCAG (~1.5:1)
    'neutral-brand2': { bg: t.brandAccentLight,  color: t.brandAccentStrong },
    // Critical-1: feedbackSuccessText (#047857, ~4.7:1 on feedbackSuccessBg) for WCAG AA
    'success':        { bg: t.feedbackSuccessBg, color: t.feedbackSuccessText },
    'warning':        { bg: t.feedbackWarningBg, color: t.feedbackWarning },
    'error':          { bg: t.feedbackErrorBg,   color: t.feedbackError },
    'neutral':        { bg: t.tagNeutralBg,       color: t.tagNeutralColor },
    'info':           { bg: t.feedbackInfoBg,     color: t.feedbackInfo },
  }

  const vs = variantStyles[variant]
  const sz = sizeMap[size]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
        flexShrink: 0,
        maxWidth: 'fit-content',
        gap: '4px',
        height: sz.height,
        padding: sz.padding,
        borderRadius: t.radiusSm,
        fontSize: sz.fontSize,
        fontWeight: 600,
        fontFamily: t.fontFamily,
        backgroundColor: vs.bg,
        color: vs.color,
        lineHeight: 1,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {icon && <Tag size={8} />}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: vs.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '16px',
            minHeight: '16px',
          }}
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function DSTagSection() {
  const variants: TagVariant[] = ['neutral-brand1', 'neutral-brand2', 'success', 'warning', 'error', 'neutral', 'info']
  const sizes: TagSize[] = ['sm', 'md', 'lg']

  return (
    <DSDocSection
      description="Categoriza ou indica o status de um registro. Sempre estática — sem interação."
      whenToUse={['Status de entidade em tabela', 'Categorias de produto', 'Filtro aplicado já ativo']}
      whenNotToUse={['Ação clicável (use DSChip)', 'Texto com mais de 2 palavras', 'Substituir badge de notificação']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <SectionLabel>Variantes (size md)</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {variants.map(v => (
                <Labeled key={v} component="DSTag" props={`variant="${v}"`}>
                  <DSTag variant={v}>{variantLabels[v]}</DSTag>
                </Labeled>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>Com icone e removivel</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {variants.map(v => (
                <Labeled key={v} component="DSTag" props={`variant="${v}" icon removable`}>
                  <DSTag variant={v} icon removable>{variantLabels[v]}</DSTag>
                </Labeled>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>Tabela: 7 variantes x 3 tamanhos = 21 combinacoes</SectionLabel>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Variante</th>
                    {sizes.map(s => <th key={s} style={thStyle}>{s.toUpperCase()}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={v} style={{ backgroundColor: i % 2 === 0 ? t.surfaceSubtle : t.surfaceDefault }}>
                      <td style={tdStyle}><span style={{ fontSize: '12px', fontWeight: 600, color: t.textSecondary, fontFamily: t.fontFamily }}>{variantLabels[v]}</span></td>
                      {sizes.map(s => (
                        <td key={s} style={tdStyle}>
                          <Labeled component="DSTag" props={`variant="${v}" size="${s}"`}>
                            <DSTag variant={v} size={s}>{variantLabels[v]}</DSTag>
                          </Labeled>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo brand1', token: 't.brandPrimaryLight', descricao: 'Fundo da variante neutral-brand1' },
          { elemento: 'Texto brand1', token: 't.brandPrimary', descricao: 'Texto da variante neutral-brand1' },
          { elemento: 'Fundo brand2', token: 't.brandAccentLight', descricao: 'Fundo da variante neutral-brand2' },
          { elemento: 'Texto brand2', token: 't.brandAccentStrong', descricao: 'Texto da variante neutral-brand2 (W-03: WCAG AA)' },
          { elemento: 'Fundo success', token: 't.feedbackSuccessBg', descricao: 'Fundo da variante success' },
          { elemento: 'Texto success', token: 't.feedbackSuccessText', descricao: 'Texto da variante success (Critical-1: WCAG AA)' },
          { elemento: 'Fundo neutral', token: 't.tagNeutralBg', descricao: 'Fundo da variante neutral' },
          { elemento: 'Texto neutral', token: 't.tagNeutralColor', descricao: 'Texto da variante neutral' },
          { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo da variante error' },
          { elemento: 'Texto error', token: 't.feedbackError', descricao: 'Texto da variante error' },
          { elemento: 'Border radius', token: 't.radiusSm', descricao: 'Raio de borda da tag' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'neutral-brand1' | 'neutral-brand2' | 'success' | 'warning' | 'error' | 'neutral' | 'info'", default: "'neutral-brand1'", descricao: 'Cor semântica da tag' },
          { prop: 'size', tipo: "'sm' | 'md' | 'lg'", default: "'md'", descricao: 'Altura e padding' },
          { prop: 'removable', tipo: 'boolean', default: 'false', descricao: 'Exibe botão X para remoção' },
          { prop: 'icon', tipo: 'boolean', default: 'false', descricao: 'Exibe ícone Tag à esquerda' },
          { prop: 'children', tipo: 'ReactNode', default: '—', descricao: 'Texto da etiqueta (obrigatório)' },
          { prop: 'onRemove', tipo: '() => void', default: '—', descricao: 'Callback ao clicar no X' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="Sem role semântico — é decorativo. Se comunicar status crítico, usar aria-label"
          keyboard="Não focável — é apresentacional. Se removable, o botão X recebe Tab"
          screenReader="Texto do children é lido diretamente · onRemove deve ter aria-label='Remover [tag]'"
          contrast="Todas as variantes: texto sobre bg claro — ratio mínimo 4.5:1 verificado"
          focus="Botão de remoção (X) recebe focusRing quando focável"
        /> },
      ]}
    />
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 600,
  color: t.textTertiary,
  padding: '8px 16px',
  borderBottom: `1px solid ${t.borderDefault}`,
  fontFamily: t.fontFamily,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 16px',
  borderBottom: `1px solid ${t.borderDefault}`,
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}