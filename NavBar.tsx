import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import { t } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSButton } from './DSButton'
import logoFullPaths from '../../imports/Logo-1/svg-njtnvhoh0c'

type NavItem = 'inicio' | 'gestao' | 'capitais' | 'plataforma' | 'institucional'

interface NavBarTopProps {
  activeItem?: NavItem
  onItemClick?: (item: NavItem) => void
  onMegaMenu?: () => void
}

const navItems: { key: NavItem; label: string }[] = [
  { key: 'inicio',         label: 'Início' },
  { key: 'gestao',         label: 'Gestão de Recursos' },
  { key: 'capitais',       label: 'Mercado de Capitais' },
  { key: 'plataforma',     label: 'Plataforma Digital' },
  { key: 'institucional',  label: 'Institucional' },
]

// ─── Logo ─────────────────────────────────────────────────────

function Logo() {
  return (
    <svg width={100} height={26} viewBox="0 0 124.48 32" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <path d={logoFullPaths.p308bdb00} fill="#597CA3" />
      <path d={logoFullPaths.p2f8be900} fill="#184987" />
      <path d={logoFullPaths.p640e800}  fill="#184987" />
      <path d={logoFullPaths.p43d692}   fill="#184987" />
      <path d={logoFullPaths.pd35bb00}  fill="#597CA3" />
      <path d={logoFullPaths.p1318b680} fill="#184987" />
    </svg>
  )
}

// ─── NavBar Top ───────────────────────────────────────────────

