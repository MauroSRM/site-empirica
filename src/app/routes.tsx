import React from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";

import EmpiricaHomePage           from "./pages/empirica/EmpiricaHomePage";
import EmpiricaInstitucionalPage  from "./pages/empirica/EmpiricaInstitucionalPage";
import EmpiricaCompliancePage     from "./pages/empirica/EmpiricaCompliancePage";
import EmpiricaFundosPage         from "./pages/empirica/EmpiricaFundosPage";
import EmpiricaFIDCPage           from "./pages/empirica/EmpiricaFIDCPage";
import EmpiricaFIFPage            from "./pages/empirica/EmpiricaFIFPage";
import EmpiricaFIIPage            from "./pages/empirica/EmpiricaFIIPage";
import EmpiricaFIPPage            from "./pages/empirica/EmpiricaFIPPage";
import EmpiricaFundoDetailPage    from "./pages/empirica/EmpiricaFundoDetailPage";
import EmpiricaContatoPage        from "./pages/empirica/EmpiricaContatoPage";
import EmpiricaPrivacidadePage    from "./pages/empirica/EmpiricaPrivacidadePage";
import EmpiricaTestePage          from "./pages/empirica/EmpiricaTestePage";
import {
  default as EmpiricaCmsPage,
  CmsFundosPage,
  CmsFundDetailPage,
  CmsGestorPageWrapper,
  CmsCompliancePageWrapper,
  CmsUsuariosPageWrapper,
} from "./pages/empirica/cms/EmpiricaCmsPage";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

const fadeTransition = { duration: 0.18, ease: "easeInOut" as const };

function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={fadeTransition}
        style={{ minHeight: "100vh" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

function RootLayout() { return <AnimatedOutlet />; }

function HydrateFallback() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#f4f6f9",
      fontFamily: "Inter, system-ui, sans-serif", color: "#223572", fontSize: 14,
    }}>
      Carregando…
    </div>
  );
}

function GlobalError() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", fontFamily: "system-ui, sans-serif",
      flexDirection: "column", gap: 16,
    }}>
      <p style={{ color: "#223572", margin: 0 }}>Algo deu errado. Tente novamente.</p>
      <a href="/empirica" style={{ color: "#FF8200", fontSize: 14 }}>Voltar ao início</a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    HydrateFallback,
    errorElement: <GlobalError />,
    children: [
      { index: true,                                   Component: EmpiricaHomePage },

      { path: "empirica",                              Component: EmpiricaHomePage },
      { path: "empirica/institucional",                Component: EmpiricaInstitucionalPage },
      { path: "empirica/compliance",                   Component: EmpiricaCompliancePage },
      { path: "empirica/nossos-fundos",                Component: EmpiricaFundosPage },
      { path: "empirica/nossos-fundos/fidc",           Component: EmpiricaFIDCPage },
      { path: "empirica/nossos-fundos/fif",            Component: EmpiricaFIFPage },
      { path: "empirica/nossos-fundos/fii",            Component: EmpiricaFIIPage },
      { path: "empirica/nossos-fundos/fip",            Component: EmpiricaFIPPage },
      { path: "empirica/nossos-fundos/:category/:slug",Component: EmpiricaFundoDetailPage },
      { path: "empirica/contato",                      Component: EmpiricaContatoPage },
      { path: "empirica/politica-de-privacidade",      Component: EmpiricaPrivacidadePage },
      { path: "empirica/teste",                        Component: EmpiricaTestePage },

      { path: "srm-ops/emp-gstf",                      Component: EmpiricaCmsPage },
      { path: "srm-ops/emp-gstf/fundos",               Component: CmsFundosPage },
      { path: "srm-ops/emp-gstf/fundos/:fundId",       Component: CmsFundDetailPage },
      { path: "srm-ops/emp-gstf/gestor",               Component: CmsGestorPageWrapper },
      { path: "srm-ops/emp-gstf/compliance",           Component: CmsCompliancePageWrapper },
      { path: "srm-ops/emp-gstf/usuarios",             Component: CmsUsuariosPageWrapper },

      { path: "*",                                     Component: EmpiricaHomePage },
    ],
  },
]);
