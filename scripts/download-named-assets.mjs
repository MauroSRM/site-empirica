/**
 * download-named-assets.mjs
 *
 * Baixa os PNGs/JPGs nomeados do cloud (via /named-assets/) para o diretório local.
 * Use quando rodar o projeto localmente e as imagens não aparecerem.
 *
 * USO:
 *   node scripts/download-named-assets.mjs https://stray-flick-37453810.figma.site
 *
 * Pré-requisito: o Figma Make precisa ter carregado o vite.config.ts atualizado
 * (que inclui namedAssetsServerPlugin). Depois de um git pull, acesse o preview
 * uma vez para garantir que o servidor está ativo, então rode este script.
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');

// ─── Args ──────────────────────────────────────────────────────────────────────
const baseUrl = process.argv[2]?.replace(/\/$/, '');
if (!baseUrl) {
  console.error('❌ Uso: node scripts/download-named-assets.mjs <preview-url>');
  console.error('   Ex:  node scripts/download-named-assets.mjs https://stray-flick-37453810.figma.site');
  process.exit(1);
}

// ─── Lista de arquivos ────────────────────────────────────────────────────────
const NAMED_ASSETS = [
  // Slider images — mobile home
  'sl1-pic1-1.png', 'sl1-pic2-1.png',
  'sl2-pic1-1.png', 'sl2-pic2-1.png',
  'sl3-pic1-1.png', 'sl3-pic2-1.png',
  'sl4-pic1-1.png', 'sl4-pic2-1.png',
  'sl5-pic1-1.png', 'sl5-pic2-1.png',
  'sl6-pic1-1.png', 'sl6-pic2-1.png',
  'sl7-pic1-1.png', 'sl7-pic2-1.png',
  // Imagens avulsas
  'Img-BUS-Nucleo.png',
  'DiagramMobilevf1.png',
  'central-etica.jpg',
];

// Tamanho mínimo esperado: imagens reais são sempre > 50 KB.
// Se o download for menor, é sinal de que a URL devolveu HTML (SPA routing).
const MIN_SIZE_BYTES = 50 * 1024; // 50 KB

// Destinos: src/imports/ (para bundling) e public/named-assets/ (para serve estático)
const DEST_DIRS = [
  join(ROOT, 'src', 'imports'),
  join(ROOT, 'public', 'named-assets'),
];

for (const dir of DEST_DIRS) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

// ─── Download ─────────────────────────────────────────────────────────────────
async function download(filename) {
  const url = `${baseUrl}/named-assets/${encodeURIComponent(filename)}`;
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    console.error(`  ❌ ${filename} — erro de rede: ${e.message}`);
    return false;
  }

  if (!res.ok) {
    console.error(`  ❌ ${filename} — HTTP ${res.status} em ${url}`);
    return false;
  }

  const buf = Buffer.from(await res.arrayBuffer());

  // Guarda de sanidade: rejeita arquivos muito pequenos (provavelmente HTML da SPA)
  if (buf.length < MIN_SIZE_BYTES) {
    const contentType = res.headers.get('content-type') ?? '?';
    console.error(
      `  ❌ ${filename} — arquivo suspeito: ${buf.length} bytes (Content-Type: ${contentType})`
    );
    console.error(
      `     Provável causa: o servidor ainda não carregou o namedAssetsServerPlugin.`
    );
    console.error(
      `     Aguarde o Figma Make recarregar após git pull e tente novamente.`
    );
    return false;
  }

  for (const dir of DEST_DIRS) {
    writeFileSync(join(dir, filename), buf);
  }

  console.log(`  ✅ ${filename} (${Math.round(buf.length / 1024)} KB)`);
  return true;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n[download-named-assets] Baixando ${NAMED_ASSETS.length} arquivos de:`);
console.log(`  ${baseUrl}/named-assets/\n`);

let ok = 0;
const failed = [];
for (const file of NAMED_ASSETS) {
  const success = await download(file);
  if (success) ok++;
  else failed.push(file);
}

console.log(`\n✅ ${ok}/${NAMED_ASSETS.length} baixados com sucesso.`);

if (failed.length > 0) {
  console.log('\n⚠️  Arquivos que falharam:');
  failed.forEach(f => console.log(`   • ${f}`));
  console.log('\n📋 Causas comuns:');
  console.log('   1. O Figma Make ainda não recarregou com o novo vite.config.ts');
  console.log('      → Faça git pull, acesse o preview URL uma vez e tente novamente.');
  console.log('   2. Os arquivos não existem em src/imports/ no cloud do Figma Make');
  console.log('      → Verifique no Figma Make se os arquivos estão em src/imports/');
  process.exit(1);
}

if (ok === NAMED_ASSETS.length) {
  console.log('\n🚀 Pronto! Rode: bash build-poc2.sh');
}
