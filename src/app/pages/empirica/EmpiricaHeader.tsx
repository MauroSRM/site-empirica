/**
 * EmpiricaHeader — Header sticky do site SRM Empírica
 *
 * Desktop — NavBarTop (80px, sticky):
 *   Logo | Início · Quem Somos · Fundos · Contato | Ecossistema SRM
 *   Indicador ativo: pastilha 30×3px brandAccent, radiusFull, absoluta bottom-center
 *   MegaMenu aparece no hover sobre "Quem Somos" e "Fundos"
 *
 * Desktop scroll — NavBarScroll (64px, fixed, entra após 480px):
 *   Logo | hamburger 52×52px → drawer com todos os links
 *
 * Mobile: MobileHeader (fixed 60px, hamburger drawer)
 *
 * MIGRADO PARA DS MATRIZ — usa tokens via useTheme()
 * 100% inline styles — zero Tailwind.
 */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { SiteSrmMegaMenu } from "../site/poc2/SiteSrmMegaMenu";
import { X, Building2, Shield, TrendingUp, Rocket } from "lucide-react";
import { EmpiricaLogoSvg } from "./EmpiricaLogoSvg";
import { useTheme, DSButton } from '../../../design-system';

const CANVAS_W = 1440;
const NAV_H    = 80;  // t.navHeight

// ─── Mega menu data — Empírica ────────────────────────────────────────────────

const EMPIRICA_FUNDOS = [
  {
    label: "CRÉDITO & RENDA",
    icon: TrendingUp,
    items: [
      { title: "FIDC", description: "Fundos de Investimento em Direitos Creditórios, pioneiros no mercado de crédito estruturado.", href: "/fundos/fidc" },
      { title: "FIF",  description: "Fundo de Investimento Financeiro, crédito privado High Grade e High Yield.", href: "/fundos/fif" },
      { title: "FII",  description: "Fundo de Investimento Imobiliário, corporativos, Built-to-Suit e Sale-Lease-Back.", href: "/fundos/fii" },
    ],
  },
  {
    label: "PARTICIPAÇÕES",
    icon: Rocket,
    items: [
      { title: "FIP", description: "Fundo de Investimento em Participações, venture capital e private equity.", href: "/fundos/fip" },
      { title: "Todos os Fundos", description: "Visão geral de todas as estratégias e categorias sob gestão da SRM Empírica.", href: "/fundos" },
    ],
  },
];

// ─── NavPill — item de navegação com indicador ativo ─────────────────────────
function NavPill({ label, href, isActive, onMouseEnter, onMouseLeave }: {
  label: string; href: string; isActive: boolean;
  onMouseEnter?: () => void; onMouseLeave?: () => void;
}) {
  const { tokens: t } = useTheme();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={{ position: "relative", paddingBottom: 4, cursor: "pointer", flexShrink: 0 }}
      onClick={() => navigate(href)}
      onMouseEnter={() => { setHovered(true); onMouseEnter?.(); }}
      onMouseLeave={() => { setHovered(false); onMouseLeave?.(); }}
    >
      <span style={{
        fontFamily: t.fontFamily,
        fontSize: t.textSm,
        fontWeight: isActive ? 600 : 400,
        // W-01: textSecondary (~4.6:1) — WCAG AA
        color: isActive || hovered ? t.textPrimary : t.textSecondary,
        textTransform: "uppercase" as const,
        letterSpacing: "0.44px",
        lineHeight: "normal",
        whiteSpace: "nowrap",
        transition: "color 0.15s ease",
      }}>
        {label}
      </span>

      {/* Indicador ativo — pastilha 30×3px centralizada, brandAccent, radiusFull */}
      {isActive && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 30,
          height: 3,
          backgroundColor: t.brandAccent,
          borderRadius: t.radiusFull,
        }} />
      )}
    </div>
  );
}

