# Mapeamento Completo - Fluxo PIX por Chave
## Internet Banking Digital B2B - HB Digital

---

## 📊 VISÃO GERAL DO FLUXO

**Total de Telas:** 20 telas (incluindo todos os cenários)
**Componentes do Design System:** Button, Tag, AlertBar
**Grid System:** 12 colunas, 1440px width, padding 56px, container 1328px, cards 878px

---

## 🎯 FLUXO PRINCIPAL (Happy Path)

### **Tela 01: Seleção do Tipo de Chave** ✅ IMPLEMENTADA
**Arquivo:** `PixScreen01SelectKeyType.tsx`
**Estado:** Implementada
**Elementos:**
- Stepper (Step 1/4 ativo)
- 5 Card Buttons para tipos de chave:
  - CPF
  - CNPJ
  - E-mail
  - Telefone
  - Chave Aleatória
- Buttons: "Cancelar" (secondary) + "Continuar" (primary, disabled até selecionar)

---

### **Tela 02: Informar Chave PIX** ✅ IMPLEMENTADA
**Arquivo:** `PixScreen02EnterKey.tsx`
**Estado:** Implementada
**Elementos:**
- Stepper (Step 2/4 ativo)
- Input de texto para chave PIX
- Button "Buscar" com ícone
- Card de destinatário encontrado (estado success)
- AlertBar informativa (azul): "Confira se os dados do destinatário estão corretos..."
- Buttons: "Voltar" (secondary) + "Continuar" (primary)

---

### **Tela 03: Loading - Buscando Chave** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen03LoadingSearch.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 2/4 ativo)
- Card central com:
  - Spinner animado
  - Texto: "Buscando chave PIX..."
  - Subtexto: "Aguarde enquanto verificamos os dados do destinatário"
- Sem botões (loading state)

---

### **Tela 04: Informar Valor** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen04EnterAmount.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 3/4 ativo)
- Resumo do destinatário (compacto, no topo)
- Input de valor (formatado R$)
- Informação de saldo disponível
- Input de descrição/finalidade (opcional)
- Tag mostrando limite diário disponível
- Buttons: "Voltar" (secondary) + "Continuar" (primary)

---

### **Tela 05: Revisar Transferência** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen05Review.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 4/4 ativo)
- Card de revisão com todos os dados:
  - Destinatário (nome, banco, conta)
  - Valor
  - Descrição
  - Data/hora prevista
- Checkbox "Salvar como favorito"
- AlertBar informativa: "Transferências PIX são instantâneas e irreversíveis"
- Buttons: "Voltar" (secondary) + "Confirmar e prosseguir" (primary)

---

### **Tela 06: Autenticação - Senha** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen06Authentication.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 4/4 ativo)
- Card de autenticação:
  - Título: "Confirme sua senha"
  - Input de senha (type=password)
  - Link "Esqueci minha senha"
  - Contador de tentativas (se houver erro)
- AlertBar (se erro): Tag "danger" + mensagem de senha incorreta
- Buttons: "Cancelar" (secondary) + "Confirmar" (primary, loading state ao processar)

---

### **Tela 07: Processando Transferência** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen07Processing.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 4/4 ativo)
- Card central com:
  - Spinner animado (maior)
  - Texto: "Processando sua transferência..."
  - Subtexto: "Não feche esta janela"
- Sem botões (processing state)

---

### **Tela 08: Sucesso - Comprovante** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen08Success.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Sem stepper
- Ícone de sucesso (check verde)
- Título: "Transferência realizada com sucesso!"
- Card de comprovante com:
  - Tag "success": "Concluída"
  - Valor transferido (destaque)
  - Destinatário
  - Data/hora
  - ID da transação
  - Descrição
- Buttons: 
  - "Baixar comprovante" (secondary) 
  - "Compartilhar" (secondary)
  - "Fazer nova transferência" (primary)
  - "Voltar ao início" (ghost)

