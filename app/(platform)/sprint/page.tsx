"use client"
import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Badge, StatusBadge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { KanbanBoard } from "@/components/schedule/kanban-board"
import { useScheduleStore, useSprints, useActiveSprint } from "@/stores/scheduleStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { formatDate, formatDateShort, getDaysBetween } from "@/lib/utils"
import { WorkItemForm } from "@/components/schedule/work-item-form"
import {
  Play, ChevronLeft, ChevronRight, Target, Clock, CheckCircle2,
  BarChart2, ArrowUp, Flag, Plus,
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts"

const BURNDOWN_DATA = [
  { day: "Mon 17", ideal: 48, actual: 48 },
  { day: "Tue 18", ideal: 38, actual: 40 },
  { day: "Wed 19", ideal: 28, actual: 35 },
  { day: "Thu 20", ideal: 18, actual: 31 },
  { day: "Fri 21", ideal: 8,  actual: null },
  { day: "Mon 24", ideal: 0,  actual: null },
]

export default function SprintPage() {
  const sprints = useSprints("prj-001")
  const activeSprint = useActiveSprint("prj-001")
  const { workItems } = useScheduleStore()
  const [selectedSprintId, setSelectedSprintId] = useState(activeSprint?.id ?? sprints[0]?.id)
  const [addOpen, setAddOpen] = useState(false)

  const selectedSprint = sprints.find((s) => s.id === selectedSprintId)

  const sprintItems = workItems.filter((i) =>
    i.sprintId === selectedSprintId && (i.type === "task" || i.type === "story")
  )
  const completedPts = sprintItems.filter((i) => i.status === "completed").reduce((s, i) => s + (i.storyPoints ?? 0), 0)
  const totalPts = sprintItems.reduce((s, i) => s + (i.storyPoints ?? 0), 0)
  const blockedCount = sprintItems.filter((i) => i.status === "blocked").length

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Sprint Planner"
        subtitle="Manage sprints, track velocity, and run the Kanban board"
        breadcrumb={[{ label: "Delivery" }, { label: "Sprint Planner" }]}
        actions={
          <div className="flex items-center gap-2">
            {activeSprint && (
              <Badge variant="success" dot>Sprint Active</Badge>
            )}
            <Button variant="outline" size="sm">
              <BarChart2 className="h-3.5 w-3.5" /> Velocity
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Add Story
            </Button>
            <Button variant="primary" size="sm">
              <Play className="h-3.5 w-3.5" /> Start Sprint
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Sprint selector + meta */}
        <div className="px-6 py-3 border-b border-[var(--line)] flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const idx = sprints.findIndex((s) => s.id === selectedSprintId)
                if (idx > 0) setSelectedSprintId(sprints[idx - 1].id)
              }}
              className="p-1 rounded hover:bg-elevated text-ink-3 hover:text-ink transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <select
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
              className="h-8 rounded-md border border-[var(--line)] bg-elevated px-3 text-sm text-ink focus:outline-none focus:border-sdp-red"
            >
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const idx = sprints.findIndex((s) => s.id === selectedSprintId)
                if (idx < sprints.length - 1) setSelectedSprintId(sprints[idx + 1].id)
              }}
              className="p-1 rounded hover:bg-elevated text-ink-3 hover:text-ink transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {selectedSprint && (
            <>
              <StatusBadge status={selectedSprint.status} />
              <span className="text-xs text-ink-2">
                {formatDateShort(selectedSprint.startDate)} → {formatDateShort(selectedSprint.endDate)}
              </span>
              <div className="flex items-center gap-4 ml-auto text-xs text-ink-2">
                <span className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-info" />
                  {completedPts}/{selectedSprint.plannedPoints ?? totalPts} pts
                </span>
                {blockedCount > 0 && (
                  <span className="flex items-center gap-1.5 text-danger">
                    <Flag className="h-3.5 w-3.5" />
                    {blockedCount} blocked
                  </span>
                )}
                <div className="w-24">
                  <Progress
                    value={completedPts}
                    max={(selectedSprint.plannedPoints ?? totalPts) || 1}
                    size="xs"
                    showLabel
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Kanban main area */}
          <div className="flex-1 overflow-hidden">
            <KanbanBoard projectId="prj-001" sprintId={selectedSprintId} />
          </div>

          {/* Right sidebar: burndown */}
          <div className="w-72 shrink-0 border-l border-[var(--line)] overflow-y-auto p-4 space-y-4">
            <h3 className="text-sm font-semibold text-ink">Sprint Burndown</h3>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={BURNDOWN_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0C62FB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0C62FB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "var(--ink-3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--ink-3)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--elevated)", border: "1px solid var(--line)", borderRadius: 6, fontSize: 11 }}
                />
                <Area type="monotone" dataKey="ideal" stroke="var(--ink-3)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Ideal" />
                <Area type="monotone" dataKey="actual" stroke="#0C62FB" strokeWidth={2} fill="url(#bGrad)" connectNulls={false} name="Actual" />
              </AreaChart>
            </ResponsiveContainer>

            {/* Sprint goal */}
            {selectedSprint?.goal && (
              <div className="rounded-lg border border-[var(--line)] p-3 bg-elevated">
                <p className="text-[10px] text-ink-3 uppercase tracking-wider mb-1.5">Sprint Goal</p>
                <p className="text-xs text-ink-2 leading-relaxed italic">&ldquo;{selectedSprint.goal}&rdquo;</p>
              </div>
            )}

            {/* Velocity history */}
            <div>
              <p className="text-[10px] text-ink-3 uppercase tracking-wider mb-2">Velocity History</p>
              <div className="space-y-1.5">
                {[
                  { name: "Sprint 5", pts: 36 },
                  { name: "Sprint 6", pts: 44 },
                  { name: "Sprint 7", pts: 40 },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="text-xs text-ink-2 w-16">{s.name}</span>
                    <div className="flex-1 h-1.5 bg-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-sdp-red rounded-full" style={{ width: `${(s.pts / 52) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-ink w-8 text-right">{s.pts}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-ink-3 mt-2">Avg velocity: <span className="font-semibold text-ink">40 pts</span></p>
            </div>
          </div>
        </div>
      </div>

      <WorkItemForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        projectId="prj-001"
        sprintId={selectedSprintId}
        defaultType="story"
        defaultStatus="not_started"
      />
    </div>
  )
}
