/**
 * cleanup-imports.mjs
 * Remove arquivos não utilizados de /src/imports/
 *
 * Uso:
 *   node cleanup-imports.mjs             ← DRY-RUN (lista, não deleta)
 *   node cleanup-imports.mjs --delete    ← deleta de verdade
 *   node cleanup-imports.mjs --delete --verbose  ← com log detalhado
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMPORTS_DIR = path.join(__dirname, "src", "imports");
const SRC_DIR     = path.join(__dirname, "src");

const DRY_RUN = !process.argv.includes("--delete");
const VERBOSE = process.argv.includes("--verbose");

// ─── PASSO 1: Escaneamento automático de imports ativos ──────────────────────
// Varre todo /src buscando: import ... from "...imports/ARQUIVO"
// e também referências de string tipo "/src/imports/ARQUIVO"

function getAllSourceFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // pula a própria pasta imports para não referenciar a si mesma
      if (full !== IMPORTS_DIR) getAllSourceFiles(full, acc);
    } else if (/\.(tsx?|jsx?|mjs|css|html)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

function buildUsedSet(sourceFiles) {
  const used = new Set();
  const patterns = [
    // import algo from "../../../../imports/ARQUIVO"
    /from\s+["'][^"']*\/imports\/([^"']+)["']/g,
    // import("...imports/ARQUIVO")
    /import\(["'][^"']*\/imports\/([^"']+)["']\)/g,
    // "/src/imports/ARQUIVO" (referência em string)
    /["']\/src\/imports\/([^"']+)["']/g,
    // new URL("/src/imports/ARQUIVO", ...)
    /new URL\(["'][^"']*\/imports\/([^"']+)["']/g,
  ];

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf-8");
    for (const pattern of patterns) {
      let m;
      pattern.lastIndex = 0;
      while ((m = pattern.exec(content)) !== null) {
        // decodifica %XX e normaliza
        const ref = decodeURIComponent(m[1].trim());
        used.add(ref);
        if (VERBOSE) console.log(`  ref: ${ref}  ← ${path.relative(__dirname, file)}`);
      }
    }
  }
  return used;
}

// ─── PASSO 2: Lista de KEEP explícita (fallback / proteção extra) ────────────
// Qualquer arquivo aqui NUNCA será deletado, mesmo que o scanner não encontre.

const KEEP_EXPLICIT = new Set([
  // Imagens dos sliders (home desktop + mobile)
  "sl1-pic1-1.png", "sl1-pic2-1.png",
  "sl2-pic1-1.png", "sl2-pic2-1.png",
  "sl3-pic1-1.png", "sl3-pic2-1.png",
  "sl4-pic1-1.png", "sl4-pic2-1.png",
  "sl5-pic1-1.png", "sl5-pic2-1.png",
  "sl6-pic1-1.png", "sl6-pic2-1.png",
  "sl7-pic1-1.png", "sl7-pic2-1.png",
  // Imagens avulsas
  "DiagramMobilevf1.png",
  "Img-BUS-Nucleo.png",
  "central-etica.jpg",
  // SVGs de dados usados pelos componentes ativos
  "svg-rdihcjm68s.ts",
  "svg-1owng01feh.ts",
  "svg-zz0jnu9ee2.ts",
  "svg-o80aehr9o0.ts",
  "svg-8x3jzxm8ky.ts",
  "svg-n52gufefke.ts",
  "svg-jbx6ays0z2.ts",
  "svg-f157ke2wh0.ts",
  // PDFs das páginas de políticas
  "CódigoEticaConduta-Fornecedores.pdf",
  "CódigoEticaConduta-Profissional.pdf",
  "POLITICA_DE_COMPLIANCE_E_CONTROLES_INTERNOSv8.0.pdf",
  "POLÍTICA_DE_SUITIABILITY_V.6.0.pdf",
  "SRM_DTVM_-_Formulário_de_Referência_(v.final).pdf",
  "MANUAL_DE_APREÇAMENTO.pdf",
  "Formulário_de_Referência_2025_-_SRM_SEC-Assinado.pdf",
  "DF's_31032025_IPE_Online.pdf",
  // Componente principal (intocável)
  "Hero2.tsx",
]);

// Extensões de componente — NUNCA deletar .tsx/.jsx de forma alguma
const SAFE_EXTENSIONS = new Set([".tsx", ".jsx"]);

// Pastas inteiras que são sempre deletadas (lixo documentacional)
const DELETE_DIRS = new Set([
  "pasted_text",   // logs, erros, rascunhos
]);

// ─── PASSO 3: Coletar arquivos da pasta /src/imports ─────────────────────────

function listImportsFlat(dir, prefix = "") {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      // pastas de lixo → marca a pasta inteira
      if (DELETE_DIRS.has(entry.name)) {
        results.push({ rel, fullPath: path.join(dir, entry.name), isDir: true });
      } else {
        results.push(...listImportsFlat(path.join(dir, entry.name), rel));
      }
    } else {
      results.push({ rel, fullPath: path.join(dir, entry.name), isDir: false });
    }
  }
  return results;
}

// ─── EXECUÇÃO ────────────────────────────────────────────────────────────────

if (!fs.existsSync(IMPORTS_DIR)) {
  console.error(`❌  Pasta não encontrada: ${IMPORTS_DIR}`);
  process.exit(1);
}

console.log("\n══════════════════════════════════════════════════════════════");
console.log(`  cleanup-imports.mjs  ${DRY_RUN ? "— DRY-RUN (nada será deletado)" : "— MODO DELETE"}`);
console.log("══════════════════════════════════════════════════════════════\n");

// Escaneia código-fonte
console.log("🔍  Escaneando imports no código-fonte...");
const sourceFiles = getAllSourceFiles(SRC_DIR);
const usedByCode  = buildUsedSet(sourceFiles);
console.log(`    ${sourceFiles.length} arquivos fonte escaneados | ${usedByCode.size} referências encontradas\n`);

// Lista conteúdo de /src/imports
const entries = listImportsFlat(IMPORTS_DIR);

const kept    = [];
const deleted = [];

for (const entry of entries) {
  const basename = path.basename(entry.rel);
  const ext      = path.extname(basename);

  // Pastas de lixo
  if (entry.isDir) {
    deleted.push(entry);
    continue;
  }

  // .tsx/.jsx nunca deletar
  if (SAFE_EXTENSIONS.has(ext) && !entry.rel.includes("/")) {
    // só protege .tsx na raiz de imports (não em subpastas órfãs)
    // Hero2.tsx e outros componentes diretamente importados
    if (usedByCode.has(entry.rel) || KEEP_EXPLICIT.has(basename)) {
      kept.push(entry);
    } else {
      // .tsx não referenciado em subpasta órfã → deleta
      deleted.push(entry);
    }
    continue;
  }

  // Arquivo explicitamente protegido
  if (KEEP_EXPLICIT.has(basename) || KEEP_EXPLICIT.has(entry.rel)) {
    kept.push(entry);
    continue;
  }

  // Arquivo referenciado pelo scanner automático
  if (usedByCode.has(entry.rel) || usedByCode.has(basename)) {
    kept.push(entry);
    continue;
  }

  // Tudo o mais → deletar
  deleted.push(entry);
}

// Relatório
console.log(`✅  MANTIDOS (${kept.length}):`);
for (const e of kept) console.log(`    ${e.rel}`);

console.log(`\n🗑️   PARA DELETAR (${deleted.length}):`);
for (const e of deleted) console.log(`    ${e.rel}${e.isDir ? "  [pasta inteira]" : ""}`);

const totalSize = deleted
  .filter(e => !e.isDir)
  .reduce((acc, e) => {
    try { return acc + fs.statSync(e.fullPath).size; } catch { return acc; }
  }, 0);
console.log(`\n    Tamanho estimado liberado: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);

if (DRY_RUN) {
  console.log("\n⚠️   Modo DRY-RUN — nenhum arquivo foi alterado.");
  console.log("    Para deletar de verdade:");
  console.log("    node cleanup-imports.mjs --delete\n");
} else {
  console.log("\n🔥  Deletando...");
  let ok = 0, fail = 0;
  for (const entry of deleted) {
    try {
      if (entry.isDir) {
        fs.rmSync(entry.fullPath, { recursive: true, force: true });
        console.log(`  ✓ [pasta] ${entry.rel}`);
      } else {
        fs.unlinkSync(entry.fullPath);
        console.log(`  ✓ ${entry.rel}`);
      }
      ok++;
    } catch (err) {
      console.error(`  ✗ ERRO: ${entry.rel} — ${err.message}`);
      fail++;
    }
  }
  console.log(`\n✅  ${ok} item(ns) deletado(s)${fail ? ` | ❌ ${fail} erro(s)` : ""}.`);
  console.log(`    Espaço liberado: ~${(totalSize / 1024 / 1024).toFixed(1)} MB\n`);
}
