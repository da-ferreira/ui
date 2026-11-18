import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from './cn'
import { trapTab } from './focus'

const WIDTH = 280
const MARGIN = 8

/** "YYYY-MM-DD" in local time. */
const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function fromIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function monthDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return { iso: toIso(d), day: d.getDate(), inMonth: d.getMonth() === month }
  })
}

// 2026-01-04 is a Sunday: the week starts there, like `monthDays`.
const weekdays = (locale: string) =>
  Array.from({ length: 7 }, (_, i) => new Date(2026, 0, 4 + i)).map((d) => ({
    short: d.toLocaleDateString(locale, { weekday: 'narrow' }),
    long: d.toLocaleDateString(locale, { weekday: 'long' }),
  }))

type Props = {
  value: string
  onChange: (iso: string) => void
  'aria-label': string
  min?: string
  max?: string
  invalid?: boolean
  /** Paints the period between two dates ("from" and "to" fields side by side). */
  range?: { from: string; to: string }
  className?: string
  /** Formats the month, weekdays and the date in the field. */
  locale?: string
  placeholder?: string
  previousMonthLabel?: string
  nextMonthLabel?: string
  todayLabel?: string
}

/** Date field with its own calendar, styled like `Input` + `Menu` (never the native picker). */
export function DatePicker({
  value,
  onChange,
  min,
  max,
  invalid,
  range,
  className,
  locale = 'pt-BR',
  placeholder = 'dd/mm/aaaa',
  previousMonthLabel = 'Mês anterior',
  nextMonthLabel = 'Próximo mês',
  todayLabel = 'Hoje',
  ...props
}: Props) {
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [month, setMonth] = useState(() => {
    const d = value ? fromIso(value) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [today] = useState(() => toIso(new Date()))

  function show() {
    const d = value ? fromIso(value) : new Date()
    setMonth({ year: d.getFullYear(), month: d.getMonth() })
    setOpen(true)
  }

  function close(focus = true) {
    setOpen(false)
    setPos(null)
    if (focus) trigger.current?.focus()
  }

  useLayoutEffect(() => {
    if (!open) return
    const r = trigger.current!.getBoundingClientRect()
    const height = panel.current?.offsetHeight ?? 0
    const fitsBelow = r.bottom + 4 + height <= window.innerHeight - MARGIN
    setPos({
      top: fitsBelow ? r.bottom + 4 : Math.max(MARGIN, r.top - 4 - height),
      left: Math.max(MARGIN, Math.min(r.left, window.innerWidth - WIDTH - MARGIN)),
    })
    panel.current?.querySelector<HTMLElement>('[aria-selected=true],[data-today]')?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const outside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!panel.current?.contains(target) && !trigger.current?.contains(target)) close(false)
    }
    // Capture: Esc closes the calendar without closing the modal underneath.
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    const scrolled = (e: Event) => !panel.current?.contains(e.target as Node) && close(false)
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

  const outOfBounds = (iso: string) => (!!min && iso < min) || (!!max && iso > max)

  function choose(iso: string) {
    if (outOfBounds(iso)) return
    onChange(iso)
    close()
  }

  function changeMonth(step: number) {
    setMonth((m) => {
      const d = new Date(m.year, m.month + step, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  // Arrows move across days; the month follows.
  function navigate(e: React.KeyboardEvent, iso: string) {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    }
    const step = steps[e.key]
    if (!step) return
    e.preventDefault()
    const d = fromIso(iso)
    const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step)
    const target = toIso(next)
    setMonth({ year: next.getFullYear(), month: next.getMonth() })
    requestAnimationFrame(() =>
      panel.current?.querySelector<HTMLElement>(`[data-iso="${target}"]`)?.focus(),
    )
  }

  const title = new Date(month.year, month.month, 1).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  })
  const from = range?.from && range?.to && range.from <= range.to ? range.from : ''
  const to = from ? range!.to : ''
  const days = monthDays(month.year, month.month)
  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, i * 7 + 7))
  const dayNames = weekdays(locale)

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? close() : show())}
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-lg border bg-canvas px-3 text-left text-sm text-ink transition',
          'focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
          invalid ? 'border-danger' : open ? 'border-brand ring-4 ring-brand-area' : 'border-field',
          className,
        )}
        {...props}
      >
        <span className={cn('flex-1 tabular-nums', !value && 'text-faint')}>
          {value ? fromIso(value).toLocaleDateString(locale) : placeholder}
        </span>
        <CalendarDays aria-hidden className="size-4 shrink-0 text-dim" />
      </button>
      {open &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-modal
            aria-label={props['aria-label']}
            // Tab cycles inside the calendar, like the WAI-ARIA date picker dialog.
            onKeyDown={(e) => panel.current && trapTab(e, panel.current)}
            style={{ width: WIDTH, top: pos?.top ?? 0, left: pos?.left ?? 0 }}
            className={cn(
              'fixed z-[70] rounded-xl border border-hairline bg-canvas p-3 shadow-lg',
              !pos && 'invisible',
            )}
          >
            <div className="mb-2 flex items-center gap-1">
              <span
                aria-live="polite"
                className="flex-1 pl-1 text-sm font-medium first-letter:uppercase"
              >
                {title}
              </span>
              <button
                type="button"
                aria-label={previousMonthLabel}
                onClick={() => changeMonth(-1)}
                className="flex size-7 items-center justify-center rounded-md text-dim transition hover:bg-surface-hover hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label={nextMonthLabel}
                onClick={() => changeMonth(1)}
                className="flex size-7 items-center justify-center rounded-md text-dim transition hover:bg-surface-hover hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div
              aria-hidden
              className="grid grid-cols-7 text-center text-[11px] font-medium text-faint"
            >
              {dayNames.map((d, i) => (
                <span key={i} className="flex h-7 items-center justify-center">
                  {d.short}
                </span>
              ))}
            </div>

            <div role="grid" aria-label={title} className="grid grid-cols-7 gap-y-0.5">
              {weeks.map((week) => (
                <div key={week[0].iso} role="row" className="contents">
                  {week.map((d) => {
                    const selected = d.iso === value
                    const blocked = outOfBounds(d.iso)
                    const inRange = !!from && d.iso >= from && d.iso <= to
                    const edge = inRange && (d.iso === from || d.iso === to)
                    return (
                      <div
                        key={d.iso}
                        role="presentation"
                        className={cn(
                          'flex justify-center',
                          inRange && 'bg-brand-soft',
                          d.iso === from && 'rounded-l-full',
                          d.iso === to && 'rounded-r-full',
                        )}
                      >
                        <button
                          type="button"
                          role="gridcell"
                          data-iso={d.iso}
                          data-today={d.iso === today || undefined}
                          aria-label={fromIso(d.iso).toLocaleDateString(locale, {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                          aria-selected={selected}
                          aria-current={d.iso === today ? 'date' : undefined}
                          disabled={blocked}
                          tabIndex={selected || (!value && d.iso === today) ? 0 : -1}
                          onClick={() => choose(d.iso)}
                          onKeyDown={(e) => navigate(e, d.iso)}
                          className={cn(
                            'flex size-9 items-center justify-center rounded-full text-[13px] tabular-nums transition',
                            'focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
                            'disabled:cursor-not-allowed disabled:opacity-35',
                            selected || edge
                              ? 'bg-brand font-semibold text-brand-ink'
                              : d.inMonth
                                ? 'text-ink hover:bg-surface-hover'
                                : 'text-faint hover:bg-surface-hover',
                            !selected && !edge && d.iso === today && 'font-semibold text-brand',
                          )}
                        >
                          {d.day}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {!outOfBounds(today) && (
              <div className="mt-2 flex justify-end border-t border-hairline pt-2">
                <button
                  type="button"
                  onClick={() => choose(today)}
                  className="rounded-md px-2 py-1 text-[13px] font-medium text-brand transition hover:bg-brand-soft focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
                >
                  {todayLabel}
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}
