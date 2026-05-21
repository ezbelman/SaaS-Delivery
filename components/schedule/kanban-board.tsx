"use client"
import React, { useState } from "react"
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  rectIntersection, useDroppable,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { useScheduleStore, useSprints } from "@/stores/scheduleStore"
import { Badge, PriorityBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  SlideOver, SlideOverContent, SlideOverHeader,
  SlideOverBody, SlideOverFooter,
} from "@/components/ui/slide-over"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { formatDateShort, isOverdue } from "@/lib/utils"
import type { WorkItem, WorkItemStatus, Priority } from "@/lib/types"
import {
  AlertTriangle, Clock, Plus, X, MoreHorizontal,
  CheckSquare, Layers, GripVertical, Flag,
} from "lucide-react"

// ─── Column definitions ───────────────────────────────────────────────────────
export const KANBAN_COLUMNS: {
  id: WorkItemStatus; label: string; limit?: number; accent: string; headerBg: string
}[] = [
  { id: "not_started", label: "To Do",       limit: 10, accent: "border-t-ink-3",   headerBg: "bg-ink-3/5" },
  { id: "in_progress", label: "In Progress", limit: 6,  accent: "border-t-info",    headerBg: "bg-info/5"  },
  { id: "blocked",     label: "Blocked",             accent: "border-t-danger",  headerBg: "bg-danger/5"},
  { id: "completed",   label: "Done",                accent: "border-t-success", headerBg: "bg-success/5"},
]

