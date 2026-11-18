import { Link } from 'react-router'
import { COMPONENTS } from '../docs/components'
import { PageHeader } from '../docs/PageHeader'

export function Components() {
  return (
    <>
      <title>Components — @davidalmeida/ui</title>
      <PageHeader
        title="Components"
        description="Every piece the CLI can add. Each page has a live example, the code and the props."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {COMPONENTS.map((c) => (
          <Link
            key={c.slug}
            to={`/docs/components/${c.slug}`}
            className="flex flex-col gap-1 rounded-xl border border-hairline p-4 transition hover:border-field hover:bg-surface focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
          >
            <span className="text-sm font-medium text-ink">{c.name}</span>
            <span className="text-[13px] text-dim">{c.description}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
