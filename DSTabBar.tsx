// PROMPT 16 — Tab Bar
import React, { useState } from 'react'
import { Home, CreditCard, BarChart2, User, Bell } from 'lucide-react'
import { t } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

// ─── LINE TABS ─────────────────────────────────────────────────

interface Tab { id: string; label: string; icon?: React.ReactNode; badge?: number | boolean }

interface DSTabBarProps {
  variant: 'line' | 'pill' | 'bottom-nav'
  tabs: Tab[]
  size?: 'sm' | 'md'
  defaultActive?: string
}

export function DSTabBar({ variant, tabs, size = 'md', defaultActive }: DSTabBarProps) {
  const [active, setActive] = useState(defaultActive ?? tabs[0]?.id)

  if (variant === 'line') return <LineTabBar tabs={tabs} active={active} setActive={setActive} size={size} />
  if (variant === 'pill') return <PillTabBar tabs={tabs} active={active} setActive={setActive} size={size} />
  if (variant === 'bottom-nav') return <BottomNavBar tabs={tabs} active={active} setActive={setActive} />
  return null
}

function TabBadge({ badge }: { badge?: number | boolean }) {
  if (!badge) return null
  const isNum = typeof badge === 'number'
  return (
    <div style={{
      position: 'absolute', top: -4, right: isNum ? -8 : -4,
      minWidth: isNum ? 16 : 8, height: isNum ? 16 : 8,
      borderRadius: t.radiusFull,
      backgroundColor: t.feedbackError,
      color: t.textOnBrand,
      fontSize: '10px', fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isNum ? '0 3px' : 0,
    }}>
      {isNum && (badge > 9 ? '9+' : badge)}
    </div>
  )
}

function LineTabBar({ tabs, active, setActive, size }: { tabs: Tab[]; active: string; setActive: (id: string) => void; size: 'sm' | 'md' }) {
  const py = size === 'sm' ? '8px' : '10px'
  const px = size === 'sm' ? '16px' : '20px'
  const fs = size === 'sm' ? t.textSm : t.textMd

  return (
    <div style={{ borderBottom: `2px solid ${t.borderDefault}`, display: 'flex' }}>
      {tabs.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: `${py} ${px}`,
              background: 'none', border: 'none',
              borderBottom: isActive ? `2px solid ${t.brandPrimary}` : '2px solid transparent',
              marginBottom: '-2px',
              color: isActive ? t.textPrimary : t.textSecondary,
              fontWeight: isActive ? 600 : 400,
              fontSize: fs,
              fontFamily: t.fontFamily,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.icon && <span style={{ position: 'relative' }}>{tab.icon}<TabBadge badge={tab.badge} /></span>}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function PillTabBar({ tabs, active, setActive, size }: { tabs: Tab[]; active: string; setActive: (id: string) => void; size: 'sm' | 'md' }) {
  const py = size === 'sm' ? '6px' : '8px'
  const px = size === 'sm' ? '16px' : '20px'
  const fs = size === 'sm' ? t.textSm : t.textMd

  return (
    <div style={{
      display: 'inline-flex',
      backgroundColor: t.surfaceMuted,
      borderRadius: t.radiusXl,
      padding: '4px',
      gap: '4px',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              position: 'relative',
              padding: `${py} ${px}`,
              borderRadius: t.radiusLg,
              border: 'none',
              backgroundColor: isActive ? t.surfaceDefault : 'transparent',
              color: isActive ? t.textPrimary : t.textSecondary,
              fontWeight: isActive ? 600 : 400,
              fontSize: fs,
              fontFamily: t.fontFamily,
              cursor: 'pointer',
              boxShadow: isActive ? t.shadowDropdown : 'none',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
            }}
          >
            {tab.label}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: 3,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 30,
                height: 3,
                borderRadius: t.radiusFull,
                backgroundColor: t.brandAccent,
              }} />
            )}
          </button>
        )
      })}
    </div>
  )
}

function BottomNavBar({ tabs, active, setActive }: { tabs: Tab[]; active: string; setActive: (id: string) => void }) {
  return (
    <div style={{
      width: '100%',
      height: t.bottomNavHeight,
      display: 'flex',
      borderTop: `1px solid ${t.borderDefault}`,
      backgroundColor: t.surfaceDefault,
      boxShadow: t.shadowBottomNav,
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '4px',
              border: 'none', background: 'none', cursor: 'pointer',
              paddingTop: t.space2, paddingBottom: t.space2, paddingLeft: t.space3, paddingRight: t.space3,
              color: isActive ? t.brandPrimary : t.textTertiary,
            }}
          >
            <span style={{ position: 'relative' }}>
              {tab.icon}
              <TabBadge badge={tab.badge} />
            </span>
            <span style={{ fontSize: t.textXs, fontWeight: 600, fontFamily: t.fontFamily }}>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

const lineTabs: Tab[] = [
  { id: 'overview',    label: 'Visão Geral' },
  { id: 'posicoes',    label: 'Posições',    badge: 3 },
  { id: 'historico',   label: 'Histórico' },
  { id: 'documentos',  label: 'Documentos' },
]

const pillTabs: Tab[] = [
  { id: 'mensal',   label: 'Mensal' },
  { id: 'trimestral', label: 'Trimestral' },
  { id: 'anual',    label: 'Anual' },
]

const bottomTabs: Tab[] = [
  { id: 'inicio',   label: 'Início',    icon: <Home size={22} />,        badge: 2 },
  { id: 'fundos',   label: 'Fundos',    icon: <BarChart2 size={22} /> },
  { id: 'conta',    label: 'Conta',     icon: <CreditCard size={22} /> },
  { id: 'alertas',  label: 'Alertas',   icon: <Bell size={22} />,        badge: true },
  { id: 'perfil',   label: 'Perfil',    icon: <User size={22} /> },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '20px 0 8px', fontFamily: t.fontFamily }}>{children}</p>
}

