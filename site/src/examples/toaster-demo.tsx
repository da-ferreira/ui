import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Toaster, type Toast } from '@/components/ui/Toaster'

let next = 0

export default function ToasterDemo() {
  const [toasts, setToasts] = useState<Toast[]>([])

  function push(type: Toast['type'], message: string) {
    const id = ++next
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => dismiss(id), 4000)
  }
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => push('success', 'Version 3 published')}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => push('error', 'Could not save. Try again.')}>
        Error
      </Button>
      <Toaster toasts={toasts} onDismiss={dismiss} closeLabel="Close" />
    </div>
  )
}
