import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

export default function ModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Delete agent
      </Button>
      {open && (
        <Modal label="Delete agent" onClose={() => setOpen(false)} className="max-w-[440px]">
          <div className="flex flex-col gap-4 p-5">
            <h2 className="text-lg font-semibold">Delete agent?</h2>
            <p className="text-sm text-dim">
              Its versions and conversations go with it. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
