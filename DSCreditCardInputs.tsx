import React, { useState, useRef } from 'react'
import { Eye, EyeOff, Lock, Calendar, CreditCard } from 'lucide-react'
import { hexToRgba } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { useTheme } from './ThemeContext'

// ─── Types ───────────────────────────────────────────────────────
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'unknown'

// ─── Brand Detection ─────────────────────────────────────────────
export function detectBrand(raw: string): CardBrand {
  const n = raw.replace(/\D/g, '')
  if (!n) return 'unknown'
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720))/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368|65\d{4})/.test(n)) return 'elo'
  if (/^(606282|3841)/.test(n)) return 'hipercard'
  return 'unknown'
}

function maxDigits(brand: CardBrand): number {
  return brand === 'amex' ? 15 : 16
}

function maskCardNumber(raw: string, brand: CardBrand): string {
  const d = raw.replace(/\D/g, '').slice(0, maxDigits(brand))
  if (brand === 'amex') {
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(' ')
  }
  return (d.match(/.{1,4}/g) ?? []).join(' ')
}

function maskExpiration(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

function validateExpiration(masked: string): boolean {
  if (masked.length < 5) return false
  const [mm, yy] = masked.split('/')
  const month = parseInt(mm, 10)
  if (!yy || yy.length < 2 || isNaN(month) || month < 1 || month > 12) return false
  const year = 2000 + parseInt(yy, 10)
  const now = new Date()
  return new Date(year, month, 0) >= new Date(now.getFullYear(), now.getMonth(), 1)
}

// ─── Brand Icons (inline SVG) ─────────────────────────────────────
export function CardBrandIcon({ brand, size = 40 }: { brand: CardBrand; size?: number }) {
  const h = Math.round(size * 0.65)
  const style: React.CSSProperties = { flexShrink: 0, display: 'block' }

  if (brand === 'visa') return (
    <svg width={size} height={h} viewBox="0 0 40 26" style={style} aria-label="Visa">
      <rect width="40" height="26" rx="4" fill="#1A1F71" />
      <text x="20" y="19" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif"
        fontSize="14" fontWeight="bold" fontStyle="italic">VISA</text>
    </svg>
  )
  if (brand === 'mastercard') return (
    <svg width={size} height={h} viewBox="0 0 40 26" style={style} aria-label="Mastercard">
      <rect width="40" height="26" rx="4" fill="#1a1a1a" />
      <circle cx="15" cy="13" r="8.5" fill="#EB001B" />
      <circle cx="25" cy="13" r="8.5" fill="#F79E1B" />
      <path d="M20 6.5a8.5 8.5 0 0 1 0 13A8.5 8.5 0 0 1 20 6.5z" fill="#FF5F00" />
    </svg>
  )
  if (brand === 'amex') return (
    <svg width={size} height={h} viewBox="0 0 40 26" style={style} aria-label="American Express">
      <rect width="40" height="26" rx="4" fill="#007BC1" />
      <text x="20" y="17" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif"
        fontSize="8.5" fontWeight="bold" letterSpacing="0.6">AMEX</text>
    </svg>
  )
  if (brand === 'elo') return (
    <svg width={size} height={h} viewBox="0 0 40 26" style={style} aria-label="Elo">
      <rect width="40" height="26" rx="4" fill="#FED100" />
      <text x="20" y="18" textAnchor="middle" fill="#111" fontFamily="Arial, sans-serif"
        fontSize="12" fontWeight="900">ELO</text>
    </svg>
  )
  if (brand === 'hipercard') return (
    <svg width={size} height={h} viewBox="0 0 40 26" style={style} aria-label="Hipercard">
      <rect width="40" height="26" rx="4" fill="#B20E10" />
      <text x="20" y="17" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif"
        fontSize="7" fontWeight="bold" letterSpacing="0.8">HIPER</text>
    </svg>
  )
  return <CreditCard size={Math.round(size * 0.55)} color="#d1d5db" style={{ flexShrink: 0 }} />
}

// ─── Shared primitives ────────────────────────────────────────────
interface FieldProps {
  label?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}
function Field({ label, required, error, hint, children }: FieldProps) {
  const { tokens: t } = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary, lineHeight: '18px', display: 'block' }}>
          {label}
          {required && <span style={{ color: t.feedbackError, marginLeft: '3px' }}>*</span>}
        </label>
      )}
      {children}
      {(error || hint) && (
        <p style={{ fontSize: '12px', color: error ? t.feedbackError : t.textTertiary, margin: 0, lineHeight: '16px' }}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

interface BoxProps {
  focused: boolean
  hovered: boolean
  hasError: boolean
  disabled?: boolean
  left?: React.ReactNode
  right?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}
function Box({ focused, hovered, hasError, disabled, left, right, children, onClick }: BoxProps) {
  const { tokens: t } = useTheme()
  const borderColor = hasError
    ? t.borderError
    : focused ? t.borderBrand
    : hovered ? t.borderMedium
    : t.borderDefault
  const bg = disabled ? t.surfaceSubtle : hasError ? t.feedbackErrorBg : t.surfaceDefault
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        height: '48px', padding: '0 12px',
        borderRadius: t.inputRadius,
        border: `1px solid ${borderColor}`,
        backgroundColor: bg,
        boxShadow: focused ? (hasError ? `0 0 0 3px ${hexToRgba(t.feedbackError, 0.14)}` : t.focusRing) : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: disabled ? 'not-allowed' : 'text',
      }}
    >
      {left}
      {children}
      {right}
    </div>
  )
}

