import { useSyncExternalStore } from 'react'

export const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const
export type Manager = (typeof MANAGERS)[number]

export const RUN: Record<Manager, string> = {
  pnpm: 'pnpm dlx',
  npm: 'npx',
  yarn: 'yarn dlx',
  bun: 'bunx',
}

const KEY = 'pm'
const listeners = new Set<() => void>()

function read(): Manager {
  try {
    const v = localStorage.getItem(KEY) as Manager | null
    return v && MANAGERS.includes(v) ? v : 'pnpm'
  } catch {
    return 'pnpm'
  }
}

let current = read()

/** Chosen package manager, shared by every command block on the site. */
export function useManager() {
  const value = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => current,
  )
  const set = (m: Manager) => {
    current = m
    try {
      localStorage.setItem(KEY, m)
    } catch {
      /* the choice lasts for this visit */
    }
    listeners.forEach((l) => l())
  }
  return [value, set] as const
}
