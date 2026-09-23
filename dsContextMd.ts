// ─── DS Matriz — Shared implementation prompt generator ──────────
// Used by WelcomePage (download/copy) and NovaMarcaPage (Gerar Tema).
// Always reflects live token values from the active theme.

import { DS_VERSION } from './DS-VERSION'

export const DS_CATEGORIES = [
  {
    id: 'button',
    label: 'Primitivos',
    count: 8,
    color: '#2758b5',
    items: ['Avatar', 'Button', 'Card Button', 'Tag', 'Chip / Filter', 'Switch', 'Slider', 'Risk Badge'],
  },
  {
    id: 'input',
    label: 'Formulários',
    count: 9,
    color: '#ff8200',
    items: ['Input', 'Select', 'Date Picker', 'Checkbox / Radio', 'Password Input', 'File Upload', 'Credit Card', 'CPF · CNPJ', 'Formulários Avançados'],
  },
  {
    id: 'modal',
    label: 'Compostos',
    count: 23,
    color: '#2758b5',
    items: ['Modal', 'Drawer', 'Notification Drawer', 'Toast', 'Alert Card', 'Alert Card Outline', 'Accordion', 'Tab Bar', 'Stepper', 'Double Button', 'Table', 'List Label', 'List Item', 'KPI Card', 'Balance Primary', 'Approval Card', 'Open Finance Card', 'Audit Line', 'Receivable Alert', 'Card Fundo', 'Data Card Action', 'Hero Card', 'Permission Row'],
  },
  {
    id: 'navbar',
    label: 'Estrutura',
    count: 7,
    color: '#059669',
    items: ['NavBar Desktop', 'MegaMenu', 'Breadcrumb', 'Page Header', 'Logo', 'Identidade de IA', 'Bottom Navigation'],
  },
  {
    id: 'skeleton',
    label: 'Feedback',
    count: 3,
    color: '#b25b00',
    items: ['Skeleton / Empty State', 'Empty States Casos de Uso', 'Tooltip'],
  },
]

export const DS_TOTAL = DS_CATEGORIES.reduce((s, c) => s + c.count, 0)