const inlineInput: React.CSSProperties = {
  flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent',
  fontSize: '15px', fontWeight: 500, lineHeight: '1', minWidth: 0, width: '100%',
  padding: 0, margin: 0,
}

// ─── CreditCardNumber ─────────────────────────────────────────────
interface CCNumberProps {
  label?: string
  required?: boolean
  hint?: string
  disabled?: boolean
  onChange?: (raw: string, masked: string, brand: CardBrand) => void
}

export function DSCreditCardNumberInput({
  label = 'Número do cartão',
  required,
  hint,
  disabled,
  onChange,
}: CCNumberProps) {
  const { tokens: t } = useTheme()
  const [rawDigits, setRawDigits] = useState('')
  const [brand, setBrand] = useState<CardBrand>('unknown')
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = e.target.value.replace(/\D/g, '')
    const newBrand = detectBrand(stripped)
    const capped = stripped.slice(0, maxDigits(newBrand))
    setRawDigits(capped)
    setBrand(newBrand)
    onChange?.(capped, maskCardNumber(capped, newBrand), newBrand)
  }

  const masked = maskCardNumber(rawDigits, brand)

  return (
    <Field label={label} required={required} hint={hint}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Box
          focused={focused} hovered={hovered} hasError={false} disabled={disabled}
          right={<CardBrandIcon brand={brand} size={38} />}
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={masked}
            placeholder="0000 0000 0000 0000"
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              ...inlineInput,
              fontFamily: t.fontFamily,
              color: t.textPrimary,
              letterSpacing: '0.08em',
            }}
          />
        </Box>
      </div>
    </Field>
  )
}

// ─── CreditCardExpiration ─────────────────────────────────────────
interface CCExpProps {
  label?: string
  required?: boolean
  disabled?: boolean
  onChange?: (raw: string, masked: string) => void
}

export function DSCreditCardExpirationInput({
  label = 'Validade',
  required,
  disabled,
  onChange,
}: CCExpProps) {
  const { tokens: t } = useTheme()
  const [rawDigits, setRawDigits] = useState('')
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState('')

  const masked = maskExpiration(rawDigits)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = e.target.value.replace(/\D/g, '').slice(0, 4)
    setRawDigits(stripped)
    if (error) setError('')
    onChange?.(stripped, maskExpiration(stripped))
  }

  const handleBlur = () => {
    setFocused(false)
    if (rawDigits.length === 4 && !validateExpiration(masked)) {
      setError('Data inválida ou expirada')
    } else if (rawDigits.length > 0 && rawDigits.length < 4) {
      setError('Data incompleta')
    }
  }

  return (
    <Field label={label} required={required} error={error} hint={!error ? 'MM/AA' : undefined}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Box
          focused={focused} hovered={hovered} hasError={!!error} disabled={disabled}
          left={<Calendar size={16} color={focused ? t.brandPrimary : t.textTertiary} style={{ flexShrink: 0 }} />}
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            value={masked}
            placeholder="MM/AA"
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            maxLength={5}
            style={{
              ...inlineInput,
              fontFamily: t.fontFamily,
              color: t.textPrimary,
              letterSpacing: '0.06em',
            }}
          />
        </Box>
      </div>
    </Field>
  )
}

// ─── CreditCardCvv ────────────────────────────────────────────────
interface CCCvvProps {
  label?: string
  required?: boolean
  disabled?: boolean
  isAmex?: boolean
  hint?: string
  onChange?: (value: string) => void
}