export function DSBottomNavSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: t.fontFamily }}>
      <p style={{ fontSize: '13px', color: t.textSecondary, margin: '0 0 8px', lineHeight: '20px', maxWidth: '640px' }}>
        Barra de navegação inferior para layouts mobile. Exibe ícone + label para cada destino principal do app, com suporte a badges numéricos e indicadores de ponto.
      </p>
      <div style={{ maxWidth: 375, border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusLg, overflow: 'hidden' }}>
        <div style={{ height: 160, backgroundColor: t.surfaceSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', color: t.textTertiary }}>Conteúdo da página</span>
        </div>
        <DSTabBar variant="bottom-nav" tabs={bottomTabs} defaultActive="conta" />
      </div>
      <div style={{ maxWidth: 375, border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusLg, overflow: 'hidden' }}>
        <div style={{ height: 80, backgroundColor: t.brandPrimaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', color: t.brandPrimary }}>Ativo: Alertas com badge</span>
        </div>
        <DSTabBar variant="bottom-nav" tabs={bottomTabs} defaultActive="alertas" />
      </div>
    </div>
  )
}

export function DSTabBarSection() {
  return (
    <DSDocSection
      description="Navegação por abas em 3 variantes: line (subnavegação de página), pill (seletor de visualização) e bottom-nav (barra inferior mobile). Suporta ícones, badges e tamanhos sm/md."
      whenToUse={['Subnavegação entre seções de uma mesma página', 'Alternância de visualização (tabela/gráfico/lista)', 'Barra de navegação principal em layouts mobile']}
      whenNotToUse={['Navegação entre rotas distintas (use NavBar/menu)', 'Mais de 6 itens (use Select ou menu colapsável)', 'Hierarquia de navegação multinível (use Breadcrumb)']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Aba ativa (line)', token: 't.brandPrimary', descricao: 'Indicador inferior e texto da aba ativa' },
          { elemento: 'Aba inativa', token: 't.textSecondary', descricao: 'Texto e ícone de abas inativas' },
          { elemento: 'Fundo pill ativo', token: 't.brandPrimary', descricao: 'Fundo do pill selecionado' },
          { elemento: 'Texto pill ativo', token: 't.textOnBrand', descricao: 'Texto sobre fundo de marca' },
          { elemento: 'Separador', token: 't.borderDefault', descricao: 'Linha base da variante line' },
          { elemento: 'Badge', token: 't.feedbackError', descricao: 'Fundo do indicador de contagem' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'line' | 'pill' | 'bottom-nav'", default: '—', descricao: 'Estilo visual da tab bar (obrigatório)' },
          { prop: 'tabs', tipo: 'Tab[]', default: '—', descricao: 'Array de abas com id, label, icon?, badge? (obrigatório)' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Tamanho dos itens' },
          { prop: 'defaultActive', tipo: 'string', default: 'primeiro item', descricao: 'ID da aba ativa por padrão' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='tablist' · cada aba: role='tab' · painéis: role='tabpanel'"
          keyboard="Tab/Shift+Tab entre tablist e conteúdo · Setas ← → alternam abas dentro do tablist"
          screenReader="aria-selected='true/false' em cada aba · Badge: aria-label='X notificações' · Aba ativa indicada por estado"
          contrast="brandPrimary sobre branco verificado · textOnBrand sobre brandPrimary verificado"
          focus="focusRing visível em cada aba · ativa aba ao focar com teclado"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: t.fontFamily }}>
          <SectionLabel>Line — MD com badge</SectionLabel>
          <Labeled component="DSTabBar" props='variant="line" size="md"'>
            <DSTabBar variant="line" tabs={lineTabs} size="md" defaultActive="posicoes" />
          </Labeled>

          <SectionLabel>Line — SM</SectionLabel>
          <Labeled component="DSTabBar" props='variant="line" size="sm"'>
            <DSTabBar variant="line" tabs={lineTabs} size="sm" defaultActive="overview" />
          </Labeled>

          <SectionLabel>Pill — 3 tabs</SectionLabel>
          <Labeled component="DSTabBar" props='variant="pill" size="md"'>
            <DSTabBar variant="pill" tabs={pillTabs} defaultActive="mensal" />
          </Labeled>

          <SectionLabel>Bottom Navigation (mobile)</SectionLabel>
          <Labeled component="DSBottomNav" props='variant="bottom-nav"'>
            <div style={{ maxWidth: 375, border: `1px solid ${t.borderDefault}`, borderRadius: t.radiusLg, overflow: 'hidden' }}>
              <div style={{ height: 120, backgroundColor: t.surfaceSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', color: t.textTertiary }}>Conteúdo da página</span>
              </div>
              <DSTabBar variant="bottom-nav" tabs={bottomTabs} defaultActive="conta" />
            </div>
          </Labeled>
        </div>
      }
    />
  )
}