const PRIORITY_COVER: Record<Priority, string> = {
  critical: "bg-danger",
  high:     "bg-warning",
  medium:   "bg-info",
  low:      "bg-ink-3",
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function KanbanCard({
  item,
  isDragging,
  onClick,
}: {
  item: WorkItem
  isDragging?: boolean
  onClick?: () => void
}) {
  const owner = MOCK_USERS.find((u) => u.id === item.assigneeId)
  const overdue = item.endDate ? isOverdue(item.endDate) && item.status !== "completed" : false

  return (
    <div
      onClick={isDragging ? undefined : onClick}
      className={cn(
        "rounded-xl border border-[var(--line)] bg-surface shadow-sm overflow-hidden",
        "transition-all duration-150",
        !isDragging && "hover:border-sdp-red/30 hover:shadow-md hover:-translate-y-0.5",
        isDragging && "rotate-1 scale-[1.03] shadow-xl border-sdp-red/40"
      )}
    >
      {/* Priority color cover strip */}
      <div className={cn("h-1 w-full", PRIORITY_COVER[item.priority])} />

      <div className="p-3 space-y-2.5">
        {/* Title + priority */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-ink leading-snug">{item.title}</p>
          <PriorityBadge priority={item.priority} />
        </div>

        {/* Type tag */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-elevated text-ink-3 font-medium uppercase tracking-wider">
            {item.type}
          </span>
          {item.storyPoints !== undefined && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sdp-red/10 text-sdp-red font-semibold">
              {item.storyPoints} pts
            </span>
          )}
        </div>

        {/* Progress bar */}
        {item.completionPct > 0 && item.status !== "completed" && (
          <Progress value={item.completionPct} size="xs" />
        )}

        {/* Footer: date + assignee */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div>
            {overdue ? (
              <span className="flex items-center gap-1 text-[11px] text-danger font-medium">
                <AlertTriangle className="h-3 w-3" />
                {formatDateShort(item.endDate)}
              </span>
            ) : item.endDate ? (
              <span className="flex items-center gap-1 text-[11px] text-ink-3">
                <Clock className="h-3 w-3" />
                {formatDateShort(item.endDate)}
              </span>
            ) : null}
          </div>
          {owner && <Avatar name={owner.name} size="xs" />}
        </div>
      </div>
    </div>
  )
}

// ─── Sortable card wrapper ────────────────────────────────────────────────────
function SortableCard({ item, onOpen }: { item: WorkItem; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.25 : 1 }}
      className="relative group cursor-grab active:cursor-grabbing touch-none"
      {...listeners}
      {...attributes}
    >
      {/* Grip indicator — visual only, no pointer events */}
      <div className="absolute left-1 top-3 opacity-0 group-hover:opacity-50 z-10 transition-opacity pointer-events-none">
        <GripVertical className="h-4 w-4 text-ink-3" />
      </div>
      <KanbanCard item={item} isDragging={isDragging} onClick={onOpen} />
    </div>
  )
}

// ─── Inline add-card form ─────────────────────────────────────────────────────
function InlineAddCard({
  columnId,
  projectId,
  sprintId,
  onClose,
}: {
  columnId: WorkItemStatus
  projectId: string
  sprintId?: string
  onClose: () => void
}) {
  const [title, setTitle] = useState("")
  const { workItems, addWorkItem } = useScheduleStore()

  const handleAdd = () => {
    if (!title.trim()) return
    const today = new Date().toISOString().split("T")[0]
    const due   = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
    const idx   = workItems.filter((i) => i.projectId === projectId).length
    addWorkItem({
      projectId,
      wbsNumber: String(idx + 1),
      title: title.trim(),
      type: "task",
      status: columnId,
      priority: "medium",
      startDate: today,
      endDate: due,
      completionPct: 0,
      position: idx,
      dependencies: [],
      sprintId: sprintId || undefined,
    })
    onClose()
  }

  return (
    <div className="rounded-xl border border-sdp-red/40 bg-surface p-3 space-y-2 shadow-md">
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a title for this card…"
        rows={2}
        className="w-full text-sm text-ink bg-transparent resize-none outline-none
                   placeholder:text-ink-3 leading-relaxed"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd() }
          if (e.key === "Escape") onClose()
        }}
      />
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" onClick={handleAdd} disabled={!title.trim()}>
          Add card
        </Button>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-ink-3 hover:text-ink hover:bg-elevated transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ─── Card detail slide-over ───────────────────────────────────────────────────
function CardDetail({ item, open, onClose }: { item: WorkItem; open: boolean; onClose: () => void }) {
  const { updateWorkItem, workItems } = useScheduleStore()
  const sprints = useSprints(item.projectId)
  const [title, setTitle]         = useState(item.title)
  const [description, setDesc]    = useState(item.description ?? "")
  const [status, setStatus]       = useState(item.status)
  const [priority, setPriority]   = useState(item.priority)
  const [assigneeId, setAssignee] = useState(item.assigneeId ?? "")
  const [sprintId, setSprint]     = useState(item.sprintId ?? "")
  const [endDate, setEndDate]     = useState(item.endDate ?? "")
  const [storyPoints, setSP]      = useState(String(item.storyPoints ?? ""))
  const [pct, setPct]             = useState(String(item.completionPct))

  const owner = MOCK_USERS.find((u) => u.id === item.assigneeId)

  const handleSave = () => {
    updateWorkItem(item.id, {
      title:        title.trim() || item.title,
      description:  description || undefined,
      status,
      priority,
      assigneeId:   assigneeId || undefined,
      sprintId:     sprintId   || undefined,
      endDate:      endDate    || item.endDate,
      storyPoints:  storyPoints ? Number(storyPoints) : undefined,
      completionPct: pct ? Math.min(100, Math.max(0, Number(pct))) : 0,
    })
    onClose()
  }

  const selectCls = "h-9 w-full rounded-lg border border-[var(--line)] bg-elevated px-3 text-sm text-ink focus:outline-none focus:border-sdp-red transition-all appearance-none"
  const inputCls  = "h-9 w-full rounded-lg border border-[var(--line)] bg-elevated px-3 text-sm text-ink focus:outline-none focus:border-sdp-red transition-all"

  return (
    <SlideOver open={open} onOpenChange={(o) => !o && onClose()}>
      <SlideOverContent width="lg">
        <SlideOverHeader
          title={item.wbsNumber ? `${item.wbsNumber} — ${item.type}` : item.type}
          subtitle={`Created ${new Date(item.createdAt).toLocaleDateString()}`}
        />
        <SlideOverBody>
          {/* Title */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Title</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Description</p>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Add a description…"
              className="w-full rounded-lg border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red resize-none transition-all"
            />
          </div>

          {/* Status + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Status</p>
              <select value={status} onChange={(e) => setStatus(e.target.value as WorkItemStatus)} className={selectCls}>
                {KANBAN_COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Priority</p>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectCls}>
                {(["critical","high","medium","low"] as Priority[]).map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee + Sprint */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Assignee</p>
              <select value={assigneeId} onChange={(e) => setAssignee(e.target.value)} className={selectCls}>
                <option value="">— Unassigned —</option>
                {MOCK_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Sprint</p>
              <select value={sprintId} onChange={(e) => setSprint(e.target.value)} className={selectCls}>
                <option value="">— No sprint —</option>
                {sprints.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* Due date + Story pts + Completion */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Due Date</p>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Story Points</p>
              <input type="number" min="0" value={storyPoints} onChange={(e) => setSP(e.target.value)} className={inputCls} placeholder="—" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Completion %</p>
              <input type="number" min="0" max="100" value={pct} onChange={(e) => setPct(e.target.value)} className={inputCls} placeholder="0" />
            </div>
          </div>

          {/* Progress preview */}
          {Number(pct) > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">Progress</p>
              <Progress value={Number(pct)} size="sm" showLabel />
            </div>
          )}
        </SlideOverBody>

        <SlideOverFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave}>Save Changes</Button>
        </SlideOverFooter>
      </SlideOverContent>
    </SlideOver>
  )
}

// ─── Column ───────────────────────────────────────────────────────────────────
function KanbanColumn({
  col,
  items,
  projectId,
  sprintId,
  onOpenCard,
}: {
  col: typeof KANBAN_COLUMNS[number]
  items: WorkItem[]
  projectId: string
  sprintId?: string
  onOpenCard: (item: WorkItem) => void
}) {
  const [addingCard, setAddingCard] = useState(false)
  const atLimit = col.limit !== undefined && items.length >= col.limit

  const { setNodeRef, isOver } = useDroppable({ id: col.id })

  return (
    <div className={cn(
      "flex flex-col w-72 shrink-0 rounded-xl border border-[var(--line)] border-t-2 transition-all duration-200",
      col.accent,
      isOver && "ring-2 ring-sdp-red/40 shadow-lg shadow-sdp-red/10"
    )}>
      {/* Column header */}
      <div className={cn("flex items-center justify-between px-3 py-2.5 border-b border-[var(--line)] rounded-t-xl", col.headerBg)}>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-ink">{col.label}</p>
          <Badge variant={atLimit ? "danger" : "ghost"} className="text-[10px] font-semibold">
            {items.length}{col.limit ? `/${col.limit}` : ""}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          {atLimit && <span className="text-[10px] text-danger font-semibold">WIP</span>}
          <button
            onClick={() => setAddingCard(true)}
            className="p-1 rounded-md text-ink-3 hover:text-ink hover:bg-elevated/70 transition-colors"
            title="Add card"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Card list — the droppable zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-y-auto p-2.5 space-y-2 min-h-[220px] transition-colors",
          isOver && "bg-sdp-red/3"
        )}
      >
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableCard key={item.id} item={item} onOpen={() => onOpenCard(item)} />
          ))}
        </SortableContext>

        {items.length === 0 && !addingCard && (
          <div
            className="py-10 text-center border-2 border-dashed border-[var(--line)] rounded-lg cursor-pointer
                       hover:border-sdp-red/30 hover:bg-sdp-red/3 transition-colors"
            onClick={() => setAddingCard(true)}
          >
            <CheckSquare className="h-6 w-6 text-ink-3 mx-auto mb-1.5 opacity-40" />
            <p className="text-xs text-ink-3">Drop here or</p>
            <p className="text-xs text-sdp-red font-medium mt-0.5">+ Add a card</p>
          </div>
        )}

        {/* Inline add card */}
        {addingCard && (
          <InlineAddCard
            columnId={col.id}
            projectId={projectId}
            sprintId={sprintId}
            onClose={() => setAddingCard(false)}
          />
        )}
      </div>

      {/* Add card footer button */}
      {!addingCard && items.length > 0 && (
        <button
          onClick={() => setAddingCard(true)}
          className="flex items-center gap-2 px-3 py-2.5 text-xs text-ink-3 hover:text-ink
                     hover:bg-elevated/50 transition-colors rounded-b-xl border-t border-[var(--line)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add a card
        </button>
      )}
    </div>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────
export function KanbanBoard({ projectId, sprintId }: { projectId: string; sprintId?: string }) {
  const { workItems, updateWorkItem } = useScheduleStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [detailItem, setDetailItem] = useState<WorkItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const relevantItems = workItems.filter((i) => {
    if (i.projectId !== projectId) return false
    if (i.type !== "task" && i.type !== "story") return false
    if (sprintId) return i.sprintId === sprintId
    return true
  })

  const getColumn = (colId: WorkItemStatus) =>
    relevantItems.filter((i) => i.status === colId)

  const handleDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id))

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    setActiveId(null)
    if (!over) return

    const draggedId  = String(active.id)
    const overId     = String(over.id)
    const draggedItem = relevantItems.find((i) => i.id === draggedId)
    if (!draggedItem) return

    // Dropped on a column directly
    const targetCol = KANBAN_COLUMNS.find((c) => c.id === overId)
    if (targetCol) {
      if (draggedItem.status !== targetCol.id)
        updateWorkItem(draggedId, { status: targetCol.id })
      return
    }

    // Dropped on another card → move to that card's column
    const targetItem = relevantItems.find((i) => i.id === overId)
    if (targetItem && targetItem.status !== draggedItem.status)
      updateWorkItem(draggedId, { status: targetItem.status })
  }

  const activeItem = activeId ? relevantItems.find((i) => i.id === activeId) : null

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 p-4 h-full overflow-x-auto items-start">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              col={col}
              items={getColumn(col.id)}
              projectId={projectId}
              sprintId={sprintId}
              onOpenCard={setDetailItem}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}>
          {activeItem && (
            <div className="rotate-2 scale-105">
              <KanbanCard item={activeItem} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Card detail slide-over */}
      {detailItem && (
        <CardDetail
          item={detailItem}
          open={!!detailItem}
          onClose={() => setDetailItem(null)}
        />
      )}
    </>
  )
}