export function DSCreditCardCvvInput({
  label = 'CVV',
  required,
  disabled,
  isAmex = false,
  hint,
  onChange,
}: CCCvvProps) {
  const { tokens: t } = useTheme()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [show, setShow] = useState(false)
  const maxLen = isAmex ? 4 : 3

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, maxLen)
    setValue(v)
    onChange?.(v)
  }

  return (
    <Field label={label} required={required} hint={hint ?? `${maxLen} dígitos · verso do cartão`}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Box
          focused={focused} hovered={hovered} hasError={false} disabled={disabled}
          left={<Lock size={16} color={focused ? t.brandPrimary : t.textTertiary} style={{ flexShrink: 0 }} />}
          right={
            <button
              type="button"
              onClick={() => setShow(s => !s)}
              aria-label={show ? 'Ocultar CVV' : 'Mostrar CVV'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: t.textTertiary, flexShrink: 0 }}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        >
          <input
            type={show ? 'text' : 'password'}
            inputMode="numeric"
            autoComplete="cc-csc"
            value={value}
            placeholder={'•'.repeat(maxLen)}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={maxLen}
            style={{
              ...inlineInput,
              fontFamily: t.fontFamily,
              color: t.textPrimary,
              letterSpacing: show ? '0.12em' : '0.24em',
            }}
          />
        </Box>
      </div>
    </Field>
  )
}

