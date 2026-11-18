import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './cn'

const MARGIN = 8
const DELAY = 300

/** Text with an ellipsis that shows the full content in a tooltip, only when it was cut. */
export function Truncate({
  children,
  tooltip,
  className,
  multiline,
}: {
  children: ReactNode
  /** Tooltip text when `children` is not plain text (e.g. with chips). */
  tooltip?: string
  className?: string
  /** Clamps to N lines instead of one (needs `line-clamp-N` in className). */
  multiline?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const tip = useRef<HTMLDivElement>(null)
  const timer = useRef<number>(undefined)
  const [target, setTarget] = useState<DOMRect | null>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  function enter() {
    const el = ref.current!
    const cut = el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight
    if (!cut) return
    timer.current = window.setTimeout(() => setTarget(el.getBoundingClientRect()), DELAY)
  }

  function leave() {
    window.clearTimeout(timer.current)
    setTarget(null)
    setPos(null)
  }

  useLayoutEffect(() => {
    if (!target || !tip.current) return
    const { width, height } = tip.current.getBoundingClientRect()
    const below = target.bottom + 6 + height <= window.innerHeight - MARGIN
    setPos({
      top: below ? target.bottom + 6 : target.top - 6 - height,
      left: Math.max(MARGIN, Math.min(target.left, window.innerWidth - width - MARGIN)),
    })
  }, [target])

  useEffect(() => {
    if (!target) return
    window.addEventListener('scroll', leave, true)
    return () => window.removeEventListener('scroll', leave, true)
  }, [target])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Decorative for screen readers: they already read the full text from the span.
  return (
    <>
      <span
        ref={ref}
        onMouseEnter={enter}
        onMouseLeave={leave}
        className={cn(!multiline && 'truncate', className)}
      >
        {children}
      </span>
      {target &&
        createPortal(
          <div
            ref={tip}
            aria-hidden
            style={{ top: pos?.top ?? 0, left: pos?.left ?? 0 }}
            className={cn(
              'pointer-events-none fixed z-[80] max-w-[min(360px,calc(100vw-16px))] rounded-lg bg-ink px-3 py-2 text-xs leading-[18px] font-normal break-words text-canvas shadow-lg',
              !pos && 'invisible',
            )}
          >
            {tooltip ?? children}
          </div>,
          document.body,
        )}
    </>
  )
}
