"use client"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useScheduleStore } from "@/stores/scheduleStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { WorkItem } from "@/lib/types"
import {
  addDays, addWeeks, startOfWeek, format,
  eachMonthOfInterval, startOfMonth, endOfMonth, isSameWeek,
} from "date-fns"
import { AlertTriangle, TrendingUp, Users, ChevronRight } from "lucide-react"

// ─── Config ───────────────────────────────────────────────────────────────────
// Simulated "today" anchored to the active sprint so the heatmap always shows
// a meaningful slice of the 2024 project timeline regardless of real clock.
const PROJECT_BASELINE = new Date("2024-06-10")

const TEAM_IDS = [
  "usr-001", "usr-003", "usr-004",
  "usr-005", "usr-006",
  "usr-009", "usr-010", "usr-011", "usr-012", "usr-013",
]

// Base management overhead % (meetings, admin, ceremonies) before work items
const MGMT_BASE: Record<string, number> = {
  "usr-001": 52,  // Alex Rivera — Program Manager
  "usr-003": 56,  // Sarah Mitchell — Project Manager
  "usr-004": 42,  // Marcus Johnson — Scrum Master
}

const WEEK_OPTIONS = [4, 8, 12, 24] as const

// ─── Absence data ─────────────────────────────────────────────────────────────
type AbsenceType = "pto" | "vacation" | "holiday" | "conference" | "sick"

interface Absence {
  userId: string   // specific user ID, or "all" for public holidays
  startDate: string
  endDate: string
  type: AbsenceType
  label: string
}

const MOCK_ABSENCES: Absence[] = [
  // ── Public holidays — whole team ──────────────────────────────────────────
  { userId: "all", startDate: "2024-08-26", endDate: "2024-08-26", type: "holiday",    label: "Bank Hol" },
  { userId: "all", startDate: "2024-12-23", endDate: "2024-12-27", type: "holiday",    label: "Xmas" },
  { userId: "all", startDate: "2024-12-30", endDate: "2025-01-03", type: "holiday",    label: "New Year" },

  // ── Priya Sharma (usr-005) ────────────────────────────────────────────────
  { userId: "usr-005", startDate: "2024-06-24", endDate: "2024-06-28", type: "pto",        label: "PTO" },
  { userId: "usr-005", startDate: "2024-09-09", endDate: "2024-09-13", type: "conference", label: "QCon" },

  // ── James Okafor (usr-009) ────────────────────────────────────────────────
  { userId: "usr-009", startDate: "2024-07-22", endDate: "2024-08-02", type: "vacation",   label: "Vacation" },

  // ── Elena Vasquez (usr-010) ───────────────────────────────────────────────
  { userId: "usr-010", startDate: "2024-08-19", endDate: "2024-08-23", type: "vacation",   label: "Vacation" },
  { userId: "usr-010", startDate: "2024-11-04", endDate: "2024-11-08", type: "pto",        label: "PTO" },

  // ── Ravi Patel (usr-011) ─────────────────────────────────────────────────
  { userId: "usr-011", startDate: "2024-10-14", endDate: "2024-10-18", type: "pto",        label: "PTO" },
  { userId: "usr-011", startDate: "2024-11-25", endDate: "2024-11-29", type: "conference", label: "AWS re:I" },

  // ── Anya Kowalski (usr-012) ───────────────────────────────────────────────
  { userId: "usr-012", startDate: "2024-07-29", endDate: "2024-08-02", type: "sick",       label: "Sick" },
  { userId: "usr-012", startDate: "2024-10-28", endDate: "2024-11-01", type: "vacation",   label: "Vacation" },

  // ── Daniel Kim (usr-013) ─────────────────────────────────────────────────
  { userId: "usr-013", startDate: "2024-07-08", endDate: "2024-07-12", type: "pto",        label: "PTO" },
  { userId: "usr-013", startDate: "2024-09-23", endDate: "2024-09-27", type: "pto",        label: "PTO" },

  // ── Alex Rivera (usr-001) ────────────────────────────────────────────────
  { userId: "usr-001", startDate: "2024-07-22", endDate: "2024-07-26", type: "conference", label: "PMI Conf" },
  { userId: "usr-001", startDate: "2024-10-07", endDate: "2024-10-11", type: "pto",        label: "PTO" },

  // ── Sarah Mitchell (usr-003) ─────────────────────────────────────────────
  { userId: "usr-003", startDate: "2024-08-05", endDate: "2024-08-09", type: "pto",        label: "PTO" },

  // ── Marcus Johnson (usr-004) ─────────────────────────────────────────────
  { userId: "usr-004", startDate: "2024-09-02", endDate: "2024-09-06", type: "pto",        label: "PTO" },

  // ── Tom Bradley (usr-006) ────────────────────────────────────────────────
  { userId: "usr-006", startDate: "2024-09-16", endDate: "2024-09-27", type: "vacation",   label: "Vacation" },
]

