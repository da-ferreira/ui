import { useState } from 'react'
import { Chip } from '@/components/ui/Chip'

const filters = [
  { id: 'all', label: 'All', count: 128 },
  { id: 'live', label: 'Live', count: 3 },
  { id: 'success', label: 'Success', count: 97 },
  { id: 'failed', label: 'Failed', count: 28 },
]

export default function ChipDemo() {
  const [active, setActive] = useState('all')
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filters.map((f) => (
        <Chip key={f.id} active={active === f.id} count={f.count} onClick={() => setActive(f.id)}>
          {f.label}
        </Chip>
      ))}
    </div>
  )
}
