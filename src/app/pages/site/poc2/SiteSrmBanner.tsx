/**
 * [SRM] SiteSrmBanner — Banner interno para páginas secundárias do siteSRM
 *
 * Desktop: sidebar vertical à esquerda (brandPrimary) + fundo sólido primary800.
 * Mobile:  fundo sólido, sem sidebar (conteúdo full-width).
 */
import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useSrmViewport } from "./useSrmViewport";
import { SrmButton } from "./SrmButton";
import { useTheme } from "../../../../design-system";

interface Crumb { label: string; href?: string }

interface BannerAction {
  label: string;
  href?: string;
  variant: 'primary' | 'outline';
}

interface SiteSrmBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: Crumb[];
  gradient?: string;
  actions?: BannerAction[];
  tabs?: { id: string; code: string; label: string }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  mobileTabWrap?: boolean;
}

const SIDEBAR_W    = 88;
const MOBILE_TARJA = 56;
const SIDEBAR_BG   = "#1d3f80"; // brandPrimary
const BG_SOLID     = "#0e2041"; // primary800
const DIAMOND      = "M0.00489387 7.27925V21.8279L12.654 1.36185e-07L0.00489387 7.27925ZM0.350909 22.4287L12.9999 29.7031L25.6491 22.4287H0.350909ZM13.346 0.00493001L25.9951 21.8328V7.28418L13.346 0.00493001Z";

