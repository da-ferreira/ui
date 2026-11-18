import { useState } from 'react'
import { Switch } from '@/components/ui/Switch'

export default function SwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <label className="flex items-center gap-3 text-sm text-ink-soft">
      <Switch checked={on} onChange={setOn} aria-label="Interruptible" />
      Interruptible
    </label>
  )
}
