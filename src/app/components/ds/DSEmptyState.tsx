/**
 * DSEmptyState — DS Matriz v04
 * Spec: seção 4.46
 * Variantes: 'no-data' | 'search' | 'error' | 'offline'
 */
import React, { ReactNode } from "react";
import { Inbox, Search, AlertCircle, WifiOff } from "lucide-react";
import { useTheme } from "../../../design-system";

export type EmptyVariant = 'no-data' | 'search' | 'error' | 'offline';

export interface DSEmptyStateProps {
  variant?:     EmptyVariant;
  title?:       string;
  description?: string;
  actions?:     ReactNode;
  icon?:        ReactNode;
  card?:        boolean;
}

export function DSEmptyState({
  variant = 'no-data', title, description, actions, icon, card = true,
}: DSEmptyStateProps) {
  const { tokens: t } = useTheme();

  // variantConfig DENTRO do componente, após useTheme — regra DS v04
  const variantConfig: Record<EmptyVariant, { Icon: React.ElementType; color: string }> = {
    'no-data': { Icon: Inbox,       color: t.textTertiary  },
    'search':  { Icon: Search,      color: t.textTertiary  },
    'error':   { Icon: AlertCircle, color: t.feedbackError },
    'offline': { Icon: WifiOff,     color: t.textTertiary  },
  };

  const cfg = variantConfig[variant];
  const defaultTitle: Record<EmptyVariant, string> = {
    'no-data': 'Nenhum dado encontrado',
    'search':  'Nenhum resultado encontrado',
    'error':   'Ocorreu um erro',
    'offline': 'Sem conexão',
  };

  const inner = (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center", padding: "64px 32px",
    }}>
      <div style={{ color: cfg.color, marginBottom: t.space4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon ?? <cfg.Icon size={32} color={cfg.color} />}
      </div>
      <p style={{
        fontFamily: t.fontFamily, fontSize: t.textLg, fontWeight: 600,
        color: t.textSecondary, margin: `0 0 ${t.space2}`,
      }}>
        {title ?? defaultTitle[variant]}
      </p>
      {description && (
        <p style={{
          fontFamily: t.fontFamily, fontSize: t.text2Xs,
          color: t.textTertiary, margin: 0, lineHeight: 1.55, maxWidth: 360,
        }}>
          {description}
        </p>
      )}
      {actions && (
        <div style={{ marginTop: t.space6, display: "flex", gap: t.space3, justifyContent: "center", flexWrap: "wrap" }}>
          {actions}
        </div>
      )}
    </div>
  );

  if (!card) return inner;

  return (
    <div style={{
      background: t.surfaceDefault, border: `2px dashed ${t.borderDefault}`,
      borderRadius: t.radiusXl, boxShadow: t.shadowCard,
    }}>
      {inner}
    </div>
  );
}
