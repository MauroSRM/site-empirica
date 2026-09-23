# Etapa 3 de 5 — Frontend: Fluxo de autenticação

Pré-requisito: Etapas 1 e 2 concluídas. `src/app/srm-auth-frontend.tsx` existe com as constantes corretas.

---

## O que fazer nesta etapa

### 1. Identificar o componente principal do CMS

Encontre o componente que controla o estado de autenticação do CMS — geralmente o arquivo principal da página CMS (ex: `src/app/pages/cms/CmsPage.tsx` ou similar). É o componente que hoje verifica se há um token e decide mostrar o login ou o painel.

---

### 2. Substituir os helpers de sessão atuais

Remova qualquer uso de `localStorage.getItem("token")` ou similar. Substitua pelas funções do template:

```ts
import {
  saveSession, loadSession, clearSession, getFreshToken,
  emailFromToken, isAdminFromToken, userIdFromToken,
} from "../srm-auth-frontend"; // ajuste o caminho conforme necessário
```

Em todas as chamadas autenticadas ao backend, troque por:

```ts
const token = await getFreshToken();
// use token no header Authorization
```

`getFreshToken()` automaticamente:
- Retorna o token se ainda válido (>60s de vida restante)
- Renova via refresh token se estiver próximo de expirar
- Redireciona para o login se a sessão for inválida

---

### 3. Adaptar a tela de login

Substitua a chamada de login atual para usar o componente `LoginScreen` do template:

```tsx
import { LoginScreen, saveSession } from "../srm-auth-frontend";
```

No lugar onde o login é renderizado:

```tsx
<LoginScreen
  onLogin={(token, refreshToken, expiresAt, mustChangePassword) => {
    if (mustChangePassword) {
      setPendingToken(token); // não salva sessão ainda — aguarda troca de senha
    } else {
      saveSession({ access_token: token, refresh_token: refreshToken, expires_at: expiresAt });
      // navegar para o dashboard do CMS
    }
  }}
/>
```

Adicione o state necessário no componente pai:

```tsx
const [pendingToken, setPendingToken] = React.useState<string | null>(null);
```

---

### 4. Implementar o fluxo de primeiro acesso (ForcePasswordChange)

Após o login, se `mustChangePassword` for `true`, exiba a tela de troca de senha obrigatória **antes** de liberar o CMS:

```tsx
import { ForcePasswordChange } from "../srm-auth-frontend";
```

Na lógica de renderização do componente principal:

```tsx
// Se há sessão válida → mostrar CMS
// Se há pendingToken → mostrar ForcePasswordChange
// Senão → mostrar LoginScreen

if (session) {
  return <CmsDashboard />;
}

if (pendingToken) {
  return (
    <ForcePasswordChange
      token={pendingToken}
      onDone={(newToken, refreshToken, expiresAt) => {
        saveSession({ access_token: newToken, refresh_token: refreshToken, expires_at: expiresAt });
        setPendingToken(null);
        // navegar para o dashboard
      }}
    />
  );
}

return (
  <LoginScreen
    onLogin={(token, refreshToken, expiresAt, mustChangePassword) => {
      if (mustChangePassword) {
        setPendingToken(token);
      } else {
        saveSession({ access_token: token, refresh_token: refreshToken, expires_at: expiresAt });
      }
    }}
  />
);
```

---

## Checklist desta etapa

- [ ] `getFreshToken()` usado em todas as chamadas autenticadas (sem `localStorage.getItem` direto)
- [ ] `LoginScreen` do template substituindo o login atual
- [ ] `saveSession` / `clearSession` / `loadSession` substituindo qualquer gestão manual de token
- [ ] `pendingToken` state adicionado no componente principal
- [ ] `ForcePasswordChange` exibido quando `mustChangePassword === true`
- [ ] Após `ForcePasswordChange`, sessão salva e CMS liberado

---

**Próxima etapa:** ETAPA-4-header-avatar-nav.md — Exibir role no avatar e adicionar aba Usuários na navegação.
