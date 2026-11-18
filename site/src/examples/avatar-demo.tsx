import { Avatar } from '@/components/ui/Avatar'

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar name="Ada Lovelace" />
      <Avatar name="grace.hopper" className="size-8 text-xs" />
      <Avatar name="Linus" className="size-10 bg-brand text-sm text-brand-ink" />
    </div>
  )
}
