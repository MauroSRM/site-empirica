# Site SRM Empírica

Site institucional da SRM Empírica, com CMS próprio. Origem: export do Figma Make
(https://www.figma.com/design/5rB7Yre7KgMI0ovpgkT4i8/-SiteEmpirica-).

## Rodando

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build
```

## Estrutura

```
src/app/pages/empirica/   páginas públicas + visualizador de PDF
src/app/pages/empirica/cms/   CMS  (/srm-ops/emp-gstf)
src/app/pages/site/       componentes compartilhados vindos do site SRM
src/design-system/        DS Matriz
supabase/functions/make-server-57709921/   backend (Hono + KV + Storage)
```

### Rotas

| Rota | O quê |
|---|---|
| `/empirica` | Home |
| `/empirica/nossos-fundos/:categoria` | Listagem por categoria (FIDC, FIF, FII, FIP) |
| `/empirica/nossos-fundos/:categoria/:slug` | Página do fundo |
| `/empirica/documento/:docId` | Visualizador de PDF |
| `/empirica/documento/compliance/:id` | Visualizador de PDF de compliance |
| `/srm-ops/emp-gstf` | CMS |

## Backend

Supabase `kiecylhfsdcjeivhjhcq`, Edge Function `make-server-57709921`.
Dados em KV (`kv_store_57709921`), PDFs no bucket `srm-pdfs`.

Deploy da function:

```bash
supabase functions deploy make-server-57709921 --project-ref kiecylhfsdcjeivhjhcq
```

### Ler do KV

Use sempre `parseKv()` de `kv_parse.tsx`, nunca `JSON.parse` direto. Os valores
foram gravados em dois formatos (string JSON e objeto JSONB nativo) e o parse
direto descarta silenciosamente os do segundo tipo.

## Fonte dos dados

Os fundos vêm do CMS. `src/app/pages/empirica/data/empirica-funds.ts` continua
no repositório como fallback enquanto a requisição não volta — ao alterar um
fundo, altere no CMS, não nesse arquivo.

## Pendências

- Favicon e imagem de compartilhamento (og:image) próprios da Empírica
- `index.html` usa o contêiner GTM do Grupo SRM (`GTM-T6MSLLXL`) — confirmar se
  a Empírica deve ter o seu
