import { Truncate } from '@/components/ui/Truncate'

export default function TruncateDemo() {
  return (
    <div className="flex w-56 flex-col gap-2 rounded-lg border border-hairline p-3 text-sm">
      <Truncate className="block">Short name</Truncate>
      <Truncate className="block">
        A very long agent name that does not fit in the sidebar — hover me
      </Truncate>
      <Truncate multiline className="line-clamp-2 text-dim">
        Two lines at most: the description of an agent can be long, so it is clamped and the full
        text shows in the tooltip.
      </Truncate>
    </div>
  )
}
