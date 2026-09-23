# 📋 Padrão de Trabalho - Design System B2B Banking

> Documento de referência para manter consistência e qualidade no desenvolvimento do Design System de Internet Banking Digital B2B

---

## 🎯 **Visão Geral do Projeto**

### **Contexto**
Design System completo para aplicação de **Internet Banking Digital B2B**, com foco em:
- Profissionalismo e sofisticação adequados para contexto financeiro empresarial
- Tokenização rigorosa de todos os elementos visuais
- Documentação clean e minimalista
- Casos de uso específicos para operações bancárias
- Prototipação completa de todos os estados dos componentes

### **Princípios de Design**
- ✅ **Consistência**: Todo elemento deve seguir o sistema de tokens
- ✅ **Acessibilidade**: Interfaces claras, contrastes adequados
- ✅ **Densidade**: Interface densa mas organizada para usuários profissionais
- ✅ **Feedback**: Estados visuais claros para todas as interações
- ✅ **Performance**: Animações sutis e performáticas

---

## 🎨 **Sistema de Tokens**

### **1. Cores da Marca**

```css
/* Primary (Azul institucional) */
--color-primary: #1D3F80;
--color-primary-hover: #2563EB;
--color-primary-active: #1E40AF;

/* Secondary (Laranja de ação) */
--color-secondary: #FF8200;
--color-secondary-hover: #FF9500;
--color-secondary-active: #E67300;

/* Textos */
--color-text-primary: #00081e;
--color-text-secondary: #6B7280;

/* Fundos */
--color-background: #F0F2F6;
--color-background-light: #F9FAFB;
--color-white: #FFFFFF;

/* Estados e Feedback */
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #DC2626;
--color-info: #3B82F6;

/* Bordas */
--color-border-light: #E5E7EB;
--color-border-medium: #D1D5DB;
```

### **2. Espaçamentos (Grid de 4px)**

```css
/* Sistema base múltiplo de 4 */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 20px;
--spacing-2xl: 24px;
--spacing-3xl: 32px;
--spacing-4xl: 40px;
```

**Regra de ouro:** Todos os espaçamentos devem ser múltiplos de 4px.

### **3. Tipografia - Inter Exclusive**

```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif;

/* Font Sizes - Máximo detalhe devido à densidade */
--text-xs: 11px;      /* Labels, metadata */
--text-sm: 12px;      /* Body small, captions */
--text-base: 13px;    /* Body text */
--text-md: 14px;      /* Body text importante */
--text-lg: 15px;      /* Subtítulos */
--text-xl: 16px;      /* Títulos de seção */
--text-2xl: 18px;     /* Títulos destacados */
--text-3xl: 24px;     /* Headers principais */
--text-4xl: 48px;     /* Display numbers */

/* Font Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.6;

/* Letter Spacing */
--tracking-tighter: -0.6px;  /* Display */
--tracking-tight: -0.4px;    /* Headings */
--tracking-normal: 0px;      /* Body */
--tracking-wide: 0.5px;      /* Labels uppercase */
```

### **4. Border Radius**

```css
--radius-sm: 6px;   /* Inputs, small elements */
--radius-md: 10px;  /* Secondary cards, alerts */
--radius-lg: 24px;  /* Main content cards */
--radius-full: 9999px; /* Pills, avatars */
```

**IMPORTANTE:** Cards principais de conteúdo sempre usam `24px` de border-radius.

### **5. Sombras**

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

---

## 📐 **Sistema de Grid & Layout**

### **Desktop (1440px base)**

```
Width total: 1440px
Padding lateral: 56px (cada lado)
Container: 1328px (1440 - 112)
Colunas: 12 colunas
Gutter: 24px entre colunas
```

### **Breakpoints**

```css
/* Mobile */
@media (max-width: 768px) {
  padding: 0 20px;
}

/* Tablet */
@media (max-width: 1024px) {
  padding: 0 40px;
}

/* Desktop */
@media (min-width: 1025px) {
  padding: 0 56px;
  max-width: 1440px;
}
```

