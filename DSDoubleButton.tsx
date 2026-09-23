import React from 'react'
import { t } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSButton, ButtonSize } from './DSButton'

export type DoubleLayout = 'horizontal' | 'vertical' | 'vertical-reversed'
export type DoubleButtonPair = 'primary-secondary' | 'primary-ghost' | 'destructive-ghost'

interface DSDoubleButtonProps {
  layout?: DoubleLayout
  pair?: DoubleButtonPair
  size?: ButtonSize
  fullWidth?: boolean
  primaryLabel?: string
  secondaryLabel?: string
}

const pairConfig: Record<DoubleButtonPair, {
  primary:   { variant: any; label: string }
  secondary: { variant: any; label: string }
}> = {
  'primary-secondary': {
    primary:   { variant: 'primary',     label: 'Confirmar'    },
    secondary: { variant: 'secondary',   label: 'Cancelar'     },
  },
  'primary-ghost': {
    primary:   { variant: 'primary',     label: 'Salvar'       },
    secondary: { variant: 'ghost',       label: 'Cancelar'     },
  },
  'destructive-ghost': {
    primary:   { variant: 'destructive', label: 'Sim, excluir' },
    secondary: { variant: 'ghost',       label: 'Cancelar'     },
  },
}

export function DSDoubleButton({
  layout = 'horizontal',
  pair = 'primary-secondary',
  size = 'md',
  fullWidth = false,
  primaryLabel,
  secondaryLabel,
}: DSDoubleButtonProps) {
  const cfg    = pairConfig[pair]
  const pLabel = primaryLabel  ?? cfg.primary.label
  const sLabel = secondaryLabel ?? cfg.secondary.label

  const isVertical = layout === 'vertical' || layout === 'vertical-reversed'
  const isReversed = layout === 'vertical-reversed'

  const wrapStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isVertical ? 'column' : 'row',
    gap: '12px',
    width: fullWidth || isVertical ? '100%' : 'auto',
    alignItems: isVertical ? undefined : 'center',
  }

  // Vertical: primary on top; vertical-reversed: primary on bottom
  // Horizontal: secondary left, primary right
  const btnW = isVertical || fullWidth ? '100%' : undefined

  const primaryBtn   = <DSButton variant={cfg.primary.variant}   size={size} style={{ width: btnW }}>{pLabel}</DSButton>
  const secondaryBtn = <DSButton variant={cfg.secondary.variant} size={size} style={{ width: btnW }}>{sLabel}</DSButton>

  let order: [React.ReactNode, React.ReactNode]
  if (isVertical) {
    order = isReversed ? [secondaryBtn, primaryBtn] : [primaryBtn, secondaryBtn]
  } else {
    // horizontal: secondary left, primary right
    order = [secondaryBtn, primaryBtn]
  }

  return <div style={wrapStyle}>{order[0]}{order[1]}</div>
}

// ─── Showcase ─────────────────────────────────────────────────

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '10px', fontWeight: 600, color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: t.fontFamily }}>{label}</span>
      {children}
    </div>
  )
}

