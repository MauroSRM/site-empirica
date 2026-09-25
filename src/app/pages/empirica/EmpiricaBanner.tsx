/**
 * EmpiricaBanner — cabeçalho das páginas.
 *
 * Substitui o SiteSrmBanner, que carregava três marcas do Grupo SRM: o azul
 * institucional, o diamante e a tarja "capital em movimento". Aqui o banner é
 * neutro, em cinza, para não caracterizar o site como SRM.
 */
import React from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { useSrmViewport } from "../site/poc2/useSrmViewport";
import { useTheme } from "../../../design-system";

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

  return (
    <header
      style={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box" as const,
        background: t.surfaceMuted,
        borderBottom: `1px solid ${t.borderDefault}`,
        padding: isMobile ? "28px 20px 32px" : "44px 56px 48px",
        fontFamily: t.fontFamily,
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Trilha de navegação"
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap" as const, gap: 6, marginBottom: 16 }}
          >
            <Link
              to="/"
              style={{ fontSize: t.textSm, color: t.textSecondary, textDecoration: "none" }}
            >
              Início
            </Link>
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={`${c.label}-${i}`}>
                <ChevronRight size={13} color={t.neutral300} aria-hidden="true" />
                {c.href ? (
                  <Link to={c.href} style={{ fontSize: t.textSm, color: t.textSecondary, textDecoration: "none" }}>
                    {c.label}
                  </Link>
                ) : (
                  <span style={{ fontSize: t.textSm, color: t.textPrimary, fontWeight: 600 }}>{c.label}</span>
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
              padding: "4px 10px",
              marginBottom: 12,
              border: `1px solid ${t.borderDefault}`,
              borderRadius: 4,
              background: t.surfaceDefault,
              fontSize: t.text2Xs,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: t.textSecondary,
            }}
          >
            {badge}
          </span>
        )}

        {/* Título com filete de destaque */}
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div
            aria-hidden="true"
            style={{
              width: 3,
              alignSelf: "stretch",
              minHeight: isMobile ? 28 : 38,
              background: t.brandAccent,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <div>
            <h1
              style={{
                fontSize: isMobile ? t.text2xl : t.text4xl ?? t.text3xl,
                fontWeight: 700,
                color: t.textPrimary,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                style={{
                  fontSize: isMobile ? t.textMd : t.textXl,
                  color: t.textSecondary,
                  lineHeight: 1.65,
                  margin: "10px 0 0",
                  maxWidth: 720,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default EmpiricaBanner;
