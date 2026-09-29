/**
 * EmpiricaBanner — cabeçalho das páginas.
 *
 * Fundo escuro, como o banner do site do Grupo SRM, mas deliberadamente
 * diferente para não associar visualmente as duas empresas: sem a tarja
 * vertical lateral, sem o diamante e sem a tagline "capital em movimento",
 * que são as assinaturas de lá. A distinção vem da estrutura, não só da cor:
 * aqui o destaque é uma régua horizontal sob o título.
 */
import React from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { useTheme } from "../../../design-system";

// Azul profundo próprio — não é o #0e2041/#1d3f80 do Grupo SRM
const FUNDO_ESCURO = "#102a47";
const FUNDO_PROFUNDO = "#0a1c30";

export interface Crumb { label: string; href?: string }

export interface EmpiricaBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  breadcrumbs?: Crumb[];
}

export function EmpiricaBanner({ title, subtitle, badge, breadcrumbs }: EmpiricaBannerProps) {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();

  const linkClaro: React.CSSProperties = {
    fontSize: t.textSm,
    color: "rgba(255,255,255,0.62)",
    textDecoration: "none",
  };

  return (
    <header
      style={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box" as const,
        background: `linear-gradient(135deg, ${FUNDO_ESCURO} 0%, ${FUNDO_PROFUNDO} 100%)`,
        padding: isMobile ? "32px 20px 36px" : "56px 56px 60px",
        fontFamily: t.fontFamily,
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative" }}>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Trilha de navegação"
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: 6, marginBottom: 18 }}
          >
            <Link to="/" style={linkClaro}>Início</Link>
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={`${c.label}-${i}`}>
                <ChevronRight size={13} color="rgba(255,255,255,0.32)" aria-hidden="true" />
                {c.href ? (
                  <Link to={c.href} style={linkClaro}>{c.label}</Link>
                ) : (
                  <span style={{ fontSize: t.textSm, color: "#ffffff", fontWeight: 600 }}>{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Badge */}
        {badge && (
          <span
            style={{
              display: "inline-block",
              padding: "5px 12px",
              marginBottom: 16,
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 4,
              background: "rgba(255,255,255,0.07)",
              fontSize: t.text2Xs,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            {badge}
          </span>
        )}

        <h1
          style={{
            fontSize: isMobile ? t.text2xl : t.text4xl ?? t.text3xl,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.14,
            margin: 0,
            maxWidth: 820,
          }}
        >
          {title}
        </h1>

        {/* Régua horizontal — o destaque daqui, no lugar da tarja vertical do SRM */}
        <div
          aria-hidden="true"
          style={{
            width: 56,
            height: 3,
            background: "rgba(255,255,255,0.55)",
            borderRadius: 2,
            margin: subtitle ? "20px 0 18px" : "20px 0 0",
          }}
        />

        {subtitle && (
          <p
            style={{
              fontSize: isMobile ? t.textMd : t.textXl,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.65,
              margin: 0,
              maxWidth: 720,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

export default EmpiricaBanner;
