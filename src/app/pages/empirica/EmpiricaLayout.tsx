/**
 * EmpiricaLayout — Wrapper das páginas do site SRM Empírica
 *
 * Sem header: o site é de finalidade regulatória e a navegação vive no rodapé
 * (fundos, compliance, legal). O header trazia o
 * logo e o botão "Ecossistema SRM", que caracterizavam o site como do Grupo.
 *
 * 100% inline styles — zero Tailwind.
 */
import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router";
import { EmpiricaFooter }      from "./EmpiricaFooter";
import { useTheme } from "../../../design-system";

// Desabilita scroll restoration do browser
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

interface EmpiricaLayoutProps {
  children: React.ReactNode;
}

export function EmpiricaLayout({ children }: EmpiricaLayoutProps) {
  const { tokens: t } = useTheme();
  const { pathname } = useLocation();
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
      <div style={{ width: "100%", background: t.surfaceCanvas }}>
        {children}
        <EmpiricaFooter />
      </div>
    </div>
  );
}