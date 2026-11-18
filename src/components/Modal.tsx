import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'
import { trapTab } from './focus'
import { Truncate } from './Truncate'

// Stack of open modals and drawers: Esc and the Tab trap only act on the top one
// (e.g. a confirmation opened over another modal).
const stack: symbol[] = []

function useLayer(onClose: () => void) {
  const panel = useRef<HTMLDivElement>(null)
  const close = useEffectEvent(onClose)

  useEffect(() => {
    const id = Symbol()
    stack.push(id)
    const previous = document.activeElement as HTMLElement | null
    if (!panel.current?.contains(document.activeElement)) panel.current?.focus()

    const keydown = (e: KeyboardEvent) => {
      if (stack.at(-1) !== id || !panel.current) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
      // A popover inside (Menu, DatePicker) may have already handled its own Tab.
      else if (!e.defaultPrevented) trapTab(e, panel.current)
    }
    document.addEventListener('keydown', keydown)
    return () => {
      document.removeEventListener('keydown', keydown)
      stack.splice(stack.indexOf(id), 1)
      previous?.focus?.()
    }
  }, [])

  return panel
}

type Props = {
  onClose: () => void
  /** Accessible name of the dialog. */
  label: string
  children: ReactNode
  className?: string
  /** Below 640px it fills the screen, without the card. */
  fullScreenOnMobile?: boolean
}

export function Modal({ onClose, label, children, className, fullScreenOnMobile }: Props) {
  const panel = useLayer(onClose)

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[60] flex items-center justify-center p-5',
        fullScreenOnMobile && 'max-sm:p-0',
      )}
    >
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-[#0b1018]/45" />
      <div
        ref={panel}
        role="dialog"
        aria-modal
        aria-label={label}
        tabIndex={-1}
        className={cn(
          'relative max-h-[calc(100dvh-2.5rem)] w-full overflow-y-auto rounded-xl border border-hairline bg-canvas shadow-xl outline-none',
          fullScreenOnMobile &&
            'max-sm:h-full max-sm:max-h-none max-sm:rounded-none max-sm:border-0',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

/** Panel that slides in from the right. Full screen on phones. */
export function Drawer({
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  header,
  closeLabel = 'Fechar',
  className,
}: {
  onClose: () => void
  title: string
  /** Line under the title; wraps instead of truncating. */
  description?: string
  icon: ReactNode
  children: ReactNode
  /** Bar pinned to the bottom (e.g. a Save button); does not scroll with the content. */
  footer?: ReactNode
  /** Replaces the default header (icon, title and X); `title` stays as the dialog name. */
  header?: ReactNode
  closeLabel?: string
  /** Width from 640px up, e.g. `sm:max-w-[600px]`. */
  className?: string
}) {
  const panel = useLayer(onClose)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-[#0b1018]/45 transition-opacity duration-300',
          entered ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative flex h-full w-full flex-col bg-canvas shadow-xl outline-none sm:border-l sm:border-hairline',
          'transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
          entered ? 'translate-x-0' : 'translate-x-full',
          className,
        )}
      >
        {header ?? (
          <div className="flex min-h-16 shrink-0 items-center gap-3 border-b border-hairline px-5 py-3">
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-ink-soft [&>svg]:size-4"
            >
              {icon}
            </span>
            <div className="min-w-0 flex-1">
              <Truncate className="block text-[15px] font-medium">{title}</Truncate>
              {description && <p className="text-[13px] text-dim">{description}</p>}
            </div>
            <IconButton aria-label={closeLabel} onClick={onClose}>
              <X className="size-4" />
            </IconButton>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-hairline px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
