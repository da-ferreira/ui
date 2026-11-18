import { COMPONENTS } from '../docs/components'

export type NavLink = { title: string; href: string }

export const GETTING_STARTED: NavLink[] = [
  { title: 'Introduction', href: '/docs' },
  { title: 'Installation', href: '/docs/installation' },
  { title: 'Theming', href: '/docs/theming' },
]

export const COMPONENT_LINKS: NavLink[] = COMPONENTS.map((c) => ({
  title: c.name,
  href: `/docs/components/${c.slug}`,
}))

export const ALL_LINKS = [...GETTING_STARTED, ...COMPONENT_LINKS]

export const GITHUB = 'https://github.com/da-ferreira/ui'
export const NPM = 'https://www.npmjs.com/package/@davidalmeida/ui'
