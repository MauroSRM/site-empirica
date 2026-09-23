# Etapa 1 de 5 — Setup: Copiar e configurar os arquivos template

Esta é a primeira etapa da implementação do sistema de auth. Não escreva nenhum código de UI ainda — apenas copie os arquivos e ajuste as constantes.

---

## O que fazer nesta etapa

### 1. Copiar o arquivo de backend

Copie o conteúdo do arquivo `src/auth-template/srm-auth-backend.tsx` para dentro do diretório do servidor Hono:

- Destino: `supabase/functions/server/srm-auth-backend.tsx`

Após copiar, abra o arquivo e altere **somente** as duas constantes no topo:

```ts
const MASTER_ADMIN_EMAIL = "SEU-EMAIL-ADMIN@dominio.com"; // e-mail do usuário que será admin master
const ROUTE_PREFIX       = "/make-server-XXXXXXXX";       // prefixo correto deste projeto (veja em supabase/functions/server/index.tsx)
```

> O `ROUTE_PREFIX` é o prefixo que aparece em todas as rotas já existentes no servidor, ex: `/make-server-57709921`.

---

### 2. Copiar o arquivo de frontend

Copie o conteúdo do arquivo `src/auth-template/srm-auth-frontend.tsx` para dentro do projeto React:

- Destino: `src/app/srm-auth-frontend.tsx`

Após copiar, abra o arquivo e altere **somente** as constantes no topo:

```ts
const API_BASE          = "https://SEU-PROJECT-ID.supabase.co/functions/v1/make-server-XXXXXXXX";
const SUPABASE_URL      = "https://SEU-PROJECT-ID.supabase.co";
const SUPABASE_ANON_KEY = "SUA-ANON-KEY";
const STORAGE_KEY       = "cmsSession"; // chave no localStorage — ajuste se o CMS já usa outra chave
```

> Para obter `projectId` e `publicAnonKey`, importe de `/utils/supabase/info` se disponível, ou use os valores literais do projeto.

---

## Checklist desta etapa

- [ ] `supabase/functions/server/srm-auth-backend.tsx` criado com `MASTER_ADMIN_EMAIL` e `ROUTE_PREFIX` corretos
- [ ] `src/app/srm-auth-frontend.tsx` criado com `API_BASE`, `SUPABASE_URL` e `SUPABASE_ANON_KEY` corretos

---

**Próxima etapa:** ETAPA-2-backend-rotas.md — Registrar as rotas no servidor Hono.
