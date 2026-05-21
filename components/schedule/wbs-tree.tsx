"use client"
import { useState } from "react"
import { ChevronRight, ChevronDown, Plus, GripVertical, Flag, Milestone, CheckSquare, Layers, Boxes, BookOpen, Diamond } from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { StatusBadge, PriorityBadge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { useScheduleStore } from "@/stores/scheduleStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { formatDateShort } from "@/lib/utils"
import type { WorkItem, WorkItemType } from "@/lib/types"

const TYPE_ICONS: Record<WorkItemType, React.ElementType> = {
  phase:       Layers,
  stream:      Boxes,
  epic:        BookOpen,
  story:       CheckSquare,
  task:        CheckSquare,
  milestone:   Diamond,
  deliverable: Flag,
}

const INDENT_MAP: Record<WorkItemType, number> = {
  phase:       0,
  stream:      1,
  epic:        2,
  story:       3,
  task:        3,
  milestone:   0,
  deliverable: 2,
}

const TYPE_COLORS: Record<WorkItemType, string> = {
  phase:       "text-sdp-red",
  stream:      "text-info",
  epic:        "text-warning",
  story:       "text-success",
  task:        "text-ink-2",
  milestone:   "text-sdp-red",
  deliverable: "text-warning",
}

function WBSNode({
  item,
  allItems,
  depth,
  onSelect,
}: {
  item: WorkItem
  allItems: WorkItem[]
  depth: number
  onSelect: (id: string) => void
}) {
  const { expandedIds, toggleExpanded } = useScheduleStore()
  const children = allItems.filter((i) => i.parentId === item.id).sort((a, b) => a.position - b.position)
  const hasChildren = children.length > 0
  const isExpanded = expandedIds.has(item.id)
  const owner = MOCK_USERS.find((u) => u.id === item.assigneeId)
  const Icon = TYPE_ICONS[item.type]
  const typeColor = TYPE_COLORS[item.type]

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 border-b border-[var(--line)] hover:bg-elevated/40 transition-colors cursor-pointer group",
          item.type === "phase"     && "bg-elevated/20",
          item.type === "milestone" && "border-sdp-red/20"
        )}
        style={{ paddingLeft: `${16 + depth * 20}px` }}
        onClick={() => onSelect(item.id)}
      >
        {/* Expand toggle */}
        <div className="w-5 shrink-0">
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); toggleExpanded(item.id) }}
              className="p-0.5 rounded hover:bg-elevated text-ink-3"
            >
              {isExpanded
                ? <ChevronDown className="h-3.5 w-3.5" />
                : <ChevronRight className="h-3.5 w-3.5" />
              }
            </button>
          ) : (
            <span className="h-3.5 w-3.5 flex items-center justify-center">
              <span className="h-1 w-1 rounded-full bg-ink-3" />
            </span>
          )}
        </div>

        {/* Type icon */}
        <Icon className={cn("h-4 w-4 shrink-0", typeColor)} />

        {/* WBS number */}
        <span className="text-xs font-mono text-ink-3 w-12 shrink-0">{item.wbsNumber}</span>

        {/* Title */}
        <span className={cn(
          "flex-1 text-sm truncate",
          item.type === "phase" || item.type === "stream" ? "font-semibold text-ink" : "text-ink-2"
        )}>
          {item.title}
        </span>

        {/* Dates */}
        <span className="text-xs text-ink-3 hidden lg:block w-28 text-center">
          {formatDateShort(item.startDate)} – {formatDateShort(item.endDate)}
        </span>

        {/* Progress */}
        {item.type !== "milestone" && (
          <div className="w-20 hidden md:block">
            <Progress value={item.completionPct} size="xs" showLabel />
          </div>
        )}

        {/* Status */}
        <div className="hidden lg:flex w-28 justify-end">
          <StatusBadge status={item.status} />
        </div>

        {/* Owner */}
        <div className="w-8 shrink-0">
          {owner && <Avatar name={owner.name} size="xs" />}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && children.map((child) => (
        <WBSNode
          key={child.id}
          item={child}
          allItems={allItems}
          depth={depth + 1}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

export function WBSTree({ projectId, onSelectItem }: { projectId: string; onSelectItem: (id: string) => void }) {
  const { workItems } = useScheduleStore()
  const items = workItems.filter((i) => i.projectId === projectId)
  const topLevel = items.filter((i) => !i.parentId).sort((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Table header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-elevated border-b border-[var(--line)] text-xs font-semibold text-ink-2 uppercase tracking-wider shrink-0">
        <div className="w-5" />
        <div className="w-4" />
        <div className="w-12">WBS</div>
        <div className="flex-1">Work Item</div>
        <div className="w-28 text-center hidden lg:block">Timeline</div>
        <div className="w-20 hidden md:block">Progress</div>
        <div className="w-28 text-right hidden lg:block">Status</div>
        <div className="w-8">Owner</div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {topLevel.length === 0 ? (
          <div className="py-20 text-center">
            <Layers className="h-10 w-10 text-ink-3 mx-auto mb-3" />
            <p className="text-ink-2 font-medium">No work items yet</p>
            <p className="text-sm text-ink-3 mt-1">Add phases and tasks to build your WBS</p>
          </div>
        ) : (
          topLevel.map((item) => (
            <WBSNode
              key={item.id}
              item={item}
              allItems={items}
              depth={0}
              onSelect={onSelectItem}
            />
          ))
        )}
      </div>
    </div>
  )
}
