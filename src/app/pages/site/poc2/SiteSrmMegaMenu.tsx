/**
 * SrmMegaMenu — MegaMenu do site SRM Empírica
 * Visual baseado no design DS-Matriz: 4 colunas, icon + header, footer bar.
 * Exporta SiteSrmMegaMenu e Poc2MegaMenu (alias) para compatibilidade.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight } from "lucide-react";
import { useTheme } from '../../../../design-system';

interface MenuLinkItem {
  title: string;
  description: string;
  href?: string;
}

interface MenuColumn {
  label?: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  items: MenuLinkItem[];
  twoCol?: boolean;
}

interface MegaMenuFooter {
  ctaLabel: string;
  ctaHref?: string;
  tagline?: string;
  onCtaClick?: () => void;
}

// ─── Dados — fonte única ───────────────────────────────────────────────────────
const INSTITUCIONAL_MENU: MenuColumn[] = [
  {
    label: "INSTITUCIONAL",
    twoCol: true,
    items: [
      { title: "Sobre a SRM",             description: "Nossa história, missão e valores que guiam o Grupo SRM.",                    href: "/sobre" },
      { title: "Central de Ética",         description: "Programa de compliance, código de ética e conduta profissional.",             href: "/central-de-etica" },
      { title: "FAQ",                      description: "Dúvidas frequentes sobre produtos, serviços e operações.",                     href: "/faq" },
      { title: "Trabalhe Conosco",         description: "Oportunidades de carreira em um grupo financeiro em crescimento.",             href: "/trabalhe-conosco" },
      { title: "Contato",                  description: "Fale com nossa equipe de especialistas e tire suas dúvidas.",                  href: "/contato" },
      { title: "Política de Privacidade",  description: "Como coletamos, utilizamos e protegemos seus dados pessoais.",                href: "/politica-de-privacidade" },
    ],
  },
  {
    label: "POLÍTICAS",
    items: [
      { title: "SRM",          description: "Políticas, regulamentos e documentos institucionais do Grupo SRM.",           href: "/politicas/srm" },
      { title: "Nova SRM",     description: "Regulamento, termos de uso e diretrizes da plataforma Nova SRM.",             href: "#" },
      { title: "SRM DTVM",     description: "Políticas de distribuição, compliance e governança da SRM DTVM.",             href: "/politicas/srm-dtvm" },
    ],
  },
  {
    label: "",
    items: [
      { title: "SRM Empírica", description: "Políticas e documentos regulatórios da SRM Empírica.",                        href: "/politicas/srm-empirica" },
      { title: "SRM SEC",      description: "Formulário de referência e demonstrações financeiras da SRM SEC.",            href: "/politicas/srm-sec" },
      { title: "SRM IP",       description: "Tabela de tarifas e documentos regulatórios da SRM IP.",                     href: "/politicas/srm-ip" },
    ],
  },
];

export const SRM_ASSET_MENU: MenuColumn[] = [
  {
    label: "INSTITUCIONAL",
    items: [
      { title: "Institucional", description: "Sobre a SRM Asset, missão e soluções de crédito estruturado via FIDCs.", href: "/unidades/srm-asset" },
    ],
  },
  {
    label: "CRÉDITO",
    items: [
      { title: "Capital de Giro",          description: "Estruturas de capital de giro com taxa prefixada, pós-fixada e funding BNDES.", href: "/srm-asset/capital-de-giro" },
      { title: "Antecipação de Recebíveis", description: "Antecipação de duplicatas, fomento com insumos e estruturas com boletagem.",   href: "/srm-asset/antecipacao-recebiveis" },
    ],
  },
  {
    label: "NOSSOS FUNDOS",
    items: [
      { title: "Fundos de Investimentos", description: "FIDCs, Fundos Multimercado e Debêntures geridos pela SRM Asset.", href: "/srm-asset/fundos-investimentos" },
    ],
  },
];

// ─── Link item ─────────────────────────────────────────────────────────────────
function MegaMenuLink({ title, description, href = "#", onClose }: MenuLinkItem & { onClose?: () => void }) {
  const { tokens: t } = useTheme();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href && href !== "#") {
      e.preventDefault();
      onClose?.();
      navigate(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        padding: "10px 0",
        textDecoration: "none",
        cursor: "pointer",
        borderBottom: `1px solid ${t.borderDefault}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{
          fontFamily: t.fontFamily,
          fontSize: t.textMd,
          fontWeight: 600,
          color: hovered ? t.brandPrimary : t.textPrimary,
          transition: "color 0.15s ease",
        }}>
          {title}
        </span>
        {hovered && <ChevronRight size={12} color={t.brandPrimary} />}
      </div>
      <p style={{
        fontFamily: t.fontFamily,
        fontSize: t.textSm,
        color: t.textSecondary,
        margin: "2px 0 0",
        lineHeight: "16px",
      }}>
        {description}
      </p>
    </a>
  );
}

function MegaMenuColumn({ col, onClose, isLast }: { col: MenuColumn; onClose?: () => void; isLast: boolean }) {
  const { tokens: t } = useTheme();
  const Icon = col.icon;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      flex: col.twoCol ? 2 : 1,
      minWidth: 0,
      padding: "0 32px",
      borderLeft: `1px solid ${t.borderSubtle}`,
    }}>
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, height: 20 }}>
        {Icon && <Icon size={16} color={t.brandAccent} />}
        {col.label && (
          <span style={{
            fontFamily: t.fontFamily,
            fontSize: t.textXs,
            fontWeight: 700,
            // W-02: textSecondary (~4.6:1) — WCAG AA
            color: t.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
          }}>
            {col.label}
          </span>
        )}
      </div>

      {/* Items */}
      {col.twoCol ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
          {col.items.map((item, i) => (
            <div key={item.title} style={{ borderBottom: i >= col.items.length - 2 ? "none" : undefined }}>
              <MegaMenuLink {...item} onClose={onClose} />
            </div>
          ))}
        </div>
      ) : (
        col.items.map((item, i) => (
          <div key={item.title} style={{ borderBottom: i === col.items.length - 1 ? "none" : undefined }}>
            <MegaMenuLink
              {...item}
              onClose={onClose}
            />
          </div>
        ))
      )}
    </div>
  );
}

