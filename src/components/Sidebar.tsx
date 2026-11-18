import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from './cn'
import { Truncate } from './Truncate'

export const sidebarItemClass =
  'flex h-8 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm transition focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none'
export const sidebarItemActiveClass = 'bg-surface-hover text-ink [&>svg]:text-brand'
export const sidebarItemIdleClass = 'text-ink-soft hover:bg-surface hover:text-ink'
export const sidebarItemDisabledClass = 'cursor-not-allowed text-faint'
export const sidebarLogoClass =
  'rounded focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none'

/** Logo strip, same height as the `SidebarLayout` header. */
export function SidebarHeader({ children }: { children: ReactNode }) {
  return <div className="flex h-16 shrink-0 items-center px-5">{children}</div>
}

/** Scrollable area holding the sections; the scrollbar is hidden. */
export function SidebarNav({ children, className, ...props }: ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav
      className={cn('min-h-0 flex-1 overflow-y-auto px-3 [scrollbar-width:none]', className)}
      {...props}
    >
      {children}
    </nav>
  )
}

export function SidebarSection({
  title,
  children,
  className,
}: {
  title?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mt-5 flex flex-col gap-0.5', className)}>
      {title && <p className="mb-1 text-xs text-dim">{title}</p>}
      {children}
    </div>
  )
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return <div className="shrink-0 px-3 py-3">{children}</div>
}

type ItemProps<C extends ElementType> = {
  /** Element or component for the link (e.g. your router's `Link`). Default: `a`. */
  as?: C
  icon?: ReactNode
  /** Overlaid on the icon (e.g. a "live" dot). */
  indicator?: ReactNode
  /** Right of the label (e.g. a "Beta" badge). */
  extra?: ReactNode
  active?: boolean
  /** Looks disabled but still gets clicks, so the caller can explain why. */
  disabled?: boolean
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<C>, 'as' | 'children'>

export function SidebarItem<C extends ElementType = 'a'>({
  as,
  icon,
  indicator,
  extra,
  active,
  disabled,
  className,
  children,
  ...props
}: ItemProps<C>) {
  const Element: ElementType = as ?? 'a'
  return (
    <Element
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        sidebarItemClass,
        disabled
          ? sidebarItemDisabledClass
          : active
            ? sidebarItemActiveClass
            : sidebarItemIdleClass,
        className as string | undefined,
      )}
      {...props}
    >
      {icon && (
        <span className="relative shrink-0 [&>svg]:size-4">
          {icon}
          {indicator}
        </span>
      )}
      <Truncate className="min-w-0 flex-1">{children}</Truncate>
      {extra}
    </Element>
  )
}
