/**
 * DS Matriz — Funções Utilitárias de Tokens
 *
 * Funções puras para manipulação de cores e cálculos de tokens derivados.
 */

/**
 * shadeColor — Ajusta brilho de uma cor hex
 *
 * @param hex - Cor em formato hex (#RRGGBB)
 * @param delta - Valor a somar a cada canal RGB (positivo = clarear, negativo = escurecer)
 * @returns Cor ajustada em formato hex
 *
 * @example
 * shadeColor('#2758b5', -15) // → '#1e4a9e' (mais escuro)
 * shadeColor('#1e6b55', +40) // → '#469680' (mais claro)
 */
export function shadeColor(hex: string, delta: number): string {
  // Remove # se presente
  const color = hex.replace('#', '');

  // Parse RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Aplica delta e clamp entre 0-255
  const newR = Math.max(0, Math.min(255, r + delta));
  const newG = Math.max(0, Math.min(255, g + delta));
  const newB = Math.max(0, Math.min(255, b + delta));

  // Converte de volta para hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * hexToRgba — Converte hex para rgba com alpha
 *
 * @param hex - Cor em formato hex (#RRGGBB)
 * @param alpha - Valor de transparência (0.0 a 1.0)
 * @returns String CSS rgba(r,g,b,alpha)
 *
 * @example
 * hexToRgba('#2758b5', 0.35) // → 'rgba(39,88,181,0.35)'
 */
export function hexToRgba(hex: string, alpha: number): string {
  const color = hex.replace('#', '');

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * getSpacingFactor — Retorna fator multiplicador de spacing
 *
 * @param scale - Escala de espaçamento
 * @returns Fator multiplicador
 */
export function getSpacingFactor(scale: 'compact' | 'normal' | 'spacious'): number {
  switch (scale) {
    case 'compact':
      return 0.75;
    case 'spacious':
      return 1.3;
    case 'normal':
    default:
      return 1.0;
  }
}
