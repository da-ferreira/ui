const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Keeps Tab and Shift+Tab cycling inside `container`. Call it from a keydown handler.
 * It always moves focus itself, so outer traps can skip events with `defaultPrevented`.
 */
export function trapTab(e: KeyboardEvent | React.KeyboardEvent, container: HTMLElement) {
  if (e.key !== 'Tab') return
  e.preventDefault()
  const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (el) => !el.closest('[inert]') && el.getClientRects().length > 0,
  )
  if (!items.length) return container.focus()
  const current = items.indexOf(document.activeElement as HTMLElement)
  const step = e.shiftKey ? -1 : 1
  const next = current === -1 ? (e.shiftKey ? items.length - 1 : 0) : current + step
  items[(next + items.length) % items.length].focus()
}
