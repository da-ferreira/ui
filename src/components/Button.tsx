import type { ButtonHTMLAttributes, ComponentProps } from 'react'
import { cn } from './cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-ink hover:brightness-110',
  secondary: 'border border-field bg-canvas text-ink hover:bg-surface',
  ghost: 'text-dim hover:bg-surface-hover hover:text-ink',
  danger: 'bg-danger text-white hover:brightness-110',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-sm',
  md: 'h-9 gap-2 px-3.5 text-sm',
  lg: 'h-10 gap-2 px-4 text-sm',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg font-medium transition',
        'focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
        'disabled:opacity-50 aria-disabled:opacity-40',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}

export function IconButton({ className, ...props }: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-dim transition',
        'hover:bg-surface-hover hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
        className,
      )}
      {...props}
    />
  )
}
