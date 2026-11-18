import type { ButtonHTMLAttributes } from 'react'
import { cn } from './cn'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ checked, onChange, className, ...props }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition',
        'focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none disabled:opacity-50',
        checked ? 'bg-ink' : 'bg-field hover:bg-faint',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'size-4 rounded-full bg-canvas shadow-sm transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}
