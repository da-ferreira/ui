import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  Check,
  Bot,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Copy,
  Ellipsis,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button, IconButton } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Chip } from '@/components/ui/Chip'
import { DatePicker } from '@/components/ui/DatePicker'
import { HelpTip } from '@/components/ui/HelpTip'
import { Field, Input } from '@/components/ui/Input'
import { Menu } from '@/components/ui/Menu'
import { Drawer, Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Slider } from '@/components/ui/Slider'
import { Switch } from '@/components/ui/Switch'
import { Toaster, type Toast } from '@/components/ui/Toaster'
import { Truncate } from '@/components/ui/Truncate'
import { COMPONENTS } from '../docs/components'
import { GITHUB } from '../layout/nav'
import { HeroCode } from './HeroCode'

export function Home() {
  return (
    <main className="flex-1">
      <title>@davidalmeida/ui</title>
      <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 pt-14 pb-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-24">
        <div className="flex flex-col items-start">
          <h1 className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-ink sm:text-5xl">
            Components you copy, read and own
          </h1>
          <p className="mt-5 max-w-lg text-base text-pretty text-dim sm:text-lg">
            A small set of React pieces for real product screens. The CLI copies the source into
            your project, so changing a component is just editing a file.
          </p>
          <ul className="mt-6 flex flex-col gap-2.5 text-[15px] text-ink">
            {[
              `${COMPONENTS.length} components for React 19 and Tailwind 4`,
              'Written by hand, no Radix and no runtime wrapper',
              'Keyboard and screen reader support built in',
              'Light and dark themes from plain CSS tokens',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/docs/installation"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-brand-ink transition hover:opacity-90 focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
            >
              Get started
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              to="/docs/components"
              className="inline-flex h-10 items-center rounded-lg border border-field bg-canvas px-4 text-sm font-medium text-ink transition hover:bg-surface focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
            >
              Browse components
            </Link>
          </div>
        </div>
        <HeroCode />
      </section>

      <section className="mx-auto max-w-[1200px] px-4 pb-20 sm:px-6">
        <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <AgentCard />
            <InviteCard />
          </div>
          <div className="flex flex-col gap-4">
            <ConversationsCard />
            <NoticesCard />
            <ButtonsCard />
          </div>
          <div className="flex flex-col gap-4 md:col-span-2 md:grid md:grid-cols-2 lg:col-span-1 lg:flex">
            <ScheduleCard />
            <TeamCard />
            <OverlaysCard />
            <LoadingCard />
          </div>
        </div>
      </section>

      <footer className="border-t border-hairline">
        <p className="mx-auto max-w-[1440px] px-4 py-6 text-[13px] text-dim sm:px-6">
          MIT licensed. Source on{' '}
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline decoration-field underline-offset-4 hover:decoration-ink"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </main>
  )
}

function Card({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-hairline bg-canvas p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

function AgentCard() {
  const [model, setModel] = useState('llama-3.3-70b')
  const [temp, setTemp] = useState(0.7)
  const [interrupt, setInterrupt] = useState(true)
  const [memory, setMemory] = useState(false)
  return (
    <Card title="Agent" action={<Badge variant="outline">Draft</Badge>}>
      <Field label="Name">{(id) => <Input id={id} defaultValue="Support — billing" />}</Field>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Model</span>
        <Select
          aria-label="Model"
          value={model}
          onChange={setModel}
          options={[
            { value: 'gpt-oss-120b', label: 'GPT OSS 120B', group: 'Groq', badge: 'Fast' },
            { value: 'llama-3.3-70b', label: 'Llama 3.3 70B', group: 'Groq' },
            { value: 'claude-sonnet', label: 'Claude Sonnet', group: 'Anthropic' },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 font-medium text-ink-soft">
            Temperature
            <HelpTip text="Higher is more creative, lower is more predictable." />
          </span>
          <span className="text-dim tabular-nums">{temp.toFixed(1)}</span>
        </div>
        <Slider
          aria-label="Temperature"
          min={0}
          max={2}
          step={0.1}
          value={temp}
          onChange={setTemp}
        />
      </div>
      <label className="flex items-center justify-between gap-3 text-sm text-ink-soft">
        Caller can interrupt
        <Switch checked={interrupt} onChange={setInterrupt} />
      </label>
      <Checkbox checked={memory} onChange={setMemory}>
        Remember previous calls
      </Checkbox>
      <div className="flex justify-end gap-2 pt-1">
        <Button variant="secondary">Cancel</Button>
        <Button>Save</Button>
      </div>
    </Card>
  )
}

const people = [
  { name: 'Ana Souza', text: 'Wants the second copy of the bill', status: 'Success' },
  { name: 'Bruno Lima', text: 'Asked to call back tomorrow', status: 'Live' },
  { name: 'Carla Dias', text: 'Disputed the amount', status: 'Failed' },
  { name: 'Diego Reis', text: 'Agreed to pay on Friday', status: 'Success' },
]

function ConversationsCard() {
  const [filter, setFilter] = useState('All')
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const shown = filter === 'All' ? people : people.filter((p) => p.status === filter)
  return (
    <Card
      title="Conversations"
      action={
        <IconButton aria-label="New conversation">
          <Plus className="size-4" />
        </IconButton>
      }
    >
      <Input icon={<Search />} placeholder="Search" aria-label="Search conversations" />
      <div className="flex flex-wrap gap-2">
        {['All', 'Live', 'Success', 'Failed'].map((f) => (
          <Chip
            key={f}
            active={filter === f}
            count={f === 'All' ? people.length : people.filter((p) => p.status === f).length}
            onClick={() => setFilter(f)}
          >
            {f}
          </Chip>
        ))}
      </div>
      <ul className="-mx-2 flex flex-col">
        {shown.map((p) => (
          <li
            key={p.name}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface"
          >
            <Avatar name={p.name} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink">{p.name}</p>
              <p className="truncate text-[13px] text-dim">{p.text}</p>
            </div>
            {p.status === 'Live' && <Badge variant="brand">Live</Badge>}
            <IconButton
              aria-label={`Actions for ${p.name}`}
              aria-haspopup="menu"
              onClick={(e) => setAnchor(e.currentTarget)}
            >
              <Ellipsis className="size-4" />
            </IconButton>
          </li>
        ))}
      </ul>
      {anchor && (
        <Menu
          anchor={anchor}
          onClose={() => setAnchor(null)}
          items={[
            { id: 'open', label: 'Open', icon: <Bot />, onSelect: () => {} },
            { id: 'rename', label: 'Rename', icon: <Pencil />, onSelect: () => {} },
            { id: 'delete', label: 'Delete', icon: <Trash2 />, danger: true, onSelect: () => {} },
          ]}
        />
      )}
    </Card>
  )
}

function ScheduleCard() {
  const [date, setDate] = useState('2026-11-20')
  const [slot, setSlot] = useState('10:00')
  return (
    <Card title="Schedule a campaign">
      <DatePicker
        aria-label="Date"
        value={date}
        onChange={setDate}
        locale="en-US"
        placeholder="mm/dd/yyyy"
        todayLabel="Today"
        previousMonthLabel="Previous month"
        nextMonthLabel="Next month"
      />
      <div className="flex flex-wrap gap-2">
        {['09:00', '10:00', '14:00', '18:00'].map((t) => (
          <Chip key={t} active={slot === t} onClick={() => setSlot(t)}>
            {t}
          </Chip>
        ))}
      </div>
      <Button className="w-full">Schedule</Button>
    </Card>
  )
}

function LoadingCard() {
  return (
    <Card title="Loading">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3.5 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
    </Card>
  )
}

function InviteCard() {
  const [role, setRole] = useState('editor')
  const [notify, setNotify] = useState(true)
  return (
    <Card title="Invite to agent">
      <Field label="Email">
        {(id) => <Input id={id} autoComplete="off" placeholder="name@company.com" />}
      </Field>
      <Field label="Role">
        {() => (
          <Select
            aria-label="Role"
            value={role}
            onChange={setRole}
            options={[
              { value: 'editor', label: 'Editor', description: 'Saves drafts and publishes' },
              { value: 'viewer', label: 'Viewer', description: 'Only reads' },
            ]}
          />
        )}
      </Field>
      <Checkbox checked={notify} onChange={setNotify}>
        Send an email
      </Checkbox>
      <Button className="w-full">Send invite</Button>
    </Card>
  )
}

let toastId = 0

function NoticesCard() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id))
  function push(type: Toast['type'], message: string) {
    const id = ++toastId
    setToasts((t) => [...t, { id, type, message }])
    setTimeout(() => dismiss(id), 4000)
  }
  return (
    <Card title="Notices">
      <p className="text-[13px] text-dim">Toasts stack in the corner and close by themselves.</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => push('success', 'Version 3 published')}
        >
          <CircleCheck className="size-4 text-ok" />
          Success
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => push('error', 'Could not save. Try again.')}
        >
          <CircleAlert className="size-4 text-danger" />
          Error
        </Button>
      </div>
      <Toaster toasts={toasts} onDismiss={dismiss} closeLabel="Close" />
    </Card>
  )
}

function ButtonsCard() {
  return (
    <Card title="Buttons">
      <div className="flex flex-wrap gap-2">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="secondary">
          Secondary
        </Button>
        <Button size="sm" variant="ghost">
          Ghost
        </Button>
        <Button size="sm" variant="danger">
          Delete
        </Button>
      </div>
      <div className="flex items-center gap-1">
        <IconButton aria-label="Copy">
          <Copy className="size-4" />
        </IconButton>
        <IconButton aria-label="Share">
          <Share2 className="size-4" />
        </IconButton>
        <IconButton aria-label="Settings">
          <Settings className="size-4" />
        </IconButton>
        <Badge variant="outline" className="ml-auto">
          4 variants · 3 sizes
        </Badge>
      </div>
    </Card>
  )
}

const team = [
  { name: 'Marina Costa', role: 'Owner' },
  { name: 'Paulo Henrique Albuquerque de Oliveira', role: 'Editor' },
  { name: 'Rita Nunes', role: 'Viewer' },
]

function TeamCard() {
  const [roles, setRoles] = useState(() => Object.fromEntries(team.map((m) => [m.name, m.role])))
  return (
    <Card
      title="Team"
      action={<HelpTip text="Owners publish, editors save drafts, viewers only read." />}
    >
      <ul className="flex flex-col gap-3">
        {team.map((m) => (
          <li key={m.name} className="flex items-center gap-3">
            <Avatar name={m.name} />
            <Truncate className="min-w-0 flex-1 text-sm font-medium text-ink">{m.name}</Truncate>
            {m.role === 'Owner' ? (
              <Badge variant="brand">Owner</Badge>
            ) : (
              <Select
                aria-label={`Role of ${m.name}`}
                value={roles[m.name]}
                onChange={(r) => setRoles({ ...roles, [m.name]: r })}
                minListWidth={120}
                options={[
                  { value: 'Editor', label: 'Editor' },
                  { value: 'Viewer', label: 'Viewer' },
                ]}
                triggerClassName="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[13px] text-dim transition hover:bg-surface hover:text-ink focus-visible:ring-4 focus-visible:ring-brand-area focus-visible:outline-none"
              >
                {roles[m.name]}
                <ChevronDown aria-hidden className="size-3.5" />
              </Select>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}

function OverlaysCard() {
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  return (
    <Card title="Dialogs">
      <p className="text-[13px] text-dim">Focus stays inside; Esc closes the top one.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => setModal(true)}>
          Open modal
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setDrawer(true)}>
          Open drawer
        </Button>
      </div>
      {modal && (
        <Modal label="Discard changes" onClose={() => setModal(false)} className="max-w-[420px]">
          <div className="flex flex-col gap-4 p-5">
            <h2 className="text-lg font-semibold">Discard changes?</h2>
            <p className="text-sm text-dim">Your draft will be lost.</p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setModal(false)}>
                Keep editing
              </Button>
              <Button variant="danger" onClick={() => setModal(false)}>
                Discard
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {drawer && (
        <Drawer
          title="Filters"
          description="Narrow the conversations list."
          icon={<SlidersHorizontal />}
          closeLabel="Close"
          onClose={() => setDrawer(false)}
          className="sm:max-w-[400px]"
          footer={<Button onClick={() => setDrawer(false)}>Apply</Button>}
        >
          <div className="flex flex-col gap-4">
            <Field label="Customer">{(id) => <Input id={id} placeholder="Name or phone" />}</Field>
            <Checkbox checked onChange={() => {}}>
              Only with feedback
            </Checkbox>
          </div>
        </Drawer>
      )}
    </Card>
  )
}
