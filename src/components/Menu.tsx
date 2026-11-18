import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './cn'

export type MenuItem = {
  id: string
  label: string
  icon: ReactNode
  danger?: boolean
  /** Looks disabled but stays clickable, so the caller can explain why. */
  disabled?: boolean
  title?: string
  onSelect: () => void
}

const DEFAULT_WIDTH = 176
const MARGIN = 8

/** Dropdown tied to a button. Opens below, right-aligned; without room, opens above. */
export function Menu({
  anchor,
  items,
  onClose,
  width = DEFAULT_WIDTH,
}: {
  anchor: HTMLElement
  items: MenuItem[]
  onClose: () => void
  width?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    const r = anchor.getBoundingClientRect()
    const height = ref.current?.offsetHeight ?? 0
    const fitsBelow = r.bottom + 4 + height <= window.innerHeight - MARGIN
    setPos({
      top: fitsBelow ? r.bottom + 4 : Math.max(MARGIN, r.top - 4 - height),
      left: Math.max(MARGIN, Math.min(r.right - width, window.innerWidth - width - MARGIN)),
    })
    ref.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus()
  }, [anchor, width])

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!ref.current?.contains(target) && !anchor.contains(target)) onClose()
    }
    // Capture: Esc closes only the menu, not the modal or drawer underneath.
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        anchor.focus()
      }
    }
    // Scrolling the list would leave the menu floating.
    const scrolled = (e: Event) => !ref.current?.contains(e.target as Node) && onClose()
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', key, true)
    window.addEventListener('scroll', scrolled, true)
    window.addEventListener('resize', onClose)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', key, true)
      window.removeEventListener('scroll', scrolled, true)
      window.removeEventListener('resize', onClose)
    }
  }, [anchor, onClose])

  function navigate(e: React.KeyboardEvent) {
    const buttons = [...(ref.current?.querySelectorAll<HTMLElement>('[role=menuitem]') ?? [])]
    const current = buttons.indexOf(document.activeElement as HTMLElement)
    let next: number
    if (e.key === 'ArrowDown') next = (current + 1) % buttons.length
    else if (e.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = buttons.length - 1
    else if (e.key === 'Tab') {
      // The menu lives in a portal; letting Tab through would jump to the end of the page.
      e.preventDefault()
      onClose()
      anchor.focus()
      return
    } else return
    e.preventDefault()
    buttons[next]?.focus()
  }

  return createPortal(
    <div
      ref={ref}
      role="menu"
      onKeyDown={navigate}
      style={{ width, top: pos?.top ?? 0, left: pos?.left ?? 0 }}
      className={cn(
        'fixed z-[70] rounded-xl border border-hairline bg-canvas p-1 shadow-lg',
        !pos && 'invisible',
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          tabIndex={-1}
          aria-disabled={item.disabled || undefined}
          title={item.title}
          onClick={() => {
            onClose()
            item.onSelect()
          }}
          className={cn(
            'flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-sm transition outline-none [&>svg]:size-4 [&>svg]:shrink-0',
            item.danger
              ? 'text-danger hover:bg-danger-soft focus-visible:bg-danger-soft'
              : 'text-ink hover:bg-surface-hover focus-visible:bg-surface-hover',
            item.disabled && 'opacity-40',
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>,
    document.body,
  )
}
