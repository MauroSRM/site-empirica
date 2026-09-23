/**
 * srm-site — Vite Config standalone
 *
 * Estratégia:
 * - root = Aiplayground/ (onde ficam src/ e index-poc2.html)
 * - resolve.alias com regex exato redireciona imports NPM para srm-site/node_modules/
 * - Plugin com enforce:'pre' + transform() reescreve imports "figma:asset/*"
 *   ANTES do vite:import-analysis vê o código (resolveId não é chamado para
 *   schemes desconhecidos no Vite 6 — transform é o único hook confiável)
 * - server.fs.strict:false permite servir src/imports/image-*.png etc.
 *
 * RESOLUÇÃO DE figma:asset/HASH.png
 *   O buildHashMap() calcula o SHA-1 de cada PNG em src/imports/ e monta um
 *   mapa hash→caminho. Assim, quando encontramos figma:asset/HASH.png local-
 *   mente, geramos um import relativo REAL em vez de base64 placeholder.
 *   • Dev:   Vite serve como /src/imports/nome.png  (URL, não base64)
 *   • Build: Vite copia para /assets/nome-HASH.png  (URL, não base64)
 *   Quando o hash não é encontrado localmente → placeholder transparente.
 */
import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

const SRM_DIR  = new URL('.', import.meta.url).pathname.replace(/\/+$/, '');
const SRM_NM   = path.join(SRM_DIR, 'node_modules');
const ROOT_DIR = path.resolve(SRM_DIR, '..'); // Aiplayground/
const nm       = (pkg: string) => path.join(SRM_NM, pkg);

// ── Placeholder: PNG transparente 1×1 ────────────────────────────────────────
const TRANSPARENT_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

// ── Hash map SHA-1 → caminho absoluto ────────────────────────────────────────
// Permite resolver figma:asset/HASH.png para o arquivo real em src/imports/
function buildHashMap(): Map<string, string> {
  const map = new Map<string, string>();
  const scanDirs = [
    path.join(ROOT_DIR, 'src', 'imports'),
    path.join(ROOT_DIR, 'src', 'imports', 'HomeUp1440'),
    path.join(ROOT_DIR, 'public', 'figma-assets'),
  ];

  let mapped = 0;
  for (const dir of scanDirs) {
    if (!fs.existsSync(dir)) continue;
    let entries: string[];
    try { entries = fs.readdirSync(dir); } catch { continue; }

    for (const file of entries) {
      if (!/\.(png|jpe?g|gif|webp)$/i.test(file)) continue;
      const full = path.join(dir, file);
      try {
        const data = fs.readFileSync(full);
        const sha1 = createHash('sha1').update(data).digest('hex');
        map.set(`${sha1}.png`, full);
        map.set(sha1, full);
        mapped++;
        // Arquivos nomeados pelo próprio hash (ex: public/figma-assets/ABCD.png)
        const nameNoExt = path.basename(file, path.extname(file));
        if (/^[a-f0-9]{40}$/i.test(nameNoExt)) {
          map.set(file, full);
          map.set(nameNoExt, full);
        }
      } catch { /* ignora arquivo ilegível */ }
    }
  }

  console.log(`[figma-asset] ✅ ${mapped} PNGs mapeados em src/imports/`);
  return map;
}

console.log('[figma-asset] 🔍 Calculando SHA-1 dos PNGs locais …');
const HASH_MAP = buildHashMap();

