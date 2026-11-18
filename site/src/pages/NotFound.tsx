import { Link } from 'react-router'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <p className="font-mono text-sm text-dim">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-sm text-dim">This page does not exist, or it moved.</p>
      <Link
        to="/docs"
        className="mt-2 text-sm font-medium text-ink underline decoration-field underline-offset-4 hover:decoration-ink"
      >
        Back to the docs
      </Link>
    </div>
  )
}
