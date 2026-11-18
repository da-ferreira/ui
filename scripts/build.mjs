// Builds the published content (registry/ and tailwind.css) and the shadcn registry (site/public/r) from src/.
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgDir = fileURLToPath(new URL('../', import.meta.url))
const components = join(pkgDir, 'src/components')
const styles = join(pkgDir, 'src/styles')
const out = join(pkgDir, 'registry')

const PEERS = new Set(['react', 'react-dom'])

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const packageRoot = (spec) =>
  spec
    .split('/')
    .slice(0, spec.startsWith('@') ? 2 : 1)
    .join('/')

const pkg = JSON.parse(await readFile(join(pkgDir, 'package.json'), 'utf8'))
const versions = pkg.devDependencies ?? {}

await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })

const items = {}
for (const file of (await readdir(components)).filter((f) => /\.tsx?$/.test(f)).sort()) {
  const code = await readFile(join(components, file), 'utf8')
  const dependencies = new Set()
  const npm = {}
  for (const [, spec] of code.matchAll(/from\s+'([^']+)'/g)) {
    if (spec.startsWith('./')) dependencies.add(kebab(spec.slice(2)))
    else if (spec.startsWith('.') || spec.startsWith('@/'))
      throw new Error(`${file}: import "${spec}" leaves the components folder`)
    else {
      const name = packageRoot(spec)
      if (PEERS.has(name)) continue
      if (!versions[name]) throw new Error(`${file}: "${name}" is not in devDependencies`)
      npm[name] = versions[name]
    }
  }
  items[kebab(file.replace(/\.tsx?$/, ''))] = {
    file,
    dependencies: [...dependencies].sort(),
    npm,
  }
  await copyFile(join(components, file), join(out, file))
}

const { version } = pkg
await writeFile(join(out, 'registry.json'), JSON.stringify({ version, items }, null, 2) + '\n')

const css = await Promise.all(
  ['tokens.css', 'theme.css'].map((f) => readFile(join(styles, f), 'utf8')),
)
await writeFile(
  join(pkgDir, 'tailwind.css'),
  `/* @davidalmeida/ui ${version}: import after @import 'tailwindcss'. */\n\n${css.join('\n')}`,
)

// shadcn registry: same pieces, installable with `npx shadcn add <url>`.
const base = `${pkg.homepage}/r`
const shadcnOut = join(pkgDir, 'site/public/r')
await rm(shadcnOut, { recursive: true, force: true })
await mkdir(shadcnOut, { recursive: true })

const vars = (block) =>
  Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]),
  )
const block = (code, head) => code.match(new RegExp(`${head}\\s*\\{([^}]*)\\}`))[1]
const rules = (code) =>
  Object.fromEntries(
    [...code.matchAll(/@layer base \{([\s\S]*?)\n\}/g)]
      .flatMap(([, inner]) => [...inner.matchAll(/([^{}]+)\{([^{}]+)\}/g)])
      .map(([, sel, decl]) => [
        sel.trim().replace(/\s*\n\s*/g, ' '),
        Object.fromEntries(
          decl
            .split(';')
            .filter((d) => d.trim())
            .map((d) => d.split(':').map((x) => x.trim())),
        ),
      ]),
  )
const [tokens, theme] = css
const { 'font-sans': _s, 'font-mono': _m, ...colors } = vars(block(theme, '@theme inline'))
const { 'color-scheme': _c, ...dark } = vars(block(tokens, '\\.dark'))
const write = (name, item) =>
  writeFile(
    join(shadcnOut, `${name}.json`),
    JSON.stringify(
      { $schema: 'https://ui.shadcn.com/schema/registry-item.json', name, ...item },
      null,
      2,
    ) + '\n',
  )

await write('theme', {
  type: 'registry:theme',
  title: 'Theme',
  description: 'Light and dark tokens and the utilities the components use (bg-canvas, text-ink…).',
  cssVars: { theme: colors, light: vars(block(tokens, ':root')), dark },
  css: { '@layer base': { '.dark': { 'color-scheme': 'dark' }, ...rules(theme) } },
})

const title = (name) =>
  name
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
const index = []
for (const [name, { file, dependencies, npm }] of Object.entries(items)) {
  const item = {
    type: 'registry:ui',
    title: title(name),
    dependencies: Object.entries(npm).map(([n, v]) => `${n}@${v}`),
    registryDependencies: [...dependencies, 'theme'].map((d) => `${base}/${d}.json`),
    files: [{ path: `ui/${file}`, type: 'registry:ui' }],
  }
  index.push({ name, ...item })
  item.files[0].content = await readFile(join(components, file), 'utf8')
  await write(name, item)
}
await writeFile(
  join(shadcnOut, 'registry.json'),
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'davidalmeida-ui',
      homepage: pkg.homepage,
      items: [{ name: 'theme', type: 'registry:theme', title: 'Theme' }, ...index],
    },
    null,
    2,
  ) + '\n',
)

console.log(
  `${Object.keys(items).length} components in registry/ + tailwind.css + site/public/r (${version})`,
)