function getAbsenceForWeek(userId: string, weekStart: Date): Absence | null {
  const weekEnd = addDays(weekStart, 4) // Mon–Fri only
  return (
    MOCK_ABSENCES.find((a) => {
      const matchesUser = a.userId === "all" || a.userId === userId
      if (!matchesUser) return false
      const s = new Date(a.startDate)
      const e = new Date(a.endDate)
      return s <= weekEnd && e >= weekStart
    }) ?? null
  )
}

const ABSENCE_STYLE: Record<AbsenceType, { color: string; textColor: string }> = {
  pto:        { color: "bg-violet-500/20 border-violet-400/40",  textColor: "text-violet-500" },
  vacation:   { color: "bg-sky-500/20 border-sky-400/40",        textColor: "text-sky-500" },
  sick:       { color: "bg-orange-500/20 border-orange-400/40",  textColor: "text-orange-500" },
  conference: { color: "bg-amber-500/20 border-amber-400/40",    textColor: "text-amber-600" },
  holiday:    { color: "bg-slate-500/15 border-slate-400/30",    textColor: "text-slate-400" },
}

// ─── Utilization helpers ───────────────────────────────────────────────────────
// Deterministic ±noise so the same person always renders the same % in the same
// week (no random seed on re-render) but each person/week pair differs.
function weekNoise(userId: string, weekIdx: number, salt = 0): number {
  const a = userId.charCodeAt(userId.length - 1)
  const b = userId.charCodeAt(Math.min(4, userId.length - 1))
  return Math.round(
    Math.sin((a * 7 + (weekIdx + salt) * 13) * 0.4) * 11 +
    Math.cos((b * 3 + (weekIdx + salt) * 17) * 0.3) * 9
  )
}

function getUtil(value: number): { color: string; textColor: string } {
  if (value === 0)  return { color: "bg-elevated",                   textColor: "text-ink-3" }
  if (value <= 50)  return { color: "bg-info/20",                    textColor: "text-info" }
  if (value <= 80)  return { color: "bg-success/25",                 textColor: "text-success" }
  if (value <= 100) return { color: "bg-warning/35",                 textColor: "text-warning" }
  return                   { color: "bg-danger/45 border-danger/40", textColor: "text-danger font-bold" }
}

// ─── Allocation computation ───────────────────────────────────────────────────
function computeAllocations(workItems: WorkItem[], weeks: Date[]): Record<string, number[]> {
  const result: Record<string, number[]> = {}

  // Seed management overhead with noise so it varies realistically week-to-week
  TEAM_IDS.forEach((id) => {
    const base = MGMT_BASE[id] ?? 0
    result[id] = weeks.map((_, i) =>
      base > 0 ? Math.max(5, base + weekNoise(id, i)) : 0
    )
  })

  workItems.forEach((item) => {
    if (!item.assigneeId || !item.estimatedHours || !TEAM_IDS.includes(item.assigneeId)) return
    const assigneeId = item.assigneeId
    const itemStart  = new Date(item.startDate)
    const itemEnd    = new Date(item.endDate)
    const totalMs    = itemEnd.getTime() - itemStart.getTime()
    if (totalMs <= 0) return
    const hoursPerMs = item.estimatedHours / totalMs

    weeks.forEach((weekStart, i) => {
      const weekEnd   = addDays(weekStart, 7)
      const overlapMs = Math.min(itemEnd.getTime(), weekEnd.getTime()) -
                        Math.max(itemStart.getTime(), weekStart.getTime())
      if (overlapMs <= 0) return
      const weekHours = (hoursPerMs * overlapMs) / (1000 * 60 * 60)
      const utilPct   = Math.round((weekHours / 40) * 100)
      // Apply a lighter noise on top of the work-item contribution
      const noise     = Math.round(weekNoise(assigneeId, i, 7) * 0.45)
      result[assigneeId][i] = (result[assigneeId][i] ?? 0) + utilPct + noise
    })
  })

  // Clamp negatives and zero out absence weeks (UI shows badge instead of %)
  TEAM_IDS.forEach((id) => {
    weeks.forEach((weekStart, i) => {
      result[id][i] = Math.max(0, result[id][i] ?? 0)
      if (getAbsenceForWeek(id, weekStart)) result[id][i] = 0
    })
  })

  return result
}

