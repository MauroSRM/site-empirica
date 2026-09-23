/**
 * SrmButton — Componente oficial de botão do SRM Website (Design System)
 *
 * Figma: KEVpcLeDAcNldXUS7RzZnm / node 138-5017
 *
 * Variantes  : primary | secondary | ghost
 * Temas      : light (fundos brancos/cinza) | dark (hero, footer, CTA)
 * Tamanhos   : normal (48px/px-24, 14px) | medium (40px/px-20, 13px) | small (32px/px-16, 12px)
 * Estados    : default | hover | active/focus | disabled | loading
 *
 * Animações (spec exata do Figma):
 *  Primary  → overlay sweep left→right via translateX(-100% → 0), 250ms ease-in-out
 *  Secondary→ background fade-in via opacity, 250ms ease-in-out
 *  Ghost    → text color #162e61 → #ff8200 (light) | #c7d9ff → #ff8200 (dark)
 *
 * 100% inline styles — zero classes Tailwind.
 */

import React, { useState, CSSProperties } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from '../../../../design-system';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SrmBtnVariant = "primary" | "secondary" | "ghost";
export type SrmBtnSize    = "normal"  | "medium"    | "small";
export type SrmBtnTheme   = "light"   | "dark";

export interface SrmButtonProps {
  variant?   : SrmBtnVariant;
  size?      : SrmBtnSize;
  theme?     : SrmBtnTheme;
  iconLeft?  : React.ReactNode;
  iconRight? : React.ReactNode;
  fullWidth? : boolean;
  loading?   : boolean;
  disabled?  : boolean;
  onClick?   : React.MouseEventHandler<HTMLButtonElement>;
  href?      : string;
  target?    : string;
  ariaLabel? : string;
  style?     : CSSProperties;
  children?  : React.ReactNode;
}

// ─── Size tokens ──────────────────────────────────────────────────────────────

const SIZES: Record<SrmBtnSize, {
  height: number | "auto";
  px: number;
  fontSize: number;
  iconSize: number;
  gap: number;
}> = {
  normal: { height: 48,     px: 24, fontSize: 14, iconSize: 16, gap: 8 },
  medium: { height: 40,     px: 20, fontSize: 13, iconSize: 14, gap: 8 },
  small:  { height: 32,     px: 16, fontSize: 12, iconSize: 12, gap: 8 },
};

const RADIUS = 3;
const TRANS  = "250ms ease-in-out";

// ─── Keyframes (singleton inject) ─────────────────────────────────────────────

