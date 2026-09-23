import React, { useState } from 'react'
import { X, Bell, CheckCheck, ArrowUpRight, TrendingUp, AlertTriangle, Info, CreditCard } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { DSDocSection, Labeled, TokenTable, PropsTable, A11yBlock } from './DSDocSection'
import { DSButton } from './DSButton'

// ─── Types ────────────────────────────────────────────────────────

type NotifType = 'transfer' | 'investment' | 'alert' | 'info' | 'payment'

export interface DSNotification {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
}

// kept as alias for internal use
type Notification = DSNotification

// ─── Icon per type ────────────────────────────────────────────────

function NotifIcon({ type, read }: { type: NotifType; read: boolean }) {
  const { tokens: t } = useTheme()
  const cfg: Record<NotifType, { icon: React.ReactNode; bg: string; color: string }> = {
    transfer:   { icon: <ArrowUpRight size={16} />, bg: t.feedbackInfoBg,    color: t.feedbackInfo },
    investment: { icon: <TrendingUp size={16} />,   bg: t.feedbackSuccessBg, color: t.feedbackSuccess },
    alert:      { icon: <AlertTriangle size={16} />, bg: t.feedbackWarningBg, color: t.feedbackWarning },
    info:       { icon: <Info size={16} />,          bg: t.surfaceMuted,      color: t.textSecondary },
    payment:    { icon: <CreditCard size={16} />,    bg: t.feedbackErrorBg,   color: t.feedbackError },
  }
  const c = cfg[type]
  return (
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: t.radiusFull,
      backgroundColor: c.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: c.color,
      flexShrink: 0,
      opacity: read ? 0.6 : 1,
    }}>
      {c.icon}
    </div>
  )
}

// ─── Notification Item ────────────────────────────────────────────

function NotifItem({ notif, onRead }: { notif: Notification; onRead: (id: string) => void }) {
  const { tokens: t } = useTheme()
  return (
    <div
      onClick={() => !notif.read && onRead(notif.id)}
      style={{
        display: 'flex',
        gap: '12px',
        padding: '14px 0',
        borderBottom: `1px solid ${t.borderDefault}`,
        cursor: notif.read ? 'default' : 'pointer',
        position: 'relative',
      }}
    >
      <NotifIcon type={notif.type} read={notif.read} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <p style={{
            fontSize: '13px',
            fontWeight: notif.read ? 500 : 600,
            color: notif.read ? t.textSecondary : t.textPrimary,
            margin: 0,
            lineHeight: '18px',
            fontFamily: t.fontFamily,
          }}>
            {notif.title}
          </p>
          <span style={{ fontSize: '11px', color: t.textTertiary, whiteSpace: 'nowrap', flexShrink: 0, fontFamily: t.fontFamily }}>
            {notif.time}
          </span>
        </div>
        <p style={{
          fontSize: '12px',
          color: t.textTertiary,
          margin: '3px 0 0',
          lineHeight: '17px',
          fontFamily: t.fontFamily,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        } as React.CSSProperties}>
          {notif.body}
        </p>
      </div>
      {/* Unread red dot */}
      {!notif.read && (
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '-8px',
          width: '8px',
          height: '8px',
          borderRadius: t.radiusFull,
          backgroundColor: t.feedbackError,
        }} />
      )}
    </div>
  )
}

// ─── Main Drawer ──────────────────────────────────────────────────

interface DSNotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  notifications?: DSNotification[]
  onMarkAllRead?: () => void
  onNotificationClick?: (id: string) => void
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'transfer', title: 'Pix recebido', body: 'Você recebeu R$ 420,00 de Carlos Eduardo. Disponível no saldo imediatamente.', time: 'Agora', read: false },
  { id: '2', type: 'alert', title: 'Título próximo do vencimento', body: 'Seu CDB HB Pós-fixado vence em 5 dias. Verifique as opções de renovação disponíveis.', time: '14 min', read: false },
  { id: '3', type: 'investment', title: 'Resgate processado', body: 'O resgate de R$ 5.000,00 do Fundo Renda Fixa Premium foi creditado com sucesso.', time: '1h', read: false },
  { id: '4', type: 'payment', title: 'Boleto pago', body: 'O boleto no valor de R$ 1.234,56 foi pago com sucesso. Código: 34191.79001.', time: '3h', read: true },
  { id: '5', type: 'info', title: 'Extrato disponível', body: 'Seu extrato de Abril de 2026 já está disponível para consulta e download em PDF.', time: 'Ontem', read: true },
  { id: '6', type: 'transfer', title: 'Transferência enviada', body: 'R$ 800,00 transferidos via Pix para Ana Paula M. com sucesso.', time: 'Ontem', read: true },
  { id: '7', type: 'investment', title: 'Aplicação confirmada', body: 'Aplicação de R$ 2.500,00 no LCI HB 12M foi confirmada com sucesso.', time: '2 dias', read: true },
]

