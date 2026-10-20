import { defineConfig, Plugin, transformWithEsbuild } from 'vite'
import path from 'path'
import fs from 'fs'
import { createHash } from 'crypto'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// ─── Raiz do projeto ──────────────────────────────────────────────────────────
const PROJECT_ROOT: string =
  typeof __dirname !== 'undefined' ? __dirname : process.cwd()

// ─── Placeholder 1×1 px transparente ─────────────────────────────────────────
// Sem geração dinâmica, sem require(), sem zlib.
const PLACEHOLDER_1X1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ' +
  'AAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

// ─── Mapa SHA-1 → caminho absoluto ───────────────────────────────────────────
// O hash em "figma:asset/HASH.png" é o SHA-1 do conteúdo do arquivo PNG.
// Os PNGs ficam localmente em src/imports/ (alguns) e public/figma-assets/ (baixados).
// OBS: os `image-NNN.png` em src/imports/ EXISTEM NO CLOUD do Figma Make mas
//      possivelmente não estão todos commitados no git local. Por isso o mapa
//      pode ter poucos itens localmente — isso é esperado.
function buildHashMap(): Map<string, string> {
  const map = new Map<string, string>()
  const scanDirs = [
    path.join(PROJECT_ROOT, 'src', 'imports'),
    path.join(PROJECT_ROOT, 'src', 'imports', 'HomeUp1440'),
    path.join(PROJECT_ROOT, 'public', 'figma-assets'),
  ]

  let totalScanned = 0
  let totalMapped  = 0

  for (const dir of scanDirs) {
    if (!fs.existsSync(dir)) continue
    let entries: string[]
    try { entries = fs.readdirSync(dir) } catch { continue }

    for (const file of entries) {
      if (!/\.(png|jpe?g|gif|webp)$/i.test(file)) continue
      totalScanned++
      const full = path.join(dir, file)
      try {
        const data = fs.readFileSync(full)
        const sha1 = createHash('sha1').update(data).digest('hex')
        map.set(`${sha1}.png`, full)
        map.set(sha1, full)
        totalMapped++
        // Se o arquivo JÁ tem nome de hash (ex: public/figma-assets/ABCD.png)
        const nameNoExt = path.basename(file, path.extname(file))
        if (/^[a-f0-9]{40}$/i.test(nameNoExt)) {
          map.set(file, full)
          map.set(nameNoExt, full)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.warn(`[figma-asset]   ↳ erro ao ler ${file}: ${msg}`)
      }
    }
  }

  console.log(`[figma-asset]   ↳ ${totalScanned} PNGs encontrados localmente, ${totalMapped} com SHA-1 calculado`)
  console.log(`[figma-asset]   ↳ (${totalScanned - totalMapped} erros de leitura)`)
  console.log(`[figma-asset]   ↳ Nota: image-NNN.png existem no cloud Figma Make mas`)
  console.log(`[figma-asset]     podem não estar commitados no git local — comportamento esperado.`)
  console.log(`[figma-asset]     Para imagens faltando: node scripts/map-figma-assets.mjs`)

  return map
}

console.log('[figma-asset] 🔍 Calculando SHA-1 dos PNGs locais …')
const HASH_MAP = buildHashMap()
console.log(`[figma-asset] ✅ ${HASH_MAP.size / 2} SHA-1 únicos no mapa`)

// ─── filename/hash → data-URI base64 ─────────────────────────────────────────
function toDataUri(filename: string): string | null {
  // 1) Lookup no mapa SHA-1 (arquivos locais com SHA-1 conhecido)
  const filepath = HASH_MAP.get(filename)
  if (filepath) {
    try {
      const data = fs.readFileSync(filepath)
      const ext  = path.extname(filepath).slice(1).toLowerCase()
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
      return `data:${mime};base64,${data.toString('base64')}`
    } catch { /* continua */ }
  }

  // 2) Fallback: procura pelo nome exato (ex: após download para public/figma-assets/)
  for (const dir of [
    path.join(PROJECT_ROOT, 'public', 'figma-assets'),
    path.join(PROJECT_ROOT, 'src', 'imports'),
    path.join(PROJECT_ROOT, 'src', 'imports', 'HomeUp1440'),
  ]) {
    const full = path.join(dir, filename)
    if (fs.existsSync(full)) {
      try {
        const data = fs.readFileSync(full)
        const ext  = path.extname(filename).slice(1).toLowerCase()
        const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
        return `data:${mime};base64,${data.toString('base64')}`
      } catch { /* continua */ }
    }
  }

  return null
}

/**
 * Plugin 1 — figmaAssetPlugin  (enforce: 'pre')
 *
 * REGRA CRÍTICA: resolveId retorna undefined para hashes não encontrados,
 * deixando-os passar para o Figma Make (cloud) resolver via CDN.
 * Localmente o Plugin 2 (fallback) captura o que sobrar.
 *
 * Fluxo:
 *   CLOUD → found: resolveId → real file path → URL ✅
 *   CLOUD → !found: plugin nativo do Figma Make → CDN ✅
 *   LOCAL → found: resolveId → real file path → URL (não base64) ✅
 *   LOCAL → !found: Plugin 2 → PLACEHOLDER_1X1 ✅ (sem crash)
 */
function figmaAssetPlugin(): Plugin {
  return {
    name: 'figma-asset',
    enforce: 'pre',

    resolveId(id: string) {
      if (!id.startsWith('figma:asset/')) return
      const filename = id.slice('figma:asset/'.length)
      const filepath = HASH_MAP.get(filename)
      // Encontrado localmente → retorna caminho real → Vite gera URL, não base64
      if (filepath) return filepath
      // Não encontrado → undefined → Figma Make CDN ou figmaAssetLocalFallback assumem
    },
  }
}

/**
 * Plugin 2 — figmaAssetLocalFallback  (sem enforce — roda por último)
 *
 * Captura "figma:asset/" que nenhum outro plugin resolveu.
 * Em cloud: plugin nativo do Figma Make já resolveu antes de chegar aqui.
 * Localmente: placeholder 1×1 transparente. Sem require(), sem zlib.
 */
function figmaAssetLocalFallback(): Plugin {
  const VIRTUAL = '\0figma-asset-fallback:'
  return {
    name: 'figma-asset-local-fallback',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) return VIRTUAL + id.slice('figma:asset/'.length)
    },
    load(id: string) {
      if (!id.startsWith(VIRTUAL)) return
      return `export default "${PLACEHOLDER_1X1}";`
    },
  }
}

