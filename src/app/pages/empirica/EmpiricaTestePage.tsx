/**
 * EmpiricaTestePage — Lab: Mini Tarja de Identidade
 * /empirica/teste  (temporária — pode apagar depois)
 *
 * Refinamento focado na tarja do /site-srm/acesso (Premium layout),
 * adaptada como elemento de identidade do site Empírica.
 * Variações: LEFT · RIGHT · BOTTOM fixed · BOTTOM integrada
 *
 * 100% inline styles — zero Tailwind.
 */
import React, { useState } from "react";

// ─── Tokens DS [SiteSRM] ──────────────────────────────────────────────────────
const NAVY    = "#162e61";
const BLUE    = "#1D3F80";
const ORANGE  = "#FF8200";
const WHITE   = "#ffffff";
const LIGHT   = "#F0F2F6";
const GRAY    = "#6B7280";
const GRAY2   = "#9CA3AF";
const BORDER  = "#E5E7EB";
const FONT    = "'Inter', system-ui, sans-serif";

// ─── Logo SVG Empírica ────────────────────────────────────────────────────────
const EMPIRICA_PATH = "M105.928 36.4443C107.044 36.4443 108.147 36.8278 108.939 37.6436L108.136 38.5918C107.608 38.0519 106.852 37.7275 106.012 37.7275C104.296 37.7276 103.12 39.0358 103.12 40.8115C103.12 42.5875 104.296 43.8838 106.012 43.8838C106.852 43.8838 107.608 43.5715 108.136 43.0195L108.939 43.9805C108.147 44.7962 107.056 45.1797 105.928 45.1797C103.42 45.1797 101.656 43.3075 101.656 40.8115C101.656 38.3158 103.42 36.4444 105.928 36.4443ZM64.2676 37.8359H60.4277V40.1035H63.8359V41.3281H60.4277V43.7637H64.3877V45H59V36.5996H64.2676V37.8359ZM70.8779 41.9521H70.9014L75.1016 36.4443H75.1738V45H73.7812V40.4883L70.9258 44.1963H70.8535L67.9971 40.4883V45H66.6055V36.4443H66.6777L70.8779 41.9521ZM80.9561 36.5996C82.78 36.5996 84.0039 37.7282 84.0039 39.4082C84.0038 41.0881 82.7799 42.2158 80.9561 42.2158H79.0957V45H77.668V36.5996H80.9561ZM87.416 45H85.9883V36.5996H87.416V45ZM93.1904 36.5996C94.8701 36.5998 96.1776 37.596 96.1777 39.2637C96.1777 40.4997 95.4698 41.3516 94.4258 41.7236L96.334 45H94.7021L92.9141 41.9277H91.3418V45H89.9141V36.5996H93.1904ZM99.6738 45H98.2461V36.5996H99.6738V45ZM118.033 45H116.485L115.766 43.3916H112.262L111.541 45H109.981L113.978 36.4443H114.05L118.033 45ZM112.813 42.1562H115.214L114.025 39.5156H114.001L112.813 42.1562ZM79.0957 40.9805H80.7764C81.88 40.9803 82.5399 40.344 82.54 39.4082C82.54 38.4723 81.8801 37.8361 80.7764 37.8359H79.0957V40.9805ZM91.3418 40.6924H92.998C94.09 40.6924 94.7139 40.1757 94.7139 39.2637C94.7137 38.3639 94.0899 37.8359 92.998 37.8359H91.3418V40.6924ZM87.7363 35.5879H86.752L87.2324 32H88.6963L87.7363 35.5879ZM24.5215 25.0186L12.4268 32L0.331055 25.0186H24.5215ZM118.307 30.5264H114.69V11.4688L118.307 7.85352V30.5264ZM115.684 8.48926L101.797 22.375H101.163L88.2686 9.48145V29.9658L88.2559 29.9785V30.5244H84.1953L72.8379 18.8115H61.3945V30.5244H57.7783V8.82031H61.3945V15.1152H77.4512C78.7082 15.1151 79.7102 14.3689 80.5137 12.8379L80.5566 12.7715C80.5708 12.7479 80.7073 12.4971 80.8633 11.3203C80.8491 9.69917 79.9749 8.5271 78.1836 7.75195L77.5498 7.61035L64.5098 7.54395V3.90918H77.4561C79.9988 3.90936 82.1585 5.36036 83.8789 8.21973L83.917 8.28613L83.9404 8.35645C84.3091 9.48136 84.4844 10.3231 84.4844 10.9375V11.6182C84.4843 14.695 82.8058 16.9831 79.502 18.4199L79.4502 18.4385C78.7508 18.6748 78.108 18.802 77.5361 18.8115H77.5264L84.6533 25.916V3.91406H87.877L101.522 17.4736L115.017 4.16895L118.042 1.31445L124.479 0L115.684 8.48926ZM49.4492 15.1123C52.3419 15.1123 54.6203 16.5677 56.2227 19.4414L56.2178 19.4277C56.7234 20.4013 56.9785 21.4459 56.9785 22.5518V23.4023C56.9785 25.6711 55.6881 27.7365 53.1357 29.542L53.0322 29.6035C51.7183 30.2179 50.6831 30.5156 49.8701 30.5156H29.4365V26.8154H48.4287C50.8863 26.8153 52.3984 25.9498 53.0459 24.168L53.2822 22.8398C53.268 20.85 52.2708 19.6161 50.1533 18.9639L49.6572 18.8936L35.7559 18.8086L39.4854 15.1123H49.4492ZM24.8525 10.4844V24.4473L12.7568 3.49902L24.8525 10.4844ZM0 24.4424V10.4805L12.0957 3.49414L0 24.4424ZM63.5488 7.54199L60.7227 7.52832H38.0674C35.9925 7.52834 34.6647 7.94411 34.1211 8.76172L34.0732 8.82812C33.3833 9.63153 33.0479 10.4306 33.0479 11.2812C33.048 13.1102 33.989 14.3435 35.9268 15.043L38.1006 15.2607L34.5693 18.5547L34.1777 18.3896C33.0528 17.917 31.9133 17.0474 30.7979 15.7949L30.7275 15.7002C29.8767 14.3153 29.4414 12.9445 29.4414 11.6211V10.9404C29.4415 8.44499 30.8311 6.31363 33.5723 4.60742L33.6289 4.56934L33.6953 4.5459C34.8673 4.12058 35.7748 3.91218 36.4648 3.91211H63.5488V7.54199Z";