---

## 🧩 **Componentes do Design System**

### **1. Button Component**

**Localização:** `/src/app/components/ds/Button.tsx`

#### **Variantes**

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
```

#### **Estados obrigatórios**
- ✅ Default
- ✅ Hover
- ✅ Active
- ✅ Focused
- ✅ Loading
- ✅ Disabled

#### **Animações específicas**

**Primary Button:**
```typescript
// Overlay deslizando da esquerda para direita
animation: slideFromLeft 0.3s ease-out
```

**Secondary Button:**
```typescript
// Elipse expandindo do centro
animation: rippleFromCenter 0.4s ease-out
```

#### **Exemplo de implementação**

```tsx
<Button
  variant="primary"
  size="md"
  loading={isLoading}
  disabled={!isValid}
  onClick={handleSubmit}
>
  Confirmar transferência
</Button>
```

### **2. Tag Component**

**Localização:** `/src/app/components/ds/Tag.tsx`

#### **Variantes**
```typescript
type TagVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type TagSize = 'sm' | 'md';
```

#### **Exemplo**
```tsx
<Tag variant="success" size="sm">
  Aprovado
</Tag>
```

### **3. AlertCard Component**

**Localização:** `/src/app/components/ds/AlertCard.tsx`

#### **Variantes**
```typescript
type AlertVariant = 'success' | 'warning' | 'error' | 'info';
```

#### **Props**
```typescript
interface AlertCardProps {
  variant: AlertVariant;
  title: string;
  description: string;
  icon?: React.ReactNode;
}
```

---

## 📁 **Estrutura de Arquivos**

### **Organização do Projeto**

```
/src
├── app/
│   ├── components/
│   │   ├── ds/                    # Design System components
│   │   │   ├── Button.tsx
│   │   │   ├── Tag.tsx
│   │   │   └── AlertCard.tsx
│   │   ├── BankingLayout.tsx      # Layout wrapper
│   │   └── Stepper.tsx            # Progress indicator
│   ├── pages/
│   │   └── pix/                   # Feature: PIX Transfer
│   │       ├── Index.tsx          # Menu principal
│   │       ├── Gallery.tsx        # Showcase mode
│   │       ├── PixSelectKeyType.tsx
│   │       ├── PixEnterKey.tsx
│   │       ├── PixLoadingSearch.tsx
│   │       ├── PixEnterAmount.tsx
│   │       ├── PixReview.tsx
│   │       ├── PixAuthentication.tsx
│   │       ├── PixProcessing.tsx
│   │       ├── PixReceipt.tsx
│   │       └── PixError*.tsx      # Error screens
│   ├── routes.tsx                 # React Router config
│   └── App.tsx                    # Entry point
├── design-system/
│   └── components/                # DS exports (se houver)
└── styles/
    ├── theme.css                  # Design tokens
    └── fonts.css                  # Font imports
```

### **Convenções de nomenclatura**

#### **Componentes**
- PascalCase: `ButtonComponent.tsx`
- Prefixo por feature: `PixSelectKeyType.tsx`
- Sufixo para variações: `PixErrorKeyNotFound.tsx`

#### **Páginas de erro**
```
PixError[Categoria][Especificação].tsx

