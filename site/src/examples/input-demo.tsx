import { Field, Input, PasswordInput } from '@/components/ui/Input'

export default function InputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Email">
        {(id) => <Input id={id} type="email" placeholder="you@example.com" />}
      </Field>
      <Field label="Password">
        {(id) => <PasswordInput id={id} showLabel="Show password" hideLabel="Hide password" />}
      </Field>
    </div>
  )
}
