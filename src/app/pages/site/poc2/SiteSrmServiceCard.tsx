/**
 * SiteSrmServiceCard — Card de serviço/produto do SRM Site
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState } from "react";
import { useTheme } from "../../../../design-system";

export interface SiteSrmServiceCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  compact?: boolean;
}

export function SiteSrmServiceCard({ icon, title, desc, compact = false }: SiteSrmServiceCardProps) {
  const { tokens: t } = useTheme();
  const [hovered, setHovered] = useState(false);
  const pad = compact ? 20 : 32;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.surfaceDefault,
        border: `1px solid ${t.borderDefault}`,
        borderRadius: t.cardRadius,
        padding: pad,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxSizing: "border-box",
        transition: "box-shadow 0.22s ease, transform 0.22s ease",
        boxShadow: hovered ? t.shadowLg : "none",
        transform: hovered ? "translateY(-4px)" : "none",
        cursor: "default",
      }}
    >
      <div style={{
        width: 48,
        height: 48,
        borderRadius: t.cardRadius,
        background: t.primary50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: t.primary700,
        flexShrink: 0,
      }}>
        {icon}
      </div>

      <div>
        <p style={{
          fontFamily: t.fontFamily,
          fontSize: t.text16,
          fontWeight: 700,
          color: t.textPrimary,
          marginBottom: 8,
          margin: 0,
        }}>
          {title}
        </p>
        <p style={{
          fontFamily: t.fontFamily,
          fontSize: t.textLg,
          lineHeight: 1.65,
          color: t.textSecondary,
          margin: "8px 0 0",
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

export interface SiteSrmServiceCardGridProps {
  cards: SiteSrmServiceCardProps[];
  isMobile: boolean;
  cols?: number;
}

export function SiteSrmServiceCardGrid({ cards, isMobile, cols = 3 }: SiteSrmServiceCardGridProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : `repeat(${cols}, 1fr)`,
      gap: isMobile ? 16 : 24,
    }}>
      {cards.map((card, i) => (
        <SiteSrmServiceCard key={i} {...card} compact={isMobile} />
      ))}
    </div>
  );
}