---

## ❌ CENÁRIOS DE ERRO

### **Tela 09: Erro - Chave Não Encontrada** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen09ErrorKeyNotFound.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 2/4 ativo)
- Card com input da chave (mantém o valor digitado)
- AlertBar com Tag "danger":
  - Título: "Chave PIX não encontrada"
  - Mensagem: "A chave informada não está cadastrada no sistema PIX. Verifique os dados e tente novamente."
- Buttons: "Voltar" (secondary) + "Tentar novamente" (primary)

---

### **Tela 10: Erro - Chave Inválida** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen10ErrorInvalidKey.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 2/4 ativo)
- Card com input da chave (com borda vermelha)
- AlertBar com Tag "danger":
  - Título: "Chave PIX inválida"
  - Mensagem: "O formato da chave informada está incorreto. Para CPF/CNPJ, use apenas números."
- Buttons: "Voltar" (secondary) + "Corrigir" (primary)

---

### **Tela 11: Erro - Destinatário Bloqueado** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen11ErrorBlockedRecipient.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 2/4 ativo)
- Card do destinatário encontrado (com overlay vermelho)
- AlertBar com Tag "danger":
  - Título: "Destinatário bloqueado"
  - Mensagem: "Não é possível realizar transferências para este destinatário. Entre em contato com o suporte."
- Buttons: "Voltar" (secondary) + "Escolher outra chave" (primary)

---

### **Tela 12: Erro - Valor Inválido** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen12ErrorInvalidAmount.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 3/4 ativo)
- Card com input de valor (borda vermelha)
- AlertBar com Tag "alert":
  - Título: "Valor inválido"
  - Mensagem: "O valor mínimo para transferência PIX é R$ 0,01 e o máximo é R$ 50.000,00 por transação."
- Buttons: "Voltar" (secondary) + "Corrigir" (primary)

---

### **Tela 13: Erro - Saldo Insuficiente** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen13ErrorInsufficientBalance.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 3/4 ativo)
- Card com input de valor
- AlertBar com Tag "danger":
  - Título: "Saldo insuficiente"
  - Mensagem: "O saldo disponível na conta é insuficiente para realizar esta transferência."
  - Saldo atual: "R$ X.XXX,XX"
  - Valor solicitado: "R$ Y.YYY,YY"
- Buttons: "Cancelar" (secondary) + "Alterar valor" (primary)

---

### **Tela 14: Erro - Limite Excedido** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen14ErrorLimitExceeded.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 3/4 ativo)
- Card com input de valor
- AlertBar com Tag "alert":
  - Título: "Limite diário excedido"
  - Mensagem: "O valor ultrapassa o limite diário de transferências PIX."
  - Limite disponível: "R$ X.XXX,XX"
  - Valor solicitado: "R$ Y.YYY,YY"
- Buttons: "Cancelar" (secondary) + "Alterar valor" (primary)

---

### **Tela 15: Erro - Senha Incorreta** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen15ErrorWrongPassword.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 4/4 ativo)
- Card de autenticação com input de senha (borda vermelha)
- AlertBar com Tag "danger":
  - Título: "Senha incorreta"
  - Mensagem: "A senha informada está incorreta. Tentativas restantes: 2/3"
- Link "Esqueci minha senha"
- Buttons: "Cancelar" (secondary) + "Tentar novamente" (primary)

---

### **Tela 16: Erro - Conta Bloqueada** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen16ErrorAccountBlocked.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Stepper (Step 4/4 ativo)
- Ícone de bloqueio
- AlertBar com Tag "danger":
  - Título: "Conta temporariamente bloqueada"
  - Mensagem: "Devido a múltiplas tentativas incorretas, sua conta foi bloqueada por segurança. Entre em contato com o suporte."
- Informações de contato do suporte
- Button: "Falar com suporte" (primary)

---

