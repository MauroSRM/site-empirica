import React from "react";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";

import EmpiricaHomePage           from "./pages/empirica/EmpiricaHomePage";
import EmpiricaCompliancePage     from "./pages/empirica/EmpiricaCompliancePage";
import EmpiricaFIDCPage           from "./pages/empirica/EmpiricaFIDCPage";
import EmpiricaFIFPage            from "./pages/empirica/EmpiricaFIFPage";
import EmpiricaFIIPage            from "./pages/empirica/EmpiricaFIIPage";
import EmpiricaFIPPage            from "./pages/empirica/EmpiricaFIPPage";
import EmpiricaFundoDetailPage    from "./pages/empirica/EmpiricaFundoDetailPage";
import EmpiricaPdfViewerPage      from "./pages/empirica/EmpiricaPdfViewerPage";
import EmpiricaPrivacidadePage    from "./pages/empirica/EmpiricaPrivacidadePage";
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
      <a href="/" style={{ color: "#FF8200", fontSize: 14 }}>Voltar ao início</a>
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
      // Site de finalidade regulatória: existe para exibir e divulgar os
      // materiais dos fundos. Home é a própria listagem.
      { index: true,                              Component: EmpiricaHomePage },

      { path: "fundos",                           Component: EmpiricaHomePage },
      { path: "fundos/fidc",                      Component: EmpiricaFIDCPage },
      { path: "fundos/fif",                       Component: EmpiricaFIFPage },
      { path: "fundos/fii",                       Component: EmpiricaFIIPage },
      { path: "fundos/fip",                       Component: EmpiricaFIPPage },
      { path: "fundos/:category/:slug",           Component: EmpiricaFundoDetailPage },

      { path: "compliance",                       Component: EmpiricaCompliancePage },
      { path: "politica-de-privacidade",          Component: EmpiricaPrivacidadePage },

      { path: "documento/compliance/:docId",      Component: EmpiricaPdfViewerPage },
      { path: "documento/:docId",                 Component: EmpiricaPdfViewerPage },

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
