import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { PanelLeft } from 'lucide-react'
import { IconButton } from './Button'
import { cn } from './cn'

const NARROW = '(max-width: 1023px)'

function useNarrow() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(NARROW)
      mq.addEventListener('change', notify)
      return () => mq.removeEventListener('change', notify)
    },
    () => window.matchMedia(NARROW).matches,
    () => false,
  )
}

/**
 * Sidebar + header + content. From 1024px up the sidebar pushes the content; below that it
 * opens over it as a drawer and closes on navigation (`navigationKey`) and on Esc.
 */
export function SidebarLayout({
  sidebar,
  header,
  banner,
  overlays,
  children,
  navigationKey,
  sidebarWidth = 248,
  toggleLabel = 'Alternar barra lateral',
  contentClassName,
  contentStyle,
}: {
  sidebar: ReactNode
  /** Goes after the button that opens and closes the sidebar. */
  header?: ReactNode
  /** Strip between the header and the content; does not scroll. */
  banner?: ReactNode
  /** Loose elements (modals, floating notices) rendered outside the content column. */
  overlays?: ReactNode
  children: ReactNode
  /** Change it on every navigation (e.g. the pathname) so the drawer closes by itself. */
  navigationKey?: string
  sidebarWidth?: number
  toggleLabel?: string
  contentClassName?: string
  contentStyle?: CSSProperties
}) {
  const narrow = useNarrow()
  const [open, setOpen] = useState(!narrow)

  // Adjusting state during render (not in an effect) avoids a frame with the wrong drawer state.
  const [seen, setSeen] = useState({ narrow, navigationKey })
  if (seen.narrow !== narrow || seen.navigationKey !== navigationKey) {
    setSeen({ narrow, navigationKey })
    if (seen.narrow !== narrow) setOpen(!narrow)
    else if (narrow) setOpen(false)
  }

  useEffect(() => {
    if (!narrow || !open) return
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [narrow, open])

  return (
    <div
      className="flex h-full"
      style={{ '--sidebar-width': `${sidebarWidth}px` } as CSSProperties}
    >
      {narrow && open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-[#0b1018]/45"
        />
      )}
      {/* inert: when closed, the sidebar also leaves the Tab order and screen readers. */}
      <aside
        inert={!open}
        className={cn(
          'flex shrink-0 flex-col border-r border-hairline bg-canvas',
          narrow
            ? cn(
                'fixed inset-y-0 left-0 z-40 w-(--sidebar-width) shadow-xl transition-transform duration-200',
                open ? 'translate-x-0' : '-translate-x-full',
              )
            : cn(
                'transition-[width] duration-200',
                open ? 'w-(--sidebar-width)' : 'w-0 overflow-hidden border-r-0',
              ),
        )}
      >
        {sidebar}
      </aside>
      {overlays}

      <div style={contentStyle} className={cn('flex min-w-0 flex-1 flex-col', contentClassName)}>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 sm:px-7">
          <IconButton
            aria-label={toggleLabel}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <PanelLeft className="size-[18px]" />
          </IconButton>
          {header}
        </header>
        {banner}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
