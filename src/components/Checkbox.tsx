import type { InputHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from './cn'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> & {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

export function Checkbox({ checked, onChange, children, className, ...props }: Props) {
  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 text-sm text-ink-soft',
        className,
      )}
    >
      <span className="relative flex size-4 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer size-4 cursor-pointer appearance-none rounded border border-field bg-canvas transition checked:border-brand checked:bg-brand focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
          {...props}
        />
        <Check
          strokeWidth={3}
          className="pointer-events-none absolute size-3 text-brand-ink opacity-0 peer-checked:opacity-100"
        />
      </span>
      {children}
    </label>
  )
}
