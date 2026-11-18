import { useState } from 'react'
import { Copy, Ellipsis, Pencil, Share2, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/ui/Button'
import { Menu } from '@/components/ui/Menu'

export default function MenuDemo() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <IconButton
        aria-label="Actions"
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}
        className="border border-field"
      >
        <Ellipsis className="size-4" />
      </IconButton>
      {anchor && (
        <Menu
          anchor={anchor}
          onClose={() => setAnchor(null)}
          items={[
            { id: 'rename', label: 'Rename', icon: <Pencil />, onSelect: () => {} },
            { id: 'duplicate', label: 'Duplicate', icon: <Copy />, onSelect: () => {} },
            {
              id: 'share',
              label: 'Share',
              icon: <Share2 />,
              disabled: true,
              title: 'Only the owner can share',
              onSelect: () => {},
            },
            { id: 'delete', label: 'Delete', icon: <Trash2 />, danger: true, onSelect: () => {} },
          ]}
        />
      )}
    </>
  )
}