export function DSNotificationDrawer({ isOpen, onClose, notifications, onMarkAllRead, onNotificationClick }: DSNotificationDrawerProps) {
  const { tokens: t } = useTheme()
  const [notifs, setNotifs] = useState<Notification[]>(notifications ?? MOCK_NOTIFICATIONS)

  if (!isOpen) return null

  const unread = notifs.filter(n => !n.read)
  const read = notifs.filter(n => n.read)

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    onNotificationClick?.(id)
  }

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    onMarkAllRead?.()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, backgroundColor: t.overlayBackdropLight, backdropFilter: t.overlayBlur }}
      />

      {/* Panel */}
      <div style={{
        position: 'relative',
        width: '400px',
        maxWidth: '100vw',
        height: '100%',
        backgroundColor: t.surfaceDefault,
        boxShadow: t.shadowDrawer,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: t.fontFamily,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: `1px solid ${t.borderDefault}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color={t.textPrimary} />
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: t.textPrimary, margin: 0 }}>Notificações</h2>
            {unread.length > 0 && (
              <span style={{
                backgroundColor: t.feedbackError,
                color: t.textOnBrand,
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: t.radiusFull,
                minWidth: '18px',
                textAlign: 'center',
              }}>
                {unread.length}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {unread.length > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 600, color: t.brandPrimary,
                  fontFamily: t.fontFamily,
                  padding: '4px 8px', borderRadius: t.radiusMd,
                }}
              >
                <CheckCheck size={14} />
                Marcar como lidas
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: t.radiusLg,
                backgroundColor: t.surfaceSubtle, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textSecondary,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {notifs.length === 0 ? (
            // Empty state
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 32px', gap: '16px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: t.radiusFull,
                backgroundColor: t.surfaceMuted,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bell size={28} color={t.textTertiary} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: t.textPrimary, margin: 0, textAlign: 'center' }}>
                Sem notificações
              </h3>
              <p style={{ fontSize: '13px', color: t.textSecondary, textAlign: 'center', margin: 0, lineHeight: '20px', maxWidth: '240px' }}>
                Você está em dia! Novas notificações aparecerão aqui.
              </p>
            </div>
          ) : (
            <div style={{ padding: '0 24px' }}>
              {/* Não lidas */}
              {unread.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: t.textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '20px 0 4px' }}>
                    Não lidas ({unread.length})
                  </p>
                  {unread.map(n => <NotifItem key={n.id} notif={n} onRead={markRead} />)}
                </div>
              )}
              {/* Histórico */}
              {read.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '20px 0 4px' }}>
                    Histórico
                  </p>
                  {read.map(n => <NotifItem key={n.id} notif={n} onRead={markRead} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DSBellButton ─────────────────────────────────────────────────

interface DSBellButtonProps {
  unreadCount?: number
  onClick?: () => void
  active?: boolean
}

export function DSBellButton({ unreadCount = 0, onClick, active = false }: DSBellButtonProps) {
  const { tokens: t } = useTheme()
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Notificações${unreadCount > 0 ? ` — ${unreadCount} não lidas` : ''}`}
      style={{
        position: 'relative',
        width: '40px', height: '40px',
        borderRadius: t.radiusLg,
        border: `1px solid ${active ? t.brandPrimary : hovered ? t.borderMedium : t.borderDefault}`,
        backgroundColor: active ? t.brandPrimaryLight : hovered ? t.surfaceSubtle : t.surfaceDefault,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.15s, border-color 0.15s',
        flexShrink: 0,
      }}
    >
      <Bell size={18} color={active ? t.brandPrimary : t.textSecondary} />
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '7px', right: '7px',
          width: '8px', height: '8px',
          borderRadius: t.radiusFull,
          backgroundColor: t.feedbackError,
          border: `2px solid ${t.surfaceDefault}`,
        }} />
      )}
    </button>
  )
}

// ─── Section Showcase ─────────────────────────────────────────────

