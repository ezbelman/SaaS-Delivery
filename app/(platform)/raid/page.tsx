"use client"
import { useState, useMemo } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge, RaidTypeBadge, PriorityBadge, StatusBadge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  SlideOver, SlideOverContent, SlideOverHeader, SlideOverBody, SlideOverFooter, SlideOverTrigger,
} from "@/components/ui/slide-over"
import { useRaidStore, useRaidKPIs } from "@/stores/raidStore"
import { RaidForm } from "@/components/raid/raid-form"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { formatDate, timeAgo, isOverdue, downloadCSV } from "@/lib/utils"
import type { RaidItem, RaidType, RaidStatus, Priority } from "@/lib/types"
import {
  Plus, Search, Filter, Download, ShieldAlert, AlertTriangle,
  CheckCircle2, Info, ChevronDown, MoreHorizontal, Edit2, Trash2,
  ExternalLink, Clock, User, Tag, X,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const TYPE_ICONS: Record<RaidType, React.ElementType> = {
  risk:       ShieldAlert,
  assumption: Info,
  issue:      AlertTriangle,
  decision:   CheckCircle2,
}

function RaidRow({
  item,
  onSelect,
  onDelete,
}: {
  item: RaidItem
  onSelect: () => void
  onDelete: () => void
}) {
  const owner = MOCK_USERS.find((u) => u.id === item.ownerId)
  const overdue = item.dueDate ? isOverdue(item.dueDate) && item.status !== "closed" : false
  const Icon = TYPE_ICONS[item.type]

  return (
    <div
      className="flex items-start gap-3 px-4 py-3.5 border-b border-[var(--line)] hover:bg-elevated/50 transition-colors cursor-pointer group"
      onClick={onSelect}
    >
      {/* Type icon */}
      <div className={`mt-0.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
        item.type === "risk"       ? "bg-danger/10" :
        item.type === "issue"      ? "bg-warning/10" :
        item.type === "assumption" ? "bg-info/10" : "bg-success/10"
      }`}>
        <Icon className={`h-3.5 w-3.5 ${
          item.type === "risk"       ? "text-danger" :
          item.type === "issue"      ? "text-warning" :
          item.type === "assumption" ? "text-info" : "text-success"
        }`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <p className="text-sm font-medium text-ink truncate flex-1">{item.title}</p>
          {overdue && (
            <Badge variant="danger" className="shrink-0 text-[10px]">Overdue</Badge>
          )}
        </div>
        <p className="text-xs text-ink-2 mt-0.5 line-clamp-1">{item.description}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <RaidTypeBadge type={item.type} />
          <PriorityBadge priority={item.priority} />
          <StatusBadge status={item.status} />
          {item.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${overdue ? "text-danger" : "text-ink-3"}`}>
              <Clock className="h-3 w-3" />
              {formatDate(item.dueDate, "MMM d")}
            </span>
          )}
        </div>
      </div>

      {/* Owner + actions */}
      <div className="flex items-center gap-2 shrink-0">
        {owner && (
          <div className="hidden md:flex items-center gap-1.5">
            <Avatar name={owner.name} size="xs" />
            <span className="text-xs text-ink-2">{owner.name.split(" ")[0]}</span>
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-elevated text-ink-3 hover:text-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelect() }}>
              <ExternalLink className="h-3.5 w-3.5" /> View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger onClick={(e) => { e.stopPropagation(); onDelete() }}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

function RaidDetail({ item, onClose }: { item: RaidItem; onClose: () => void }) {
  const { updateItem } = useRaidStore()
  const owner = MOCK_USERS.find((u) => u.id === item.ownerId)

  return (
    <>
      <SlideOverHeader
        title={item.title}
        subtitle={`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} · Created ${timeAgo(item.createdAt)}`}
      />
      <SlideOverBody>
        {/* Status + Priority */}
        <div className="flex items-center gap-2 flex-wrap">
          <RaidTypeBadge type={item.type} />
          <PriorityBadge priority={item.priority} />
          <StatusBadge status={item.status} />
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-ink-3 uppercase tracking-wider mb-1">Owner</p>
            {owner ? (
              <div className="flex items-center gap-2">
                <Avatar name={owner.name} size="sm" />
                <p className="text-sm text-ink">{owner.name}</p>
              </div>
            ) : <p className="text-sm text-ink-2">—</p>}
          </div>
          <div>
            <p className="text-xs text-ink-3 uppercase tracking-wider mb-1">Due Date</p>
            <p className={`text-sm ${item.dueDate && isOverdue(item.dueDate) && item.status !== "closed" ? "text-danger" : "text-ink"}`}>
              {item.dueDate ? formatDate(item.dueDate) : "—"}
            </p>
          </div>
          {item.probability && (
            <div>
              <p className="text-xs text-ink-3 uppercase tracking-wider mb-1">Probability</p>
              <p className="text-sm text-ink capitalize">{item.probability}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-ink-3 uppercase tracking-wider mb-1">Last Updated</p>
            <p className="text-sm text-ink">{timeAgo(item.updatedAt)}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-ink-3 uppercase tracking-wider mb-2">Description</p>
          <p className="text-sm text-ink-2 leading-relaxed">{item.description}</p>
        </div>

        {/* Impact */}
        {item.impact && (
          <div>
            <p className="text-xs text-ink-3 uppercase tracking-wider mb-2">Impact</p>
            <p className="text-sm text-ink-2 leading-relaxed">{item.impact}</p>
          </div>
        )}

        {/* Response Plan */}
        {item.responsePlan && (
          <div>
            <p className="text-xs text-ink-3 uppercase tracking-wider mb-2">Response Plan</p>
            <div className="rounded-lg bg-elevated border border-[var(--line)] p-3">
              <p className="text-sm text-ink-2 leading-relaxed">{item.responsePlan}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div>
            <p className="text-xs text-ink-3 uppercase tracking-wider mb-2">Tags</p>
            <div className="flex gap-1.5 flex-wrap">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="ghost">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Quick status update */}
        <div>
          <p className="text-xs text-ink-3 uppercase tracking-wider mb-2">Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {(["open", "in_progress", "escalated", "closed"] as RaidStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => updateItem(item.id, { status: s })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  item.status === s
                    ? "bg-sdp-red text-white border-sdp-red"
                    : "bg-elevated text-ink-2 border-[var(--line)] hover:border-ink-3"
                }`}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </SlideOverBody>
      <SlideOverFooter>
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button variant="primary">Save Changes</Button>
      </SlideOverFooter>
    </>
  )
}

export default function RAIDPage() {
  const { items, addItem, deleteItem, selectedId, setSelected } = useRaidStore()
  const kpis = useRaidKPIs("prj-001")
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<RaidType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<RaidStatus | "all">("all")
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all")
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const projectItems = items.filter((i) => i.projectId === "prj-001")

  const filtered = useMemo(() => {
    return projectItems.filter((item) => {
      if (filterType !== "all" && item.type !== filterType) return false
      if (filterStatus !== "all" && item.status !== filterStatus) return false
      if (filterPriority !== "all" && item.priority !== filterPriority) return false
      if (search && !item.title.toLowerCase().includes(search.toLowerCase()) &&
          !item.description.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [projectItems, filterType, filterStatus, filterPriority, search])

  const selectedItem = items.find((i) => i.id === selectedId)

  const handleCreate = async (values: Omit<RaidItem, "id" | "createdAt" | "updatedAt">) => {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 400))
    addItem(values)
    setIsSubmitting(false)
    setShowForm(false)
  }

  const handleExport = () => {
    downloadCSV("raid-log.csv", filtered.map((i) => ({
      Type: i.type, Title: i.title, Status: i.status, Priority: i.priority,
      Owner: MOCK_USERS.find((u) => u.id === i.ownerId)?.name ?? "",
      DueDate: i.dueDate ?? "", CreatedAt: i.createdAt,
    })))
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="RAID Log"
        subtitle="Risks · Assumptions · Issues · Decisions"
        breadcrumb={[{ label: "Meridian Bank Digital Banking" }, { label: "RAID Log" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Item
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-up">
          {[
            { label: "Total Items", value: kpis.total, color: "default" as const },
            { label: "Open", value: kpis.open, color: "blue" as const },
            { label: "Escalated", value: kpis.escalated, color: "red" as const },
            { label: "Critical", value: kpis.critical, color: "red" as const },
            { label: "Overdue", value: kpis.overdue, color: kpis.overdue > 0 ? "amber" as const : "default" as const },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border border-[var(--line)] p-4 ${
              stat.color === "red" ? "bg-danger/5" :
              stat.color === "amber" ? "bg-warning/5" :
              stat.color === "blue" ? "bg-info/5" : "bg-surface"
            }`}>
              <p className="text-xs font-medium text-ink-2 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${
                stat.color === "red" ? "text-danger" :
                stat.color === "amber" ? "text-warning" :
                stat.color === "blue" ? "text-info" : "text-ink"
              }`} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Type filter pills */}
        <div className="flex items-center gap-2 flex-wrap animate-fade-up delay-50">
          {(["all", "risk", "assumption", "issue", "decision"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterType === type
                  ? "bg-sdp-red text-white border-sdp-red"
                  : "bg-elevated text-ink-2 border-[var(--line)] hover:border-ink-3 hover:text-ink"
              }`}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
              {type !== "all" && (
                <span className="ml-1.5 opacity-70">
                  {type === "risk" ? kpis.riskCount :
                   type === "assumption" ? kpis.assumptionCount :
                   type === "issue" ? kpis.issueCount :
                   kpis.decisionCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3 animate-fade-up delay-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-3" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search RAID items..."
              className="h-9 w-full rounded-md border border-[var(--line)] bg-elevated pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RaidStatus | "all")}
            className="h-9 rounded-md border border-[var(--line)] bg-elevated px-3 text-sm text-ink focus:outline-none focus:border-sdp-red"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="escalated">Escalated</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
            className="h-9 rounded-md border border-[var(--line)] bg-elevated px-3 text-sm text-ink focus:outline-none focus:border-sdp-red"
          >
            <option value="all">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <span className="text-xs text-ink-3">{filtered.length} items</span>
        </div>

        {/* Table */}
        <Card className="animate-fade-up delay-150 overflow-hidden">
          <div className="bg-elevated px-4 py-2.5 border-b border-[var(--line)] flex items-center gap-4">
            <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider flex-[3]">Item</span>
            <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider flex-[1] hidden md:block">Status</span>
            <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider flex-[1] hidden md:block">Owner</span>
            <span className="text-xs font-semibold text-ink-2 uppercase tracking-wider w-24 hidden lg:block">Due</span>
            <span className="w-8" />
          </div>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldAlert className="h-10 w-10 text-ink-3 mx-auto mb-3" />
              <p className="text-ink-2 font-medium">No RAID items found</p>
              <p className="text-sm text-ink-3 mt-1">
                {search || filterType !== "all" ? "Try adjusting your filters" : "Create your first RAID item"}
              </p>
              {!search && filterType === "all" && (
                <Button variant="primary" size="sm" className="mt-4" onClick={() => setShowForm(true)}>
                  <Plus className="h-3.5 w-3.5" /> Add First Item
                </Button>
              )}
            </div>
          ) : (
            filtered.map((item) => (
              <RaidRow
                key={item.id}
                item={item}
                onSelect={() => setSelected(item.id)}
                onDelete={() => deleteItem(item.id)}
              />
            ))
          )}
        </Card>
      </div>

      {/* Create form slide-over */}
      <SlideOver open={showForm} onOpenChange={setShowForm}>
        <SlideOverContent width="md">
          <SlideOverHeader title="Add RAID Item" subtitle="Create a new risk, assumption, issue, or decision" />
          <SlideOverBody>
            <RaidForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              isLoading={isSubmitting}
            />
          </SlideOverBody>
        </SlideOverContent>
      </SlideOver>

      {/* Detail slide-over */}
      <SlideOver open={!!selectedId} onOpenChange={(open) => !open && setSelected(null)}>
        <SlideOverContent width="lg">
          {selectedItem && (
            <RaidDetail item={selectedItem} onClose={() => setSelected(null)} />
          )}
        </SlideOverContent>
      </SlideOver>
    </div>
  )
}
