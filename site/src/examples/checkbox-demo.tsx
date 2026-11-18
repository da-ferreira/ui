import { useState } from 'react'
import { Checkbox } from '@/components/ui/Checkbox'

export default function CheckboxDemo() {
  const [terms, setTerms] = useState(true)
  const [news, setNews] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      <Checkbox checked={terms} onChange={setTerms}>
        Accept terms and conditions
      </Checkbox>
      <Checkbox checked={news} onChange={setNews}>
        Send me product news
      </Checkbox>
      <Checkbox checked={false} onChange={() => {}} disabled>
        Disabled
      </Checkbox>
    </div>
  )
}
