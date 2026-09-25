/**
 * EmpiricaFaqDrawer — Fechamento de Fundo / Perguntas & Respostas
 * Usa DSDrawer como base com header customizado.
 * Q&A renderizado via DSAccordion com customBody (markdown-lite).
 */
import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { DSDrawer, DSAccordion, DSButton } from '../../../design-system';
import { useTheme } from '../../../design-system';
import { useSrmViewport } from '../site/poc2/useSrmViewport';
import { FundFaq } from './data/fund-faqs';

const BG_HEADER  = '#0e2041';
const SIDEBAR_BG = '#1d3f80';

// ── Markdown-lite inline renderer ─────────────────────────────────────────────
function renderInline(
  text: string,
  linkColor: string,
  boldColor: string,
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.*?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0, k = 0, m: RegExpExecArray | null;

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      parts.push(
        <strong key={k++} style={{ fontWeight: 600, color: boldColor }}>{m[1]}</strong>
      );
    } else {
      parts.push(
        <a key={k++} href={m[3]} target="_blank" rel="noopener noreferrer"
          style={{ color: linkColor, textDecoration: 'underline', fontWeight: 500 }}>
          {m[2]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function RichText({ text, style }: { text: string; style?: React.CSSProperties }) {
  const { tokens: t } = useTheme();
  const paragraphs = text.split('\n\n');
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} style={{ margin: i < paragraphs.length - 1 ? '0 0 12px' : 0, ...style }}>
          {renderInline(para, t.brandAccentStrong, t.textPrimary)}
        </p>
      ))}
    </>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean;
  onClose: () => void;
  faq: FundFaq;
  /** Sobrescreve o comportamento de um banner pelo label — se definido, chama o callback em vez de abrir a URL */
  onBannerAction?: Record<string, () => void>;
}

export function EmpiricaFaqDrawer({ isOpen, onClose, faq, onBannerAction }: Props) {
  const { tokens: t } = useTheme();
  const { isMobile } = useSrmViewport();

  const customHeader = (
    <div style={{
      position: 'relative', background: BG_HEADER, overflow: 'hidden',
      padding: '32px 24px 32px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, flexShrink: 0,
    }}>
      {/* Left tarja */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: SIDEBAR_BG }} />

      {/* Text */}
      <div style={{ paddingLeft: 18 }}>
        <div style={{
          fontFamily: t.fontFamily, fontSize: 10, fontWeight: 700,
          color: 'rgba(255,255,255,0.45)', letterSpacing: '1.4px',
          textTransform: 'uppercase' as const, marginBottom: 6,
        }}>
          {faq.fundTitle}
        </div>
        <h2 style={{
          fontFamily: t.fontFamily, fontSize: isMobile ? 20 : 24,
          fontWeight: 800, color: '#fff', lineHeight: 1.15,
          letterSpacing: '-0.02em', margin: 0,
        }}>
          {faq.pageTitle}
        </h2>
        {faq.pageSubtitle && (
          <div style={{
            fontFamily: t.fontFamily, fontSize: 12, fontWeight: 500,
            color: 'rgba(255,255,255,0.52)', marginTop: 4, letterSpacing: '0.02em',
          }}>
            {faq.pageSubtitle}
          </div>
        )}
      </div>

      {/* Close */}
      <button onClick={onClose} aria-label="Fechar" style={{
        flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background 0.18s',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}>
        <X size={18} color="rgba(255,255,255,0.9)" strokeWidth={2} />
      </button>
    </div>
  );

  // DSAccordion items — each question uses customBody for rich text
  const accordionItems = faq.items.map((item) => ({
    title: item.question,
    body: '',
    customBody: (
      <div>
        <RichText text={item.answer} style={{
          fontFamily: t.fontFamily, fontSize: t.textMd,
          color: t.textSecondary, lineHeight: 1.75,
        }} />
        {item.answerImage && (
          <img
            src={item.answerImage}
            alt="Gráfico de liquidez"
            style={{
              display: 'block', width: '100%', marginTop: 16,
              borderRadius: t.radiusSm, border: `1px solid ${t.borderDefault}`,
            }}
          />
        )}
      </div>
    ),
  }));

  return (
    <DSDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={faq.pageTitle}
      width={isMobile ? 9999 : 680}
      customHeader={customHeader}
    >
      {/* Botões de acesso rápido */}
      {faq.banners && faq.banners.length > 0 && (
        <div style={{
          margin: '-28px -32px 28px',
          padding: '16px 32px',
          background: t.surfaceBackground,
          borderBottom: `1px solid ${t.borderDefault}`,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {faq.banners.map((banner, i) => (
            <DSButton
              key={i}
              variant="secondary"
              size="md"
              fullWidth
              icon="right"
              iconEl={<ExternalLink size={14} />}
              onClick={() => onBannerAction?.[banner.label] ? onBannerAction[banner.label]() : window.open(banner.href, '_blank')}
            >
              {banner.label}
            </DSButton>
          ))}
        </div>
      )}

      {/* Contador */}
      <div style={{
        marginBottom: 16,
        fontFamily: t.fontFamily, fontSize: t.text2Xs, fontWeight: 600,
        color: t.textSecondary, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
      }}>
        {faq.items.length} pergunta{faq.items.length !== 1 ? 's' : ''}
      </div>

      {/* FAQ accordion via DSAccordion */}
      <DSAccordion items={accordionItems} defaultOpen={null} />

      {/* Closing statement */}
      {faq.closing && (
        <div style={{
          marginTop: 24,
          padding: '20px 24px',
          background: t.surfaceBackground,
          borderRadius: t.radiusMd,
          border: `1px solid ${t.borderDefault}`,
        }}>
          <RichText text={faq.closing} style={{
            fontFamily: t.fontFamily, fontSize: t.textSm, color: t.textSecondary, lineHeight: 1.7,
          }} />
        </div>
      )}
    </DSDrawer>
  );
}