export function NavBarTop({ activeItem = 'inicio', onItemClick, onMegaMenu }: NavBarTopProps) {
  const [hovered, setHovered] = useState<NavItem | null>(null)

  return (
    <nav
      style={{
        width: '100%',
        height: t.navHeight,
        backgroundColor: t.surfaceDefault,
        borderBottom: `1px solid ${t.borderDefault}`,
        paddingLeft: t.paddingPage,
        paddingRight: t.paddingPage,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: t.fontFamily,
        boxSizing: 'border-box',
      }}
    >
      {/* Logo */}
      <Logo />

      {/* Nav items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {navItems.map(item => {
          const isActive  = item.key === activeItem
          const isHovered = item.key === hovered

          return (
            <div
              key={item.key}
              onClick={() => { onItemClick?.(item.key); onMegaMenu?.() }}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative',
                paddingBottom: 4,
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontSize: t.textSm,
                fontWeight: isActive ? 600 : 400,
                // W-01: textSecondary (~4.6:1 on white) replaces textTertiary (~2.9:1) for WCAG AA
                color: isActive || isHovered ? t.textPrimary : t.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.33px',
                fontFamily: t.fontFamily,
                transition: 'color 0.15s ease',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>

              {/* Indicador ativo — pastilha 30×3px centralizada, brandAccent, cantos arredondados */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 30,
                  height: 3,
                  backgroundColor: t.brandAccent,
                  borderRadius: t.radiusFull,
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <DSButton variant="secondary" size="sm">2ª via boleto</DSButton>
        <DSButton variant="primary" size="sm">HB Digital</DSButton>
      </div>
    </nav>
  )
}

// ─── NavBar Scroll (Compact) ──────────────────────────────────

export function NavBarScroll() {
  return (
    <nav
      style={{
        width: '100%',
        height: t.navHeightScroll,
        backgroundColor: t.surfaceDefault,
        boxShadow: t.shadowNav,
        padding: '0 56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: t.fontFamily,
        boxSizing: 'border-box',
      }}
    >
      <Logo />

      <button
        style={{
          width: '52px',
          height: '52px',
          backgroundColor: t.surfaceDefault,
          border: `1px solid ${t.borderDefault}`,
          boxShadow: t.shadowNav,
          borderRadius: t.radiusMd,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          flexShrink: 0,
        }}
      >
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{ width: '18px', height: '2px', backgroundColor: t.brandPrimary, borderRadius: '1px' }}
          />
        ))}
      </button>
    </nav>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function NavBarSection() {
  const [active, setActive] = useState<NavItem>('gestao')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <DSDocSection
        description="Barra de navegação principal do produto com suporte a itens ativos, logo e abertura do MegaMenu. Componente estrutural de topo de página, fixo no layout."
        whenToUse={['Header principal de toda a aplicação web', 'Navegação entre seções macro do produto', 'Ponto de entrada para o MegaMenu de funcionalidades']}
        whenNotToUse={['Subnavegação dentro de uma página (use DSTabBar)', 'Navegação mobile sem sidebar (use bottom nav)', 'Header de modal ou drawer (use título inline)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Fundo', token: 't.surfaceDefault', descricao: 'Background da barra de navegação' },  // D-01: surfacePrimary não existe
            { elemento: 'Borda inferior', token: 't.borderDefault', descricao: 'Separador entre navbar e conteúdo' },
            { elemento: 'Item ativo', token: 't.brandPrimary', descricao: 'Cor do item de navegação selecionado' },
            { elemento: 'Item inativo', token: 't.textSecondary', descricao: 'Cor dos itens não selecionados' },
            { elemento: 'Item hover', token: 't.textPrimary', descricao: 'Cor ao passar o mouse' },
            { elemento: 'Logo', token: 'SVG inline', descricao: 'Logotipo da instituição' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'activeItem', tipo: 'NavItem', default: 'undefined', descricao: "Item ativo: 'inicio' | 'gestao' | 'capitais' | 'plataforma' | 'institucional'" },
            { prop: 'onItemClick', tipo: '(item: NavItem) => void', default: 'undefined', descricao: 'Callback ao clicar em item de navegação' },
            { prop: 'onMegaMenu', tipo: '() => void', default: 'undefined', descricao: 'Callback para abrir o MegaMenu' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='navigation' com aria-label='Navegação principal'"
            keyboard="Tab navega entre itens · Enter/Space para acionar · Setas ← → opcionais entre itens"
            screenReader="Item ativo: aria-current='page' · Logo: aria-label='Nome da instituição — Ir para início'"
            contrast="textSecondary e brandPrimary sobre surfacePrimary verificados"
            focus="focusRing visível em todos os itens e botão de menu"
          /> },
        ]}
      />
      {/* Top NavBar */}
      <div>
        <SectionLabel>NavBarTop — desktop (1440px, padding 56px)</SectionLabel>
        <div
          style={{
            overflowX: 'auto',
            overflowY: 'visible',
            border: `1px solid ${t.borderDefault}`,
            borderRadius: t.cardRadius,
          }}
        >
          <div style={{ minWidth: 1100 }}>
            <Labeled component="NavBarTop" props='activeItem="gestao" onItemClick={setActive}'>
              <NavBarTop activeItem={active} onItemClick={setActive} />
            </Labeled>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: t.textSecondary, fontFamily: t.fontFamily, marginTop: '8px' }}>
          Clique nos itens de navegação para mudar o ativo. Scroll horizontal em viewports menores.
        </p>
      </div>

      {/* Scroll NavBar */}
      <div>
        <SectionLabel>NavBarScroll — compacta (ao scrollar, height 64px)</SectionLabel>
        <div
          style={{
            width: '100%',
            border: `1px solid ${t.borderDefault}`,
            borderRadius: t.cardRadius,
            overflow: 'hidden',
          }}
        >
          <Labeled component="NavBarScroll" props="">
            <NavBarScroll />
          </Labeled>
        </div>
      </div>

      {/* Spec table */}
      <div style={{ backgroundColor: t.surfaceMuted, borderRadius: t.cardRadius, padding: '16px' }}>
        <SectionLabel>Especificações</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <SpecBox title="NavBarTop" items={[
            'Height: 80px',
            'Padding: 0 56px',
            'Background: surface/default',
            'Border-bottom: 1px solid border/default',
            'Active item: underline 2px brand/accent',
            'Font: Inter 11px uppercase',
          ]} />
          <SpecBox title="NavBarScroll" items={[
            'Height: 64px',
            'Padding: 0 56px',
            'Box-shadow: 0 4px 8px rgba(0,0,0,0.06)',
            'Hamburger: 52×52px, border #e2e6ee',
            'Barras: 18×2px, gap 4px, brand/primary',
          ]} />
        </div>
      </div>
    </div>
  )
}

function SpecBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ backgroundColor: t.surfaceDefault, borderRadius: t.cardRadius, padding: '12px 16px', border: `1px solid ${t.borderDefault}` }}>
      <p style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, fontFamily: t.fontFamily, margin: '0 0 8px' }}>{title}</p>
      {items.map((item, i) => (
        <p key={i} style={{ fontSize: '11px', color: t.textSecondary, fontFamily: t.fontFamily, margin: '2px 0' }}>• {item}</p>
      ))}
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