// ── Plugin: figma:asset/* e imports locais ausentes ──────────────────────────
//
// Regras:
//  1. imports "figma:asset/HASH"
//       • hash encontrado no HASH_MAP → converte para import relativo REAL
//         (Vite serve como URL, não base64)
//       • hash não encontrado         → placeholder transparente
//  2. imports relativos de imagem dentro de /imports/ →
//       • arquivo EXISTE no disco → mantém o import original (Vite resolve normal)
//       • arquivo NÃO EXISTE      → substitui por placeholder transparente
//
// Usa enforce:'pre' + transform() para rodar antes do vite:import-analysis.
function figmaAssetPlugin(): Plugin {
  return {
    name:    'figma-asset-transform',
    enforce: 'pre',
    transform(code: string, id: string) {
      const hasFigma    = code.includes('figma:asset/');
      const hasLocalImg = /from\s+['"][./]+imports\/[^'"]+\.(png|jpe?g|gif|webp|svg)['"]/i.test(code);

      if (!hasFigma && !hasLocalImg) return null;

      // baseDir precisa estar disponível para AMBOS os replace abaixo
      const baseDir = path.dirname(id.replace(/\0.*/, ''));

      let result = code;

      // 1. figma:asset/HASH — tenta resolver para arquivo real, senão placeholder
      result = result.replace(
        /import\s+([\w$]+)\s+from\s+['"]figma:asset\/([^'"]+)['"]/g,
        (match, varName, filename) => {
          const filepath = HASH_MAP.get(filename);
          if (filepath) {
            // Converte para import relativo real → Vite gera URL (não base64)
            const relPath = path.relative(baseDir, filepath).replace(/\\/g, '/');
            const relStr  = relPath.startsWith('.') ? relPath : `./${relPath}`;
            return `import ${varName} from "${relStr}"`;
          }
          // Hash não encontrado localmente → placeholder transparente 1×1
          return `const ${varName} = "${TRANSPARENT_PNG}"`;
        },
      );

      // 2. Imports relativos de imagens em /imports/ SOMENTE se o arquivo não existir
      result = result.replace(
        /import\s+([\w$]+)\s+from\s+["']([./]*imports\/[^"']+\.(?:png|jpe?g|gif|webp))["']/gi,
        (match, varName, importPath) => {
          const resolved = path.resolve(baseDir, importPath);
          if (fs.existsSync(resolved)) {
            return match; // arquivo existe → mantém import original
          }
          // arquivo não existe no repo git → usa placeholder transparente
          return `const ${varName} = "${TRANSPARENT_PNG}"`;
        },
      );

      return { code: result, map: null };
    },
  };
}

export default defineConfig({
  root: ROOT_DIR,

  plugins: [
    figmaAssetPlugin(),   // ANTES do react() para rodar enforce:'pre'
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: [
      // subpaths do react (mais específico antes do genérico)
      { find: /^react\/jsx-dev-runtime$/, replacement: nm('react/jsx-dev-runtime') },
      { find: /^react\/jsx-runtime$/,     replacement: nm('react/jsx-runtime')     },
      // subpaths do react-dom
      { find: /^react-dom\/client$/,      replacement: nm('react-dom/client')      },
      { find: /^react-dom\/server$/,      replacement: nm('react-dom/server')      },
      // pacotes raiz
      { find: /^react-dom$/,              replacement: nm('react-dom')             },
      { find: /^react$/,                  replacement: nm('react')                 },
      // react-router: o projeto usa tanto "react-router" quanto "react-router-dom"
      { find: /^react-router-dom$/,       replacement: nm('react-router-dom')      },
      { find: /^react-router$/,           replacement: nm('react-router')          },
      // outros pacotes
      { find: /^lucide-react$/,           replacement: nm('lucide-react')          },
      { find: /^motion\/react$/,          replacement: nm('motion/react')          },
      { find: /^motion$/,                 replacement: nm('motion')                },
      // alias de src
      { find: '@', replacement: path.resolve(ROOT_DIR, 'src') },
    ],
    dedupe: ['react', 'react-dom'],
  },

  server: {
    port: 3333,
    fs: {
      strict: false,   // permite servir src/imports/*.png via path relativo
      allow: [
        ROOT_DIR,
        SRM_NM,
      ],
    },
  },

  // Limpa cache para garantir que o novo config seja aplicado
  cacheDir: path.join(SRM_DIR, '.vite-cache'),

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-dev-runtime',
      'react/jsx-runtime',
    ],
    esbuildOptions: {
      nodePaths: [SRM_NM],
    },
  },

  build: {
    rollupOptions: {
      input: path.resolve(ROOT_DIR, 'index-poc2.html'),
    },
    outDir:           path.join(SRM_DIR, 'dist'),
    emptyOutDir:      true,
    assetsInlineLimit: 0,  // nunca inlinar imagens como base64 no build
  },
});
