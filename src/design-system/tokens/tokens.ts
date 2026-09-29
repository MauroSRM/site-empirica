/**
 * DS Matriz — Sistema de Tokens
 *
 * Tokens estáticos e função getTokens para cálculo de tokens derivados.
 * IMPORTANTE: Import estático (`import { t }`) NÃO reage a mudanças de tema.
 * Use `useTheme()` hook em todos os componentes de produto.
 */

import { ThemeOverride, defaultOverride } from './types';
import { shadeColor, hexToRgba, getSpacingFactor } from './utils';

/**
 * Tokens estáticos — valores fixos que não mudam com ThemeOverride
 */
const staticTokens = {
  // ═══ PRIMARY SCALE (azul HB Digital) ═══
  primary50: '#f0f5fd',
  primary100: '#dce8fa',
  primary200: '#b9d1f5',
  primary300: '#8db5ed',
  primary400: '#5d91e0',
  primary500: '#1d3f80',
  primary600: '#163462',
  primary700: '#122a52',
  primary800: '#0e2041',
  primary900: '#0a1630',

  // ═══ ACCENT SCALE (laranja) ═══
  accent100: '#ffe6cc',
  accent500: '#ff8200',
  accent700: '#cc6600',

  // ═══ NEUTRAL SCALE (cinza) ═══
  neutral0: '#ffffff',
  neutral50: '#f9fafb',
  neutral100: '#e0e7f4',
  neutral200: '#e5e7eb',
  neutral300: '#d1d5db',
  neutral400: '#9ca3af',
  neutral500: '#6b7280',
  neutral700: '#374151',
  neutral900: '#111827',
  neutral950: '#0c0c0c',

  // ═══ FEEDBACK SCALE ═══
  feedbackSuccess: '#059669',
  feedbackSuccessBg: '#edfaf4',
  feedbackSuccessText: '#047857', // WCAG AA ~4.7:1 sobre feedbackSuccessBg
  feedbackWarning: '#b25b00',
  feedbackWarningBg: '#fffcdf',
  feedbackError: '#d30000',
  feedbackErrorBg: '#fff0f0',
  borderError: '#dc2626',
  error600: '#dc2626', // Alias para DSButton destructive hover

  // ═══ SURFACE TOKENS ═══
  surfaceDefault: '#ffffff', // Alias de neutral0
  surfaceSubtle: '#f9fafb', // Alias de neutral50
  surfaceMuted: '#e0e7f4', // Alias de neutral100
  surfaceInverse: '#1e2b44', // Dark surface
  surfaceSelected: '#f7fafd', // Selected row (mais suave que primary50)

  // ═══ BORDER TOKENS ═══
  borderDefault: '#e5e7eb', // Alias de neutral200
  borderSubtle: '#f0f2f6',
  borderMedium: '#d1d5db', // Alias de neutral300
  borderStrong: '#9ca3af', // Alias de neutral400
  borderSelected: '#2758b5', // Para accordions selecionados

  // ═══ TEXT TOKENS ═══
  textPrimary: '#0c0c0c', // Alias de neutral950
  textSecondary: '#6b7280', // Alias de neutral500
  textTertiary: '#9ca3af', // Alias de neutral400
  textDisabled: '#9ca3af',
  textOnBrand: '#ffffff', // Texto sobre brandPrimary
  textFundoName: '#0e2e6e', // Fixed (não reage a ThemeOverride)
  textFundoLabel: '#081e47', // Fixed (não reage a ThemeOverride)

  // ═══ TAG TOKENS ═══
  tagNeutralBg: '#f0f2f6',
  tagNeutralColor: '#374151',

  // ═══ OVERLAY TOKENS ═══
  overlaySubtle: 'rgba(0,0,0,0.04)', // Hover overlay neutro
  overlayMedium: 'rgba(0,0,0,0.40)', // Loading states
  overlayBackdrop: 'rgba(0,0,0,0.50)', // Modal backdrop

  // ═══ SPACING TOKENS (estáticos) ═══
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '20px',
  space6: '24px',
  space8: '32px',
  space10: '40px',
  paddingPage: '56px',

  // ═══ RADIUS TOKENS (estáticos) ═══
  radiusNone: '0px',
  radiusXs: '2px',
  radiusSm: '3px',
  radiusMd: '4px',
  radiusLg: '6px',
  radiusXl: '8px',
  radius2xl: '12px',
  radius3xl: '16px',
  radiusFull: '9999px',

  // ═══ TYPOGRAPHY TOKENS ═══
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  textXs: '9px',
  text10: '10px',
  textSm: '11px',
  text2Xs: '12px',
  textMd: '13px',
  textLg: '14px',
  textXl: '15px',
  text16: '16px',
  text2xl: '18px',
  text24: '24px',
  text3xl: '28px',

  // ═══ STRUCTURAL DIMENSIONS ═══
  navHeight: '80px',
  navHeightScroll: '64px',
  bottomNavHeight: '64px',
  modalWidth: '540px',
  toastWidth: '360px',
  toastDismissMs: 4000,

  // ═══ SHADOW TOKENS ═══
  shadowSm: '0 1px 2px rgba(0,0,0,0.05)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.07)',
  shadowLg: '0 10px 15px rgba(0,0,0,0.10)',
  shadowCard: '0 1px 3px rgba(0,0,0,0.08)',
  shadowDropdown: '0 4px 12px rgba(0,0,0,0.12)',
  shadowModal: '0 20px 40px rgba(0,0,0,0.20)',
  shadowToast: '0 8px 16px rgba(0,0,0,0.15)',
  shadowNav: '0 2px 8px rgba(0,0,0,0.06)',
} as const;

