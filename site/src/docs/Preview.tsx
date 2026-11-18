import { useState, type ComponentType } from 'react'
import { cn } from '@/components/ui/cn'
import { Code } from './Code'
import { Tabs } from './Tabs'

/** Live example with its source one tab away. */
export function Preview({
  example: Example,
  code,
  className,
}: {
  example: ComponentType
  code: string
  className?: string
}) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  return (
    <div className="flex flex-col gap-3">
      <Tabs
        label="Example"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'preview', label: 'Preview' },
          { value: 'code', label: 'Code' },
        ]}
        className="border-b border-hairline"
      />
      {tab === 'preview' ? (
        <div
          className={cn(
            'flex min-h-[280px] items-center justify-center rounded-xl border border-hairline p-6 sm:p-10',
            className,
          )}
        >
          <Example />
        </div>
      ) : (
        <Code code={code} maxHeight={480} />
      )}
    </div>
  )
}
