import { useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { Menu as MenuIcon } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'
import { Drawer } from '@/components/ui/Modal'
import { Logo } from './Logo'
import { COMPONENT_LINKS, GETTING_STARTED, type NavLink as Item } from './nav'

function Section({
  title,
  links,
  onNavigate,
}: {
  title: string
  links: Item[]
  onNavigate?: () => void
}) {
  return (
    <div className="mb-6">
      <p className="mb-1.5 px-2.5 text-xs font-medium text-faint">{title}</p>
      <ul className="flex flex-col gap-0.5">
        {links.map((l) => (
          <li key={l.href}>
            <NavLink
              to={l.href}
              end
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-2.5 py-1.5 text-sm transition focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
                  isActive
                    ? 'bg-surface-hover font-medium text-ink'
                    : 'text-ink-soft hover:bg-surface hover:text-ink',
                )
              }
            >
              {l.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Section title="Getting started" links={GETTING_STARTED} onNavigate={onNavigate} />
      <Section title="Components" links={COMPONENT_LINKS} onNavigate={onNavigate} />
    </>
  )
}

export function DocsSidebar() {
  return (
    <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pr-2 lg:block">
      <nav aria-label="Documentation">
        <SidebarLinks />
      </nav>
    </aside>
  )
}

/** Hamburger + drawer below 1024px. */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  return (
    <>
      <IconButton
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="-ml-1.5 lg:hidden"
      >
        <MenuIcon className="size-5" />
      </IconButton>
      {open && (
        <Drawer
          key={pathname}
          title="Menu"
          icon={<Logo className="size-5 text-ink" />}
          closeLabel="Close"
          onClose={() => setOpen(false)}
          className="sm:max-w-[320px]"
        >
          <nav aria-label="Documentation">
            <Section
              title="Menu"
              links={[
                { title: 'Home', href: '/' },
                { title: 'Docs', href: '/docs' },
                { title: 'Components', href: '/docs/components' },
              ]}
              onNavigate={() => setOpen(false)}
            />
            <SidebarLinks onNavigate={() => setOpen(false)} />
          </nav>
        </Drawer>
      )}
    </>
  )
}
