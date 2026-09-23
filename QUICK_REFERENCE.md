# Quick Reference Guide - Design System SRM

Guia rápido de consulta para desenvolvedores.

## 🚀 Início Rápido

### Importar e Usar Componentes

```tsx
import { Button, Tag, TransactionListItem } from './design-system';
import { Download, Check, AlertCircle } from 'lucide-react';

// Button
<Button variant="primary" size="md">Confirmar</Button>
<Button variant="secondary" iconLeft={<Download size={14} />}>Download</Button>

// Tag
<Tag variant="success">Aprovado</Tag>
<Tag variant="warning" iconLeft={<AlertCircle size={12} />}>Atenção</Tag>

// Transaction
<TransactionListItem 
  type="sent" 
  label="Pix enviado" 
  value="R$ 100.000"
  description="João Silva"
/>
```

## 📐 Tokens Mais Usados

### Cores
```tsx
import { designTokens } from './design-system/tokens/design-tokens';

// Brand
designTokens.colors.brand.primary    // #00081e
designTokens.colors.brand.secondary  // #0a1f44

// Text
designTokens.colors.gray[800]        // #2a2a2d (texto principal)
designTokens.colors.gray[500]        // #8e8e93 (texto secundário)

// Semantic
designTokens.colors.semantic.success.main    // #00842a
designTokens.colors.semantic.warning.main    // #b25b00
```

### Espaçamento
```tsx
designTokens.spacing[2]   // 8px  - padding tags
designTokens.spacing[3]   // 12px - gap ícone-texto
designTokens.spacing[4]   // 16px - padding cards
designTokens.spacing[6]   // 24px - margens seções
```

### Tipografia
```tsx
designTokens.typography.fontSize.md      // 14px (padrão)
designTokens.typography.fontSize['5xl']  // 30px (valores grandes)
designTokens.typography.fontWeight.semibold  // 600
```

### Border Radius
```tsx
designTokens.borderRadius.sm   // 4px  - tags
designTokens.borderRadius.md   // 6px  - botões
designTokens.borderRadius.lg   // 8px  - cards
```

## 🎨 Componentes - Props Rápidas

### Button
```tsx
variant?: 'primary' | 'secondary' | 'ghost'  // default: 'primary'
size?: 'sm' | 'md' | 'lg'                    // default: 'md'
loading?: boolean                             // default: false
disabled?: boolean                            // default: false
fullWidth?: boolean                           // default: false
iconLeft?: ReactNode
iconRight?: ReactNode
iconOnly?: boolean
```

### Tag
```tsx
variant?: 'success' | 'warning' | 'info' | 'error' | 'neutral'  // default: 'neutral'
size?: 'sm' | 'md'                                               // default: 'md'
iconLeft?: ReactNode
iconRight?: ReactNode
```

### TransactionListItem
```tsx
type?: 'sent' | 'received' | 'pending'  // default: 'sent'
label: string                           // required
value: string                           // required
description?: string
onClick?: () => void
customIcon?: ReactNode
```

## 📊 Tabela de Dimensões

### Botões
| Size   | Altura | Padding H | Font  |
|--------|--------|-----------|-------|
| sm     | 32px   | 12px      | 11px  |
| md     | 40px   | 16px      | 13px  |
| lg     | 48px   | 20px      | 15px  |

### Espaçamento
| Token | Valor | Uso                    |
|-------|-------|------------------------|
| 1     | 4px   | Gaps mínimos           |
| 2     | 8px   | Padding tags           |
| 3     | 12px  | Gap ícone-texto        |
| 4     | 16px  | Padding cards          |
| 6     | 24px  | Margens entre seções   |

## 🎯 Padrões Comuns

