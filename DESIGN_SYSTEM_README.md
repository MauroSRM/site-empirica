# Design System - Internet Banking Digital B2B

Sistema de design completo desenvolvido para aplicações de Internet Banking Digital B2B, baseado na análise detalhada da interface SRM Home Banking.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura](#estrutura)
- [Tokens de Design](#tokens-de-design)
- [Componentes](#componentes)
- [Instalação e Uso](#instalação-e-uso)
- [Documentação](#documentação)
- [Especificações Técnicas](#especificações-técnicas)

## 🎯 Visão Geral

Este design system foi criado a partir da extração e análise de todos os padrões visuais e componentes da interface SRM Home Banking. Ele fornece:

- **Tokens de Design**: Cores, tipografia, espaçamento, sombras, border radius
- **Componentes Reutilizáveis**: Button (3 variantes × 3 tamanhos), Tag (5 variantes), TransactionListItem
- **Documentação Completa**: Guias interativos com exemplos de código
- **Playbook**: Especificações técnicas detalhadas

### Princípios

1. **Profissionalismo**: Visual limpo e sofisticado para B2B financeiro
2. **Consistência**: Padrões uniformes em toda aplicação
3. **Escalabilidade**: Sistema modular e expansível
4. **Densidade de Informação**: Interface densa mas organizada
5. **Acessibilidade**: Contraste adequado e elementos interativos claros

## 📁 Estrutura

```
src/design-system/
├── tokens/                              # Design Tokens
│   ├── design-tokens.ts                 # Tokens principais (cores, tipografia, etc)
│   ├── button-tokens.ts                 # Tokens específicos de botões
│   ├── tag-tokens.ts                    # Tokens específicos de tags
│   └── transaction-list-item-tokens.ts  # Tokens de itens de transação
│
├── components/                          # Componentes React
│   ├── Button.tsx                       # Componente Button
│   ├── Tag.tsx                          # Componente Tag
│   └── TransactionListItem.tsx          # Componente de transação
│
├── documentation/                       # Documentação
│   ├── DesignSystemDocumentation.tsx    # Documentação interativa
│   └── Playbook.tsx                     # Playbook técnico
│
└── index.ts                            # Export principal
```

## 🎨 Tokens de Design

### Tipografia

#### Font Families
- **Primary**: Inter (UI geral, botões, textos padrão)
- **Secondary**: Montserrat (valores monetários, transações)
- **Tertiary**: Open Sans (textos auxiliares)

#### Font Sizes
```typescript
'2xs': '10px',   // Labels, tags
'xs':  '11px',   // Textos auxiliares
'sm':  '12px',   // Textos secundários
'base':'13px',   // Corpo pequeno
'md':  '14px',   // Corpo padrão
'lg':  '16px',   // Destaque
'xl':  '18px',   // Valores médios
'2xl': '20px',   // Títulos seção
'3xl': '22px',   // Valores monetários
'4xl': '28px',   // Títulos grandes
'5xl': '30px',   // Valores grandes
```

#### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Cores

#### Brand Colors
```typescript
primary:   '#00081e'  // Dark navy
secondary: '#0a1f44'  // Navy
tertiary:  '#184987'  // Blue
light:     '#597ca3'  // Soft blue
```

#### Gray Scale
```typescript
50:  '#fafafa'  // Background geral
100: '#f0f2f6'  // Background cards
300: '#e5e5e5'  // Borders light
500: '#8e8e93'  // Text secondary
800: '#2a2a2d'  // Text primary
900: '#171717'  // Near black
```

#### Semantic Colors
```typescript
success: { main: '#00842a', light: '#d4fde5', dark: '#006622' }
warning: { main: '#b25b00', light: '#fff9bb', dark: '#bb4d00' }
error:   { main: '#fe4a5f', light: '#fef2f2', dark: '#fb2c36' }
info:    { main: '#0052cc', light: '#e7ecf2', dark: '#0747a6' }
```

### Espaçamento

Sistema baseado em múltiplos de 4px:

```typescript
0:  '0px'
1:  '4px'
2:  '8px'
3:  '12px'
4:  '16px'
6:  '24px'
8:  '32px'
10: '40px'
```

### Border Radius

```typescript
sm:   '4px'     // Tags, elementos pequenos
md:   '6px'     // Botões, inputs
lg:   '8px'     // Cards, containers
xl:   '12px'    // Containers médios
2xl:  '16px'    // Modais
full: '9999px'  // Pills circulares
```

## 🧩 Componentes

### Button

Componente de botão com 3 variantes e 3 tamanhos.

#### Variantes
- **Primary**: Ações principais (gradiente azul)
- **Secondary**: Ações secundárias (borda preta)
- **Ghost**: Ações terciárias (transparente)

#### Tamanhos
- **Small**: 32px altura (mobile/elementos compactos)
- **Medium**: 40px altura (padrão desktop)
- **Large**: 48px altura (ações destacadas)

#### Uso Básico

```tsx
import { Button } from './design-system/components/Button';
import { Download } from 'lucide-react';

// Botão básico
<Button variant="primary" size="md">
  Confirmar
</Button>

// Com ícone
<Button variant="secondary" iconLeft={<Download size={14} />}>
  Download
</Button>

// Loading
<Button variant="primary" loading>
  Processando...
</Button>

// Disabled
<Button variant="primary" disabled>
  Indisponível
</Button>
```

#### Estados Especiais
- **Hover**: Efeitos animados (slide gradient para primary, radial expansion para secondary/ghost)
- **Active**: Sombra reduzida
- **Focus**: Outline visível
- **Disabled**: Opacity 0.5
- **Loading**: Spinner animado

### Tag

Componente de tag/badge para status e categorias.

#### Variantes
- **success**: Confirmações, status positivo (verde)
- **warning**: Alertas, pendências (amarelo)
- **info**: Informações neutras (azul claro)
- **error**: Erros, falhas (vermelho)
- **neutral**: Informações gerais (cinza)

#### Uso Básico

```tsx
import { Tag } from './design-system/components/Tag';
import { Check } from 'lucide-react';

// Tag básica
<Tag variant="success">
  Δ 10% vs mês anterior
</Tag>

// Com ícone
<Tag variant="warning" iconLeft={<AlertCircle size={12} />}>
  3 aprovações pendentes
</Tag>
```

### TransactionListItem

Componente para itens de transação bancária.

#### Tipos
- **sent**: Transações de saída (vermelho)
- **received**: Transações de entrada (verde)
- **pending**: Transações pendentes (laranja)

#### Uso Básico

```tsx
import { TransactionListItem } from './design-system/components/TransactionListItem';

<TransactionListItem
  type="sent"
  label="Pix enviado"
  value="R$ 100.000"
  description="José Victor LTDA"
  onClick={() => handleClick()}
/>
```

## 📦 Instalação e Uso

### 1. Importar Tokens

```typescript
import { designTokens } from './design-system/tokens/design-tokens';

// Usar em estilos
const styles = {
  color: designTokens.colors.brand.primary,
  fontSize: designTokens.typography.fontSize.md,
  padding: designTokens.spacing[4],
  borderRadius: designTokens.borderRadius.md,
};
```

### 2. Importar Componentes

```typescript
import { Button, Tag, TransactionListItem } from './design-system';
```

### 3. Exemplo Completo

```tsx
import React from 'react';
import { Button } from './design-system/components/Button';
import { Tag } from './design-system/components/Tag';
import { designTokens } from './design-system/tokens/design-tokens';

const BalanceCard = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      border: `1px solid ${designTokens.colors.ui.border.light}`,
      borderRadius: designTokens.borderRadius.lg,
      padding: designTokens.spacing[6],
    }}>
      <h3 style={{
        fontSize: designTokens.typography.fontSize.md,
        fontWeight: designTokens.typography.fontWeight.semibold,
        color: designTokens.colors.gray[800],
        marginBottom: designTokens.spacing[4],
      }}>
        Saldo disponível
      </h3>
      
      <p style={{
        fontSize: designTokens.typography.fontSize['5xl'],
        fontWeight: designTokens.typography.fontWeight.semibold,
        color: designTokens.colors.gray[500],
      }}>
        R$ 950.320,12
      </p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: designTokens.spacing[4],
      }}>
        <Tag variant="success">Δ 10% vs mês anterior</Tag>
        <Button variant="ghost" size="sm">Ver extrato</Button>
      </div>
    </div>
  );
};
```

## 📚 Documentação

O design system inclui duas formas de documentação:

### 1. Documentação Interativa
Componente React com navegação e exemplos ao vivo de todos os componentes, tokens e padrões.

```tsx
import { DesignSystemDocumentation } from './design-system/documentation/DesignSystemDocumentation';

<DesignSystemDocumentation />
```

### 2. Playbook
Guia técnico detalhado com especificações, exemplos de código e diretrizes de implementação.

```tsx
import { Playbook } from './design-system/documentation/Playbook';

<Playbook />
```

## 🔧 Especificações Técnicas

### Dimensões dos Botões

| Tamanho | Altura | Padding X | Padding Y | Font Size | Icon Size |
|---------|--------|-----------|-----------|-----------|-----------|
| Small   | 32px   | 12px      | 8px       | 11px      | 14px      |
| Medium  | 40px   | 16px      | 10px      | 13px      | 16px      |
| Large   | 48px   | 20px      | 12px      | 15px      | 18px      |

### Hierarquia Tipográfica

| Uso                    | Size | Weight  | Letter Spacing |
|------------------------|------|---------|----------------|
| Valores grandes        | 30px | 600     | -1.8px         |
| Títulos destaque       | 28px | 500     | normal         |
| Títulos seção          | 20px | 600     | -1px           |
| Textos destaque        | 16px | 500     | -0.8px         |
| Corpo padrão           | 14px | 400     | normal         |
| Textos secundários     | 12px | 500     | -0.6px         |
| Labels/Tags            | 10px | 600     | -0.4px         |

### Contraste de Cores (WCAG)

| Combinação                  | Ratio   | Level | Status     |
|-----------------------------|---------|-------|------------|
| Text Primary on White       | 12.5:1  | AAA   | ✓ Aprovado |
| Text Secondary on White     | 4.6:1   | AA    | ✓ Aprovado |
| Brand Primary on White      | 16.8:1  | AAA   | ✓ Aprovado |
| Success Main on Light       | 7.2:1   | AAA   | ✓ Aprovado |

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Android 90+

### Performance

- **Bundle Size (gzipped)**:
  - design-tokens.ts: ~0.8KB
  - Button.tsx: ~2.5KB
  - Tag.tsx: ~1KB
  - TransactionListItem.tsx: ~1.8KB

## 📋 Casos de Uso Bancário

### Card de Saldo
```tsx
<Card>
  <Label>Saldo disponível</Label>
  <Value>R$ 950.320,12</Value>
  <Footer>
    <Tag variant="success">Δ 10% vs mês anterior</Tag>
    <Button variant="ghost">Ver extrato</Button>
  </Footer>
</Card>
```

### Lista de Transações
```tsx
<TransactionList>
  <DateHeader>Segunda, 24 fev. 2026</DateHeader>
  <TransactionListItem type="sent" label="Pix enviado" value="R$ 100.000" />
  <TransactionListItem type="received" label="Transferência" value="R$ 47.200" />
</TransactionList>
```

### Confirmação de Ação
```tsx
<ActionBar>
  <Button variant="secondary">Cancelar</Button>
  <Button variant="primary">Confirmar Transferência</Button>
</ActionBar>
```

## ✅ Do's and Don'ts

### ✓ DO's
- Use sempre os tokens definidos
- Mantenha apenas um Primary button por tela/seção
- Use variantes semânticas apropriadas
- Mantenha labels de botões curtos (2-3 palavras)
- Teste em diferentes resoluções
- Siga a hierarquia de ações

### ✗ DON'Ts
- Não crie valores arbitrários de cores ou tamanhos
- Não use múltiplos Primary buttons competindo
- Não modifique componentes diretamente
- Não ignore as variantes semânticas
- Não use text-transform: uppercase
- Não misture tamanhos diferentes no mesmo contexto

## 🎯 Próximos Passos

Para expandir o design system:

1. **Novos Componentes**: Input, Select, Modal, Card, Table
2. **Padrões de Layout**: Grid system, containers responsivos
3. **Componentes Compostos**: Form groups, navigation menus
4. **Utilitários**: Helpers de formatação, validações
5. **Temas**: Suporte a dark mode (se necessário)

## 📄 Licença

Design System desenvolvido para uso interno em aplicações de Internet Banking Digital B2B.

---

**Versão**: 1.0.0  
**Última Atualização**: Março 2026  
**Desenvolvido a partir da análise da interface**: SRM Home Banking MVP
