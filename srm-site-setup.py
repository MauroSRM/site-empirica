import os, shutil

SRC = "/Users/luiz.oliveira/Documents/GitHub/Aiplayground"
DEST = "/Users/luiz.oliveira/Documents/GitHub/srm-site"

dirs = [
    "src/app/pages/site/poc2",
    "src/app/pages/site/components",
    "src/app/pages/site/hooks",
    "src/app/components/figma",
    "src/styles",
    "src/imports",
    "public",
]
for d in dirs:
    os.makedirs(f"{DEST}/{d}", exist_ok=True)

def cp(a, b):
    try: shutil.copy2(a, b); print(f"OK {a}")
    except Exception as e: print(f"ERRO {a}: {e}")

def cpdir(a, b):
    try: shutil.copytree(a, b, dirs_exist_ok=True); print(f"OK dir {a}")
    except Exception as e: print(f"ERRO dir {a}: {e}")

cp(f"{SRC}/index-poc2.html",                                 f"{DEST}/index.html")
cp(f"{SRC}/vite.poc2.config.ts",                             f"{DEST}/vite.config.ts")
cp(f"{SRC}/postcss.config.mjs",                              f"{DEST}/postcss.config.mjs")
cp(f"{SRC}/src/main-poc2.tsx",                               f"{DEST}/src/main.tsx")
cp(f"{SRC}/src/styles/global.css",                           f"{DEST}/src/styles/")
cp(f"{SRC}/src/styles/fonts.css",                            f"{DEST}/src/styles/")
cp(f"{SRC}/src/styles/index.css",                            f"{DEST}/src/styles/")
cp(f"{SRC}/src/styles/theme.css",                            f"{DEST}/src/styles/")
cp(f"{SRC}/src/styles/tailwind.css",                         f"{DEST}/src/styles/")
cp(f"{SRC}/src/styles/design-tokens.css",                    f"{DEST}/src/styles/")
cp(f"{SRC}/src/app/pages/site/SitePoc2Page.tsx",             f"{DEST}/src/app/pages/site/")
cp(f"{SRC}/src/app/components/figma/ImageWithFallback.tsx",  f"{DEST}/src/app/components/figma/")
cp(f"{SRC}/src/app/pages/site/hooks/useMobile.ts",           f"{DEST}/src/app/pages/site/hooks/")

poc2_dir = f"{SRC}/src/app/pages/site/poc2"
for f in os.listdir(poc2_dir):
    if f.endswith(".tsx"):
        cp(f"{poc2_dir}/{f}", f"{DEST}/src/app/pages/site/poc2/")

comp_dir = f"{SRC}/src/app/pages/site/components"
for f in os.listdir(comp_dir):
    if f.startswith("Poc2") and f.endswith(".tsx"):
        cp(f"{comp_dir}/{f}", f"{DEST}/src/app/pages/site/components/")

cpdir(f"{SRC}/src/imports", f"{DEST}/src/imports")
cpdir(f"{SRC}/public",      f"{DEST}/public")

pkg = """{
  "name": "srm-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.487.0",
    "motion": "^12.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router": "^7.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^6.0.0"
  }
}
"""
with open(f"{DEST}/package.json", "w") as f:
    f.write(pkg)
print("OK package.json")

gitignore = "node_modules/\ndist/\n.DS_Store\n*.local\n"
with open(f"{DEST}/.gitignore", "w") as f:
    f.write(gitignore)
print("OK .gitignore")

print("\n✅ Projeto srm-site criado!")
print(f"👉 cd {DEST} && npm install && npm run dev")
