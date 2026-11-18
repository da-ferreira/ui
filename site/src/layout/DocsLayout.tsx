import { Link, Outlet, useLocation } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ALL_LINKS } from './nav'
import { DocsSidebar } from './Sidebar'
import { Toc } from './Toc'

export function DocsLayout() {
  const { pathname } = useLocation()
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 gap-10 px-4 sm:px-6">
      <DocsSidebar />
      <main id="docs-content" key={pathname} className="min-w-0 flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-[760px]">
          <Outlet />
          <Pager />
        </div>
      </main>
      <Toc />
    </div>
  )
}

function Pager() {
  const { pathname } = useLocation()
  const i = ALL_LINKS.findIndex((l) => l.href === pathname)
  if (i < 0) return null
  const prev = ALL_LINKS[i - 1]
  const next = ALL_LINKS[i + 1]
  const cls =
    'inline-flex h-9 items-center gap-1.5 rounded-lg border border-field px-3 text-sm font-medium text-ink transition hover:bg-surface focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none'
  return (
    <nav
      aria-label="Pagination"
      className="mt-16 flex items-center justify-between gap-3 border-t border-hairline pt-6"
    >
      {prev ? (
        <Link to={prev.href} className={cls}>
          <ChevronLeft aria-hidden className="size-4" />
          {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={next.href} className={cls}>
          {next.title}
          <ChevronRight aria-hidden className="size-4" />
        </Link>
      )}
    </nav>
  )
}
