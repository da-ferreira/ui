import type { ReactNode } from 'react'
import { Link as LinkIcon } from 'lucide-react'

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Section heading with an anchor; the table of contents picks up every h2/h3 with an id. */
export function H2({ children, id }: { children: string; id?: string }) {
  const anchor = id ?? slugify(children)
  return (
    <h2
      id={anchor}
      className="group mt-12 mb-4 scroll-mt-20 text-xl font-semibold tracking-tight text-ink first:mt-0"
    >
      <a href={`#${anchor}`} className="inline-flex items-center gap-2 outline-none">
        {children}
        <LinkIcon
          aria-hidden
          className="size-4 text-faint opacity-0 transition group-hover:opacity-100"
        />
      </a>
    </h2>
  )
}

export function H3({ children, id }: { children: string; id?: string }) {
  const anchor = id ?? slugify(children)
  return (
    <h3 id={anchor} className="mt-8 mb-3 scroll-mt-20 text-base font-semibold text-ink">
      {children}
    </h3>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p className="my-3 text-[15px] leading-7 text-ink-soft">{children}</p>
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="my-3 ml-5 list-disc space-y-1.5 text-[15px] leading-7 text-ink-soft marker:text-faint">
      {children}
    </ul>
  )
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="font-medium text-ink underline decoration-field underline-offset-4 transition hover:decoration-ink"
    >
      {children}
    </a>
  )
}

export function Steps({ children }: { children: ReactNode }) {
  return (
    <div className="ml-3 border-l border-hairline pl-7 [counter-reset:step] [&>h3]:relative [&>h3]:[counter-increment:step] [&>h3]:before:absolute [&>h3]:before:-left-[42px] [&>h3]:before:flex [&>h3]:before:size-7 [&>h3]:before:items-center [&>h3]:before:justify-center [&>h3]:before:rounded-full [&>h3]:before:border-4 [&>h3]:before:border-canvas [&>h3]:before:bg-surface-hover [&>h3]:before:font-mono [&>h3]:before:text-xs [&>h3]:before:content-[counter(step)]">
      {children}
    </div>
  )
}
