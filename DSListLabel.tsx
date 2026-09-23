import React from 'react'
import { ArrowDownLeft, ArrowUpRight, Calendar, Percent, Hash, User } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export interface DSListLabelItem {
  label: string
  value: string
  valueHighlight?: boolean
  valueColor?: string
  icon?: React.ReactNode
}

interface DSListLabelGroupProps {
  title?: string
  items: DSListLabelItem[]
  card?: boolean
  separator?: boolean
}

export function DSListLabelGroup({ title, items, card = false, separator = true }: DSListLabelGroupProps) {
  const { tokens: t } = useTheme()

  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: t.fontFamily }}>
      {title && (
        <p style={{
          fontSize: '11px',
          fontWeight: 700,
          color: t.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: '0 0 12px',
        }}>
          {title}
        </p>
      )}
      {items.map((item, i) => (
        <div key={i}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: t.space3,
            paddingBottom: t.space3,
            // Padding V arredondado 10→12px por ausência de token intermediário
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
              {item.icon && (
                <span style={{ color: t.textTertiary, flexShrink: 0, display: 'flex' }}>
                  {item.icon}
                </span>
              )}
              <span style={{
                fontSize: t.textMd,
                color: t.textSecondary,
                fontFamily: t.fontFamily,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            </div>
            <span style={{
              fontSize: t.textMd,
              fontWeight: item.valueHighlight ? 600 : 500,
              color: item.valueColor ?? t.textPrimary,
              fontFamily: t.fontFamily,
              flexShrink: 0,
            }}>
              {item.value}
            </span>
          </div>
          {separator && i < items.length - 1 && (
            <div style={{ height: '1px', backgroundColor: t.borderDefault }} />
          )}
        </div>
      ))}
    </div>
  )

  if (!card) return inner

  return (
    <div style={{
      backgroundColor: t.surfaceDefault,
      borderRadius: t.cardRadius,
      border: `1px solid ${t.borderDefault}`,
      paddingTop: t.space5,
      paddingBottom: t.space5,
      paddingLeft: t.space6,
      paddingRight: t.space6,
      boxShadow: t.shadowCard,
    }}>
      {inner}
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSListLabelSection() {
  const { tokens: t } = useTheme()

  const transacaoItems: DSListLabelItem[] = [
    { label: 'Tipo de operação', value: 'Transferência Pix' },
    { label: 'Favorecido', value: 'João da Silva' },
    { label: 'CPF', value: '•••.•••.123-45', icon: <User size={14} /> },
    { label: 'Banco destino', value: 'Itaú Unibanco' },
    { label: 'Data', value: '15/05/2026', icon: <Calendar size={14} /> },
    { label: 'Valor', value: 'R$ 1.250,00', valueHighlight: true, valueColor: t.feedbackSuccess },
  ]

  const cdbItems: DSListLabelItem[] = [
    { label: 'Produto', value: 'CDB Pós-fixado' },
    { label: 'Rentabilidade', value: '120% CDI', valueHighlight: true, icon: <Percent size={14} /> },
    { label: 'Prazo', value: '360 dias', icon: <Calendar size={14} /> },
    { label: 'Aplicação mínima', value: 'R$ 1.000,00' },
    { label: 'Resgate mínimo', value: 'R$ 500,00' },
    { label: 'Protocolo', value: '#4829-TXN', icon: <Hash size={14} /> },
  ]

  const movItems: DSListLabelItem[] = [
    { label: 'Entrada', value: '+ R$ 8.420,00', valueHighlight: true, valueColor: t.feedbackSuccess, icon: <ArrowDownLeft size={14} /> },
    { label: 'Saída', value: '– R$ 3.100,00', valueHighlight: true, valueColor: t.feedbackError, icon: <ArrowUpRight size={14} /> },
    { label: 'Saldo líquido', value: 'R$ 5.320,00', valueHighlight: true },
  ]

  return (
    <DSDocSection
      description="Lista de pares label/valor para exibição de dados estruturados. Usado em resumos de transação, detalhes de beneficiário e fichas de operação dentro de Drawers e Modais."
      whenToUse={['Resumo de transação em drawer de confirmação', 'Ficha de detalhes de beneficiário ou operação', 'Visualização de dados read-only em cards de informação']}
      whenNotToUse={['Edição de dados (use formulário)', 'Listas longas sem agrupamento (use tabela)', 'Dados sem label associado (use parágrafo simples)']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: t.fontFamily }}>
          <div>
            <SectionLabel>Card de resumo — Transação Pix</SectionLabel>
            <div style={{ maxWidth: '420px' }}>
              <Labeled component="DSListLabelGroup" props='title="Detalhes da operação" items={...} card'>
                <DSListLabelGroup title="Detalhes da operação" items={transacaoItems} card />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Card de resumo — Título CDB</SectionLabel>
            <div style={{ maxWidth: '420px' }}>
              <Labeled component="DSListLabelGroup" props='title="Especificações" items={...} card'>
                <DSListLabelGroup title="Especificações" items={cdbItems} card />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Sem card — inline (com separador)</SectionLabel>
            <div style={{ maxWidth: '360px', borderTop: `1px solid ${t.borderDefault}` }}>
              <Labeled component="DSListLabelGroup" props='title="Movimentações do período" items={...}'>
                <DSListLabelGroup title="Movimentações do período" items={movItems} />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Sem separador</SectionLabel>
            <div style={{ maxWidth: '360px' }}>
              <Labeled component="DSListLabelGroup" props='items={...} separator={false} card'>
                <DSListLabelGroup items={movItems} separator={false} card />
              </Labeled>
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Label', token: 't.textSecondary', descricao: 'Texto do rótulo do campo' },
          { elemento: 'Valor', token: 't.textPrimary', descricao: 'Texto do valor padrão' },
          { elemento: 'Valor highlight', token: 'customizável via valueColor', descricao: 'Valor com cor semântica (ex: verde para crédito)' },
          { elemento: 'Separador', token: 't.borderDefault', descricao: 'Linha entre itens (quando separator=true)' },
          { elemento: 'Fundo card', token: 't.surfaceDefault', descricao: 'Fundo quando card=true' },
          { elemento: 'Radius card', token: 't.radiusLg', descricao: 'Arredondamento do card' },
          { elemento: 'Ícone label', token: 't.textTertiary', descricao: 'Cor do ícone ao lado do label' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'items', tipo: 'DSListLabelItem[]', default: '—', descricao: 'Array de pares label/valor (obrigatório)' },
          { prop: 'title', tipo: 'string', default: 'undefined', descricao: 'Título do grupo' },
          { prop: 'card', tipo: 'boolean', default: 'false', descricao: 'Exibe com fundo e borda de card' },
          { prop: 'separator', tipo: 'boolean', default: 'false', descricao: 'Exibe linha separadora entre itens' },
          { prop: 'item.valueHighlight', tipo: 'boolean', default: 'false', descricao: 'Aplica destaque visual ao valor' },
          { prop: 'item.valueColor', tipo: 'string', default: 't.textPrimary', descricao: 'Cor customizada do valor' },
          { prop: 'item.icon', tipo: 'ReactNode', default: 'undefined', descricao: 'Ícone ao lado do label' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="Semântica de lista implícita — considerar dl/dt/dd para pares label/valor"
          keyboard="Não interativo — não recebe foco"
          screenReader="Cada par deve ser lido em sequência (label seguido de valor) · Ícones decorativos: aria-hidden='true'"
          contrast="textSecondary sobre surfacePrimary e surfaceSubtle — verificado"
          focus="Sem foco — componente puramente de exibição"
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
