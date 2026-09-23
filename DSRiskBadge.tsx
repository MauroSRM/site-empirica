import React from 'react'
import { DSTag, TagVariant } from './DSTag'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

export type RiskLevel = 'high' | 'medium' | 'low' | 'unknown'

interface DSRiskBadgeProps {
  level: RiskLevel
  label: string
}

const levelToVariant: Record<RiskLevel, TagVariant> = {
  high:    'error',
  medium:  'warning',
  low:     'success',
  unknown: 'neutral',
}

export function DSRiskBadge({ level, label }: DSRiskBadgeProps) {
  return <DSTag variant={levelToVariant[level]} size="sm">{label}</DSTag>
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSRiskBadgeSection() {
  return (
    <DSDocSection
      description="Indica nível de risco de uma transação ou análise. Wrapper fino sobre DSTag."
      whenToUse={['Fila de compliance PLD', 'Score de risco de transação', 'Classificação de análise de crédito']}
      whenNotToUse={['Status genérico de entidade (use DSTag diretamente)', 'Risco de produto financeiro (contexto diferente)', 'Label sem análise real por trás']}
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'high → variante', token: 't.feedbackErrorBg / t.feedbackError', descricao: 'Mapeado para DSTag error' },
          { elemento: 'medium → variante', token: 't.feedbackWarningBg / t.feedbackWarning', descricao: 'Mapeado para DSTag warning' },
          { elemento: 'low → variante', token: 't.feedbackSuccessBg / t.feedbackSuccess', descricao: 'Mapeado para DSTag success' },
          { elemento: 'unknown → variante', token: 't.tagNeutralBg / t.tagNeutralColor', descricao: 'Mapeado para DSTag neutral' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'level', tipo: "'high' | 'medium' | 'low' | 'unknown'", default: '—', descricao: 'Nível de risco (obrigatório)' },
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Texto exibido na tag (obrigatório)' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="Herda comportamento do DSTag — sem role semântico adicional"
          keyboard="Não interativo — não recebe foco"
          screenReader="Texto 'ALTO RISCO', 'RISCO MÉDIO', etc. é lido diretamente · Para contexto crítico, adicionar aria-label ao container pai"
          contrast="Herda contraste verificado do DSTag (error/warning/success/neutral)"
          focus="Não focável"
        /> },
      ]}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Labeled component="DSRiskBadge" props='level="high"'>
            <DSRiskBadge level="high"    label="ALTO RISCO · 87% acima da média" />
          </Labeled>
          <Labeled component="DSRiskBadge" props='level="medium"'>
            <DSRiskBadge level="medium"  label="RISCO MÉDIO · 3 anomalias" />
          </Labeled>
          <Labeled component="DSRiskBadge" props='level="low"'>
            <DSRiskBadge level="low"     label="RISCO BAIXO" />
          </Labeled>
          <Labeled component="DSRiskBadge" props='level="unknown"'>
            <DSRiskBadge level="unknown" label="NÃO ANALISADO" />
          </Labeled>
        </div>
      }
    />
  )
}