/**
 * Plugin 3 — fallback para imports de imagens físicas inexistentes no disco
 */
function missingImagePlugin(): Plugin {
  const IMG_RE  = /\.(png|jpe?g|gif|webp|avif|svg)(\?.*)?$/i
  const VIRTUAL = '\0missing-img:'
  return {
    name: 'missing-image-fallback',
    enforce: 'pre',
    resolveId(id: string, importer?: string) {
      if (!IMG_RE.test(id)) return
      if (!id.startsWith('.') && !path.isAbsolute(id)) return
      if (!importer) return
      const base = id.startsWith('.')
        ? path.resolve(path.dirname(importer.replace(/\0.*/, '')), id.split('?')[0])
        : id.split('?')[0]
      if (!fs.existsSync(base)) return VIRTUAL + base
    },
    load(id: string) {
      if (id.startsWith(VIRTUAL)) return `export default "${PLACEHOLDER_1X1}";`
    },
  }
}

/**
 * Plugin 4 — transforma Hero2.tsx via esbuild (sem limite de 500 KB do Babel)
 */
function hero2EsbuildPlugin(): Plugin {
  const HERO2_RE = /\/imports\/Hero2\.tsx$/
  return {
    name: 'hero2-esbuild',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!HERO2_RE.test(id)) return null
      return transformWithEsbuild(code, id, {
        loader: 'tsx', jsx: 'automatic', target: 'es2020',
      })
    },
  }
}

/**
 * Plugin 5 — pdfInlinePlugin
 * Intercepta imports de arquivos .pdf e retorna o conteúdo como data URI base64.
 * Evita requisições diretas a /src/imports/*.pdf que o proxy do Figma Make bloqueia (403).
 */
