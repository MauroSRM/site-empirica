import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface DSBreadcrumbProps {
  items: BreadcrumbItem[]
  truncated?: boolean
}

export function DSBreadcrumb({ items, truncated = false }: DSBreadcrumbProps) {
  const { tokens: t } = useTheme()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const display = truncated && items.length > 2
    ? [items[0], { label: '···' }, items[items.length - 1]]
    : items

  return (
    <nav aria-label="breadcrumb" style={{ display: 'flex', alignItems: 'center', height: '20px', fontFamily: t.fontFamily }}>
      {display.map((item, i) => {
        const isLast = i === display.length - 1
        const isLink = !isLast && item.label !== '···'
        return (
          <React.Fragment key={i}>
            <span
              onMouseEnter={() => isLink ? setHoveredIdx(i) : undefined}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                fontSize: t.text2Xs,
                fontWeight: isLast ? 500 : 400,
                // WCAG-NEW-01: links usam textSecondary (~4.6:1), ellipsis decorativo mantém textTertiary
                color: isLast ? t.textPrimary : isLink ? t.textSecondary : t.textTertiary,
                cursor: isLink ? 'pointer' : 'default',
                textDecoration: isLink && hoveredIdx === i ? 'underline' : 'none',
                whiteSpace: 'nowrap',
                lineHeight: '20px',
                transition: 'color 0.12s',
              }}
            >
              {item.label}
            </span>
            {!isLast && (
              <ChevronRight size={12} color={t.textTertiary} style={{ marginLeft: t.space1, marginRight: t.space1, flexShrink: 0 }} />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSBreadcrumbSection() {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Trilha de navegação hierárquica com suporte a truncagem para caminhos longos. Indica ao usuário onde ele está na estrutura do produto e permite navegação retroativa."
        whenToUse={['Indicar localização em páginas profundas da hierarquia', 'Topo de DSPageHeader em páginas com múltiplos níveis', 'Navegação retroativa em fluxos de aprovação e formulários']}
        whenNotToUse={['Hierarquias de 1 nível (tela raiz — dispensável)', 'Dentro de modais ou drawers (contexto já indica localização)', 'Substituir tabs de subnavegação (contextos distintos)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Item com link', token: 't.brandPrimary', descricao: 'Cor dos itens clicáveis' },
            { elemento: 'Item atual', token: 't.textPrimary', descricao: 'Cor do item final (não clicável)' },
            { elemento: 'Separador chevron', token: 't.textTertiary', descricao: 'Ícone separador entre níveis' },
            { elemento: 'Hover', token: 't.brandPrimaryHover', descricao: 'Cor ao passar o mouse nos links' },  // D-02: brandPrimaryDark não existe
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'items', tipo: 'BreadcrumbItem[]', default: '—', descricao: 'Array de itens: { label, href? } (obrigatório)' },
            { prop: 'truncated', tipo: 'boolean', default: 'false', descricao: 'Oculta itens intermediários com "..."' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='navigation' com aria-label='Trilha de navegação' · role='list' nos itens"
            keyboard="Tab navega entre links clicáveis · Enter para navegar"
            screenReader="Último item: aria-current='page' · Itens truncados: botão '...' com aria-label='Expandir trilha'"
            contrast="brandPrimary sobre surfacePrimary — verificado · textTertiary para separadores (decorativo)"
            focus="focusRing visível nos links clicáveis"
          /> },
        ]}
      />
      <div>
        <SectionLabel>2 níveis</SectionLabel>
        <Labeled component="DSBreadcrumb" props='items={["Início", "Pagamentos"]}'>
          <DSBreadcrumb items={[{ label: 'Início' }, { label: 'Pagamentos' }]} />
        </Labeled>
      </div>
      <div>
        <SectionLabel>3 níveis</SectionLabel>
        <Labeled component="DSBreadcrumb" props='items={["Início", "Pagamentos", "Importação em lote"]}'>
          <DSBreadcrumb items={[{ label: 'Início' }, { label: 'Pagamentos' }, { label: 'Importação em lote' }]} />
        </Labeled>
      </div>
      <div>
        <SectionLabel>4 níveis</SectionLabel>
        <Labeled component="DSBreadcrumb" props='items={["Início", "Equipe", "Perfis", "Editar perfil"]}'>
          <DSBreadcrumb items={[{ label: 'Início' }, { label: 'Equipe' }, { label: 'Perfis' }, { label: 'Editar perfil' }]} />
        </Labeled>
      </div>
      <div>
        <SectionLabel>Truncado</SectionLabel>
        <Labeled component="DSBreadcrumb" props='items={[...]} truncated'>
          <DSBreadcrumb items={[{ label: 'Início' }, { label: 'Equipe' }, { label: 'Perfis' }, { label: 'Editar perfil' }]} truncated />
        </Labeled>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', fontFamily: t.fontFamily }}>{children}</p>
}
