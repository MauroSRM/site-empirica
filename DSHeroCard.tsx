// PROMPT 23 — HeroCard
import React from 'react'
import { t, hexToRgba } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSButton } from './DSButton'
import { DSTag } from './DSTag'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'

type HeroLayout  = 'landscape' | 'portrait' | 'banner'
type HeroOverlay = 'none' | 'gradient' | 'solid'
type CTACount    = 'none' | 'single' | 'double'

interface DSHeroCardProps {
  layout?: HeroLayout
  overlay?: HeroOverlay
  badge?: boolean
  ctaCount?: CTACount
  imageUrl?: string
  superLabel?: string
  title?: string
  description?: string
  badgeLabel?: string
  badgeVariant?: 'neutral-brand1' | 'neutral-brand2'
}

export function DSHeroCard({
  layout = 'landscape',
  overlay = 'gradient',
  badge = true,
  ctaCount = 'single',
  imageUrl = '',
  superLabel = 'Destaque do Mês',
  title = 'Fundo Multimercado Estratégico',
  description = 'Rentabilidade acima do CDI com gestão ativa e diversificada.',
  badgeLabel = 'Novo',
  badgeVariant = 'neutral-brand1',
}: DSHeroCardProps) {
  const hasOverlay = overlay !== 'none'
  const textOnDark = hasOverlay
  const superColor  = textOnDark ? t.textOnImageSubtle : t.textTertiary
  const titleColor  = textOnDark ? t.textOnBrand : t.textPrimary
  const descColor   = textOnDark ? t.textOnImage : t.textSecondary

  const overlayStyle: React.CSSProperties =
    overlay === 'gradient' ? { background: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,8,30,0.7))' } :
    overlay === 'solid'    ? { background: hexToRgba(t.brandPrimary, 0.85) } :
    {}

  const Content = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'space-between', flex: 1, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {badge && <div style={{ alignSelf: 'flex-start' }}><DSTag variant={badgeVariant} size="sm">{badgeLabel}</DSTag></div>}
        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: superColor, margin: 0 }}>{superLabel}</p>
        <p style={{ fontSize: '20px', fontWeight: 700, color: titleColor, margin: 0, lineHeight: '28px' }}>{title}</p>
        <p style={{ fontSize: '13px', color: descColor, margin: 0, lineHeight: '20px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</p>
      </div>
      {ctaCount !== 'none' && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          {ctaCount === 'single' && <DSButton variant={textOnDark ? 'secondary' : 'primary'} theme={textOnDark ? 'dark' : 'light'} size="sm">Investir agora</DSButton>}
          {ctaCount === 'double' && (
            <>
              <DSButton variant="ghost" theme={textOnDark ? 'dark' : 'light'} size="sm">Saiba mais</DSButton>
              <DSButton variant={textOnDark ? 'secondary' : 'primary'} theme={textOnDark ? 'dark' : 'light'} size="sm">Investir</DSButton>
            </>
          )}
        </div>
      )}
    </div>
  )

  // ── BANNER ────────────────────────────────────────────────────
  if (layout === 'banner') {
    return (
      <div style={{ position: 'relative', width: '100%', height: 240, borderRadius: t.cardRadius, overflow: 'hidden', backgroundColor: t.surfaceSubtle }}>
        <ImageWithFallback src={imageUrl} alt="hero banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {hasOverlay && <div style={{ position: 'absolute', inset: 0, ...overlayStyle }} />}
        <div style={{ position: 'absolute', inset: 0, padding: '24px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '50%' }}><Content /></div>
        </div>
      </div>
    )
  }

  // ── PORTRAIT ─────────────────────────────────────────────────
  if (layout === 'portrait') {
    return (
      <div style={{ width: 280, height: 360, borderRadius: t.cardRadius, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ height: '55%', position: 'relative', flexShrink: 0, backgroundColor: t.surfaceSubtle }}>
          <ImageWithFallback src={imageUrl} alt="hero portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {hasOverlay && <div style={{ position: 'absolute', inset: 0, ...overlayStyle }} />}
        </div>
        <div style={{ flex: 1, backgroundColor: t.surfaceDefault, padding: '20px' }}>
          <Content />
        </div>
      </div>
    )
  }

  // ── LANDSCAPE ─────────────────────────────────────────────────
  return (
    <div style={{ width: '100%', height: 200, borderRadius: t.cardRadius, overflow: 'hidden', display: 'flex' }}>
      <div style={{ width: '40%', position: 'relative', flexShrink: 0, backgroundColor: t.surfaceSubtle }}>
        <ImageWithFallback src={imageUrl} alt="hero landscape" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {hasOverlay && <div style={{ position: 'absolute', inset: 0, ...overlayStyle }} />}
      </div>
      <div style={{ flex: 1, backgroundColor: t.surfaceDefault, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Content />
      </div>
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '20px 0 8px', fontFamily: t.fontFamily }}>{children}</p>
}

export function DSHeroCardSection() {
  const img1 = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800'
  const img2 = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: t.fontFamily }}>
      <DSDocSection
        description="Card de destaque com imagem de fundo em 3 layouts (landscape, portrait, banner), overlay configurável e até 2 CTAs. Usado em banners de produtos, campanhas de investimento e destaques editoriais."
        whenToUse={['Banner de produto financeiro com imagem de fundo', 'Destaque de campanha ou oferta especial', 'Card de hero em páginas de produto ou serviço']}
        whenNotToUse={['Conteúdo operacional sem imagem (use DSDataCardAction)', 'KPI de dashboard (use DSKPICard)', 'Listagem de múltiplos itens (use grade de cards menores)']}
        tabs={[
          { label: 'Tokens', content: <TokenTable rows={[
            { elemento: 'Overlay gradient', token: 'hexToRgba(brandPrimary, 0.7)', descricao: 'Gradiente sobre a imagem' },
            { elemento: 'Overlay solid', token: 'hexToRgba(brandPrimary, 0.85)', descricao: 'Cobertura sólida sobre a imagem' },
            { elemento: 'Texto sobre overlay', token: 't.neutral0 / #fff', descricao: 'Título e corpo sobre fundo escuro' },
            { elemento: 'Badge neutral-brand1', token: 't.brandSecondary', descricao: 'Cor do badge de destaque' },
            { elemento: 'Badge neutral-brand2', token: 't.brandPrimary', descricao: 'Cor do badge alternativo' },
            { elemento: 'Radius', token: 't.cardRadius', descricao: 'Arredondamento do card' },
          ]} /> },
          { label: 'Props', content: <PropsTable rows={[
            { prop: 'layout', tipo: "'landscape' | 'portrait' | 'banner'", default: "'landscape'", descricao: 'Formato do card' },
            { prop: 'overlay', tipo: "'none' | 'gradient' | 'solid'", default: "'none'", descricao: 'Tipo de overlay sobre a imagem' },
            { prop: 'ctaCount', tipo: "'none' | 'single' | 'double'", default: "'none'", descricao: 'Número de botões CTA' },
            { prop: 'badge', tipo: 'boolean', default: 'false', descricao: 'Exibe badge de destaque' },
            { prop: 'badgeLabel', tipo: 'string', default: 'undefined', descricao: 'Texto do badge' },
            { prop: 'badgeVariant', tipo: "'neutral-brand1' | 'neutral-brand2'", default: "'neutral-brand1'", descricao: 'Cor do badge' },
            { prop: 'imageUrl', tipo: 'string', default: 'undefined', descricao: 'URL da imagem de fundo' },
            { prop: 'title', tipo: 'string', default: 'undefined', descricao: 'Título principal do card' },
          ]} /> },
          { label: 'Acessibilidade', content: <A11yBlock
            role="role='article' ou role='banner' (quando hero principal da página)"
            keyboard="Tab para CTAs · Enter/Space para acionar"
            screenReader="Imagem com alt descritivo (não decorativo) · CTAs com labels explícitos · Badge: aria-label adicional quando necessário"
            contrast="Texto branco sobre overlay gradient/solid — verificado para brandPrimary · Sem overlay: garantir legibilidade via imagem escura"
            focus="focusRing nos botões CTA · card em si não focável"
          /> },
        ]}
      />
      <SectionLabel>Landscape — gradient overlay + CTA duplo</SectionLabel>
      <Labeled component="DSHeroCard" props='layout="landscape" overlay="gradient" ctaCount="double" badge'>
        <DSHeroCard layout="landscape" overlay="gradient" ctaCount="double" imageUrl={img1} badge badgeLabel="Destaque" />
      </Labeled>

      <SectionLabel>Landscape — sem overlay</SectionLabel>
      <Labeled component="DSHeroCard" props='layout="landscape" overlay="none" ctaCount="single"'>
        <DSHeroCard layout="landscape" overlay="none" ctaCount="single" imageUrl={img1} badge={false} />
      </Labeled>

      <SectionLabel>Banner — solid overlay</SectionLabel>
      <Labeled component="DSHeroCard" props='layout="banner" overlay="solid" ctaCount="single"'>
        <DSHeroCard layout="banner" overlay="solid" ctaCount="single" imageUrl={img1} badgeLabel="Exclusivo" badgeVariant="neutral-brand2" />
      </Labeled>

      <SectionLabel>Portraits</SectionLabel>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Labeled component="DSHeroCard" props='layout="portrait" overlay="none"'><DSHeroCard layout="portrait" overlay="none"     ctaCount="single" imageUrl={img2} badge={false} /></Labeled>
        <Labeled component="DSHeroCard" props='layout="portrait" overlay="gradient"'><DSHeroCard layout="portrait" overlay="gradient" ctaCount="single" imageUrl={img2} badgeLabel="Novo" /></Labeled>
        <Labeled component="DSHeroCard" props='layout="portrait" overlay="solid" ctaCount="double"'><DSHeroCard layout="portrait" overlay="solid"    ctaCount="double" imageUrl={img2} badgeLabel="Exclusivo" badgeVariant="neutral-brand2" /></Labeled>
      </div>
    </div>
  )
}
