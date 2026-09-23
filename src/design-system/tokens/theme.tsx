/**
 * DS Matriz — ThemeProvider e useTheme Hook
 *
 * Sistema de temas reativo via React Context.
 * REGRA CRÍTICA: Todos os componentes de produto DEVEM usar `useTheme()` para acessar tokens.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeOverride, defaultOverride } from './types';
import { getTokens, Tokens } from './tokens';

/**
 * Tipo do contexto de tema
 */
interface ThemeContextValue {
  /** Override atualmente ativo */
  override: ThemeOverride;

  /** Objeto de tokens calculado a partir do override */
  tokens: Tokens;

  /** Função para trocar o tema em runtime */
  setOverride: (override: ThemeOverride) => void;
}

/**
 * Contexto de tema (interno)
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * ThemeProvider — Provedor de tema para a aplicação
 *
 * Encapsula a aplicação e distribui tokens via Context.
 * Re-calcula tokens a cada mudança de override via setOverride.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<ThemeOverride>(defaultOverride);

  // Calcula tokens a cada render (quando override muda)
  const tokens = getTokens(override);

  const value: ThemeContextValue = {
    override,
    tokens,
    setOverride,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme — Hook para acessar tokens e tema
 *
 * Retorna o contexto de tema com tokens reativos.
 * OBRIGATÓRIO em todos os componentes de produto.
 *
 * @returns {ThemeContextValue} Objeto com `override`, `tokens` e `setOverride`
 *
 * @example
 * ```tsx
 * function DSButton() {
 *   const { tokens: t } = useTheme();
 *   return (
 *     <button style={{ backgroundColor: t.brandPrimary, color: t.textOnBrand }}>
 *       Click me
 *     </button>
 *   );
 * }
 * ```
 *
 * @throws {Error} Se usado fora de ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de <ThemeProvider>');
  }

  return context;
}

/**
 * withTheme — HOC para injetar tokens em componentes de classe (legacy)
 *
 * @deprecated Prefira usar useTheme() em componentes funcionais
 */
export function withTheme<P extends { tokens: Tokens }>(
  Component: React.ComponentType<P>
) {
  return (props: Omit<P, 'tokens'>) => {
    const { tokens } = useTheme();
    return <Component {...(props as P)} tokens={tokens} />;
  };
}
