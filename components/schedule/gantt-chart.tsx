"use client"
import React, { useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useScheduleStore } from "@/stores/scheduleStore"
import { Avatar } from "@/components/ui/avatar"
import { MOCK_USERS } from "@/lib/mock-data/users"
import type { WorkItem } from "@/lib/types"
import { getDaysBetween } from "@/lib/utils"
import {
  addDays, startOfMonth, endOfMonth, format,
  eachMonthOfInterval, eachWeekOfInterval,
  eachQuarterOfInterval, endOfQuarter, getQuarter,
  eachYearOfInterval, endOfYear, getYear,
} from "date-fns"
import { Diamond } from "lucide-react"

type ZoomLevel = "week" | "month" | "quarter" | "semester" | "year"

const DAY_WIDTHS: Record<ZoomLevel, number> = {
  week: 40, month: 20, quarter: 8, semester: 4, year: 2,
}

const ZOOM_LABELS: Record<ZoomLevel, string> = {
  week: "Week", month: "Month", quarter: "Quarter", semester: "Semester", year: "Year",
}

const HEADER_H = 40  // two 20px rows

function getDayX(date: Date | string, startDate: Date, dayWidth: number): number {
  return getDaysBetween(startDate, date) * dayWidth
}

// ─── Task bar ─────────────────────────────────────────────────────────────────
function TaskBar({
  item, startDate, dayWidth, rowHeight, rowIndex, isSelected, onClick,
}: {
  item: WorkItem; startDate: Date; dayWidth: number; rowHeight: number
  rowIndex: number; isSelected: boolean; onClick: () => void
}) {
  const x     = getDayX(new Date(item.startDate), startDate, dayWidth)
  const width = Math.max(getDaysBetween(item.startDate, item.endDate) * dayWidth, item.type === "milestone" ? 14 : 20)
  const y     = rowIndex * rowHeight
  const today = new Date()
  const completionWidth = (item.completionPct / 100) * width

  if (item.type === "milestone") {
    return (
      <g transform={`translate(${x + dayWidth / 2}, ${y + rowHeight / 2})`} onClick={onClick} className="cursor-pointer">
        <polygon
          points="0,-8 8,0 0,8 -8,0"
          fill={item.color ?? "var(--sdp-red)"}
          opacity={0.9}
          stroke={isSelected ? "#fff" : "transparent"}
          strokeWidth={2}
        />
        <title>{item.title}</title>
      </g>
    )
  }

  const barColor = item.color ?? (
    item.status === "blocked"   ? "var(--danger)"  :
    item.status === "completed" ? "var(--success)"  :
    item.type   === "phase"     ? "var(--sdp-red)" :
    item.type   === "stream"    ? "var(--info)"    :
    "rgba(79,142,247,0.7)"
  )

  return (
    <g transform={`translate(${x}, ${y + (rowHeight - 20) / 2})`} onClick={onClick} className="cursor-pointer">
      <rect width={width} height={20} rx={4}
        fill={barColor} opacity={item.status === "completed" ? 0.5 : 0.75}
        stroke={isSelected ? "#fff" : "transparent"} strokeWidth={1.5}
      />
      {item.completionPct > 0 && (
        <rect width={completionWidth} height={20} rx={4} fill={barColor} opacity={0.95} />
      )}
      {width > 60 && (
        <text x={8} y={13} fill="white" fontSize={10} fontWeight={500} style={{ pointerEvents: "none" }}>
          {item.title.length > Math.floor(width / 8)
            ? item.title.slice(0, Math.floor(width / 8)) + "…"
            : item.title}
        </text>
      )}
      <title>{`${item.title}\n${item.startDate} → ${item.endDate}\n${item.completionPct}% complete`}</title>
    </g>
  )
}

