import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

// ─── Password Input with Strength ─────────────────────────────

function getStrength(val: string): 0 | 1 | 2 | 3 | 4 {
  let score = 0
  if (val.length >= 8)                    score++
  if (/[A-Z]/.test(val))                  score++
  if (/[0-9]/.test(val))                  score++
  if (/[^A-Za-z0-9]/.test(val))          score++
  return score as 0 | 1 | 2 | 3 | 4
}

export function PasswordInput({ label = 'Senha', showStrength = false }: { label?: string; showStrength?: boolean }) {
  const { tokens: t } = useTheme()
  const [value, setValue] = useState('')
  const [show, setShow]   = useState(false)
  const [focused, setFocused] = useState(false)

  // strengthConfig dentro do componente — reativo ao ThemeContext.Provider
  const strengthConfig = [
    { label: '',           colors: [t.borderDefault, t.borderDefault, t.borderDefault, t.borderDefault] },
    { label: 'Fraca',      colors: [t.feedbackError,   t.borderDefault, t.borderDefault, t.borderDefault] },
    { label: 'Regular',    colors: [t.feedbackWarning, t.feedbackWarning, t.borderDefault, t.borderDefault] },
    { label: 'Forte',      colors: [t.feedbackSuccess, t.feedbackSuccess, t.feedbackSuccess, t.borderDefault] },
    { label: 'Muito forte',colors: [t.feedbackSuccess, t.feedbackSuccess, t.feedbackSuccess, t.feedbackSuccess] },
  ]

  const strength = getStrength(value)
  const sc = strengthConfig[strength]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily, minWidth: '280px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary }}>{label}</label>

      <div
        style={{
          height: '48px',
          padding: '0 12px',
          borderRadius: t.inputRadius,
          border: `1px solid ${focused ? t.borderBrand : t.borderDefault}`,
          backgroundColor: t.surfaceDefault,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: focused ? t.focusRing : undefined,
          transition: 'all 0.15s ease',
        }}
      >
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="••••••••"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: '16px', fontFamily: t.fontFamily, color: t.textPrimary, backgroundColor: 'transparent' }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textTertiary, display: 'flex', padding: 0 }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {showStrength && value && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {sc.colors.map((color, i) => (
              <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', backgroundColor: color, transition: 'background-color 0.2s ease' }} />
            ))}
          </div>
          <span style={{ fontSize: '11px', color: t.textSecondary }}>{sc.label}</span>
        </div>
      )}
    </div>
  )
}

// ─── Currency Input ───────────────────────────────────────────
// Padrão oficial para campos de valor monetário com formatação automática (pt-BR).
// Use este componente em vez de DSInput type="currency" (removido).

export function CurrencyInput({
  label = 'Valor',
  helperLabel,
  allowNegative = false,
}: {
  label?: string
  helperLabel?: string
  allowNegative?: boolean
}) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const formatCurrency = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    const num = parseInt(digits) / 100
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const numericValue = parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0
  const isNegative = allowNegative && numericValue < 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily, minWidth: '280px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary }}>{label}</label>
        {helperLabel && <span style={{ fontSize: '11px', color: t.textTertiary }}>{helperLabel}</span>}
      </div>

      <div
        style={{
          height: '48px',
          borderRadius: t.inputRadius,
          border: `1px solid ${focused ? t.borderBrand : t.borderDefault}`,
          backgroundColor: t.surfaceDefault,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          boxShadow: focused ? t.focusRing : undefined,
          transition: 'all 0.15s ease',
        }}
      >
        <div
          style={{
            height: '100%',
            padding: '0 12px',
            backgroundColor: t.surfaceSubtle,
            borderRight: `1px solid ${t.borderDefault}`,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: t.textSecondary }}>R$</span>
        </div>
        <input
          type="text"
          value={value}
          onChange={e => setValue(formatCurrency(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0,00"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: t.fontFamily,
            color: isNegative ? t.feedbackError : t.textPrimary,
            backgroundColor: 'transparent',
            textAlign: 'right',
            padding: '0 12px',
          }}
        />
      </div>
    </div>
  )
}

// ─── Balance Display ──────────────────────────────────────────

