"use client"
import { useState } from "react"
import {
  SlideOver, SlideOverContent, SlideOverHeader,
  SlideOverBody, SlideOverFooter,
} from "@/components/ui/slide-over"
import { Button } from "@/components/ui/button"
import { useScheduleStore, useSprints } from "@/stores/scheduleStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import type { WorkItemType, WorkItemStatus, Priority, WorkItem } from "@/lib/types"
import {
  Layers, Boxes, BookOpen, CheckSquare, Diamond, Flag, Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ─── WBS number auto-generation ──────────────────────────────────────────────
function generateWbsNumber(items: WorkItem[], parentId: string | undefined, projectId: string): string {
  const proj = items.filter((i) => i.projectId === projectId)
  if (!parentId) {
    const tops = proj.filter((i) => !i.parentId)
    const nums = tops.map((i) => parseInt(i.wbsNumber?.split(".")[0] ?? "0")).filter(Boolean)
    return String(nums.length ? Math.max(...nums) + 1 : 1)
  }
  const parent = proj.find((i) => i.id === parentId)
  if (!parent) return "1"
  const kids = proj.filter((i) => i.parentId === parentId)
  const nums = kids.map((i) => {
    const parts = i.wbsNumber?.split(".") ?? []
    return parseInt(parts[parts.length - 1] ?? "0")
  }).filter(Boolean)
  return `${parent.wbsNumber}.${nums.length ? Math.max(...nums) + 1 : 1}`
}

// ─── Type options ─────────────────────────────────────────────────────────────
const TYPE_OPTIONS: { value: WorkItemType; label: string; icon: React.ElementType; color: string }[] = [
  { value: "phase",       label: "Phase",       icon: Layers,      color: "text-sdp-red" },
  { value: "stream",      label: "Stream",      icon: Boxes,       color: "text-info" },
  { value: "epic",        label: "Epic",        icon: BookOpen,    color: "text-warning" },
  { value: "story",       label: "Story",       icon: CheckSquare, color: "text-success" },
  { value: "task",        label: "Task",        icon: Target,      color: "text-ink-2" },
  { value: "milestone",   label: "Milestone",   icon: Diamond,     color: "text-sdp-red" },
  { value: "deliverable", label: "Deliverable", icon: Flag,        color: "text-warning" },
]

const PRIORITIES: Priority[] = ["critical", "high", "medium", "low"]
const STATUSES: WorkItemStatus[] = ["not_started", "in_progress", "blocked", "completed"]

const STATUS_LABEL: Record<WorkItemStatus, string> = {
  not_started: "To Do",
  in_progress: "In Progress",
  blocked:     "Blocked",
  completed:   "Done",
  cancelled:   "Cancelled",
}

// ─── Field components ─────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">{children}</p>
  )
}

function FieldInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-9 w-full rounded-lg border border-[var(--line)] bg-elevated px-3 text-sm text-ink",
        "placeholder:text-ink-3 focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/20",
        "transition-all",
        className
      )}
      {...props}
    />
  )
}

function FieldSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-lg border border-[var(--line)] bg-elevated px-3 text-sm text-ink",
        "focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/20 transition-all appearance-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

// ─── Main form component ──────────────────────────────────────────────────────
interface WorkItemFormProps {
  open: boolean
  onClose: () => void
  projectId: string
  sprintId?: string
  defaultType?: WorkItemType
  defaultStatus?: WorkItemStatus
  defaultParentId?: string
}

