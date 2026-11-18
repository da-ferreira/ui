import { cn } from './cn'

function initials(name: string) {
  const parts = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-canvas',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
