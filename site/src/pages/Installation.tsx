import { Code, C } from '../docs/Code'
import { Command } from '../docs/Command'
import { PageHeader } from '../docs/PageHeader'
import { H2, H3, P, Steps, UL } from '../docs/Prose'

export function Installation() {
  return (
    <>
      <title>Installation — @davidalmeida/ui</title>
      <PageHeader
        title="Installation"
        description="Set up a project and add components with the CLI."
      />
      <P>
        Requires React 19, Tailwind 4 and TypeScript — e.g. a Vite project with{' '}
        <C>@tailwindcss/vite</C>. Pick your package manager in any command; the choice is remembered
        on this site.
      </P>

      <Steps>
        <H3>Run init</H3>
        <P>
          Imports the theme into the CSS that has <C>@import 'tailwindcss'</C>, creates{' '}
          <C>davidalmeida-ui.json</C> and installs <C>clsx</C>.
        </P>
        <Command args="init" />

        <H3>Configure the @ alias</H3>
        <P>
          Components are imported from <C>@/components/ui</C>. In Vite:
        </P>
        <Code
          title="vite.config.ts"
          code={`import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
})`}
        />
        <P>
          And in <C>tsconfig.json</C>, <C>{'"paths": { "@/*": ["./src/*"] }'}</C>.
        </P>

        <H3>Add components</H3>
        <P>
          Copies the component and the ones it uses, and installs the npm packages that are missing.
        </P>
        <Command args="add button modal select" />

        <H3>Use them</H3>
        <Code
          code={`import { Button } from '@/components/ui/Button'

export default function App() {
  return <Button>Click me</Button>
}`}
        />
      </Steps>

      <H2>Commands</H2>
      <H3 id="cmd-add">add</H3>
      <Command args="add <component...>" />
      <UL>
        <li>
          <C>--all</C> adds every component.
        </li>
        <li>
          <C>--overwrite</C> replaces copies you changed; without it they are never touched.
        </li>
      </UL>
      <H3 id="cmd-diff">diff</H3>
      <P>Your copy against the version in the package. Without a name, checks all of them.</P>
      <Command args="diff [component]" />
      <H3 id="cmd-list">list</H3>
      <Command args="list" />
      <H3 id="cmd-init">init options</H3>
      <UL>
        <li>
          <C>--dir=</C> where components go (default <C>src/components/ui</C>).
        </li>
        <li>
          <C>--css=</C> the CSS file with <C>@import 'tailwindcss'</C>.
        </li>
      </UL>

      <H2>Package managers</H2>
      <P>
        Dependencies are installed with your project's manager, detected by the lockfile; without
        one, with the manager that ran the CLI. Yarn 4 refuses versions published less than a day
        ago (<C>npmMinimalAgeGate</C>) — right after a release, wait or use another manager.
      </P>
    </>
  )
}
