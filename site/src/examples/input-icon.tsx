import { Search } from 'lucide-react'
import { Field, Input } from '@/components/ui/Input'

export default function InputIcon() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input icon={<Search />} placeholder="Search agents" aria-label="Search agents" />
      <Field label="Name">
        {(id) => (
          <>
            <Input id={id} invalid defaultValue="" aria-describedby={`${id}-error`} />
            <p id={`${id}-error`} className="text-[13px] text-danger">
              Name is required
            </p>
          </>
        )}
      </Field>
    </div>
  )
}