### **Tela 17: Erro - Falha no Processamento** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen17ErrorProcessingFailed.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Sem stepper
- Ícone de erro
- AlertBar com Tag "danger":
  - Título: "Erro ao processar transferência"
  - Mensagem: "Ocorreu um erro durante o processamento. Sua conta não foi debitada. Código de erro: #12345"
- Buttons: "Voltar ao início" (secondary) + "Tentar novamente" (primary)

---

### **Tela 18: Erro - Timeout de Conexão** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen18ErrorTimeout.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Sem stepper
- Ícone de timeout/relógio
- AlertBar com Tag "alert":
  - Título: "Tempo de resposta excedido"
  - Mensagem: "A operação está demorando mais que o esperado. Verifique o status da transferência no extrato antes de tentar novamente."
- Buttons: "Ver extrato" (secondary) + "Voltar ao início" (primary)

---

### **Tela 19: Erro - Sistema Indisponível** ⚠️ PRECISA CRIAR
**Arquivo:** `PixScreen19ErrorSystemDown.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Sem stepper
- Ícone de manutenção
- AlertBar com Tag "alert":
  - Título: "Sistema temporariamente indisponível"
  - Mensagem: "Estamos realizando manutenção. Tente novamente em alguns minutos."
- Previsão de retorno (se disponível)
- Button: "Voltar ao início" (primary)

---

## 🔄 TELAS AUXILIARES

### **Tela 20: Modal - Confirmar Cancelamento** ⚠️ PRECISA CRIAR
**Arquivo:** `PixModalConfirmCancel.tsx`
**Estado:** NÃO IMPLEMENTADA
**Elementos:**
- Modal overlay escuro
- Card modal:
  - Ícone de alerta
  - Título: "Cancelar transferência?"
  - Mensagem: "Os dados informados serão perdidos. Deseja realmente cancelar?"
- Buttons: "Não, continuar" (secondary) + "Sim, cancelar" (danger/primary)

---

## 📋 RESUMO DE IMPLEMENTAÇÃO

**✅ Implementadas:** 2 telas
- PixScreen01SelectKeyType
- PixScreen02EnterKey

**⚠️ Faltam:** 18 telas
- 6 telas do fluxo principal
- 11 telas de cenários de erro
- 1 modal auxiliar

---

## 🎨 COMPONENTES DO DESIGN SYSTEM NECESSÁRIOS

**✅ Implementados:**
- Button (primary, secondary, ghost) com animações
- Tag (5 variantes)
- AlertBar (5 variantes)

**⚠️ Podem ser necessários:**
- Modal/Dialog
- Spinner/Loading
- Checkbox
- Input (com estados de erro)
- Toast notifications

---

## 📐 PADRÕES DE LAYOUT

**Grid System:**
- Width: 1440px
- Padding lateral: 56px
- Container: 1328px
- Cards principais: 878px (8 colunas de 12)
- Gutter: 24px

**Stepper:**
- 4 steps (Tipo de chave → Informar chave → Valor → Confirmar)
- Indica progresso visual
- Desaparece nas telas de sucesso/erro finais

**Espaçamentos:**
- 4, 8, 12, 16, 20, 24, 32, 40px

**Cores:**
- Primary: #1D3F80
- Secondary: #FF8200
- Text Black: #00081e
- Text Gray: #6B7280
- Background: #F0F2F6

---

## ✅ CHECKLIST DE CRIAÇÃO

Para cada tela, garantir:
- [ ] Uso do componente Button do DS
- [ ] Uso do componente Tag do DS (quando aplicável)
- [ ] Uso do componente AlertBar do DS (quando aplicável)
- [ ] Grid de 12 colunas respeitado
- [ ] Tipografia Inter exclusiva
- [ ] Stepper correto (quando aplicável)
- [ ] Estados de loading (quando aplicável)
- [ ] Animações suaves (transitions)
- [ ] Acessibilidade (aria-labels, focus states)
- [ ] Responsividade (dentro do contexto desktop B2B)
