import { useState } from 'react'
import { DatePicker } from '@/components/ui/DatePicker'

export default function DatePickerRange() {
  const [from, setFrom] = useState('2026-11-03')
  const [to, setTo] = useState('2026-11-14')
  const range = { from, to }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DatePicker
        aria-label="From"
        value={from}
        onChange={setFrom}
        max={to}
        range={range}
        className="w-44"
      />
      <span className="text-sm text-dim">→</span>
      <DatePicker
        aria-label="To"
        value={to}
        onChange={setTo}
        min={from}
        range={range}
        className="w-44"
      />
    </div>
  )
}
