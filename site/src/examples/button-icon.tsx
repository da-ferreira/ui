import { Plus, Settings, Upload } from 'lucide-react'
import { Button, IconButton } from '@/components/ui/Button'

export default function ButtonIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>
        <Plus className="size-4" />
        New agent
      </Button>
      <Button variant="secondary">
        <Upload className="size-4" />
        Import
      </Button>
      <IconButton aria-label="Settings">
        <Settings className="size-4" />
      </IconButton>
      <Button disabled>Disabled</Button>
    </div>
  )
}
