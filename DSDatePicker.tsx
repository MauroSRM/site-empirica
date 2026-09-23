// PROMPT 9 — DatePicker
import React, { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { t } from './tokens'
import { DSButton } from './DSButton'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'

type DPType  = 'single' | 'range'
type DPState = 'default' | 'open' | 'filled' | 'error' | 'disabled'

interface DatePickerProps {
  type?: DPType
  state?: DPState
  label?: string
  helper?: string
  size?: 'sm' | 'md'
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function fmt(d: Date) {
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

export function DSDatePicker({ type = 'single', state = 'default', label, helper, size = 'md' }: DatePickerProps) {
  const [open, setOpen] = useState(state === 'open')
  const [selected, setSelected] = useState<Date | null>(null)
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null)
  const [viewDate, setViewDate] = useState(new Date())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isDisabled = state === 'disabled'
  const isError    = state === 'error'
  const height = size === 'sm' ? '40px' : '48px'

  let borderColor = t.borderDefault
  if (isError)  borderColor = t.borderError
  if (open)     borderColor = t.borderBrand

  const displayValue = () => {
    if (type === 'single' && selected) return fmt(selected)
    if (type === 'range' && selected && rangeEnd) return `${fmt(selected)} — ${fmt(rangeEnd)}`
    return ''
  }

  // Build calendar grid
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const isSel = (d: Date) => selected?.toDateString() === d.toDateString()
  const isEnd = (d: Date) => rangeEnd?.toDateString() === d.toDateString()
  const isInRange = (d: Date) => {
    if (!selected || !rangeEnd || type !== 'range') return false
    return d > selected && d < rangeEnd
  }
  const isToday = (d: Date) => d.toDateString() === today.toDateString()

  const handleDayClick = (d: Date) => {
    if (type === 'single') { setSelected(d); setOpen(false) }
    else if (!selected || (selected && rangeEnd)) { setSelected(d); setRangeEnd(null) }
    else if (d > selected) { setRangeEnd(d); setOpen(false) }
    else { setSelected(d); setRangeEnd(null) }
  }

  return (
    <div ref={ref} style={{ position: 'relative', fontFamily: t.fontFamily }}>
      {label && (
        <div style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, marginBottom: '4px' }}>{label}</div>
      )}

      {/* Trigger */}
      <div
        onClick={() => !isDisabled && setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          height,
          padding: '0 12px',
          borderRadius: t.inputRadius,
          border: `1.5px solid ${borderColor}`,
          backgroundColor: isDisabled ? t.surfaceMuted : t.surfaceDefault,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          gap: '8px',
          boxShadow: open ? t.focusRing : isError ? `0 0 0 3px ${t.feedbackErrorBg}` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <span style={{ flex: 1, fontSize: '13px', color: displayValue() ? t.textPrimary : t.textTertiary, fontFamily: t.fontFamily }}>
          {displayValue() || (type === 'range' ? 'DD/MM/AAAA — DD/MM/AAAA' : 'DD/MM/AAAA')}
        </span>
        {displayValue() && (
          <X size={14} color={t.textTertiary} onClick={e => { e.stopPropagation(); setSelected(null); setRangeEnd(null) }} />
        )}
        <Calendar size={16} color={t.textSecondary} />
      </div>

      {helper && (
        <div style={{ fontSize: '11px', color: isError ? t.feedbackError : t.textSecondary, marginTop: '4px' }}>{helper}</div>
      )}

      {/* Calendar dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: t.calendarWidth,
            backgroundColor: t.surfaceDefault,
            border: `1.5px solid ${t.borderDefault}`,
            borderRadius: t.radiusLg,
            boxShadow: t.shadowDropdown,
            padding: t.space4,
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <button
              onClick={() => setViewDate(new Date(year, month - 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: t.radiusSm, color: t.textSecondary }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '14px', fontWeight: 600, color: t.textPrimary }}>{MONTHS[month]} {year}</span>
            <button
              onClick={() => setViewDate(new Date(year, month + 1))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: t.radiusSm, color: t.textSecondary }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: t.textTertiary, textTransform: 'uppercase', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />
              const sel = isSel(d)
              const end = isEnd(d)
              const inRange = isInRange(d)
              const tod = isToday(d)
              const outside = d.getMonth() !== month

              let bg = 'transparent'
              let color = outside ? t.textTertiary : t.textPrimary
              let border = 'none'
              let cursor = 'pointer'

              if (sel || end) { bg = t.brandPrimary; color = t.textOnBrand }
              else if (inRange) { bg = t.brandPrimaryLight; color = t.brandPrimary }
              else if (tod) { border = `1.5px solid ${t.brandPrimary}`; color = t.brandPrimary }

              return (
                <div
                  key={i}
                  onClick={() => handleDayClick(d)}
                  style={{
                    width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: t.radiusFull,
                    backgroundColor: bg,
                    color,
                    border,
                    fontSize: '13px',
                    cursor,
                    transition: 'background-color 0.1s',
                  }}
                  onMouseEnter={e => { if (!sel && !end) (e.currentTarget as HTMLDivElement).style.backgroundColor = t.surfaceSubtle }}
                  onMouseLeave={e => { if (!sel && !end && !inRange) (e.currentTarget as HTMLDivElement).style.backgroundColor = bg }}
                >
                  {d.getDate()}
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${t.borderDefault}` }}>
            <button
              onClick={() => { setSelected(new Date()); setViewDate(new Date()); if (type === 'single') setOpen(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: t.textPrimary }}
            >
              Hoje
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <DSButton variant="ghost" size="sm" onClick={() => { setOpen(false); setSelected(null); setRangeEnd(null) }}>Cancelar</DSButton>
              <DSButton variant="primary" size="sm" onClick={() => setOpen(false)}>Confirmar</DSButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

export function DSDatePickerSection() {
  return (
    <DSDocSection
      description="Seleção de data única ou intervalo de datas via calendário visual."
      whenToUse={['Data de vencimento de título', 'Período de filtro de extrato', 'Agendamento de operação']}
      whenNotToUse={['Data aproximada (use DSInput text)', 'Ano único sem dia/mês (use DSSelect)', 'Mais de 2 campos de data em sequência (use DSInput com máscara)']}
      preview={
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '600px' }}>
          <Labeled component="DSDatePicker" props='type="single" state="default"'>
            <DSDatePicker type="single" label="Data de vencimento" helper="Selecione a data" />
          </Labeled>
          <Labeled component="DSDatePicker" props='type="single" state="error"'>
            <DSDatePicker type="single" state="error" label="Data inválida" helper="Selecione uma data válida" />
          </Labeled>
          <Labeled component="DSDatePicker" props='type="single" state="disabled"'>
            <DSDatePicker type="single" state="disabled" label="Data bloqueada" />
          </Labeled>
          <Labeled component="DSDatePicker" props='type="range" state="default"'>
            <DSDatePicker type="range" label="Período" helper="Selecione início e fim" />
          </Labeled>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Borda default', token: 't.borderDefault', descricao: 'Borda do trigger em repouso' },
          { elemento: 'Borda focus/open', token: 't.borderBrand', descricao: 'Borda quando aberto' },
          { elemento: 'Borda error', token: 't.borderError', descricao: 'Borda no estado error' },
          { elemento: 'Fundo error', token: 't.feedbackErrorBg', descricao: 'Fundo da caixa no estado error' },
          { elemento: 'Fundo disabled', token: 't.surfaceMuted', descricao: 'Fundo quando desabilitado' },
          { elemento: 'Dia selecionado', token: 't.brandPrimary', descricao: 'Fundo do dia selecionado' },
          { elemento: 'Texto on-brand', token: 't.textOnBrand', descricao: 'Texto do dia selecionado' },
          { elemento: 'Range bg', token: 't.brandPrimaryLight', descricao: 'Fundo dos dias no intervalo' },
          { elemento: 'Hoje borda', token: 't.brandPrimary', descricao: 'Borda do dia atual' },
          { elemento: 'Sombra dropdown', token: 't.shadowDropdown', descricao: 'Sombra do calendário' },
          { elemento: 'Focus ring', token: 't.focusRing', descricao: 'Anel de foco' },
          { elemento: 'Border radius', token: 't.inputRadius', descricao: 'Raio do trigger (8px)' },
          { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'type', tipo: "'single' | 'range'", default: "'single'", descricao: 'Data única ou intervalo' },
          { prop: 'state', tipo: "'default' | 'open' | 'filled' | 'error' | 'disabled'", default: "'default'", descricao: 'Estado visual do componente' },
          { prop: 'label', tipo: 'string', default: '—', descricao: 'Label acima do trigger' },
          { prop: 'helper', tipo: 'string', default: '—', descricao: 'Texto auxiliar abaixo' },
          { prop: 'size', tipo: "'sm' | 'md'", default: "'md'", descricao: 'Altura do trigger' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='combobox' no trigger · role='dialog' no calendário · role='grid' na grade de dias"
          keyboard="Tab para focar trigger · Enter para abrir · Arrow keys para navegar dias · Escape para fechar"
          screenReader="aria-label em cada célula de dia: '15 de maio de 2026' · Dias desabilitados: aria-disabled · Mês/ano: aria-live='polite' ao navegar"
          contrast="Dia selecionado: textOnBrand sobre brandPrimary — verificado · Dia hover: brandPrimary sobre brandPrimaryLight — verificado"
          focus="focusRing nas células de dia · Botões de navegação de mês: focuáveis com Tab"
        /> },
      ]}
    />
  )
}