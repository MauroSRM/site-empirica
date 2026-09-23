/**
 * EmpiricaLayout — Wrapper das páginas do site SRM Empírica
 *
 * Mobile  → EmpiricaFixedTopNav (sticky, sempre visível — brand bar + logo + hambúrguer)
 * Desktop → EmpiricaHeader (sticky, brand bar + nav pills completo)
 *           + EmpiricaScrollNav (fixed, aparece após scroll — brand bar + nav pills compact)
 *
 * 100% inline styles — zero Tailwind.
 */
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { EmpiricaHeader } from "./EmpiricaHeader";
import { EmpiricaFixedTopNav } from "./EmpiricaFixedTopNav";
import { EmpiricaFooter }      from "./EmpiricaFooter";
import { useTheme } from "../../../design-system";

// Desabilita scroll restoration do browser
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

interface EmpiricaLayoutProps {
  children: React.ReactNode;
}

// padding-top 16px + button 44px + marginTop 12px + divider 1px = 73px
const MOBILE_NAV_H = 73;

export function EmpiricaLayout({ children }: EmpiricaLayoutProps) {
  const { tokens: t } = useTheme();
  const { pathname } = useLocation();
  const [vw, setVw] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1440);
  const isMobile = vw < 768;

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div style={{
      background: t.surfaceCanvas,
      minHeight: "100vh",
      fontFamily: t.fontFamily,
      overflowX: "hidden",
    }}>
      {isMobile ? (
        <EmpiricaFixedTopNav />
      ) : (
        <EmpiricaHeader />
      )}

      {/* Compensação do header fixo mobile */}
      <div style={{ width: "100%", background: t.surfaceCanvas, paddingTop: isMobile ? MOBILE_NAV_H : 0 }}>
        {children}
        <EmpiricaFooter />
      </div>
    </div>
  );
}