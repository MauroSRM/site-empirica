# Etapa 4 de 5 — Header: Avatar com role e aba Usuários

Pré-requisito: Etapas 1, 2 e 3 concluídas. O token já vem de `getFreshToken()` e `isAdminFromToken` está disponível.

---

## O que fazer nesta etapa

### 1. Adicionar imports no componente de header

```tsx
import { emailFromToken, isAdminFromToken } from "../srm-auth-frontend"; // ajuste o caminho
import { Crown, Users } from "lucide-react";
```

---

### 2. Derivar email e role do token

No componente de header (ou onde o avatar é renderizado), derive os dados do token:

```tsx
const email   = React.useMemo(() => emailFromToken(token), [token]);
const isAdmin = React.useMemo(() => isAdminFromToken(token), [token]);
const roleLabel = isAdmin ? "Administrador" : "Colaborador";
```

---

### 3. Atualizar o avatar para exibir a role

No componente de avatar/dropdown do header, exiba a role como subtítulo e como badge:

```tsx
{/* Subtítulo do avatar — substitua o nome do sistema pela role */}
<p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>
  {roleLabel}
</p>
```

No dropdown do avatar, adicione o badge de role:

```tsx
{/* Badge de role dentro do dropdown */}
<span style={{
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "2px 8px",
  borderRadius: 4,
  background: isAdmin ? "#eef2ff" : "#f4f6f9",
  color: isAdmin ? "#1B2C6B" : "#6B7A99",
  fontSize: 11,
  fontWeight: 600,
}}>
  {isAdmin && <Crown size={10} />}
  {roleLabel}
</span>
```

---

### 4. Adicionar aba "Usuários" na navegação — somente para admins

No menu de navegação do header, adicione o item condicional:

```tsx
{isAdmin && (
  <NavButton
    label="Usuários"
    icon={<Users size={13} />}
    active={pathname.includes("/usuarios")}
    onClick={() => navigate("/cms/usuarios")} // ajuste o path correto deste CMS
  />
)}
```

> Use o mesmo componente de botão de navegação que já existe no header (NavButton, TabButton, ou similar).

---

### 5. Garantir que o botão "Convidar" NÃO está no header

Verifique se há algum botão de "Convidar usuário" no header. Se houver, **remova-o**. O convite deve existir somente dentro da página de Gestão de Usuários (próxima etapa).

---

### 6. Registrar a rota no router

No arquivo de rotas do projeto (ex: `src/app/routes.tsx`), adicione a rota para a página de usuários:

```tsx
import { CmsUsuariosPageWrapper } from "./pages/cms/CmsPage"; // ajuste o caminho

// Dentro do array de rotas:
{ path: "cms/usuarios", Component: CmsUsuariosPageWrapper },
```

O componente `CmsUsuariosPageWrapper` será criado na próxima etapa.

---

## Checklist desta etapa

- [ ] `emailFromToken` e `isAdminFromToken` importados e usados no header
- [ ] Subtítulo do avatar mostra `roleLabel` (Administrador / Colaborador)
- [ ] Badge de role com Crown icon exibido no dropdown do avatar
- [ ] Aba "Usuários" visível no menu somente quando `isAdmin === true`
- [ ] Nenhum botão "Convidar" no header
- [ ] Rota `/cms/usuarios` registrada no router

---

**Próxima etapa:** ETAPA-5-pagina-usuarios.md — Implementar a página de Gestão de Usuários com lista, promoção, remoção e modal de convite.