/**
 * getTokens — Calcula objeto de tokens completo com override aplicado
 *
 * Função pura que recebe ThemeOverride e retorna tokens completos incluindo derivados.
 *
 * @param override - Objeto com knobs mutáveis de tema
 * @returns Objeto de tokens completo
 *
 * IMPORTANTE: Tokens derivados são recalculados a cada chamada.
 * ThemeProvider chama esta função a cada render para garantir reatividade.
 */
export function getTokens(override: ThemeOverride = {}) {
  // 1. Extrai knobs do override com fallback para defaults
  const bp = override.brandPrimary ?? defaultOverride.brandPrimary;
  const ba = override.brandAccent ?? defaultOverride.brandAccent;
  const sec = override.brandSecondary ?? defaultOverride.brandSecondary;
  const surfBg = override.surfaceBackground ?? defaultOverride.surfaceBackground;
  const btnRadius = override.buttonRadius ?? defaultOverride.buttonRadius;
  const inpRadius = override.inputRadius ?? defaultOverride.inputRadius;
  const crdRadius = override.cardRadius ?? defaultOverride.cardRadius;
  const spcScale = override.spacingScale ?? defaultOverride.spacingScale;

  // 2. Calcula fator de spacing
  const factor = getSpacingFactor(spcScale);

  // 3. Tokens de spacing derivados
  const paddingCard = `${Math.round(16 * factor)}px`;
  const paddingSection = `${Math.round(24 * factor)}px`;
  const gapCard = `${Math.round(12 * factor)}px`;
  const gapSection = `${Math.round(16 * factor)}px`;

  // 4. Calcula tokens derivados de brandPrimary
  const brandPrimaryHover = shadeColor(bp, -15);
  const borderBrand = bp;
  const feedbackInfo = bp;
  const surfaceBrand = bp;
  const brandPrimaryLight = staticTokens.primary100; // Estático

  // 5. Calcula tokens derivados de brandAccent
  const brandAccentHover = shadeColor(ba, -20);
  const brandAccentStrong = shadeColor(ba, -20);
  const brandAccentLight = staticTokens.accent100; // Estático

  // 6. Calcula tokens derivados de brandSecondary
  const brand2 = sec;
  const brand2Light = shadeColor(sec, +40);
  const brand2Subtle = shadeColor(sec, +70);

  // 7. Calcula focusRing dinamicamente
  const focusRing = `0 0 0 3px ${hexToRgba(bp, 0.35)}`;

  // 8. Retorna objeto completo: estáticos + derivados
  return {
    ...staticTokens,

    // Knobs mutáveis
    brandPrimary: bp,
    brandAccent: ba,
    brandSecondary: sec,
    surfaceBackground: surfBg,
    surfaceCanvas: surfBg, // Alias
    buttonRadius: btnRadius,
    inputRadius: inpRadius,
    cardRadius: crdRadius,
    spacingScale: spcScale,

    // Derivados de brandPrimary
    brandPrimaryHover,
    brandPrimaryLight,
    borderBrand,
    feedbackInfo,
    surfaceBrand,
    feedbackInfoBg: staticTokens.primary50, // Estático

    // Derivados de brandAccent
    brandAccentHover,
    brandAccentStrong,
    brandAccentLight,

    // Derivados de brandSecondary
    brand2,
    brand2Light,
    brand2Subtle,

    // Spacing derivados
    paddingCard,
    paddingSection,
    gapCard,
    gapSection,

    // Focus ring
    focusRing,
  };
}

/**
 * t — Tokens estáticos para uso fora do ciclo React
 *
 * ATENÇÃO: Estes tokens NÃO reagem a mudanças de tema.
 * Use APENAS em: utilitários, showcases, código fora de componentes React.
 * Em componentes de produto, SEMPRE use `const { tokens: t } = useTheme()`.
 */
export const t = getTokens(defaultOverride);

/**
 * Tipo inferido do objeto de tokens completo
 */
export type Tokens = ReturnType<typeof getTokens>;
