import React, { useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { hexToRgba } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { useTheme } from './ThemeContext'

type ValidationStatus = 'idle' | 'incomplete' | 'invalid' | 'valid'

// ─── CPF Utils ───────────────────────────────────────────────────
function maskCPF(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function validateCPF(raw: string): boolean {
  const d = raw.replace(/\D/g, '')
  if (d.length !== 11) return false
  if (/^(\d)\1+$/.test(d)) return false
  const calc = (str: string, len: number): number => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += parseInt(str[i]) * (len + 1 - i)
    const rem = (sum * 10) % 11
    return rem >= 10 ? 0 : rem
  }
  return calc(d, 9) === parseInt(d[9]) && calc(d, 10) === parseInt(d[10])
}

// ─── CNPJ Utils ──────────────────────────────────────────────────
function maskCNPJ(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 14)
  if (d.length <= 2) return d
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}

function validateCNPJ(raw: string): boolean {
  const d = raw.replace(/\D/g, '')
  if (d.length !== 14) return false
  if (/^(\d)\1+$/.test(d)) return false
  const calcDigit = (str: string, weights: number[]): number => {
    const sum = weights.reduce((acc, w, i) => acc + parseInt(str[i]) * w, 0)
    const rem = sum % 11
    return rem < 2 ? 0 : 11 - rem
  }
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  return (
    calcDigit(d, w1) === parseInt(d[12]) &&
    calcDigit(d, w2) === parseInt(d[13])
  )
}

// normalize for backend
export function normalizeCNPJ(masked: string): string {
  return masked.replace(/\D/g, '')
}
export function normalizeCPF(masked: string): string {
  return masked.replace(/\D/g, '')
}

// ─── Shared primitives (local) ────────────────────────────────────
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
  status: ValidationStatus
  disabled?: boolean
  left?: React.ReactNode
  right?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}
function Box({ focused, hovered, status, disabled, left, right, children, onClick }: BoxProps) {
  const { tokens: t } = useTheme()
  const hasError = status === 'invalid' || status === 'incomplete'
  const borderColor = hasError
    ? t.borderError
    : focused  ? t.borderBrand
    : hovered  ? t.borderMedium
    : t.borderDefault
  const bg = disabled
    ? t.surfaceSubtle
    : hasError ? t.feedbackErrorBg
    : t.surfaceDefault
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        height: '48px', padding: '0 12px',
        borderRadius: t.inputRadius,
        border: `1px solid ${borderColor}`,
        backgroundColor: bg,
        boxShadow: focused
          ? hasError ? `0 0 0 3px ${hexToRgba(t.feedbackError, 0.14)}` : t.focusRing
          : 'none',
        transition: 'border-color 0.15s, box-shadow 0.15s, background-color 0.15s',
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

function StatusIcon({ status }: { status: ValidationStatus }) {
  const { tokens: t } = useTheme()
  if (status === 'valid')   return <CheckCircle2 size={16} color={t.feedbackSuccess} style={{ flexShrink: 0 }} />
  if (status === 'invalid' || status === 'incomplete') return <AlertCircle size={16} color={t.feedbackError} style={{ flexShrink: 0 }} />
  return null
}

// ─── DSCpfInput ───────────────────────────────────────────────────
interface CPFProps {
  label?: string
  required?: boolean
  hint?: string
  disabled?: boolean
  onChange?: (raw: string, masked: string, valid: boolean) => void
  onBlur?: (raw: string, valid: boolean) => void
}

export function DSCpfInput({
  label = 'CPF',
  required,
  hint,
  disabled,
  onChange,
  onBlur,
}: CPFProps) {
  const { tokens: t } = useTheme()
  const [rawDigits, setRawDigits] = useState('')
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [status, setStatus] = useState<ValidationStatus>('idle')

  const masked = maskCPF(rawDigits)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = e.target.value.replace(/\D/g, '').slice(0, 11)
    setRawDigits(stripped)
    // clear error while typing, don't show success until complete
    if (stripped.length === 11) {
      setStatus(validateCPF(stripped) ? 'valid' : 'invalid')
    } else {
      setStatus('idle')
    }
    onChange?.(stripped, maskCPF(stripped), stripped.length === 11 && validateCPF(stripped))
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    const stripped = text.replace(/\D/g, '').slice(0, 11)
    if (!stripped) return
    e.preventDefault()
    setRawDigits(stripped)
    if (stripped.length === 11) {
      setStatus(validateCPF(stripped) ? 'valid' : 'invalid')
    }
    onChange?.(stripped, maskCPF(stripped), stripped.length === 11 && validateCPF(stripped))
  }

  const handleBlur = () => {
    setFocused(false)
    if (rawDigits.length === 0) {
      setStatus('idle')
    } else if (rawDigits.length < 11) {
      setStatus('incomplete')
    } else {
      setStatus(validateCPF(rawDigits) ? 'valid' : 'invalid')
    }
    onBlur?.(rawDigits, rawDigits.length === 11 && validateCPF(rawDigits))
  }

  const errorMsg =
    status === 'incomplete' ? 'CPF incompleto' :
    status === 'invalid'    ? 'CPF inválido'   : undefined

  return (
    <Field label={label} required={required} error={errorMsg} hint={!errorMsg ? (hint ?? '000.000.000-00') : undefined}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Box
          focused={focused} hovered={hovered} status={status} disabled={disabled}
          right={<StatusIcon status={status} />}
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={masked}
            placeholder="000.000.000-00"
            disabled={disabled}
            onChange={handleChange}
            onPaste={handlePaste}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            maxLength={14}
            aria-label={label ?? 'CPF'}
            aria-invalid={status === 'invalid' || status === 'incomplete'}
            style={{
              ...inlineInput,
              fontFamily: t.fontFamily,
              color: t.textPrimary,
              letterSpacing: '0.05em',
            }}
          />
        </Box>
      </div>
    </Field>
  )
}

