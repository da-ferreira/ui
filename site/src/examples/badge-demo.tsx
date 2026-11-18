import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge>Draft</Badge>
      <Badge variant="brand">
        <Sparkles />
        New
      </Badge>
      <Badge variant="outline">Beta</Badge>
    </div>
  )
}
