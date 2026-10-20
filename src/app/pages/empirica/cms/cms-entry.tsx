/**
 * Porta de entrada do CMS — e a fronteira entre dois sistemas visuais.
 *
 * O CSS do Diamond traz seletores globais (html, body, *, a, button, input) e
 * um :root com a marca da SRM. O site público foi deliberadamente afastado
 * dessa identidade, então o estilo do DS não pode subir no bundle principal:
 * vazaria para as páginas dos fundos e desfaria a descaracterização.
 *
 * Importando aqui, e carregando este módulo sob demanda pela rota, o Vite
 * emite um chunk de CSS à parte que só é baixado ao abrir o CMS.
 */
import '@srm/diamond/styles';

export {
  default as EmpiricaCmsPage,
  CmsFundosPage,
  CmsFundDetailPage,
  CmsGestorPageWrapper,
  CmsCompliancePageWrapper,
  CmsUsuariosPageWrapper,
} from './EmpiricaCmsPage';
