import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { Select } from './Select'

export type Theme = 'system' | 'light' | 'dark'

const QUERY = '(prefers-color-scheme: dark)'

function read(key: string): Theme {
  try {
    const t = localStorage.getItem(key)
    return t === 'light' || t === 'dark' ? t : 'system'
  } catch {
    return 'system'
  }
}

function apply(t: Theme) {
  const dark = t === 'dark' || (t === 'system' && matchMedia(QUERY).matches)
  document.documentElement.classList.toggle('dark', dark)
}

const ICONS = { system: Monitor, light: Sun, dark: Moon }

type Props = {
  /** localStorage key; absent means "follow the system". */
  storageKey?: string
  label?: string
  labels?: Record<Theme, string>
  className?: string
}

/**
 * Light / dark / system switch: toggles `.dark` on <html> and remembers the choice.
 * To avoid a flash on load, apply the saved theme with an inline script in <head>.
 */
export function ThemeToggle({
  storageKey = 'theme',
  label = 'Tema',
  labels = { system: 'Sistema', light: 'Claro', dark: 'Escuro' },
  className,
}: Props) {
  const [theme, setTheme] = useState<Theme>(() => read(storageKey))

  useEffect(() => {
    apply(theme)
    if (theme !== 'system') return
    const mq = matchMedia(QUERY)
    const follow = () => apply('system')
    mq.addEventListener('change', follow)
    return () => mq.removeEventListener('change', follow)
  }, [theme])

  const Icon = ICONS[theme]
  return (
    <Select
      aria-label={label}
      title={label}
      value={theme}
      minListWidth={140}
      className={className}
      options={(['system', 'light', 'dark'] as const).map((value) => ({
        value,
        label: labels[value],
      }))}
      onChange={(t) => {
        try {
          if (t === 'system') localStorage.removeItem(storageKey)
          else localStorage.setItem(storageKey, t)
        } catch {
          /* no storage: the choice lasts until reload */
        }
        setTheme(t)
      }}
      triggerClassName="inline-flex size-9 items-center justify-center rounded-lg border border-field bg-canvas text-dim transition hover:bg-surface hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
    >
      <Icon aria-hidden className="size-4" />
    </Select>
  )
}
