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

// Lista explícita dos PNGs nomeados que os componentes precisam
const NAMED_ASSETS = [
  'sl1-pic1-1.png', 'sl1-pic2-1.png',
  'sl2-pic1-1.png', 'sl2-pic2-1.png',
  'sl3-pic1-1.png', 'sl3-pic2-1.png',
  'sl4-pic1-1.png', 'sl4-pic2-1.png',
  'sl5-pic1-1.png', 'sl5-pic2-1.png',
  'sl6-pic1-1.png', 'sl6-pic2-1.png',
  'sl7-pic1-1.png', 'sl7-pic2-1.png',
  'Img-BUS-Nucleo.png',
  'DiagramMobilevf1.png',
  'central-etica.jpg',
];

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