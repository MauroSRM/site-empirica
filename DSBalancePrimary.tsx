import React, { useState } from 'react'
import { MoreHorizontal, Eye, EyeOff, ArrowUpRight, FileText } from 'lucide-react'
import { DSAvatar } from './DSAvatar'
import { DSButton } from './DSButton'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

interface DSBalancePrimaryProps {
  loading?: boolean
  defaultHidden?: boolean
  balance?: string
  company?: string
  account?: string
  masked?: boolean
  onToggleVisibility?: () => void
}

export function DSBalancePrimary({
  loading = false,
  defaultHidden = false,
  balance,
  company,
  account,
  masked,
  onToggleVisibility,
}: DSBalancePrimaryProps) {
  const { tokens: t } = useTheme()
  const [hidden, setHidden] = useState(defaultHidden)
  const isHidden = masked !== undefined ? masked : hidden
  const handleToggle = () => { onToggleVisibility?.(); setHidden(h => !h) }

  return (
    <div style={{
      padding: '24px',
      borderRadius: t.cardRadius,
      backgroundColor: t.surfaceDefault,
      boxShadow: t.shadowCard,
      fontFamily: t.fontFamily,
      minWidth: '320px',
    }}>
      {loading ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: t.radiusFull, backgroundColor: t.surfaceMuted }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: '12px', width: '80px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm }} />
              <div style={{ height: '10px', width: '60px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm, marginTop: '6px' }} />
            </div>
          </div>
          <div style={{ height: '32px', width: '160px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm, marginTop: '24px' }} />
          <div style={{ height: '1px', backgroundColor: t.borderDefault, margin: '20px 0' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, height: '36px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm }} />
            <div style={{ flex: 1, height: '36px', backgroundColor: t.surfaceMuted, borderRadius: t.radiusSm }} />
          </div>
        </>
      ) : (
        <>
          {/* Head */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <DSAvatar initials={(company ?? 'SRM').slice(0, 3).toUpperCase()} size="lg" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary, margin: 0, lineHeight: '18px' }}>{company ?? 'SRM Asset Management'}</p>
              <p style={{ fontSize: '11px', fontWeight: 400, color: t.textSecondary, margin: '2px 0 0' }}>{account ?? 'Conta corrente principal'}</p>
            </div>
            <MoreHorizontal size={16} color={t.textTertiary} style={{ cursor: 'pointer' }} />
          </div>
          {/* Body */}
          <p style={{ fontSize: '11px', fontWeight: 500, color: t.textSecondary, margin: '20px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saldo disponível</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, fontFamily: t.fontFamily }}>
              {isHidden ? 'R$ •••.•••,••' : (balance ?? 'R$ 1.245.860,32')}
            </span>
            <button
              onClick={handleToggle}
              aria-label={isHidden ? 'Exibir saldo' : 'Ocultar saldo'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textTertiary, display: 'flex', padding: '4px' }}
            >
              {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {/* Footer */}
          <div style={{ height: '1px', backgroundColor: t.borderDefault, margin: '20px 0' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <DSButton variant="primary" size="sm" icon="left" iconEl={<ArrowUpRight size={14} />} fullWidth>Transferir</DSButton>
            <DSButton variant="secondary" size="sm" icon="left" iconEl={<FileText size={14} />} fullWidth>Ver extrato</DSButton>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSBalancePrimarySection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Componente de exibição de saldo principal da conta com toggle ocultar/exibir, estado de carregamento e ações rápidas (extrato, transferência). Ancoragem visual do dashboard financeiro."
      whenToUse={['Saldo principal no topo do dashboard da conta', 'Widget de saldo em overview de conta PJ', 'Resumo financeiro no header de tela de operações']}
      whenNotToUse={['Saldos secundários ou parciais (use DSKPICard)', 'Múltiplos saldos em grade (use DSKPICard grid)', 'Saldo dentro de card de lista (use DSListLabel)']}
      preview={
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontFamily: t.fontFamily }}>
          <div>
            <SectionLabel>Saldo visível (default)</SectionLabel>
            <Labeled component="DSBalancePrimary">
              <DSBalancePrimary />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Saldo oculto</SectionLabel>
            <Labeled component="DSBalancePrimary" props="defaultHidden">
              <DSBalancePrimary defaultHidden />
            </Labeled>
          </div>
          <div>
            <SectionLabel>Loading (skeleton)</SectionLabel>
            <Labeled component="DSBalancePrimary" props="loading">
              <DSBalancePrimary loading />
            </Labeled>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo do card', token: 't.brandPrimary', descricao: 'Fundo principal do componente de saldo' },
          { elemento: 'Texto saldo', token: 't.textOnBrand', descricao: 'Valor do saldo sobre fundo de marca' },
          { elemento: 'Texto label', token: 'rgba(textOnBrand, 0.7)', descricao: 'Rótulo "Saldo disponível"' },
          { elemento: 'Ícone eye/eye-off', token: 't.textOnBrand', descricao: 'Ícone de toggle ocultar/exibir' },
          { elemento: 'Saldo oculto', token: 't.textOnBrand', descricao: 'Asteriscos quando oculto' },
          { elemento: 'Skeleton', token: 't.brandPrimaryLight', descricao: 'Placeholder de carregamento' },
          { elemento: 'Radius', token: 't.cardRadius', descricao: 'Arredondamento do card' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'loading', tipo: 'boolean', default: 'false', descricao: 'Exibe skeleton enquanto dados carregam' },
          { prop: 'defaultHidden', tipo: 'boolean', default: 'false', descricao: 'Inicia com saldo oculto' },
          { prop: 'balance', tipo: 'string', default: "'R$ 1.245.860,32'", descricao: 'Valor do saldo formatado' },
          { prop: 'company', tipo: 'string', default: "'SRM Asset Management'", descricao: 'Nome da empresa / titular' },
          { prop: 'account', tipo: 'string', default: "'Conta corrente principal'", descricao: 'Descrição da conta' },
          { prop: 'masked', tipo: 'boolean', default: 'undefined', descricao: 'Controle externo de visibilidade (uncontrolled se undefined)' },
          { prop: 'onToggleVisibility', tipo: '() => void', default: '—', descricao: 'Callback ao alternar visibilidade do saldo' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="Sem role semântico adicional — estrutura de article recomendada"
          keyboard="Botão eye: Tab para focar · Enter/Space para alternar visibilidade"
          screenReader="Botão eye: aria-label='Ocultar saldo' / 'Exibir saldo' conforme estado · Saldo oculto: aria-label='Saldo oculto'"
          contrast="textOnBrand sobre brandPrimary — verificado · Ações rápidas com contraste sobre fundo de marca"
          focus="focusRing visível no botão de toggle e nos botões de ação rápida"
        /> },
      ]}
    />
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>{children}</p>
}
