/**
 * App.tsx — Entry point do roteador SRM Digital
 * Usa `react-router` (v7) — NÃO usar react-router-dom (não suportado no Figma Make)
 */

import React, { Suspense, Component, ErrorInfo, ReactNode } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider, DSToastProvider } from "../design-system";

interface ErrorBoundaryState { hasError: boolean; message: string }

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message ?? String(error) };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[App] Render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100vh",
          fontFamily: "Inter, system-ui, sans-serif", padding: 32,
          background: "#f4f6f9",
        }}>
          <p style={{ color: "#223572", fontWeight: 600, marginBottom: 8 }}>Erro ao carregar o app</p>
          <pre style={{ color: "#c0392b", fontSize: 12, maxWidth: 600, whiteSpace: "pre-wrap" }}>
            {this.state.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, padding: "8px 20px", background: "#223572", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function GlobalLoader() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#f4f6f9",
      fontFamily: "Inter, system-ui, sans-serif",
      color: "#223572",
      fontSize: 14,
    }}>
      Carregando…
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DSToastProvider>
          <Suspense fallback={<GlobalLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </DSToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
