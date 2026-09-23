/**
 * main.tsx — Entry point do Figma Make
 * Usa `react-router` (v7) — NÃO usar react-router-dom
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";

import "./styles/fonts.css";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
