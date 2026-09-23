/**
 * publish-named-assets.mjs
 *
 * Copia os PNGs nomeados de src/imports/ → public/named-assets/
 * para que fiquem disponíveis como arquivos estáticos em /named-assets/<filename>.
 *
 * Rodado automaticamente via "predev" e "prebuild" no package.json.
 * Também pode ser chamado manualmente: node scripts/publish-named-assets.mjs
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const SRC_DIR   = join(ROOT, 'src', 'imports');
const DEST_DIR  = join(ROOT, 'public', 'named-assets');

// Lista explícita dos PNGs nomeados que os componentes precisam.
// Estava preenchida com assets do site do Grupo SRM (sl1..sl7, Img-BUS-Nucleo,
// DiagramMobilevf1, central-etica) que nenhum componente daqui referencia —
// só geravam 17 avisos de "não encontrado" a cada dev/build.
const NAMED_ASSETS = [];

if (!existsSync(DEST_DIR)) {
  mkdirSync(DEST_DIR, { recursive: true });
  console.log('[named-assets] 📁 Criado public/named-assets/');
}

let copied  = 0;
let missing = 0;

for (const file of NAMED_ASSETS) {
  const src  = join(SRC_DIR, file);
  const dest = join(DEST_DIR, file);

  if (!existsSync(src)) {
    console.warn(`[named-assets] ⚠️  Não encontrado localmente: src/imports/${file}`);
    missing++;
    continue;
  }

  try {
    copyFileSync(src, dest);
    copied++;
  } catch (e) {
    console.error(`[named-assets] ❌ Erro ao copiar ${file}: ${e.message}`);
  }
}

console.log(`[named-assets] ✅ ${copied} copiados → public/named-assets/`);

if (missing > 0) {
  console.log(`[named-assets] ⚠️  ${missing} arquivo(s) ausente(s) localmente.`);
  console.log(`[named-assets]    Rode: node scripts/download-named-assets.mjs <preview-url>`);
}