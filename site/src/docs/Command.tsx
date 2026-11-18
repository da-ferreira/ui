import { Terminal } from 'lucide-react'
import { Code } from './Code'
import { MANAGERS, RUN, useManager } from './pm'
import { Tabs } from './Tabs'

/** `<pkg> <args>` with a tab per package manager. */
export function Command({ args, pkg = '@davidalmeida/ui' }: { args: string; pkg?: string }) {
  const [pm, setPm] = useManager()
  return (
    <Code
      lang="bash"
      code={`${RUN[pm]} ${pkg} ${args}`}
      toolbar={
        <div className="flex h-full items-center gap-3">
          <Terminal aria-hidden className="size-3.5 text-faint" />
          <Tabs
            small
            label="Package manager"
            value={pm}
            onChange={setPm}
            items={MANAGERS.map((m) => ({ value: m, label: m }))}
            className="h-full"
          />
        </div>
      }
    />
  )
}