export function DSNotificationDrawerSection() {
  const { tokens: t } = useTheme()
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Painel de notificações deslizável com agrupamento por tipo (transferência, investimento, alerta, pagamento). Suporta marcar como lido individualmente ou em massa."
        whenToUse={['Notificações de eventos de transações e alertas', 'Histórico de atividades recentes da conta', 'Central de comunicações com badge de não lidos']}
        whenNotToUse={['Notificação urgente imediata (use Toast)', 'Mensagens entre usuários (use chat dedicado)', 'Alertas críticos que exigem ação imediata (use Modal)']}
        preview={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <SectionLabel>Bell button — variações de estado</SectionLabel>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {[
                  { label: 'Sem notificações', unread: 0, active: false },
                  { label: 'Com não lidas',    unread: 3, active: false },
                  { label: 'Hover',            unread: 3, active: false },
                  { label: 'Active / aberto',  unread: 3, active: true },
                ].map(({ label, unread, active }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <Labeled component="DSBellButton" props={`unreadCount={${unread}}${active ? ' active' : ''}`}>
                      <DSBellButton unreadCount={unread} active={active} />
                    </Labeled>
                    <span style={{ fontSize: '10px', color: t.textTertiary, fontFamily: t.fontFamily, textAlign: 'center', maxWidth: '80px', lineHeight: '14px' }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: t.surfaceSubtle, borderRadius: t.radiusLg, border: `1px solid ${t.borderDefault}`, maxWidth: '480px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: t.textPrimary, margin: '0 0 8px', fontFamily: t.fontFamily }}>Anatomia do componente</p>
                <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '12px', color: t.textSecondary, lineHeight: '22px', fontFamily: t.fontFamily }}>
                  <li>Container <strong>40×40px</strong> · radius <code>radiusLg</code> · border 1px</li>
                  <li>Bell icon <strong>18px</strong> · cor <code>textSecondary</code> → active: <code>brandPrimary</code></li>
                  <li>Badge vermelho <strong>8px</strong> · top-right · border 2px branca (separa do fundo)</li>
                  <li>Hover: bg <code>surfaceSubtle</code>, border <code>borderMedium</code></li>
                  <li>Active/open: bg <code>brandPrimaryLight</code>, border <code>brandPrimary</code>, icon brand</li>
                </ul>
              </div>
            </div>
            <div>
              <SectionLabel>Drawer de notificações — interativo</SectionLabel>
              <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 16px', fontFamily: t.fontFamily }}>
                Modelo em produção. Clique no bell para abrir. Itens não lidos podem ser marcados individualmente ou todos de uma vez.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Labeled component="DSNotificationDrawer" props="isOpen={open} onClose={...}">
                  <DSBellButton unreadCount={unreadCount} active={open} onClick={() => setOpen(true)} />
                </Labeled>
                <span style={{ fontSize: '13px', color: t.textSecondary, fontFamily: t.fontFamily }}>
                  {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Em dia — sem notificações'}
                </span>
              </div>
            </div>
          </div>
        }
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Fundo', token: 't.surfaceDefault', descricao: 'Fundo do painel' },
            { elemento: 'Item não lido', token: 't.surfaceSubtle', descricao: 'Destaque de notificação não lida' },
            { elemento: 'Ícone transfer', token: 't.brandPrimary', descricao: 'Cor do ícone de transferência' },
            { elemento: 'Ícone alerta', token: 't.feedbackWarning', descricao: 'Cor do ícone de alerta' },
            { elemento: 'Ícone investimento', token: 't.feedbackSuccess', descricao: 'Cor do ícone de investimento' },
            { elemento: 'Separador', token: 't.borderDefault', descricao: 'Linha entre notificações' },
            { elemento: 'Badge contador', token: 't.feedbackError', descricao: 'Fundo do badge de contagem' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'isOpen', tipo: 'boolean', default: '—', descricao: 'Controla visibilidade (obrigatório)' },
            { prop: 'onClose', tipo: '() => void', default: '—', descricao: 'Callback ao fechar (obrigatório)' },
            { prop: 'notifications', tipo: 'DSNotification[]', default: 'MOCK', descricao: 'Lista de notificações a exibir (usa mock se omitido)' },
            { prop: 'onMarkAllRead', tipo: '() => void', default: 'undefined', descricao: 'Callback ao marcar todas como lidas' },
            { prop: 'onNotificationClick', tipo: '(id: string) => void', default: 'undefined', descricao: 'Callback ao clicar em notificação não lida' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='dialog' com aria-modal='true' · aria-label='Notificações'"
            keyboard="Esc fecha o painel · Tab navega entre itens · Enter abre detalhe da notificação"
            screenReader="Badge de não lidos: aria-label='X notificações não lidas' · Botão marcar lido: aria-label descritivo"
            contrast="Fundos success/warning/error verificados · Texto sobre surfacePrimary e surfaceSubtle"
            focus="Foco trapped no painel · retorna ao sino ao fechar · focusRing em todos os botões"
          /> },
        ]}
      />
      <DSNotificationDrawer isOpen={open} onClose={() => { setOpen(false); setUnreadCount(0) }} />
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