// ─── Section Showcase ─────────────────────────────────────────────
export function DSCreditCardInputsSection() {
  const { tokens: t } = useTheme()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Campos especializados para coleta de dados de cartão de crédito com detecção automática de bandeira."
        whenToUse={['Formulário de pagamento com cartão', 'Cadastro de cartão de crédito', 'Checkout com novo cartão']}
        whenNotToUse={['Cartão salvo já tokenizado (exibir apenas últimos 4 dígitos)', 'Número de conta bancária (use DSInput)', 'Sem integração PCI-DSS']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda dos campos em repouso' },
            { elemento: 'Borda focus', token: 't.borderBrand', descricao: 'Borda em foco' },
            { elemento: 'Borda hover', token: 't.borderMedium', descricao: 'Borda no hover' },
            { elemento: 'Borda error', token: 't.borderError', descricao: 'Borda no estado error' },
            { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo no estado error' },
            { elemento: 'Fundo disabled', token: 't.surfaceSubtle', descricao: 'Fundo quando desabilitado' },
            { elemento: 'Error focus ring', token: 'hexToRgba(t.feedbackError, 0.14)', descricao: 'Anel de foco no estado error' },
            { elemento: 'Border radius', token: 't.inputRadius', descricao: 'Raio dos campos' },
            { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco padrão' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'label (número)', tipo: 'string', default: "'Número do cartão'", descricao: 'Label do campo de número' },
            { prop: 'label (validade)', tipo: 'string', default: "'Validade'", descricao: 'Label do campo de validade' },
            { prop: 'label (CVV)', tipo: 'string', default: "'CVV'", descricao: 'Label do campo de CVV' },
            { prop: 'required', tipo: 'boolean', default: 'false', descricao: 'Marca campo como obrigatório' },
            { prop: 'disabled', tipo: 'boolean', default: 'false', descricao: 'Desabilita interação' },
            { prop: 'isAmex', tipo: 'boolean (CVV)', default: 'false', descricao: 'CVV de 4 dígitos para Amex' },
            { prop: 'hint', tipo: 'string', default: '—', descricao: 'Texto auxiliar abaixo do campo' },
            { prop: 'onChange', tipo: 'ver cada componente', default: '—', descricao: 'Callback com valor raw, masked e brand (número) ou raw/masked' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="type='text' com inputMode='numeric' · autoComplete='cc-number', 'cc-exp', 'cc-csc' corretos"
            keyboard="Tab navega entre campos · Número: avança automaticamente ao completar · CVV: toggle show/hide via Enter/Space"
            screenReader="aria-label='Número do cartão' · Bandeira detectada anunciada: aria-live='polite' 'Bandeira: Visa'"
            contrast="Texto: textPrimary — verificado · Ícones de bandeira: cores fixas de marca (exceção documentada)"
            focus="focusRing em cada campo individualmente · Botão de olho (CVV) recebe foco próprio"
          /> },
        ]}
      />

      {/* ── Número do cartão ── */}
      <div>
        <SL>DSCreditCardNumberInput</SL>
        <DocNote t={t}>
          Máscara automática 4-4-4-4 (Amex: 4-6-5). Detecta bandeira a partir do primeiro dígito.
          Suporta: <strong>Visa</strong> (4···), <strong>Mastercard</strong> (51-55, 2221-2720), <strong>Amex</strong> (34/37), <strong>Elo</strong> (65···), <strong>Hipercard</strong> (606282).
        </DocNote>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '16px' }}>
          <div style={{ minWidth: '280px', maxWidth: '400px', flex: 1 }}>
            <Labeled component="DSCreditCardNumberInput" props='label="Número do cartão"'>
              <DSCreditCardNumberInput label="Número do cartão" />
            </Labeled>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: t.textTertiary }}>Bandeiras</span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(['visa', 'mastercard', 'amex', 'elo', 'hipercard'] as CardBrand[]).map(b => (
                <CardBrandIcon key={b} brand={b} size={38} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Validade + CVV ── */}
      <div>
        <SL>DSCreditCardExpirationInput + DSCreditCardCvvInput</SL>
        <DocNote t={t}>
          <strong>Validade</strong>: máscara MM/AA, valida mês (01-12) e data futura no blur.
          <br/>
          <strong>CVV</strong>: 3 dígitos (4 para Amex/CID). Toggle show/hide. Fundo mantido opaco para segurança.
        </DocNote>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '16px' }}>
          <div style={{ width: '160px' }}>
            <Labeled component="DSCreditCardExpirationInput" props='label="Validade"'>
              <DSCreditCardExpirationInput label="Validade" />
            </Labeled>
          </div>
          <div style={{ width: '140px' }}>
            <Labeled component="DSCreditCardCvvInput" props='label="CVV"'>
              <DSCreditCardCvvInput label="CVV" />
            </Labeled>
          </div>
          <div style={{ width: '160px' }}>
            <Labeled component="DSCreditCardCvvInput" props='label="CID (Amex)" isAmex'>
              <DSCreditCardCvvInput label="CID (Amex)" isAmex hint="4 dígitos · frente" />
            </Labeled>
          </div>
        </div>
      </div>

      {/* ── Formulário completo ── */}
      <div>
        <SL>Composição — formulário de pagamento</SL>
        <DocNote t={t}>Exemplo de uso em contexto de checkout. Todos os campos com <code>required</code> e <code>autoComplete</code> corretos para gerenciadores de senha.</DocNote>
        <div style={{
          maxWidth: '400px', padding: '24px', marginTop: '16px',
          backgroundColor: t.surfaceDefault,
          borderRadius: t.radiusLg,
          border: `1px solid ${t.borderDefault}`,
          boxShadow: '0 2px 8px rgba(0,8,30,0.06)',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <Labeled component="DSCreditCardNumberInput" props='required'>
            <DSCreditCardNumberInput label="Número do cartão" required />
          </Labeled>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Labeled component="DSCreditCardExpirationInput" props='required'>
              <DSCreditCardExpirationInput label="Validade" required />
            </Labeled>
            <Labeled component="DSCreditCardCvvInput" props='required'>
              <DSCreditCardCvvInput label="CVV" required />
            </Labeled>
          </div>
        </div>
      </div>

      {/* ── Disabled ── */}
      <div>
        <SL>Estado disabled</SL>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: '260px' }}>
            <Labeled component="DSCreditCardNumberInput" props='disabled'>
              <DSCreditCardNumberInput label="Número do cartão" disabled hint="Campo bloqueado" />
            </Labeled>
          </div>
          <div style={{ width: '150px' }}>
            <Labeled component="DSCreditCardExpirationInput" props='disabled'>
              <DSCreditCardExpirationInput label="Validade" disabled />
            </Labeled>
          </div>
          <div style={{ width: '140px' }}>
            <Labeled component="DSCreditCardCvvInput" props='disabled'>
              <DSCreditCardCvvInput label="CVV" disabled />
            </Labeled>
          </div>
        </div>
      </div>

    </div>
  )
}

function DocNote({ t, children }: { t: ReturnType<typeof useTheme>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '10px 14px',
      backgroundColor: t.surfaceSubtle,
      borderRadius: t.radiusMd,
      fontSize: '12px', color: t.textSecondary,
      lineHeight: '18px', fontFamily: t.fontFamily,
    }}>
      {children}
    </div>
  )
}

function SL({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px', fontFamily: t.fontFamily }}>
      {children}
    </p>
  )
}
