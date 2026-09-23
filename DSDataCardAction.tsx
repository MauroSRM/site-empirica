import React from 'react'
import { Zap, Shield, Target, Sparkles } from 'lucide-react'
import { t, hexToRgba } from './tokens'
import { DSDocSection, TokenTable, PropsTable, A11yBlock, Labeled } from './DSDocSection'
import { DSButton } from './DSButton'
import { DSTag } from './DSTag'
import { DSAlertCard } from './DSAlertCard'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'

type MediaType   = 'none' | 'icon' | 'image'
type CardVariant = 'default' | 'offer' | 'notice' | 'feature'
type ActionCount = 'none' | 'single' | 'double'

interface DSDataCardActionProps {
  media?: MediaType
  variant?: CardVariant
  actionCount?: ActionCount
  elevated?: boolean
  title?: string
  subtitle?: string
  body?: string
  imageUrl?: string
  icon?: React.ElementType
}

export function DSDataCardAction({
  media = 'icon',
  variant = 'default',
  actionCount = 'single',
  elevated = false,
  title = 'Novo Produto Disponível',
  subtitle = 'Fundos de Renda Fixa',
  body = 'Conheça nossas opções de investimento com rentabilidade acima do CDI e liquidez diária.',
  imageUrl,
  icon: IconProp,
}: DSDataCardActionProps) {
  const isFeature = variant === 'feature'
  const isNotice  = variant === 'notice'
  const IconComp  = IconProp || Zap

  return (
    <div style={{
      borderRadius: t.cardRadius,
      backgroundColor: t.surfaceDefault,
      border: isFeature
        ? `1.5px solid ${t.brandPrimaryLight}`
        : `1.5px solid ${t.borderDefault}`,
      overflow: 'hidden',
      boxShadow: elevated ? `0 8px 32px ${hexToRgba(t.brandPrimary, 0.12)}` : 'none',
      fontFamily: t.fontFamily,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Media — Image */}
      {media === 'image' && (
        <div style={{
          width: '100%',
          height: 160,
          borderRadius: `${t.cardRadius} ${t.cardRadius} 0 0`,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: t.surfaceMuted,
          flexShrink: 0,
        }}>
          {imageUrl ? (
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${t.brandPrimary} 0%, ${t.brandSecondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconComp size={32} color={t.textOnBrand} />
            </div>
          )}
          {/* Gradiente escuro na base para o subtitle flutuar */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: 80,
            background: 'linear-gradient(to top, rgba(0,8,30,0.6), transparent)',
          }} />
          {/* Subtitle sobre o gradiente */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 16,
            right: 16,
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.85)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.06em',
            fontFamily: t.fontFamily,
          }}>
            {subtitle}
          </div>
        </div>
      )}

      {/* Media — Icon */}
      {media === 'icon' && (
        <div style={{
          padding: '20px',
          backgroundColor: isFeature ? t.brandPrimary : t.surfaceSubtle,
          borderBottom: isFeature ? 'none' : `1px solid ${t.borderDefault}`,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: t.radiusFull,
            backgroundColor: isFeature ? 'rgba(255,255,255,0.15)' : t.brandPrimaryLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconComp size={24} color={isFeature ? t.textOnBrand : t.brandPrimary} />
          </div>
        </div>
      )}

      {/* Content — always surfaceDefault */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: '8px',
        flex: 1,
        backgroundColor: t.surfaceDefault,
      }}>
        {variant === 'offer' && <DSTag variant="neutral-brand2" size="sm">Oferta</DSTag>}

        {/* Notice: DSAlertCard no topo — card inteiro permanece branco */}
        {variant === 'notice' ? (
          <DSAlertCard variant="warning" title={title} body={body} />
        ) : (
          <>
            <p style={{ fontSize: '15px', fontWeight: 600, color: t.textPrimary, margin: 0, fontFamily: t.fontFamily }}>{title}</p>
            {/* Subtitle apenas quando media != image (no image mode ele vai sobre a foto) */}
            {media !== 'image' && (
              <p style={{ fontSize: '12px', fontWeight: 600, color: t.textSecondary, margin: 0, fontFamily: t.fontFamily }}>{subtitle}</p>
            )}
            <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0, lineHeight: '20px', fontFamily: t.fontFamily }}>{body}</p>
          </>
        )}
      </div>

      {/* Actions */}
      {actionCount !== 'none' && (
        <div style={{ padding: '16px', borderTop: `1px solid ${t.borderDefault}`, display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {actionCount === 'single' && <DSButton variant="primary" size="sm" style={{ width: '100%' }}>Conhecer produto</DSButton>}
          {actionCount === 'double' && (
            <>
              <DSButton variant="ghost" size="sm">Saiba mais</DSButton>
              <DSButton variant="primary" size="sm">Investir agora</DSButton>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Showcase ─────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', fontWeight: 700, color: t.textSecondary, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '20px 0 8px', fontFamily: t.fontFamily }}>{children}</p>
}

export function DSDataCardActionSection() {
  return (
    <DSDocSection
      description="Card de conteúdo com mídia (ícone ou imagem), variantes semânticas (default, offer, notice, feature) e até 2 CTAs. Usado em dashboards para destacar ofertas, avisos e features do produto."
      whenToUse={['Oferta de produto financeiro em dashboard', 'Aviso operacional com CTA de resolução', 'Destaque de feature premium (fundo de marca)']}
      whenNotToUse={['KPI numérico sem ação associada (use DSKPICard)', 'Alerta de erro crítico (use DSAlertCard)', 'Card de lista iterável (use DSTable ou DSListLabel)']}
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: t.fontFamily }}>
          <div>
            <SectionLabel>Variants x Media (icon parametrizavel via prop)</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              <Labeled component="DSDataCardAction" props='media="icon" variant="default" actionCount="single"'><DSDataCardAction media="icon" variant="default" actionCount="single" icon={Zap} /></Labeled>
              <Labeled component="DSDataCardAction" props='media="icon" variant="offer" actionCount="double"'><DSDataCardAction media="icon" variant="offer" actionCount="double" icon={Sparkles} /></Labeled>
              <Labeled component="DSDataCardAction" props='media="icon" variant="notice" actionCount="single"'>
                <DSDataCardAction
                  media="icon" variant="notice" actionCount="single" icon={Shield}
                  title="Atenção necessária"
                  subtitle="Vencimento próximo"
                  body="Você possui títulos com vencimento nos próximos 7 dias. Revise seu portfólio."
                />
              </Labeled>
              <Labeled component="DSDataCardAction" props='media="icon" variant="feature" elevated'>
                <DSDataCardAction
                  media="icon" variant="feature" actionCount="single" elevated icon={Target}
                  title="HB Digital Premium"
                  subtitle="Acesso exclusivo"
                  body="Gerencie seus investimentos com inteligência artificial e relatórios avançados."
                />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Media image — default e offer</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              <Labeled component="DSDataCardAction" props='media="image" variant="default"'>
                <DSDataCardAction
                  media="image" variant="default" actionCount="single"
                  imageUrl="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=480&h=160&fit=crop&auto=format"
                  title="Fundo Multimercado Estratégico" subtitle="Renda Fixa"
                  body="Rentabilidade acima do CDI com gestão ativa e diversificação entre classes de ativos."
                />
              </Labeled>
              <Labeled component="DSDataCardAction" props='media="image" variant="offer" actionCount="double"'>
                <DSDataCardAction
                  media="image" variant="offer" actionCount="double"
                  imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&h=160&fit=crop&auto=format"
                  title="FIDC Premium Série IV" subtitle="FIDC"
                  body="Nova série com rentabilidade alvo de IPCA + 6% ao ano. Captação aberta até 30/06."
                />
              </Labeled>
              <Labeled component="DSDataCardAction" props='media="image" variant="default"'>
                <DSDataCardAction
                  media="image" variant="default" actionCount="single"
                  title="CRI Imobiliário Alpha" subtitle="CRI"
                  body="Certificado de recebíveis imobiliários com garantia real e taxa prefixada de 12,5% a.a."
                />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Feature: header azul + corpo branco</SectionLabel>
            <div style={{ backgroundColor: t.brandPrimary, padding: '24px', borderRadius: t.cardRadius, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Labeled component="DSDataCardAction" props='variant="feature" actionCount="double" elevated'>
                <DSDataCardAction
                  media="icon" variant="feature" actionCount="double" elevated icon={Sparkles}
                  title="Feature Card" subtitle="Header azul, corpo branco"
                  body="O header usa bg brandPrimary. O body e o footer usam surfaceDefault normalmente."
                />
              </Labeled>
              <Labeled component="DSDataCardAction" props='variant="feature" actionCount="single" elevated'>
                <DSDataCardAction
                  media="icon" variant="feature" actionCount="single" elevated icon={Target}
                  title="HB Digital Premium" subtitle="Acesso exclusivo"
                  body="Gerencie seus investimentos com inteligência artificial e relatórios avançados."
                />
              </Labeled>
            </div>
          </div>
          <div>
            <SectionLabel>Sem ação / Single / Double</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Labeled component="DSDataCardAction" props='actionCount="none"'><DSDataCardAction media="icon" variant="default" actionCount="none" title="Sem ação" /></Labeled>
              <Labeled component="DSDataCardAction" props='actionCount="single"'><DSDataCardAction media="icon" variant="default" actionCount="single" title="Ação única" /></Labeled>
              <Labeled component="DSDataCardAction" props='actionCount="double" elevated'><DSDataCardAction media="icon" variant="default" actionCount="double" title="Duas ações" elevated /></Labeled>
            </div>
          </div>
        </div>
      }
      tabs={[
        { label: 'Tokens', content: <TokenTable rows={[
          { elemento: 'Fundo default', token: 't.surfaceDefault', descricao: 'Fundo da variante padrão' },
          { elemento: 'Fundo offer', token: 't.surfaceSubtle', descricao: 'Fundo da variante oferta' },
          { elemento: 'Fundo notice', token: 't.feedbackWarningBg', descricao: 'Fundo da variante aviso' },
          { elemento: 'Fundo feature', token: 't.brandPrimary', descricao: 'Fundo da variante destaque de produto' },
          { elemento: 'Texto feature', token: 't.textOnBrand', descricao: 'Texto sobre fundo de marca' },
          { elemento: 'Ícone', token: 't.brandPrimary', descricao: 'Cor do ícone nas variantes claras' },
          { elemento: 'Borda', token: 't.borderDefault', descricao: 'Contorno do card' },
        ]} /> },
        { label: 'Props', content: <PropsTable rows={[
          { prop: 'variant', tipo: "'default' | 'offer' | 'notice' | 'feature'", default: "'default'", descricao: 'Variante visual do card' },
          { prop: 'media', tipo: "'none' | 'icon' | 'image'", default: "'none'", descricao: 'Tipo de mídia exibida' },
          { prop: 'actionCount', tipo: "'none' | 'single' | 'double'", default: "'none'", descricao: 'Número de CTAs no rodapé' },
          { prop: 'elevated', tipo: 'boolean', default: 'false', descricao: 'Adiciona sombra de elevação' },
          { prop: 'title', tipo: 'string', default: 'undefined', descricao: 'Título do card' },
          { prop: 'subtitle', tipo: 'string', default: 'undefined', descricao: 'Subtítulo' },
          { prop: 'body', tipo: 'string', default: 'undefined', descricao: 'Texto descritivo do card' },
          { prop: 'icon', tipo: 'React.ElementType', default: 'undefined', descricao: 'Ícone quando media="icon"' },
        ]} /> },
        { label: 'Acessibilidade', content: <A11yBlock
          role="role='article' com aria-label descritivo · CTAs com labels explícitos"
          keyboard="Tab para CTAs · Enter/Space para acionar"
          screenReader="Título + body lidos em sequência · Imagem decorativa: aria-hidden='true' · Ícone: aria-hidden='true'"
          contrast="textOnBrand sobre brandPrimary verificado · feedbackWarning sobre warningBg verificado"
          focus="focusRing nos botões de CTA · card não focável quando não clicável"
        /> },
      ]}
    />
  )
}