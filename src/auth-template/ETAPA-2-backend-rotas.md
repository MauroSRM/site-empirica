# Etapa 2 de 5 — Backend: Registrar rotas de auth no servidor Hono

Pré-requisito: a Etapa 1 foi concluída e `supabase/functions/server/srm-auth-backend.tsx` já existe com as constantes corretas.

---

## O que fazer nesta etapa

### 1. Abrir o servidor principal

Abra `supabase/functions/server/index.tsx`.

### 2. Importar e registrar as rotas

Logo após as importações existentes, adicione:

```ts
import { registerAuthRoutes } from "./srm-auth-backend.tsx";
```

Logo após a criação do `app` (linha com `new Hono()` ou similar), antes das rotas existentes, adicione:

```ts
registerAuthRoutes(app);
```

Exemplo de como deve ficar:

```ts
const app = new Hono();
app.use('*', cors({ ... }));
app.use('*', logger(console.log));

registerAuthRoutes(app); // ← adicionar aqui

// ... rotas existentes do CMS ...
```

---

## Rotas que serão criadas automaticamente

| Método | Rota | Acesso | O que faz |
|---|---|---|---|
| `POST` | `{ROUTE_PREFIX}/auth/login` | Público | Login + stamp automático de role admin no master |
| `POST` | `{ROUTE_PREFIX}/auth/invite` | Admin | Cria usuário convidado com senha temporária |
| `POST` | `{ROUTE_PREFIX}/auth/change-password` | Autenticado | Troca de senha (primeiro acesso) |
| `GET` | `{ROUTE_PREFIX}/auth/users` | Admin | Lista todos os usuários |
| `PATCH` | `{ROUTE_PREFIX}/auth/users/:id/role` | Admin | Promove ou rebaixa role |
| `DELETE` | `{ROUTE_PREFIX}/auth/users/:id` | Admin | Remove acesso |

---

## Comportamento importante do login

O endpoint `POST /auth/login`:

1. Autentica normalmente com e-mail e senha
2. Se o e-mail for o `MASTER_ADMIN_EMAIL` e ainda não tiver `app_metadata.role = "admin"`, stampa a role automaticamente via `auth.admin.updateUserById`
3. Após stampar, **re-autentica** para devolver um JWT que já contém a role (sem isso, o token não reflete a mudança)
4. Retorna `mustChangePassword: true` se `user_metadata.must_change_password === true`

---

## Checklist desta etapa

- [ ] `import { registerAuthRoutes }` adicionado em `supabase/functions/server/index.tsx`
- [ ] `registerAuthRoutes(app)` chamado antes das rotas existentes
- [ ] Servidor sem erros de TypeScript

---

**Próxima etapa:** ETAPA-3-frontend-auth-flow.md — Adaptar a tela de login e implementar o fluxo de autenticação no frontend.
