import type { HTMLAttributes } from 'react'
import { cn } from './cn'

type Variant = 'neutral' | 'brand' | 'outline'

const variants: Record<Variant, string> = {
  neutral: 'bg-surface-hover text-dim',
  brand: 'bg-brand-soft text-brand',
  outline: 'border border-field text-dim',
}

export function Badge({
  variant = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium [&>svg]:size-3',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
