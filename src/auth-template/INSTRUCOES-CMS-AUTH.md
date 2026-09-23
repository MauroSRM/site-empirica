# Instruções — Gestão de Acesso e Melhorias do CMS

Este documento instrui o Figma Make a implementar o sistema completo de autenticação, hierarquia de usuários e gestão de acesso neste CMS, replicando o padrão do CMS Empírica.

Os dois arquivos-template já existem no projeto de referência:
- `srm-auth-backend.tsx` — rotas Hono prontas para copiar
- `srm-auth-frontend.tsx` — componentes React prontos para copiar

---

## 1. Visão geral do que deve ser implementado

| Funcionalidade | Onde |
|---|---|
| Login com e-mail e senha | Tela de login (já existente — adaptar) |
| Primeiro acesso: forçar troca de senha | Frontend — componente `ForcePasswordChange` |
| Hierarquia Admin / Colaborador via `app_metadata` | Backend + Frontend |
| Convidar usuário (com opção de dar role Admin) | Página Usuários |
| Gestão de usuários: listar, promover, revogar | Página Usuários (nova aba no CMS) |
| Avatar com role visível (Administrador / Colaborador) | Header do CMS |

---

## 2. Backend — Rotas a adicionar

No arquivo do servidor Hono (`supabase/functions/server/index.tsx` ou equivalente), importe e registre as rotas do template:

```ts
import { registerAuthRoutes } from "./srm-auth-backend.tsx";
registerAuthRoutes(app);
```

Antes de registrar, abra `srm-auth-backend.tsx` e altere as duas constantes no topo:

```ts
const MASTER_ADMIN_EMAIL = "SEU-EMAIL-ADMIN@dominio.com"; // e-mail do admin master
const ROUTE_PREFIX       = "/make-server-XXXXXXXX";       // prefixo do seu projeto Supabase
```

### Rotas que serão criadas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/auth/login` | Público | Login + stamp automático de role admin no master |
| `POST` | `/auth/invite` | Admin | Cria usuário convidado com senha temporária |
| `POST` | `/auth/change-password` | Autenticado | Troca de senha (primeiro acesso) |
| `GET` | `/auth/users` | Admin | Lista todos os usuários |
| `PATCH` | `/auth/users/:id/role` | Admin | Promove ou rebaixa role |
| `DELETE` | `/auth/users/:id` | Admin | Remove acesso |

### Comportamento crítico do login

O endpoint de login faz três coisas além de autenticar:

1. Se o e-mail for o `MASTER_ADMIN_EMAIL` e ainda não tiver `app_metadata.role = "admin"`, stampa a role via `auth.admin.updateUserById`
2. Após stampar, re-autentica o usuário para devolver um JWT que já contém a role (sem isso, o token retornado não reflete a mudança)
3. Retorna `mustChangePassword: true` se `user_metadata.must_change_password === true` (usado no primeiro acesso de usuários convidados)

---

## 3. Frontend — Componentes a adicionar

Importe do arquivo `srm-auth-frontend.tsx`:

```ts
import {
  saveSession, loadSession, clearSession, getFreshToken,
  emailFromToken, isAdminFromToken, userIdFromToken,
  LoginScreen, ForcePasswordChange, InviteUserModal, UserManagementPage,
} from "./srm-auth-frontend";
```

Abra `srm-auth-frontend.tsx` e altere as constantes no topo:

```ts
const API_BASE          = "https://SEU-PROJECT-ID.supabase.co/functions/v1/make-server-XXXXXXXX";
const SUPABASE_URL      = "https://SEU-PROJECT-ID.supabase.co";
const SUPABASE_ANON_KEY = "SUA-ANON-KEY";
const STORAGE_KEY       = "cmsSession"; // chave no localStorage — mude se necessário
```

---

## 4. Fluxo de autenticação a implementar

### 4.1 Tela de login

Substitua ou adapte a tela de login atual para chamar `POST /auth/login` e tratar `mustChangePassword`:

```tsx
<LoginScreen
  onLogin={(token, refreshToken, expiresAt, mustChangePassword) => {
    if (mustChangePassword) {
      setPendingToken(token); // não salva sessão ainda
    } else {
      saveSession({ access_token: token, refresh_token: refreshToken, expires_at: expiresAt });
      navigate("/cms/dashboard");
    }
  }}
/>
```

### 4.2 Primeiro acesso — ForcePasswordChange

Se `mustChangePassword` for `true`, exiba `ForcePasswordChange` antes de liberar o CMS:

```tsx
{pendingToken ? (
  <ForcePasswordChange
    token={pendingToken}
    onDone={() => {
      saveSession({ access_token: pendingToken, ... });
      navigate("/cms/dashboard");
    }}
  />
) : (
  <LoginScreen onLogin={...} />
)}
```

### 4.3 Sessão persistente com auto-refresh

Substitua qualquer uso de `localStorage.getItem("token")` por `getFreshToken()`. Essa função:
- Retorna o token se ainda válido (>60s de vida restante)
- Renova automaticamente via refresh token se estiver expirando
- Redireciona para o login se a sessão for inválida

