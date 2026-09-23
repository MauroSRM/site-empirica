#!/usr/bin/env node
/**
 * download-figma-assets.mjs
 *
 * Baixa imagens figma:asset/HASH.png do Figma Make para public/figma-assets/
 *
 * USO:
 *   node scripts/download-figma-assets.mjs <BASE_URL>
 *
 * EXEMPLO (URL do seu Figma Make preview):
 *   node scripts/download-figma-assets.mjs https://app-XYZ.makeproxy-c.figma.site
 *
 * O script tenta baixar de:
 *   <BASE_URL>/figma-assets/<HASH>.png   (rota estática do vite public/)
 *
 * Se quiser baixar só os órfãos (lista gerada por map-figma-assets.mjs):
 *   node scripts/download-figma-assets.mjs <BASE_URL> --orphans-only
 */

import { createHash }                                     from 'crypto';
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname }                                  from 'path';
import { fileURLToPath }                                  from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT       = dirname(dirname(__filename));
const DEST_DIR   = join(ROOT, 'public', 'figma-assets');
const SRC_DIR    = join(ROOT, 'src');

const BASE_URL    = process.argv[2];
const ORPHAN_ONLY = process.argv.includes('--orphans-only');

if (!BASE_URL) {
  console.error('\n❌  Forneça a URL base como argumento.\n');
  console.error('    node scripts/download-figma-assets.mjs <BASE_URL>\n');
  console.error('    Exemplo:');
  console.error('    node scripts/download-figma-assets.mjs https://app-XYZ.makeproxy-c.figma.site\n');
  process.exit(1);
}

mkdirSync(DEST_DIR, { recursive: true });

// ── 1. Coletar hashes ─────────────────────────────────────────────────────────
let hashes;

if (ORPHAN_ONLY) {
  const listPath = join(ROOT, 'scripts', 'orphan-hashes.txt');
  if (!existsSync(listPath)) {
    console.error('\n❌  orphan-hashes.txt não encontrado.');
    console.error('    Execute primeiro: node scripts/map-figma-assets.mjs\n');
    process.exit(1);
  }
  hashes = new Set(
    readFileSync(listPath, 'utf-8').split('\n').map(l => l.trim()).filter(Boolean)
  );
  console.log(`\n📋 Usando lista de órfãos: ${hashes.size} hashes`);
} else {
  console.log('\n🔍  Varrendo src/ em busca de figma:asset/ …');
  const HASH_RE = /figma:asset\/([a-f0-9]{40}\.png)/g;
  hashes = new Set();

  function scanDir(dir) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) { scanDir(full); continue; }
      if (!e.name.endsWith('.tsx') && !e.name.endsWith('.ts')) continue;
      try {
        const src = readFileSync(full, 'utf-8');
        HASH_RE.lastIndex = 0;
        let m;
        while ((m = HASH_RE.exec(src))) hashes.add(m[1]);
      } catch { /* skip unreadable files */ }
    }
  }
  scanDir(SRC_DIR);
  console.log(`   └─ ${hashes.size} hashes únicos encontrados\n`);
}

// ── 2. Baixar cada hash ───────────────────────────────────────────────────────
let downloaded = 0, skipped = 0, failed = 0;
const base = BASE_URL.replace(/\/$/, '');

for (const hash of hashes) {
  const dest = join(DEST_DIR, hash);

  // Se já existe E tem conteúdo válido, pula
  if (existsSync(dest)) {
    const size = readFileSync(dest).length;
    if (size > 100) {
      console.log(`  ✓ ${hash.slice(0, 16)}… (já existe — skip)`);
      skipped++;
      continue;
    }
  }

  // Tenta múltiplas URLs candidatas
  const urls = [
    `${base}/figma-assets/${hash}`,
    `${base}/src/imports/${hash}`,
  ];

  let ok = false;
  for (const url of urls) {
    process.stdout.write(`  ↓ ${hash.slice(0, 16)}… `);
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'image/png,image/*', 'User-Agent': 'figma-asset-downloader/1.0' }
      });
      if (!res.ok) {
        process.stdout.write(`HTTP ${res.status} `);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(dest, buf);
      console.log(`✅ (${Math.round(buf.length / 1024)} KB) ← ${url}`);
      downloaded++;
      ok = true;
      break;
    } catch (err) {
      process.stdout.write(`err(${err.message.slice(0, 30)}) `);
    }
  }
  if (!ok) {
    console.log('❌');
    failed++;
  }
}

// ── 3. Resumo ─────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60));
console.log(`  ✅ Baixados : ${downloaded}`);
console.log(`  ⏭  Já havia : ${skipped}`);
if (failed) {
  console.log(`  ❌ Falharam : ${failed}`);
  console.log('\n  💡 Dica: Se todos falharam, verifique se a URL do Figma Make está correta.');
  console.log('     A URL deve ser o preview ativo do seu projeto, ex:');
  console.log('     https://app-XYZ.makeproxy-c.figma.site');
  console.log('\n  💡 Alternativa: abra o Figma Make no browser, F12 → Network,');
  console.log('     filtre por "figma-assets" e copie a URL base das requisições.');
}
console.log('─'.repeat(60));
if (downloaded > 0) {
  console.log('\nPróximos passos:');
  console.log('  git add public/figma-assets/');
  console.log('  git commit -m "chore: add figma png assets"');
  console.log('  git push');
  console.log('  pnpm dev --force\n');
}