let _kfInjected = false;
function SrmButtonKeyframes() {
  if (typeof document === "undefined" || _kfInjected) return null;
  _kfInjected = true;
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes srm-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `}} />
  );
}

// ─── SrmButton ────────────────────────────────────────────────────────────────

export function SrmButton({
  variant   = "primary",
  size      = "normal",
  theme     = "light",
  iconLeft,
  iconRight,
  fullWidth = false,
  loading   = false,
  disabled  = false,
  onClick,
  href,
  target,
  ariaLabel,
  style: externalStyle,
  children,
}: SrmButtonProps) {
  const { tokens: t } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isDisabled = disabled || loading;
  const sz = SIZES[size];

  // ─── Color tokens (calculated from DS tokens) ─────────────────────────────────
  const FONT = t.fontFamily;
  const FOCUS_RING_PRIMARY = `4px solid ${t.primary100}`;
  const FOCUS_RING_ACCENT = `4px solid ${t.brandAccent}`;

  const TOKENS = {
    primary: {
      light: {
        bg:             t.primary700,
        overlayColor:   t.primary600,
        overlayActive:  `rgba(77,142,255,0.75)`,
        text:           t.surfaceMuted,
        textDisabled:   t.textTertiary,
        bgDisabled:     `rgba(22,46,97,0.4)`,
        focusRing:      FOCUS_RING_PRIMARY,
      },
      dark: {
        bg:             `linear-gradient(90deg, #ff9928 0%, ${t.brandAccent} 100%)`,
        overlayColor:   `linear-gradient(90deg, #e06800 0%, #c85a00 100%)`,
        overlayActive:  `linear-gradient(90deg, #c85a00 0%, #a84500 100%)`,
        text:           t.textOnBrand,
        textDisabled:   `rgba(255,255,255,0.45)`,
        bgDisabled:     `linear-gradient(90deg, #c78039 0%, #b4712c 100%)`,
        focusRing:      FOCUS_RING_ACCENT,
      },
    },
    secondary: {
      light: {
        bg:             "transparent",
        border:         `2px solid ${t.primary700}`,
        borderDisabled: `2px solid rgba(22,46,97,0.4)`,
        text:           t.primary700,
        textDisabled:   `rgba(22,46,97,0.4)`,
        bgHover:        `rgba(225,236,255,0.5)`,
        focusRing:      FOCUS_RING_PRIMARY,
      },
      dark: {
        bg:             "transparent",
        border:         `2px solid ${t.primary100}`,
        borderDisabled: `2px solid #2d3d52`,
        text:           t.primary100,
        textHover:      t.primary700,
        textDisabled:   t.textTertiary,
        bgHover:        `rgba(225,236,255,0.5)`,
        focusRing:      FOCUS_RING_PRIMARY,
      },
    },
    ghost: {
      light: {
        text:           t.primary700,
        textHover:      t.brandAccent,
        textDisabled:   `rgba(22,46,97,0.4)`,
        focusRing:      FOCUS_RING_PRIMARY,
      },
      dark: {
        text:           t.primary100,
        textHover:      t.brandAccent,
        textDisabled:   t.primary100,
        focusRing:      FOCUS_RING_PRIMARY,
      },
    },
  } as const;

  // ─── Ghost ────────────────────────────────────────────────────────────────
  if (variant === "ghost") {
    const tk = TOKENS.ghost[theme];
    const ghostColor =
      isDisabled ? tk.textDisabled :
      hovered    ? tk.textHover :
      tk.text;

    const ghostStyle: CSSProperties = {
      display:        "inline-flex",
      alignItems:     "center",
      gap:            sz.gap,
      height:         "auto",
      padding:        0,
      background:     "none",
      border:         "none",
      borderRadius:   RADIUS,
      outline:        focused && !isDisabled ? tk.focusRing : "none",
      outlineOffset:  2,
      fontFamily:     FONT,
      fontSize:       13,
      fontWeight:     500,
      letterSpacing:  "-0.22px",
      lineHeight:     "normal",
      color:          ghostColor,
      cursor:         isDisabled ? "not-allowed" : "pointer",
      opacity:        isDisabled && theme === "dark" ? 0.4 : 1,
      pointerEvents:  isDisabled ? "none" : "auto",
      textDecoration: "none",
      transition:     `color ${TRANS}`,
      userSelect:     "none",
      whiteSpace:     "nowrap",
      width:          fullWidth ? "100%" : "auto",
      ...externalStyle,
    };

    const handlers = isDisabled ? {} : {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus:      () => setFocused(true),
      onBlur:       () => setFocused(false),
      onClick,
    };

    const inner = (
      <>
        {iconLeft && <span style={{ display: "flex", alignItems: "center", width: sz.iconSize, height: sz.iconSize, flexShrink: 0 }}>{iconLeft}</span>}
        {children}
        {iconRight && <span style={{ display: "flex", alignItems: "center", width: sz.iconSize, height: sz.iconSize, flexShrink: 0 }}>{iconRight}</span>}
      </>
    );

    if (href && !isDisabled) {
      return (
        <>
          <SrmButtonKeyframes />
          <a href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}
            aria-label={ariaLabel} style={ghostStyle}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          >{inner}</a>
        </>
      );
    }
    return (
      <>
        <SrmButtonKeyframes />
        <button type="button" disabled={isDisabled} aria-label={ariaLabel} style={ghostStyle} {...handlers}>{inner}</button>
      </>
    );
  }

  // ─── Primary ──────────────────────────────────────────────────────────────
  if (variant === "primary") {
    const tk = TOKENS.primary[theme];

    const bg = isDisabled ? tk.bgDisabled : tk.bg;
    const textColor = isDisabled ? tk.textDisabled : tk.text;

    // Overlay: sweep translateX(-100% → 0) on hover
    // Active/Focus: full overlay visible (rgba(77,142,255,0.75) for light, hidden for dark)
    const overlayTranslate =
      isDisabled           ? "translateX(-100%)" :
      hovered              ? "translateX(0)"      :
      "translateX(-100%)";

    const baseStyle: CSSProperties = {
      display:        "inline-flex",
      alignItems:     "center",
      justifyContent: "center",
      position:       "relative",
      overflow:       "hidden",
      flexShrink:     0,
      width:          fullWidth ? "100%" : "auto",
      height:         sz.height,
      paddingLeft:    sz.px,
      paddingRight:   sz.px,
      paddingTop:     0,
      paddingBottom:  0,
      boxSizing:      "border-box",
      background:     bg,
      color:          textColor,
      border:         "none",
      borderRadius:   RADIUS,
      outline:        focused && !isDisabled ? tk.focusRing : "none",
      outlineOffset:  0,
      fontFamily:     FONT,
      fontSize:       sz.fontSize,
      fontWeight:     500,
      letterSpacing:  "-0.22px",
      lineHeight:     "normal",
      whiteSpace:     "nowrap",
      textDecoration: "none",
      cursor:         isDisabled ? "not-allowed" : "pointer",
      userSelect:     "none",
      transition:     `background ${TRANS}, color ${TRANS}`,
      ...externalStyle,
    };

    const handlers = isDisabled ? {} : {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus:      () => setFocused(true),
      onBlur:       () => setFocused(false),
      onClick,
    };

    const inner = (
      <>
        {/* Overlay — sweep left→right on hover */}
        {!isDisabled && (
          <span
            aria-hidden="true"
            style={{
              position:   "absolute",
              inset:      0,
              background: tk.overlayColor,
              transform:  overlayTranslate,
              transition: `transform ${TRANS}`,
              pointerEvents: "none",
              zIndex:     0,
            }}
          />
        )}

        {/* Content layer */}
        <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: sz.gap }}>
          {loading && (
            <Loader2 style={{ width: sz.iconSize, height: sz.iconSize, animation: "srm-spin 1s linear infinite", flexShrink: 0 }} />
          )}
          {!loading && iconLeft && (
            <span style={{ display: "flex", alignItems: "center", width: sz.iconSize, height: sz.iconSize, flexShrink: 0 }}>{iconLeft}</span>
          )}
          {children && <span style={{ display: "flex", alignItems: "center" }}>{children}</span>}
          {!loading && iconRight && (
            <span style={{ display: "flex", alignItems: "center", width: sz.iconSize, height: sz.iconSize, flexShrink: 0 }}>{iconRight}</span>
          )}
        </span>
      </>
    );

    if (href && !isDisabled) {
      return (
        <>
          <SrmButtonKeyframes />
          <a href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}
            aria-label={ariaLabel} style={baseStyle}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          >{inner}</a>
        </>
      );
    }
    return (
      <>
        <SrmButtonKeyframes />
        <button type="button" disabled={isDisabled} aria-label={ariaLabel} aria-busy={loading} style={baseStyle} {...handlers}>{inner}</button>
      </>
    );
  }

  // ─── Secondary ────────────────────────────────────────────────────────────
  const tk = TOKENS.secondary[theme];

  const secBorder = isDisabled ? tk.borderDisabled : tk.border;
  const secText   = isDisabled ? tk.textDisabled   : hovered && "textHover" in tk ? (tk as typeof TOKENS.secondary.dark).textHover : tk.text;

  const baseStyle: CSSProperties = {
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    position:       "relative",
    overflow:       "hidden",
    flexShrink:     0,
    width:          fullWidth ? "100%" : "auto",
    height:         sz.height,
    paddingLeft:    sz.px,
    paddingRight:   sz.px,
    paddingTop:     0,
    paddingBottom:  0,
    boxSizing:      "border-box",
    background:     "transparent",
    color:          secText,
    border:         secBorder,
    borderRadius:   RADIUS,
    outline:        focused && !isDisabled ? tk.focusRing : "none",
    outlineOffset:  0,
    fontFamily:     FONT,
    fontSize:       sz.fontSize,
    fontWeight:     500,
    letterSpacing:  "-0.22px",
    lineHeight:     "normal",
    whiteSpace:     "nowrap",
    textDecoration: "none",
    cursor:         isDisabled ? "not-allowed" : "pointer",
    userSelect:     "none",
    transition:     `color ${TRANS}, border-color ${TRANS}`,
    ...externalStyle,
  };

  const handlers = isDisabled ? {} : {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus:      () => setFocused(true),
    onBlur:       () => setFocused(false),
    onClick,
  };

  const inner = (
    <>
      {/* Hover bg fill (fade in via opacity) */}
      {!isDisabled && (
        <span
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            background: tk.bgHover,
            clipPath:   hovered ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
            transition: `clip-path ${TRANS}`,
            pointerEvents: "none",
            zIndex:     0,
          }}
        />
      )}

      {/* Content */}
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: sz.gap }}>
        {loading && (
          <Loader2 style={{ width: sz.iconSize, height: sz.iconSize, animation: "srm-spin 1s linear infinite", flexShrink: 0 }} />
        )}
        {!loading && iconLeft && (
          <span style={{ display: "flex", alignItems: "center", width: sz.iconSize, height: sz.iconSize, flexShrink: 0 }}>{iconLeft}</span>
        )}
        {children && <span style={{ display: "flex", alignItems: "center" }}>{children}</span>}
        {!loading && iconRight && (
          <span style={{ display: "flex", alignItems: "center", width: sz.iconSize, height: sz.iconSize, flexShrink: 0 }}>{iconRight}</span>
        )}
      </span>
    </>
  );

  if (href && !isDisabled) {
    return (
      <>
        <SrmButtonKeyframes />
        <a href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}
          aria-label={ariaLabel} style={baseStyle}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        >{inner}</a>
      </>
    );
  }
  return (
    <>
      <SrmButtonKeyframes />
      <button type="button" disabled={isDisabled} aria-label={ariaLabel} aria-busy={loading} style={baseStyle} {...handlers}>{inner}</button>
    </>
  );
}

SrmButton.displayName = "SrmButton";