```ts
// Em todas as chamadas autenticadas:
const token = await getFreshToken();
```

---

## 5. Header do CMS — Avatar com role

No componente de header do CMS, substitua o avatar atual para exibir a role do usuário logado:

```tsx
const email   = emailFromToken(token);
const isAdmin = isAdminFromToken(token);
const role    = isAdmin ? "Administrador" : "Colaborador";
```

No dropdown do avatar, exiba o badge de role:

```tsx
{/* Dentro do dropdown do avatar */}
<span style={{
  padding: "2px 8px", borderRadius: 4,
  background: isAdmin ? "#eef2ff" : "#f4f6f9",
  color: isAdmin ? "#1B2C6B" : "#6B7A99",
  fontSize: 11, fontWeight: 600,
}}>
  {isAdmin && <CrownIcon size={10} />}
  {role}
</span>
```

O subtítulo do avatar (que antes mostrava o nome do sistema) deve mostrar a role dinamicamente.

---

## 6. Navegação — Aba "Usuários"

Adicione a aba "Usuários" no menu de navegação do header, visível **somente para admins**:

```tsx
{isAdmin && (
  <NavButton
    label="Usuários"
    icon={<UsersIcon size={13} />}
    active={pathname.includes("/usuarios")}
    onClick={() => navigate("/cms/usuarios")}
  />
)}
```

Registre a rota `/cms/usuarios` no router apontando para o componente `UserManagementPage` (ou `CmsUsuariosPage` se preferir criar um wrapper customizado).

**Não adicione** botão de "Convidar" no header — o convite deve estar somente dentro da página Usuários.

---

## 7. Página de Gestão de Usuários

Use o componente `UserManagementPage` do template ou crie um equivalente. A página deve:

- Listar usuários separados em dois grupos: **Administradores** e **Colaboradores**
- Exibir por usuário: avatar com iniciais, e-mail, nome, badge de role, último acesso, badge "Senha pendente" se `mustChangePassword`
- Ações por usuário (exceto o próprio usuário logado):
  - **Promover a Admin** / **Rebaixar para Colaborador** — via `PATCH /auth/users/:id/role`
  - **Remover acesso** — via `DELETE /auth/users/:id` com modal de confirmação
- Botão "Convidar" que abre o `InviteUserModal` com toggle de role Admin
- Botão "Atualizar" para recarregar a lista

O usuário logado não pode alterar a própria role nem remover a si mesmo (proteção no backend e no frontend).

---

## 8. Modal de convite

Use o componente `InviteUserModal` do template. Ele inclui:

- Campo e-mail
- Campo nome (opcional)
- Toggle "Acesso de Administrador" — se ativado, cria o usuário com `app_metadata.role = "admin"`
- Após sucesso, exibe a senha temporária gerada com botão de copiar
- Instruções ao convidado: no primeiro acesso ele será solicitado a criar uma nova senha

---

## 9. Hierarquia de roles — Resumo

```
Admin (app_metadata.role = "admin")
├── Acessa todas as seções do CMS
├── Vê aba "Usuários"
├── Pode convidar novos usuários
├── Pode dar ou revogar role Admin
└── Pode remover acesso de outros usuários

Colaborador (sem role especial)
├── Acessa todas as seções do CMS
└── Não vê aba "Usuários"
```

A role é lida diretamente do JWT (`app_metadata.role`) — não requer chamada extra à API. Como `app_metadata` só pode ser escrito pelo service role key (backend), não pode ser forjado pelo usuário.

---

## 10. Segurança — Pontos obrigatórios

- **Nunca** salvar o `SUPABASE_SERVICE_ROLE_KEY` no frontend
- **Nunca** criar um mecanismo de bootstrap com senha hardcoded no código — o master admin deve existir previamente no Supabase com sua senha real
- Todas as rotas de gestão de usuários devem usar `requireSuperAdmin(c)` no backend
- O backend deve impedir que um admin delete ou altere a própria conta

---

## 11. Checklist de implementação

- [ ] Copiar `srm-auth-backend.tsx` para `supabase/functions/server/`
- [ ] Ajustar `MASTER_ADMIN_EMAIL` e `ROUTE_PREFIX` no backend
- [ ] Registrar `registerAuthRoutes(app)` no servidor
- [ ] Copiar `srm-auth-frontend.tsx` para o projeto React
- [ ] Ajustar `API_BASE`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` no frontend
- [ ] Adaptar tela de login para chamar `POST /auth/login` e tratar `mustChangePassword`
- [ ] Implementar fluxo de `ForcePasswordChange` antes do primeiro acesso
- [ ] Substituir chamadas de token por `getFreshToken()`
- [ ] Atualizar avatar do header para exibir role dinâmica
- [ ] Adicionar aba "Usuários" visível só para admins
- [ ] Registrar rota `/cms/usuarios` no router
- [ ] Implementar página Usuários com lista, promoção e remoção
- [ ] Remover qualquer botão de "Convidar" fora da página Usuários
- [ ] Fazer logout e login novamente para receber o token com role correta
