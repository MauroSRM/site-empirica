import React, { useState } from 'react'
import { Briefcase, TrendingUp, Smartphone, Building2, ChevronRight } from 'lucide-react'
import { t } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

const menuData = [
  {
    key: 'gestao',
    header: 'Gestão de Recursos',
    icon: Briefcase,
    items: [
      { title: 'Fundos de Renda Fixa',  desc: 'Rentabilidade previsível atrelada ao CDI e índices de inflação.' },
      { title: 'Fundos Multimercado',   desc: 'Diversificação entre renda fixa, câmbio e variável.' },
      { title: 'Fundos de Ações',       desc: 'Participação no mercado acionário com gestão ativa.' },
      { title: 'FIDC',                  desc: 'Fundo de Investimentos em Direitos Creditórios.' },
    ],
  },
  {
    key: 'capitais',
    header: 'Mercado de Capitais',
    icon: TrendingUp,
    items: [
      { title: 'Securitização',  desc: 'Transformação de recebíveis em ativos negociáveis.' },
      { title: 'CRI & CRA',     desc: 'Certificados de recebíveis imobiliários e do agronegócio.' },
      { title: 'Debêntures',    desc: 'Títulos de dívida corporativa com diversas estruturas.' },
      { title: 'FIDC',          desc: 'Soluções estruturadas para cessão de crédito.' },
    ],
  },
  {
    key: 'plataforma',
    header: 'Plataforma Digital',
    icon: Smartphone,
    items: [
      { title: 'HB Digital',   desc: 'Gestão completa da sua carteira pelo celular ou web.' },
      { title: 'HB Empresas',  desc: 'Soluções financeiras para pessoas jurídicas.' },
      { title: 'HB Invest',    desc: 'Plataforma de investimentos para gestores e advisors.' },
    ],
  },
  {
    key: 'institucional',
    header: 'Institucional',
    icon: Building2,
    items: [
      { title: 'Sobre a SRM',    desc: 'Nossa história, missão e valores.' },
      { title: 'Notícias',       desc: 'Atualizações do mercado e da SRM.' },
      { title: 'Compliance',     desc: 'Política de compliance e documentos regulatórios.' },
      { title: 'Fale Conosco',  desc: 'Canais de atendimento ao cliente.' },
    ],
  },
]