// ─── DSCnpjInput ──────────────────────────────────────────────────
interface CNPJProps {
  label?: string
  required?: boolean
  hint?: string
  disabled?: boolean
  onChange?: (raw: string, masked: string, valid: boolean) => void
  onBlur?: (raw: string, valid: boolean) => void
  onValidCNPJ?: (raw: string) => void
}

export function DSCnpjInput({
  label = 'CNPJ',
  required,
  hint,
  disabled,
  onChange,
  onBlur,
  onValidCNPJ,
}: CNPJProps) {
  const { tokens: t } = useTheme()
  const [rawDigits, setRawDigits] = useState('')
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [status, setStatus] = useState<ValidationStatus>('idle')

  const masked = maskCNPJ(rawDigits)

  const applyInput = useCallback((stripped: string) => {
    setRawDigits(stripped)
    const isComplete = stripped.length === 14
    if (isComplete) {
      const isValid = validateCNPJ(stripped)
      setStatus(isValid ? 'valid' : 'invalid')
      if (isValid) onValidCNPJ?.(stripped)
    } else {
      setStatus('idle')
    }
    onChange?.(stripped, maskCNPJ(stripped), isComplete && validateCNPJ(stripped))
  }, [onChange, onValidCNPJ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = e.target.value.replace(/\D/g, '').slice(0, 14)
    applyInput(stripped)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    const stripped = text.replace(/\D/g, '').slice(0, 14)
    if (!stripped) return
    e.preventDefault()
    applyInput(stripped)
  }

  const handleBlur = () => {
    setFocused(false)
    if (rawDigits.length === 0) {
      setStatus('idle')
    } else if (rawDigits.length < 14) {
      setStatus('incomplete')
    } else {
      setStatus(validateCNPJ(rawDigits) ? 'valid' : 'invalid')
    }
    onBlur?.(rawDigits, rawDigits.length === 14 && validateCNPJ(rawDigits))
  }

  const errorMsg =
    status === 'incomplete' ? 'CNPJ incompleto' :
    status === 'invalid'    ? 'CNPJ inválido'   : undefined

  return (
    <Field label={label} required={required} error={errorMsg} hint={!errorMsg ? (hint ?? '00.000.000/0000-00') : undefined}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <Box
          focused={focused} hovered={hovered} status={status} disabled={disabled}
          right={<StatusIcon status={status} />}
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={masked}
            placeholder="00.000.000/0000-00"
            disabled={disabled}
            onChange={handleChange}
            onPaste={handlePaste}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            maxLength={18}
            aria-label={label ?? 'CNPJ'}
            aria-invalid={status === 'invalid' || status === 'incomplete'}
            style={{
              ...inlineInput,
              fontFamily: t.fontFamily,
              color: t.textPrimary,
              letterSpacing: '0.04em',
            }}
          />
        </Box>
      </div>
    </Field>
  )
}

// ─── Section Showcase ─────────────────────────────────────────────
export function DSDocumentInputsSection() {
  const { tokens: t } = useTheme()
  const [cpfLog, setCpfLog] = useState<string | null>(null)
  const [cnpjLog, setCnpjLog] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Campos com máscara automática e validação de CPF e CNPJ em tempo real."
        whenToUse={['Cadastro de pessoa física ou jurídica', 'Confirmação de titular de conta', 'KYC e validação de cliente']}
        whenNotToUse={['CNPJ de empresa já cadastrada (exibir formatado em leitura)', 'Campo de busca por CPF/CNPJ (use DSInput text)', 'Sem backend de validação']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda em repouso' },
            { elemento: 'Borda focus', token: 't.borderBrand', descricao: 'Borda em foco' },
            { elemento: 'Borda hover', token: 't.borderMedium', descricao: 'Borda no hover' },
            { elemento: 'Borda error', token: 't.borderError', descricao: 'Borda no estado error' },
            { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo no estado error' },
            { elemento: 'Error focus ring', token: 'hexToRgba(t.feedbackError, 0.14)', descricao: 'Anel de foco no estado error' },
            { elemento: 'Ícone válido', token: 't.feedbackSuccess', descricao: 'Ícone de check quando válido' },
            { elemento: 'Ícone inválido', token: 't.feedbackError', descricao: 'Ícone de X quando inválido' },
            { elemento: 'Texto label', token: 't.textSecondary', descricao: 'Label do campo' },
            { elemento: 'Border radius', token: 't.inputRadius', descricao: 'Raio do campo' },
            { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco padrão' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'label (CPF)', tipo: 'string', default: "'CPF'", descricao: 'Label do campo CPF' },
            { prop: 'label (CNPJ)', tipo: 'string', default: "'CNPJ'", descricao: 'Label do campo CNPJ' },
            { prop: 'required', tipo: 'boolean', default: 'false', descricao: 'Marca campo como obrigatório' },
            { prop: 'disabled', tipo: 'boolean', default: 'false', descricao: 'Desabilita interação' },
            { prop: 'hint', tipo: 'string', default: '—', descricao: 'Texto auxiliar abaixo do campo' },
            { prop: 'onChange', tipo: '(raw, masked, valid) => void', default: '—', descricao: 'Callback ao digitar com estado de validação' },
            { prop: 'onBlur', tipo: '(raw, valid) => void', default: '—', descricao: 'Callback ao sair do campo' },
            { prop: 'onValidCNPJ', tipo: '(raw) => void (CNPJ)', default: '—', descricao: 'Callback exclusivo ao validar CNPJ' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="type='text' com inputMode='numeric' · autoComplete='on' desabilitado (dados sensíveis)"
            keyboard="Tab para focar · Typing com máscara automática · Backspace remove com re-aplicação de máscara"
            screenReader="aria-label='CPF do titular' · Estado de validação: aria-live='polite' 'CPF válido' / 'CPF inválido' · aria-invalid no blur com erro"
            contrast="Ícone válido: feedbackSuccess — verificado · Ícone inválido: feedbackError — verificado"
            focus="focusRing no input · Estado valid: borda sem mudança (só ícone) — não depende de cor"
          /> },
        ]}
      />

      {/* CPF */}
      <div>
        <SL>DSCpfInput</SL>
        <DocNote t={t}>
          Máscara <strong>###.###.###-##</strong> · 11 dígitos · valida os dois dígitos verificadores (mod 11).
          Rejeita sequências repetidas (111.111.111-11). Erro apenas no <code>onBlur</code> ou quando completo.
          Colar com ou sem máscara funciona. Valor enviado ao backend: somente dígitos (<code>normalizeCPF()</code>).
        </DocNote>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '260px' }}>
            <div>
              <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>Interativo (valide ao perder foco)</span>
              <DSCpfInput
                label="CPF do titular"
                required
                onBlur={(raw, valid) => setCpfLog(valid ? `✓ CPF válido — raw: ${raw}` : raw.length < 11 ? `CPF incompleto (${raw.length}/11 dígitos)` : `✗ CPF inválido — raw: ${raw}`)}
              />
              {cpfLog && (
                <p style={{ marginTop: '8px', fontSize: '11px', color: cpfLog.startsWith('✓') ? t.feedbackSuccess : t.feedbackError, fontFamily: t.fontFamily }}>
                  {cpfLog}
                </p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '260px' }}>
            <div>
              <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>Estado vazio (idle)</span>
              <Labeled component="DSCpfInput" props='label="CPF"'>
                <DSCpfInput label="CPF" />
              </Labeled>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>Disabled</span>
              <Labeled component="DSCpfInput" props='disabled'>
                <DSCpfInput label="CPF" disabled hint="Não editável neste momento" />
              </Labeled>
            </div>
          </div>
        </div>

        {/* CPF state strip */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          {[
            { label: 'Vazio', raw: '' },
            { label: 'Incompleto', raw: '12345' },
            { label: 'Inválido', raw: '11111111111' },
            { label: 'Válido', raw: '52998224725' },
          ].map(({ label, raw }) => (
            <StaticCPFDemo key={label} label={label} raw={raw} />
          ))}
        </div>
      </div>

      {/* CNPJ */}
      <div>
        <SL>DSCnpjInput</SL>
        <DocNote t={t}>
          Máscara <strong>##.###.###/####-##</strong> · 14 dígitos · algoritmo oficial (pesos 5,4,3,2,9,8,7,6,5,4,3,2 e 6,5···).
          Rejeita sequências repetidas. Estados: idle · incompleto · inválido · válido (apenas ícone de check, sem fill).
          Colar com ou sem máscara funciona. Integração futura: <code>onValidCNPJ</code> para chamar BrasilAPI / ReceitaWS.
        </DocNote>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '280px' }}>
            <div>
              <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>Interativo (valide ao perder foco)</span>
              <DSCnpjInput
                label="CNPJ da empresa"
                required
                onBlur={(raw, valid) => setCnpjLog(valid ? `✓ CNPJ válido — raw: ${raw}` : raw.length < 14 ? `CNPJ incompleto (${raw.length}/14 dígitos)` : `✗ CNPJ inválido — raw: ${raw}`)}
              />
              {cnpjLog && (
                <p style={{ marginTop: '8px', fontSize: '11px', color: cnpjLog.startsWith('✓') ? t.feedbackSuccess : t.feedbackError, fontFamily: t.fontFamily }}>
                  {cnpjLog}
                </p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '280px' }}>
            <div>
              <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>Estado vazio (idle)</span>
              <Labeled component="DSCnpjInput" props='label="CNPJ"'>
                <DSCnpjInput label="CNPJ" />
              </Labeled>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>Disabled</span>
              <Labeled component="DSCnpjInput" props='disabled'>
                <DSCnpjInput label="CNPJ" disabled hint="Preenchido automaticamente" />
              </Labeled>
            </div>
          </div>
        </div>

        {/* CNPJ state strip */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '24px' }}>
          {[
            { label: 'Vazio', raw: '' },
            { label: 'Incompleto', raw: '1234567' },
            { label: 'Inválido', raw: '11111111111111' },
            { label: 'Válido', raw: '11222333000181' },
          ].map(({ label, raw }) => (
            <StaticCNPJDemo key={label} label={label} raw={raw} />
          ))}
        </div>

        {/* Normalization note */}
        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: t.surfaceSubtle, borderRadius: t.radiusLg, border: `1px solid ${t.borderDefault}`, maxWidth: '520px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, margin: '0 0 6px', fontFamily: t.fontFamily }}>Normalização para backend</p>
          <p style={{ fontSize: '12px', color: t.textSecondary, margin: 0, lineHeight: '18px', fontFamily: t.fontFamily }}>
            O valor mascarado (<code style={{ background: t.surfaceMuted, padding: '1px 4px', borderRadius: '3px' }}>11.222.333/0001-81</code>) é exibido ao usuário, mas o valor salvo é apenas os dígitos: <code style={{ background: t.surfaceMuted, padding: '1px 4px', borderRadius: '3px' }}>11222333000181</code>.
            Use <code style={{ background: t.surfaceMuted, padding: '1px 4px', borderRadius: '3px' }}>normalizeCNPJ(masked)</code> antes de enviar ao backend.
          </p>
        </div>
      </div>

    </div>
  )
}

