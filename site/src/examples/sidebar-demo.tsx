import { useState } from 'react'
import { BookOpen, Bot, House, MessagesSquare, Settings, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import {
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SidebarSection,
} from '@/components/ui/Sidebar'
import { SidebarLayout } from '@/components/ui/SidebarLayout'

const pages = [
  { id: 'home', label: 'Home', icon: <House /> },
  { id: 'agent', label: 'Agent', icon: <Bot /> },
  { id: 'knowledge', label: 'Knowledge base', icon: <BookOpen /> },
  { id: 'guardrails', label: 'Guardrails', icon: <ShieldCheck /> },
]

export default function SidebarDemo() {
  const [page, setPage] = useState('agent')
  const current = [...pages, { id: 'conversations', label: 'Conversations' }].find(
    (p) => p.id === page,
  )!

  return (
    <div className="h-[440px] w-full">
      <SidebarLayout
        navigationKey={page}
        toggleLabel="Toggle sidebar"
        sidebarWidth={220}
        header={<span className="text-sm font-medium">{current.label}</span>}
        sidebar={
          <>
            <SidebarHeader>
              <span className="font-semibold tracking-tight">acme</span>
            </SidebarHeader>
            <SidebarNav>
              <SidebarSection title="Configure" className="mt-0">
                {pages.map((p) => (
                  <SidebarItem
                    key={p.id}
                    as="button"
                    icon={p.icon}
                    active={page === p.id}
                    onClick={() => setPage(p.id)}
                  >
                    {p.label}
                  </SidebarItem>
                ))}
              </SidebarSection>
              <SidebarSection title="Monitor">
                <SidebarItem
                  as="button"
                  icon={<MessagesSquare />}
                  extra={<Badge variant="outline">Beta</Badge>}
                  active={page === 'conversations'}
                  onClick={() => setPage('conversations')}
                >
                  Conversations
                </SidebarItem>
              </SidebarSection>
            </SidebarNav>
            <SidebarFooter>
              <SidebarItem as="button" icon={<Settings />} disabled>
                Settings
              </SidebarItem>
            </SidebarFooter>
          </>
        }
      >
        <div className="flex flex-col gap-3 px-4 pb-6 sm:px-7">
          <div className="h-24 rounded-xl bg-surface" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-xl bg-surface" />
            <div className="h-20 rounded-xl bg-surface" />
          </div>
        </div>
      </SidebarLayout>
    </div>
  )
}
