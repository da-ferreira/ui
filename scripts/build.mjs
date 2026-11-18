// Builds the published content (registry/ and tailwind.css) from src/.
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

console.log(`${Object.keys(items).length} components in registry/ + tailwind.css (${version})`)
