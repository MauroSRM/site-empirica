/**
 * EmpiricaFundCategoryCard — card vertical compartilhado
 * Usado em: EmpiricaHomePage · EmpiricaFundosPage
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../../design-system";

export interface FundCategoryCardData {
  code:  string;
  label: string;
  desc?: string;
  href:  string;
}

export function EmpiricaFundCategoryCard({ card }: { card: FundCategoryCardData }) {
  const { tokens: t } = useTheme();
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(card.href)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(card.href)}
      style={{
        background: t.surfaceDefault,
        borderRadius: t.cardRadius,
        boxShadow: hov ? t.shadowLg : t.shadowMd,
        padding: 24,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        outline: "none",
        transition: "box-shadow 0.22s ease, transform 0.18s ease",
        transform: hov ? "translateY(-4px)" : "none",
        boxSizing: "border-box" as const,
      }}
    >
      <div style={{ display: "flex", gap: 32, alignItems: "flex-end" }}>
        {/* Rótulo vertical laranja */}
        <div style={{
          width: 11, alignSelf: "stretch", flexShrink: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end",
        }}>
          <p style={{
            fontFamily: t.fontFamily, fontSize: t.textXs, fontWeight: 600,
            color: t.brandAccentStrong, letterSpacing: "0.54px",
            textTransform: "uppercase" as const,
            writingMode: "vertical-rl" as const,
            transform: "rotate(180deg)",
            margin: 0, whiteSpace: "nowrap" as const,
          }}>
            {card.label}
          </p>
        </div>

        {/* Conteúdo — height fixo 162px */}
        <div style={{
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          height: 162, flex: 1, minWidth: 0,
        }}>
          {/* Título + linha laranja */}
          <div>
            <p style={{
              fontFamily: t.fontFamily, fontSize: t.text16, fontWeight: 700,
              color: t.primary800, textTransform: "uppercase" as const,
              margin: "0 0 10px", lineHeight: "normal",
            }}>
              {card.code}
            </p>
            <div style={{ width: 40, height: 3, background: t.brandAccent, borderRadius: t.radiusXs }} />
          </div>

          {/* Descrição */}
          {card.desc && (
            <p style={{
              fontFamily: t.fontFamily, fontSize: t.text2Xs, fontWeight: 400,
              color: t.textSecondary, lineHeight: "normal",
              margin: 0,
            }}>
              {card.desc}
            </p>
          )}

          {/* "Ver fundos" */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(card.href); }}
            style={{
              alignSelf: "flex-end",
              background: "none", border: "none", padding: 0,
              display: "flex", alignItems: "center", gap: 8,
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: t.fontFamily, fontSize: t.textMd, fontWeight: 500, color: t.primary800 }}>
              Ver fundos
            </span>
            <svg width="20" height="11" viewBox="0 0 20 11" fill="none">
              <path d="M0 5.26h18.5M13.5 0l6.5 5.26-6.5 5.26" stroke={t.primary800} strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
