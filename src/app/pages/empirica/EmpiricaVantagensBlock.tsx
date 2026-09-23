/**
 * EmpiricaVantagensBlock — Carousel "Crédito Estruturado para Originadores"
 * Extracted from EmpiricaFundosPage for reuse across category pages.
 */
import React, { useState, useEffect } from "react";
import { ShieldCheck, TrendingUp, Users, RefreshCw } from "lucide-react";
import { useTheme } from "../../../design-system";
import svgPaths from "../../../imports/Group147/svg-nycng3khu2";

const VANTAGENS = [
  "Controle total da operação com apoio da gestora",
  "Maior alavancagem financeira",
  "Canal direto com investidores experientes",
];

const VANTAGENS_ICONS = [ShieldCheck, TrendingUp, Users];

const SIDEBAR_W      = 77;
const CARD_H         = 192;
const MOBILE_CARD_H  = 300;
const MOBILE_BLUE_H  = 100;
const MOBILE_TARJA_H = 40;
const FOOTER_H       = 44;
const CARD_SHADOW    = "0px 10px 15px 0px rgba(0,0,0,0.1)";

export function EmpiricaVantagensBlock({ isMobile }: { isMobile: boolean }) {
  const { tokens: t } = useTheme();
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState<"fwd" | "back">("fwd");
  const total = VANTAGENS.length;

  const goTo = (idx: number, d: "fwd" | "back") => { setDir(d); setCurrent(idx); };

  useEffect(() => {
    const id = setInterval(() => goTo((current + 1) % total, "fwd"), 3600);
    return () => clearInterval(id);
  }, [current]);

  const SlideIcon = VANTAGENS_ICONS[current];

  const Dots = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {VANTAGENS.map((_, i) => (
        <button key={i} onClick={() => goTo(i, i > current ? "fwd" : "back")} style={{
          width: i === current ? 28 : 8, height: 8, borderRadius: 4,
          border: "none", padding: 0, cursor: "pointer",
          background: i === current ? t.brandAccent : t.borderDefault,
          transition: "width 0.3s ease, background 0.3s ease",
        }} />
      ))}
    </div>
  );

  const Counter = () => (
    <span style={{
      fontFamily: t.fontFamily, fontSize: t.textMd, fontWeight: 700,
      color: t.brandAccentStrong, letterSpacing: "0.04em", whiteSpace: "nowrap",
    }}>
      {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </span>
  );

  const Sidebar = () => (
    <div style={{
      position: "absolute", left: 0, top: 0, bottom: 0,
      width: SIDEBAR_W, background: t.primary500,
    }}>
      <div style={{ position: "absolute", top: 15, left: 25 }}>
        <svg viewBox="0 0 26 32" fill="none" style={{ width: 26, height: 32, display: "block" }}>
          <path d={svgPaths.p37036f00} fill="white" />
        </svg>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div style={{
        height: MOBILE_CARD_H,
        display: "flex", flexDirection: "column",
        borderRadius: t.radiusMd, overflow: "hidden",
        border: `1px solid ${t.borderDefault}`, boxShadow: CARD_SHADOW,
      }}>
        <div style={{
          background: t.primary600,
          height: MOBILE_BLUE_H, flexShrink: 0,
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            background: t.primary500,
            height: MOBILE_TARJA_H, flexShrink: 0,
            display: "flex", alignItems: "center", gap: 10,
            padding: "0 16px",
          }}>
            <svg viewBox="0 0 26 32" fill="none" style={{ width: 16, height: 20, display: "block", flexShrink: 0 }}>
              <path d={svgPaths.p37036f00} fill="white" />
            </svg>
            <span style={{
              fontFamily: t.fontFamily, fontSize: t.text10, fontWeight: 700,
              color: "rgba(255,255,255,0.55)", letterSpacing: "1.6px",
              textTransform: "uppercase" as const,
            }}>
              ORIGINADORES
            </span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 20px" }}>
            <p style={{
              margin: 0,
              fontFamily: t.fontFamily, fontSize: t.text16, fontWeight: 600,
              color: "white", letterSpacing: "-0.03em", lineHeight: 1.45,
            }}>
              Crédito Estruturado para Originadores
            </p>
          </div>
        </div>

        <div style={{ position: "relative", background: t.surfaceDefault, flex: 1, overflow: "hidden" }}>
          <div key={current} style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: FOOTER_H + 1,
            overflow: "hidden",
            animation: `${dir === "fwd" ? "vSlideInFwd" : "vSlideInBack"} 0.42s cubic-bezier(0.22, 1, 0.36, 1) both`,
          }}>
            <div style={{ padding: "16px 20px 12px" }}>
              <div style={{
                width: 44, height: 44, background: t.brandAccentLight,
                borderRadius: t.radiusMd, display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 10,
              }}>
                <SlideIcon size={20} color={t.brandAccent} strokeWidth={1.5} />
              </div>
              <p style={{
                fontFamily: t.fontFamily, fontSize: t.text2xl, fontWeight: 400,
                color: t.textPrimary, lineHeight: 1.4, margin: 0,
              }}>
                {VANTAGENS[current]}
              </p>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: FOOTER_H, left: 0, right: 0, height: 1, background: t.borderDefault }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: FOOTER_H,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 20px", boxSizing: "border-box" as const,
          }}>
            <Dots />
            <Counter />
          </div>
        </div>

        <style>{`
          @keyframes vSlideInFwd  { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          @keyframes vSlideInBack { from { transform: translateX(-24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: t.radiusMd, overflow: "hidden",
      display: "grid", gridTemplateColumns: "374fr 572fr",
      border: `1px solid ${t.borderDefault}`, boxShadow: CARD_SHADOW,
      height: CARD_H,
    }}>
      <div style={{ position: "relative", background: t.primary600, overflow: "hidden" }}>
        <Sidebar />
        <div style={{
          position: "absolute", left: SIDEBAR_W + 24, top: 0, right: 24, bottom: 0,
          display: "flex", alignItems: "center",
        }}>
          <p style={{
            margin: 0,
            fontFamily: t.fontFamily, fontSize: t.text3xl, fontWeight: 700,
            color: "white", letterSpacing: "-0.03em", lineHeight: 1.25,
          }}>
            Crédito Estruturado para Originadores
          </p>
        </div>
      </div>

      <div style={{ position: "relative", background: t.surfaceDefault, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div key={current} style={{
          flex: 1,
          display: "flex", alignItems: "center", gap: 16,
          padding: "0 24px",
          animation: `${dir === "fwd" ? "vSlideInFwd" : "vSlideInBack"} 0.42s cubic-bezier(0.22, 1, 0.36, 1) both`,
        }}>
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            background: t.brandAccentLight,
            borderRadius: t.radiusMd,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <SlideIcon size={20} color={t.brandAccent} strokeWidth={1.5} />
          </div>
          <p style={{
            margin: 0,
            fontFamily: t.fontFamily, fontSize: t.text2xl, fontWeight: 500,
            color: t.textPrimary, lineHeight: 1.35,
          }}>
            {VANTAGENS[current]}
          </p>
        </div>

        <div style={{ height: 1, background: t.borderDefault, flexShrink: 0 }} />

        <div style={{
          height: FOOTER_H, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", boxSizing: "border-box" as const,
        }}>
          <Dots />
          <Counter />
        </div>
      </div>

      <style>{`
        @keyframes vSlideInFwd  { from { transform: translateX(32px);  opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes vSlideInBack { from { transform: translateX(-32px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
