/**
 * DS Matriz — Tipos do Sistema de Tokens
 *
 * Define tipos TypeScript para o sistema de temas e tokens.
 */

/**
 * ThemeOverride — Knobs mutáveis por tema
 *
 * Todos os campos são opcionais. Valores não fornecidos caem em defaults do tema HB Digital.
 */
export interface ThemeOverride {
  /** Nome descritivo do tema */
  themeName?: string;

  /** Cor primária de marca (hex) */
  brandPrimary?: string;

  /** Cor de destaque/accent (hex) */
  brandAccent?: string;

  /** Cor secundária (hex) */
  brandSecondary?: string;

  /** Fundo do canvas da aplicação (hex) */
  surfaceBackground?: string;

  /** Border-radius de botões (CSS) */
  buttonRadius?: string;

  /** Border-radius de inputs (CSS) */
  inputRadius?: string;

  /** Border-radius de cards (CSS) */
  cardRadius?: string;

  /** Escala de espaçamento global */
  spacingScale?: 'compact' | 'normal' | 'spacious';
}

/**
 * defaultOverride — Configuração padrão do tema HB Digital
 */
export const defaultOverride: Required<ThemeOverride> = {
  themeName: 'HB Digital',
  brandPrimary: '#1d3f80',
  brandAccent: '#14365c',
  brandSecondary: '#1e6b55',
  surfaceBackground: '#eef2f9',
  buttonRadius: '3px',
  inputRadius: '4px',
  cardRadius: '4px',
  spacingScale: 'normal',
};