// ─── Week tasks for tooltip ───────────────────────────────────────────────────
function getWeekTasks(workItems: WorkItem[], userId: string, weekStart: Date): WorkItem[] {
  const weekEnd = addDays(weekStart, 7)
  return workItems.filter((item) => {
    if (item.assigneeId !== userId) return false
    const s = new Date(item.startDate)
    const e = new Date(item.endDate)
    return s < weekEnd && e > weekStart
  })
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ResourceHeatmap({ projectId }: { projectId: string }) {
  const { workItems } = useScheduleStore()
  const [weeksToShow, setWeeksToShow] = useState<typeof WEEK_OPTIONS[number]>(12)
  const [showOnlyAtRisk, setShowOnlyAtRisk] = useState(false)

  const projectItems = workItems.filter((i) => i.projectId === projectId)
  const startDate    = startOfWeek(PROJECT_BASELINE, { weekStartsOn: 1 })
  const weeks        = Array.from({ length: weeksToShow }, (_, i) => addWeeks(startDate, i))
  const today        = PROJECT_BASELINE  // simulated "current" date for the demo

  const allocations = useMemo(
    () => computeAllocations(projectItems, weeks),
    [projectItems, weeksToShow]  // eslint-disable-line react-hooks/exhaustive-deps
  )

  const users = MOCK_USERS.filter((u) => TEAM_IDS.includes(u.id))

  // Month header groupings
  const months      = eachMonthOfInterval({ start: weeks[0], end: weeks[weeks.length - 1] })
  const monthGroups = months.map((month) => ({
    label: format(month, "MMM yyyy"),
    count: weeks.filter((w) => {
      const wEnd = addDays(w, 6)
      return w <= endOfMonth(month) && wEnd >= startOfMonth(month)
    }).length,
  }))

  // Per-person stats — exclude absence weeks from avg/peak so they aren't skewed
  const personStats = useMemo(() => {
    return TEAM_IDS.map((id) => {
      const vals = (allocations[id] ?? []).filter((_, i) => !getAbsenceForWeek(id, weeks[i]))
      const avg  = vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 0
      const peak = vals.length ? Math.max(...vals) : 0
      const overloadedWeeks = vals.filter((v) => v > 100).length
      return { id, avg, peak, overloadedWeeks }
    })
  }, [allocations]) // eslint-disable-line react-hooks/exhaustive-deps

  // Team average per week — only count members who are present that week
  const teamAvg = weeks.map((week, i) => {
    const presentIds = TEAM_IDS.filter((id) => !getAbsenceForWeek(id, week))
    if (!presentIds.length) return 0
    const vals = presentIds.map((id) => allocations[id]?.[i] ?? 0)
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length)
  })

  const risks = personStats
    .filter((s) => s.overloadedWeeks > 0)
    .sort((a, b) => b.overloadedWeeks - a.overloadedWeeks)

  const filteredUsers = showOnlyAtRisk
    ? users.filter((u) => risks.some((r) => r.id === u.id))
    : users

  return (
    <div className="flex flex-col h-full overflow-auto p-6 space-y-5">
      {/* Header + controls */}
      <div className="flex items-start justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-base font-semibold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Resource Allocation
          </h2>
          <p className="text-sm text-ink-2 mt-0.5">
            Weekly utilisation · next {weeksToShow} weeks from Sprint 8
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowOnlyAtRisk((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              showOnlyAtRisk
                ? "bg-danger/10 border-danger/30 text-danger"
                : "border-[var(--line)] text-ink-2 hover:bg-elevated"
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            At risk only
          </button>
          <div className="flex items-center gap-1 rounded-lg border border-[var(--line)] p-0.5 bg-elevated">
            {WEEK_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setWeeksToShow(n)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                  weeksToShow === n ? "bg-sdp-red text-white" : "text-ink-2 hover:text-ink"
                )}
              >
                {n}W
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 text-xs text-ink-2 shrink-0 flex-wrap">
        {[
          { color: "bg-elevated",   label: "Free" },
          { color: "bg-info/20",    label: "1–50%" },
          { color: "bg-success/25", label: "51–80%" },
          { color: "bg-warning/35", label: "81–100%" },
          { color: "bg-danger/45",  label: ">100%" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn("h-3 w-5 rounded border border-[var(--line)]", item.color)} />
            <span>{item.label}</span>
          </div>
        ))}
        <div className="h-3 w-px bg-[var(--line)]" />
        {(Object.entries(ABSENCE_STYLE) as [AbsenceType, { color: string; textColor: string }][]).map(([type, style]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={cn("h-3 w-5 rounded border", style.color)} />
            <span className="capitalize">{type === "pto" ? "PTO" : type === "conference" ? "Conf" : type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-info">
          <div className="h-4 w-4 rounded border-2 border-info bg-transparent" />
          Current week
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shrink-0">
        <table className="border-collapse" style={{ minWidth: "100%" }}>
          <thead>
            {/* Month grouping row */}
            <tr>
              <th className="text-left pr-4 pb-0 w-52" />
              {monthGroups.map((mg, i) => (
                <th
                  key={i}
                  colSpan={mg.count}
                  className="text-center pb-0 text-[10px] font-semibold text-ink-3 uppercase tracking-wider border-b border-[var(--line)]"
                >
                  <div className="px-2 pb-1">{mg.label}</div>
                </th>
              ))}
              <th className="pl-3 pb-0 w-28" />
            </tr>
            {/* Week dates row */}
            <tr>
              <th className="text-left pr-4 pb-2 text-xs font-medium text-ink-2 w-52">Team Member</th>
              {weeks.map((week, i) => {
                const isCurrent  = isSameWeek(week, today, { weekStartsOn: 1 })
                const isHoliday  = !!getAbsenceForWeek("all", week)
                return (
                  <th key={i} className="pb-2">
                    <div className={cn(
                      "text-[10px] font-medium text-center px-1 py-0.5 rounded mx-0.5",
                      isCurrent  ? "bg-info/15 text-info border border-info/30" :
                      isHoliday  ? "text-slate-400 line-through" :
                      "text-ink-3"
                    )}>
                      {format(week, "MMM d")}
                    </div>
                  </th>
                )
              })}
              <th className="pl-3 pb-2 text-[10px] font-medium text-ink-3 text-left whitespace-nowrap">Summary</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => {
              const stats      = personStats.find((s) => s.id === user.id)!
              const allocation = allocations[user.id] ?? []

              return (
                <tr key={user.id} className="group">
                  {/* Person cell */}
                  <td className="pr-4 py-1.5 w-52">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={user.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-ink font-medium truncate">{user.name}</p>
                        <p className="text-[10px] text-ink-3 truncate">{user.title}</p>
                      </div>
                    </div>
                  </td>

                  {/* Weekly cells */}
                  {weeks.map((week, i) => {
                    const absence   = getAbsenceForWeek(user.id, week)
                    const value     = allocation[i] ?? 0
                    const isCurrent = isSameWeek(week, today, { weekStartsOn: 1 })

                    if (absence) {
                      const { color, textColor } = ABSENCE_STYLE[absence.type]
                      const absStart = format(new Date(absence.startDate), "MMM d")
                      const absEnd   = format(new Date(absence.endDate),   "MMM d")
                      return (
                        <td key={i} className="py-1.5 px-0.5">
                          <div
                            title={`${user.name} — ${absence.label}\n${absStart} – ${absEnd}`}
                            className={cn(
                              "h-8 w-14 rounded flex flex-col items-center justify-center text-[10px] font-semibold border cursor-default",
                              color, textColor,
                              isCurrent && "ring-1 ring-info/30"
                            )}
                          >
                            {absence.label}
                          </div>
                        </td>
                      )
                    }

                    const { color, textColor } = getUtil(value)
                    const tasks   = getWeekTasks(projectItems, user.id, week)
                    const tooltip = tasks.length
                      ? `${user.name} — Week of ${format(week, "MMM d")}\n${value}% utilised\n\nTasks:\n` + tasks.map((t) => `• ${t.title}`).join("\n")
                      : `${user.name} — Week of ${format(week, "MMM d")}\n${value || 0}% utilised`

                    return (
                      <td key={i} className="py-1.5 px-0.5">
                        <div
                          title={tooltip}
                          className={cn(
                            "h-8 w-14 rounded flex flex-col items-center justify-center text-[10px] font-medium border transition-all hover:scale-105 hover:shadow-md cursor-default",
                            color,
                            isCurrent ? "border-info/50 ring-1 ring-info/30" : "border-[var(--line)]",
                            textColor
                          )}
                        >
                          <span>{value > 0 ? `${value}%` : "—"}</span>
                          {tasks.length > 0 && value > 0 && (
                            <span className="text-[8px] opacity-60">{tasks.length}t</span>
                          )}
                        </div>
                      </td>
                    )
                  })}

                  {/* Summary cell */}
                  <td className="pl-3 py-1.5 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "text-xs font-semibold px-1.5 py-0.5 rounded",
                          stats.avg > 100 ? "bg-danger/10 text-danger" :
                          stats.avg >= 80 ? "bg-warning/10 text-warning" :
                          "bg-success/10 text-success"
                        )}>
                          avg {stats.avg}%
                        </span>
                        <span className="text-[10px] text-ink-3">pk {stats.peak}%</span>
                      </div>
                      {stats.overloadedWeeks > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-danger">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          {stats.overloadedWeeks}w over
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}

            {/* Team average row */}
            <tr className="border-t border-[var(--line)]">
              <td className="pr-4 py-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-elevated border border-[var(--line)] flex items-center justify-center shrink-0">
                    <Users className="h-3.5 w-3.5 text-ink-3" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink">Team Average</p>
                    <p className="text-[10px] text-ink-3">{filteredUsers.length} members</p>
                  </div>
                </div>
              </td>
              {teamAvg.map((avg, i) => {
                const { color, textColor } = getUtil(avg)
                const isCurrent  = isSameWeek(weeks[i], today, { weekStartsOn: 1 })
                const isHoliday  = !!getAbsenceForWeek("all", weeks[i])
                if (isHoliday) {
                  return (
                    <td key={i} className="py-2 px-0.5">
                      <div className={cn(
                        "h-7 w-14 rounded flex items-center justify-center text-[10px] font-semibold border",
                        ABSENCE_STYLE.holiday.color, ABSENCE_STYLE.holiday.textColor
                      )}>
                        Hol
                      </div>
                    </td>
                  )
                }
                return (
                  <td key={i} className="py-2 px-0.5">
                    <div className={cn(
                      "h-7 w-14 rounded flex items-center justify-center text-[10px] font-semibold border",
                      color, textColor,
                      isCurrent ? "border-info/50 ring-1 ring-info/30" : "border-[var(--line)]"
                    )}>
                      {avg > 0 ? `${avg}%` : "—"}
                    </div>
                  </td>
                )
              })}
              <td className="pl-3 py-2">
                {(() => {
                  const a = Math.round(teamAvg.reduce((s, v) => s + v, 0) / (teamAvg.length || 1))
                  return (
                    <span className={cn(
                      "text-xs font-semibold px-1.5 py-0.5 rounded",
                      a > 100 ? "bg-danger/10 text-danger" : a >= 80 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                    )}>
                      avg {a}%
                    </span>
                  )
                })()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Risk panel */}
      {risks.length > 0 && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 space-y-3 shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger shrink-0" />
            <p className="text-sm font-semibold text-danger">Overallocation Risks</p>
            <Badge variant="danger" className="ml-auto text-[10px]">{risks.length} member{risks.length > 1 ? "s" : ""}</Badge>
          </div>
          <div className="space-y-2">
            {risks.map((r) => {
              const user      = MOCK_USERS.find((u) => u.id === r.id)!
              const userTasks = projectItems.filter((i) => i.assigneeId === r.id && i.status !== "completed")
              const taskNames = userTasks.slice(0, 3).map((t) => t.title).join(", ")
              return (
                <div key={r.id} className="flex items-start gap-3 text-xs">
                  <Avatar name={user.name} size="xs" className="shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-ink">{user.name}</span>
                    <span className="text-ink-2 ml-2">
                      {r.overloadedWeeks} week{r.overloadedWeeks > 1 ? "s" : ""} over 100% · peak {r.peak}%
                    </span>
                    {taskNames && (
                      <p className="text-ink-3 mt-0.5 truncate">
                        {taskNames}{userTasks.length > 3 ? ` +${userTasks.length - 3} more` : ""}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-ink-3 shrink-0 mt-0.5" />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All clear */}
      {risks.length === 0 && (
        <div className="rounded-xl border border-success/20 bg-success/5 p-4 flex items-center gap-3 shrink-0">
          <TrendingUp className="h-4 w-4 text-success shrink-0" />
          <div>
            <p className="text-sm font-semibold text-success">All clear</p>
            <p className="text-xs text-ink-2 mt-0.5">
              No team member is overallocated in the next {weeksToShow} weeks.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
