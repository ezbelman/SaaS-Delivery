"use client"
import { useRef, useState } from "react"
import * as XLSX from "xlsx"
import { format } from "date-fns"
import { Download, FileSpreadsheet, FileText, FileType2, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScheduleStore } from "@/stores/scheduleStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import type { WorkItem, Sprint } from "@/lib/types"

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DATE = () => format(new Date(), "yyyy-MM-dd")
const TIMESTAMP = () => format(new Date(), "MMMM d, yyyy 'at' HH:mm")
const userName = (id?: string) => MOCK_USERS.find((u) => u.id === id)?.name ?? "—"

function labelStatus(s: string) { return s.replace(/_/g, " ") }

// ─── Excel export ─────────────────────────────────────────────────────────────
function exportExcel(workItems: WorkItem[], sprints: Sprint[]) {
  const wb = XLSX.utils.book_new()

  // Sheet 1 — Work Breakdown Structure
  const wbsRows = workItems.map((item) => ({
    "WBS #":          item.wbsNumber,
    "Title":          item.title,
    "Type":           item.type,
    "Status":         labelStatus(item.status),
    "Priority":       item.priority,
    "Assignee":       userName(item.assigneeId),
    "Start Date":     item.startDate,
    "End Date":       item.endDate,
    "Est. Hours":     item.estimatedHours ?? "",
    "Actual Hours":   item.actualHours ?? "",
    "% Complete":     item.completionPct,
    "Story Points":   item.storyPoints ?? "",
    "Sprint":         sprints.find((s) => s.id === item.sprintId)?.name ?? "—",
    "Dependencies":   item.dependencies.join(", "),
    "Description":    item.description ?? "",
  }))
  const wsWbs = XLSX.utils.json_to_sheet(wbsRows)
  // Column widths
  wsWbs["!cols"] = [
    { wch: 8 }, { wch: 44 }, { wch: 12 }, { wch: 14 }, { wch: 10 },
    { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 },
    { wch: 10 }, { wch: 12 }, { wch: 18 }, { wch: 20 }, { wch: 40 },
  ]
  XLSX.utils.book_append_sheet(wb, wsWbs, "Work Breakdown Structure")

  // Sheet 2 — Sprints
  const sprintRows = sprints.map((s) => {
    const items = workItems.filter((w) => w.sprintId === s.id)
    const done  = items.filter((w) => w.status === "completed").length
    return {
      "Sprint":            s.name,
      "Status":            s.status,
      "Start Date":        s.startDate,
      "End Date":          s.endDate,
      "Goal":              s.goal ?? "",
      "Planned Points":    s.plannedPoints ?? "",
      "Completed Points":  s.completedPoints ?? "",
      "Velocity":          s.velocity ?? "",
      "Total Items":       items.length,
      "Completed Items":   done,
      "% Done":            items.length ? Math.round((done / items.length) * 100) : 0,
    }
  })
  const wsSprints = XLSX.utils.json_to_sheet(sprintRows)
  wsSprints["!cols"] = [
    { wch: 18 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 36 },
    { wch: 14 }, { wch: 16 }, { wch: 10 }, { wch: 12 }, { wch: 16 }, { wch: 8 },
  ]
  XLSX.utils.book_append_sheet(wb, wsSprints, "Sprints")

  // Sheet 3 — Summary
  const byStatus: Record<string, number> = {}
  const byType: Record<string, number> = {}
  for (const w of workItems) {
    byStatus[w.status] = (byStatus[w.status] ?? 0) + 1
    byType[w.type]     = (byType[w.type] ?? 0) + 1
  }
  const summaryRows = [
    ["Metric", "Value"],
    ["Project", "Meridian Bank Digital Banking Transformation"],
    ["Total Work Items", workItems.length],
    ["Total Sprints", sprints.length],
    ["Exported", TIMESTAMP()],
    [],
    ["Status Breakdown", ""],
    ...Object.entries(byStatus).map(([k, v]) => [labelStatus(k), v]),
    [],
    ["Type Breakdown", ""],
    ...Object.entries(byType).map(([k, v]) => [k, v]),
  ]
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows)
  wsSummary["!cols"] = [{ wch: 30 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary")

  XLSX.writeFile(wb, `meridian-bank-schedule-${DATE()}.xlsx`)
}

// ─── Shared HTML scaffold ──────────────────────────────────────────────────────
function buildHtml(body: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Calibri, sans-serif; font-size: 11pt; color: #0f172a; background: #fff; padding: 32px 40px; line-height: 1.5; max-width: 1200px; margin: 0 auto; }
  h1 { font-size: 22pt; font-weight: 700; margin-bottom: 4px; }
  h2 { font-size: 13pt; font-weight: 600; margin: 28px 0 10px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
  h3 { font-size: 11pt; font-weight: 600; margin: 18px 0 8px; }
  p  { margin: 6px 0; }
  .cover { border-bottom: 3px solid #e2e8f0; padding-bottom: 28px; margin-bottom: 32px; }
  .badge { display: inline-block; background: #fff1f2; color: #e11d48; font-size: 8pt; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; padding: 3px 12px; border-radius: 999px; margin-bottom: 14px; }
  .meta { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 14px; font-size: 9pt; color: #64748b; }
  .meta strong { color: #334155; }
  table { width: 100%; border-collapse: collapse; font-size: 9pt; margin: 12px 0 24px; }
  th { background: #1e293b; color: #fff; font-weight: 600; text-align: left; padding: 7px 10px; white-space: nowrap; }
  td { border-bottom: 1px solid #e2e8f0; padding: 6px 10px; vertical-align: top; }
  tr:nth-child(even) td { background: #f8fafc; }
  .pill { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 8pt; font-weight: 600; white-space: nowrap; }
  .s-completed  { background:#dcfce7; color:#166534; }
  .s-in_progress{ background:#fef9c3; color:#854d0e; }
  .s-not_started{ background:#f1f5f9; color:#475569; }
  .s-blocked    { background:#fee2e2; color:#991b1b; }
  .p-critical   { background:#fee2e2; color:#991b1b; }
  .p-high       { background:#fed7aa; color:#9a3412; }
  .p-medium     { background:#fef9c3; color:#854d0e; }
  .p-low        { background:#f1f5f9; color:#475569; }
  .bar-wrap { background:#e2e8f0; border-radius:999px; height:6px; width:80px; display:inline-block; vertical-align:middle; }
  .bar-fill { background:#e11d48; border-radius:999px; height:6px; }
  .kpi-row { display:flex; gap:20px; margin:16px 0 28px; flex-wrap:wrap; }
  .kpi { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px 20px; min-width:130px; }
  .kpi .val { font-size:22pt; font-weight:700; color:#0f172a; line-height:1; }
  .kpi .lbl { font-size:8pt; color:#64748b; margin-top:4px; }
  .footer { margin-top:40px; padding-top:12px; border-top:1px solid #e2e8f0; font-size:8pt; color:#94a3b8; }
  @media print {
    body { padding: 20px 24px; }
    h2 { page-break-before: auto; }
    .kpi-row, table { page-break-inside: avoid; }
    .cover { page-break-after: always; }
  }
</style>
</head>
<body>
${body}
<div class="footer">
  Meridian Bank Digital Banking Transformation &nbsp;·&nbsp; Slalom Delivery Platform &nbsp;·&nbsp; Exported ${TIMESTAMP()}
</div>
</body>
</html>`
}

// ─── PDF export ───────────────────────────────────────────────────────────────
function exportPdf(workItems: WorkItem[], sprints: Sprint[]) {
  const total     = workItems.length
  const completed = workItems.filter((w) => w.status === "completed").length
  const inProg    = workItems.filter((w) => w.status === "in_progress").length
  const blocked   = workItems.filter((w) => w.status === "blocked").length
  const avgPct    = total ? Math.round(workItems.reduce((s, w) => s + w.completionPct, 0) / total) : 0

  const kpis = `
    <div class="kpi-row">
      <div class="kpi"><div class="val">${total}</div><div class="lbl">Total Items</div></div>
      <div class="kpi"><div class="val">${completed}</div><div class="lbl">Completed</div></div>
      <div class="kpi"><div class="val">${inProg}</div><div class="lbl">In Progress</div></div>
      <div class="kpi"><div class="val">${blocked}</div><div class="lbl">Blocked</div></div>
      <div class="kpi"><div class="val">${avgPct}%</div><div class="lbl">Avg. Completion</div></div>
      <div class="kpi"><div class="val">${sprints.length}</div><div class="lbl">Sprints</div></div>
    </div>`

  const wbsRows = workItems.map((w) => {
    const indent = w.wbsNumber.split(".").length - 1
    const pad    = "&nbsp;".repeat(indent * 4)
    return `<tr>
      <td>${w.wbsNumber}</td>
      <td>${pad}<strong>${w.title}</strong></td>
      <td>${w.type}</td>
      <td><span class="pill s-${w.status}">${labelStatus(w.status)}</span></td>
      <td><span class="pill p-${w.priority}">${w.priority}</span></td>
      <td>${userName(w.assigneeId)}</td>
      <td>${w.startDate}</td>
      <td>${w.endDate}</td>
      <td style="text-align:right">${w.estimatedHours ?? "—"}</td>
      <td>
        <div class="bar-wrap"><div class="bar-fill" style="width:${w.completionPct}%"></div></div>
        <span style="font-size:8pt;margin-left:5px">${w.completionPct}%</span>
      </td>
    </tr>`
  }).join("")

  const sprintRows = sprints.map((s) => {
    const items = workItems.filter((w) => w.sprintId === s.id)
    const done  = items.filter((w) => w.status === "completed").length
    const pct   = items.length ? Math.round((done / items.length) * 100) : 0
    return `<tr>
      <td><strong>${s.name}</strong></td>
      <td><span class="pill s-${s.status === "active" ? "in_progress" : s.status === "closed" ? "completed" : "not_started"}">${s.status}</span></td>
      <td>${s.startDate}</td>
      <td>${s.endDate}</td>
      <td style="text-align:right">${s.plannedPoints ?? "—"}</td>
      <td style="text-align:right">${s.completedPoints ?? "—"}</td>
      <td>${items.length} items &nbsp;·&nbsp; ${done} done &nbsp;·&nbsp; ${pct}%</td>
    </tr>`
  }).join("")

  const body = `
  <div class="cover">
    <div class="badge">Confidential · Slalom Consulting × Meridian Bank</div>
    <h1>Project Schedule Report</h1>
    <p style="color:#64748b;font-size:11pt;margin-top:6px">Meridian Bank Digital Banking Transformation</p>
    <div class="meta">
      <span><strong>Project</strong> MBK-CHARTER-2024-001</span>
      <span><strong>Exported</strong> ${TIMESTAMP()}</span>
      <span><strong>Work items</strong> ${total}</span>
      <span><strong>Sprints</strong> ${sprints.length}</span>
    </div>
  </div>

  <h2>1. Programme Summary</h2>
  ${kpis}

  <h2>2. Work Breakdown Structure</h2>
  <table>
    <thead><tr>
      <th>WBS #</th><th>Title</th><th>Type</th><th>Status</th><th>Priority</th>
      <th>Assignee</th><th>Start</th><th>End</th><th>Est.h</th><th>Progress</th>
    </tr></thead>
    <tbody>${wbsRows}</tbody>
  </table>

  <h2>3. Sprint Overview</h2>
  <table>
    <thead><tr>
      <th>Sprint</th><th>Status</th><th>Start</th><th>End</th>
      <th>Planned pts</th><th>Completed pts</th><th>Items</th>
    </tr></thead>
    <tbody>${sprintRows}</tbody>
  </table>`

  const html = buildHtml(body, "Project Schedule — Meridian Bank")
  const printable = html.replace(
    "</body>",
    `<script>window.onload = function(){ window.print(); }<\/script></body>`
  )
  const blob = new Blob([printable], { type: "text/html;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const tab  = window.open(url, "_blank")
  setTimeout(() => URL.revokeObjectURL(url), 3000)
  if (!tab) {
    const a = document.createElement("a")
    a.href = url; a.download = `meridian-bank-schedule-${DATE()}.html`
    a.style.display = "none"; document.body.appendChild(a); a.click()
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 150)
  }
}

// ─── Word export ──────────────────────────────────────────────────────────────
function exportWord(workItems: WorkItem[], sprints: Sprint[]) {
  const wbsRows = workItems.map((w) => {
    const indent = w.wbsNumber.split(".").length - 1
    const pad    = "&nbsp;".repeat(indent * 4)
    return `<tr>
      <td>${w.wbsNumber}</td>
      <td>${pad}${w.title}</td>
      <td>${w.type}</td>
      <td>${labelStatus(w.status)}</td>
      <td>${w.priority}</td>
      <td>${userName(w.assigneeId)}</td>
      <td>${w.startDate}</td>
      <td>${w.endDate}</td>
      <td>${w.estimatedHours ?? "—"}</td>
      <td>${w.completionPct}%</td>
    </tr>`
  }).join("")

  const sprintRows = sprints.map((s) => {
    const items = workItems.filter((w) => w.sprintId === s.id)
    const done  = items.filter((w) => w.status === "completed").length
    return `<tr>
      <td>${s.name}</td><td>${s.status}</td>
      <td>${s.startDate}</td><td>${s.endDate}</td>
      <td>${s.plannedPoints ?? "—"}</td><td>${s.completedPoints ?? "—"}</td>
      <td>${items.length}</td><td>${done}</td>
    </tr>`
  }).join("")

  const body = `
  <div class="cover">
    <div class="badge">Confidential · Slalom Consulting × Meridian Bank</div>
    <h1>Project Schedule</h1>
    <p style="color:#64748b;margin-top:6px">Meridian Bank Digital Banking Transformation</p>
    <div class="meta">
      <span><strong>Document ref:</strong> MBK-SCHEDULE-${DATE()}</span>
      <span><strong>Exported:</strong> ${TIMESTAMP()}</span>
      <span><strong>Total work items:</strong> ${workItems.length}</span>
    </div>
  </div>

  <h2>1. Work Breakdown Structure</h2>
  <table>
    <thead><tr>
      <th>WBS #</th><th>Title</th><th>Type</th><th>Status</th><th>Priority</th>
      <th>Assignee</th><th>Start</th><th>End</th><th>Est.h</th><th>%</th>
    </tr></thead>
    <tbody>${wbsRows}</tbody>
  </table>

  <h2>2. Sprint Summary</h2>
  <table>
    <thead><tr>
      <th>Sprint</th><th>Status</th><th>Start</th><th>End</th>
      <th>Planned pts</th><th>Completed pts</th><th>Items</th><th>Done</th>
    </tr></thead>
    <tbody>${sprintRows}</tbody>
  </table>`

  const html = buildHtml(body, "Project Schedule — Meridian Bank")
  // Word opens HTML files natively when served with .doc extension
  const blob = new Blob(["﻿" + html], { type: "application/msword;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = `meridian-bank-schedule-${DATE()}.doc`
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 150)
}

// ─── Dropdown component ───────────────────────────────────────────────────────
const FORMATS = [
  {
    id:    "excel" as const,
    label: "Excel Workbook",
    ext:   ".xlsx",
    desc:  "3 sheets: WBS, Sprints, Summary",
    icon:  FileSpreadsheet,
    color: "text-green-600",
    bg:    "bg-green-50 hover:bg-green-100",
  },
  {
    id:    "pdf" as const,
    label: "PDF Report",
    ext:   ".pdf",
    desc:  "Print-ready via browser Save as PDF",
    icon:  FileText,
    color: "text-red-600",
    bg:    "bg-red-50 hover:bg-red-100",
  },
  {
    id:    "word" as const,
    label: "Word Document",
    ext:   ".doc",
    desc:  "WBS + sprint table in Word format",
    icon:  FileType2,
    color: "text-blue-600",
    bg:    "bg-blue-50 hover:bg-blue-100",
  },
]

export function ExportDropdown() {
  const [open, setOpen]         = useState(false)
  const [loading, setLoading]   = useState<string | null>(null)
  const ref                     = useRef<HTMLDivElement>(null)

  const { workItems, sprints } = useScheduleStore.getState()
  const projectItems = workItems.filter((w) => w.projectId === "prj-001")
  const projectSprints = sprints.filter((s) => s.projectId === "prj-001")

  async function handleExport(formatId: "excel" | "pdf" | "word") {
    setLoading(formatId)
    setOpen(false)
    // Yield to the browser so the spinner renders before the (possibly blocking) export
    await new Promise((r) => setTimeout(r, 50))
    try {
      if (formatId === "excel") exportExcel(projectItems, projectSprints)
      if (formatId === "pdf")   exportPdf(projectItems, projectSprints)
      if (formatId === "word")  exportWord(projectItems, projectSprints)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
          open
            ? "bg-elevated border-sdp-red/40 text-sdp-red"
            : "bg-surface border-[var(--line)] text-ink-2 hover:border-sdp-red/30 hover:text-ink"
        )}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        Export
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <>
          {/* click-away */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-surface border border-[var(--line)] rounded-xl shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[var(--line)]">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3">Export Schedule</p>
            </div>
            <div className="p-2 space-y-1">
              {FORMATS.map((f) => {
                const Icon = f.icon
                return (
                  <button
                    key={f.id}
                    onClick={() => handleExport(f.id)}
                    disabled={loading !== null}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-colors disabled:opacity-50",
                      f.bg
                    )}
                  >
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-white/60 border border-white/80")}>
                      <Icon className={cn("h-4 w-4", f.color)} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink">{f.label} <span className="font-normal text-ink-3">{f.ext}</span></p>
                      <p className="text-[10px] text-ink-3 mt-0.5">{f.desc}</p>
                    </div>
                    {loading === f.id && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-3 ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
