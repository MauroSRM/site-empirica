import React, { useState, useRef } from 'react'
import { Eye, EyeOff, Search, X, AlertCircle } from 'lucide-react'
import { t } from './tokens'
import { useTheme } from './ThemeContext'
import { CurrencyInput } from './FormAdvanced'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

// type 'currency' removido — use CurrencyInput de FormAdvanced.tsx para entradas monetárias com formatação automática
export type InputType = 'text' | 'password' | 'search' | 'otp'
export type InputState = 'default' | 'hover' | 'focus' | 'error' | 'disabled' | 'read-only'
export type InputSize = 'sm' | 'md'

interface DSInputProps {
  type?: InputType
  state?: InputState
  size?: InputSize
  label?: string
  placeholder?: string
  helperText?: string
  errorText?: string
  value?: string
  onChange?: (v: string) => void
  required?: boolean
}

export function DSInput({
  type = 'text',
  state = 'default',
  size = 'md',
  label,
  placeholder = 'Digite aqui...',
  helperText,
  errorText,
  value = '',
  onChange,
  required = false,
}: DSInputProps) {
  const { tokens: t } = useTheme()
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [internalVal, setInternalVal] = useState(value)

  const isDisabled   = state === 'disabled'
  const isError      = state === 'error'
  const isReadOnly   = state === 'read-only'
  const height       = size === 'sm' ? '40px' : '48px'

  const getBorder = () => {
    if (isError)   return `1px solid ${t.borderError}`
    if (focused)   return `1px solid ${t.borderBrand}`
    if (hovered)   return `1px solid ${t.borderMedium}`
    return `1px solid ${t.borderDefault}`
  }

  const getBg = () => {
    if (isDisabled || isReadOnly) return t.surfaceSubtle
    if (isError) return t.feedbackErrorBg
    return t.surfaceDefault
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height,
    borderRadius: t.inputRadius,
    border: getBorder(),
    backgroundColor: getBg(),
    paddingLeft: t.space3,
    paddingRight: t.space3,
    boxShadow: focused ? t.focusRing : undefined,
    transition: 'all 0.15s ease',
    cursor: isDisabled ? 'not-allowed' : 'text',
    position: 'relative',
  }

  // fontSize via t.text* — escala tipográfica centralizada (ARQ-03)
  const inputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: t.textMd,
    fontFamily: t.fontFamily,
    color: isDisabled ? t.textDisabled : t.textPrimary,
    cursor: isDisabled ? 'not-allowed' : 'text',
    width: '100%',
  }

  const handleChange = (v: string) => {
    setInternalVal(v)
    onChange?.(v)
  }

  if (type === 'otp') {
    return <OTPInput state={state} size={size} label={label} />
  }

  return (
    <>
    <style>{`.ds-input::placeholder { color: ${t.textTertiary}; }`}</style>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily, minWidth: '240px' }}>
      {label && (
        <label style={{ fontSize: t.text2Xs, fontWeight: 500, color: t.textSecondary, fontFamily: t.fontFamily }}>
          {label}
          {required && <span style={{ color: t.feedbackError, marginLeft: '2px' }}>*</span>}
        </label>
      )}

      <div
        style={containerStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {type === 'search' && (
          <Search size={16} style={{ color: t.textTertiary, marginRight: '8px', flexShrink: 0 }} />
        )}

        <input
          className="ds-input"
          type={type === 'password' ? (showPass ? 'text' : 'password') : 'text'}
          value={internalVal}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          readOnly={isReadOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textSecondary, padding: '0 0 0 8px', display: 'flex' }}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {type === 'search' && internalVal && (
          <button
            type="button"
            onClick={() => handleChange('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textTertiary, padding: '0 0 0 8px', display: 'flex' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {(isError ? errorText : helperText) && (
        <p style={{ fontSize: t.textSm, color: isError ? t.feedbackError : t.textTertiary, fontFamily: t.fontFamily, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isError && <AlertCircle size={12} />}
          {isError ? errorText : helperText}
        </p>
      )}
    </div>
    </>
  )
}

// ─── OTP Input ────────────────────────────────────────────────

function OTPInput({ state, size, label }: { state?: InputState; size?: InputSize; label?: string }) {
  const [values, setValues] = useState(['', '', '', '', '', ''])
  const refs = useRef<(HTMLInputElement | null)[]>([])

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

  const isDisabled = state === 'disabled'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: t.fontFamily }}>
      {label && <label style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {values.map((v, i) => (
          <React.Fragment key={i}>
            {i === 3 && <span style={{ color: t.textTertiary, fontSize: '18px', fontWeight: 300 }}>—</span>}
            <input
              ref={el => { refs.current[i] = el }}
              value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              maxLength={1}
              disabled={isDisabled}
              style={{
                width: '48px',
                height: '48px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: t.fontFamily,
                borderRadius: t.inputRadius,
                border: `1px solid ${v ? t.borderBrand : t.borderDefault}`,
                backgroundColor: v ? t.surfaceSubtle : t.surfaceDefault,
                color: t.textPrimary,
                outline: 'none',
                cursor: isDisabled ? 'not-allowed' : 'text',
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// ─── Section Showcase ──────────────────────────────────────────

export function DSInputSection() {
  const { tokens: t } = useTheme()
  return (
    <DSDocSection
      description="Coleta dados digitados pelo usuário. Variantes cobrem texto, busca, senha e OTP."
      whenToUse={['Formulário de cadastro ou edição', 'Busca com filtro textual', 'Código de verificação (OTP)']}
      whenNotToUse={['Dado somente leitura (use DSListLabel)', 'Seleção entre opções fixas (use DSSelect ou DSRadio)', 'Valor monetário (use CurrencyInput)']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Text states */}
          <div>
            <SectionLabel>Text — estados</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              <Labeled component="DSInput" props='type="text" state="default"'>
                <DSInput label="Default" placeholder="Digite aqui..." helperText="Texto de ajuda" />
              </Labeled>
              <Labeled component="DSInput" props='type="text" state="focus"'>
                <DSInput label="Focus" state="focus" placeholder="Em foco" />
              </Labeled>
              <Labeled component="DSInput" props='type="text" state="error"'>
                <DSInput label="Error" state="error" errorText="Campo obrigatório" placeholder="Erro" />
              </Labeled>
              <Labeled component="DSInput" props='type="text" state="disabled"'>
                <DSInput label="Disabled" state="disabled" placeholder="Desabilitado" />
              </Labeled>
              <Labeled component="DSInput" props='type="text" state="read-only"'>
                <DSInput label="Read Only" state="read-only" value="Somente leitura" />
              </Labeled>
              <Labeled component="DSInput" props='type="text" required'>
                <DSInput label="Required" required placeholder="Obrigatório" />
              </Labeled>
            </div>
          </div>
          {/* V-07: Focus / Digitando static frames — before Types */}
          <div>
            <SectionLabel>Focus / Digitando — preview estático</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: t.text2Xs, fontWeight: 500, color: t.textSecondary, fontFamily: t.fontFamily }}>Texto</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '48px', borderRadius: t.inputRadius, border: `1px solid ${t.borderBrand}`, backgroundColor: t.surfaceDefault, paddingLeft: t.space3, paddingRight: t.space3, boxShadow: t.focusRing }}>
                  <span style={{ fontSize: t.textMd, fontFamily: t.fontFamily, color: t.textPrimary }}>Valor digitado</span>
                </div>
                <span style={{ fontSize: '11px', color: t.textTertiary, fontFamily: t.fontFamily }}>Focus / Digitando</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: t.text2Xs, fontWeight: 500, color: t.textSecondary, fontFamily: t.fontFamily }}>Busca</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '48px', borderRadius: t.inputRadius, border: `1px solid ${t.borderBrand}`, backgroundColor: t.surfaceDefault, paddingLeft: t.space3, paddingRight: t.space3, gap: '8px', boxShadow: t.focusRing }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textTertiary} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <span style={{ fontSize: t.textMd, fontFamily: t.fontFamily, color: t.textPrimary }}>Empresa ou CNPJ</span>
                </div>
                <span style={{ fontSize: '11px', color: t.textTertiary, fontFamily: t.fontFamily }}>Focus / Digitando</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: t.text2Xs, fontWeight: 500, color: t.textSecondary, fontFamily: t.fontFamily }}>Senha</label>
                <div style={{ display: 'flex', alignItems: 'center', height: '48px', borderRadius: t.inputRadius, border: `1px solid ${t.borderBrand}`, backgroundColor: t.surfaceDefault, paddingLeft: t.space3, paddingRight: t.space3, boxShadow: t.focusRing }}>
                  <span style={{ fontSize: t.textMd, fontFamily: t.fontFamily, color: t.textPrimary, flex: 1, letterSpacing: '4px' }}>••••••••</span>
                </div>
                <span style={{ fontSize: '11px', color: t.textTertiary, fontFamily: t.fontFamily }}>Focus / Digitando</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: t.text2Xs, fontWeight: 500, color: t.textSecondary, fontFamily: t.fontFamily }}>OTP</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[1,2,3,'',5,6].map((v, i) => (
                    <React.Fragment key={i}>
                      {i === 3 && <span style={{ color: t.textTertiary, fontSize: '18px', fontWeight: 300, fontFamily: t.fontFamily }}>—</span>}
                      <div style={{
                        width: '42px', height: '42px', textAlign: 'center',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: t.textMd, fontWeight: 700, fontFamily: t.fontFamily,
                        borderRadius: t.inputRadius,
                        border: `1px solid ${i === 3 ? t.borderBrand : v ? t.borderBrand : t.borderDefault}`,
                        backgroundColor: v ? t.surfaceSubtle : t.surfaceDefault,
                        color: t.textPrimary,
                        boxShadow: i === 3 ? t.focusRing : 'none',
                      }}>
                        {v || ''}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: t.textTertiary, fontFamily: t.fontFamily }}>Focus / Digitando</span>
              </div>
            </div>
          </div>
          {/* Types */}
          <div>
            <SectionLabel>Tipos de input</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
              <Labeled component="DSInput" props='type="password"'>
                <DSInput type="password" label="Password" placeholder="••••••••" />
              </Labeled>
              <Labeled component="CurrencyInput" props='(FormAdvanced.tsx)'>
                <CurrencyInput label="Currency (CurrencyInput — FormAdvanced.tsx)" />
              </Labeled>
              <Labeled component="DSInput" props='type="search"'>
                <DSInput type="search" label="Search" placeholder="Buscar..." />
              </Labeled>
            </div>
          </div>
          {/* OTP */}
          <div>
            <SectionLabel>OTP Input (6 dígitos)</SectionLabel>
            <Labeled component="DSInput" props='type="otp"'>
              <OTPInput label="Código de verificação" />
            </Labeled>
          </div>
          {/* Sizes */}
          <div>
            <SectionLabel>Tamanhos</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
              <Labeled component="DSInput" props='size="sm"'>
                <DSInput size="sm" label="Small (40px)" placeholder="Tamanho sm" />
              </Labeled>
              <Labeled component="DSInput" props='size="md"'>
                <DSInput size="md" label="Medium (48px)" placeholder="Tamanho md" />
              </Labeled>
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda em repouso' },
          { elemento: 'Borda hover', token: 't.borderMedium', descricao: 'Borda ao passar o mouse' },
          { elemento: 'Borda focus', token: 't.borderBrand', descricao: 'Borda em foco' },
          { elemento: 'Borda error', token: 't.borderError', descricao: 'Borda no estado error' },
          { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo no estado error' },
          { elemento: 'Fundo disabled/read-only', token: 't.surfaceSubtle', descricao: 'Fundo quando não editável' },
          { elemento: 'Fundo default', token: 't.surfaceDefault', descricao: 'Fundo padrão' },
          { elemento: 'Border radius', token: 't.inputRadius', descricao: 'Raio de borda (8px)' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
          { elemento: 'Placeholder', token: 't.textTertiary', descricao: 'Cor do placeholder via CSS' },
          { elemento: 'Texto digitado', token: 't.textPrimary', descricao: 'Cor do valor preenchido' },
          { elemento: 'Helper text', token: 't.textTertiary', descricao: 'Texto auxiliar abaixo do campo' },
          { elemento: 'Error text', token: 't.feedbackError', descricao: 'Mensagem de erro' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'type', tipo: "'text' | 'password' | 'search' | 'otp'", default: "'text'", descricao: 'Tipo de entrada e layout' },
          { prop: 'state', tipo: "'default' | 'hover' | 'focus' | 'error' | 'disabled' | 'read-only'", default: "'default'", descricao: 'Estado visual do campo' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Altura: sm=40px, md=48px' },
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Label acima do campo' },
          { prop: 'placeholder', tipo: 'string', default: "'Digite aqui...'", descricao: 'Texto de placeholder' },
          { prop: 'helperText', tipo: 'string', default: '—', descricao: 'Texto auxiliar abaixo' },
          { prop: 'errorText', tipo: 'string', default: '—', descricao: 'Mensagem exibida no estado error' },
          { prop: 'value', tipo: 'string', default: "''", descricao: 'Valor inicial' },
          { prop: 'onChange', tipo: '(v: string) => void', default: '—', descricao: 'Callback ao digitar' },
          { prop: 'required', tipo: 'boolean', default: 'false', descricao: 'Exibe asterisco vermelho no label' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='textbox' nativo · type='search' para busca · type='password' para senha · inputMode='numeric' para OTP"
          keyboard="Tab para focar · Typing para inserir · Backspace para apagar · Tab para avançar célula OTP"
          screenReader="label obrigatório (via label prop) · aria-required quando required · aria-invalid + aria-describedby apontando para errorText"
          contrast="Placeholder: textTertiary — ratio 3:1 mínimo (decorativo) · Texto digitado: textPrimary — ratio 7:1"
          focus="focusRing 3px brandPrimary · borderBrand no container · nunca depender só de cor para comunicar estado"
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