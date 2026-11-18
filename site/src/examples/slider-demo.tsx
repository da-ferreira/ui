import { useState } from 'react'
import { Slider } from '@/components/ui/Slider'

export default function SliderDemo() {
  const [value, setValue] = useState(0.7)
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-ink-soft">Temperature</span>
        <span className="text-dim tabular-nums">{value.toFixed(1)}</span>
      </div>
      <Slider
        aria-label="Temperature"
        min={0}
        max={2}
        step={0.1}
        value={value}
        onChange={setValue}
      />
    </div>
  )
}
