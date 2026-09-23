import React from 'react'
import { History, Upload, ShieldCheck } from 'lucide-react'
import { DSBreadcrumb } from './DSBreadcrumb'
import { DSButton } from './DSButton'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

interface PageAction {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: React.ReactNode
  iconPos?: 'left' | 'right'
}

interface DSPageHeaderProps {
  breadcrumb: string[]
  title: string
  subtitle?: string
  actions?: PageAction[]
}

export function DSPageHeader({ breadcrumb, title, subtitle, actions = [] }: DSPageHeaderProps) {
  const { tokens: t } = useTheme()

  return (
    <div style={{
      width: '100%',
      paddingBottom: t.space6,
      borderBottom: `1px solid ${t.borderDefault}`,
      fontFamily: t.fontFamily,
    }}>
      <DSBreadcrumb items={breadcrumb.map(label => ({ label }))} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: '8px', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: t.text3xl, fontWeight: 700, color: t.textPrimary, margin: 0, lineHeight: '32px' }}>{title}</h1>
          {subtitle && (
            <p style={{ fontSize: t.textLg, fontWeight: 400, color: t.textSecondary, margin: '4px 0 0', lineHeight: '22px', maxWidth: '600px' }}>{subtitle}</p>
          )}
        </div>
        {actions.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, paddingTop: '4px' }}>
            {actions.map((a, i) => (
              <DSButton key={i} variant={a.variant ?? 'primary'} size="md" icon={a.iconPos ?? (a.icon ? 'left' : 'none')} iconEl={a.icon}>
                {a.label}
              </DSButton>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSPageHeaderSection() {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Cabeçalho de página com breadcrumb integrado, título, subtítulo e área de ações (até 3 botões). Padrão estrutural para todas as telas de funcionalidade do produto."
        whenToUse={['Topo de toda tela de funcionalidade (pagamentos, compliance, relatórios)', 'Página com ações contextuais (importar, exportar, aprovar)', 'Qualquer tela com hierarquia de navegação']}
        whenNotToUse={['Tela raiz/dashboard sem contexto hierárquico (use DSBalancePrimary + KPIs)', 'Modal ou drawer (use título inline no componente)', 'Página de onboarding ou fluxo linear (use DSStepper)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Fundo', token: 't.surfaceDefault', descricao: 'Background do cabeçalho' },  // D-01: surfacePrimary não existe
            { elemento: 'Borda inferior', token: 't.borderDefault', descricao: 'Separador entre header e conteúdo' },
            { elemento: 'Título', token: 't.textPrimary', descricao: 'Tipografia do título da página' },
            { elemento: 'Subtítulo', token: 't.textSecondary', descricao: 'Texto auxiliar abaixo do título' },
            { elemento: 'Breadcrumb', token: 't.brandPrimary', descricao: 'Links da trilha de navegação' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'breadcrumb', tipo: 'string[]', default: '—', descricao: 'Array de rótulos da trilha de navegação (obrigatório)' },
            { prop: 'title', tipo: 'string', default: '—', descricao: 'Título principal da página (obrigatório)' },
            { prop: 'subtitle', tipo: 'string', default: 'undefined', descricao: 'Subtítulo ou descrição curta da página' },
            { prop: 'actions', tipo: 'PageAction[]', default: 'undefined', descricao: 'Botões de ação no lado direito (máx 3)' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='banner' como elemento principal de cabeçalho da página"
            keyboard="Tab navega pelos links do breadcrumb e pelos botões de ação"
            screenReader="Título com role='heading' level=1 · Breadcrumb: role='navigation' aria-label='Trilha de navegação'"
            contrast="textPrimary e textSecondary sobre surfacePrimary — verificado"
            focus="focusRing em links do breadcrumb e nos botões de ação"
          /> },
        ]}
      />
      <div>
        <SectionLabel>Com 2 ações (ghost + primary)</SectionLabel>
        <Labeled component="DSPageHeader" props='breadcrumb={[...]} title="..." actions={[ghost, primary]}'>
          <DSPageHeader
            breadcrumb={['Início', 'Pagamentos', 'Importação em lote']}
            title="Importação de pagamentos"
            subtitle="A IA interpreta arquivos CNAB, OFX e CSV, valida dados e detecta anomalias antes de enviar para aprovação."
            actions={[
              { label: 'Histórico', variant: 'ghost', icon: <History size={15} />, iconPos: 'left' },
              { label: 'Importar arquivo', variant: 'primary', icon: <Upload size={15} />, iconPos: 'left' },
            ]}
          />
        </Labeled>
      </div>
      <div>
        <SectionLabel>Com 1 ação (primary)</SectionLabel>
        <Labeled component="DSPageHeader" props='breadcrumb={[...]} title="..." actions={[primary]}'>
          <DSPageHeader
            breadcrumb={['Início', 'Compliance', 'Validação PLD']}
            title="Compliance · Prevenção à Lavagem de Dinheiro"
            subtitle="Valide transações flagged pela IA e mantenha a trilha de auditoria do BACEN."
            actions={[
              { label: 'Validar selecionadas', variant: 'primary', icon: <ShieldCheck size={15} />, iconPos: 'left' },
            ]}
          />
        </Labeled>
      </div>
      <div>
        <SectionLabel>Sem ações</SectionLabel>
        <Labeled component="DSPageHeader" props='breadcrumb={[...]} title="..."'>
          <DSPageHeader
            breadcrumb={['Início', 'Relatórios']}
            title="Histórico de transações"
            subtitle="Extrato completo da conta principal e contas conectadas via Open Finance."
          />
        </Labeled>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>{children}</p>
}
