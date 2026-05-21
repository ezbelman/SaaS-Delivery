"use client"
import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { useScheduleStore } from "@/stores/scheduleStore"
import { WBSTree } from "@/components/schedule/wbs-tree"
import { GanttChart } from "@/components/schedule/gantt-chart"
import { KanbanBoard } from "@/components/schedule/kanban-board"
import { ResourceHeatmap } from "@/components/schedule/resource-heatmap"
import { DeveloperWorkspace } from "@/components/schedule/developer-workspace"
import { WorkItemWizard } from "@/components/schedule/work-item-wizard"
import { List, GitBranch, LayoutGrid, Users, Plus, Download, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PROJECTS } from "@/lib/mock-data/users"
import { useActiveSprint } from "@/stores/scheduleStore"
import { StatusBadge } from "@/components/ui/badge"
import { formatDateShort } from "@/lib/utils"
import type { WorkItemType } from "@/lib/types"

type ViewType = "wbs" | "gantt" | "kanban" | "resource" | "developer"

const VIEWS: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: "wbs",       label: "Work Breakdown",  icon: List },
  { id: "gantt",     label: "Gantt Timeline",  icon: GitBranch },
  { id: "kanban",    label: "Kanban Board",    icon: LayoutGrid },
  { id: "resource",  label: "Resource View",   icon: Users },
  { id: "developer", label: "Developer",       icon: Code2 },
]

// Map view → sensible default item type for the add form
const VIEW_DEFAULT_TYPE: Partial<Record<ViewType, WorkItemType>> = {
  wbs:      "task",
  gantt:    "milestone",
  kanban:   "story",
  resource: "task",
}

export default function SchedulePage() {
  const [view, setView]           = useState<ViewType>("wbs")
  const [addOpen, setAddOpen]     = useState(false)
  const { selectedId, setSelected } = useScheduleStore()
  const activeSprint              = useActiveSprint("prj-001")
  const project                   = MOCK_PROJECTS[0]

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Project Schedule"
        subtitle={project.name}
        breadcrumb={[{ label: "Delivery" }, { label: "Project Schedule" }]}
        actions={
          <div className="flex items-center gap-2">
            {activeSprint && (
              <div className="hidden lg:flex items-center gap-2 mr-2 text-xs text-ink-2">
                <StatusBadge status="active" />
                <span>
                  {activeSprint.name} · {formatDateShort(activeSprint.startDate)} – {formatDateShort(activeSprint.endDate)}
                </span>
              </div>
            )}
            {view !== "developer" && (
              <>
                <Button variant="outline" size="sm">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
                <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
                  <Plus className="h-3.5 w-3.5" /> Add Item
                </Button>
              </>
            )}
          </div>
        }
        tabs={
          <div className="flex items-center gap-0.5 pb-0">
            {VIEWS.map((v) => {
              const Icon = v.icon
              return (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2",
                    view === v.id
                      ? "border-sdp-red text-sdp-red"
                      : "border-transparent text-ink-2 hover:text-ink hover:border-[var(--line)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{v.label}</span>
                </button>
              )
            })}
          </div>
        }
      />

      <div className="flex-1 overflow-hidden">
        {view === "wbs"       && <WBSTree projectId="prj-001" onSelectItem={setSelected} />}
        {view === "gantt"     && <GanttChart projectId="prj-001" />}
        {view === "kanban"    && <KanbanBoard projectId="prj-001" sprintId={activeSprint?.id} />}
        {view === "resource"  && <ResourceHeatmap projectId="prj-001" />}
        {view === "developer" && <DeveloperWorkspace projectId="prj-001" />}
      </div>

      {view !== "developer" && (
        <WorkItemWizard
          open={addOpen}
          onClose={() => setAddOpen(false)}
          projectId="prj-001"
          sprintId={activeSprint?.id}
          defaultType={VIEW_DEFAULT_TYPE[view] ?? "task"}
        />
      )}
    </div>
  )
}
