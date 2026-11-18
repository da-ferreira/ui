import { Button } from '@/components/ui/Button'

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>
    </div>
  )
}
