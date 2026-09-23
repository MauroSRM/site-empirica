# HB Digital — Design System & Fluxo PIX
**Grupo SRM · Internet Banking B2B**
Versão de referência para a equipe de desenvolvimento — gerado em 28/04/2026

---

## Índice

1. [Design System [HBDigital]](#1-design-system-hbdigital)
   - 1.1 Identidade
   - 1.2 Cores
   - 1.3 Tipografia
   - 1.4 Espaçamento & Grid
   - 1.5 Border Radius
   - 1.6 Componente: Button
   - 1.7 Componente: Tag
   - 1.8 Componente: Input
   - 1.9 Componente: AlertBar
   - 1.10 Componente: AlertCard
   - 1.11 Componente: ProgressBar
   - 1.12 Componente: CardButton
   - 1.13 Componente: TransactionListItem
   - 1.14 Componente: ReceivableAlertCard
2. [Fluxo PIX](#2-fluxo-pix)
   - 2.1 Inventário de telas
   - 2.2 Layout base (BankingLayout + Stepper)
   - 2.3 Fluxo Principal (8 telas)
   - 2.4 Erros — Chave PIX (3 telas)
   - 2.5 Erros — Valor (3 telas)
   - 2.6 Erros — Autenticação (2 telas)
   - 2.7 Erros — Sistema (3 telas)
   - 2.8 Modal de Cancelamento (1 tela)
3. [Regras de implementação](#3-regras-de-implementação)

---

## 1. Design System [HBDigital]

### 1.1 Identidade

| Atributo         | Valor                                                                 |
|------------------|-----------------------------------------------------------------------|
| **ID**           | `hb-digital`                                                          |
| **Nome**         | HB Digital                                                            |
| **Produto**      | Internet Banking Digital B2B — plataforma bancária corporativa SRM   |
| **Estilo**       | Profissional bancário · gradient primary · cantos arredondados · Inter 500 |
| **Tab color**    | `#1D3F80`                                                             |

---

### 1.2 Cores

#### Paleta de Marca

| Nome        | Token            | Hex       | Uso principal                          |
|-------------|------------------|-----------|----------------------------------------|
| Primary     | `brand.primary`  | `#1D3F80` | Cor de identidade, links, ações principais |
| Dark        | `brand.dark`     | `#00081e` | Textos primários, fundo header          |
| Secondary   | `brand.secondary`| `#FF8200` | CTAs de destaque, alertas de ação       |
| Light       | `brand.light`    | `#F0F2F6` | Fundos de card, ícones de seleção       |
| Accent      | `brand.accent`   | `#2563EB` | Links, estados de foco, gradiente       |

#### Cores Semânticas

| Status   | Main      | Background | Texto      | Uso                                    |
|----------|-----------|------------|------------|----------------------------------------|
| Success  | `#10B981` | `#D1FAE5`  | `#065F46`  | Confirmações, comprovantes, saldo      |
| Warning  | `#F0B100` | `#FEF3C7`  | `#92400E`  | Alertas de atenção, prazos próximos    |
| Error    | `#D30000` | `#FEF2F2`  | `#991B1B`  | Falhas, erros de validação, bloqueios  |
| Info     | `#1D3F80` | `#DBEAFE`  | `#1E3A8A`  | Informações neutras, dicas             |

#### Escala de Cinzas

| Token      | Hex       | Uso principal                          |
|------------|-----------|----------------------------------------|
| `gray.50`  | `#F9FAFB` | Fundo de página, fundos de seção       |
| `gray.100` | `#F0F2F6` | Fundo de card, ícones                  |
| `gray.200` | `#E5E7EB` | Bordas padrão, divisores               |
| `gray.300` | `#D1D5DB` | Bordas desabilitadas                   |
| `gray.400` | `#9CA3AF` | Ícones inativos                        |
| `gray.500` | `#6B7280` | Texto secundário, labels               |
| `gray.700` | `#374151` | Texto de suporte                       |
| `gray.900` | `#101828` | Texto de maior peso (quase preto)      |
| `gray.950` | `#00081e` | Texto primário (=`brand.dark`)         |

---

### 1.3 Tipografia

| Atributo         | Valor                               |
|------------------|-------------------------------------|
| **Família**      | Inter                               |
| **CSS**          | `'Inter', system-ui, sans-serif`    |
| **Pesos usados** | 400 Regular · 500 Medium · 600 Semibold · 700 Bold |
| **Letter spacing padrão (botão)** | `-0.22px`            |
| **Letter spacing apertado**       | `-0.4px` (títulos de tela) |
| **Letter spacing mais apertado**  | `-0.6px` (valores monetários grandes) |

#### Escala tipográfica em uso nas telas PIX

| Função                  | `font-size` | `font-weight` | `color`     |
|-------------------------|-------------|---------------|-------------|
| Título de tela          | `24px`      | `600`         | `#00081e`   |
| Subtítulo / descrição   | `14px`      | `400`         | `#6B7280`   |
| Label de campo          | `12px`      | `600`         | `#111827`   |
| Valor monetário grande  | `48px`      | `700`         | `#00081e`   |
| Valor em lista          | `13px`      | `500`         | `#6B7280`   |
| Caption / helper text   | `11px`      | `400`         | `#6B7280`   |
| Tag uppercase label     | `10px`      | `700`         | (varia)     |
| Subtítulo de card (seleção) | `16px`  | `600`         | `#00081e`   |
| Descrição de card       | `12px`      | `400`         | `#6B7280`   |

---

### 1.4 Espaçamento & Grid

> Todos os espaçamentos são múltiplos de **4px**.

| Token         | Valor | Uso típico                                       |
|---------------|-------|--------------------------------------------------|
| `space.1`     | 4px   | Gap mínimo entre ícone e label                   |
| `space.2`     | 8px   | Gap entre título e parágrafo                     |
| `space.3`     | 12px  | Gap interno de card                              |
| `space.4`     | 16px  | Gap entre itens de lista, padding de linha       |
| `space.5`     | 20px  | Padding de card compacto                         |
| `space.6`     | 24px  | Margem lateral padrão, gap de ações              |
| `space.8`     | 32px  | Padding interno de card principal                |
| `space.10`    | 40px  | Padding de card largo (telas PIX)                |
| `space.12`    | 48px  | Valor monetário `margin-top`                     |

#### Layout de tela

| Breakpoint   | Comportamento                           |
|--------------|-----------------------------------------|
| Mobile       | `width: 100%`, padding `0 16px`         |
| Tablet       | `max-width: 720px`, centralizado        |
| Desktop      | `max-width: 720px` no modo `narrow`     |

---

### 1.5 Border Radius

| Contexto                    | Valor   |
|-----------------------------|---------|
| Botões, Tags, Inputs        | `6px`   |
| AlertBar, AlertCard         | `10px`  |
| CardButton (atalho rápido)  | `24px`  |
| Card principal de tela PIX  | `24px`  |
| Card de seleção (Key Types) | `24px`  |
| Card de seção interna       | `10px`  |
| Ícone circular              | `50%`   |
| Pill / track de progress    | `9999px`|

> **Atenção:** O DS SRM v9.3 usa `3px` globalmente para o site. O HBDigital é um produto separado e usa `6px` como base para todos os componentes interativos.

---

### 1.6 Componente: Button

#### Variantes

| Variante    | Background                                                    | Hover                                                          | Cor do texto | Borda                      |
|-------------|---------------------------------------------------------------|----------------------------------------------------------------|--------------|----------------------------|
| `primary`   | `linear-gradient(90deg, #0F2256 0%, #0E4099 100%)`            | `linear-gradient(90deg, #2D448C 0%, #1054CD 100%)` (slide ←→) | `#F0F2F6`    | nenhuma                    |
| `secondary` | `transparent`                                                 | `rgba(16, 65, 183, 0.08)` (elipse do centro)                  | `#1041B7`    | `2px solid #1041B7`        |
| `ghost`     | `transparent`                                                 | `rgba(16, 65, 183, 0.06)` (fade)                              | `#1041B7`    | nenhuma                    |
| `disabled`  | `#D7E0EB`                                                     | —                                                             | `#90A5BA`    | `2px solid #D7E0EB`        |

#### Tamanhos

| Size | Height | Padding X | Font Size | Gap  | Ícone |
|------|--------|-----------|-----------|------|-------|
| `sm` | 32px   | 12px      | 11px      | 6px  | 16px  |
| `md` | 40px   | 16px      | 13px      | 8px  | 20px  |
| `lg` | 48px   | 24px      | 14px      | 8px  | 22px  |

#### Estados

| Estado    | Detalhe                                              |
|-----------|------------------------------------------------------|
| `default` | Background estático                                  |
| `hover`   | Overlay animado (ver variante)                       |
| `pressed` | Mesmo visual do hover + focus ring                   |
| `focus`   | `outline: 4px solid #96C2FF` (externo ao botão)      |
| `loading` | Spinner `border: 2px solid currentColor`, `borderTopColor: transparent`, rotação `0.8s linear` |
| `disabled`| `cursor: not-allowed`, sem hover, sem focus ring     |

#### Animação de hover

- **Primary:** slide da esquerda para a direita (`translateX(-100% → 0`)
- **Secondary:** elipse cresce a partir do centro (`0% → 400%`, `border-radius: 50%`)
- **Ghost:** fade simples (opacity do overlay)

---

### 1.7 Componente: Tag

| Variante  | Background  | Cor do texto | Uso                            |
|-----------|-------------|--------------|--------------------------------|
| `success` | `#D1FAE5`   | `#065F46`    | Transferência confirmada       |
| `warning` | `#FEF3C7`   | `#92400E`    | Vence hoje, vence em breve     |
| `error`   | `#FEE2E2`   | `#991B1B`    | Vencido, bloqueado             |
| `info`    | `#DBEAFE`   | `#1E3A8A`    | Informativo                    |
| `neutral` | `#F0F2F6`   | `#374151`    | Pendente, status genérico      |

| Atributo        | Valor   |
|-----------------|---------|
| `border-radius` | `6px`   |
| `font-weight`   | `600`   |
| `letter-spacing`| `0px`   |
| Padding `sm`    | `3px 8px`, `font-size: 10px`  |
| Padding `md`    | `5px 12px`, `font-size: 12px` |

---

### 1.8 Componente: Input

#### Estados de borda

| Estado     | Border                    |
|------------|---------------------------|
| `default`  | `2px solid #E5E7EB`       |
| `hover`    | `2px solid #1041B7`       |
| `focus`    | `2px solid #1053CB`       |
| `error`    | `2px solid #DC2626`       |
| `disabled` | `2px solid #D7E0EB`       |

| Atributo             | Valor                          |
|----------------------|--------------------------------|
| Focus ring           | `4px solid #96C2FF`            |
| Background default   | `#FFFFFF`                      |
| Background disabled  | `#F9FAFB`                      |
| `border-radius`      | `6px`                          |
| `font-weight`        | `500`                          |

#### Tamanhos

| Size     | Height | Font Size | Padding X (sem ícone) | Padding X (com ícone) |
|----------|--------|-----------|-----------------------|-----------------------|
| `normal` | 48px   | 14px      | 16px                  | 44px                  |
| `medium` | 40px   | 13px      | 12px                  | 36px                  |
| `small`  | 32px   | 11px      | 12px                  | 36px                  |

- Texto de label: `font-size: 12px`, `font-weight: 600`, `margin-bottom: 6px`
- Helper/error text: `font-size: 11px`, `margin-top: 5px`
- Cor do ícone em erro: `#DC2626`

---

### 1.9 Componente: AlertBar

Barra horizontal com acento colorido lateral (4px), título, subtítulo opcional e valor opcional à direita.

| Variante  | Background  | Accent (barra lateral) | Uso                          |
|-----------|-------------|------------------------|------------------------------|
| `default` | `#F9FAFB`   | `#99A1AF`              | Genérico / neutro            |
| `neutral` | `#EFF6FF`   | `#0048EF`              | Informativo azul             |
| `alert`   | `#FEFCE8`   | `#F0B100`              | Atenção / aviso              |
| `danger`  | `#FEF2F2`   | `#D30000`              | Perigo / erro                |
| `success` | `#F0FDF4`   | `#00842A`              | Confirmação                  |

| Atributo        | Valor   |
|-----------------|---------|
| `border-radius` | `10px`  |
| `border`        | `1px solid #E5E7EB` |
| `padding`       | `12px 16px`         |
| Título          | `font-size: 12px`, `font-weight: 600`, `color: #101828` |
| Subtítulo       | `font-size: 12px`, `color: #6B7280`                     |
| Valor (direita) | `font-size: 14px`, `font-weight: 700`, `color: #101828` |
| Data (direita)  | `font-size: 12px`, `color: #6B7280`                     |

---

### 1.10 Componente: AlertCard

Card compacto com acento lateral (4px), título e descrição.

| Variante  | Background  | Accent  | Uso                           |
|-----------|-------------|---------|-------------------------------|
| `info`    | `#F9FAFB`   | `#6B7280`| Dicas, informações neutras   |
| `warning` | `#FEFCE8`   | `#F0B100`| Alertas de atenção           |
| `error`   | `#FEF2F2`   | `#D30000`| Erros de validação, bloqueio |

| Atributo        | Valor                              |
|-----------------|------------------------------------|
| `border-radius` | `10px`                             |
| `border`        | `1px solid #E5E7EB`                |
| `padding`       | `12px 16px`                        |
| Título          | `font-size: 12px`, `font-weight: 600`, `color: #101828` |
| Descrição       | `font-size: 12px`, `font-weight: 500`, `color: #2A2A2D` |

---

### 1.11 Componente: ProgressBar

| Atributo             | Valor                                             |
|----------------------|---------------------------------------------------|
| Fill (gradiente)     | `linear-gradient(90deg, #2B7FFF 0%, #155DFC 100%)`|
| Track background     | `#E5E7EB`                                         |
| Height               | `12px`                                            |
| Border-radius        | `9999px` (pill)                                   |
| Percentagem (cor)    | `#1447E6`, `font-size: 14px`, `font-weight: 700`  |
| Título               | `font-size: 14px`, `font-weight: 600`, `color: #2A2A2D` |
| Labels abaixo        | `font-size: 11px`, `color: #6B7280`               |

---

### 1.12 Componente: CardButton

Atalho rápido quadrado — usado no dashboard para ações como PIX, Transferência, Extrato.

| Atributo             | Valor           |
|----------------------|-----------------|
| Size                 | `130px × 130px` |
| `border-radius`      | `24px`          |
| Background default   | `#FFFFFF`       |
| Background hover     | `#F9FAFB`       |
| Border               | nenhuma         |
| Cor do ícone         | `#2A2A2D`       |
| Cor do label         | `#000000`       |
| Label                | `font-size: 13px`, `font-weight: 600`, `letter-spacing: -0.4px` |
| Hover                | `translateY(-2px)` + `box-shadow: 0 6px 16px rgba(0,0,0,0.10)` |
| Pressed              | `scale(0.96)`   |

---

### 1.13 Componente: TransactionListItem

Item de linha em lista de extrato/transações.

| Atributo         | Valor                           |
|------------------|---------------------------------|
| Padding          | `12px 16px`                     |
| Divider          | `1px solid #F0F2F6` (bottom)    |
| Cor enviado      | `#EF4444` (seta para baixo)     |
| Cor recebido     | `#10B981` (seta para cima)      |
| Label transação  | `font-size: 13px`, `font-weight: 500`, `color: #111827` |
| Valor            | `font-size: 13px`, `font-weight: 500`, `color: #6B7280` |
| Descrição        | `font-size: 11px`, `color: #6B7280`, `margin-top: 2px` |
| Ícone seta       | SVG `16×16` na cor do tipo      |
| Chevron (clicável)| `ChevronRight`, 14px, `#6B7280` |

---

### 1.14 Componente: ReceivableAlertCard

Card de alerta de recebível com tag de status.

| Variante   | Background  | Accent    | Tag Bg      | Tag Color   | Uso               |
|------------|-------------|-----------|-------------|-------------|-------------------|
| `overdue`  | `#FEF2F2`   | `#D30000` | `#FFE1E2`   | `#D30000`   | Vencido           |
| `dueToday` | `#FEFCE8`   | `#F0B100` | `#FFF9BB`   | `#B25B00`   | Vence hoje        |
| `dueSoon`  | `#FEFCE8`   | `#F0B100` | `#FFF9BB`   | `#B25B00`   | Vence em breve    |
| `pending`  | `#F9FAFB`   | `#99A1AF` | `#E7ECF2`   | `#6B7280`   | Pendente          |

| Atributo        | Valor                                             |
|-----------------|---------------------------------------------------|
| `border-radius` | `10px`                                            |
| `border`        | `1px solid #E5E7EB`                               |
| `padding`       | `12px 16px`                                       |
| Acento lateral  | `width: 4px`, `border-radius: 9999px`             |
| Título          | `font-size: 12px`, `font-weight: 600`, `color: #101828` |
| Descrição       | `font-size: 12px`, `color: #6B7280`               |
| Valor           | `font-size: 13px`, `font-weight: 700`, `color: #101828`, `letter-spacing: -0.15px` |
| Data vencimento | `font-size: 11px`, `color: #6B7280`               |
| Tag status      | `font-size: 9px`, `font-weight: 700`, `padding: 3px 8px`, `border-radius: 6px`, `letter-spacing: 0.05em` |

---

## 2. Fluxo PIX

### 2.1 Inventário de telas

| Grupo                   | ID    | Tela                     | Rota                              |
|-------------------------|-------|--------------------------|-----------------------------------|
| Fluxo Principal         | 01    | Selecionar Tipo de Chave | `/pix/select-key-type`            |
| Fluxo Principal         | 02    | Informar Chave PIX       | `/pix/enter-key`                  |
| Fluxo Principal         | 03    | Loading — Buscando       | `/pix/loading-search`             |
| Fluxo Principal         | 04    | Informar Valor           | `/pix/enter-amount`               |
| Fluxo Principal         | 05    | Revisar Transferência    | `/pix/review`                     |
| Fluxo Principal         | 06    | Autenticação (Senha)     | `/pix/authentication`             |
| Fluxo Principal         | 07    | Processando              | `/pix/processing`                 |
| Fluxo Principal         | 08    | Comprovante Sucesso      | `/pix/receipt`                    |
| Erro — Chave            | E01   | Chave Não Encontrada     | `/pix/error/key-not-found`        |
| Erro — Chave            | E02   | Chave Inválida           | `/pix/error/invalid-key`          |
| Erro — Chave            | E03   | Destinatário Bloqueado   | `/pix/error/blocked-recipient`    |
| Erro — Valor            | E04   | Valor Inválido           | `/pix/error/invalid-amount`       |
| Erro — Valor            | E05   | Saldo Insuficiente       | `/pix/error/insufficient-balance` |
| Erro — Valor            | E06   | Limite Excedido          | `/pix/error/limit-exceeded`       |
| Erro — Autenticação     | E07   | Senha Incorreta          | `/pix/error/wrong-password`       |
| Erro — Autenticação     | E08   | Conta Bloqueada          | `/pix/error/account-blocked`      |
| Erro — Sistema          | E09   | Falha no Processamento   | `/pix/error/processing-failed`    |
| Erro — Sistema          | E10   | Timeout                  | `/pix/error/timeout`              |
| Erro — Sistema          | E11   | Sistema Indisponível     | `/pix/error/system-down`          |
| Modal                   | M01   | Confirmar Cancelamento   | `/pix/modal/confirm-cancel`       |

**Total: 20 telas** (8 fluxo principal + 11 erros + 1 modal)

---

### 2.2 Layout Base

#### BankingLayout

Todas as telas do fluxo PIX são envolvidas por `BankingLayout`.

| Atributo          | Valor                                                         |
|-------------------|---------------------------------------------------------------|
| Fundo de página   | `#F9FAFB` (`gray.50`)                                         |
| Modo `narrow`     | `max-width: 720px`, centralizado com `margin: 0 auto`         |
| Padding top       | Variável por tela (geralmente `40px`)                         |
| Margem lateral    | `24px` (mobile), `auto` (desktop centralizado)                |

#### Stepper

Indicador de progresso no topo de todas as telas do fluxo principal.

```
Steps: [ "Tipo de chave" · "Informar chave" · "Valor" · "Confirmar" ]
```

| Tela                      | `currentStep` |
|---------------------------|---------------|
| 01 · Selecionar Tipo      | `1`           |
| 02 · Informar Chave       | `2`           |
| 04 · Informar Valor       | `3`           |
| 05 · Revisar              | `4`           |
| 06 · Autenticação         | `4`           |

#### Card principal de cada tela

```
background:    #FFFFFF
border:        1px solid #E5E7EB
border-radius: 24px
padding:       40px
```

#### Padrão de ações (rodapé do card)

```
display:         flex
gap:             12px
justify-content: flex-end
```

Ordem padrão: `[Ação secundária / Voltar]  [Ação primária]`

---

### 2.3 Fluxo Principal

---

#### Tela 01 — Selecionar Tipo de Chave
**Rota:** `/pix/select-key-type`
**Stepper:** step 1/4

**Conteúdo do card:**
- Título: `"Como você quer fazer a transferência?"` — `24px / 600 / #00081e / letter-spacing: -0.4px`
- Parágrafo: `"Escolha o tipo de chave PIX que você deseja usar"` — `14px / 400 / #6B7280`
- Grid de seleção: `3 colunas`, `gap: 16px`, `margin-bottom: 32px`

**Cards de seleção de tipo de chave (6 opções):**

| ID            | Ícone (lucide) | Título             | Descrição          |
|---------------|----------------|--------------------|--------------------|
| `cpf-cnpj`    | `FileText`     | Chave CPF          | Usar documento     |
| `email`       | `Mail`         | Chave E-mail       | Usar e-mail        |
| `phone`       | `Phone`        | Chave Telefone     | Usar telefone      |
| `random`      | `Key`          | Chave Aleatória    | Código automático  |
| `copy-paste`  | `Copy`         | PIX Copia e Cola   | Código copiado     |
| `qr-code`     | `QrCode`       | Ler QR Code        | Escanear código    |

**Estilo do card de seleção:**
```
padding:         24px 20px
background:      #FFFFFF
border:          2px solid #E5E7EB
border-radius:   24px

→ hover:
  border-color:  #1D3F80
  transform:     translateY(-2px)
  box-shadow:    0 4px 12px rgba(29, 63, 128, 0.15)
```

**Ícone container:**
```
width / height:  48px
border-radius:   50%
background:      #F0F2F6
cor do ícone:    #1D3F80  (tamanho: 24px)
margin-bottom:   12px
```

**Título do card:** `16px / 600 / #00081e / margin-bottom: 4px`
**Descrição do card:** `12px / 400 / #6B7280`

**Ações:**
- `[Cancelar]` — Button `ghost md` → navega para `/`
- `[Continuar]` — Button `primary md` — habilitado somente quando um tipo está selecionado

**Info Card abaixo do card principal:**
```
padding:       20px 24px
background:    #F9FAFB
border:        1px solid #E5E7EB
border-radius: 10px
margin-top:    24px
font-size:     13px / color: #6B7280
```

---

#### Tela 02 — Informar Chave PIX
**Rota:** `/pix/enter-key`
**Stepper:** step 2/4
**State recebido:** `keyType` (string)

**Tipos de chave e seus comportamentos:**

| `keyType`   | Label          | Placeholder              | Formatação          |
|-------------|----------------|--------------------------|---------------------|
| `cpf-cnpj`  | CPF / CNPJ     | Digite o CPF ou CNPJ     | Máscara CPF/CNPJ    |
| `email`     | E-mail         | Digite o e-mail          | Livre               |
| `phone`     | Celular        | Digite o telefone        | `(XX) XXXXX-XXXX`   |
| `random`    | Chave Aleatória| Digite a chave aleatória | Livre               |

**Componentes:**
- `Input` size `normal` com label e placeholder dinâmicos
- `margin-bottom: 32px` no wrapper do input

**Ações:**
- `[Voltar]` — Button `secondary md` → `/pix/select-key-type`
- `[Continuar]` — Button `primary md` — `disabled` quando `keyValue.length === 0`; em loading durante busca

**Após continuar:** navega para `/pix/loading-search` passando `{ keyType, keyValue, recipientData }`

**AlertCard abaixo (variant `info`):**
- Título: `"Atenção"`
- Descrição: `"Confira se os dados do destinatário estão corretos antes de continuar. Transferências PIX são instantâneas e irreversíveis."`

---

#### Tela 03 — Loading: Buscando
**Rota:** `/pix/loading-search`
**State recebido:** `{ keyType, keyValue, recipientData }`

Tela de transição com animação de busca. Após completar, navega automaticamente para `/pix/enter-amount`.

**Layout:**
- Centralizado vertical e horizontal
- Spinner de carregamento (estilo `brand.primary`)
- Texto: `"Buscando destinatário..."` — `14px / 500 / #6B7280`

---

#### Tela 04 — Informar Valor
**Rota:** `/pix/enter-amount`
**Stepper:** step 3/4
**State recebido:** `{ keyType, keyValue, recipientData }`

**Resumo do destinatário encontrado** (topo do card):
```
background:    #F9FAFB
border-radius: 10px
padding:       16px
margin-bottom: 32px
```
- Nome: `14px / 600 / #00081e`
- Banco: `12px / 400 / #6B7280`

**Input de valor:**
- Campo de moeda em BRL — formatação automática em centavos
- Valor exibido com prefixo `R$`
- `font-size: 32px`, `font-weight: 700`, centralizado
- Teclado numérico ou input nativo

**Campo opcional de descrição:**
- `Input` size `normal`, label `"Descrição (opcional)"`, `max: 100 chars`

**Ações:**
- `[Voltar]` — Button `ghost md`
- `[Continuar]` — Button `primary md` — `disabled` quando valor = 0

**Após continuar:** navega para `/pix/review` com `{ keyType, keyValue, recipientData, amount, description }`

---

#### Tela 05 — Revisar Transferência
**Rota:** `/pix/review`
**Stepper:** step 4/4
**State recebido:** `{ keyType, keyValue, recipientData, amount, description }`

**Display do valor:**
```
padding:       32px
background:    #F9FAFB
border-radius: 10px
text-align:    center
margin-bottom: 32px
```
- Label: `"Valor da transferência"` — `13px / 600 / #6B7280 / uppercase / letter-spacing: 0.5px`
- Valor: `R$ X.XXX,XX` — `48px / 700 / #00081e / letter-spacing: -0.6px`

**Tabela de detalhes** (lista de linhas com `border-bottom: 1px solid #F0F2F6`):

| Campo         | Valor (fonte de dados)     |
|---------------|----------------------------|
| Destinatário  | `recipientData.name`       |
| Instituição   | `recipientData.bank`       |
| Tipo de chave | Label do `keyType`         |
| Chave PIX     | `keyValue`                 |
| Descrição     | `description` (se existir) |

Estilo das linhas:
- Label: `13px / 400 / #6B7280`
- Valor: `14px / 500 / #00081e`
- `padding-bottom: 16px`, `gap: 16px` entre linhas

**Ações:**
- `[Voltar]` — Button `ghost md`
- `[Confirmar transferência]` — Button `primary md` → navega para `/pix/processing`

**AlertCard abaixo (variant `warning`):**
- Título: `"Atenção"`
- Descrição: `"Não compartilhe sua senha com ninguém. O HB Digital nunca solicitará sua senha por telefone, e-mail ou mensagem."`

---

#### Tela 06 — Autenticação (Senha)
**Rota:** `/pix/authentication`
**Stepper:** step 4/4
**State recebido:** `{ recipientData, amount, keyType, keyValue }`

**Conteúdo:**
- Ícone de cadeado (`Lock`, 32px, `#1D3F80`) centralizado no topo
- Título: `"Confirme sua senha"` — `24px / 600 / #00081e`
- Subtítulo: `"Digite sua senha para autorizar a transferência"` — `14px / 400 / #6B7280`
- Input de senha com toggle `Eye / EyeOff`
- `type="password"` ou `type="text"` conforme toggle

**Ações:**
- `[Cancelar]` — Button `ghost md`
- `[Autorizar transferência]` — Button `primary md` — `disabled` quando senha vazia

**Após confirmar:** aguarda 1s (mock) → navega para `/pix/processing`

---

#### Tela 07 — Processando
**Rota:** `/pix/processing`
**State recebido:** dados da transferência

Tela de transição. Spinner centralizado com texto `"Processando sua transferência..."`.

Após 2-3s (mock): navega automaticamente para `/pix/receipt` passando `{ ...dadosTransferência, transactionId, date }`.

---

#### Tela 08 — Comprovante de Sucesso
**Rota:** `/pix/receipt`
**State recebido:** `{ amount, recipientData, transactionId, keyType, keyValue, description, date }`

**Ícone de sucesso:**
- `CheckCircle` (Lucide), tamanho 64px, cor `#10B981`
- Centralizado com `margin-bottom: 16px`

**Título:** `"Transferência realizada!"` — `24px / 700 / #00081e`

**Valor:** `R$ X.XXX,XX` — `48px / 700 / #00081e / letter-spacing: -0.6px`

**Tabela de detalhes do comprovante:**

| Campo            | Fonte de dados           |
|------------------|--------------------------|
| Destinatário     | `recipientData.name`     |
| CPF/CNPJ         | `recipientData.document` |
| Banco            | `recipientData.bank`     |
| Chave PIX        | `keyValue`               |
| ID da transação  | `transactionId`          |
| Data / Hora      | `date` (formato pt-BR)   |
| Descrição        | `description` (opcional) |

**Ações:**
- `[Copiar ID]` com ícone `Copy` / `Check` (toggle após copiar) — Button `secondary md`
- `[Baixar comprovante]` com ícone `Download` — Button `secondary md`
- `[Nova transferência]` — Button `primary md` → `/pix/select-key-type`
- `[Ir para o Dashboard]` — Button `ghost md` → `/`

---

### 2.4 Erros — Chave PIX

> Padrão visual de todas as telas de erro de chave:
> - Ícone de erro centralizado (variant `error`)
> - Stepper permanece visível na posição da etapa onde o erro ocorreu (step 2)
> - AlertCard `error` com descrição do problema
> - Ação primária: tentar novamente
> - Ação secundária: voltar para selecionar outro tipo de chave

---

#### E01 — Chave Não Encontrada
**Rota:** `/pix/error/key-not-found`
**State recebido:** `{ keyType, keyValue }`

- AlertCard `error`: `"Nenhuma conta encontrada para essa chave PIX. Verifique os dados e tente novamente."`
- Input pré-preenchido com a chave digitada, editável
- `[Tentar novamente]` — Button `primary md` → `/pix/enter-key` com a nova chave
- `[Usar outro tipo de chave]` — Button `secondary md` → `/pix/select-key-type`

---

#### E02 — Chave Inválida
**Rota:** `/pix/error/invalid-key`
**State recebido:** `{ keyType, keyValue }`

- AlertCard `error`: `"O formato da chave PIX é inválido. Verifique e tente novamente."`
- Input em estado de erro (`border: 2px solid #DC2626`)
- `[Corrigir chave]` — Button `primary md` → `/pix/enter-key`
- `[Cancelar]` — Button `ghost md` → `/`

---

#### E03 — Destinatário Bloqueado
**Rota:** `/pix/error/blocked-recipient`
**State recebido:** `{ keyType, keyValue, recipientData }`

- AlertCard `error`: `"Esta conta está temporariamente bloqueada para recebimento de PIX."`
- Nome do destinatário exibido no card
- `[Tentar outra chave]` — Button `primary md` → `/pix/select-key-type`
- `[Cancelar]` — Button `ghost md` → `/`

---

### 2.5 Erros — Valor

> Padrão: AlertCard `error` ou `warning` conforme criticidade. Stepper em step 3.

---

#### E04 — Valor Inválido
**Rota:** `/pix/error/invalid-amount`

- AlertCard `error`: `"O valor informado não é válido. O valor mínimo para PIX é R$ 0,01."`
- `[Corrigir valor]` → `/pix/enter-amount`
- `[Cancelar]` → `/`

---

#### E05 — Saldo Insuficiente
**Rota:** `/pix/error/insufficient-balance`

- AlertCard `error`: `"Saldo insuficiente para realizar esta transferência."`
- Exibe: saldo disponível vs. valor solicitado
- `[Alterar valor]` → `/pix/enter-amount`
- `[Cancelar]` → `/`

---

#### E06 — Limite Excedido
**Rota:** `/pix/error/limit-exceeded`

- AlertCard `warning`: `"O valor excede o limite diário de transferência PIX configurado para sua conta."`
- Exibe: limite disponível vs. valor solicitado
- `[Alterar valor]` → `/pix/enter-amount`
- `[Cancelar]` → `/`

---

### 2.6 Erros — Autenticação

> Stepper em step 4. Erro crítico — não permite edição, apenas reiniciar o fluxo.

---

#### E07 — Senha Incorreta
**Rota:** `/pix/error/wrong-password`

- AlertCard `error`: `"Senha incorreta. Você tem X tentativas restantes antes do bloqueio da conta."`
- `[Tentar novamente]` → `/pix/authentication`
- `[Cancelar]` → `/`

---

#### E08 — Conta Bloqueada
**Rota:** `/pix/error/account-blocked`

- AlertCard `error`: `"Sua conta foi bloqueada por excesso de tentativas incorretas. Entre em contato com o suporte."`
- Sem ação de retry
- `[Falar com suporte]` — Button `primary md` (link externo ou modal)
- `[Voltar ao Dashboard]` — Button `ghost md` → `/`

---

### 2.7 Erros — Sistema

> Sem Stepper. Layout simplificado centrado na mensagem de erro. Fundo `#F9FAFB`.

---

#### E09 — Falha no Processamento
**Rota:** `/pix/error/processing-failed`

- AlertCard `error`: `"Ocorreu um erro ao processar sua transferência. O valor NÃO foi debitado da sua conta."`
- `[Tentar novamente]` → `/pix/review`
- `[Cancelar]` → `/`

---

#### E10 — Timeout
**Rota:** `/pix/error/timeout`

- AlertCard `warning`: `"A conexão expirou. Verifique sua internet e tente novamente."`
- `[Tentar novamente]` → volta à etapa anterior
- `[Cancelar]` → `/`

---

#### E11 — Sistema Indisponível
**Rota:** `/pix/error/system-down`

- AlertCard `warning`: `"O sistema PIX está temporariamente indisponível. Tente novamente em alguns minutos."`
- Ícone de manutenção (ilustração)
- `[Tentar novamente]` — Button `primary md`
- `[Voltar ao Dashboard]` — Button `ghost md` → `/`

---

### 2.8 Modal de Cancelamento

#### M01 — Confirmar Cancelamento
**Rota:** `/pix/modal/confirm-cancel`

Modal sobreposto à tela atual (overlay escuro `rgba(0,0,0,0.5)`).

**Card do modal:**
```
background:    #FFFFFF
border-radius: 24px
padding:       40px
max-width:     480px
```

- Título: `"Cancelar transferência?"` — `24px / 600 / #00081e`
- Descrição: `"Todos os dados preenchidos serão perdidos."` — `14px / 400 / #6B7280`
- AlertCard `warning`: aviso adicional

**Ações:**
- `[Continuar transferência]` — Button `primary md` → fecha modal, retorna ao fluxo
- `[Sim, cancelar]` — Button `secondary md` → `/`

---

## 3. Regras de Implementação

### 3.1 Estilização

> ⚠️ **Zero Tailwind CSS.** Todos os componentes devem usar **inline styles** (CSS-in-JS ou `style={{}}`). Esta regra é inegociável para o produto HBDigital.

### 3.2 Tokens — Não Hardcode

Use os tokens definidos na seção 1.2 para **toda** cor aplicada. Não escreva valores hexadecimais soltos no código sem associá-los ao token correspondente. Exemplo:

```tsx
// ✅ Correto — token nomeado no comentário
style={{ color: '#00081e' }} // brand.dark / text-primary

// ❌ Errado — sem referência ao token
style={{ color: '#00081e' }}
```

### 3.3 Espaçamento

Todos os `margin`, `padding`, `gap` devem ser múltiplos de **4px**. Nunca usar valores ímpares como `3px`, `5px`, `7px` fora de border (`1px`/`2px`) e letter-spacing.

### 3.4 Navigation State

O fluxo PIX usa **React Router `location.state`** para passar dados entre telas. Cada tela deve:

1. Ler o state via `useLocation()`
2. Ter **mock data de fallback** para acesso direto pela URL (facilita QA)
3. **Não redirecionar** automaticamente quando o state estiver vazio — exibir com mock data

### 3.5 Navegação de Erro

Todo erro deve oferecer **pelo menos dois caminhos de saída**:
1. Tentar novamente / corrigir (quando aplicável)
2. Cancelar / voltar ao dashboard

Nunca deixar o usuário preso em uma tela de erro sem ação.

### 3.6 Acessibilidade mínima

- Todos os `<button>` sem texto visível devem ter `aria-label`
- Inputs devem ter `<label>` associado (via `htmlFor` ou `label` prop)
- Estados de foco devem ser visíveis: `outline: 4px solid #96C2FF` (Button), `outline: 4px solid #96c2ff` (Input)
- Não remover `outline` sem substituir por alternativa visível

### 3.7 Componentes do Design System a consumir

```
/design-system/components/Button      → todas as ações de navegação
/design-system/components/Input       → todos os campos de texto
/design-system/components/AlertCard   → todos os alertas de tela
/design-system/components/Stepper     → indicador de progresso
/src/app/components/BankingLayout     → wrapper de todas as telas
```

---

*Documento gerado a partir do código-fonte em `/src/app/pages/pix/` e `/src/app/pages/design-system/themes/hb-digital.ts` — Grupo SRM · HB Digital B2B*