Exemplos:
- PixErrorKeyNotFound.tsx
- PixErrorInvalidAmount.tsx
- PixErrorWrongPassword.tsx
- PixErrorSystemDown.tsx
```

---

## 🔧 **Padrões de Código**

### **1. Estrutura de Componente de Página**

```tsx
/**
 * PIX - [Nome da Tela]
 * Internet Banking Digital B2B
 * 
 * [Descrição breve da funcionalidade]
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { BankingLayout } from '../../components/BankingLayout';
import { Button } from '../../../design-system/components/Button';

export default function PixScreenName() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock data for direct access (importante!)
  const mockData = {
    recipientData: {
      name: 'Maria Silva Santos',
      document: '123.456.789-00',
      bank: 'Banco do Brasil',
    },
    amount: 500.00,
  };
  
  // Destructure com fallback para mock
  const { 
    recipientData = mockData.recipientData,
    amount = mockData.amount 
  } = location.state || {};
  
  // Estados locais
  const [loading, setLoading] = useState(false);
  
  // Handlers
  const handleNext = () => {
    navigate('/pix/next-screen', {
      state: {
        recipientData,
        amount,
        // ... outros dados
      },
    });
  };
  
  return (
    <BankingLayout maxWidth="narrow">
      {/* Conteúdo */}
    </BankingLayout>
  );
}
```

### **2. Estados com Mock Data**

**❌ EVITAR:**
```tsx
// Redirect quebra navegação direta
React.useEffect(() => {
  if (!recipientData) {
    navigate('/', { replace: true });
  }
}, [recipientData, navigate]);
```

**✅ FAZER:**
```tsx
// Mock data permite acesso direto
const mockData = { /* ... */ };
const { recipientData = mockData } = location.state || {};
```

### **3. Estilização Inline**

**Sempre use objetos de estilo inline para consistência:**

```tsx
<div style={{
  padding: '24px',
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '10px',
  marginBottom: 32,
}}>
```

**Atenção:**
- Use valores numéricos para padding/margin quando possível
- Use strings para cores (hex)
- Sempre especifique unidades (px, %, rem)

### **4. Formatação de Moeda**

```tsx
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Uso
<p>R$ {formatCurrency(amount)}</p>
```

### **5. Navegação entre telas**

```tsx
// Sempre passe os dados necessários via state
navigate('/pix/next-screen', {
  state: {
    keyType,
    keyValue,
    recipientData,
    amount,
    description,
  },
});

// Voltar: use navigate(-1) ou caminho específico
<Button onClick={() => navigate(-1)}>
  Voltar
</Button>
```

---

## 🎭 **Sistema de Telas - Fluxo PIX**

### **Categorização**

#### **1. Fluxo Principal (8 telas)**
1. `PixSelectKeyType` - Selecionar tipo de chave
2. `PixEnterKey` - Informar chave PIX
3. `PixLoadingSearch` - Loading - Buscando destinatário
4. `PixEnterAmount` - Informar valor
5. `PixReview` - Revisar transferência
6. `PixAuthentication` - Autenticação (Senha)
7. `PixProcessing` - Processando transação
8. `PixReceipt` - Comprovante de sucesso

#### **2. Erros - Chave PIX (3 telas)**
- `PixErrorKeyNotFound` - E01. Chave não encontrada
- `PixErrorInvalidKey` - E02. Chave inválida
- `PixErrorBlockedRecipient` - E03. Destinatário bloqueado

#### **3. Erros - Valor (3 telas)**
- `PixErrorInvalidAmount` - E04. Valor inválido
- `PixErrorInsufficientBalance` - E05. Saldo insuficiente
- `PixErrorLimitExceeded` - E06. Limite excedido

#### **4. Erros - Autenticação (2 telas)**
- `PixErrorWrongPassword` - E07. Senha incorreta
- `PixErrorAccountBlocked` - E08. Conta bloqueada

#### **5. Erros - Sistema (3 telas)**
- `PixErrorProcessingFailed` - E09. Falha no processamento
- `PixErrorTimeout` - E10. Timeout
- `PixErrorSystemDown` - E11. Sistema indisponível

#### **6. Modais (1 tela)**
- `PixModalConfirmCancel` - M01. Modal de cancelamento

**Total: 20 telas completas**

---

## 🖼️ **Gallery Mode - Showcase de Telas**

### **Funcionalidade**

Sistema de visualização individual das telas para:
- Captura de screenshots
- Apresentação para stakeholders
- Documentação visual
- QA e revisão

### **Arquivo:** `/src/app/pages/pix/Gallery.tsx`

### **Recursos**

✅ **Navegação por teclado**
- `←` Tela anterior
- `→` Próxima tela
- `ESC` Voltar ao menu

✅ **Interface de controle**
- Header fixo com informações da tela
- Contador de progresso (1/20, 2/20...)
- Botões de navegação flutuantes
- Lista lateral com todas as telas
- Instruções de captura

✅ **Renderização direta**
- Componentes renderizados nativamente (não iframe)
- Dados mock pré-configurados
- Performance otimizada

### **Rota**
```
/pix/gallery/:screenId
```

---

## ✅ **Checklist de Desenvolvimento**

### **Ao criar uma nova tela:**

- [ ] Header com comentário descritivo
- [ ] Imports organizados (React, Router, Components, Icons)
- [ ] Export default nomeado corretamente
- [ ] Mock data para acesso direto
- [ ] Location.state com fallback para mock
- [ ] Estados locais necessários (loading, errors, etc)
- [ ] Handlers de navegação com state completo
- [ ] BankingLayout wrapper
- [ ] Stepper de progresso (se aplicável)
- [ ] Estilização com tokens do design system
- [ ] Estados visuais de todos os elementos
- [ ] Feedback de loading/erro apropriado
- [ ] Botões com estados corretos (disabled, loading)
- [ ] Formatação de valores monetários
- [ ] Responsive (se aplicável)

### **Ao criar um novo componente DS:**

- [ ] Localizado em `/src/app/components/ds/`
- [ ] TypeScript com interfaces bem definidas
- [ ] Todos os estados implementados (default, hover, active, focused, disabled, loading)
- [ ] Animações específicas implementadas
- [ ] Props com valores default sensatos
- [ ] Documentação inline com exemplos
- [ ] Testes de acessibilidade
- [ ] Exportado corretamente

---

## 🚨 **Problemas Comuns e Soluções**

### **1. Telas voltando para home ao navegar**

**Problema:**
```tsx
// ❌ Redirect automático quebra navegação
React.useEffect(() => {
  if (!data) {
    navigate('/', { replace: true });
  }
}, [data, navigate]);
```

**Solução:**
```tsx
// ✅ Mock data + comentar redirect
const mockData = { /* ... */ };
const { data = mockData } = location.state || {};

