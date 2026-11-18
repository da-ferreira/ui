import { CircleAlert, CircleCheck, X } from 'lucide-react'

export type Toast = { id: number; type: 'success' | 'error'; message: string }

export function Toaster({
  toasts,
  onDismiss,
  closeLabel = 'Fechar',
}: {
  toasts: Toast[]
  onDismiss: (id: number) => void
  closeLabel?: string
}) {
  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.type === 'error' ? 'alert' : 'status'}
          className="flex items-start gap-2.5 rounded-xl border border-hairline bg-canvas px-3.5 py-3 text-sm text-ink shadow-lg"
        >
          {t.type === 'error' ? (
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
          ) : (
            <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" />
          )}
          <span className="flex-1">{t.message}</span>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => onDismiss(t.id)}
            className="shrink-0 rounded text-faint hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
