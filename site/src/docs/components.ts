import type { ComponentType } from 'react'
import type { PropRow } from './PropsTable'

const modules = import.meta.glob<{ default: ComponentType }>('../examples/*.tsx', { eager: true })
const sources = import.meta.glob<string>('../examples/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const pieces = import.meta.glob<string>('../../../src/components/*.{ts,tsx}', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export function example(id: string) {
  const path = `../examples/${id}.tsx`
  return { Component: modules[path].default, code: sources[path] }
}

/** Source of a piece as `add` copies it. */
export function pieceSource(file: string) {
  return pieces[`../../../src/components/${file}`]
}

export type ComponentDoc = {
  slug: string
  name: string
  description: string
  /** Name passed to `add` (Drawer lives in modal). */
  add: string
  /** Files `add` copies, the piece's first. */
  files: string[]
  npm?: string[]
  usage: { imports: string; code: string }
  examples: { id: string; title?: string; note?: string }[]
  api: { name: string; note?: string; rows: PropRow[] }[]
  notes?: string[]
}

const cn = 'cn.ts'

export const COMPONENTS: ComponentDoc[] = [
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'Initials of a person in a circle — first letters of the first two words.',
    add: 'avatar',
    files: ['Avatar.tsx', cn],
    usage: {
      imports: `import { Avatar } from '@/components/ui/Avatar'`,
      code: `<Avatar name="Ada Lovelace" />`,
    },
    examples: [{ id: 'avatar-demo' }],
    api: [
      {
        name: 'Avatar',
        rows: [
          ['name', 'string', '', 'Split on spaces, dots, dashes and underscores.'],
          ['className', 'string', '', 'Size and colors, e.g. size-8 bg-brand.'],
        ],
      },
    ],
    notes: ['It is aria-hidden: show the name in text next to it.'],
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: 'Small label for a status or a tag next to a title.',
    add: 'badge',
    files: ['Badge.tsx', cn],
    usage: {
      imports: `import { Badge } from '@/components/ui/Badge'`,
      code: `<Badge variant="brand">New</Badge>`,
    },
    examples: [{ id: 'badge-demo' }],
    api: [
      {
        name: 'Badge',
        note: 'Also takes every <span> attribute.',
        rows: [
          [
            'variant',
            "'neutral' | 'brand' | 'outline'",
            "'neutral'",
            'An svg child is sized to 12px.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'button',
    name: 'Button',
    description: 'Button in four variants and three sizes, plus a square IconButton.',
    add: 'button',
    files: ['Button.tsx', cn],
    usage: {
      imports: `import { Button } from '@/components/ui/Button'`,
      code: `<Button variant="secondary">Cancel</Button>`,
    },
    examples: [
      { id: 'button-demo' },
      { id: 'button-sizes', title: 'Sizes' },
      {
        id: 'button-icon',
        title: 'With icon',
        note: 'Icons go as children. IconButton needs an aria-label.',
      },
    ],
    api: [
      {
        name: 'Button',
        note: 'Also takes every <button> attribute; type defaults to "button".',
        rows: [
          ['variant', "'primary' | 'secondary' | 'ghost' | 'danger'", "'primary'", ''],
          ['size', "'sm' | 'md' | 'lg'", "'md'", 'Heights 32, 36 and 40px.'],
        ],
      },
      { name: 'IconButton', note: '32×32 ghost button; takes every <button> attribute.', rows: [] },
    ],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Native checkbox with its label, styled with the brand color.',
    add: 'checkbox',
    files: ['Checkbox.tsx', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { Checkbox } from '@/components/ui/Checkbox'`,
      code: `<Checkbox checked={checked} onChange={setChecked}>
  Accept terms
</Checkbox>`,
    },
    examples: [{ id: 'checkbox-demo' }],
    api: [
      {
        name: 'Checkbox',
        note: 'Other <input> attributes go to the input.',
        rows: [
          ['checked', 'boolean', '', ''],
          ['onChange', '(checked: boolean) => void', '', ''],
          ['children', 'ReactNode', '', 'The label; clicking it toggles the box.'],
        ],
      },
    ],
  },
  {
    slug: 'chip',
    name: 'Chip',
    description: 'Pill-shaped toggle for filters, with an optional count.',
    add: 'chip',
    files: ['Chip.tsx', cn],
    usage: {
      imports: `import { Chip } from '@/components/ui/Chip'`,
      code: `<Chip active={status === 'live'} count={3} onClick={() => setStatus('live')}>
  Live
</Chip>`,
    },
    examples: [{ id: 'chip-demo' }],
    api: [
      {
        name: 'Chip',
        note: 'Also takes every <button> attribute; sets aria-pressed.',
        rows: [
          ['active', 'boolean', '', ''],
          ['count', 'number', '', 'Shown after the label, aligned to its baseline.'],
        ],
      },
    ],
  },
  {
    slug: 'date-picker',
    name: 'Date Picker',
    description: 'Date field with its own calendar — never the native picker.',
    add: 'date-picker',
    files: ['DatePicker.tsx', 'focus.ts', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { DatePicker } from '@/components/ui/DatePicker'`,
      code: `<DatePicker aria-label="Start" value={date} onChange={setDate} />`,
    },
    examples: [
      { id: 'date-picker-demo', note: 'Texts and date format follow locale and the label props.' },
      {
        id: 'date-picker-range',
        title: 'Range',
        note: 'Two fields sharing range paint the period between them; min and max block the rest.',
      },
    ],
    api: [
      {
        name: 'DatePicker',
        rows: [
          ['value', 'string', '', '"YYYY-MM-DD" in local time, or "" for empty.'],
          ['onChange', '(iso: string) => void', '', ''],
          ['aria-label', 'string', '', 'Required.'],
          ['min / max', 'string', '', '"YYYY-MM-DD"; days outside are disabled.'],
          ['range', '{ from: string; to: string }', '', 'Highlights the days between.'],
          ['invalid', 'boolean', '', 'Red border.'],
          ['locale', 'string', "'pt-BR'", 'Month, weekdays and the date in the field.'],
          ['placeholder', 'string', "'dd/mm/aaaa'", ''],
          ['todayLabel', 'string', "'Hoje'", ''],
          ['previousMonthLabel', 'string', "'Mês anterior'", ''],
          ['nextMonthLabel', 'string', "'Próximo mês'", ''],
        ],
      },
    ],
    notes: [
      'Arrow keys move by day and week, Page Up/Down by month, Home/End to the week edges; Tab stays inside the calendar.',
    ],
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    description: 'Panel that slides in from the right, full screen on phones.',
    add: 'modal',
    files: ['Modal.tsx', 'Button.tsx', 'Truncate.tsx', 'focus.ts', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { Drawer } from '@/components/ui/Modal'`,
      code: `{open && (
  <Drawer title="Voice" icon={<AudioLines />} onClose={() => setOpen(false)}>
    …
  </Drawer>
)}`,
    },
    examples: [{ id: 'drawer-demo' }],
    api: [
      {
        name: 'Drawer',
        rows: [
          ['onClose', '() => void', '', 'Esc, the backdrop and the X call it.'],
          ['title', 'string', '', 'Header and the dialog name.'],
          ['icon', 'ReactNode', '', 'Square next to the title.'],
          ['description', 'string', '', 'Line under the title; wraps.'],
          ['footer', 'ReactNode', '', 'Pinned bar (e.g. Save); does not scroll.'],
          ['header', 'ReactNode', '', 'Replaces the default header.'],
          ['closeLabel', 'string', "'Fechar'", ''],
          ['className', 'string', '', 'Width from 640px up, e.g. sm:max-w-[600px].'],
        ],
      },
    ],
    notes: ['Lives in Modal.tsx: `add modal` brings both. Shares the layer stack with Modal.'],
  },
  {
    slug: 'help-tip',
    name: 'Help Tip',
    description: 'A "?" icon that explains something on hover or focus.',
    add: 'help-tip',
    files: ['HelpTip.tsx'],
    npm: ['lucide-react'],
    usage: {
      imports: `import { HelpTip } from '@/components/ui/HelpTip'`,
      code: `<HelpTip text="How long the caller must stay silent before the turn ends." />`,
    },
    examples: [{ id: 'help-tip-demo' }],
    api: [
      {
        name: 'HelpTip',
        rows: [['text', 'string', '', 'Tooltip and accessible name; line breaks are kept.']],
      },
    ],
  },
  {
    slug: 'input',
    name: 'Input',
    description: 'Text field with an optional icon, a password field and a labeled Field.',
    add: 'input',
    files: ['Input.tsx', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { Field, Input } from '@/components/ui/Input'`,
      code: `<Field label="Email">{(id) => <Input id={id} type="email" />}</Field>`,
    },
    examples: [{ id: 'input-demo' }, { id: 'input-icon', title: 'Icon and error' }],
    api: [
      {
        name: 'Input',
        note: 'Also takes every <input> attribute. 16px text on phones so iOS does not zoom.',
        rows: [
          ['invalid', 'boolean', '', 'Red border and aria-invalid.'],
          ['icon', 'ReactNode', '', 'Left icon, e.g. a magnifier.'],
        ],
      },
      {
        name: 'PasswordInput',
        rows: [
          ['showLabel', 'string', "'Mostrar senha'", ''],
          ['hideLabel', 'string', "'Ocultar senha'", ''],
        ],
      },
      {
        name: 'Field',
        rows: [
          ['label', 'string', '', ''],
          [
            'children',
            '(id: string) => ReactNode',
            '',
            'Receives the id that ties the label to the control.',
          ],
        ],
      },
    ],
  },
  {
    slug: 'menu',
    name: 'Menu',
    description: 'Dropdown of actions tied to a button; opens above when there is no room below.',
    add: 'menu',
    files: ['Menu.tsx', cn],
    usage: {
      imports: `import { Menu } from '@/components/ui/Menu'`,
      code: `{anchor && <Menu anchor={anchor} items={items} onClose={() => setAnchor(null)} />}`,
    },
    examples: [
      {
        id: 'menu-demo',
        note: 'A disabled item stays clickable and shows its title, so you can explain why.',
      },
    ],
    api: [
      {
        name: 'Menu',
        rows: [
          ['anchor', 'HTMLElement', '', 'The button; focus returns to it on close.'],
          ['items', 'MenuItem[]', '', ''],
          ['onClose', '() => void', '', 'Outside click, Esc, Tab, scroll and resize.'],
          ['width', 'number', '176', ''],
        ],
      },
      {
        name: 'MenuItem',
        rows: [
          ['id', 'string', '', ''],
          ['label', 'string', '', ''],
          ['icon', 'ReactNode', '', ''],
          ['onSelect', '() => void', '', 'Called after the menu closes.'],
          ['danger', 'boolean', '', ''],
          ['disabled', 'boolean', '', 'Looks disabled, still clickable.'],
          ['title', 'string', '', 'Native tooltip.'],
        ],
      },
    ],
  },
  {
    slug: 'modal',
    name: 'Modal',
    description: 'Dialog centered over a backdrop, with focus kept inside.',
    add: 'modal',
    files: ['Modal.tsx', 'Button.tsx', 'Truncate.tsx', 'focus.ts', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { Modal } from '@/components/ui/Modal'`,
      code: `{open && (
  <Modal label="Delete agent" onClose={() => setOpen(false)} className="max-w-[440px]">
    …
  </Modal>
)}`,
    },
    examples: [{ id: 'modal-demo' }],
    api: [
      {
        name: 'Modal',
        rows: [
          ['onClose', '() => void', '', 'Esc and the backdrop call it.'],
          ['label', 'string', '', 'Accessible name of the dialog.'],
          ['className', 'string', '', 'Width, e.g. max-w-[560px].'],
          ['fullScreenOnMobile', 'boolean', 'false', 'Below 640px it fills the screen.'],
        ],
      },
    ],
    notes: [
      'Modals and drawers stack: Esc and the Tab trap act only on the top one, and focus goes back to where it was when it closes.',
    ],
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'Combobox with its own list in a portal — groups, descriptions and badges.',
    add: 'select',
    files: ['Select.tsx', 'Badge.tsx', 'Truncate.tsx', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { Select } from '@/components/ui/Select'`,
      code: `<Select aria-label="Fruit" value={fruit} onChange={setFruit} options={options} />`,
    },
    examples: [
      { id: 'select-demo' },
      {
        id: 'select-groups',
        title: 'Groups, descriptions and badges',
        note: 'Consecutive options with the same group get a header.',
      },
    ],
    api: [
      {
        name: 'Select',
        rows: [
          ['value', "T | '' | null | undefined", '', 'T is string | number.'],
          ['options', 'SelectOption<T>[]', '', ''],
          ['onChange', '(value: T) => void', '', ''],
          ['aria-label', 'string', '', 'Required.'],
          ['placeholder', 'string', "'Selecionar'", ''],
          ['disabled', 'boolean', '', ''],
          ['triggerClassName', 'string', '', 'Replaces the trigger look.'],
          ['children', 'ReactNode', '', 'Replaces the trigger content.'],
          ['minListWidth', 'number', '0', 'For narrow triggers.'],
        ],
      },
      {
        name: 'SelectOption',
        rows: [
          ['value', 'T', '', ''],
          ['label', 'string', '', ''],
          ['group', 'string', '', ''],
          ['description', 'string', '', 'Second line.'],
          ['badge', 'string', '', ''],
        ],
      },
    ],
  },
  {
    slug: 'sidebar',
    name: 'Sidebar',
    description:
      'App shell: a sidebar that pushes the content on desktop and becomes a drawer below 1024px.',
    add: 'sidebar sidebar-layout',
    files: ['SidebarLayout.tsx', 'Sidebar.tsx', 'Button.tsx', 'Truncate.tsx', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { SidebarHeader, SidebarItem, SidebarNav, SidebarSection } from '@/components/ui/Sidebar'
import { SidebarLayout } from '@/components/ui/SidebarLayout'`,
      code: `<SidebarLayout
  navigationKey={pathname}
  sidebar={
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarNav>
        <SidebarSection title="Workspace">
          <SidebarItem as={Link} to="/" icon={<House />} active={pathname === '/'}>
            Home
          </SidebarItem>
        </SidebarSection>
      </SidebarNav>
    </>
  }
>
  <Outlet />
</SidebarLayout>`,
    },
    examples: [
      {
        id: 'sidebar-demo',
        note: 'Narrow the window below 1024px to see the drawer. Pass your router’s Link as `as`.',
      },
    ],
    api: [
      {
        name: 'SidebarLayout',
        rows: [
          ['sidebar', 'ReactNode', '', ''],
          ['header', 'ReactNode', '', 'After the toggle button.'],
          ['banner', 'ReactNode', '', 'Strip under the header; does not scroll.'],
          ['overlays', 'ReactNode', '', 'Modals and floating notices.'],
          ['navigationKey', 'string', '', 'Change it on navigation so the drawer closes.'],
          ['sidebarWidth', 'number', '248', ''],
          ['toggleLabel', 'string', "'Alternar barra lateral'", ''],
          ['contentClassName / contentStyle', 'string / CSSProperties', '', 'Content column.'],
        ],
      },
      {
        name: 'SidebarItem',
        note: 'Also takes the props of `as`.',
        rows: [
          ['as', 'ElementType', "'a'", 'e.g. your router Link, or "button".'],
          ['icon', 'ReactNode', '', ''],
          ['indicator', 'ReactNode', '', 'Over the icon, e.g. a live dot.'],
          ['extra', 'ReactNode', '', 'Right of the label, e.g. a Badge.'],
          ['active', 'boolean', '', 'Sets aria-current="page".'],
          ['disabled', 'boolean', '', 'Looks disabled, still clickable.'],
        ],
      },
      {
        name: 'SidebarHeader · SidebarNav · SidebarSection · SidebarFooter',
        rows: [['title', 'ReactNode', '', 'SidebarSection only.']],
      },
    ],
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    description: 'Pulsing placeholder while data loads.',
    add: 'skeleton',
    files: ['Skeleton.tsx', cn],
    usage: {
      imports: `import { Skeleton } from '@/components/ui/Skeleton'`,
      code: `<Skeleton className="h-4 w-40" />`,
    },
    examples: [{ id: 'skeleton-demo' }],
    api: [{ name: 'Skeleton', rows: [['className', 'string', '', 'Size and shape.']] }],
  },
  {
    slug: 'slider',
    name: 'Slider',
    description: 'Native range input with the track filled up to the value.',
    add: 'slider',
    files: ['Slider.tsx', cn],
    usage: {
      imports: `import { Slider } from '@/components/ui/Slider'`,
      code: `<Slider aria-label="Speed" min={0} max={2} step={0.1} value={speed} onChange={setSpeed} />`,
    },
    examples: [{ id: 'slider-demo' }],
    api: [
      {
        name: 'Slider',
        note: 'Other <input> attributes (step, disabled…) go to the input.',
        rows: [
          ['value', 'number', '', ''],
          ['min', 'number', '', ''],
          ['max', 'number', '', ''],
          ['onChange', '(value: number) => void', '', ''],
        ],
      },
    ],
  },
  {
    slug: 'switch',
    name: 'Switch',
    description: 'On/off toggle with role="switch".',
    add: 'switch',
    files: ['Switch.tsx', cn],
    usage: {
      imports: `import { Switch } from '@/components/ui/Switch'`,
      code: `<Switch checked={on} onChange={setOn} aria-label="Interruptible" />`,
    },
    examples: [{ id: 'switch-demo' }],
    api: [
      {
        name: 'Switch',
        note: 'Also takes every <button> attribute; give it a name (aria-label or a <label>).',
        rows: [
          ['checked', 'boolean', '', ''],
          ['onChange', '(checked: boolean) => void', '', ''],
        ],
      },
    ],
  },
  {
    slug: 'theme-toggle',
    name: 'Theme Toggle',
    description:
      'Light / dark / system switch that toggles .dark on <html> and remembers the choice.',
    add: 'theme-toggle',
    files: ['ThemeToggle.tsx', 'Select.tsx', 'Badge.tsx', 'Truncate.tsx', cn],
    npm: ['lucide-react'],
    usage: {
      imports: `import { ThemeToggle } from '@/components/ui/ThemeToggle'`,
      code: `<ThemeToggle storageKey="theme" />`,
    },
    examples: [
      {
        id: 'theme-toggle-demo',
        note: 'This is the same toggle as in the header of this site.',
      },
    ],
    api: [
      {
        name: 'ThemeToggle',
        rows: [
          ['storageKey', 'string', "'theme'", 'localStorage key; absent means system.'],
          ['label', 'string', "'Tema'", ''],
          ['labels', 'Record<Theme, string>', "{ system: 'Sistema', … }", ''],
          ['className', 'string', '', ''],
        ],
      },
    ],
    notes: [
      'To avoid a flash on load, apply the saved theme before the first paint — see Theming.',
    ],
  },
  {
    slug: 'toaster',
    name: 'Toaster',
    description: 'Stack of success and error notices in the corner. You own the state.',
    add: 'toaster',
    files: ['Toaster.tsx'],
    npm: ['lucide-react'],
    usage: {
      imports: `import { Toaster, type Toast } from '@/components/ui/Toaster'`,
      code: `<Toaster toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />`,
    },
    examples: [
      {
        id: 'toaster-demo',
        note: 'Keep the list in your store (zustand, context…) and render one Toaster at the root.',
      },
    ],
    api: [
      {
        name: 'Toaster',
        rows: [
          ['toasts', "{ id: number; type: 'success' | 'error'; message: string }[]", '', ''],
          ['onDismiss', '(id: number) => void', '', ''],
          ['closeLabel', 'string', "'Fechar'", ''],
        ],
      },
    ],
  },
  {
    slug: 'truncate',
    name: 'Truncate',
    description:
      'Text with an ellipsis that shows the full content in a tooltip — only when it was cut.',
    add: 'truncate',
    files: ['Truncate.tsx', cn],
    usage: {
      imports: `import { Truncate } from '@/components/ui/Truncate'`,
      code: `<Truncate className="block">{agent.name}</Truncate>`,
    },
    examples: [{ id: 'truncate-demo', note: 'Hover the second and third lines.' }],
    api: [
      {
        name: 'Truncate',
        rows: [
          ['children', 'ReactNode', '', ''],
          ['tooltip', 'string', '', 'When children is not plain text.'],
          ['multiline', 'boolean', '', 'Clamp to N lines (add line-clamp-N).'],
          ['className', 'string', '', ''],
        ],
      },
    ],
  },
]
