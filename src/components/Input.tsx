import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from './cn'

export type InputProps = ComponentProps<'input'> & {
  invalid?: boolean
  /** Icon on the left (e.g. a search magnifier). */
  icon?: ReactNode
}

export function Input({ invalid, icon, className, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-faint [&>svg]:size-4">
          {icon}
        </span>
      )}
      <input
        aria-invalid={invalid || undefined}
        className={cn(
          // 16px on phones: below that, iPhone Safari zooms in on focus and shifts the page.
          'h-10 w-full rounded-lg border bg-canvas px-3 text-base text-ink transition outline-none placeholder:text-faint sm:text-sm',
          'focus:border-brand focus:ring-4 focus:ring-brand-area',
          invalid ? 'border-danger' : 'border-field',
          icon && 'pl-9',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function PasswordInput({
  className,
  showLabel = 'Mostrar senha',
  hideLabel = 'Ocultar senha',
  ...props
}: Omit<InputProps, 'type' | 'icon'> & { showLabel?: string; hideLabel?: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-dim hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

export function Field({ label, children }: { label: string; children: (id: string) => ReactNode }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      {children(id)}
    </div>
  )
}
