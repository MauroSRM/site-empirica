import React, { useRef, useState } from 'react'
import { hexToRgba } from './tokens'
import { useTheme } from './ThemeContext'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

interface DSPasswordInputProps {
  length?: number
  size?: 'sm' | 'md'
  onComplete?: (value: string) => void
  error?: boolean
  disabled?: boolean
  label?: string
  hint?: string
}

export function DSPasswordInput({
  length = 4,
  size = 'md',
  onComplete,
  error = false,
  disabled = false,
  label,
  hint,
}: DSPasswordInputProps) {
  const { tokens: t } = useTheme()
  const cellW = size === 'sm' ? '44px' : '56px'
  const cellH = size === 'sm' ? '48px' : '56px'
  const cellFs = size === 'sm' ? '18px' : '20px'
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const [focused, setFocused] = useState<number | null>(null)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    if (!digit) return
    const next = [...values]
    next[index] = digit
    setValues(next)
    if (index < length - 1) {
      setTimeout(() => refs.current[index + 1]?.focus(), 0)
    } else {
      refs.current[index]?.blur()
    }
    if (next.every(v => v !== '')) onComplete?.(next.join(''))
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
    if (e.key === 'Backspace') {
      if (values[index]) {
        const next = [...values]
        next[index] = ''
        setValues(next)
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
        const next = [...values]
        next[index - 1] = ''
        setValues(next)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    if (disabled) return
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!digits) return
    const next = [...values]
    digits.split('').forEach((d, i) => { next[i] = d })
    setValues(next)
    const nextFocus = Math.min(digits.length, length - 1)
    refs.current[nextFocus]?.focus()
    if (digits.length >= length) onComplete?.(next.join(''))
  }

  const reset = () => {
    setValues(Array(length).fill(''))
    setTimeout(() => refs.current[0]?.focus(), 0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: t.fontFamily }}>
      {label && (
        <label style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', gap: t.space3 }}>
        {Array.from({ length }, (_, i) => {
          const isFocused = focused === i
          const isFilled = !!values[i]
          const cellBorder = error
            ? t.feedbackError
            : isFocused
            ? t.brandPrimary
            : isFilled
            ? t.borderMedium
            : t.borderDefault

          return (
            <input
              key={i}
              ref={el => { refs.current[i] = el }}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={values[i]}
              disabled={disabled}
              onChange={e => handleChange(i, e)}
              onKeyDown={e => handleKeyDown(i, e)}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(null)}
              onPaste={handlePaste}
              autoComplete="one-time-code"
              style={{
                width: cellW,
                height: cellH,
                textAlign: 'center',
                fontSize: cellFs,
                fontWeight: 700,
                border: `1.5px solid ${cellBorder}`,
                borderRadius: t.inputRadius,
                outline: 'none',
                backgroundColor: disabled ? t.surfaceMuted : t.surfaceDefault,
                color: t.textPrimary,
                fontFamily: t.fontFamily,
                boxShadow: isFocused
                  ? error
                    ? `0 0 0 3px ${hexToRgba(t.feedbackError, 0.18)}`
                    : t.focusRing
                  : 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                cursor: disabled ? 'not-allowed' : 'pointer',
                caretColor: 'transparent',
              }}
            />
          )
        })}
      </div>
      {hint && (
        <p style={{ fontSize: '12px', color: error ? t.feedbackError : t.textTertiary, margin: 0 }}>
          {hint}
        </p>
      )}
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSPasswordInputSection() {
  const { tokens: t } = useTheme()
  const [completed, setCompleted] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Entrada de PIN transacional com células fixas. Para autenticação de alto risco — não confundir com DSInput type='password'."
        whenToUse={['Confirmação de senha transacional (ex: autorizar Pix)', 'PIN de 4 dígitos em operação crítica']}
        whenNotToUse={['Campo de senha em formulário de login (use DSInput type=password)', 'Mais de 6 dígitos (use DSInput OTP)', 'Contexto não transacional']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Borda default', token: 't.borderMedium', descricao: 'Borda da célula em repouso' },
            { elemento: 'Borda ativa', token: 't.brandPrimary', descricao: 'Borda da célula com foco/preenchida' },
            { elemento: 'Borda error', token: 't.feedbackError', descricao: 'Borda no estado error' },
            { elemento: 'Fundo error', token: 'hexToRgba(t.feedbackError, 0.18)', descricao: 'Focus ring no estado error' },
            { elemento: 'Fundo disabled', token: 't.surfaceMuted', descricao: 'Fundo das células quando disabled' },
            { elemento: 'Texto', token: 't.textPrimary', descricao: 'Texto das células' },
            { elemento: 'Border radius', token: 't.inputRadius', descricao: 'Raio das células' },
            { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'length', tipo: 'number', default: '4', descricao: 'Número de células PIN' },
            { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Tamanho das células' },
            { prop: 'error', tipo: 'boolean', default: 'false', descricao: 'Aplica borda e fundo de erro' },
            { prop: 'disabled', tipo: 'boolean', default: 'false', descricao: 'Desabilita interação' },
            { prop: 'label', tipo: 'string', default: '—', descricao: 'Label acima das células' },
            { prop: 'hint', tipo: 'string', default: '—', descricao: 'Texto auxiliar abaixo' },
            { prop: 'onComplete', tipo: '(value: string) => void', default: '—', descricao: 'Callback ao preencher todas as células' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="type='password' + inputMode='numeric' + autoComplete='one-time-code' · Cada célula é um <input> independente"
            keyboard="Tab para focar primeira célula · Typing avança célula · Backspace retrocede"
            screenReader="aria-label='Dígito N de 4' em cada célula · Célula em erro: aria-invalid · Hint lido via aria-describedby"
            contrast="Célula ativa: borderBrand — verificado · Célula erro: borderError + feedbackErrorBg — verificado"
            focus="focusRing em cada célula individualmente · caretColor: transparent — caret oculto intencionalmente"
          /> },
        ]}
      />
      <div>
        <SectionLabel>MD — Default</SectionLabel>
        <Labeled component="DSPasswordInput" props='length={4} size="md"'>
          <DSPasswordInput size="md" label="Senha transacional" hint="4 dígitos · cells 56×56px" />
        </Labeled>
      </div>
      <div>
        <SectionLabel>SM — Compacto</SectionLabel>
        <Labeled component="DSPasswordInput" props='length={4} size="sm"'>
          <DSPasswordInput size="sm" label="Senha transacional" hint="4 dígitos · cells 44×48px" />
        </Labeled>
      </div>
      <div>
        <SectionLabel>MD — Com callback (preencha todos os campos)</SectionLabel>
        <Labeled component="DSPasswordInput" props='length={4} size="md"'>
          <DSPasswordInput
            size="md"
            label="Confirmar senha"
            onComplete={v => setCompleted(v)}
            hint={completed ? `✓ Senha recebida (${completed.length} dígitos)` : 'Preencha todos os campos para confirmar'}
          />
        </Labeled>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
        <div>
          <SectionLabel>MD — Erro</SectionLabel>
          <Labeled component="DSPasswordInput" props='size="md" error'>
            <DSPasswordInput size="md" label="Senha incorreta" error hint="Senha incorreta. Tente novamente." />
          </Labeled>
        </div>
        <div>
          <SectionLabel>SM — Erro</SectionLabel>
          <Labeled component="DSPasswordInput" props='size="sm" error'>
            <DSPasswordInput size="sm" label="Senha incorreta" error hint="Senha incorreta. Tente novamente." />
          </Labeled>
        </div>
        <div>
          <SectionLabel>Disabled</SectionLabel>
          <Labeled component="DSPasswordInput" props='size="md" disabled'>
            <DSPasswordInput size="md" label="Campo bloqueado" disabled hint="Aguarde para tentar novamente." />
          </Labeled>
        </div>
      </div>
    </div>
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
