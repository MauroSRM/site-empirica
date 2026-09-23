/**
 * useSrmViewport — Hook de viewport para o siteSRM
 *
 * Regras de escala:
 *   < 768px  → isMobile: true  (layout responsivo, sem canvas/scale)
 *   768–1440 → scale = vw/1440  (canvas escalado, comportamento atual)
 *   > 1440px → scale = 1 (capped), canvas centrado via offsetLeft
 */
import { useState, useEffect } from "react";

export const MOBILE_BP  = 768;
export const CANVAS_W   = 1440;

export function useSrmViewport() {
  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : CANVAS_W
  );

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile   = vw < MOBILE_BP;
  const scale      = Math.min(vw / CANVAS_W, 1);
  const offsetLeft = vw > CANVAS_W ? Math.round((vw - CANVAS_W) / 2) : 0;

  return { vw, isMobile, scale, offsetLeft };
}