export function DSDoubleButtonSection() {
  const layouts: DoubleLayout[]      = ['horizontal', 'vertical', 'vertical-reversed']
  const pairs: DoubleButtonPair[]    = ['primary-secondary', 'primary-ghost', 'destructive-ghost']

  return (
    <DSDocSection
      description="Par de botões com layouts configuráveis (horizontal, vertical, vertical-reversed) para ações duplas em telas de confirmação, modais e drawers. Wrapper sobre DSButton."
        whenToUse={['Confirmação + cancelamento em modais e drawers', 'Ação primária + ação destrutiva em tela de revisão', 'CTA duplo em cards de aprovação/rejeição']}
        whenNotToUse={['Mais de 2 ações (use toolbar ou menu)', 'Ação única sem alternativa (use DSButton simples)', 'Navegação sequencial (use DSStepper)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Botão primário', token: 't.brandPrimary / t.textOnBrand', descricao: 'Herdado de DSButton variant primary' },
            { elemento: 'Botão secondary', token: 't.borderBrand / t.brandPrimary', descricao: 'Herdado de DSButton variant secondary' },
            { elemento: 'Botão ghost', token: 'transparent / t.textPrimary', descricao: 'Herdado de DSButton variant ghost' },
            { elemento: 'Botão destructive', token: 't.feedbackError / t.textOnBrand', descricao: 'Herdado de DSButton variant destructive' },
            { elemento: 'Gap horizontal', token: '12px', descricao: 'Espaço entre botões no layout horizontal' },
            { elemento: 'Gap vertical', token: '8px', descricao: 'Espaço entre botões no layout vertical' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'layout', tipo: "'horizontal' | 'vertical' | 'vertical-reversed'", default: "'horizontal'", descricao: 'Orientação dos botões' },
            { prop: 'pair', tipo: "'primary-secondary' | 'primary-ghost' | 'destructive-ghost'", default: "'primary-secondary'", descricao: 'Combinação de variantes' },
            { prop: 'size', tipo: 'ButtonSize', default: "'md'", descricao: 'Tamanho herdado por ambos os botões' },
            { prop: 'fullWidth', tipo: 'boolean', default: 'false', descricao: 'Botões ocupam largura total do container' },
            { prop: 'primaryLabel', tipo: 'string', default: "'Confirmar'", descricao: 'Label do botão primário' },
            { prop: 'secondaryLabel', tipo: 'string', default: "'Cancelar'", descricao: 'Label do botão secundário' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="Herda comportamento de DSButton — role='button' nativo"
            keyboard="Tab entre os dois botões · Enter/Space para acionar cada um"
            screenReader="Labels explícitos em primaryLabel/secondaryLabel — nunca deixar vazio · Ordem DOM deve refletir ordem visual"
            contrast="Herdado de DSButton — todos os pares verificados"
            focus="focusRing visível em cada botão individualmente"
          /> },
        ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 20px', fontFamily: t.fontFamily }}>
              Grade: 3 layouts x 3 pares = 9 combinacoes
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' }}>
              {layouts.map(layout => pairs.map(pair => (
                <Cell key={`${layout}-${pair}`} label={`${layout} / ${pair}`}>
                  <Labeled component="DSDoubleButton" props={`layout="${layout}" pair="${pair}" size="md"`}>
                    <DSDoubleButton layout={layout} pair={pair} size="md" fullWidth={layout !== 'horizontal'} />
                  </Labeled>
                </Cell>
              )))}
            </div>
          </div>
          <div style={{ padding: '16px', backgroundColor: t.surfaceSubtle, borderRadius: t.cardRadius, border: `1px solid ${t.borderDefault}` }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, margin: '0 0 8px', fontFamily: t.fontFamily }}>Regra de hierarquia</p>
            <p style={{ fontSize: '12px', color: t.textSecondary, margin: 0, lineHeight: '20px', fontFamily: t.fontFamily }}>
              Horizontal: secundario à esquerda, principal à direita. Vertical: principal acima. Vertical-reversed: secundario acima (bottom sheets).
            </p>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px', fontFamily: t.fontFamily }}>Contexto: dentro de modal</p>
            <div style={{ width: 420, backgroundColor: t.surfaceDefault, borderRadius: t.radius3xl, padding: '32px', boxShadow: '0 20px 40px rgba(0,8,30,0.15)', display: 'flex', flexDirection: 'column', gap: '20px', border: `1px solid ${t.borderDefault}` }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: t.textPrimary, margin: 0, textAlign: 'center', fontFamily: t.fontFamily }}>Confirmar cancelamento</p>
              <p style={{ fontSize: '14px', color: t.textSecondary, margin: 0, textAlign: 'center', lineHeight: '22px', fontFamily: t.fontFamily }}>
                Deseja cancelar a operação? Esta ação não pode ser desfeita.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Labeled component="DSDoubleButton" props='layout="horizontal" pair="destructive-ghost" size="md"'>
                  <DSDoubleButton layout="horizontal" pair="destructive-ghost" size="md" />
                </Labeled>
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 16px', fontFamily: t.fontFamily }}>Contexto: footer de formulário</p>
            <div style={{ padding: '20px 24px', borderTop: `1px solid ${t.borderDefault}`, display: 'flex', justifyContent: 'flex-end', backgroundColor: t.surfaceSubtle, borderRadius: t.cardRadius }}>
              <Labeled component="DSDoubleButton" props='layout="horizontal" pair="primary-ghost" size="md"'>
                <DSDoubleButton layout="horizontal" pair="primary-ghost" size="md" />
              </Labeled>
            </div>
          </div>
        </div>
      }
    />
  )
}