### Card de Saldo
```tsx
<div style={{
  backgroundColor: 'white',
  border: `1px solid ${designTokens.colors.ui.border.light}`,
  borderRadius: designTokens.borderRadius.lg,
  padding: designTokens.spacing[6],
}}>
  <p style={{ fontSize: '14px', fontWeight: '600', color: '#2a2a2d' }}>
    Saldo disponível
  </p>
  <p style={{ fontSize: '30px', fontWeight: '600', color: '#8e8e93' }}>
    R$ 950.320,12
  </p>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
    <Tag variant="success">Δ 10% vs mês anterior</Tag>
    <Button variant="ghost" size="sm">Ver extrato</Button>
  </div>
</div>
```

### Barra de Ações
```tsx
<div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
  <Button variant="secondary">Cancelar</Button>
  <Button variant="primary">Confirmar</Button>
</div>
```

### Lista de Transações
```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <p style={{ fontSize: '12px', color: '#8e8e93' }}>Segunda, 24 fev. 2026</p>
  <TransactionListItem type="sent" label="Pix enviado" value="R$ 100.000" />
  <TransactionListItem type="received" label="Transferência" value="R$ 47.200" />
</div>
```

## 🎨 Cores Semânticas - Quando Usar

| Variant | Cor Principal | Uso                                    |
|---------|--------------|----------------------------------------|
| success | Verde        | Aprovações, saldo positivo, confirmações |
| warning | Amarelo      | Alertas, pendências, vencimentos       |
| info    | Azul claro   | Informações neutras, status            |
| error   | Vermelho     | Erros, falhas, atrasos                 |
| neutral | Cinza        | Informações gerais                     |

## 📱 Responsividade

### Breakpoints
```tsx
designTokens.breakpoints.sm    // 640px  - Mobile
designTokens.breakpoints.md    // 768px  - Tablet
designTokens.breakpoints.lg    // 1024px - Desktop
designTokens.breakpoints.xl    // 1280px - Large Desktop
```

### Touch Targets
- Desktop: mínimo 32px × 32px (Button sm)
- Mobile: mínimo 44px × 44px (Button md ou lg)

## ⚡ Atalhos de Estilo

### Card Padrão
```tsx
{
  backgroundColor: 'white',
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '24px',
}
```

### Título de Seção
```tsx
{
  fontSize: '20px',
  fontWeight: '600',
  color: '#00081e',
  letterSpacing: '-1px',
}
```

### Texto Monetário Grande
```tsx
{
  fontFamily: "'Montserrat', sans-serif",
  fontSize: '30px',
  fontWeight: '600',
  color: '#8e8e93',
  letterSpacing: '-1.8px',
}
```

### Texto Secundário
```tsx
{
  fontSize: '12px',
  fontWeight: '500',
  color: '#8e8e93',
  letterSpacing: '-0.6px',
}
```

## 🔍 Formatação de Valores

### Valores Monetários
```tsx
// Formato: R$ 1.234,56
new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(value);
```

### Datas
```tsx
// Formato longo: Segunda, 24 fev. 2026
new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(date);

// Formato curto: 24/02/2026
new Intl.DateTimeFormat('pt-BR').format(date);
```

### Percentuais com Delta
```tsx
const formatPercentChange = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `Δ ${sign}${value.toFixed(1)}% vs mês anterior`;
};
```

## ✅ Checklist de Validação

Antes de fazer commit:

- [ ] Usei tokens definidos (não valores hard-coded)
- [ ] Segui hierarquia de ações (max 1 primary button por seção)
- [ ] Usei variantes semânticas apropriadas
- [ ] Testei em mobile e desktop
- [ ] Verifiquei contraste de cores
- [ ] Labels de botões curtos e claros
- [ ] Espaçamento consistente (múltiplos de 4px)

## 📚 Recursos

- **Documentação Completa**: `<DesignSystemDocumentation />`
- **Playbook Técnico**: `<Playbook />`
- **README**: `/DESIGN_SYSTEM_README.md`

---

**Dica**: Mantenha este guia aberto em uma aba separada enquanto desenvolve!
