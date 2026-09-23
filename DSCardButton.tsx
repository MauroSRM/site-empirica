import React, { useState } from 'react'
import {
  ArrowLeftRight,
  QrCode,
  FileText,
  CreditCard,
  TrendingUp,
  Wallet,
  Landmark,
  RefreshCw,
} from 'lucide-react'
import { getSpacing } from './tokens'
import { useTheme } from './ThemeContext'
import { DSTag } from './DSTag'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type CardButtonSize = 'sm' | 'md'

interface DSCardButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
  tag?: string
  size?: CardButtonSize
}

export function DSCardButton({
  icon,
  label,
  onClick,
  disabled = false,
  tag,
  size = 'md',
}: DSCardButtonProps) {
  const { tokens: t } = useTheme()
  // spacing via getSpacing(t.spacingScale) — reativo ao ThemeOverride.spacingScale
  const spacing = getSpacing(t.spacingScale)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const dim = size === 'sm' ? 120 : 156

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      disabled={disabled}
      style={{
        position: 'relative',
        width: `${dim}px`,
        height: `${dim}px`,
        backgroundColor: disabled ? t.surfaceSubtle : t.surfaceDefault,
        borderRadius: t.cardRadius,
        border: `1px solid ${hovered && !disabled ? t.borderBrand : t.borderDefault}`,
        boxShadow: focused && !disabled
          ? t.focusRing
          : hovered && !disabled
          ? t.shadowCard
          : '0 1px 2px rgba(0,0,0,0.05)',
        padding: spacing.paddingCard,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s',
        opacity: disabled ? 0.5 : 1,
        fontFamily: t.fontFamily,
        outline: 'none',
      }}
    >
      {/* Optional tag */}
      {tag && (
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <DSTag variant="neutral-brand2" size="sm">{tag}</DSTag>
        </div>
      )}

      {/* Icon slot */}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: disabled ? t.textDisabled : t.textPrimary,
          width: '28px',
          height: '28px',
        }}
      >
        {icon}
      </span>

      {/* Label */}
      <p
        style={{
          fontSize: size === 'sm' ? '12px' : '13px',
          fontWeight: 600,
          color: disabled ? t.textDisabled : t.textPrimary,
          margin: 0,
          lineHeight: '18px',
          letterSpacing: '-0.3px',
          textAlign: 'left',
        }}
      >
        {label}
      </p>
    </button>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSCardButtonSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Botão de acesso rápido em formato de card quadrado com ícone. Para ações de navegação em grid."
      whenToUse={['Grid de ações rápidas no dashboard', 'Menu de módulos de serviço', 'Acesso direto a fluxo principal']}
      whenNotToUse={['Ação inline em formulário (use DSButton)', 'Mais de 8 cards em linha (sem scroll)', 'Ação sem ícone representativo']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <SectionLabel>Default — MD (156×156)</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Labeled component="DSCardButton" props='size="md"'>
                <DSCardButton icon={<ArrowLeftRight size={24} />} label="Pix e Transferências" />
              </Labeled>
              <Labeled component="DSCardButton" props='size="md"'>
                <DSCardButton icon={<QrCode size={24} />} label="QR Code" />
              </Labeled>
              <Labeled component="DSCardButton" props='size="md"'>
                <DSCardButton icon={<FileText size={24} />} label="Pagamento de Boleto" />
              </Labeled>
              <Labeled component="DSCardButton" props='size="md"'>
                <DSCardButton icon={<CreditCard size={24} />} label="Cartões" />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>SM (120×120)</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Labeled component="DSCardButton" props='size="sm"'>
                <DSCardButton size="sm" icon={<TrendingUp size={20} />} label="Investimentos" />
              </Labeled>
              <Labeled component="DSCardButton" props='size="sm"'>
                <DSCardButton size="sm" icon={<Wallet size={20} />} label="Carteira Digital" />
              </Labeled>
              <Labeled component="DSCardButton" props='size="sm"'>
                <DSCardButton size="sm" icon={<Landmark size={20} />} label="Câmbio" />
              </Labeled>
              <Labeled component="DSCardButton" props='size="sm"'>
                <DSCardButton size="sm" icon={<RefreshCw size={20} />} label="Recorrências" />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Com tag</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Labeled component="DSCardButton" props='size="md" tag="Novo"'>
                <DSCardButton icon={<ArrowLeftRight size={24} />} label="Pix e Transferências" tag="Novo" />
              </Labeled>
              <Labeled component="DSCardButton" props='size="md" tag="Beta"'>
                <DSCardButton icon={<TrendingUp size={24} />} label="Investimentos" tag="Beta" />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Disabled</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <Labeled component="DSCardButton" props='size="md" disabled={true}'>
                <DSCardButton icon={<Landmark size={24} />} label="Em breve" disabled />
              </Labeled>
              <Labeled component="DSCardButton" props='size="md" disabled={true}'>
                <DSCardButton icon={<RefreshCw size={24} />} label="Indisponível" disabled />
              </Labeled>
            </div>
          </div>
        </div>
      }
      tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Fundo default', token: 't.surfaceDefault', descricao: 'Fundo do card em repouso' },
            { elemento: 'Fundo disabled', token: 't.surfaceSubtle', descricao: 'Fundo quando desabilitado' },
            { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda em repouso' },
            { elemento: 'Borda hover', token: 't.borderBrand', descricao: 'Borda ao passar o mouse' },
            { elemento: 'Sombra hover', token: 't.shadowCard', descricao: 'Elevação ao hover' },
            { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
            { elemento: 'Ícone', token: 't.textPrimary', descricao: 'Cor do ícone' },
            { elemento: 'Ícone disabled', token: 't.textDisabled', descricao: 'Ícone quando desabilitado' },
            { elemento: 'Border radius', token: 't.cardRadius', descricao: 'Raio do card' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'icon', tipo: 'ReactNode', default: '—', descricao: 'Ícone do card (obrigatório)' },
            { prop: 'label', tipo: 'string', default: '—', descricao: 'Texto do card (obrigatório)' },
            { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Dimensão: sm=120px, md=156px' },
            { prop: 'disabled', tipo: 'boolean', default: 'false', descricao: 'Desabilita interação e aplica opacidade' },
            { prop: 'tag', tipo: 'string', default: '—', descricao: 'Etiqueta DSTag no canto superior direito' },
            { prop: 'onClick', tipo: '() => void', default: '—', descricao: 'Callback de clique' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='button' · aria-label deve descrever a ação: 'Fazer Pix' — não apenas 'Pix'"
            keyboard="Tab para focar · Enter ou Space para acionar"
            screenReader="aria-disabled quando disabled · Tag (quando presente) deve ser lida como parte do label"
            contrast="Fundo surfaceDefault, ícone textPrimary — verificado · Hover: borderBrand sobre surfaceDefault — verificado"
            focus="focusRing no container com borderRadius cardRadius"
          /> },
        ]}
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