// Comentar ou remover o useEffect de redirect
```

### **2. Variáveis não definidas**

**Problema:**
```
ReferenceError: availableBalance is not defined
```

**Solução:**
- Adicionar a variável no mock data
- Incluir no destructuring com valor default
```tsx
const { availableBalance = 345.50 } = location.state || {};
```

### **3. Estados faltando**

**Problema:**
```tsx
// ❌ setIsProcessing usado mas não declarado
const handleSubmit = () => {
  setIsProcessing(true);
}
```

**Solução:**
```tsx
// ✅ Declarar todos os estados
const [isProcessing, setIsProcessing] = useState(false);
```

### **4. Animações não funcionando**

**Problema:**
- Animações CSS não aplicadas
- Transições sem efeito

**Solução:**
- Verificar se as propriedades transition estão definidas
- Usar Motion/Framer Motion para animações complexas
- Testar em diferentes browsers

---

## 📚 **Bibliotecas e Dependências**

### **Core**
- `react` - UI framework
- `react-router` - Navegação (usar react-router, não react-router-dom)
- `typescript` - Type safety

### **UI & Icons**
- `lucide-react` - Ícones (preferência)
- `motion` - Animações complexas (import { motion } from 'motion/react')

### **Styling**
- CSS inline com objetos de estilo
- Tailwind CSS v4 (classes utilitárias quando apropriado)

### **Utilities**
- `date-fns` - Manipulação de datas (se necessário)

---

## 🎯 **Boas Práticas Estabelecidas**

### **1. Sempre pense em "Direct Access"**
Cada tela deve funcionar independentemente, acessível via URL direta.

### **2. Mock Data é essencial**
Facilita desenvolvimento, testes e showcase sem fluxo completo.

### **3. Navegação sempre com state**
Passe todos os dados necessários via `location.state`.

### **4. Comentários descritivos**
Cada arquivo deve ter header explicando seu propósito.

### **5. Nomenclatura consistente**
Siga os padrões estabelecidos para fácil manutenção.

### **6. Estados completos**
Nunca deixe componentes sem estados de loading/erro/vazio.

### **7. Formatação de dados**
Sempre formate valores monetários, datas, documentos corretamente.

### **8. Feedback visual**
Usuário deve sempre saber o que está acontecendo (loading, sucesso, erro).

---

## 🔄 **Workflow de Desenvolvimento**

### **Fase 1: Planejamento**
1. Definir funcionalidade e telas necessárias
2. Mapear fluxo de dados entre telas
3. Identificar estados de erro possíveis
4. Listar componentes DS necessários

### **Fase 2: Implementação**
1. Criar estrutura de arquivos
2. Implementar componentes DS (se novos)
3. Desenvolver telas do fluxo principal
4. Adicionar telas de erro
5. Implementar modais/overlays

### **Fase 3: Integração**
1. Configurar rotas
2. Testar navegação entre telas
3. Validar passagem de dados
4. Implementar Gallery mode

### **Fase 4: Refinamento**
1. Ajustar espaçamentos e alinhamentos
2. Refinar animações e transições
3. Adicionar feedback visual
4. Testar responsividade
5. Revisar acessibilidade

### **Fase 5: Documentação**
1. Comentários inline
2. README de features
3. Screenshots no Gallery
4. Atualizar este documento

---

## 📝 **Notas de Versão**

### **v1.0 - Fluxo PIX Completo**
- ✅ 20 telas implementadas
- ✅ 3 componentes DS (Button, Tag, AlertCard)
- ✅ Gallery Mode funcional
- ✅ Sistema de rotas completo
- ✅ Mock data em todas as telas
- ✅ Navegação sem redirects indesejados

---

## 🎨 **Próximos Passos Sugeridos**

### **Componentes DS prioritários:**
- [ ] Input / TextField
- [ ] Select / Dropdown
- [ ] Modal / Dialog
- [ ] Tooltip
- [ ] Checkbox / Radio
- [ ] Toggle / Switch
- [ ] DatePicker
- [ ] Table / DataGrid
- [ ] Pagination
- [ ] Breadcrumb

### **Features bancárias:**
- [ ] Fluxo de Pagamento de Boleto
- [ ] Extrato / Statement
- [ ] Transferência TED/DOC
- [ ] Cartões (listagem, fatura, limites)
- [ ] Investimentos
- [ ] Empréstimos
- [ ] Dashboard Analytics

### **Melhorias de UX:**
- [ ] Toast notifications system
- [ ] Loading states globais
- [ ] Error boundary customizado
- [ ] Skeleton loaders
- [ ] Empty states
- [ ] Onboarding flows

---

## 🤝 **Colaboração**

### **Code Review Checklist**
- [ ] Código segue padrões estabelecidos
- [ ] Tokens do design system respeitados
- [ ] Mock data implementado
- [ ] Estados completos (loading, error, success)
- [ ] Navegação funcionando corretamente
- [ ] Comentários adequados
- [ ] Sem console.logs ou TODOs
- [ ] Performance otimizada

---

## 📞 **Suporte e Dúvidas**

Ao encontrar problemas ou ter dúvidas:

1. **Consulte este documento primeiro**
2. **Verifique arquivos de exemplo** (`/src/app/pages/pix/`)
3. **Revise componentes DS** (`/src/app/components/ds/`)
4. **Teste no Gallery Mode** para isolar problemas
5. **Documente novos padrões** descobertos

---

## 🏆 **Conclusão**

Este padrão de trabalho foi estabelecido para garantir:

✅ **Consistência visual** através do sistema de tokens  
✅ **Qualidade de código** com padrões claros  
✅ **Manutenibilidade** através de organização e documentação  
✅ **Escalabilidade** para futuras features  
✅ **Colaboração efetiva** entre desenvolvedores  

**Mantenha este documento atualizado conforme o projeto evolui!**

---

**Última atualização:** 2026-04-06  
**Versão:** 1.0  
**Status:** ✅ Ativo e em uso