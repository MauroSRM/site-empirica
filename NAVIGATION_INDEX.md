# 🗂️ Índice de Navegação - Design System SRM

Guia rápido para encontrar o que você precisa.

## 📚 Documentação

### Para Começar
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Leia primeiro! Visão geral do que foi criado
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Guia rápido para desenvolvedores (copiar/colar)
- **[DESIGN_SYSTEM_README.md](./DESIGN_SYSTEM_README.md)** - README completo e detalhado

### Documentação Interativa
- **Aplicação Principal** (`/src/app/App.tsx`) - Interface com abas Documentação e Playbook
  - Aba "Documentação": Componentes, tokens, exemplos visuais
  - Aba "Playbook": Especificações técnicas, implementação

## 🎨 Design Tokens

### Arquivo Principal
```
📄 /src/design-system/tokens/design-tokens.ts
```
**Contém:**
- Tipografia (3 famílias, 11 tamanhos, 4 pesos)
- Cores (brand, gray scale, semânticas, UI)
- Gradientes (4 variações)
- Espaçamento (9 níveis)
- Border Radius (6 níveis)
- Shadows (8 variações)
- Transições (durações e easings)
- Icon Sizes (6 tamanhos)
- Z-index (7 camadas)
- Breakpoints (6 pontos)

**Como usar:**
```tsx
import { designTokens } from './design-system/tokens/design-tokens';
designTokens.colors.brand.primary
```

### Tokens Específicos de Componentes

#### Button
```
📄 /src/design-system/tokens/button-tokens.ts
```
- 3 tamanhos (sm: 32px, md: 40px, lg: 48px)
- 3 variantes (primary, secondary, ghost)
- Estados (default, hover, active, disabled)

#### Tag
```
📄 /src/design-system/tokens/tag-tokens.ts
```
- 5 variantes (success, warning, info, error, neutral)
- 2 tamanhos (sm, md)

#### TransactionListItem
```
📄 /src/design-system/tokens/transaction-list-item-tokens.ts
```
- 3 tipos (sent, received, pending)
- Tipografia específica Montserrat

## 🧩 Componentes

### Button
```
📄 /src/design-system/components/Button.tsx
```

**Props:**
```tsx
variant?: 'primary' | 'secondary' | 'ghost'
size?: 'sm' | 'md' | 'lg'
loading?: boolean
disabled?: boolean
fullWidth?: boolean
iconLeft?: ReactNode
iconRight?: ReactNode
iconOnly?: boolean
```

**Exemplo rápido:**
```tsx
import { Button } from './design-system/components/Button';
<Button variant="primary" size="md">Confirmar</Button>
```

**Documentação completa:** Ver seção "Botões" na aba Documentação

### Tag
```
📄 /src/design-system/components/Tag.tsx
```

**Props:**
```tsx
variant?: 'success' | 'warning' | 'info' | 'error' | 'neutral'
size?: 'sm' | 'md'
iconLeft?: ReactNode
iconRight?: ReactNode
```

**Exemplo rápido:**
```tsx
import { Tag } from './design-system/components/Tag';
<Tag variant="success">Aprovado</Tag>
```

**Documentação completa:** Ver seção "Tags" na aba Documentação

### TransactionListItem
```
📄 /src/design-system/components/TransactionListItem.tsx
```

**Props:**
```tsx
type?: 'sent' | 'received' | 'pending'
label: string
value: string
description?: string
onClick?: () => void
customIcon?: ReactNode
```

**Exemplo rápido:**
```tsx
import { TransactionListItem } from './design-system/components/TransactionListItem';
<TransactionListItem 
  type="sent" 
  label="Pix enviado" 
  value="R$ 100.000"
/>
```

**Documentação completa:** Ver seção "Lista de Transações" na aba Documentação

## 📖 Documentação Detalhada

### Documentação Interativa
```
📄 /src/design-system/documentation/DesignSystemDocumentation.tsx
```

**10 Seções:**
1. Visão Geral
2. Tokens de Design
3. Tipografia
4. Cores
5. Espaçamento
6. Botões
7. Tags
8. Lista de Transações
9. Padrões de Uso
10. Diretrizes

**Acesso:** Aba "Documentação" na aplicação

### Playbook Técnico
```
📄 /src/design-system/documentation/Playbook.tsx
```

**6 Capítulos:**
1. Introdução
2. Começando (Getting Started)
3. Design Tokens (especificações detalhadas)
4. Componentes (props, dimensões, exemplos)
5. Implementação (arquitetura, composição)
6. Especificações (grid, acessibilidade, performance)

**Acesso:** Aba "Playbook" na aplicação

## 🔍 Encontre por Necessidade

### "Preciso implementar um botão"
1. **Referência rápida:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → seção "Button"
2. **Especificações:** Documentação Interativa → seção "Botões"
3. **Código fonte:** `/src/design-system/components/Button.tsx`
4. **Tokens:** `/src/design-system/tokens/button-tokens.ts`

### "Preciso usar cores corretas"
1. **Cores disponíveis:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → seção "Cores"
2. **Paleta completa:** Documentação Interativa → seção "Cores"
3. **Tokens:** `/src/design-system/tokens/design-tokens.ts` → `colors`

### "Preciso saber tamanhos de fonte"
1. **Tamanhos:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → seção "Tipografia"
2. **Hierarquia:** Documentação Interativa → seção "Tipografia"
3. **Tokens:** `/src/design-system/tokens/design-tokens.ts` → `typography.fontSize`

### "Preciso espaçamento correto"
1. **Valores:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → seção "Espaçamento"
2. **Visual:** Documentação Interativa → seção "Espaçamento"
3. **Tokens:** `/src/design-system/tokens/design-tokens.ts` → `spacing`

