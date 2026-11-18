import { useState } from 'react'
import { AudioLines } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { Drawer } from '@/components/ui/Modal'
import { Slider } from '@/components/ui/Slider'

export default function DrawerDemo() {
  const [open, setOpen] = useState(false)
  const [speed, setSpeed] = useState(1)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Voice settings
      </Button>
      {open && (
        <Drawer
          title="Voice"
          description="Choose the voice and adjust its speed."
          icon={<AudioLines />}
          closeLabel="Close"
          onClose={() => setOpen(false)}
          className="sm:max-w-[440px]"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Apply</Button>
            </>
          }
        >
          <div className="flex flex-col gap-5">
            <Field label="Voice ID">{(id) => <Input id={id} defaultValue="clara-pt-br" />}</Field>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-ink-soft">Speed · {speed.toFixed(2)}×</span>
              <Slider
                aria-label="Speed"
                min={0.7}
                max={1.2}
                step={0.05}
                value={speed}
                onChange={setSpeed}
              />
            </div>
          </div>
        </Drawer>
      )}
    </>
  )
}
