#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_DIR = dirname(fileURLToPath(import.meta.url))
const { name: NAME, version: VERSION } = JSON.parse(
  readFileSync(join(PKG_DIR, 'package.json'), 'utf8'),
)
const REGISTRY = JSON.parse(readFileSync(join(PKG_DIR, 'registry/registry.json'), 'utf8')).items
const CONFIG = 'davidalmeida-ui.json'
const CSS_IMPORT = `@import '${NAME}/tailwind.css';`
const LIKELY_CSS = [
  'src/index.css',
  'src/styles/index.css',
  'src/styles/globals.css',
  'src/app/globals.css',
  'app/globals.css',
  'styles/globals.css',
]

const cwd = process.cwd()
const [command, ...rest] = process.argv.slice(2)
const flags = Object.fromEntries(
  rest
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [key, value = true] = a.slice(2).split('=')
      return [key, value]
    }),
)
const names = rest.filter((a) => !a.startsWith('--'))

const fail = (msg) => {
  console.error(`✖ ${msg}`)
  process.exit(1)
}

function readJson(file) {
  const path = join(cwd, file)
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null
}

function config() {
  return readJson(CONFIG) ?? fail(`${CONFIG} not found. Run first: npx ${NAME} init`)
}

function install(packages) {
  const pkg = readJson('package.json') ?? {}
  const has = { ...pkg.dependencies, ...pkg.devDependencies }
  const missing = Object.entries(packages)
    .filter(([name]) => !has[name])
    .map(([name, version]) => `${name}@${version}`)
  if (!missing.length) return
  const manager = existsSync(join(cwd, 'pnpm-lock.yaml'))
    ? ['pnpm', 'add']
    : existsSync(join(cwd, 'yarn.lock'))
      ? ['yarn', 'add']
      : existsSync(join(cwd, 'bun.lock')) || existsSync(join(cwd, 'bun.lockb'))
        ? ['bun', 'add']
        : ['npm', 'install']
  console.log(`→ ${manager.join(' ')} ${missing.join(' ')}`)
  const r = spawnSync(manager[0], [...manager.slice(1), ...missing], {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (r.status !== 0) fail('installing dependencies failed')
}

const normalize = (name) =>
  name
    .replace(/\.tsx?$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()

function resolve(requested) {
  const all = new Set()
  const visit = (name) => {
    if (all.has(name)) return
    if (!REGISTRY[name]) fail(`component "${name}" does not exist. See: npx ${NAME} list`)
    all.add(name)
    REGISTRY[name].dependencies.forEach(visit)
  }
  requested.map(normalize).forEach(visit)
  return [...all]
}

async function init() {
  if (!readJson('package.json')) fail('run it inside a project (package.json not found)')
  const dir = flags.dir ?? readJson(CONFIG)?.dir ?? 'src/components/ui'
  const css =
    flags.css ??
    LIKELY_CSS.find(
      (f) => existsSync(join(cwd, f)) && readFileSync(join(cwd, f), 'utf8').includes('tailwindcss'),
    ) ??
    fail("could not find the CSS with @import 'tailwindcss'. Pass it with --css=path/to.css")

  let content = await readFile(join(cwd, css), 'utf8')
  if (!content.includes(CSS_IMPORT)) {
    const line = content.match(/^@import\s+['"]tailwindcss['"].*$/m)
    content = line
      ? content.replace(line[0], `${line[0]}\n${CSS_IMPORT}`)
      : `@import 'tailwindcss';\n${CSS_IMPORT}\n\n${content}`
    await writeFile(join(cwd, css), content)
    console.log(`✔ ${css}: theme imported`)
  }

  await writeFile(join(cwd, CONFIG), JSON.stringify({ dir, css }, null, 2) + '\n')
  console.log(`✔ ${CONFIG} created (components in ${dir})`)
  install({ [NAME]: `^${VERSION}` })
  console.log(`\nDone. Add components with: npx ${NAME} add button`)
}

async function add() {
  const { dir } = config()
  const requested = flags.all ? Object.keys(REGISTRY) : names
  if (!requested.length) fail(`which components? npx ${NAME} add button modal (or --all)`)

  await mkdir(join(cwd, dir), { recursive: true })
  const npm = {}
  const changed = []
  for (const name of resolve(requested)) {
    const { file, npm: deps } = REGISTRY[name]
    Object.assign(npm, deps)
    const incoming = readFileSync(join(PKG_DIR, 'registry', file), 'utf8')
    const target = join(cwd, dir, file)
    if (existsSync(target)) {
      if (readFileSync(target, 'utf8') === incoming) {
        console.log(`· ${file} is up to date`)
        continue
      }
      if (!flags.overwrite) {
        changed.push(name)
        console.log(`! ${file} exists and differs — kept`)
        continue
      }
    }
    await writeFile(target, incoming)
    console.log(`✔ ${join(dir, file)}`)
  }
  install(npm)
  if (changed.length)
    console.log(
      `\nSee the difference with: npx ${NAME} diff ${changed.join(' ')}\nTo replace: npx ${NAME} add ${changed.join(' ')} --overwrite`,
    )
}

function diff() {
  const { dir } = config()
  const targets = names.length
    ? names.map(normalize)
    : Object.keys(REGISTRY).filter((n) => existsSync(join(cwd, dir, REGISTRY[n].file)))
  let differing = 0
  for (const name of targets) {
    if (!REGISTRY[name]) fail(`component "${name}" does not exist`)
    const local = join(cwd, dir, REGISTRY[name].file)
    const packaged = join(PKG_DIR, 'registry', REGISTRY[name].file)
    if (!existsSync(local)) {
      console.log(`· ${name}: not installed`)
      continue
    }
    if (readFileSync(local, 'utf8') === readFileSync(packaged, 'utf8')) continue
    differing++
    if (!names.length) {
      console.log(`! ${name}: differs from version ${VERSION}`)
      continue
    }
    // git diff signs: "-" is your copy, "+" is the package version.
    const r = spawnSync(
      'git',
      ['diff', '--no-index', '--color', relative(cwd, local), relative(cwd, packaged)],
      { cwd, stdio: 'inherit' },
    )
    if (r.error) console.log(`! ${name}: differs (install git to see the lines)`)
  }
  if (!differing) console.log(`✔ everything matches version ${VERSION}`)
}

function list() {
  for (const [name, { dependencies, npm }] of Object.entries(REGISTRY)) {
    const uses = [...dependencies, ...Object.keys(npm)].join(', ')
    console.log(`${name}${uses ? `  (uses ${uses})` : ''}`)
  }
}

const HELP = `${NAME} ${VERSION}

  npx ${NAME} init [--dir=src/components/ui] [--css=src/index.css]
  npx ${NAME} add <component...> [--all] [--overwrite]
  npx ${NAME} diff [component...]
  npx ${NAME} list`

const commands = { init, add, diff, list }
if (!commands[command]) console.log(HELP)
else await commands[command]()
