/**
 * EmpiricaFixedTopNav — Header sticky da Empírica
 * 100% inline styles — usa useTheme() do DS Matriz
 */
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { useTheme, DSButton } from "../../../design-system";
import { EmpiricaLogoSvg } from "./EmpiricaLogoSvg";


interface NavChild   { label: string; href: string; }
interface NavSection { sectionLabel?: string; children: NavChild[]; }
interface NavItem    { label: string; href: string; sections?: NavSection[]; }

const NAV_ITEMS: NavItem[] = [
  {
    label: "Fundos",
    href: "/fundos",
    sections: [
      {
        sectionLabel: "FIDC · FIF · FII",
        children: [
          { label: "FIDC", href: "/fundos/fidc" },
          { label: "FIF",  href: "/fundos/fif"  },
          { label: "FII",  href: "/fundos/fii"  },
        ],
      },
      {
        sectionLabel: "FIP · Todos",
        children: [
          { label: "FIP",             href: "/fundos/fip" },
          { label: "Todos os Fundos", href: "/fundos"     },
        ],
      },
    ],
  },
  { label: "Compliance", href: "/compliance" },
];

function hasActiveChild(item: NavItem, pathname: string): boolean {
  return item.sections?.some(sec =>
    sec.children.some(child =>
      child.href !== "#" && (pathname === child.href || pathname.startsWith(child.href + "/"))
    )
  ) ?? false;
}

function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M3.667 11H18.334"   stroke={color} strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.667 5.5H18.334"  stroke={color} strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.667 16.5H18.334" stroke={color} strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToggleBtn({ open, onClick }: { open: boolean; onClick: () => void }) {
  const { tokens: t } = useTheme();
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 44, height: 44,
        background: t.surfaceDefault,
        border: `1px solid ${t.borderDefault}`,
        borderRadius: t.radiusMd,
        boxShadow: t.shadowMd,
        cursor: "pointer", flexShrink: 0, padding: 0,
      }}
    >
      {open ? <X size={20} color={t.primary800} strokeWidth={1.83} /> : <HamburgerIcon color={t.primary800} />}
    </button>
  );
}

function DrawerItem({ item, pathname, onClose }: {
  item: NavItem; pathname: string; onClose: () => void;
}) {
  const { tokens: t } = useTheme();
  const [expanded, setExpanded] = useState(() => hasActiveChild(item, pathname));

  const isActive =
    pathname === item.href ||
    (item.href === "/" && pathname === "/") ||
    (item.href !== "/" && pathname.startsWith(item.href)) ||
    hasActiveChild(item, pathname);

  const hasChildren = !!(item.sections && item.sections.length > 0);

  if (hasChildren) {
    return (
      <div style={{ borderBottom: `1px solid ${t.borderDefault}` }}>
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "18px 0",
            fontSize: t.textSm, fontWeight: isActive ? 700 : 500,
            color: isActive ? t.textPrimary : t.textSecondary,
            textTransform: "uppercase" as const, letterSpacing: "0.44px",
            fontFamily: t.fontFamily, background: "none", border: "none",
            cursor: "pointer", outline: "none",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isActive && (
              <span style={{ display: "inline-block", width: 3, height: 14, background: t.brandAccent, borderRadius: t.radiusXs, flexShrink: 0 }} />
            )}
            {item.label}
          </span>
          {expanded
            ? <ChevronDown  size={14} style={{ flexShrink: 0, color: t.textSecondary }} />
            : <ChevronRight size={14} style={{ flexShrink: 0, color: t.textSecondary }} />
          }
        </button>

        {expanded && item.sections!.map((sec, si) => (
          <div key={si} style={{ background: t.surfaceMuted, marginLeft: -24, marginRight: -24 }}>
            {sec.sectionLabel && (
              <div style={{
                padding: "12px 24px 6px",
                fontSize: t.text10, fontWeight: 700,
                color: t.brandAccent, letterSpacing: "0.8px",
                textTransform: "uppercase" as const, fontFamily: t.fontFamily,
              }}>
                {sec.sectionLabel}
              </div>
            )}
            {sec.children.map(child => {
              const childActive =
                pathname === child.href ||
                (child.href !== "#" && pathname.startsWith(child.href + "/"));
              return (
                <Link
                  key={child.href + child.label}
                  to={child.href}
                  onClick={() => { onClose(); setExpanded(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 24px",
                    fontSize: t.textSm, fontWeight: childActive ? 700 : 400,
                    color: childActive ? t.textPrimary : t.textSecondary,
                    textDecoration: "none",
                    textTransform: "uppercase" as const, letterSpacing: "0.44px",
                    borderBottom: `1px solid ${t.borderDefault}`,
                    fontFamily: t.fontFamily,
                    background: childActive ? t.brandPrimaryLight : "transparent",
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: t.radiusFull, background: childActive ? t.brandAccent : t.borderDefault, flexShrink: 0 }} />
                  {child.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const simpleActive =
    pathname === item.href ||
    (item.href === "/" && pathname === "/") ||
    (item.href !== "/" && pathname.startsWith(item.href));

  return (
    <Link
      to={item.href}
      onClick={onClose}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "18px 0",
        fontSize: t.textSm, fontWeight: simpleActive ? 700 : 500,
        color: simpleActive ? t.textPrimary : t.textSecondary,
        textDecoration: "none",
        textTransform: "uppercase" as const, letterSpacing: "0.44px",
        borderBottom: `1px solid ${t.borderDefault}`,
        fontFamily: t.fontFamily,
        transition: "color 0.15s",
      }}
    >
      {simpleActive && (
        <span style={{ display: "inline-block", width: 3, height: 14, background: t.brandAccent, borderRadius: t.radiusXs, flexShrink: 0 }} />
      )}
      {item.label}
    </Link>
  );
}

export function EmpiricaFixedTopNav() {
  const { tokens: t } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible]   = useState(false);
  const [vw, setVw]             = useState(() => typeof window !== "undefined" ? window.innerWidth : 1440);
  const location = useLocation();

  const isMobile = vw < 768;

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobile) { setVisible(true); return; }
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    setVisible(window.scrollY > 480);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const px = isMobile ? 20 : 24;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 300,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      fontFamily: t.fontFamily,
      ...(!isMobile ? {
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
        pointerEvents: visible ? "auto" : "none",
      } : {}),
    }}>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: `16px ${px}px 0`,
        gap: 12,
      }}>
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <EmpiricaLogoSvg height={32} />
        </Link>
        <ToggleBtn open={menuOpen} onClick={() => setMenuOpen(v => !v)} />
      </div>

      <div style={{ height: 1, background: t.borderDefault, marginTop: 12 }} />

      {menuOpen && (
        <div style={{
          background: t.surfaceDefault,
          padding: `4px ${px}px 32px`,
          display: "flex", flexDirection: "column", gap: 0,
          boxShadow: t.shadowLg,
          maxHeight: "80vh", overflowY: "auto",
        }}>
          {NAV_ITEMS.map(item => (
            <DrawerItem
              key={item.href + item.label}
              item={item}
              pathname={location.pathname}
              onClose={() => setMenuOpen(false)}
            />
          ))}

          <div style={{ paddingTop: 24 }}>
            <a href="https://www.srmcapital.com.br" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <DSButton variant="primary" size="md" fullWidth>
                Ecossistema SRM
              </DSButton>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
