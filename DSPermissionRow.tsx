import React from 'react'
import { DSCheckbox } from './DSCheckboxRadio'
import { DSTag } from './DSTag'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type CheckState = 'checked' | 'unchecked' | 'indeterminate' | 'disabled'

interface DSPermissionRowProps {
  label: string
  description: string
  checked: CheckState
  tag?: { label: string; variant?: 'neutral-brand1' | 'neutral-brand2' | 'warning' | 'success' }
  last?: boolean
}

export function DSPermissionRow({ label, description, checked, tag, last = false }: DSPermissionRowProps) {
  const { tokens: t } = useTheme()
  const isDisabled = checked === 'disabled'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 0',
      borderBottom: last ? 'none' : `1px solid ${t.borderDefault}`,
      opacity: isDisabled ? 0.5 : 1,
      cursor: isDisabled ? 'not-allowed' : 'default',
      fontFamily: t.fontFamily,
    }}>
      <div style={{ flexShrink: 0 }}>
        <DSCheckbox state={isDisabled ? 'disabled' : checked === 'checked' ? 'checked' : checked === 'indeterminate' ? 'indeterminate' : 'unchecked'} size="md" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '18px' }}>{label}</p>
        <p style={{ fontSize: '12px', fontWeight: 400, color: t.textSecondary, margin: '2px 0 0', lineHeight: '16px' }}>{description}</p>
      </div>
      {tag && <DSTag variant={tag.variant ?? 'neutral-brand1'} size="sm">{tag.label}</DSTag>}
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSPermissionRowSection() {
  const { tokens: t } = useTheme()
  const rows: Array<Omit<DSPermissionRowProps, 'last'>> = [
    { label: 'Execução — Aprovar Pagamento', description: 'Permite aprovar transações dentro da alçada', checked: 'checked', tag: { label: 'Master only', variant: 'neutral-brand1' } },
    { label: 'Leitura — Dashboard',          description: 'Acesso à visão consolidada de saldo e alertas', checked: 'checked' },
    { label: 'Execução — Criar Usuário',     description: 'Permite convidar e configurar novos usuários', checked: 'unchecked' },
    { label: 'Leitura — Compliance',         description: 'Acesso ao dashboard PLD e histórico de análises', checked: 'checked', tag: { label: 'Requer 2FA', variant: 'neutral-brand1' } },
    { label: 'Execução — Acesso Master',     description: 'Reservado ao perfil Master — não pode ser delegado', checked: 'disabled' },
    { label: 'Todos os módulos de Leitura',  description: 'Grupo de permissões — parcialmente selecionado', checked: 'indeterminate' },
  ]

  return (
    <DSDocSection
      description="Linha de permissão com checkbox (checked, unchecked, indeterminate, disabled), rótulo, descrição e badge opcional. Usado em telas de configuração de perfis e gestão de alçadas de acesso."
      whenToUse={['Configuração de permissões de usuário por módulo', 'Gestão de alçadas e papéis em conta PJ', 'Seleção de escopo de acesso na criação de perfil']}
      whenNotToUse={['Toggle on/off simples (use DSSwitch)', 'Filtro de visualização (use DSCheckbox isolado)', 'Permissões de nível de sistema (contexto diferente)']}
      preview={
        <div style={{ fontFamily: t.fontFamily }}>
          {rows.map((row, i) => (
            <Labeled key={i} component="DSPermissionRow" props={`checked="${row.checked}"${row.tag ? ` tag={{label:"${row.tag.label}"}}` : ''}`}>
              <DSPermissionRow {...row} last={i === rows.length - 1} />
            </Labeled>
          ))}
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Checkbox checked', token: 't.brandPrimary', descricao: 'Fundo do checkbox marcado' },
          { elemento: 'Checkbox disabled', token: 't.surfaceMuted', descricao: 'Fundo do checkbox desabilitado' },
          { elemento: 'Separador', token: 't.borderDefault', descricao: 'Linha entre linhas de permissão' },
          { elemento: 'Label', token: 't.textPrimary', descricao: 'Texto do nome da permissão' },
          { elemento: 'Descrição', token: 't.textSecondary', descricao: 'Texto auxiliar da permissão' },
          { elemento: 'Badge tag', token: 't.brandPrimary', descricao: 'Badge de restrição (Master only, 2FA)' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Nome da permissão (obrigatório)' },
          { prop: 'description', tipo: 'string', default: '—', descricao: 'Descrição do escopo da permissão (obrigatório)' },
          { prop: 'checked', tipo: "'checked' | 'unchecked' | 'indeterminate' | 'disabled'", default: '—', descricao: 'Estado do checkbox (obrigatório)' },
          { prop: 'tag', tipo: '{ label, variant }', default: 'undefined', descricao: 'Badge opcional de restrição' },
          { prop: 'last', tipo: 'boolean', default: 'false', descricao: 'Remove separador inferior na última linha' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='checkbox' nativo · aria-checked='true/false/mixed' conforme estado"
          keyboard="Tab para focar a linha · Space para alternar estado"
          screenReader="Leitura: estado + label + descrição · Badge: aria-label adicional quando presente"
          contrast="brandPrimary sobre branco verificado · disabled com suficiente contraste para leitura"
          focus="focusRing visível no checkbox · linha inteira não focável"
        /> },
      ]}
    />
  )
}
