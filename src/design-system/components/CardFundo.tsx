/**
 * CardFundo — Card de apresentação de fundo de investimento
 *
 * Card de apresentação de fundo de investimento com ficha técnica e documentos opcionais.
 *
 * Dependências internas: DSTag (neutral-brand2 para categoria)
 *
 * Specs:
 * - Padding: 24px
 * - Nome do fundo: 17px, peso 700, uppercase
 * - Linha accent decorativa: 32×3px, brandAccent, radiusXs
 * - Label do campo: 10px, peso 600, uppercase
 * - Radius: cardRadius
 */

import React, { CSSProperties } from 'react';
import { useTheme } from '../tokens';
import { DSTag } from './DSTag';
import { ExternalLink } from 'lucide-react';

export interface CardFundoField {
  /** Rótulo do campo */
  label: string;

  /** Valor do campo */
  value: string;
}

export interface CardFundoDocument {
  /** Label do documento */
  label: string;

  /** URL do documento */
  url: string;
}

export interface CardFundoProps {
  /** Nome do fundo (uppercase) */
  name: string;

  /** Pares de rótulo/valor da ficha técnica */
  fields: CardFundoField[];

  /** Exibe badge de categoria */
  showTag?: boolean;

  /** Texto da tag (ex: "Renda Fixa") */
  tagLabel?: string;

  /** Exibe seção de documentos */
  showDocuments?: boolean;

  /** Links de documentos */
  documents?: CardFundoDocument[];

  /** Estilos extras */
  style?: CSSProperties;
}

const MOCK_DOCUMENTS: CardFundoDocument[] = [
  { label: 'Regulamento', url: '#' },
  { label: 'Lâmina', url: '#' },
  { label: 'Informe Mensal', url: '#' },
];

export function CardFundo({
  name,
  fields,
  showTag = true,
  tagLabel,
  showDocuments = false,
  documents = MOCK_DOCUMENTS,
  style,
}: CardFundoProps) {
  const { tokens: t } = useTheme();

  // ═══ ESTILOS ═══
  const containerStyle: CSSProperties = {
    backgroundColor: t.surfaceDefault,
    border: `1px solid ${t.borderDefault}`,
    borderRadius: t.cardRadius,
    padding: 24,
    fontFamily: t.fontFamily,
    ...style,
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: `1px solid ${t.borderDefault}`,
  };

  const accentLineStyle: CSSProperties = {
    width: 32,
    height: 3,
    backgroundColor: t.brandAccent,
    borderRadius: t.radiusXs,
  };

  const nameStyle: CSSProperties = {
    fontSize: 17,
    fontWeight: 700,
    color: t.textFundoName, // Fixed token (não reativo)
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const fieldsGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16,
    marginBottom: showDocuments ? 24 : 0,
  };

  const fieldStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  };

  const fieldLabelStyle: CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: t.textFundoLabel, // Fixed token (não reativo)
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  };

  const fieldValueStyle: CSSProperties = {
    fontSize: t.textMd,
    fontWeight: 500,
    color: t.textSecondary,
  };

  const documentsStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingTop: 24,
    borderTop: `1px solid ${t.borderDefault}`,
  };

  const documentTitleStyle: CSSProperties = {
    fontSize: t.textSm,
    fontWeight: 600,
    color: t.textPrimary,
    marginBottom: 8,
  };

  const documentLinkStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: t.textMd,
    fontWeight: 500,
    color: t.brandPrimary,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.15s ease',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={accentLineStyle} />
        <div style={nameStyle}>{name}</div>
        {showTag && tagLabel && <DSTag variant="neutral-brand2">{tagLabel}</DSTag>}
      </div>

      {/* Ficha Técnica */}
      <div style={fieldsGridStyle}>
        {fields.map((field, idx) => (
          <div key={idx} style={fieldStyle}>
            <div style={fieldLabelStyle}>{field.label}</div>
            <div style={fieldValueStyle}>{field.value}</div>
          </div>
        ))}
      </div>

      {/* Documentos */}
      {showDocuments && (
        <div style={documentsStyle}>
          <div style={documentTitleStyle}>Documentos</div>
          {documents.map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={documentLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = t.brandPrimaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = t.brandPrimary;
              }}
            >
              <ExternalLink size={14} />
              <span>{doc.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