export function formatDSDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function generateContextMd(tokens: any, themeName?: string): string {
  const name = themeName ?? 'HB Digital'
  return `# DS Matriz — Prompt de Implementação
# Versão ${DS_VERSION.version} · ${formatDSDate(DS_VERSION.lastUpdated)} · Tema: ${name}

> **COMO USAR:** Cole este arquivo como contexto em Claude, Cursor ou ChatGPT e diga:
> "Implemente [descreva o componente ou tela] no projeto atual seguindo rigorosamente
> todas as especificações abaixo. Não use valores hardcoded — use apenas os tokens
> semânticos definidos aqui. Use \`useTheme()\` para reatividade de tema."

---

## CONFIGURAÇÃO DE MARCA ATIVA — ${name}

\`\`\`
brandPrimary:      ${tokens.brandPrimary}
brandAccent:       ${tokens.brandAccent}
brandAccentStrong: ${tokens.brandAccentStrong}
brandPrimaryLight: ${tokens.brandPrimaryLight}
brand2:            ${tokens.brand2}
brand2Light:       ${tokens.brand2Light}
brand2Subtle:      ${tokens.brand2Subtle}
surfaceCanvas:     ${tokens.surfaceCanvas}

buttonRadius: ${tokens.buttonRadius}   ← use em todos os botões e ações
inputRadius:  ${tokens.inputRadius}    ← use em todos os campos de formulário
cardRadius:   ${tokens.cardRadius}     ← use em cards, modais e painéis
\`\`\`

---

## REGRAS OBRIGATÓRIAS (nunca viole estas regras)

1. **Tokens semânticos sempre.** Obtenha tokens via \`const { tokens: t } = useTheme()\`.
   Nunca use cor, tamanho ou espaçamento hardcoded (#fff, 16px, borderRadius: 8, etc.).

2. **Radius por contexto.**
   - Botões/ações → \`borderRadius: t.buttonRadius\` (${tokens.buttonRadius})
   - Inputs/selects → \`borderRadius: t.inputRadius\` (${tokens.inputRadius})
   - Cards/modais/painéis → \`borderRadius: t.cardRadius\` (${tokens.cardRadius})

3. **Estrutura de estados.** Todo elemento interativo deve ter: default → hover → pressed → focus → disabled.
   Focus ring padrão: \`boxShadow: t.focusRing\`

4. **Tipografia.**
   - \`fontFamily: t.fontFamily\` em todos os elementos de texto
   - Tamanhos: t.textXs (9px) · t.textSm (11px) · t.text2Xs (12px) · t.textMd (13px) · t.textLg (14px)

5. **Acessibilidade.**
   - Ícones interativos sem texto: \`aria-label\` obrigatório
   - Modais: \`role="dialog"\` + \`aria-modal="true"\`
   - Checkboxes: \`role="checkbox"\` + \`aria-checked\`
   - Inputs: sempre associados a \`<label>\`

6. **Inline styles exclusivamente.** Este DS não usa Tailwind nem CSS modules.
   Toda estilização via \`style={{}}\` com tokens de \`useTheme()\`.

7. **Componentes existentes primeiro.** Não crie variações de componentes que já existem.
   Consulte o inventário abaixo antes de criar qualquer elemento.

8. **Cores de feedback para semântica, não decoração.**
   - Erros/destrutivo → \`t.feedbackError\` + \`t.feedbackErrorBg\`
   - Sucesso → \`t.feedbackSuccess\` + \`t.feedbackSuccessBg\`
   - Atenção → \`t.feedbackWarning\` + \`t.feedbackWarningBg\`
   - Info → \`t.feedbackInfo\` + \`t.feedbackInfoBg\`

9. **brandAccent NÃO é cor de texto.** Contraste sobre branco ~2.5:1 — falha WCAG AA.
   Use brandAccent apenas para backgrounds, fills e bordas decorativas.
   Para texto de destaque de marca use \`t.brandPrimary\`.

---

## ESPECIFICAÇÕES DE COMPONENTES — COMPORTAMENTO OBRIGATÓRIO

### DSTag — Tag de status/label
- **Radius: \`t.radiusSm\` (${tokens.radiusSm})** — NÃO é pill. Pill é exclusivo do DSChip.
- Tamanhos: sm (h20px, font 9px), md (h22px, font 10px), lg (h24px, font 12px)
- Font weight: 600 · gap entre ícone/texto/X: 4px
- Variantes e cores obrigatórias:
  - neutral-brand1 → bg \`t.brandPrimaryLight\`, text \`t.brandPrimary\`
  - neutral-brand2 → bg \`t.brandAccentLight\`, text \`t.brandAccentStrong\`
  - success → bg \`t.feedbackSuccessBg\`, text \`t.feedbackSuccessText\` (WCAG AA ~4.7:1)
  - warning → bg \`t.feedbackWarningBg\`, text \`t.feedbackWarning\`
  - error → bg \`t.feedbackErrorBg\`, text \`t.feedbackError\`
  - neutral → bg \`t.tagNeutralBg\`, text \`t.tagNeutralColor\`
  - info → bg \`t.feedbackInfoBg\`, text \`t.feedbackInfo\`
- Componente estático — sem hover/focus próprios

### DSChip — Filtro/seleção (ÚNICO componente pill)
- **Radius: \`t.radiusFull\` (pill)** — é o ÚNICO componente com formato pill
- Estados: unselected / selected / disabled + hover
- Border: 2px solid — default \`t.borderDefault\`, hover \`t.borderBrand\`, selected \`t.brandPrimary\`
- Selecionado: bg \`t.brandPrimaryLight\`, border \`t.brandPrimary\`, text \`t.brandPrimary\`, mostra ícone Check
- Tamanhos: sm (h28px), md (h32px), lg (h36px)

### DSInput — Campo de formulário
- **Radius: \`t.inputRadius\` (${tokens.inputRadius})** — NUNCA use radius fixo
- Altura: sm=40px, md=48px · padding horizontal: 12px
- Estados de borda:
  - default → \`1px solid t.borderDefault\`
  - hover → \`1px solid t.borderMedium\`
  - focus → \`1px solid t.borderBrand\` + \`boxShadow: t.focusRing\`
  - error → \`1px solid t.borderError\`, bg \`t.feedbackErrorBg\`
  - disabled → bg \`t.surfaceSubtle\`, text \`t.textDisabled\`, cursor not-allowed
- Label: fontSize \`t.text2Xs\`, weight 500, color \`t.textSecondary\`
- Helper text / erro: fontSize \`t.textSm\`
- Placeholder: color \`t.textTertiary\`
- Tipos: text · password (toggle eye) · search (ícone left + clear X) · otp (6 cells 48x48px)

### DSButton — Botão de ação
- **Radius: \`t.buttonRadius\` (${tokens.buttonRadius})** — NUNCA use radius fixo
- Altura: sm=32px, md=40px, lg=48px
- Font weight: 600 · letter-spacing: 0.01em
- Variantes:
  - primary → bg \`t.brandPrimary\`, hover \`t.brandPrimaryHover\`, text \`t.textOnBrand\`
  - secondary → border 2px \`t.borderBrand\`, text \`t.brandPrimary\`, hover ripple
  - ghost → transparente, hover bg \`t.surfaceSubtle\`, text \`t.brandPrimaryHover\`
  - destructive → bg \`t.feedbackError\`, focus ring usa feedbackError a 35%
- Disabled → bg \`t.surfaceMuted\`, text \`t.textDisabled\`, opacity 0.5, not-allowed
- Loading → Loader2 animado + texto "Aguarde..." + bloqueia clique
- Focus ring padrão: \`t.focusRing\` · destructive: \`0 0 0 3px rgba(feedbackError, 0.35)\`

### DSAlertCard — Alerta contextual
- **Radius: \`t.radiusLg\`** — NÃO usa cardRadius
- Body text usa \`t.textPrimary\` (não textSecondary — WCAG)
- Variantes: info/success/warning/error com ícone e bg de feedback correspondente
- role="alert" para error/warning · role="status" para info/success

### DSModal
- Backdrop: \`t.overlayBackdrop\` + \`t.overlayBlurModal\`
- Sombra: \`t.shadowModal\`
- role="dialog" + aria-modal="true" obrigatórios
- Focus trap: primeiro elemento focável recebe focus ao abrir

### Cards (genérico)
- **Radius: \`t.cardRadius\` (${tokens.cardRadius})** — SEMPRE para cards, modais e painéis
- Borda: \`1px solid t.borderDefault\`
- Fundo: \`t.surfaceDefault\`
- Sombra (quando elevado): \`t.shadowCard\` ou \`t.shadowMd\`

### Espaçamentos
- Padding de card: \`t.paddingCard\` px · section: \`t.paddingSection\` px
- Use \`getSpacing(t.spacingScale)\` para obter gap/padding adaptados à escala atual

---

## TOKENS COMPLETOS

\`\`\`ts
// Texto
textPrimary:   '${tokens.textPrimary}'
textSecondary: '${tokens.textSecondary}'
textTertiary:  '${tokens.textTertiary}'
textOnBrand:   '${tokens.textOnBrand}'
textDisabled:  '${tokens.textDisabled}'

// Superfícies
surfaceDefault:    '${tokens.surfaceDefault}'
surfaceSubtle:     '${tokens.surfaceSubtle}'
surfaceMuted:      '${tokens.surfaceMuted}'
surfaceBrand:      '${tokens.surfaceBrand}'
surfaceInverse:    '${tokens.surfaceInverse}'
surfaceCanvas:     '${tokens.surfaceCanvas}'
surfaceSelected:   '${tokens.surfaceSelected}'

// Bordas
borderDefault: '${tokens.borderDefault}'
borderMedium:  '${tokens.borderMedium}'
borderStrong:  '${tokens.borderStrong}'
borderBrand:   '${tokens.borderBrand}'
borderError:   '${tokens.borderError}'
borderSelected:'${tokens.borderSelected}'

// Feedback
feedbackSuccess:     '${tokens.feedbackSuccess}'
feedbackSuccessBg:   '${tokens.feedbackSuccessBg}'
feedbackSuccessText: '${tokens.feedbackSuccessText}'
feedbackWarning:     '${tokens.feedbackWarning}'
feedbackWarningBg:   '${tokens.feedbackWarningBg}'
feedbackError:       '${tokens.feedbackError}'
feedbackErrorBg:     '${tokens.feedbackErrorBg}'
feedbackInfo:        '${tokens.feedbackInfo}'
feedbackInfoBg:      '${tokens.feedbackInfoBg}'

// Sombras
shadowSm:    '${tokens.shadowSm}'
shadowMd:    '${tokens.shadowMd}'
shadowLg:    '${tokens.shadowLg}'
shadowCard:  '${tokens.shadowCard}'
shadowModal: '${tokens.shadowModal}'
focusRing:   '${tokens.focusRing}'

// Radius escala
radiusNone: '${tokens.radiusNone}'
radiusXs:   '${tokens.radiusXs}'
radiusSm:   '${tokens.radiusSm}'
radiusMd:   '${tokens.radiusMd}'
radiusLg:   '${tokens.radiusLg}'
radiusXl:   '${tokens.radiusXl}'
radius2xl:  '${tokens.radius2xl}'
radius3xl:  '${tokens.radius3xl}'
radiusFull: '${tokens.radiusFull}'
\`\`\`

---

## INVENTÁRIO DE COMPONENTES (${DS_TOTAL} total)

${DS_CATEGORIES.map(c => `### ${c.label} (${c.count} componentes)\n${c.items.map(i => `- ${i}`).join('\n')}`).join('\n\n')}

---

## PADRÕES DE CÓDIGO

### Acessar tokens
\`\`\`tsx
import { useTheme } from '../ds/ThemeContext'

function MeuComponente() {
  const { tokens: t } = useTheme()
  return (
    <div style={{ backgroundColor: t.surfaceDefault, borderRadius: t.cardRadius }}>
      <button style={{
        backgroundColor: t.brandPrimary,
        borderRadius: t.buttonRadius,
        color: t.textOnBrand,
        fontFamily: t.fontFamily,
      }}>
        Ação
      </button>
    </div>
  )
}
\`\`\`

### Estados interativos
\`\`\`tsx
const [hovered, setHovered] = useState(false)
const [focused, setFocused] = useState(false)

<button
  style={{
    backgroundColor: disabled ? t.surfaceMuted : hovered ? t.brandPrimaryHover : t.brandPrimary,
    boxShadow: focused ? t.focusRing : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>
\`\`\`

### Feedback semântico
\`\`\`tsx
// Erro em input
<div style={{ borderColor: hasError ? t.borderError : t.borderDefault }}>
  {hasError && (
    <p style={{ color: t.feedbackError, fontSize: t.textSm }}>Mensagem de erro</p>
  )}
</div>

// Badge de status
const statusColors = {
  success: { bg: t.feedbackSuccessBg, text: t.feedbackSuccessText },
  warning: { bg: t.feedbackWarningBg, text: t.feedbackWarning },
  error:   { bg: t.feedbackErrorBg,   text: t.feedbackError },
}
\`\`\`

---
Gerado automaticamente em ${new Date().toLocaleString('pt-BR')} · DS Matriz ${DS_VERSION.version} · Tema: ${name}
`
}
