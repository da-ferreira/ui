import { useState } from 'react'
import { Select } from '@/components/ui/Select'

export default function SelectGroups() {
  const [model, setModel] = useState('gpt-oss-120b')
  return (
    <Select
      aria-label="Model"
      value={model}
      onChange={setModel}
      className="w-72"
      options={[
        { value: 'gpt-oss-120b', label: 'GPT OSS 120B', group: 'Groq', badge: 'Fast' },
        { value: 'llama-3.3-70b', label: 'Llama 3.3 70B', group: 'Groq' },
        {
          value: 'claude-sonnet',
          label: 'Claude Sonnet',
          group: 'Anthropic',
          description: 'Best for long instructions',
        },
        { value: 'gpt-5', label: 'GPT-5', group: 'OpenAI' },
      ]}
    />
  )
}
