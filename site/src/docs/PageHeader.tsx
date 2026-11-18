import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-base text-dim">{description}</p>
      {children}
    </header>
  )
}
