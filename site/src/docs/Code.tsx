import { useEffect, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/components/ui/cn'
import { cached, highlight, type Lang } from './highlight'

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!done) return
    const t = setTimeout(() => setDone(false), 1500)
    return () => clearTimeout(t)
  }, [done])
  return (
    <button
      type="button"
      aria-label={done ? 'Copied' : 'Copy'}
      onClick={() => navigator.clipboard.writeText(text).then(() => setDone(true))}
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-md text-dim transition hover:bg-surface-hover hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
        className,
      )}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}

/** Highlighted block; renders plain text until shiki loads. */
export function Code({
  code,
  lang = 'tsx',
  title,
  toolbar,
  className,
  maxHeight,
}: {
  code: string
  lang?: Lang
  title?: string
  toolbar?: ReactNode
  className?: string
  maxHeight?: number
}) {
  const text = code.trimEnd()
  const [html, setHtml] = useState(() => cached(text, lang))

  useEffect(() => {
    let alive = true
    highlight(text, lang).then((h) => alive && setHtml(h))
    return () => {
      alive = false
    }
  }, [text, lang])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-hairline bg-surface',
        className,
      )}
    >
      {(title || toolbar) && (
        <div className="flex h-11 items-center gap-2 border-b border-hairline pr-2 pl-4 text-[13px] text-dim">
          {title && <span className="font-mono">{title}</span>}
          <div className="flex min-w-0 flex-1 items-center self-stretch">{toolbar}</div>
          <CopyButton text={text} />
        </div>
      )}
      {!title && !toolbar && <CopyButton text={text} className="absolute top-2.5 right-2.5 z-10" />}
      <div
        style={{ maxHeight }}
        className="overflow-auto px-4 py-3.5 font-mono text-[13px] leading-6 [&_pre]:outline-none"
      >
        {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre>{text}</pre>}
      </div>
    </div>
  )
}

/** Inline `code`. */
export function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md bg-surface-hover px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
      {children}
    </code>
  )
}