export const SiteSrmBanner: React.FC<SiteSrmBannerProps> = ({
  title, subtitle, badge, breadcrumbs = [],
  actions, tabs, activeTab, onTabChange, mobileTabWrap,
}) => {
  const { isMobile } = useSrmViewport();
  const { tokens: t } = useTheme();

  const paddingTop    = 64;
  const paddingBottom = tabs && tabs.length > 0 ? 52 : 72;
  const paddingLeft   = isMobile ? 20 : SIDEBAR_W + 56;
  const paddingRight  = isMobile ? 20 : 56;

  return (
    <section style={{
      position: "relative",
      overflow: "hidden",
      background: BG_SOLID,
      padding: isMobile
        ? `40px 20px ${(tabs && tabs.length > 0 ? 32 : 48) + MOBILE_TARJA}px`
        : `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`,
      fontFamily: t.fontFamily,
    }}>

      {/* ── Tarja vertical — desktop ───────────────────────────────────────── */}
      {!isMobile && (
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: SIDEBAR_W, background: SIDEBAR_BG,
        }}>
          <svg
            width={24} height={27.5} viewBox="0 0 26 29.7031" fill="none"
            style={{ position: "absolute", top: 32, left: (SIDEBAR_W - 24) / 2 }}
          >
            <path d={DIAMOND} fill="white" />
          </svg>
          <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <span style={{
              fontFamily: t.fontFamily, fontSize: 9, fontWeight: 600,
              color: "rgba(255,255,255,0.28)", letterSpacing: "1.4px",
              textTransform: "uppercase" as const, whiteSpace: "nowrap",
              writingMode: "vertical-rl" as const, transform: "rotate(180deg)",
            }}>
              capital em movimento
            </span>
          </div>
        </div>
      )}

      {/* ── Tarja horizontal — mobile (bottom) ─────────────────────────────── */}
      {isMobile && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: MOBILE_TARJA, background: SIDEBAR_BG,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px", boxSizing: "border-box" as const,
        }}>
          <svg width={14} height={16} viewBox="0 0 26 29.7031" fill="none">
            <path d={DIAMOND} fill="white" />
          </svg>
          <span style={{
            fontFamily: t.fontFamily, fontSize: 9, fontWeight: 600,
            color: "rgba(255,255,255,0.35)", letterSpacing: "1.4px",
            textTransform: "uppercase" as const, whiteSpace: "nowrap",
          }}>
            capital em movimento
          </span>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
        {breadcrumbs.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <Link to="/" style={{ color: "rgba(255,255,255,0.55)", fontSize: 12.5, textDecoration: "none", fontFamily: t.fontFamily }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}>
              Home
            </Link>
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={i}>
                <ChevronRight size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
                {c.href
                  ? <Link to={c.href} style={{ color: "rgba(255,255,255,0.55)", fontSize: 12.5, textDecoration: "none", fontFamily: t.fontFamily }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}>
                      {c.label}
                    </Link>
                  : <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 12.5, fontFamily: t.fontFamily }}>{c.label}</span>
                }
              </React.Fragment>
            ))}
          </div>
        )}

        {badge && (
          <div style={{
            display: "inline-flex", alignItems: "center",
            padding: "4px 12px", marginBottom: 16,
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.22)",
            borderRadius: 6,
            color: "#cce0ff",
            fontSize: isMobile ? 11 : 13,
            fontWeight: 400,
            fontFamily: t.fontFamily,
          }}>
            {badge}
          </div>
        )}

        <h1 style={{
          fontFamily: t.fontFamily,
          color: "#fff",
          fontSize: isMobile ? 28 : 52,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: subtitle ? 16 : 0,
          maxWidth: isMobile ? "100%" : 820,
        }}>
          {title}
        </h1>

        {subtitle && (
          <p style={{
            fontFamily: t.fontFamily,
            color: "rgba(255,255,255,0.72)",
            fontSize: isMobile ? 15 : 18,
            lineHeight: 1.72,
            maxWidth: isMobile ? "100%" : 620,
            margin: 0,
          }}>
            {subtitle}
          </p>
        )}

        {actions && actions.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            {actions.map((action, i) => (
              <SrmButton key={i} variant={action.variant === "primary" ? "primary" : "secondary"} size="normal" theme="dark"
                href={action.href || "#"} target={action.href?.startsWith("http") ? "_blank" : undefined}>
                {action.label}
              </SrmButton>
            ))}
          </div>
        )}
      </div>

      {tabs && tabs.length > 0 && (
        <div style={{
          position: "relative", display: "flex", justifyContent: "center",
          marginTop: 48,
          overflowX: isMobile && !mobileTabWrap ? "auto" : "visible",
          paddingBottom: isMobile ? 4 : 0,
        }}>
          <div style={{
            display: "flex",
            flexWrap: isMobile && mobileTabWrap ? "wrap" : "nowrap",
            alignItems: "center", gap: 4,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(22,46,97,0.12)",
            borderRadius: isMobile && mobileTabWrap ? 16 : 99,
            padding: "6px 6px",
            boxShadow: "0 8px 32px rgba(22,46,97,0.18), 0 2px 8px rgba(0,0,0,0.06)",
            flexShrink: 0,
            width: isMobile && mobileTabWrap ? "100%" : undefined,
            boxSizing: isMobile && mobileTabWrap ? "border-box" as const : undefined,
          }}>
            {tabs.map((tab) => (
              <div key={tab.id} style={isMobile && mobileTabWrap ? { flex: "1 1 calc(50% - 4px)", minWidth: 0 } : undefined}>
                <TabPill code={tab.code} label={tab.label} active={tab.id === activeTab}
                  onClick={() => onTabChange?.(tab.id)} isMobile={isMobile} stretch={!!(isMobile && mobileTabWrap)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

function TabPill({ code, label, active, onClick, isMobile, stretch }: {
  code: string; label: string; active: boolean; onClick: () => void; isMobile?: boolean; stretch?: boolean
}) {
  const { tokens: t } = useTheme();
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: isMobile ? "8px 12px" : "8px 16px",
        borderRadius: 99,
        background: active ? t.primary800 : hovered ? "rgba(22,46,97,0.06)" : "transparent",
        border: "none", cursor: "pointer", fontFamily: t.fontFamily, outline: "none",
        transition: "background 0.18s ease",
        width: stretch ? "100%" : undefined,
      }}>
      <span style={{
        fontSize: isMobile ? 11 : 13, fontWeight: active ? 700 : 500,
        letterSpacing: "0.44px", textTransform: "uppercase" as const,
        color: active ? t.textOnBrand : hovered ? t.primary800 : t.borderStrong,
        lineHeight: 1, transition: "color 0.18s ease",
      }}>{code}</span>
      <span style={{
        fontSize: isMobile ? 10 : 11, fontWeight: 500,
        color: active ? "rgba(255,255,255,0.72)" : hovered ? t.textSecondary : t.borderStrong,
        lineHeight: 1, transition: "color 0.18s ease", whiteSpace: "nowrap",
      }}>{label}</span>
    </button>
  );
}
