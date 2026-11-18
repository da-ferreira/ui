import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { cn } from '@/components/ui/cn'

type Heading = { id: string; text: string; level: number }

/** "On This Page": reads the h2/h3 with an id inside #docs-content. */
export function Toc() {
  const { pathname } = useLocation()
  const [items, setItems] = useState<Heading[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const root = document.getElementById('docs-content')
    if (!root) return
    const nodes = [...root.querySelectorAll<HTMLElement>('h2[id], h3[id]')]
    setItems(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent ?? '',
        level: n.tagName === 'H2' ? 2 : 3,
      })),
    )
    setActive(nodes[0]?.id ?? '')

    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        const first = nodes.find((n) => visible.has(n.id))
        if (first) setActive(first.id)
      },
      { rootMargin: '-64px 0px -65% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [pathname])

  if (items.length < 2) return null
  return (
    <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-52 shrink-0 overflow-y-auto py-8 xl:block">
      <p className="mb-2 text-xs font-medium text-faint">On This Page</p>
      <ul className="flex flex-col gap-1.5 text-[13px]">
        {items.map((i) => (
          <li key={i.id} className={cn(i.level === 3 && 'pl-3')}>
            <a
              href={`#${i.id}`}
              className={cn(
                'block rounded transition hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none',
                active === i.id ? 'font-medium text-ink' : 'text-dim',
              )}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
