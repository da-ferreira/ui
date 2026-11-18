import { useState } from 'react'
import { DatePicker } from '@/components/ui/DatePicker'

export default function DatePickerDemo() {
  const [date, setDate] = useState('')
  return (
    <DatePicker
      aria-label="Date"
      value={date}
      onChange={setDate}
      className="w-56"
      locale="en-US"
      placeholder="mm/dd/yyyy"
      todayLabel="Today"
      previousMonthLabel="Previous month"
      nextMonthLabel="Next month"
    />
  )
}
