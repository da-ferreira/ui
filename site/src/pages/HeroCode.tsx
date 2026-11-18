import { useEffect, useState } from 'react'
import { cn } from '@/components/ui/cn'
import { CopyButton } from '../docs/Code'
import { COMPONENTS } from '../docs/components'
import { cached, highlight, type Lang } from '../docs/highlight'
import { RUN, useManager } from '../docs/pm'

type Sample = { label: string; add: string; file: string; code: string }

const SAMPLES: Sample[] = [
  {
    label: 'Select',
    add: 'select',
    file: 'ModelField.tsx',
    code: `import { Select } from '@/components/ui/Select'

export function ModelField({ model, setModel }) {
  return (
    <Select
      aria-label="Model"
      value={model}
      onChange={setModel}
      options={[
        { value: 'llama', label: 'Llama 3.3 70B', group: 'Groq' },
        { value: 'gpt', label: 'GPT-4.1 mini', group: 'OpenAI' },
      ]}
    />
  )
}`,
  },
  {
    label: 'Modal',
    add: 'modal',
    file: 'Discard.tsx',
    code: `import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export function Discard({ onClose, onDiscard }) {
  return (
    <Modal label="Discard changes" onClose={onClose}>
      <div className="flex flex-col gap-4 p-5">
        <h2 className="text-lg font-semibold">Discard changes?</h2>
        <Button variant="danger" onClick={onDiscard}>
          Discard
        </Button>
      </div>
    </Modal>
  )
}`,
  },
  {
    label: 'Date Picker',
    add: 'date-picker',
    file: 'Schedule.tsx',
    code: `import { useState } from 'react'
import { DatePicker } from '@/components/ui/DatePicker'

export function Schedule() {
  const [date, setDate] = useState('2026-11-20')
  return (
    <DatePicker
      aria-label="Send on"
      value={date}
      onChange={setDate}
      locale="en-US"
    />
  )
}`,
  },
  {
    label: 'Toaster',
    add: 'toaster',
    file: 'Publish.tsx',
    code: `import { useState } from 'react'
import { Toaster, type Toast } from '@/components/ui/Toaster'

export function Publish() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const publish = () =>
    setToasts((t) => [...t, { id: Date.now(), type: 'success', message: 'Published' }])
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return <Toaster toasts={toasts} onDismiss={dismiss} />
}`,
  },
  {
    label: 'Sidebar',
    add: 'sidebar sidebar-layout',
    file: 'Shell.tsx',
    code: `import { Link } from 'react-router'
import { SidebarHeader, SidebarItem, SidebarNav } from '@/components/ui/Sidebar'
import { SidebarLayout } from '@/components/ui/SidebarLayout'

export function Shell({ children }) {
  return (
    <SidebarLayout
      sidebar={
        <>
          <SidebarHeader>acme</SidebarHeader>
          <SidebarNav>
            <SidebarItem as={Link} to="/" icon={<House />}>Home</SidebarItem>
          </SidebarNav>
        </>
      }
    >
      {children}
    </SidebarLayout>
  )
}`,
  },
]

function Highlighted({ code, lang }: { code: string; lang: Lang }) {
  const [html, setHtml] = useState(() => cached(code, lang))
  useEffect(() => {
    let alive = true
    highlight(code, lang).then((h) => alive && setHtml(h))
    return () => {
      alive = false
    }
  }, [code, lang])
  return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre>{code}</pre>
}

const pill =
  'h-8 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none'

/** Laravel-style code window: pick a component, see how it is used or how to add it. */
export function HeroCode() {
  const [index, setIndex] = useState(0)
  const [file, setFile] = useState<'code' | 'terminal'>('code')
  const [pm] = useManager()
  const sample = SAMPLES[index]
  const command = `${RUN[pm]} @davidalmeida/ui add ${sample.add}`
  const shown = file === 'code' ? sample.code : command
  const files = [
    ...new Set(
      sample.add.split(' ').flatMap((slug) => COMPONENTS.find((c) => c.slug === slug)?.files ?? []),
    ),
  ]

  return (
    <div className="relative min-w-0">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-16 -inset-y-20 -z-10 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_16%,transparent),transparent)]"
      />
      <div
        role="tablist"
        aria-label="Component"
        className="mx-auto mb-4 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-hairline bg-canvas/80 p-1 backdrop-blur"
      >
        {SAMPLES.map((s, i) => (
          <button
            key={s.label}
            type="button"
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              pill,
              i === index
                ? 'bg-surface text-ink shadow-sm ring-1 ring-hairline'
                : 'text-dim hover:text-ink',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-canvas shadow-[0_24px_60px_-30px_color-mix(in_oklab,var(--brand)_45%,transparent)]">
        <div className="flex items-stretch border-b border-hairline bg-surface">
          {(
            [
              ['code', sample.file],
              ['terminal', 'Terminal'],
            ] as const
          ).map(([key, name]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFile(key)}
              className={cn(
                'flex h-11 items-center gap-2 border-r border-hairline px-4 font-mono text-[13px] transition focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none focus-visible:ring-inset',
                file === key ? 'bg-canvas text-ink' : 'text-dim hover:text-ink',
              )}
            >
              <span
                aria-hidden
                className={cn('size-2 rounded-full', key === 'code' ? 'bg-brand' : 'bg-ok')}
              />
              {name}
            </button>
          ))}
          <CopyButton text={shown} className="my-auto mr-2 ml-auto" />
        </div>
        <div className="h-[420px] overflow-auto px-5 py-4 font-mono text-[13px] leading-6">
          {file === 'code' ? (
            <Highlighted code={sample.code} lang="tsx" />
          ) : (
            <div className="text-dim">
              <p className="whitespace-nowrap text-ink">
                <span className="text-faint select-none">$ </span>
                {command}
              </p>
              <p className="mt-2">Copying to src/components/ui</p>
              {files.map((f) => (
                <p key={f}>
                  <span className="text-ok">+ </span>
                  <span className="text-ink">{f}</span>
                </p>
              ))}
              <p className="mt-2">
                <span className="text-ok">✓</span> Done. The code is yours now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