// ─── Static state demos ───────────────────────────────────────────
function StaticCPFDemo({ label, raw }: { label: string; raw: string }) {
  const { tokens: t } = useTheme()
  const isComplete = raw.length === 11
  const isValid = isComplete && validateCPF(raw)
  const isInvalid = isComplete && !isValid
  const isIncomplete = raw.length > 0 && raw.length < 11
  const status: ValidationStatus = isValid ? 'valid' : isInvalid ? 'invalid' : isIncomplete ? 'incomplete' : 'idle'
  return (
    <div style={{ minWidth: '220px' }}>
      <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>{label}</span>
      <ControlledCPFField raw={raw} status={status} />
    </div>
  )
}
function StaticCNPJDemo({ label, raw }: { label: string; raw: string }) {
  const { tokens: t } = useTheme()
  const isComplete = raw.length === 14
  const isValid = isComplete && validateCNPJ(raw)
  const isInvalid = isComplete && !isValid
  const isIncomplete = raw.length > 0 && raw.length < 14
  const status: ValidationStatus = isValid ? 'valid' : isInvalid ? 'invalid' : isIncomplete ? 'incomplete' : 'idle'
  return (
    <div style={{ minWidth: '240px' }}>
      <span style={{ fontSize: '10px', color: t.textTertiary, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'block', marginBottom: '8px' }}>{label}</span>
      <ControlledCNPJField raw={raw} status={status} />
    </div>
  )
}

