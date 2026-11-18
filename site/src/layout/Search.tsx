import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, FileText, Search as SearchIcon } from 'lucide-react'
import { cn } from '@/components/ui/cn'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { COMPONENT_LINKS, GETTING_STARTED } from './nav'

const ITEMS = [
  ...GETTING_STARTED.map((l) => ({ ...l, group: 'Getting started' })),
  ...COMPONENT_LINKS.map((l) => ({ ...l, group: 'Components' })),
]

export function SearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg border border-field bg-surface pr-1.5 pl-3 text-sm max-sm:w-9 max-sm:justify-center max-sm:p-0 text-dim transition hover:bg-surface-hover hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
          className,
        )}
      >
        <SearchIcon aria-hidden className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left max-sm:sr-only">Search documentation…</span>
        <kbd className="hidden rounded-md border border-hairline bg-canvas px-1.5 font-mono text-[11px] leading-5 sm:inline">
          ⌘K
        </kbd>
      </button>
      {open && <Palette onClose={() => setOpen(false)} />}
    </>
  )
}

function Palette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? ITEMS.filter((i) => i.title.toLowerCase().includes(q)) : ITEMS
  }, [query])

  function go(href: string) {
    onClose()
    navigate(href)
  }

  return (
    <Modal
      label="Search documentation"
      onClose={onClose}
      className="max-w-[560px] self-start sm:mt-[12vh]"
    >
      <div
        className="flex flex-col"
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            const step = e.key === 'ArrowDown' ? 1 : -1
            setActive((a) => Math.max(0, Math.min(results.length - 1, a + step)))
          } else if (e.key === 'Enter' && results[active]) {
            e.preventDefault()
            go(results[active].href)
          }
        }}
      >
        <div className="border-b border-hairline p-3">
          <Input
            autoFocus
            icon={<SearchIcon />}
            placeholder="Search documentation…"
            aria-label="Search documentation"
            role="combobox"
            aria-expanded
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `search-${active}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
          />
        </div>
        <div
          id="search-results"
          role="listbox"
          aria-label="Results"
          className="max-h-[min(400px,60vh)] overflow-y-auto p-1.5"
        >
          {!results.length && <p className="px-3 py-6 text-center text-sm text-dim">No results.</p>}
          {results.map((r, i) => (
            <div key={r.href}>
              {r.group !== results[i - 1]?.group && (
                <p className="px-2.5 pt-2 pb-1 text-[11px] text-dim">{r.group}</p>
              )}
              <button
                id={`search-${i}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={i === active}
                ref={(el) => {
                  if (i === active) el?.scrollIntoView({ block: 'nearest' })
                }}
                onMouseMove={() => setActive(i)}
                onClick={() => go(r.href)}
                className={cn(
                  'flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm text-ink',
                  i === active && 'bg-surface-hover',
                )}
              >
                {r.group === 'Components' ? (
                  <Box aria-hidden className="size-4 text-dim" />
                ) : (
                  <FileText aria-hidden className="size-4 text-dim" />
                )}
                {r.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