function pdfInlinePlugin(): Plugin {
  const VIRTUAL = '\0pdf-inline:';
  const PDF_RE  = /\.pdf(\?.*)?$/i;
  return {
    name: 'pdf-inline',
    enforce: 'pre',
    resolveId(id: string, importer?: string) {
      if (!PDF_RE.test(id)) return;
      if (!importer) return;
      const cleanId = id.split('?')[0];
      let resolved: string;
      if (path.isAbsolute(cleanId)) {
        resolved = cleanId;
      } else if (cleanId.startsWith('.')) {
        resolved = path.resolve(path.dirname(importer.replace(/\0.*/, '')), cleanId);
      } else {
        return;
      }
      // Sempre intercepta imports .pdf (arquivo pode não existir — tratado no load)
      return VIRTUAL + resolved;
    },
    load(id: string) {
      if (!id.startsWith(VIRTUAL)) return;
      const filepath = id.slice(VIRTUAL.length);
      // Tenta NFC primeiro, depois NFD (macOS/Linux podem divergir na normalização Unicode)
      const candidates = [
        filepath,
        filepath.normalize('NFC'),
        filepath.normalize('NFD'),
      ];
      for (const fp of candidates) {
        try {
          const data   = fs.readFileSync(fp);
          const base64 = data.toString('base64');
          console.log(`[pdf-inline] ✅ ${path.basename(fp)} (${Math.round(data.length / 1024)} KB inlined)`);
          return `export default "data:application/pdf;base64,${base64}";`;
        } catch {
          // tenta próximo candidato
        }
      }
      console.warn(`[pdf-inline] ⚠️  Não encontrado: ${path.basename(filepath)}`);
      return `export default "";`;  // string vazia — botão ficará desabilitado
    },
  };
}

/**
 * Plugin 6 — namedAssetsServerPlugin
 * Em modo dev (Figma Make preview), serve os arquivos de src/imports/ na rota
 * /named-assets/FILENAME para que o script download-named-assets.mjs consiga
 * baixar as imagens REAIS. Sem isso, a SPA intercepta a rota e devolve
 * index.html (~18 KB) em vez da imagem.
 */
function namedAssetsServerPlugin(): Plugin {
  const MIME: Record<string, string> = {
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif':  'image/gif',
    '.svg':  'image/svg+xml',
  };

  return {
    name: 'named-assets-server',
    configureServer(server) {
      server.middlewares.use('/named-assets', (req, res, next) => {
        // Remove query string e barra inicial
        const rawUrl  = (req.url ?? '').split('?')[0].replace(/^\//, '');
        if (!rawUrl) { next(); return; }

        const ext = path.extname(rawUrl).toLowerCase();
        const mime = MIME[ext];
        if (!mime) { next(); return; }

        // Tenta encontrar em src/imports/
        const filepath = path.join(PROJECT_ROOT, 'src', 'imports', rawUrl);
        if (!fs.existsSync(filepath)) { next(); return; }

        try {
          const data = fs.readFileSync(filepath);
          res.writeHead(200, {
            'Content-Type': mime,
            'Content-Length': String(data.length),
            'Cache-Control': 'no-store',
          });
          res.end(data);
          console.log(`[named-assets-server] ✅ ${rawUrl} (${Math.round(data.length / 1024)} KB)`);
        } catch (e) {
          console.error(`[named-assets-server] ❌ ${rawUrl}: ${e}`);
          next();
        }
      });
    },
  };
}

export default defineConfig({
  // O GitHub Pages serve o site em /<repo>/, não na raiz. BASE_PATH é definido
  // no workflow; local fica '/' e nada muda.
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    figmaAssetPlugin(),
    figmaAssetLocalFallback(),
    missingImagePlugin(),
    pdfInlinePlugin(),
    hero2EsbuildPlugin(),
    namedAssetsServerPlugin(),
    react({ exclude: [/\/imports\/Hero2\.tsx$/] }),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // ─── Dev server: serve src/imports/ em /named-assets/ ──────────────────────
  // Permite que o download-named-assets.mjs baixe as imagens REAIS do preview.
  // Sem isso, a SPA intercepta qualquer rota e devolve index.html (~18 KB).
  server: {
    fs: { strict: false },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/imports/Hero2'))   return 'hero2'
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/react-router')) return 'vendor-router'
        },
      },
    },
    chunkSizeWarningLimit: 600,
    assetsInlineLimit:     0,  // nunca inlinar imagens como base64
  },
})