export function BalanceDisplay({
  value = 'R$ 12.345,67',
  label = 'Saldo disponível',
  compact = false,
  negative = false,
}: {
  value?: string
  label?: string
  compact?: boolean
  negative?: boolean
}) {
  const [visible, setVisible] = useState(true)
  const [btnHover, setBtnHover] = useState(false)

  const fontSize   = compact ? '18px' : '28px'
  const labelSize  = compact ? '10px' : '12px'
  const valueColor = negative ? t.feedbackError : t.textPrimary
  const iconSize   = compact ? 16 : 20

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: t.fontFamily }}>
      <span style={{ fontSize: labelSize, color: t.textSecondary }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Value — always renders the same text; blur masks it visually without affecting layout */}
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: valueColor,
            transition: 'filter 0.25s ease, opacity 0.25s ease',
            filter: visible ? 'none' : 'blur(8px)',
            opacity: visible ? 1 : 0.5,
            userSelect: visible ? 'auto' : 'none',
            pointerEvents: visible ? 'auto' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {value}
        </span>
        <button
          onClick={() => setVisible(!visible)}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: btnHover ? t.textSecondary : t.textTertiary,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: t.cardRadius,
            backgroundColor: btnHover ? t.surfaceSubtle : 'transparent',
            flexShrink: 0,
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
        >
          {visible ? <EyeOff size={iconSize} /> : <Eye size={iconSize} />}
        </button>
      </div>
    </div>
  )
}

// ─── OTP Input (standalone) ───────────────────────────────────