// ─── NavBarTop inner (80px) ───────────────────────────────────────────────────
export function EmpiricaHeaderInner() {
  const { tokens: t } = useTheme();
  const [openMega, setOpenMega] = useState<"fundos" | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location  = useLocation();

  const openMenu  = (type: "fundos") => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setOpenMega(type);
  };
  const closeMega = () => { hideTimer.current = setTimeout(() => setOpenMega(null), 120); };

  const path            = location.pathname;
  const isInicio     = path === "/";
  const isFundos     = path.startsWith("/fundos");
  const isCompliance = path.startsWith("/compliance");

  const megaColumns = EMPIRICA_FUNDOS;
  const megaFooter  = { ctaLabel: "Ver todos os fundos", ctaHref: "/fundos", tagline: "Estratégias de crédito estruturado" };

  return (
    <div style={{ position: "relative" }}>
      {/* NavBarTop — 80px, logo | nav | cta */}
      <nav style={{
        width: "100%",
        height: NAV_H,
        backgroundColor: t.surfaceDefault,
        borderBottom: `1px solid ${t.borderDefault}`,
        paddingLeft: t.paddingPage,
        paddingRight: t.paddingPage,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
        fontFamily: t.fontFamily,
      }}>
        {/* Logo */}
        <EmpiricaLogoSvg />

        {/* Nav pills — gap 32px, conforme spec */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <NavPill
            label="Fundos"  href="/fundos" isActive={isInicio || isFundos}
            onMouseEnter={() => openMenu("fundos")}
            onMouseLeave={closeMega}
          />
          <NavPill label="Compliance" href="/compliance" isActive={isCompliance} />
        </div>

        {/* CTA */}
        <DSButton variant="primary" size="md" theme="light" onClick={() => window.open("https://www.srmcapital.com.br", "_blank")}>
          Ecossistema SRM
        </DSButton>
      </nav>

      {/* MegaMenu — posicionado abaixo do nav */}
      {openMega && (
        <div
          style={{ position: "absolute", top: NAV_H, left: 0, right: 0, zIndex: 20 }}
          onMouseEnter={() => openMenu("fundos")}
          onMouseLeave={closeMega}
        >
          <SiteSrmMegaMenu
            columns={megaColumns}
            onClose={() => setOpenMega(null)}
            maxWidth={960}
            centered
            footer={megaFooter}
          />
        </div>
      )}
    </div>
  );
}

// ─── Hamburger icon ───────────────────────────────────────────────────────────
function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
      <path d="M3.667 11H18.334"   stroke={color} strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.667 5.5H18.334"  stroke={color} strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.667 16.5H18.334" stroke={color} strokeWidth="1.83" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── NavBarScroll — compacto (64px), aparece após rolar 480px ─────────────────
