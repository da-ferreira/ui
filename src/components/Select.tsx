import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { Badge } from './Badge'
import { cn } from './cn'
import { Truncate } from './Truncate'

export type SelectOption<T extends string | number = string> = {
  value: T
  label: string
  /** Consecutive options with the same group get a header. */
  group?: string
  description?: string
  badge?: string
}

const MAX_HEIGHT = 320
const MARGIN = 8

type Props<T extends string | number> = {
  value: T | '' | null | undefined
  options: SelectOption<T>[]
  onChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
  'aria-label': string
  title?: string
  className?: string
  /** Replaces the trigger look (chip, dashed button…). */
  triggerClassName?: string
  /** Replaces the trigger content; without it, shows the chosen option label. */
  children?: ReactNode
  /** Minimum list width, for narrow triggers. */
  minListWidth?: number
}

export function Select<T extends string | number>({
  value,
  options,
  onChange,
  placeholder = 'Selecionar',
  disabled,
  title,
  className,
  triggerClassName,
  children,
  minListWidth = 0,
  ...props
}: Props<T>) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [pos, setPos] = useState<{
    top: number
    left: number
    width: number
    maxHeight: number
  } | null>(null)

  const current = options.find((o) => o.value === value)

  function show() {
    if (disabled || !options.length) return
    setHighlight(Math.max(0, options.indexOf(current!)))
    setPos(null)
    setOpen(true)
  }

  function close(focus = true) {
    setOpen(false)
    if (focus) trigger.current?.focus()
  }

  function choose(o: SelectOption<T>) {
    if (o.value !== value) onChange(o.value)
    close()
  }

  useLayoutEffect(() => {
    if (!open || !trigger.current) return
    const r = trigger.current.getBoundingClientRect()
    const width = Math.min(Math.max(r.width, minListWidth), window.innerWidth - MARGIN * 2)
    const height = list.current?.scrollHeight ?? 0
    const below = window.innerHeight - r.bottom - 4 - MARGIN
    const above = r.top - 4 - MARGIN
    // Neither side fits the whole list: use the bigger one and scroll inside.
    const upward = height > below && above > below
    const maxHeight = Math.min(MAX_HEIGHT, upward ? above : below)
    setPos({
      top: upward ? r.top - 4 - Math.min(height, maxHeight) : r.bottom + 4,
      left: Math.max(MARGIN, Math.min(r.left, window.innerWidth - width - MARGIN)),
      width,
      maxHeight,
    })
  }, [open, minListWidth])

  useEffect(() => {
    if (!open) return
    const outside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!list.current?.contains(target) && !trigger.current?.contains(target)) close(false)
    }
    // Capture: Esc closes only the list, not the drawer or modal underneath.
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    const scrolled = (e: Event) => !list.current?.contains(e.target as Node) && close(false)
    const resized = () => close(false)
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', key, true)
    window.addEventListener('scroll', scrolled, true)
    window.addEventListener('resize', resized)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', key, true)
      window.removeEventListener('scroll', scrolled, true)
      window.removeEventListener('resize', resized)
    }
  }, [open])

  function keys(e: React.KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        show()
      }
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      setHighlight((d) => Math.max(0, Math.min(options.length - 1, d + step)))
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      setHighlight(e.key === 'Home' ? 0 : options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (options[highlight]) choose(options[highlight])
    } else if (e.key === 'Tab') {
      close(false)
    }
  }

  return (
    <div className={cn('relative', className)}>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={props['aria-label']}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-activedescendant={open ? `${id}-${highlight}` : undefined}
        title={title}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={keys}
        className={
          triggerClassName ??
          cn(
            'flex h-10 w-full items-center gap-2 rounded-lg border border-field bg-canvas pr-2.5 pl-3 text-left text-sm text-ink transition outline-none',
            'hover:bg-surface focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand-area',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-canvas',
            open && 'border-brand ring-4 ring-brand-area',
          )
        }
      >
        {children ?? (
          <>
            <Truncate className={cn('min-w-0 flex-1', !current && 'text-faint')}>
              {current?.label ?? placeholder}
            </Truncate>
            {current?.group && <span className="shrink-0 text-xs text-faint">{current.group}</span>}
            <ChevronDown
              aria-hidden
              className={cn('size-4 shrink-0 text-dim transition-transform', open && 'rotate-180')}
            />
          </>
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label={props['aria-label']}
            onKeyDown={keys}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              width: pos?.width,
              maxHeight: pos?.maxHeight ?? MAX_HEIGHT,
            }}
            className={cn(
              'fixed z-[70] overflow-y-auto overscroll-contain rounded-xl border border-hairline bg-canvas p-1 shadow-lg',
              !pos && 'invisible',
            )}
          >
            {options.map((o, i) => {
              const header = o.group && o.group !== options[i - 1]?.group
              const selected = o.value === value
              return (
                <div key={String(o.value)} role="presentation">
                  {header && (
                    <p
                      role="presentation"
                      className={cn(
                        'px-2.5 py-1 text-[11px] text-dim',
                        i > 0 && 'mt-1 border-t border-hairline pt-2',
                      )}
                    >
                      {o.group}
                    </p>
                  )}
                  <button
                    id={`${id}-${i}`}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected}
                    ref={(el) => {
                      if (i === highlight) el?.scrollIntoView({ block: 'nearest' })
                    }}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => choose(o)}
                    className={cn(
                      'flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm text-ink transition',
                      i === highlight && 'bg-surface-hover text-ink',
                      selected && 'font-medium',
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <Truncate className="block">{o.label}</Truncate>
                      {o.description && (
                        <Truncate className="block text-xs font-normal text-dim">
                          {o.description}
                        </Truncate>
                      )}
                    </span>
                    {o.badge && <Badge>{o.badge}</Badge>}
                    {selected && <Check aria-hidden className="size-3.5 shrink-0 text-brand" />}
                  </button>
                </div>
              )
            })}
          </div>,
          document.body,
        )}
    </div>
  )
}