// ─── SRM Símbolo SVG (triângulo — mesmo do /site-srm/acesso) ─────────────────
// Path do triângulo SRM extraído do Logo-1
const SRM_SYMBOL_PATH = "M24.5215 25.0186L12.4268 32L0.331055 25.0186H24.5215ZM24.8525 10.4844V24.4473L12.7568 3.49902L24.8525 10.4844ZM0 24.4424V10.4805L12.0957 3.49414L0 24.4424Z";

function SrmSymbol({ color = WHITE, size = 28 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 25 32" width={size * 0.78} height={size} fill="none" style={{ display: "block", flexShrink: 0 }}>
      <path d={SRM_SYMBOL_PATH} fill={color} />
    </svg>
  );
}

function EmpiricaLogo({ color = WHITE, width = 88 }: { color?: string; width?: number }) {
  const h = Math.round(width * 46 / 125);
  return (
    <svg viewBox="0 0 125 46" width={width} height={h} fill="none" style={{ display: "block", flexShrink: 0 }}>
      <path d={EMPIRICA_PATH} fill={color} />
    </svg>
  );
}

// ─── Nav items (mock) ─────────────────────────────────────────────────────────
const NAV = ["Início", "Quem Somos", "Nossos Fundos", "Contato"];

// ─── Mock page content ────────────────────────────────────────────────────────
function MockPageContent() {
  return (
    <div style={{ padding: "32px 40px 40px", background: LIGHT, flexGrow: 1, minHeight: 0 }}>
      <div style={{
        background: `linear-gradient(148deg, #2250A0 0%, ${NAVY} 65%, #091A48 100%)`,
        borderRadius: 3, padding: "32px 36px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 28, height: 3, borderRadius: 2, background: ORANGE }} />
          <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: ORANGE, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Crédito Estruturado
          </span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: WHITE, lineHeight: 1.2, marginBottom: 6 }}>
          Nossos Fundos de Investimento
        </div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>
          Pioneiros em FIDC no Brasil. Expertise em operações não-óbvias de crédito.
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {["FIDC", "FIF", "FII"].map(cat => (
          <div key={cat} style={{ background: WHITE, borderRadius: 3, border: `1px solid ${BORDER}`, padding: "16px 18px" }}>
            <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{cat}</div>
            <div style={{ width: 20, height: 2.5, borderRadius: 2, background: ORANGE, marginBottom: 10 }} />
            <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY, lineHeight: 1.5 }}>Fundos de crédito estruturado de alta performance.</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mock header (comum a todos os previews) ──────────────────────────────────
function MockHeader() {
  return (
    <div style={{
      height: 60, background: WHITE, borderBottom: `1px solid ${BORDER}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", flexShrink: 0,
    }}>
      <EmpiricaLogo color="#184987" width={76} />
      <div style={{ display: "flex", gap: 20 }}>
        {NAV.map(n => <span key={n} style={{ fontFamily: FONT, fontSize: 12, color: NAVY, cursor: "pointer" }}>{n}</span>)}
      </div>
      <div style={{ height: 30, padding: "0 14px", background: ORANGE, borderRadius: 3, display: "flex", alignItems: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: WHITE }}>Área do Cotista</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MINI TARJA — A: LATERAL ESQUERDA (derivada direta do acesso premium)
// Inspiração: width 115px → mini: 72px, logo símbolo + marca escrita rotacionada
// ══════════════════════════════════════════════════════════════════════════════
function TarjaLateralEsquerda() {
  return (
    <div style={{ display: "flex", height: 460, border: `1px solid ${BORDER}`, borderRadius: 3, overflow: "hidden" }}>

      {/* ── TARJA ── */}
      <div style={{
        width: 72, flexShrink: 0,
        background: NAVY,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        paddingTop: 28, paddingBottom: 28,
        boxSizing: "border-box",
        position: "relative",
      }}>
        {/* Linha accent top (orange) */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: ORANGE }} />

        {/* Símbolo SRM */}
        <SrmSymbol color={WHITE} size={26} />

        {/* Texto rotacionado — "SRM EMPÍRICA" */}
        <div style={{
          flexGrow: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <span style={{
            fontFamily: FONT, fontSize: 10, fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.22em", textTransform: "uppercase",
            transform: "rotate(-90deg)",
            whiteSpace: "nowrap",
          }}>
            SRM Empírica
          </span>
        </div>

        {/* Linha accent bottom */}
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,130,0,0.5)" }} />
      </div>

      {/* ── CONTEÚDO ── */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <MockHeader />
        <MockPageContent />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MINI TARJA — B: LATERAL DIREITA
// Mesmo DNA, espelhada. Mais discreta (não interfere no fluxo de leitura).
// ══════════════════════════════════════════════════════════════════════════════
function TarjaLateralDireita() {
  return (
    <div style={{ display: "flex", height: 460, border: `1px solid ${BORDER}`, borderRadius: 3, overflow: "hidden" }}>

      {/* ── CONTEÚDO ── */}
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <MockHeader />
        <MockPageContent />
      </div>

      {/* ── TARJA ── */}
      <div style={{
        width: 72, flexShrink: 0,
        background: NAVY,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        paddingTop: 28, paddingBottom: 28,
        boxSizing: "border-box",
        position: "relative",
      }}>
        {/* Linha accent top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: ORANGE }} />

        {/* Símbolo SRM */}
        <SrmSymbol color={WHITE} size={26} />

        {/* Texto rotacionado */}
        <div style={{
          flexGrow: 1,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: FONT, fontSize: 10, fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.22em", textTransform: "uppercase",
            transform: "rotate(90deg)",
            whiteSpace: "nowrap",
          }}>
            SRM Empírica
          </span>
        </div>

        {/* Linha accent bottom */}
        <div style={{ width: 24, height: 2, borderRadius: 1, background: "rgba(255,130,0,0.5)" }} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MINI TARJA — C: HORIZONTAL BOTTOM (fica acima do footer, sempre visível)
// Ícone SRM + "SRM EMPÍRICA" escrito inline + tagline
// ══════════════════════════════════════════════════════════════════════════════
function TarjaBottomHorizontal() {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 3, overflow: "hidden" }}>

      {/* ── CONTEÚDO ── */}
      <div style={{ height: 380, display: "flex", flexDirection: "column" }}>
        <MockHeader />
        <MockPageContent />
      </div>

      {/* ── TARJA BOTTOM ── */}
      <div style={{
        background: NAVY,
        borderTop: `3px solid ${ORANGE}`,
        height: 52,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        gap: 0,
        flexShrink: 0,
      }}>
        {/* Esquerda: símbolo + marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexGrow: 1 }}>
          <SrmSymbol color={WHITE} size={22} />
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)" }} />
          <span style={{
            fontFamily: FONT, fontSize: 12, fontWeight: 600,
            color: WHITE, letterSpacing: "0.04em",
          }}>
            SRM Empírica
          </span>
          <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.15)" }} />
          <span style={{
            fontFamily: FONT, fontSize: 10, fontWeight: 400,
            color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Gestão de Crédito Estruturado
          </span>
        </div>

        {/* Direita: link site grupo */}
        <span style={{
          fontFamily: FONT, fontSize: 10,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.06em",
          cursor: "pointer",
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>
          Parte do Grupo SRM →
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MINI TARJA — D: BOTTOM com logo Empírica escrito (variação mais clean)
// Logo Empírica horizontal + separador + tagline
// ══════════════════════════════════════════════════════════════════════════════
function TarjaBottomClean() {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 3, overflow: "hidden" }}>

      {/* ── CONTEÚDO ── */}
      <div style={{ height: 380, display: "flex", flexDirection: "column" }}>
        <MockHeader />
        <MockPageContent />
      </div>

      {/* ── TARJA BOTTOM CLEAN ── */}
      <div style={{
        background: NAVY,
        height: 48,
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        flexShrink: 0,
        position: "relative",
      }}>
        {/* Linha accent orange — top edge */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${ORANGE} 0%, #ff9928 40%, transparent 100%)`,
        }} />

        {/* Logo Empírica horizontal (inline) */}
        <EmpiricaLogo color={WHITE} width={72} />

        {/* Separador */}
        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.18)", margin: "0 16px" }} />

        {/* Tagline */}
        <span style={{
          fontFamily: FONT, fontSize: 10, fontWeight: 500,
          color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}>
          Gestão de Crédito Estruturado
        </span>

        {/* Spacer */}
        <div style={{ flexGrow: 1 }} />

        {/* Parte do grupo SRM — símbolo discreto */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: FONT, fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Grupo SRM
          </span>
          <SrmSymbol color="rgba(255,255,255,0.25)" size={16} />
        </div>
      </div>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
interface CardProps {
  letter: string;
  title: string;
  sub: string;
  nota: string;
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}
function Card({ letter, title, sub, nota, active, onSelect, children }: CardProps) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      border: `2px solid ${active ? ORANGE : hov ? "#d0d8e8" : BORDER}`,
      borderRadius: 3, overflow: "hidden",
      transition: "border-color 0.18s, box-shadow 0.18s",
      boxShadow: active ? `0 0 0 4px rgba(255,130,0,0.10)` : "none",
    }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Header */}
      <div style={{
        padding: "18px 24px 14px",
        borderBottom: `1px solid ${BORDER}`,
        background: active ? "rgba(255,130,0,0.04)" : WHITE,
        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Badge letra */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: active ? ORANGE : NAVY,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.2s",
          }}>
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: WHITE }}>{letter}</span>
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 2 }}>{title}</div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: GRAY, marginBottom: 4, lineHeight: 1.5 }}>{sub}</div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: GRAY2, fontStyle: "italic" }}>{nota}</div>
          </div>
        </div>
        <button
          onClick={onSelect}
          style={{
            flexShrink: 0, height: 30, padding: "0 14px",
            background: active ? ORANGE : "transparent",
            border: `1.5px solid ${active ? ORANGE : BORDER}`,
            borderRadius: 3, cursor: "pointer",
            fontFamily: FONT, fontSize: 11, fontWeight: 500,
            color: active ? WHITE : GRAY,
            transition: "all 0.18s",
          }}
        >
          {active ? "✓ Selecionado" : "Selecionar"}
        </button>
      </div>
      {/* Preview */}
      <div style={{ background: "#f8f9fa", padding: 14 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Referência visual: a tarja original do acesso ───────────────────────────
function RefTarjaOriginal() {
  return (
    <div style={{
      display: "flex", gap: 16, padding: "20px 24px",
      background: LIGHT, borderRadius: 3,
      border: `1px solid ${BORDER}`, marginBottom: 36,
      alignItems: "flex-start",
    }}>
      {/* Mini simulação da tarja original */}
      <div style={{
        flexShrink: 0,
        width: 80, height: 160,
        background: NAVY,
        borderRadius: 3,
        display: "flex", flexDirection: "column",
        alignItems: "center",
        paddingTop: 16, paddingBottom: 20,
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        <SrmSymbol color={WHITE} size={24} />
        <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{
            fontFamily: FONT, fontSize: 7, fontWeight: 600,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.2em", textTransform: "uppercase",
            transform: "rotate(-90deg)", whiteSpace: "nowrap",
          }}>
            capital em movimento
          </span>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 4 }}>
          Referência: Tarja do /site-srm/acesso (Premium)
        </div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: GRAY, lineHeight: 1.6, maxWidth: 500 }}>
          115px de largura, navy #162e61, símbolo SRM no topo + "capital em movimento" rotacionado.<br />
          <strong style={{ color: NAVY }}>Proposta:</strong> adaptar como mini tarja de identidade da Empírica — mesma estrutura,
          textos e ícones da Empírica, dimensão reduzida (72px), ou transposta para o eixo horizontal (bottom bar).
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EmpiricaTestePage() {
  const [selected, setSelected] = useState<string | null>(null);

  const cards = [
    {
      letter: "A",
      title: "Mini Tarja — Lateral Esquerda",
      sub: "72px, navy, fixed left. Símbolo SRM no topo + \u0022SRM EMPÍRICA\u0022 rotacionado + accent orange top.",
      nota: "Idêntica ao DNA do login. Ocupa espaço lateral permanente. Mais impactante.",
      preview: <TarjaLateralEsquerda />,
    },
    {
      letter: "B",
      title: "Mini Tarja — Lateral Direita",
      sub: "Mesma estrutura, espelhada à direita. Não interfere no fluxo de leitura (olho vai da esq. → dir.).",
      nota: "Mais discreta que A. Marca presente mas não compete com conteúdo.",
      preview: <TarjaLateralDireita />,
    },
    {
      letter: "C",
      title: "Mini Tarja — Bottom Horizontal (símbolo + marca escrita)",
      sub: "Barra horizontal 52px, navy, fixa no bottom. Símbolo SRM + \u0022SRM Empírica\u0022 + tagline + link Grupo SRM.",
      nota: "Zero impacto no layout lateral. Boa para mobile. Funciona como rodapé de identidade.",
      preview: <TarjaBottomHorizontal />,
    },
    {
      letter: "D",
      title: "Mini Tarja — Bottom Clean (logo horizontal)",
      sub: "Barra 48px, navy, com logo Empírica horizontal + tagline + símbolo SRM discreto à direita.",
      nota: "A mais elegante. Gradiente orange no topo âncora a marca sem gritar.",
      preview: <TarjaBottomClean />,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: WHITE, fontFamily: FONT }}>

      {/* ── Top bar de lab ── */}
      <div style={{
        background: NAVY, borderBottom: `3px solid ${ORANGE}`,
        padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SrmSymbol color={WHITE} size={28} />
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)" }} />
          <div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: ORANGE, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Lab · Mini Tarja de Identidade Empírica
            </div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              /empirica/teste — temporária
            </div>
          </div>
        </div>
        <a href="/empirica" style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
          ← Voltar ao site Empírica
        </a>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 40px 80px" }}>

        {/* Título */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 3, height: 24, background: ORANGE, borderRadius: 2 }} />
            <h1 style={{ fontFamily: FONT, fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>
              Variações da Mini Tarja
            </h1>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 13, color: GRAY, margin: "0 0 0 15px", lineHeight: 1.6, maxWidth: 620 }}>
            DNA: a tarja lateral da tela de acesso aprovada. Adaptada para a Empírica com símbolo SRM e marca escrita.
            4 posicionamentos para escolher.
          </p>
        </div>

        {/* Referência */}
        <RefTarjaOriginal />

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 48 }}>
          {cards.map(c => (
            <Card
              key={c.letter}
              letter={c.letter}
              title={c.title}
              sub={c.sub}
              nota={c.nota}
              active={selected === c.letter}
              onSelect={() => setSelected(selected === c.letter ? null : c.letter)}
            >
              {c.preview}
            </Card>
          ))}
        </div>

        {/* Painel de decisão */}
        <div style={{
          background: LIGHT, border: `1px solid ${BORDER}`,
          borderRadius: 3, padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          {selected ? (
            <>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: ORANGE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: WHITE }}>{selected}</span>
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: NAVY }}>
                  Conceito {selected} selecionado
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: GRAY, marginTop: 3 }}>
                  Diga "implementar Conceito {selected}" — eu aplico no EmpiricaLayout e em todas as páginas do site.
                </div>
              </div>
            </>
          ) : (
            <div style={{ fontFamily: FONT, fontSize: 13, color: GRAY }}>
              Clique em "Selecionar" em algum conceito para indicar sua preferência.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}