export function MegaMenu({ onClose }: { onClose?: () => void }) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: t.surfaceDefault,
        boxShadow: t.shadowDropdown,
        paddingTop: t.space8,
        paddingBottom: t.space8,
        paddingLeft: t.paddingPage,
        paddingRight: t.paddingPage,
        fontFamily: t.fontFamily,
        boxSizing: 'border-box',
      }}
    >
      {/* Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
        {menuData.map((col, colIndex) => (
          <div
            key={col.key}
            style={{
              padding: colIndex === 0 ? '0 32px 0 0' : '0 32px',
              borderLeft: colIndex > 0 ? `1px solid ${t.borderSubtle}` : 'none',
            }}
          >
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              {/* W-02: brandAccent ok for icon (no adjacent text), but NOT for text */}
              <col.icon size={16} color={t.brandAccent} />
              <span
                style={{
                  fontSize: t.textXs,
                  fontWeight: 700,
                  // W-02: textSecondary (~4.6:1) replaces brandAccent (~2.5:1) — WCAG AA
                  color: t.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                {col.header}
              </span>
            </div>

            {/* Links */}
            <div>
              {col.items.map((item, i) => {
                const itemKey = `${col.key}-${i}`
                const isHovered = hoveredItem === itemKey
                const isLast = i === col.items.length - 1

                return (
                  <div
                    key={i}
                    style={{
                      padding: '10px 0',
                      borderBottom: isLast ? 'none' : `1px solid ${t.borderDefault}`,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHoveredItem(itemKey)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span
                        style={{
                          fontSize: t.textMd,
                          fontWeight: 600,
                          color: isHovered ? t.brandPrimary : t.textPrimary,
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {item.title}
                      </span>
                      {isHovered && <ChevronRight size={12} color={t.brandPrimary} />}
                    </div>
                    <p
                      style={{
                        fontSize: t.textSm,
                        color: t.textSecondary,
                        margin: '2px 0 0',
                        lineHeight: '16px',
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer bar */}
      <div
        style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid ${t.borderDefault}`,
          backgroundColor: t.surfaceSubtle,
          marginLeft: '-56px',
          marginRight: '-56px',
          marginBottom: '-32px',
          padding: '16px 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            // W-02: brandPrimary (~5.9:1) replaces brandAccent (~2.5:1) — WCAG AA
            color: t.brandPrimary,
            fontFamily: t.fontFamily,
          }}
        >
          → Ver todos os fundos
        </button>
        <span style={{ fontSize: '12px', color: t.textSecondary }}>
          Soluções personalizadas para cada perfil de investidor
        </span>
      </div>
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function MegaMenuSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <DSDocSection
        description="Menu de navegação de largura completa com categorias, sub-itens e ícones. Acionado pelo botão de apps no NavBar. Organiza funcionalidades em grade de 4 colunas com agrupamento por módulo."
        whenToUse={['Acesso às funcionalidades do produto a partir do NavBar', 'Navegação entre módulos (Gestão, Capitais, Plataforma)', 'Exposição de todas as opções do produto de forma estruturada']}
        whenNotToUse={['Menu de contexto em linha (use dropdown/select)', 'Ações rápidas de uma tela (use toolbar)', 'Subnavegação dentro de módulo (use DSTabBar ou sidebar)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Fundo', token: 't.surfaceDefault', descricao: 'Background do menu' },  // D-01: surfacePrimary não existe
            { elemento: 'Borda', token: 't.borderDefault', descricao: 'Contorno e separadores internos' },
            { elemento: 'Header da categoria', token: 't.textSecondary', descricao: 'Cor do título da categoria (W-02: WCAG AA)' },
            { elemento: 'Item hover', token: 't.surfaceSubtle', descricao: 'Fundo ao passar o mouse no item' },
            { elemento: 'Ícone', token: 't.brandAccent', descricao: 'Cor dos ícones de categoria (sem texto adjacente)' },
            { elemento: 'Sombra', token: 't.shadowLg', descricao: 'Elevação do menu sobre o conteúdo' },
            { elemento: 'Radius', token: 't.cardRadius', descricao: 'Arredondamento do container' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'activeCategory', tipo: 'string', default: 'undefined', descricao: 'Categoria inicial expandida' },
            { prop: 'onItemClick', tipo: '(item) => void', default: 'undefined', descricao: 'Callback ao selecionar um item do menu' },
            { prop: 'onClose', tipo: '() => void', default: 'undefined', descricao: 'Callback para fechar o MegaMenu' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='navigation' com aria-label='Menu principal' · role='menu' nos grupos de itens"
            keyboard="Esc fecha o menu · Tab navega entre itens · Setas ↑↓ dentro de cada coluna"
            screenReader="Categorias com role='heading' · Itens com role='menuitem' · Estado expandido com aria-expanded"
            contrast="brandPrimary sobre surfacePrimary verificado · textSecondary sobre surfaceSubtle verificado"
            focus="focusRing visível em cada item · foco retorna ao botão de abertura ao fechar"
          /> },
        ]}
      />
      <div>
        <SectionLabel>MegaMenu — largura completa (4 colunas)</SectionLabel>
        <div
          style={{
            border: `1px solid ${t.borderDefault}`,
            borderRadius: t.cardRadius,
            overflow: 'hidden',
          }}
        >
          <Labeled component="MegaMenu" props="">
            <MegaMenu />
          </Labeled>
        </div>
      </div>

      <div style={{ backgroundColor: t.surfaceMuted, borderRadius: t.cardRadius, padding: '16px' }}>
        <SectionLabel>Especificações</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[
            'Width: 100% (max 1440px)',
            'Background: surface/default',
            'Box-shadow: 0 12px 16px rgba(0,0,0,0.1)',
            'Padding: 32px 56px',
            'Grid: 4 colunas iguais',
            'Header texto: textSecondary (W-02: WCAG AA) · ícone: brandAccent',
            'Header font: Bold 10px uppercase ls:0.8px',
            'Link hover: cor brand/primary',
            'Footer bg: surface/subtle',
            'Separador colunas: rgba(229,231,235,0.7)',
          ].map((spec, i) => (
            <p key={i} style={{ fontSize: '12px', color: t.textSecondary, fontFamily: t.fontFamily, margin: '2px 0' }}>
              • {spec}
            </p>
          ))}
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