### "Preciso implementar uma tag de status"
1. **Referência rápida:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → seção "Tag"
2. **Casos de uso:** Documentação Interativa → seção "Tags"
3. **Código fonte:** `/src/design-system/components/Tag.tsx`

### "Preciso formatar valores monetários"
1. **Formatação:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → seção "Formatação"
2. **Especificações:** Playbook → Capítulo 6 → "Formatação de Dados"

### "Preciso criar um card de saldo"
1. **Padrão pronto:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → seção "Padrões Comuns"
2. **Composições:** Documentação Interativa → seção "Padrões de Uso"

### "Preciso implementar lista de transações"
1. **Componente:** `/src/design-system/components/TransactionListItem.tsx`
2. **Exemplo:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → "Lista de Transações"
3. **Documentação:** Documentação Interativa → seção "Lista de Transações"

### "Preciso entender a arquitetura"
1. **Resumo:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
2. **Estrutura:** [DESIGN_SYSTEM_README.md](./DESIGN_SYSTEM_README.md) → "Estrutura"
3. **Implementação:** Playbook → Capítulo 5

### "Preciso specs técnicas (dimensões, acessibilidade)"
1. **Tabelas:** Playbook → Capítulo 6 → "Especificações Técnicas"
2. **Dimensões:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) → "Tabela de Dimensões"

## 🎯 Fluxos Comuns

### Fluxo 1: Novo Desenvolvedor
1. Ler [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
2. Explorar Documentação Interativa (todas as seções)
3. Consultar [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) durante desenvolvimento
4. Manter Playbook aberto para especificações

### Fluxo 2: Implementar Nova Feature
1. Consultar [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) para tokens e componentes
2. Ver exemplos na Documentação Interativa
3. Copiar padrões comuns do Quick Reference
4. Validar com checklist do Quick Reference

### Fluxo 3: Design Review
1. Verificar tokens usados em `/src/design-system/tokens/design-tokens.ts`
2. Comparar com guidelines na Documentação → "Diretrizes"
3. Validar acessibilidade no Playbook → Capítulo 6

### Fluxo 4: Criar Novo Componente
1. Estudar estrutura dos componentes existentes em `/src/design-system/components/`
2. Criar tokens específicos em `/src/design-system/tokens/`
3. Seguir padrão de implementação do Playbook → Capítulo 5
4. Documentar conforme exemplos existentes

## 📊 Mapa de Arquivos

```
/
├── NAVIGATION_INDEX.md              ← VOCÊ ESTÁ AQUI
├── IMPLEMENTATION_SUMMARY.md        ← Resumo executivo
├── DESIGN_SYSTEM_README.md          ← README completo
├── QUICK_REFERENCE.md               ← Guia rápido
│
└── src/
    ├── app/
    │   └── App.tsx                  ← Aplicação principal (abas)
    │
    ├── design-system/
    │   ├── index.ts                 ← Export central
    │   │
    │   ├── tokens/                  ← DESIGN TOKENS
    │   │   ├── design-tokens.ts     ← Tokens principais
    │   │   ├── button-tokens.ts
    │   │   ├── tag-tokens.ts
    │   │   └── transaction-list-item-tokens.ts
    │   │
    │   ├── components/              ← COMPONENTES
    │   │   ├── Button.tsx
    │   │   ├── Tag.tsx
    │   │   └── TransactionListItem.tsx
    │   │
    │   └── documentation/           ← DOCUMENTAÇÃO
    │       ├── DesignSystemDocumentation.tsx  ← Doc interativa
    │       └── Playbook.tsx                   ← Playbook técnico
    │
    └── imports/                     ← Componentes Figma originais
        ├── DIbHomeMvp.tsx           ← Interface analisada
        ├── Button-23-4888.tsx
        ├── Tag.tsx
        └── TransactionListItem.tsx
```

## 🚀 Atalhos Rápidos

| Preciso...                    | Vá para...                                      |
|-------------------------------|------------------------------------------------|
| Começar do zero               | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) |
| Consultar durante dev         | [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)      |
| Ver tudo sobre um componente  | Documentação Interativa → Seção específica      |
| Specs técnicas                | Playbook → Capítulo 6                          |
| Exemplo de código             | QUICK_REFERENCE → Padrões Comuns               |
| Cores exatas                  | `/src/design-system/tokens/design-tokens.ts`   |
| Implementar botão             | `/src/design-system/components/Button.tsx`     |
| Entender arquitetura          | Playbook → Capítulo 5                          |

## 💡 Dicas

1. **Para desenvolvimento diário**: Mantenha [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) aberto em uma aba
2. **Para onboarding**: Comece com [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
3. **Para design review**: Use Documentação Interativa
4. **Para especificações**: Use Playbook
5. **Para busca rápida**: Use Ctrl+F neste arquivo (NAVIGATION_INDEX.md)

## 📞 Onde Encontrar...

### Exemplos de Código
- Quick Reference → todas as seções
- Playbook → Capítulo 2 (Getting Started)
- Playbook → Capítulo 4 (Componentes)

### Especificações de Design
- Documentação Interativa → todas as seções visuais
- Playbook → Capítulo 3 (Design Tokens)
- Design tokens files

### Boas Práticas
- Documentação Interativa → "Diretrizes"
- Playbook → Capítulo 5 (Implementação)
- Quick Reference → Checklist

### Do's and Don'ts
- Documentação Interativa → cada seção de componente
- README → "Do's and Don'ts"

---

**Este índice é seu ponto de partida!** Bookmark esta página para referência rápida.

**Sugestão**: Imprima ou mantenha este índice sempre visível durante o desenvolvimento.
