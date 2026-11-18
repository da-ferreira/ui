import { useState } from 'react'
import { useParams } from 'react-router'
import { Code } from '../docs/Code'
import { Command } from '../docs/Command'
import { COMPONENTS, example, pieceSource } from '../docs/components'
import { PageHeader } from '../docs/PageHeader'
import { Preview } from '../docs/Preview'
import { H2, H3, P, Steps } from '../docs/Prose'
import { PropsTable } from '../docs/PropsTable'
import { Tabs } from '../docs/Tabs'
import { NotFound } from './NotFound'

export function ComponentPage() {
  const { slug } = useParams()
  const doc = COMPONENTS.find((c) => c.slug === slug)
  if (!doc) return <NotFound />

  const [first, ...rest] = doc.examples
  const main = example(first.id)

  return (
    <>
      <title>{`${doc.name} — @davidalmeida/ui`}</title>
      <PageHeader title={doc.name} description={doc.description} />
      <Preview
        example={main.Component}
        code={main.code}
        className={
          slug === 'sidebar' ? 'overflow-hidden p-0 sm:p-0 [transform:translateZ(0)]' : undefined
        }
      />
      {first.note && <P>{first.note}</P>}

      <H2>Installation</H2>
      <Install add={doc.add} files={doc.files} npm={doc.npm} />

      <H2>Usage</H2>
      <div className="flex flex-col gap-3">
        <Code code={doc.usage.imports} />
        <Code code={doc.usage.code} />
      </div>

      {rest.length > 0 && <H2>Examples</H2>}
      {rest.map((e) => {
        const ex = example(e.id)
        return (
          <section key={e.id}>
            <H3>{e.title ?? e.id}</H3>
            {e.note && <P>{e.note}</P>}
            <Preview example={ex.Component} code={ex.code} />
          </section>
        )
      })}

      <H2>API Reference</H2>
      {doc.api.map((a) => (
        <section key={a.name}>
          <H3>{a.name}</H3>
          {a.note && <P>{a.note}</P>}
          {a.rows.length > 0 && <PropsTable rows={a.rows} />}
        </section>
      ))}

      {doc.notes && (
        <>
          <H2>Notes</H2>
          {doc.notes.map((n) => (
            <P key={n}>{n}</P>
          ))}
        </>
      )}
    </>
  )
}

function Install({ add, files, npm }: { add: string; files: string[]; npm?: string[] }) {
  const [mode, setMode] = useState<'cli' | 'manual'>('cli')
  return (
    <div className="flex flex-col gap-4">
      <Tabs
        label="Installation"
        value={mode}
        onChange={setMode}
        items={[
          { value: 'cli', label: 'Command' },
          { value: 'manual', label: 'Manual' },
        ]}
        className="border-b border-hairline"
      />
      {mode === 'cli' ? (
        <Command args={`add ${add}`} />
      ) : (
        <Steps>
          <H3 id="manual-deps">Install the dependencies</H3>
          <Code lang="bash" code={`npm install ${['clsx', ...(npm ?? [])].join(' ')}`} />
          <H3 id="manual-copy">Copy the files into your project</H3>
          <P>Put them side by side, e.g. in src/components/ui.</P>
          <div className="flex flex-col gap-3">
            {files.map((f) => (
              <Code key={f} title={f} code={pieceSource(f)} maxHeight={360} />
            ))}
          </div>
          <H3 id="manual-theme">Import the theme</H3>
          <P>The pieces use the tokens from the package CSS — see Theming.</P>
        </Steps>
      )}
    </div>
  )
}
