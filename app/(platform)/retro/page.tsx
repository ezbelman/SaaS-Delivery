"use client"
import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { ThumbsUp, Plus, RefreshCw, CheckCircle2, ArrowRight, Lightbulb, Smile } from "lucide-react"

type RetroCategory = "went_well" | "improve" | "action"

interface RetroItemData {
  id: string
  category: RetroCategory
  content: string
  votes: number
  authorId: string
}

const MOCK_RETRO_ITEMS: RetroItemData[] = [
  { id: "r1", category: "went_well", content: "Daily standups are sharp — 15 min max, blockers escalated same day. iOS and Android teams well aligned.", votes: 8, authorId: "usr-004" },
  { id: "r2", category: "went_well", content: "Biometric auth (Face ID / Touch ID) implementation progressed well — 45% in one sprint is strong velocity.", votes: 7, authorId: "usr-001" },
  { id: "r3", category: "went_well", content: "Auth0 integration test coverage hit 85% — great discipline from the dev team on a complex OAuth flow.", votes: 6, authorId: "usr-005" },
  { id: "r4", category: "went_well", content: "Client weekly touchpoints with Diana Foster are productive — executive alignment is strong.", votes: 5, authorId: "usr-003" },
  { id: "r5", category: "improve",   content: "OAuth session token blocker was flagged 3 days late — cost half a sprint. Need earlier surfacing of staging environment issues.", votes: 9, authorId: "usr-005" },
  { id: "r6", category: "improve",   content: "RAID log updates lagging mid-sprint. PCI-DSS risk was updated 5 days after the gap was discovered.", votes: 7, authorId: "usr-003" },
  { id: "r7", category: "improve",   content: "Sprint planning is overrunning (3+ hours). Need clearer pre-groomed backlog with acceptance criteria written before planning session.", votes: 6, authorId: "usr-004" },
  { id: "r8", category: "improve",   content: "PSD2 sandbox credential dependency wasn't tracked as a formal assumption — nearly blocked Sprint 9 preparation.", votes: 5, authorId: "usr-006" },
  { id: "r9", category: "action",    content: "Add a mandatory staging environment smoke test to the DoD — catches OAuth / Auth0 config issues before they block sprint.", votes: 5, authorId: "usr-005" },
  { id: "r10", category: "action",   content: "Schedule weekly 30-min RAID review every Monday — Sarah Mitchell to own. Flag any assumptions about Meridian Bank IT delivery.", votes: 4, authorId: "usr-001" },
  { id: "r11", category: "action",   content: "Timebox sprint planning to 2 hours — Marcus to prepare a structured agenda with story points pre-estimated.", votes: 4, authorId: "usr-004" },
]

const COLUMN_CONFIG: Record<RetroCategory, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  went_well: { label: "Went Well",     color: "text-success", bg: "bg-success/5 border-t-success", icon: Smile },
  improve:   { label: "To Improve",    color: "text-warning", bg: "bg-warning/5 border-t-warning", icon: Lightbulb },
  action:    { label: "Action Items",  color: "text-info",    bg: "bg-info/5 border-t-info",       icon: CheckCircle2 },
}

function RetroCard({ item, onVote }: { item: RetroItemData; onVote: (id: string) => void }) {
  const author = MOCK_USERS.find((u) => u.id === item.authorId)
  return (
    <div className="rounded-lg border border-[var(--line)] bg-surface p-3 space-y-2 hover:shadow-sm transition-shadow">
      <p className="text-sm text-ink leading-relaxed">{item.content}</p>
      <div className="flex items-center justify-between">
        {author && <Avatar name={author.name} size="xs" />}
        <button
          onClick={() => onVote(item.id)}
          className="flex items-center gap-1 text-xs text-ink-3 hover:text-success transition-colors"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{item.votes}</span>
        </button>
      </div>
    </div>
  )
}

export default function RetroPage() {
  const [items, setItems] = useState(MOCK_RETRO_ITEMS)
  const [newContent, setNewContent] = useState<Record<RetroCategory, string>>({
    went_well: "", improve: "", action: ""
  })

  const handleVote = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, votes: i.votes + 1 } : i))
  }

  const handleAdd = (category: RetroCategory) => {
    const content = newContent[category].trim()
    if (!content) return
    const newItem: RetroItemData = {
      id: `r${Date.now()}`,
      category,
      content,
      votes: 0,
      authorId: "usr-001",
    }
    setItems((prev) => [...prev, newItem])
    setNewContent((prev) => ({ ...prev, [category]: "" }))
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Engagement Retro"
        subtitle="Sprint 8 Retrospective — Meridian Bank Digital Banking Transformation"
        breadcrumb={[{ label: "Governance" }, { label: "Engagement Retro" }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" dot>In Progress</Badge>
            <Button variant="primary" size="sm">
              <CheckCircle2 className="h-3.5 w-3.5" /> Close Retro
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {(["went_well", "improve", "action"] as RetroCategory[]).map((category) => {
            const config = COLUMN_CONFIG[category]
            const colItems = items.filter((i) => i.category === category).sort((a, b) => b.votes - a.votes)
            const Icon = config.icon

            return (
              <div key={category} className={`flex flex-col rounded-xl border-t-2 border border-[var(--line)] ${config.bg}`}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)]">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <h3 className={`text-sm font-semibold ${config.color}`}>{config.label}</h3>
                  <Badge variant="ghost" className="ml-auto text-[10px]">{colItems.length}</Badge>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {colItems.map((item) => (
                    <RetroCard key={item.id} item={item} onVote={handleVote} />
                  ))}
                </div>

                {/* Add new item */}
                <div className="p-3 border-t border-[var(--line)]">
                  <div className="flex gap-2">
                    <input
                      value={newContent[category]}
                      onChange={(e) => setNewContent((prev) => ({ ...prev, [category]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAdd(category)}
                      placeholder="Add item... (Enter)"
                      className="flex-1 h-8 rounded-md border border-[var(--line)] bg-elevated px-2.5 text-xs text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red"
                    />
                    <Button variant="outline" size="icon-sm" onClick={() => handleAdd(category)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
