import React from "react";
import { Megaphone } from "lucide-react";
import { useTheme, hexToRgba } from "../../../design-system";
import { useSrmViewport } from "../site/poc2/useSrmViewport";

interface Props {
  onOpen: () => void;
  /** Força layout em coluna (ícone → título → botão) para uso em colunas estreitas */
  stacked?: boolean;
}

export function EmpiricaGestorBar({ onOpen, stacked }: Props) {
  const { isMobile } = useSrmViewport();
  const { tokens: t } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const accentFocusRing = `0 0 0 3px ${hexToRgba(t.brandAccent, 0.35)}`;

  const isColumn = stacked || isMobile;

  return (
    <div style={{
      background: t.surfaceDefault,
      borderRadius: t.radiusMd,
      boxShadow: t.shadowMd,
      width: "100%",
      display: "flex",
      flexDirection: isColumn ? "column" : "row",
      alignItems: isColumn ? "flex-start" : "center",
      justifyContent: isColumn ? undefined : "space-between",
      gap: isColumn ? t.space4 : 0,
      padding: t.space4,
      boxSizing: "border-box",
    }}>
      {/* Ícone + Título agrupados */}
      <div style={{ display: "flex", alignItems: "center", gap: t.space3 }}>
        <div style={{
          width: 40, height: 40,
          background: t.brandAccentLight,
          borderRadius: t.radiusMd,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Megaphone size={18} color={t.brandAccent} strokeWidth={1.5} />
        </div>
        <p style={{
          fontFamily: t.fontFamily,
          fontSize: t.textMd,
          fontWeight: 700,
          color: t.primary800,
          textTransform: "uppercase",
          lineHeight: 1.3,
          margin: 0,
          letterSpacing: "0.02em",
        }}>
          Comunicados do Gestor
        </p>
      </div>

      {/* Botão */}
      <button
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onFocus={e => { e.currentTarget.style.boxShadow = accentFocusRing; }}
        onBlur={e => { e.currentTarget.style.boxShadow = "none"; }}
        style={{
          position: "relative",
          overflow: "hidden",
          width: isMobile && !isColumn ? "100%" : "auto",
          minWidth: 159,
          height: 40,
          background: t.brandAccent,
          borderRadius: t.buttonRadius,
          border: "none",
          outline: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          flexShrink: 0,
          transform: isPressed ? "scale(0.98)" : "scale(1)",
          transition: "transform 0.1s ease",
        }}
      >
        <div style={{
          position: "absolute", top: 0,
          left: isHovered ? 0 : "-100%",
          width: "100%", height: "100%",
          background: t.brandAccentHover,
          transition: "left 0.3s ease",
          pointerEvents: "none",
        }} />
        <span style={{
          position: "relative", zIndex: 1,
          fontFamily: t.fontFamily,
          fontSize: t.textMd, fontWeight: 500,
          color: t.textOnBrand,
          letterSpacing: "-0.01em", whiteSpace: "nowrap",
        }}>
          Acessar conteúdo
        </span>
      </button>
    </div>
  );
}
