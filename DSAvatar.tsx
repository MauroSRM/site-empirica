import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizeMap: Record<AvatarSize, { dim: number; fontSize: string; fontWeight: number }> = {
  xs: { dim: 20, fontSize: '8px',  fontWeight: 600 },
  sm: { dim: 24, fontSize: '10px', fontWeight: 600 },
  md: { dim: 32, fontSize: '13px', fontWeight: 600 },
  lg: { dim: 40, fontSize: '15px', fontWeight: 600 },
  xl: { dim: 48, fontSize: '17px', fontWeight: 700 },
}

interface DSAvatarProps {
  initials: string
  size?: AvatarSize
  bg?: string
}

export function DSAvatar({ initials, size = 'md', bg }: DSAvatarProps) {
  const { tokens: t } = useTheme()
  const s = sizeMap[size]
  return (
    <div style={{
      width:  `${s.dim}px`,
      height: `${s.dim}px`,
      borderRadius: t.radiusFull,
      backgroundColor: bg ?? t.brandPrimary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: s.fontSize, fontWeight: s.fontWeight, color: t.textOnBrand, fontFamily: t.fontFamily, lineHeight: 1, userSelect: 'none' }}>
        {initials}
      </span>
    </div>
  )
}

// initials-role / initials-company
export function DSAvatarWithLabel({
  initials,
  bg,
  line1,
  line2,
}: {
  initials: string
  bg?: string
  line1: string
  line2: string
}) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: t.fontFamily }}>
      <DSAvatar initials={initials} size="md" bg={bg} />
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '18px' }}>{line1}</p>
        <p style={{ fontSize: '11px', fontWeight: 400, color: t.textSecondary, margin: 0, lineHeight: '16px' }}>{line2}</p>
      </div>
    </div>
  )
}

// initials-company-cnpj static (no interaction)
export function DSAvatarCompanyCNPJStatic({
  initials,
  bg,
  company,
  cnpj,
}: {
  initials: string
  bg?: string
  company: string
  cnpj: string
}) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontFamily: t.fontFamily }}>
      <DSAvatar initials={initials} size="lg" bg={bg} />
      <div style={{ textAlign: 'left' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '20px' }}>{company}</p>
        <p style={{ fontSize: '11px', fontWeight: 400, color: t.textTertiary, margin: 0, lineHeight: '16px' }}>{cnpj}</p>
      </div>
    </div>
  )
}

