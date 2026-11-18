import { HelpTip } from '@/components/ui/HelpTip'

export default function HelpTipDemo() {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-ink-soft">
      Endpointing
      <HelpTip text="How long the caller must stay silent before the turn ends. Higher catches longer sentences but answers later." />
    </div>
  )
}
