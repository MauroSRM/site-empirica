/**
 * Prefixa um caminho da aplicação com a base do build.
 *
 * O <Link> do react-router já resolve o basename sozinho. Isto existe para os
 * casos em que não dá para usá-lo — window.open e <a href> abrindo em nova aba.
 * Sem o prefixo, esses links vão para a raiz do domínio e quebram quando o site
 * não está na raiz (é o caso do GitHub Pages, que serve em /<repo>/).
 */
export function comBase(caminho: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${caminho.startsWith("/") ? caminho : `/${caminho}`}`;
}
