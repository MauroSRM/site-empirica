# Fluxo de Transferência PIX - HB Digital

Sistema completo de transferência PIX para Internet Banking Digital B2B.

## 📋 Fluxo Implementado

### 1. Dashboard (/)
Tela inicial com:
- Visualização de saldo disponível
- Acesso rápido a ações principais (PIX, QR Code, Boleto, Cartões)
- Cards com estatísticas financeiras
- Lista de contas a receber
- Atividades recentes

### 2. Seleção de Tipo de Chave (/pix/select-key-type)
Escolha do tipo de chave PIX:
- **CPF / CNPJ** - Transferir usando documento
- **E-mail** - Transferir usando e-mail
- **Celular** - Transferir usando telefone
- **Chave Aleatória** - Código gerado automaticamente

**Features:**
- Indicador de progresso (4 etapas)
- Seleção visual com feedback interativo
- Validação antes de continuar

### 3. Informar Chave (/pix/enter-key)
Entrada da chave PIX do destinatário:
- Input formatado automaticamente (CPF/CNPJ, telefone)
- Busca de dados do destinatário
- Validação da chave
- Exibição dos dados encontrados

**Features:**
- Formatação automática baseada no tipo de chave
- Loading state durante busca
- Card de confirmação com dados do destinatário
- Alert de segurança

### 4. Inserir Valor (/pix/enter-amount)
Definição do valor da transferência:
- Input grande e focado para o valor
- Formatação automática de moeda (R$)
- Botões de valores rápidos (R$ 100, 200, 500, 1000)
- Campo opcional para descrição
- Exibição de saldo disponível
- Info sobre limites PIX

**Features:**
- Formatação de moeda em tempo real
- Validação de saldo
- Contador de caracteres na descrição (140 max)
- Card do destinatário sempre visível

### 5. Revisar e Confirmar (/pix/review)
Confirmação da transferência:
- Resumo completo da operação
- Todos os dados da transferência
- Input de senha para autorização
- Toggle para mostrar/ocultar senha

**Features:**
- Validação de senha (mínimo 4 caracteres)
- Loading state durante processamento
- Alert de segurança sobre senha
- Revisão detalhada de todos os dados

### 6. Comprovante (/pix/receipt)
Comprovante da transferência realizada:
- Feedback visual de sucesso
- ID da transação copiável
- Data e hora da operação
- Todos os detalhes da transferência
- Ações de download e compartilhamento

**Features:**
- Copiar ID da transação
- Baixar PDF (preparado para implementação)
- Compartilhar (preparado para implementação)
- Voltar ao início ou fazer nova transferência

## 🎨 Design System

O projeto segue rigorosamente as especificações do design system:

### Espaçamentos
- **4px** - Gaps mínimos entre elementos pequenos
- **8px** - Padding interno de componentes
- **12px** - Gaps em listas e grids menores
- **16px** - Padding padrão de cards
- **20px** - Espaçamento médio
- **24px** - Gaps principais em layouts
- **32px** - Padding de seções maiores
- **40px** - Margens entre seções principais

### Cores (Brand)
```css
--brand-900: #0a1628
--brand-800: #0f2256
--brand-700: #0e4099
--brand-600: #1041b7
--brand-500: #1053cb (Primary)
--brand-400: #2d448c
--brand-300: #4d8cff
--brand-100: #96c2ff (Focus)
--brand-50:  #e1ecff
```

### Cores (Neutral)
```css
--neutral-50:  #f4f6f9 (Background)
--neutral-100: #eef1f7
--neutral-200: #dde3ec (Borders)
--neutral-300: #c0cad8
--neutral-500: #8a9ab5 (Text Secondary)
--neutral-700: #5a6a82
--neutral-900: #1a2340 (Text Primary)
```

### Tipografia
- **Font Family:** 'Inter', system-ui, sans-serif
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Scales:**
  - 48px - Valores grandes (hero)
  - 40px - Saldos principais
  - 28-32px - Valores médios
  - 24px - Títulos principais (H2)
  - 20px - Títulos de seção (H3)
  - 16px - Títulos de card (H4)
  - 14px - Texto padrão
  - 13px - Texto secundário
  - 12px - Labels pequenos
  - 11px - Captions e metadata
  - 10px - Labels de spec

### Componentes Usados

1. **Button** - Do design system
   - Variantes: primary, secondary, ghost
   - Tamanhos: small, medium, normal
   - Estados: default, hover, active, loading, disabled
   - Animações: overlay (primary), elipse (secondary)

2. **AlertCard** - Para avisos e alertas
   - Variantes: info, warning, danger, success

3. **ReceivableAlertCard** - Para contas a receber
   - Variantes: overdue, warning, neutral

4. **Tag** - Para labels e badges

5. **MainLayout** - Layout base com:
   - Sidebar com navegação
   - Header com título e botão voltar
   - Área de conteúdo principal

## 🔐 Segurança

- Validação em cada etapa
- Confirmação com senha
- Alerts de segurança apropriados
- Dados sensíveis tratados com cuidado
- ID de transação para rastreamento

## 📱 Responsividade

O layout é fixo desktop-first, adequado para aplicações B2B empresariais que tipicamente são usadas em desktops e notebooks.

## 🚀 Próximas Implementações

- Integração com API real
- Download de PDF do comprovante
- Compartilhamento via e-mail/WhatsApp
- Histórico de transações PIX
- Favoritos (chaves salvas)
- Agendamento de transferências
- PIX por QR Code
- PIX Copia e Cola
- Notificações em tempo real

## 💡 Observações

- Todos os dados são mockados para demonstração
- Formatação de valores segue padrão brasileiro (R$)
- Máscaras automáticas para CPF/CNPJ e telefone
- Feedback visual em todas as interações
- Estados de loading para simular chamadas de API
- Transições suaves entre telas
- Preservação de dados entre etapas via `location.state`

---

**Desenvolvido seguindo as especificações do Design System HB Digital**
