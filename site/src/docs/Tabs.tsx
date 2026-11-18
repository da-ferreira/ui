import { useId, type ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

/** Underlined tabs; the panel is whatever the caller renders for `value`. */
export function Tabs<T extends string>({
  value,
  onChange,
  items,
  label,
  className,
  small,
}: {
  value: T
  onChange: (v: T) => void
  items: { value: T; label: ReactNode }[]
  label: string
  className?: string
  small?: boolean
}) {
  const id = useId()
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('flex items-end gap-4', className)}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
        const i = items.findIndex((t) => t.value === value)
        const next = items[(i + (e.key === 'ArrowRight' ? 1 : items.length - 1)) % items.length]
        onChange(next.value)
        document.getElementById(`${id}-${next.value}`)?.focus()
      }}
    >
      {items.map((t) => {
        const selected = t.value === value
        return (
          <button
            key={t.value}
            id={`${id}-${t.value}`}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative -mb-px border-b-2 font-medium transition focus-visible:rounded-sm focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
              small ? 'pb-1.5 text-[13px]' : 'pb-2.5 text-sm',
              selected ? 'border-ink text-ink' : 'border-transparent text-dim hover:text-ink',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
