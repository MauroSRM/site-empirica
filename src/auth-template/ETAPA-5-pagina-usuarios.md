# Etapa 5 de 5 — Página de Gestão de Usuários

Pré-requisito: Etapas 1–4 concluídas. A rota `/cms/usuarios` já está registrada no router.

---

## O que fazer nesta etapa

### 1. Importar os componentes do template

No arquivo principal do CMS (ou num novo arquivo dedicado), importe:

```tsx
import {
  UserManagementPage,
  InviteUserModal,
  getFreshToken,
  userIdFromToken,
  isAdminFromToken,
} from "../srm-auth-frontend"; // ajuste o caminho
```

---

### 2. Criar o componente wrapper e exportá-lo

Crie um componente wrapper que protege o acesso (somente admins) e renderiza a página:

```tsx
export function CmsUsuariosPageWrapper() {
  const [token, setToken] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    getFreshToken()
      .then(t => {
        if (!isAdminFromToken(t)) {
          navigate("/cms"); // redireciona não-admins
        } else {
          setToken(t);
        }
      })
      .catch(() => navigate("/cms"));
  }, []);

  if (!token) return null; // ou spinner

  return <UserManagementPage token={token} />;
}
```

> Se preferir criar uma página própria em vez de usar `UserManagementPage` do template, veja a seção abaixo com os requisitos completos.

---

### 3. O que a página deve exibir

A `UserManagementPage` (ou equivalente customizado) deve:

**Lista de usuários dividida em dois grupos:**
- Grupo **Administradores** — usuários com `app_metadata.role = "admin"`
- Grupo **Colaboradores** — todos os demais

**Por usuário, exibir:**
- Avatar com iniciais (primeiras letras do nome ou e-mail)
- Nome e e-mail
- Badge de role (Administrador / Colaborador)
- Último acesso (`last_sign_in_at` formatado)
- Badge laranja "Senha pendente" se `user_metadata.must_change_password === true`

**Ações disponíveis por usuário** (não aplicáveis ao próprio usuário logado):
- **Promover a Admin** → `PATCH /auth/users/:id/role` com `{ role: "admin" }`
- **Rebaixar para Colaborador** → `PATCH /auth/users/:id/role` com `{ role: "collaborator" }`
- **Remover acesso** → `DELETE /auth/users/:id` com modal de confirmação antes de executar

**Botões no topo da página:**
- "Convidar" — abre o `InviteUserModal`
- "Atualizar" — recarrega a lista

---

### 4. Modal de convite — InviteUserModal

O `InviteUserModal` já está pronto no template. Ele inclui:

- Campo e-mail (obrigatório)
- Campo nome (opcional)
- Toggle "Acesso de Administrador" — se ativado, cria o usuário com `app_metadata.role = "admin"`
- Após sucesso, exibe a senha temporária gerada com botão de copiar
- Orientação: o convidado deverá criar uma nova senha no primeiro acesso

Uso:

```tsx
const [inviteOpen, setInviteOpen] = React.useState(false);

// No JSX:
{inviteOpen && (
  <InviteUserModal
    token={token}
    onClose={() => setInviteOpen(false)}
    onSuccess={() => {
      setInviteOpen(false);
      reloadUsers(); // recarregar lista
    }}
  />
)}
```

---

### 5. Chamadas de API necessárias

Todas as chamadas usam o token do admin logado:

```ts
// Listar usuários
GET /auth/users
Authorization: Bearer {token}

// Promover/rebaixar
PATCH /auth/users/{userId}/role
Authorization: Bearer {token}
Content-Type: application/json
Body: { "role": "admin" }  // ou "collaborator"

// Remover acesso
DELETE /auth/users/{userId}
Authorization: Bearer {token}

// Convidar (feito pelo InviteUserModal automaticamente)
POST /auth/invite
Authorization: Bearer {token}
Content-Type: application/json
Body: { "email": "...", "name": "...", "isAdmin": true/false }
```

---

### 6. Proteções obrigatórias (frontend)

- O usuário logado **não deve ver** as ações de promover/rebaixar/remover na própria linha
- Compare `userIdFromToken(token)` com o `id` do usuário da linha para identificar a própria conta
- O backend também bloqueia essas ações — mas a proteção no frontend evita chamadas desnecessárias

---

## Checklist desta etapa

- [ ] `CmsUsuariosPageWrapper` criado e protegido por `isAdminFromToken`
- [ ] Página lista usuários em dois grupos (Admins / Colaboradores)
- [ ] Cada linha exibe: iniciais, nome, e-mail, role badge, último acesso, badge "Senha pendente"
- [ ] Ações de promover/rebaixar/remover funcionando (com confirmação para remover)
- [ ] Próprio usuário logado não tem ações disponíveis na sua linha
- [ ] Botão "Convidar" abre `InviteUserModal` com toggle de admin
- [ ] Após convidar, senha temporária exibida com botão copiar
- [ ] Botão "Atualizar" recarrega a lista
- [ ] `CmsUsuariosPageWrapper` exportado e importado na rota do router

---

## Hierarquia de roles — Resumo final

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

A role é lida diretamente do JWT (`app_metadata.role`) — sem chamada extra à API. Como `app_metadata` só pode ser escrito pelo service role key (backend), não pode ser forjado pelo usuário.

---

## Implementação concluída ✓

Após completar esta etapa, faça logout e login novamente para receber um token com a role correta e confirmar que tudo funciona.
