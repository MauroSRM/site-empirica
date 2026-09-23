#!/usr/bin/env node
/**
 * map-figma-assets.mjs
 *
 * Diagnóstico + mapeamento de figma:asset/ hashes ↔ image-NNN.png
 *
 * O que faz:
 *  1. Varre src/ e coleta todos os hashes usados em figma:asset/HASH.png
 *  2. Lê todos os PNGs em src/imports/ e computa SHA-1, MD5, SHA-256
 *  3. Tenta cruzar os hashes com os algoritmos
 *  4. Para os que batem: copia src/imports/image-NNN.png → public/figma-assets/HASH.png
 *  5. Gera relatório de quais hashes ainda estão órfãos (precisam de download)
 *
 * USO:
 *   node scripts/map-figma-assets.mjs
 */

import { createHash } from 'crypto';
import { readFileSync, readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT       = dirname(dirname(__filename));
const SRC_DIR    = join(ROOT, 'src');
const DEST_DIR   = join(ROOT, 'public', 'figma-assets');

mkdirSync(DEST_DIR, { recursive: true });

// ── 1. Coletar todos os hashes usados em figma:asset/ ────────────────────────
console.log('\n[1/4] Varrendo src/ em busca de figma:asset/HASH.png …');
const HASH_RE = /figma:asset\/([a-f0-9]{40}\.png)/g;
const usedHashes = new Map(); // hash.png → [filePath, ...]

function scanDir(dir) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { scanDir(full); continue; }
    if (!e.name.endsWith('.tsx') && !e.name.endsWith('.ts')) continue;
    const src = readFileSync(full, 'utf-8');
    HASH_RE.lastIndex = 0;
    let m;
    while ((m = HASH_RE.exec(src))) {
      const key = m[1];
      if (!usedHashes.has(key)) usedHashes.set(key, []);
      usedHashes.get(key).push(full.replace(ROOT + '/', ''));
    }
  }
}
scanDir(SRC_DIR);
console.log(`   └─ ${usedHashes.size} hashes únicos encontrados`);

// ── 2. Ler todos os PNGs de src/imports/ e computar hashes ───────────────────
console.log('\n[2/4] Computando hashes de src/imports/*.png …');

const SCAN_DIRS = [
  join(ROOT, 'src', 'imports'),
  join(ROOT, 'src', 'imports', 'HomeUp1440'),
  join(ROOT, 'public', 'figma-assets'),
];

// Mapa: sha1+'.png' → caminho absoluto
const sha1Map  = new Map();
const md5Map   = new Map();
const sha256Map = new Map();

let totalFiles = 0;
let errorFiles = 0;

for (const dir of SCAN_DIRS) {
  if (!existsSync(dir)) continue;
  let entries;
  try { entries = readdirSync(dir); } catch { continue; }

  for (const file of entries) {
    if (!/\.(png|jpe?g|gif|webp)$/i.test(file)) continue;
    const full = join(dir, file);
    totalFiles++;
    try {
      const data = readFileSync(full);
      const sha1   = createHash('sha1'  ).update(data).digest('hex');
      const md5    = createHash('md5'   ).update(data).digest('hex');
      const sha256 = createHash('sha256').update(data).digest('hex');

      sha1Map .set(sha1   + '.png', full);
      sha1Map .set(sha1,             full);
      md5Map  .set(md5    + '.png', full);
      md5Map  .set(md5,              full);
      sha256Map.set(sha256 + '.png', full);
      sha256Map.set(sha256,           full);
    } catch (e) {
      errorFiles++;
      console.error(`   ⚠ Erro ao ler ${file}: ${e.message}`);
    }
  }
}
console.log(`   └─ ${totalFiles} arquivos lidos (${errorFiles} erros)`);
console.log(`   └─ SHA-1:   ${sha1Map.size  / 2} únicos`);
console.log(`   └─ MD5:     ${md5Map.size   / 2} únicos`);
console.log(`   └─ SHA-256: ${sha256Map.size / 2} únicos`);

// ── 3. Cruzar hashes ──────────────────────────────────────────────────────────
console.log('\n[3/4] Cruzando figma:asset hashes com os arquivos locais …');

const resolved   = [];
const orphaned   = [];

for (const [hashPng, usedIn] of usedHashes) {
  const hash = hashPng.replace(/\.png$/, '');

  // Qual algoritmo bate?
  let foundPath = null;
  let foundAlgo = null;
  if (sha1Map  .has(hashPng)) { foundPath = sha1Map  .get(hashPng); foundAlgo = 'sha1';   }
  else if (md5Map  .has(hashPng)) { foundPath = md5Map  .get(hashPng); foundAlgo = 'md5';    }
  else if (sha256Map.has(hashPng)) { foundPath = sha256Map.get(hashPng); foundAlgo = 'sha256'; }

  if (foundPath) {
    resolved.push({ hash: hashPng, algo: foundAlgo, src: foundPath, usedIn });
  } else {
    orphaned.push({ hash: hashPng, usedIn });
  }
}

console.log(`   └─ ✅ Resolvidos: ${resolved.length}`);
console.log(`   └─ ❌ Órfãos:     ${orphaned.length}`);

// ── 4. Copiar arquivos resolvidos para public/figma-assets/ ───────────────────
console.log('\n[4/4] Copiando arquivos resolvidos → public/figma-assets/ …');

for (const { hash, algo, src } of resolved) {
  const dest = join(DEST_DIR, hash);
  if (!existsSync(dest)) {
    copyFileSync(src, dest);
    console.log(`   ✅ [${algo}] ${basename(src)} → ${hash.slice(0, 16)}…`);
  } else {
    console.log(`   ⏭  já existe: ${hash.slice(0, 16)}…`);
  }
}

// ── Relatório final ───────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log('  RELATÓRIO FINAL');
console.log('═'.repeat(60));

console.log(`\n✅ Resolvidos (${resolved.length}):`);
for (const { hash, algo, src, usedIn } of resolved) {
  console.log(`  [${algo}] ${hash.slice(0, 16)}… ← ${basename(src)}`);
  for (const f of usedIn) console.log(`         usado em: ${f}`);
}

if (orphaned.length > 0) {
  console.log(`\n❌ Órfãos — precisam de download (${orphaned.length}):`);
  for (const { hash, usedIn } of orphaned) {
    console.log(`  ${hash.slice(0, 16)}… (${hash})`);
    for (const f of usedIn) console.log(`         usado em: ${f}`);
  }

  // Gera arquivo de hashes órfãos para o download script
  const orphanList = orphaned.map(o => o.hash).join('\n');
  const listPath   = join(ROOT, 'scripts', 'orphan-hashes.txt');
  writeFileSync(listPath, orphanList + '\n');
  console.log(`\n  → Lista salva em scripts/orphan-hashes.txt`);
  console.log(`  → Para baixar: node scripts/download-figma-assets.mjs <URL_FIGMA_MAKE>`);
}

console.log('\n' + '═'.repeat(60));
console.log('  Próximos passos:');
console.log('  git add public/figma-assets/');
console.log('  git commit -m "chore: add mapped figma assets"');
console.log('  git push && pnpm dev --force');
console.log('═'.repeat(60) + '\n');