interface MegaMenuProps {
  columns?: MenuColumn[];
  onClose?: () => void;
  maxWidth?: number;
  centered?: boolean;
  footer?: MegaMenuFooter;
}

// ─── Componente principal ──────────────────────────────────────────────────────
export function SiteSrmMegaMenu({
  columns = INSTITUCIONAL_MENU,
  onClose,
  maxWidth = 1200,
  centered = false,
  footer,
}: MegaMenuProps) {
  const { tokens: t } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      data-name="SrmMegaMenu"
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: t.surfaceDefault,
        boxShadow: t.shadowDropdown,
        boxSizing: "border-box",
        fontFamily: t.fontFamily,
      }}
    >
      <div style={{
        maxWidth,
        margin: centered ? "0 auto" : undefined,
        paddingTop: t.space8,
        paddingBottom: footer ? t.space8 : t.space8,
        paddingLeft: t.paddingPage,
        paddingRight: t.paddingPage,
        boxSizing: "border-box",
      }}>
        {/* Columns grid */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {columns.map((col, i) => (
            <div
              key={i}
              style={{
                flex: col.twoCol ? 2 : 1,
                minWidth: 0,
                padding: i === 0 ? "0 32px 0 0" : "0 32px",
                borderLeft: i > 0 ? `1px solid ${t.borderSubtle}` : "none",
              }}
            >
              {/* Column header */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, height: 20 }}>
                {col.icon && React.createElement(col.icon, { size: 16, color: t.brandAccent })}
                {col.label && (
                  <span style={{
                    fontFamily: t.fontFamily,
                    fontSize: t.textXs,
                    fontWeight: 700,
                    color: t.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}>
                    {col.label}
                  </span>
                )}
              </div>

              {/* Items */}
              {col.twoCol ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 8px" }}>
                  {col.items.map((item, j) => (
                    <MegaMenuLink key={item.title} {...item} onClose={onClose} />
                  ))}
                </div>
              ) : (
                col.items.map((item) => (
                  <MegaMenuLink key={item.title} {...item} onClose={onClose} />
                ))
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer bar */}
      {footer && (
        <div style={{
          borderTop: `1px solid ${t.borderDefault}`,
          backgroundColor: t.surfaceSubtle,
          padding: `16px ${t.paddingPage}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <button
            onClick={() => { onClose?.(); footer.onCtaClick?.(); if (footer.ctaHref) navigate(footer.ctaHref); }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: t.fontFamily,
              fontSize: t.textMd,
              fontWeight: 600,
              // W-02: brandPrimary (~5.9:1) — WCAG AA
              color: t.brandPrimary,
              padding: 0,
            }}
          >
            → {footer.ctaLabel}
          </button>
          {footer.tagline && (
            <span style={{ fontFamily: t.fontFamily, fontSize: t.text2Xs, color: t.textSecondary }}>
              {footer.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Alias para compatibilidade com Poc2MainHeader
export { SiteSrmMegaMenu as Poc2MegaMenu };

export default SiteSrmMegaMenu;
