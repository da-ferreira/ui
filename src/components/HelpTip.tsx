import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CircleHelp } from 'lucide-react'

const WIDTH = 260
const MARGIN = 8

/** "?" icon that explains something on hover or focus. */
export function HelpTip({ text }: { text: string }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  function show() {
    const r = ref.current!.getBoundingClientRect()
    const left = r.left + r.width / 2 - WIDTH / 2
    setPos({
      top: r.bottom + 6,
      left: Math.max(MARGIN, Math.min(left, window.innerWidth - WIDTH - MARGIN)),
    })
  }

  return (
    <>
      <button
        ref={ref}
        type="button"
        aria-label={text}
        onMouseEnter={show}
        onMouseLeave={() => setPos(null)}
        onFocus={show}
        onBlur={() => setPos(null)}
        onKeyDown={(e) => e.key === 'Escape' && pos && (e.stopPropagation(), setPos(null))}
        className="inline-flex rounded-full text-faint transition outline-none hover:text-dim focus-visible:ring-4 focus-visible:ring-brand-area"
      >
        <CircleHelp className="size-3.5" />
      </button>
      {pos &&
        createPortal(
          <div
            role="tooltip"
            style={{ top: pos.top, left: pos.left, width: WIDTH }}
            className="pointer-events-none fixed z-[80] rounded-lg bg-ink px-3 py-2 text-xs leading-[18px] whitespace-pre-line text-canvas shadow-lg"
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  )
}