export function OTPStandalone({ label = 'Código de acesso', hasError = false }: { label?: string; hasError?: boolean }) {
  const [values, setValues] = useState(['', '', '', '', '', ''])
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1)
    const next = [...values]
    next[i] = digit
    setValues(next)
    if (digit && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) refs.current[i - 1]?.focus()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {values.map((v, i) => (
          <React.Fragment key={i}>
            {i === 3 && <span style={{ color: t.textTertiary, fontSize: '18px', userSelect: 'none' }}>—</span>}
            <input
              ref={el => { refs.current[i] = el }}
              value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1}
              style={{
                width: '48px',
                height: '48px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: t.fontFamily,
                borderRadius: t.inputRadius,
                border: hasError
                  ? `1px solid ${t.borderError}`
                  : v
                  ? `1px solid ${t.borderBrand}`
                  : `1px solid ${t.borderDefault}`,
                backgroundColor: hasError ? t.feedbackErrorBg : v ? t.surfaceSubtle : t.surfaceDefault,
                color: t.textPrimary,
                outline: 'none',
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function FormAdvancedSection() {
  return (
    <DSDocSection
      description="Componentes de formulário com lógica especializada: indicador de força de senha, valor monetário formatado, saldo com toggle e OTP standalone."
      whenToUse={['CurrencyInput: qualquer entrada de valor monetário', 'PasswordInput: criação/alteração de senha', 'BalanceDisplay: exibição de saldo ocultável']}
      whenNotToUse={['CurrencyInput substitui DSInput type=currency — não usar os dois', 'BalanceDisplay em contexto sem dado real de saldo', 'PasswordInput fora de fluxo de criação/alteração']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* Password */}
          <div>
            <SectionLabel>Password Input — com indicador de força</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <Labeled component="PasswordInput" props='label="Senha" showStrength'>
                <PasswordInput label="Senha" showStrength />
              </Labeled>
              <Labeled component="PasswordInput" props='label="Confirmar senha"'>
                <PasswordInput label="Confirmar senha" />
              </Labeled>
            </div>
            <p style={{ fontSize: '12px', color: t.textSecondary, fontFamily: t.fontFamily, marginTop: '8px' }}>
              Digite para ver o indicador de forca: letras maiusculas, numeros e simbolos aumentam a pontuacao.
            </p>
          </div>

          {/* Currency */}
          <div>
            <SectionLabel>Currency Input</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <Labeled component="CurrencyInput" props='label="Valor da transferência" helperLabel="Saldo: R$ 50.000,00"'>
                <CurrencyInput label="Valor da transferência" helperLabel="Saldo: R$ 50.000,00" />
              </Labeled>
              <Labeled component="CurrencyInput" props='label="Valor de aplicação"'>
                <CurrencyInput label="Valor de aplicação" />
              </Labeled>
            </div>
          </div>

          {/* OTP */}
          <div>
            <SectionLabel>OTP Input</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
              <Labeled component="OTPStandalone" props='label="Código de verificação"'>
                <OTPStandalone label="Código de verificação" />
              </Labeled>
              <Labeled component="OTPStandalone" props='label="Código inválido (estado error)" hasError'>
                <OTPStandalone label="Código inválido (estado error)" hasError />
              </Labeled>
            </div>
          </div>

          {/* Balance Display */}
          <div>
            <SectionLabel>Balance Display</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-end' }}>
              <div style={{ padding: '24px', backgroundColor: t.surfaceDefault, borderRadius: t.cardRadius, border: `1px solid ${t.borderDefault}` }}>
                <Labeled component="BalanceDisplay" props='label="Saldo disponível" value="R$ 12.345,67"'>
                  <BalanceDisplay />
                </Labeled>
              </div>
              <div style={{ padding: '16px', backgroundColor: t.surfaceDefault, borderRadius: t.cardRadius, border: `1px solid ${t.borderDefault}` }}>
                <Labeled component="BalanceDisplay" props='label="Saldo atual" compact'>
                  <BalanceDisplay label="Saldo atual" compact />
                </Labeled>
              </div>
              <div style={{ padding: '24px', backgroundColor: t.surfaceDefault, borderRadius: t.cardRadius, border: `1px solid ${t.borderDefault}` }}>
                <Labeled component="BalanceDisplay" props='label="Saldo negativo" value="R$ -1.234,56" negative'>
                  <BalanceDisplay label="Saldo negativo" value="R$ -1.234,56" negative />
                </Labeled>
              </div>
            </div>
            <p style={{ fontSize: '12px', color: t.textSecondary, fontFamily: t.fontFamily, marginTop: '8px' }}>
              Clique no icone de olho para mostrar/ocultar o valor.
            </p>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda dos campos em repouso' },
          { elemento: 'Borda focus', token: 't.borderBrand', descricao: 'Borda em foco' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
          { elemento: 'Error text', token: 't.feedbackError', descricao: 'Mensagem de erro' },
          { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo do campo com erro' },
          { elemento: 'Barra fraca', token: 't.feedbackError', descricao: 'Barra de força senha: weak' },
          { elemento: 'Barra média', token: 't.feedbackWarning', descricao: 'Barra de força senha: fair' },
          { elemento: 'Barra forte', token: 't.feedbackSuccess', descricao: 'Barra de força senha: strong' },
          { elemento: 'Border radius', token: 't.inputRadius', descricao: 'Raio dos campos' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'label (Password)', tipo: 'string', default: "'Senha'", descricao: 'Label do PasswordInput' },
          { prop: 'showStrength', tipo: 'boolean', default: 'false', descricao: 'Exibe barras de força da senha' },
          { prop: 'label (Currency)', tipo: 'string', default: "'Valor'", descricao: 'Label do CurrencyInput' },
          { prop: 'helperLabel', tipo: 'string', default: '—', descricao: 'Texto auxiliar do CurrencyInput' },
          { prop: 'allowNegative', tipo: 'boolean', default: 'false', descricao: 'Permite valores negativos' },
          { prop: 'value (Balance)', tipo: 'string', default: "'R$ 12.345,67'", descricao: 'Valor exibido no BalanceDisplay' },
          { prop: 'compact', tipo: 'boolean', default: 'false', descricao: 'Layout compacto do BalanceDisplay' },
          { prop: 'negative', tipo: 'boolean', default: 'false', descricao: 'Exibe saldo em vermelho' },
          { prop: 'hasError (OTP)', tipo: 'boolean', default: 'false', descricao: 'Estado de erro no OTPStandalone' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="PasswordInput: type='password' · CurrencyInput: type='text' inputMode='decimal' · OTP: 6 inputs independentes"
          keyboard="PasswordInput: toggle visibilidade via Enter/Space no botão de olho · OTP: auto-avança e retrocede"
          screenReader="PasswordInput: indicador de força via aria-live='polite' · CurrencyInput: aria-label='Valor em reais' · BalanceDisplay: botão ocultar com aria-label='Ocultar saldo'"
          contrast="Barras de força: feedbackError/Warning/Success — verificados · Prefixo R$: textSecondary — verificado"
          focus="Todos os campos recebem focusRing · Botão de olho e toggle de saldo: foco próprio"
        /> },
      ]}
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