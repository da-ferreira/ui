import { NavLink, Link } from 'react-router'
import { cn } from '@/components/ui/cn'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import pkg from '../../../package.json'
import { GitHubIcon, Logo } from './Logo'
import { GITHUB } from './nav'
import { SearchButton } from './Search'
import { MobileNav } from './Sidebar'

const nav = [
  { to: '/docs', label: 'Docs', end: true },
  { to: '/docs/components', label: 'Components', end: false },
]

const iconLink =
  'inline-flex size-9 items-center justify-center rounded-lg text-dim transition hover:bg-surface hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-4 sm:px-6">
        <MobileNav />
        <Link
          to="/"
          className="mr-4 flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
        >
          <Logo className="size-6 text-ink" />
          <span className="max-sm:sr-only">
            davidalmeida<span className="font-normal text-dim">/ui</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-2.5 py-1.5 text-sm transition focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
                  isActive ? 'font-medium text-ink' : 'text-dim hover:text-ink',
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5">
          <SearchButton className="sm:w-60 lg:w-72" />
          <a
            href={`${GITHUB}/releases`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md px-2 font-mono text-xs text-dim transition hover:text-ink sm:block"
          >
            v{pkg.version}
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className={iconLink}
          >
            <GitHubIcon className="size-4" />
          </a>
          <ThemeToggle label="Theme" labels={{ system: 'System', light: 'Light', dark: 'Dark' }} />
        </div>
      </div>
    </header>
  )
}
