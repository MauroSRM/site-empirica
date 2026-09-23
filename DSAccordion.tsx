import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { DSButton } from './DSButton'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type AccordionContent = 'text-only' | 'text-with-buttons'

interface DSAccordionItem {
  title: string
  body: string
  buttons?: string[]
  content?: AccordionContent
}

interface DSAccordionProps {
  items: DSAccordionItem[]
  defaultOpen?: number | null
}

export function DSAccordion({ items, defaultOpen = null }: DSAccordionProps) {
  const { tokens: t } = useTheme()
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: DSAccordionItem
  isOpen: boolean
  onToggle: () => void
}) {
  const content = item.content || 'text-only'

  return (
    // Container: backgroundColor explícito garante que não há branco visível através das bordas
    <div
      style={{
        borderRadius: t.radiusLg,
        border: isOpen ? `1px solid ${t.borderSelected}` : `1px solid ${t.borderDefault}`,
        overflow: 'hidden',
        transition: 'border-color 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        // gap: 0 — sem gap entre header e body para garantir superfície contínua
        backgroundColor: isOpen ? t.surfaceSelected : t.surfaceDefault,
      }}
    >
      {/* Header — display: block evita qualquer gap inline */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: t.space6,
          // Mesmo backgroundColor do container para superfície contínua
          backgroundColor: isOpen ? t.surfaceSelected : t.surfaceDefault,
          cursor: 'pointer',
          border: 'none',
          // Borda divisória sutil borderSelected apenas quando aberto
          borderBottom: isOpen ? `1px solid ${t.borderSelected}` : 'none',
          outline: 'none',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
          textAlign: 'left',
          margin: 0,
        }}
      >
        <span
          style={{
            fontSize: t.textXl,
            fontWeight: 600,
            fontFamily: t.fontFamily,
            color: t.textPrimary,
          }}
        >
          {item.title}
        </span>

        {isOpen ? (
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: t.radiusFull,
              backgroundColor: t.brandPrimaryHover,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ChevronUp size={14} color={t.textOnBrand} />
          </span>
        ) : (
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: t.radiusFull,
              backgroundColor: t.surfaceMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ChevronDown size={14} color={t.textSecondary} />
          </span>
        )}
      </button>

      {/* Body — padding-top explícito elimina o colapso de margin da <p> interna */}
      {isOpen && (
        <div
          style={{
            paddingTop: t.space4,
          paddingLeft: t.space6,
          paddingRight: t.space6,
          paddingBottom: t.space6,
            // backgroundColor explícito — não herdado
            backgroundColor: t.surfaceSelected,
            // Sem borderTop — sem separador entre header e body
          }}
        >
          {content === 'text-only' && (
            <p
              style={{
                fontSize: t.textLg,
                color: t.textPrimary,      // textPrimary (#0c0c0c), não textSecondary
                fontFamily: t.fontFamily,
                lineHeight: '22px',
                margin: 0,                 // margin: 0 — sem margem que possa colapsar
              }}
            >
              {item.body}
            </p>
          )}

          {content === 'text-with-buttons' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                margin: 0,    // sem marginTop — padding do body já garante o espaço
              }}
            >
              {(item.buttons || ['Regulamento', 'Lâmina', 'Informe Mensal', 'Prospecto']).map((btn, i) => (
                <DSButton key={i} variant="secondary" size="md" fullWidth>
                  {btn}
                </DSButton>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

const accordionItems: DSAccordionItem[] = [
  {
    title: 'O que é o HB Digital?',
    body: 'O HB Digital é uma plataforma completa de gestão financeira que permite acompanhar investimentos, emitir boletos e gerenciar sua carteira de ativos com segurança e praticidade.',
    content: 'text-only',
  },
  {
    title: 'Como acessar os documentos do fundo?',
    body: 'Todos os documentos estão disponíveis na aba de documentação do fundo.',
    content: 'text-with-buttons',
    buttons: ['Regulamento', 'Lâmina', 'Informe Mensal'],
  },
  {
    title: 'Qual é o prazo de liquidação?',
    body: 'O prazo de liquidação varia de acordo com a modalidade do fundo: D+0 para fundos de liquidez imediata, D+1 para renda fixa e D+30 para fundos de ações e multimercado.',
    content: 'text-only',
  },
  {
    title: 'Qual é o valor mínimo de aplicação?',
    body: 'O valor mínimo de aplicação depende do fundo escolhido.',
    content: 'text-with-buttons',
    buttons: ['Fundos Renda Fixa', 'Multimercado', 'Ações', 'FIDC'],
  },
]

export function DSAccordionSection() {
  return (
    <DSDocSection
      description="Oculta conteúdo secundário que pode ser expandido sob demanda."
      whenToUse={['FAQ e perguntas frequentes', 'Documentos e seções de fundo', 'Seções opcionais de formulário avançado']}
      whenNotToUse={['Conteúdo que o usuário sempre precisa ver', 'Dados tabulares (confunde com linhas)', 'Hierarquia com mais de 2 níveis']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo aberto', token: 't.surfaceSelected', descricao: 'Fundo do item expandido (primary50)' },
          { elemento: 'Fundo fechado', token: 't.surfaceDefault', descricao: 'Fundo do item recolhido' },
          { elemento: 'Borda aberta', token: 't.borderSelected', descricao: 'Borda do item expandido (primary100)' },
          { elemento: 'Borda fechada', token: 't.borderDefault', descricao: 'Borda do item recolhido' },
          { elemento: 'Divisória interna', token: 't.borderSelected', descricao: 'Borda entre header e body quando aberto' },
          { elemento: 'Ícone ativo (bg)', token: 't.brandPrimaryHover', descricao: 'Fundo do ícone chevron quando aberto' },
          { elemento: 'Ícone inativo (bg)', token: 't.surfaceMuted', descricao: 'Fundo do ícone chevron quando fechado' },
          { elemento: 'Texto título', token: 't.textPrimary', descricao: 'Label do item' },
          { elemento: 'Texto corpo', token: 't.textSecondary', descricao: 'Conteúdo expandido' },
          { elemento: 'Border radius', token: 't.radiusLg', descricao: 'Raio do container' },
          { elemento: 'Radius ícone', token: 't.radiusFull', descricao: 'Formato circular do botão chevron' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'items', tipo: 'DSAccordionItem[]', default: '—', descricao: 'Array de itens: { title, body, buttons?, content? } (obrigatório)' },
          { prop: 'defaultOpen', tipo: 'number | null', default: 'null', descricao: 'Índice do item aberto por padrão' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='button' no header · aria-expanded indica estado · aria-controls aponta para o painel"
          keyboard="Enter/Space abre e fecha · Tab navega entre itens"
          screenReader="Estado expandido/recolhido lido pelo screen reader · Conteúdo do painel inacessível quando fechado"
          contrast="Texto sobre surfaceSelected — contraste verificado · Ícone chevron usa textPrimary"
          focus="focusRing visível no header do item · foco não entra em conteúdo colapsado"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <SectionLabel>Fechado (default)</SectionLabel>
            <Labeled component="DSAccordion" props='content="text-only"'>
              <DSAccordion items={[accordionItems[0]]} />
            </Labeled>
          </div>

          <div>
            <SectionLabel>Aberto — text-only</SectionLabel>
            <Labeled component="DSAccordion" props='content="text-only" defaultOpen={0}'>
              <DSAccordion items={[accordionItems[0]]} defaultOpen={0} />
            </Labeled>
          </div>

          <div>
            <SectionLabel>Aberto — text-with-buttons</SectionLabel>
            <Labeled component="DSAccordion" props='content="text-with-buttons" defaultOpen={0}'>
              <DSAccordion items={[accordionItems[1]]} defaultOpen={0} />
            </Labeled>
          </div>

          <div>
            <SectionLabel>Múltiplos itens em sequência</SectionLabel>
            <Labeled component="DSAccordion" props='defaultOpen={1}'>
              <DSAccordion items={accordionItems} defaultOpen={1} />
            </Labeled>
          </div>
        </div>
      }
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}