export function WorkItemForm({
  open,
  onClose,
  projectId,
  sprintId,
  defaultType = "task",
  defaultStatus = "not_started",
  defaultParentId,
}: WorkItemFormProps) {
  const { workItems, addWorkItem } = useScheduleStore()
  const sprints = useSprints(projectId)

  const projectItems = workItems.filter((i) => i.projectId === projectId)

  // form state
  const [type, setType] = useState<WorkItemType>(defaultType)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [parentId, setParentId] = useState<string>(defaultParentId ?? "")
  const [assigneeId, setAssigneeId] = useState("")
  const [selectedSprintId, setSelectedSprintId] = useState(sprintId ?? "")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
  )
  const [priority, setPriority] = useState<Priority>("medium")
  const [status, setStatus] = useState<WorkItemStatus>(defaultStatus)
  const [storyPoints, setStoryPoints] = useState("")
  const [estimatedHours, setEstimatedHours] = useState("")

  const reset = () => {
    setTitle(""); setDescription(""); setParentId(defaultParentId ?? "")
    setAssigneeId(""); setSelectedSprintId(sprintId ?? "")
    setStartDate(new Date().toISOString().split("T")[0])
    setEndDate(new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0])
    setPriority("medium"); setStatus(defaultStatus)
    setStoryPoints(""); setEstimatedHours("")
    setType(defaultType)
  }

  const handleClose = () => { reset(); onClose() }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const wbsNumber = generateWbsNumber(workItems, parentId || undefined, projectId)
    const now = new Date().toISOString()

    addWorkItem({
      projectId,
      parentId: parentId || undefined,
      wbsNumber,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      status,
      priority,
      assigneeId: assigneeId || undefined,
      startDate,
      endDate,
      estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
      completionPct: 0,
      storyPoints: storyPoints ? Number(storyPoints) : undefined,
      sprintId: selectedSprintId || undefined,
      position: projectItems.length,
      dependencies: [],
    })

    handleClose()
  }

  // Parent selector — only show items that can be parents
  const parentCandidates = projectItems.filter((i) =>
    i.type === "phase" || i.type === "stream" || i.type === "epic"
  )

  return (
    <SlideOver open={open} onOpenChange={(o) => !o && handleClose()}>
      <SlideOverContent width="lg">
        <SlideOverHeader
          title="Add Work Item"
          subtitle="Add a new item to the project schedule"
        />

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <SlideOverBody>

            {/* Type selector */}
            <div>
              <FieldLabel>Item Type</FieldLabel>
              <div className="grid grid-cols-4 gap-1.5">
                {TYPE_OPTIONS.map((t) => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-center transition-all",
                        type === t.value
                          ? "border-sdp-red/60 bg-sdp-red/10"
                          : "border-[var(--line)] bg-elevated hover:border-ink-3/30 hover:bg-overlay"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", type === t.value ? "text-sdp-red" : t.color)} />
                      <span className={cn("text-[10px] font-medium", type === t.value ? "text-sdp-red" : "text-ink-2")}>
                        {t.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title */}
            <div>
              <FieldLabel>Title *</FieldLabel>
              <FieldInput
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter ${type} title…`}
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What needs to be done?"
                rows={3}
                className={cn(
                  "w-full rounded-lg border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink",
                  "placeholder:text-ink-3 focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/20",
                  "resize-none transition-all"
                )}
              />
            </div>

            {/* Parent + Status row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Parent Item</FieldLabel>
                <FieldSelect value={parentId} onChange={(e) => setParentId(e.target.value)}>
                  <option value="">— None (top level) —</option>
                  {parentCandidates.map((p) => (
                    <option key={p.id} value={p.id}>{p.wbsNumber} {p.title}</option>
                  ))}
                </FieldSelect>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <FieldSelect value={status} onChange={(e) => setStatus(e.target.value as WorkItemStatus)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                  ))}
                </FieldSelect>
              </div>
            </div>

            {/* Assignee + Sprint row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Assignee</FieldLabel>
                <FieldSelect value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                  <option value="">— Unassigned —</option>
                  {MOCK_USERS.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </FieldSelect>
              </div>
              <div>
                <FieldLabel>Sprint</FieldLabel>
                <FieldSelect value={selectedSprintId} onChange={(e) => setSelectedSprintId(e.target.value)}>
                  <option value="">— No sprint —</option>
                  {sprints.map((sp) => (
                    <option key={sp.id} value={sp.id}>{sp.name}</option>
                  ))}
                </FieldSelect>
              </div>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Start Date</FieldLabel>
                <FieldInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <FieldLabel>End Date</FieldLabel>
                <FieldInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            {/* Priority + Story Points + Hours row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FieldLabel>Priority</FieldLabel>
                <FieldSelect value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </FieldSelect>
              </div>
              <div>
                <FieldLabel>Story Points</FieldLabel>
                <FieldInput
                  type="number"
                  min="0"
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <FieldLabel>Est. Hours</FieldLabel>
                <FieldInput
                  type="number"
                  min="0"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="e.g. 8"
                />
              </div>
            </div>

            {/* Generated WBS preview */}
            <div className="rounded-lg border border-[var(--line)] bg-elevated/40 px-4 py-3">
              <p className="text-[10px] text-ink-3 uppercase tracking-widest font-semibold mb-1">WBS Number (auto-generated)</p>
              <p className="text-sm font-mono text-ink-2">
                {generateWbsNumber(workItems, parentId || undefined, projectId)}
              </p>
            </div>

          </SlideOverBody>

          <SlideOverFooter>
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!title.trim()}>
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </SlideOverFooter>
        </form>
      </SlideOverContent>
    </SlideOver>
  )
}