// initials-company-cnpj with dropdown — fixed size, no layout shift on hover
export function DSAvatarCompanyCNPJ({
  initials,
  bg,
  company,
  cnpj,
}: {
  initials: string
  bg?: string
  company: string
  cnpj: string
}) {
  const { tokens: t } = useTheme()
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <button
      onClick={() => setOpen(o => !o)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: '6px 10px',
        borderRadius: t.radiusLg,
        backgroundColor: hovered ? t.surfaceSubtle : 'transparent',
        border: `1px solid ${open ? t.brandPrimary : hovered ? t.borderDefault : 'transparent'}`,
        cursor: 'pointer',
        fontFamily: t.fontFamily,
        transition: 'background-color 0.15s, border-color 0.15s',
      }}
    >
      <DSAvatar initials={initials} size="lg" bg={bg} />
      <div style={{ textAlign: 'left' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '20px' }}>{company}</p>
        <p style={{ fontSize: '11px', fontWeight: 400, color: t.textTertiary, margin: 0, lineHeight: '16px' }}>{cnpj}</p>
      </div>
      <ChevronDown
        size={16}
        color={t.textSecondary}
        style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '4px' }}
      />
    </button>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSAvatarSection() {
  const { tokens: t } = useTheme()

  // Primeiros 2 mapeiam para tokens de marca; últimos 4 são cores fora do DS (sem token equivalente)
  const paletteBgs = [t.brandSecondary, t.brandPrimary, t.avatarGreen, t.avatarPurple, t.avatarAmber, t.avatarCrimson]

  return (
    <DSDocSection
      description="Representa um usuário ou empresa com iniciais. Pode exibir nome, cargo e CNPJ."
      whenToUse={['Identificar usuário no header', 'Representar beneficiário em lista de operações', 'Seletor de conta empresa com dropdown']}
      whenNotToUse={['Avatar de entidade não-humana (use ícone)', 'Tamanho xs em texto corrido (ilegível)', 'Substituir foto real de usuário (não há suporte a imagem)']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo padrão 1', token: 't.brandSecondary', descricao: 'Primeira cor de fundo da paleta' },
          { elemento: 'Fundo padrão 2', token: 't.brandPrimary', descricao: 'Segunda cor de fundo da paleta' },
          { elemento: 'Texto sobre fundo', token: 't.textOnBrand', descricao: 'Iniciais sobre fundos de marca' },
          { elemento: 'Texto nome', token: 't.textPrimary', descricao: 'Nome ao lado do avatar' },
          { elemento: 'Texto cargo', token: 't.textSecondary', descricao: 'Cargo/subtítulo ao lado do avatar' },
          { elemento: 'Texto CNPJ', token: 't.textTertiary', descricao: 'CNPJ abaixo do nome' },
          { elemento: 'Radius', token: 't.radiusFull', descricao: 'Formato circular do avatar' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'initials', tipo: 'string', default: '—', descricao: 'Iniciais exibidas (obrigatório)' },
          { prop: 'size', tipo: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", descricao: 'Dimensão do círculo' },
          { prop: 'bg', tipo: 'string', default: 'auto da paleta', descricao: 'Cor de fundo customizada' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='img' com aria-label='Iniciais de [Nome]' · Variante interativa: role='button' com aria-expanded"
          keyboard="Variante company-cnpj-interactive: Tab para focar · Enter/Space para abrir dropdown"
          screenReader="Iniciais não são suficientes — aria-label com nome completo obrigatório · Dropdown: aria-haspopup='listbox'"
          contrast="textOnBrand sobre brandPrimary — verificado para todas as cores de fundo de marca"
          focus="Variante interativa: focusRing via borderBrand · focusRing global de 3px"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: t.fontFamily }}>
          <div>
            <SectionLabel>Variante initials — 5 tamanhos</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as AvatarSize[]).map(s => (
                <Labeled key={s} component="DSAvatar" props={`initials="CM" size="${s}"`}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <DSAvatar initials="CM" size={s} />
                    <span style={{ fontSize: '10px', color: t.textTertiary }}>{s} · {sizeMap[s].dim}px</span>
                  </div>
                </Labeled>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>initials-role</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Labeled component="DSAvatarWithLabel" props='initials="CM" size="md"'>
                <DSAvatarWithLabel initials="CM" line1="Carlos Mendes" line2="CEO · Master" />
              </Labeled>
              <Labeled component="DSAvatarWithLabel" props='initials="JS" size="md"'>
                <DSAvatarWithLabel initials="JS" bg="#2758b5" line1="João Silva" line2="Operador Financeiro" />
              </Labeled>
            </div>
          </div>

          <div>
            <SectionLabel>initials-company</SectionLabel>
            <Labeled component="DSAvatarWithLabel" props='initials="SA" size="md"'>
              <DSAvatarWithLabel initials="SA" bg="#1a6b4a" line1="SRM Asset" line2="Conta principal" />
            </Labeled>
          </div>

          <div>
            <SectionLabel>initials-company-cnpj (hover + open)</SectionLabel>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '10px', color: t.textTertiary, margin: '0 0 8px', textTransform: 'uppercase' }}>Default</p>
                <Labeled component="DSAvatarCompanyCNPJ" props='initials="SRM"'>
                  <DSAvatarCompanyCNPJ initials="SRM" company="SRM Asset Management" cnpj="12.345.678/0001-99" />
                </Labeled>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Paleta de backgrounds</SectionLabel>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {paletteBgs.map((bg, i) => (
                <Labeled key={i} component="DSAvatar" props={`initials="CM" size="md" bg="${bg}"`}>
                  <DSAvatar initials="CM" size="md" bg={bg} />
                </Labeled>
              ))}
            </div>
          </div>
        </div>
      }
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>{children}</p>
}