export function EmpiricaScrollNav() {
  const { tokens: t } = useTheme();
  const [visible,  setVisible]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    setVisible(window.scrollY > 480);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const EMPIRICA_NAV = [
    { label: "Fundos",            href: "/fundos" },
    { label: "FIDC",              href: "/fundos/fidc" },
    { label: "FIF",               href: "/fundos/fif" },
    { label: "FII",               href: "/fundos/fii" },
    { label: "FIP",               href: "/fundos/fip" },
    { label: "Compliance",        href: "/compliance" },
  ];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
      background: t.surfaceDefault,
      boxShadow: t.shadowNav,
      fontFamily: t.fontFamily,
      transform: visible ? "translateY(0)" : "translateY(-100%)",
      opacity: visible ? 1 : 0,
      transition: "transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.32s ease",
      pointerEvents: visible ? "auto" : "none",
    }}>
      {/* NavBarScroll — logo + hamburger 52×52px */}
      <nav style={{
        width: "100%",
        height: 64,
        paddingLeft: t.paddingPage,
        paddingRight: t.paddingPage,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
        <div style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <EmpiricaLogoSvg />
        </div>

        {/* Hamburger — 52×52px, 3 barras 18×2px gap 4px, brandPrimary */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          style={{
            width: 52,
            height: 52,
            backgroundColor: t.surfaceDefault,
            border: `1px solid ${t.borderDefault}`,
            boxShadow: t.shadowNav,
            borderRadius: t.radiusMd,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            flexShrink: 0,
            padding: 0,
          }}
        >
          {menuOpen
            ? <X size={20} color={t.brandPrimary} strokeWidth={1.83} />
            : [0, 1, 2].map(i => (
                <div key={i} style={{ width: 18, height: 2, backgroundColor: t.brandPrimary, borderRadius: 1 }} />
              ))
          }
        </button>
      </nav>

      {/* Drawer */}
      {menuOpen && (
        <div style={{
          background: t.surfaceDefault,
          padding: `4px ${t.paddingPage} 32px`,
          display: "flex", flexDirection: "column",
          boxShadow: "0 12px 32px rgba(22,46,97,0.10)",
          maxHeight: "80vh", overflowY: "auto",
        }}>
          {EMPIRICA_NAV.map(item => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "18px 0",
                  fontFamily: t.fontFamily,
                  fontSize: t.textSm, fontWeight: isActive ? 700 : 500,
                  // W-01: textSecondary — WCAG AA
                  color: isActive ? t.textPrimary : t.textSecondary,
                  textDecoration: "none",
                  textTransform: "uppercase" as const, letterSpacing: "0.44px",
                  borderBottom: `1px solid ${t.borderDefault}`,
                  transition: "color 0.15s",
                }}
              >
                {isActive && (
                  <span style={{
                    display: "inline-block",
                    width: 3, height: 14,
                    background: t.brandAccent,
                    borderRadius: t.radiusFull,
                    flexShrink: 0,
                  }} />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Mobile ───────────────────────────────────────────────────────────────────
function MobileHeader() {
  const { tokens: t } = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const go = (href: string) => { setOpen(false); navigate(href); };

  const NAV_MOBILE = [
    { label: "Fundos",            href: "/fundos" },
    { label: "FIDC",              href: "/fundos/fidc" },
    { label: "FIF",               href: "/fundos/fif" },
    { label: "FII",               href: "/fundos/fii" },
    { label: "FIP",               href: "/fundos/fip" },
    { label: "Compliance",        href: "/compliance" },
  ];

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: 60, background: t.surfaceDefault, boxShadow: `0 1px 0 ${t.borderDefault}`,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px", boxSizing: "border-box",
      }}>
        <div onClick={() => go("/")} style={{ cursor: "pointer" }}>
          <EmpiricaLogoSvg />
        </div>
        <button onClick={() => setOpen(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          {open
            ? <X size={20} color={t.textSecondary} strokeWidth={1.8} />
            : <HamburgerIcon color={t.textSecondary} />
          }
        </button>
      </div>

      {open && (
        <div style={{
          position: "fixed", top: 60, left: 0, right: 0, bottom: 0,
          zIndex: 199, background: t.surfaceDefault, overflowY: "auto", paddingBottom: 32,
        }}>
          {NAV_MOBILE.map(item => {
            const active = location.pathname === item.href;
            return (
              <button key={item.href} onClick={() => go(item.href)} style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "14px 20px", background: "none", border: "none",
                borderBottom: `1px solid ${t.borderDefault}`,
                fontFamily: t.fontFamily, fontSize: 15,
                fontWeight: active ? 600 : 400,
                color: active ? t.textPrimary : t.textSecondary,
                cursor: "pointer",
              }}>
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function EmpiricaHeader() {
  const { tokens: t } = useTheme();
  const [vw, setVw] = useState(() => typeof window !== "undefined" ? window.innerWidth : CANVAS_W);
  const isMobile = vw < 768;

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (isMobile) return <MobileHeader />;

  const scale      = Math.min(vw / CANVAS_W, 1);
  const offsetLeft = vw > CANVAS_W ? Math.round((vw - CANVAS_W) / 2) : 0;
  const visibleH   = Math.round(NAV_H * scale);

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 200,
      width: "100%",
      background: t.surfaceDefault,
      flexShrink: 0,
    }}>
      <div style={{ height: visibleH, position: "relative", overflow: "visible" }}>
        <div style={{
          width: CANVAS_W,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          position: "absolute",
          top: 0,
          left: offsetLeft,
        }}>
          <EmpiricaHeaderInner />
        </div>
      </div>
      <EmpiricaScrollNav />
    </div>
  );
}