// ─── Main chart ───────────────────────────────────────────────────────────────
export function GanttChart({ projectId }: { projectId: string }) {
  const { workItems, selectedId, setSelected } = useScheduleStore()
  const [zoom, setZoom] = useState<ZoomLevel>("month")
  const scrollRef  = useRef<HTMLDivElement>(null)
  const leftRef    = useRef<HTMLDivElement>(null)
  const isSyncing  = useRef(false)

  function handleRightScroll() {
    if (isSyncing.current || !leftRef.current || !scrollRef.current) return
    isSyncing.current = true
    leftRef.current.scrollTop = scrollRef.current.scrollTop
    isSyncing.current = false
  }

  function handleLeftScroll() {
    if (isSyncing.current || !leftRef.current || !scrollRef.current) return
    isSyncing.current = true
    scrollRef.current.scrollTop = leftRef.current.scrollTop
    isSyncing.current = false
  }

  // Flatten into display order: phases → streams → tasks/milestones
  const flatItems = useMemo(() => {
    const result: WorkItem[] = []
    const addChildren = (parentId?: string) => {
      workItems
        .filter((i) => i.projectId === projectId && i.parentId === parentId)
        .sort((a, b) => a.position - b.position)
        .forEach((child) => { result.push(child); addChildren(child.id) })
    }
    workItems
      .filter((i) => i.projectId === projectId && !i.parentId)
      .sort((a, b) => a.position - b.position)
      .forEach((item) => { result.push(item); addChildren(item.id) })
    return result
  }, [workItems, projectId])

  // Date range
  const allDates = workItems
    .filter((i) => i.projectId === projectId)
    .flatMap((i) => [new Date(i.startDate), new Date(i.endDate)])
  const minDate   = allDates.length ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : new Date()
  const maxDate   = allDates.length ? new Date(Math.max(...allDates.map((d) => d.getTime()))) : addDays(new Date(), 180)
  const startDate = startOfMonth(addDays(minDate, -7))
  const endDate   = endOfMonth(addDays(maxDate, 14))

  const dayWidth    = DAY_WIDTHS[zoom]
  const rowHeight   = 36
  const labelWidth  = 220
  const chartWidth  = getDaysBetween(startDate, endDate) * dayWidth
  const chartHeight = flatItems.length * rowHeight

  const today  = new Date()
  const todayX = getDayX(today, startDate, dayWidth)

  // Pre-compute intervals
  const months   = eachMonthOfInterval({ start: startDate, end: endDate })
  const quarters = eachQuarterOfInterval({ start: startDate, end: endDate })
  const years    = eachYearOfInterval({ start: startDate, end: endDate })
  const weeks    = eachWeekOfInterval({ start: startDate, end: endDate })

  // Semesters: H1 = Jan–Jun, H2 = Jul–Dec
  const semesters = useMemo(() => {
    const result: { date: Date; end: Date; label: string }[] = []
    years.forEach((yr) => {
      const y = getYear(yr)
      result.push({ date: new Date(y, 0, 1),  end: new Date(y, 5, 30), label: `H1 ${y}` })
      result.push({ date: new Date(y, 6, 1),  end: new Date(y, 11, 31), label: `H2 ${y}` })
    })
    return result.filter((s) => s.date <= endDate && s.end >= startDate)
  }, [years, startDate, endDate])

  // ── Header rendering ────────────────────────────────────────────────────────
  const renderPrimaryHeaders = () => {
    // year: show YYYY labels
    if (zoom === "year") {
      return years.map((yr) => {
        const x = getDayX(yr, startDate, dayWidth)
        const w = getDaysBetween(yr, endOfYear(yr)) * dayWidth
        return (
          <g key={yr.toISOString()}>
            <rect x={x} y={0} width={w} height={20} fill="var(--elevated)" />
            {w > 24 && (
              <text x={x + 8} y={14} fill="var(--ink-2)" fontSize={11} fontWeight={600}>
                {format(yr, "yyyy")}
              </text>
            )}
            <line x1={x} y1={0} x2={x} y2={HEADER_H + chartHeight} stroke="var(--line)" strokeWidth={1} />
          </g>
        )
      })
    }
    // semester: H1 / H2
    if (zoom === "semester") {
      return semesters.map((sem) => {
        const clampedStart = sem.date < startDate ? startDate : sem.date
        const clampedEnd   = sem.end  > endDate   ? endDate   : sem.end
        const x = getDayX(clampedStart, startDate, dayWidth)
        const w = getDaysBetween(clampedStart, clampedEnd) * dayWidth
        return (
          <g key={sem.label}>
            <rect x={x} y={0} width={w} height={20} fill="var(--elevated)" />
            {w > 30 && (
              <text x={x + 8} y={14} fill="var(--ink-2)" fontSize={10} fontWeight={600}>
                {sem.label}
              </text>
            )}
            <line x1={x} y1={0} x2={x} y2={HEADER_H + chartHeight} stroke="var(--line)" strokeWidth={1} />
          </g>
        )
      })
    }
    // quarter: Q1 2024 …
    if (zoom === "quarter") {
      return quarters.map((q) => {
        const x = getDayX(q, startDate, dayWidth)
        const w = getDaysBetween(q, endOfQuarter(q)) * dayWidth
        return (
          <g key={q.toISOString()}>
            <rect x={x} y={0} width={w} height={20} fill="var(--elevated)" />
            {w > 30 && (
              <text x={x + 8} y={14} fill="var(--ink-2)" fontSize={10} fontWeight={600}>
                Q{getQuarter(q)} {format(q, "yyyy")}
              </text>
            )}
            <line x1={x} y1={0} x2={x} y2={HEADER_H + chartHeight} stroke="var(--line)" strokeWidth={1} />
          </g>
        )
      })
    }
    // week / month: month names
    return months.map((month) => {
      const x = getDayX(month, startDate, dayWidth)
      const w = getDaysBetween(month, endOfMonth(month)) * dayWidth
      return (
        <g key={month.toISOString()}>
          <rect x={x} y={0} width={w} height={20} fill="var(--elevated)" />
          {w > 40 && (
            <text x={x + 8} y={14} fill="var(--ink-3)" fontSize={9} fontWeight={500}>
              {format(month, "MMMM yyyy")}
            </text>
          )}
          <line x1={x} y1={0} x2={x} y2={HEADER_H + chartHeight} stroke="var(--line)" strokeWidth={0.5} />
        </g>
      )
    })
  }

  const renderSecondaryHeaders = () => {
    // year: quarters as sub-labels
    if (zoom === "year") {
      return quarters.map((q) => {
        const x = getDayX(q, startDate, dayWidth)
        const w = getDaysBetween(q, endOfQuarter(q)) * dayWidth
        return (
          <g key={q.toISOString()}>
            <rect x={x} y={20} width={w} height={20}
              fill={getQuarter(q) % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"} />
            {w > 14 && (
              <text x={x + 4} y={34} fill="var(--ink-3)" fontSize={9}>
                Q{getQuarter(q)}
              </text>
            )}
            <line x1={x} y1={20} x2={x} y2={HEADER_H + chartHeight} stroke="var(--line)" strokeWidth={0.4} />
          </g>
        )
      })
    }
    // semester/quarter: month names as sub-labels
    if (zoom === "semester" || zoom === "quarter") {
      return months.map((month) => {
        const x = getDayX(month, startDate, dayWidth)
        const w = getDaysBetween(month, endOfMonth(month)) * dayWidth
        return (
          <g key={month.toISOString()}>
            <rect x={x} y={20} width={w} height={20}
              fill={month.getMonth() % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent"} />
            {w > 20 && (
              <text x={x + 4} y={34} fill="var(--ink-3)" fontSize={9}>
                {format(month, "MMM")}
              </text>
            )}
            <line x1={x} y1={20} x2={x} y2={HEADER_H + chartHeight} stroke="var(--line)" strokeWidth={0.3} />
          </g>
        )
      })
    }
    // week: week start dates
    if (zoom === "week") {
      return weeks.map((week) => {
        const x = getDayX(week, startDate, dayWidth)
        return (
          <g key={week.toISOString()}>
            <text x={x + 4} y={34} fill="var(--ink-3)" fontSize={8}>{format(week, "MMM d")}</text>
            <line x1={x} y1={20} x2={x} y2={HEADER_H + chartHeight} stroke="var(--line)" strokeWidth={0.3} />
          </g>
        )
      })
    }
    // month: week dashes only
    return weeks.map((week) => {
      const x = getDayX(week, startDate, dayWidth)
      return (
        <line key={week.toISOString()} x1={x} y1={20} x2={x} y2={HEADER_H + chartHeight}
          stroke="var(--line)" strokeWidth={0.3} strokeDasharray="2 4" />
      )
    })
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--line)] bg-elevated shrink-0">
        <div className="flex items-center gap-1">
          {(Object.keys(DAY_WIDTHS) as ZoomLevel[]).map((z) => (
            <button
              key={z}
              onClick={() => setZoom(z)}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all",
                zoom === z ? "bg-sdp-red text-white" : "text-ink-2 hover:bg-overlay hover:text-ink"
              )}
            >
              {ZOOM_LABELS[z]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-ink-3">
          <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded bg-sdp-red opacity-75" /> Phase</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded bg-info opacity-75" /> Stream</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded bg-success opacity-50" /> Done</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-6 rounded bg-danger opacity-75" /> Blocked</span>
          <span className="flex items-center gap-1.5"><Diamond className="h-3 w-3 text-sdp-red" /> Milestone</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: task labels */}
        <div className="shrink-0 flex flex-col overflow-hidden border-r border-[var(--line)]" style={{ width: labelWidth }}>
          <div className="h-10 shrink-0 border-b border-[var(--line)] bg-elevated" />
          <div ref={leftRef} className="flex-1 overflow-y-auto" onScroll={handleLeftScroll}>
            {flatItems.map((item) => {
              const owner   = MOCK_USERS.find((u) => u.id === item.assigneeId)
              const isPhase = item.type === "phase"
              const indent  = !item.parentId ? 0
                : workItems.find((p) => p.id === item.parentId)?.type === "phase" ? 12 : 24
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-2 px-3 border-b border-[var(--line)] transition-colors cursor-pointer",
                    isPhase ? "bg-elevated/30 hover:bg-elevated/50" : "hover:bg-elevated/30",
                    selectedId === item.id && "bg-sdp-red/5"
                  )}
                  style={{ height: rowHeight, paddingLeft: 12 + indent }}
                  onClick={() => setSelected(item.id)}
                >
                  {item.type === "milestone" ? (
                    <Diamond className="h-3 w-3 text-sdp-red shrink-0" />
                  ) : (
                    <span className={cn("h-2 w-2 rounded-full shrink-0", {
                      "bg-sdp-red":  item.type === "phase",
                      "bg-info":     item.type === "stream",
                      "bg-success":  item.status === "completed",
                      "bg-danger":   item.status === "blocked",
                      "bg-ink-3":    item.status === "not_started",
                      "bg-info/70":  item.status === "in_progress" && item.type !== "phase" && item.type !== "stream",
                    })} />
                  )}
                  <span className={cn("text-xs truncate flex-1", isPhase ? "font-semibold text-ink" : "text-ink-2")}>
                    {item.title}
                  </span>
                  {owner && <Avatar name={owner.name} size="xs" className="shrink-0" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right panel: SVG Gantt */}
        <div ref={scrollRef} className="flex-1 overflow-auto" onScroll={handleRightScroll}>
          <svg width={chartWidth} height={HEADER_H + chartHeight} style={{ display: "block", minWidth: "100%" }}>
            {/* Header background */}
            <rect x={0} y={0} width={chartWidth} height={HEADER_H} fill="var(--elevated)" />

            {/* Primary headers */}
            {renderPrimaryHeaders()}

            {/* Row separator between primary and secondary */}
            <line x1={0} y1={20} x2={chartWidth} y2={20} stroke="var(--line)" strokeWidth={0.5} />

            {/* Secondary headers */}
            {renderSecondaryHeaders()}

            {/* Header bottom border */}
            <line x1={0} y1={HEADER_H} x2={chartWidth} y2={HEADER_H} stroke="var(--line)" strokeWidth={1} />

            {/* Row backgrounds + dividers */}
            {flatItems.map((item, i) => (
              <g key={`bg-${item.id}`}>
                <rect
                  x={0} y={HEADER_H + i * rowHeight} width={chartWidth} height={rowHeight}
                  fill={
                    item.type === "phase" ? "rgba(255,255,255,0.02)"
                    : i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)"
                  }
                />
                <line
                  x1={0} y1={HEADER_H + (i + 1) * rowHeight}
                  x2={chartWidth} y2={HEADER_H + (i + 1) * rowHeight}
                  stroke="var(--line)" strokeWidth={0.5}
                />
              </g>
            ))}

            {/* Task bars */}
            <g transform={`translate(0, ${HEADER_H})`}>
              {flatItems.map((item, i) => (
                <TaskBar
                  key={item.id}
                  item={item}
                  startDate={startDate}
                  dayWidth={dayWidth}
                  rowHeight={rowHeight}
                  rowIndex={i}
                  isSelected={selectedId === item.id}
                  onClick={() => setSelected(item.id)}
                />
              ))}
            </g>

            {/* Today line */}
            {todayX > 0 && todayX < chartWidth && (
              <g transform={`translate(${todayX}, 0)`}>
                <line x1={0} y1={20} x2={0} y2={HEADER_H + chartHeight}
                  stroke="#0C62FB" strokeWidth={1.5} strokeDasharray="4 3" />
                <rect x={-16} y={20} width={32} height={12} rx={3} fill="#0C62FB" />
                <text x={0} y={29} textAnchor="middle" fill="white" fontSize={8} fontWeight={600}>TODAY</text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}
