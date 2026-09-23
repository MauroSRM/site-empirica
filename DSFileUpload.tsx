import React, { useState } from 'react'
import { UploadCloud, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { DSButton } from './DSButton'
import { useTheme } from './ThemeContext'
import { DSDocSection, Labeled, TokenTable, PropsTable, A11yBlock } from './DSDocSection'

export type FileUploadState = 'idle' | 'drag-over' | 'uploading' | 'success' | 'error'

interface DSFileUploadProps {
  state?: FileUploadState
  onStateChange?: (state: FileUploadState) => void
}

export function DSFileUpload({ state = 'idle', onStateChange }: DSFileUploadProps) {
  const { tokens: t } = useTheme()
  const [localState, setLocalState] = useState<FileUploadState>(state)
  const s = localState

  const set = (next: FileUploadState) => { setLocalState(next); onStateChange?.(next) }

  const borderColor = s === 'drag-over' ? t.brandPrimary
    : s === 'success' ? t.feedbackSuccess
    : s === 'error'   ? t.feedbackError
    : t.borderDefault

  const borderStyle = s === 'drag-over' || s === 'success' || s === 'error' ? 'solid' : 'dashed'

  const bg = s === 'drag-over' ? t.brandPrimaryLight
    : s === 'success' ? t.surfaceDefault
    : s === 'error'   ? t.surfaceDefault
    : t.surfaceSubtle

  return (
    <div
      onDragOver={e => { e.preventDefault(); set('drag-over') }}
      onDragLeave={() => set('idle')}
      onDrop={e => { e.preventDefault(); set('uploading'); setTimeout(() => set('success'), 1500) }}
      onClick={s === 'idle' || s === 'error' ? () => set('uploading') : undefined}
      style={{
        width: '100%',
        minHeight: '160px',
        border: `2px ${borderStyle} ${borderColor}`,
        borderRadius: t.radiusLg,
        backgroundColor: bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        cursor: s === 'idle' || s === 'error' ? 'pointer' : 'default',
        transition: 'all 0.15s',
        fontFamily: t.fontFamily,
        textAlign: 'center',
        gap: '4px',
        position: 'relative',
      }}
    >
      {s === 'idle' && (
        <>
          <UploadCloud size={32} color={t.textTertiary} />
          <p style={{ fontSize: '14px', fontWeight: 600, color: t.textPrimary, margin: '8px 0 0' }}>Arraste o arquivo aqui</p>
          <p style={{ fontSize: '13px', color: t.textSecondary, margin: '4px 0 0' }}>ou <span style={{ color: t.brandPrimary, textDecoration: 'underline' }}>clique para selecionar</span></p>
          <p style={{ fontSize: '11px', color: t.textTertiary, margin: '8px 0 0' }}>Formatos aceitos: CNAB · OFX · CSV</p>
        </>
      )}
      {s === 'drag-over' && (
        <>
          <UploadCloud size={32} color={t.brandPrimary} />
          <p style={{ fontSize: '14px', fontWeight: 600, color: t.brandPrimary, margin: '8px 0 0' }}>Solte o arquivo aqui</p>
        </>
      )}
      {s === 'uploading' && (
        <>
          <Loader2 size={28} color={t.brandPrimary} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '14px', fontWeight: 500, color: t.textPrimary, margin: '8px 0 0' }}>Enviando arquivo...</p>
          <div style={{ width: '200px', height: '4px', backgroundColor: t.borderDefault, borderRadius: t.radiusFull, marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: '50%', height: '100%', backgroundColor: t.brandPrimary, borderRadius: t.radiusFull }} />
          </div>
          <p style={{ fontSize: '11px', color: t.textTertiary, margin: '8px 0 0' }}>pagamentos_maio_2026.cnab · 45kb</p>
        </>
      )}
      {s === 'success' && (
        <>
          <CheckCircle2 size={32} color={t.feedbackSuccess} />
          <p style={{ fontSize: '14px', fontWeight: 600, color: t.feedbackSuccess, margin: '8px 0 0' }}>Arquivo recebido</p>
          <p style={{ fontSize: '11px', color: t.textTertiary, margin: '4px 0 0' }}>pagamentos_maio_2026.cnab · 15 pagamentos reconhecidos</p>
          <div style={{ marginTop: '14px' }} onClick={e => e.stopPropagation()}>
            <DSButton variant="secondary" size="sm" onClick={() => set('idle')}>Trocar arquivo</DSButton>
          </div>
        </>
      )}
      {s === 'error' && (
        <>
          <XCircle size={32} color={t.feedbackError} />
          <p style={{ fontSize: '14px', fontWeight: 600, color: t.feedbackError, margin: '8px 0 0' }}>Formato não reconhecido</p>
          <p style={{ fontSize: '11px', color: t.textTertiary, margin: '4px 0 0' }}>Use arquivos CNAB, OFX ou CSV</p>
          <div style={{ marginTop: '14px' }} onClick={e => e.stopPropagation()}>
            <DSButton variant="secondary" size="sm" onClick={() => set('idle')}>Tentar novamente</DSButton>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Section Showcase ───────────────────────────────────────────

export function DSFileUploadSection() {
  const { tokens: t } = useTheme()
  const states: FileUploadState[] = ['idle', 'drag-over', 'uploading', 'success', 'error']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Zona de upload por clique ou drag-and-drop para arquivos CNAB, OFX e CSV."
        whenToUse={['Importação de lote de pagamentos', 'Upload de arquivo de conciliação', 'Envio de documento financeiro']}
        whenNotToUse={['Múltiplos arquivos simultâneos (aceita 1 por vez)', 'Arquivo maior que 10MB sem validação prévia', 'Upload de imagem (use input específico)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Borda idle', token: 't.borderDefault', descricao: 'Borda tracejada no estado idle' },
            { elemento: 'Borda drag-over', token: 't.brandPrimary', descricao: 'Borda ao arrastar arquivo' },
            { elemento: 'Fundo drag-over', token: 't.brandPrimaryLight', descricao: 'Fundo ao arrastar' },
            { elemento: 'Ícone success', token: 't.feedbackSuccess', descricao: 'Ícone de upload concluído' },
            { elemento: 'Fundo success', token: 't.feedbackSuccess', descricao: 'Cor de destaque no estado success' },
            { elemento: 'Ícone error', token: 't.feedbackError', descricao: 'Ícone de erro no upload' },
            { elemento: 'Fundo base', token: 't.surfaceSubtle', descricao: 'Fundo da zona de upload' },
            { elemento: 'Texto', token: 't.textPrimary', descricao: 'Texto de instrução' },
            { elemento: 'Subtexto', token: 't.textTertiary', descricao: 'Texto de formato/tamanho' },
            { elemento: 'Border radius', token: 't.radiusLg', descricao: 'Raio do container' },
            { elemento: 'Fonte', token: 't.fontFamily', descricao: 'Família tipográfica' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'state', tipo: "'idle' | 'drag-over' | 'uploading' | 'success' | 'error'", default: "'idle'", descricao: 'Estado visual da zona de upload' },
            { prop: 'onStateChange', tipo: '(state: FileUploadState) => void', default: '—', descricao: 'Callback ao mudar estado (para simulação)' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='button' clicável · aria-label='Clique ou arraste o arquivo aqui' · Região: role='region' com aria-label='Zona de upload'"
            keyboard="Tab para focar · Enter ou Space para abrir seletor de arquivo"
            screenReader="Estado atual anunciado via aria-live='polite': 'Enviando...', 'Arquivo recebido', 'Erro: formato não reconhecido'"
            contrast="Estados idle/uploading: borderDefault dashed — compensar com label de texto sempre visível"
            focus="focusRing no container em estados idle e error · Estados uploading e success: não focável (aria-disabled)"
          /> },
        ]}
      />
      {states.map(s => (
        <div key={s}>
          <SectionLabel>{s}</SectionLabel>
          <Labeled component="DSFileUpload" props={`state="${s}"`}>
            <DSFileUpload key={s} state={s} />
          </Labeled>
        </div>
      ))}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  return <p style={{ fontSize: '11px', fontWeight: 600, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', fontFamily: t.fontFamily }}>{children}</p>
}
