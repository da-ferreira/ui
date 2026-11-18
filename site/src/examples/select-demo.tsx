import { useState } from 'react'
import { Select } from '@/components/ui/Select'

export default function SelectDemo() {
  const [fruit, setFruit] = useState('')
  return (
    <Select
      aria-label="Fruit"
      placeholder="Select a fruit"
      value={fruit}
      onChange={setFruit}
      className="w-56"
      options={[
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'blueberry', label: 'Blueberry' },
        { value: 'grapes', label: 'Grapes' },
        { value: 'pineapple', label: 'Pineapple' },
      ]}
    />
  )
}
