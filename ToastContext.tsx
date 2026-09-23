import React, { createContext, useContext, useState, useCallback } from 'react'
import { DSToastItem } from './DSToast'
import { useTheme } from './ThemeContext'

type ToastVariant = 'success' | 'warning' | 'error' | 'info'

interface Toast {
  id: string
  variant: ToastVariant
  message: string
}

interface ToastContextValue {
  showToast: (variant: ToastVariant, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { tokens: t } = useTheme()
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((variant: ToastVariant, message: string) => {
    const id = String(Date.now())
    setToasts(prev => [...prev, { id, variant, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }, [])

  const dismiss = (id: string) => setToasts(prev => prev.filter(toast => toast.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: t.space6,
          right: t.space6,
          display: 'flex',
          flexDirection: 'column',
          gap: t.space2,
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <div key={toast.id} style={{ pointerEvents: 'all' }}>
            <DSToastItem
              variant={toast.variant}
              message={toast.message}
              dismissible
              onDismiss={() => dismiss(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
