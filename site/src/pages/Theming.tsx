import { Code, C } from '../docs/Code'
import { PageHeader } from '../docs/PageHeader'
import { H2, P } from '../docs/Prose'

const TOKENS: [utility: string, variable: string, use: string][] = [
  ['bg-canvas', '--bg-canvas', 'Page and cards'],
  ['bg-surface', '--bg-surface', 'Subtle areas, hover'],
  ['bg-surface-hover', '--bg-surface-hover', 'Hover on surface, selected'],
  ['border-hairline', '--border-hairline', 'Dividers and cards'],
  ['border-field', '--border-field', 'Inputs and buttons'],
  ['text-ink', '--fg-ink', 'Main text'],
  ['text-ink-soft', '--fg-ink-soft', 'Labels'],
  ['text-dim', '--fg-dim', 'Secondary text'],
  ['text-faint', '--fg-faint', 'Placeholders, hints'],
  ['bg-brand', '--brand', 'Primary actions'],
  ['text-brand-ink', '--brand-ink', 'Text on brand'],
  ['bg-brand-soft', '--brand-soft', 'Brand tint'],
  ['ring-brand-area', '--brand-area', 'Focus ring'],
  ['text-ok', '--status-ok', 'Success'],
  ['text-caution', '--status-caution', 'Warning'],
  ['text-danger', '--status-danger', 'Error'],
]

export function Theming() {
  return (
    <>
      <title>Theming — @davidalmeida/ui</title>
      <PageHeader
        title="Theming"
        description="CSS variables with light and dark values, mapped to Tailwind utilities."
      />

      <H2>Import</H2>
      <P>
        <C>init</C> adds this line after <C>@import 'tailwindcss'</C>. It brings the tokens and the
        utilities.
      </P>
      <Code lang="css" code={`@import 'tailwindcss';\n@import '@davidalmeida/ui/tailwind.css';`} />

      <H2>Tokens</H2>
      <div className="overflow-x-auto rounded-xl border border-hairline">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-surface text-xs text-dim">
            <tr>
              <th className="px-4 py-2.5 font-medium">Utility</th>
              <th className="px-4 py-2.5 font-medium">Variable</th>
              <th className="px-4 py-2.5 font-medium">Use</th>
            </tr>
          </thead>
          <tbody>
            {TOKENS.map(([u, v, use]) => (
              <tr key={v} className="border-t border-hairline">
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="size-4 shrink-0 rounded border border-hairline"
                      style={{ background: `var(${v})` }}
                    />
                    <code className="font-mono text-[12.5px] text-ink">{u}</code>
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono text-[12.5px] text-dim">{v}</td>
                <td className="px-4 py-2.5 text-[13px] text-dim">{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Utilities work with any property: <C>bg-danger-soft</C>, <C>border-brand</C>,{' '}
        <C>text-dim</C>…
      </P>

      <H2>Your colors</H2>
      <P>Redefine the variables after the import. Do it in both themes when the value differs.</P>
      <Code
        lang="css"
        code={`:root {
  --brand: #7c3aed;
  --brand-soft: #f3effe;
}

.dark {
  --brand: #a78bfa;
  --brand-soft: #2a2140;
}`}
      />

      <H2>Dark mode</H2>
      <P>
        Dark values apply under a <C>.dark</C> class on any ancestor, usually <C>{'<html>'}</C>. The
        Theme Toggle component does that and saves the choice; to avoid a flash on load, apply it
        before the first paint:
      </P>
      <Code
        lang="html"
        title="index.html"
        code={`<script>
  try {
    const t = localStorage.getItem('theme')
    if (t === 'dark' || (t !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark')
  } catch {}
</script>`}
      />

      <H2>Fonts</H2>
      <P>
        The theme uses Inter and IBM Plex Mono (<C>font-sans</C>, <C>font-mono</C>). Load them in
        your project, e.g. from Google Fonts.
      </P>
      <Code
        lang="html"
        code={`<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>`}
      />
    </>
  )
}
