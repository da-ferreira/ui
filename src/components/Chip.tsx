import type { ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean
  count?: number
}

export function Chip({ active, count, children, className, ...props }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition',
        'focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
        active
          ? 'border-ink bg-ink text-canvas'
          : 'border-field bg-canvas text-ink-soft hover:bg-surface',
        className,
      )}
      {...props}
    >
      {/* Count aligned to the label baseline; box-centered it looks raised. */}
      <span className="inline-flex items-baseline gap-1.5">
        {children}
        {count !== undefined && (
          <span className="text-[11px] tabular-nums opacity-70">{count}</span>
        )}
      </span>
    </button>
  )
}