// Non-interactive display fields for showcase
function ControlledCPFField({ raw, status }: { raw: string; status: ValidationStatus }) {
  const { tokens: t } = useTheme()
  const errorMsg = status === 'incomplete' ? 'CPF incompleto' : status === 'invalid' ? 'CPF inválido' : undefined
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily }}>
      <Box focused={false} hovered={false} status={status}
        right={<StatusIcon status={status} />}
      >
        <span style={{ ...inlineInput, color: raw ? t.textPrimary : t.textTertiary, display: 'flex', alignItems: 'center', letterSpacing: '0.05em' }}>
          {raw ? maskCPF(raw) : '000.000.000-00'}
        </span>
      </Box>
      {errorMsg && <p style={{ fontSize: '12px', color: t.feedbackError, margin: 0 }}>{errorMsg}</p>}
    </div>
  )
}
function ControlledCNPJField({ raw, status }: { raw: string; status: ValidationStatus }) {
  const { tokens: t } = useTheme()
  const errorMsg = status === 'incomplete' ? 'CNPJ incompleto' : status === 'invalid' ? 'CNPJ inválido' : undefined
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily }}>
      <Box focused={false} hovered={false} status={status}
        right={<StatusIcon status={status} />}
      >
        <span style={{ ...inlineInput, color: raw ? t.textPrimary : t.textTertiary, display: 'flex', alignItems: 'center', letterSpacing: '0.04em' }}>
          {raw ? maskCNPJ(raw) : '00.000.000/0000-00'}
        </span>
      </Box>
      {errorMsg && <p style={{ fontSize: '12px', color: t.feedbackError, margin: 0 }}>{errorMsg}</p>}
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

function DocNote({ t, children }: { t: ReturnType<typeof useTheme>['tokens']; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '10px 14px', marginBottom: '16px',
      backgroundColor: t.surfaceSubtle,
      borderRadius: t.radiusMd,
      fontSize: '12px', color: t.textSecondary,
      lineHeight: '18px', fontFamily: t.fontFamily,
    }}>
      {children}
    </div>
  )
}
