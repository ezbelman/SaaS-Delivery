"use client"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useProjectDocuments, useDocumentStore, DOCUMENT_TYPE_META, DOCUMENT_STATUS_META } from "@/stores/documentStore"
import { useScheduleStore, useActiveSprint } from "@/stores/scheduleStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { DOCUMENT_TEMPLATES, ASSIGNEE_BY_ROLE } from "@/lib/mock-data/document-work-items"
import { Avatar } from "@/components/ui/avatar"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Landmark, FileText, ClipboardList, Cpu, BookOpen, GitPullRequest,
  Plus, Link as LinkIcon, Calendar, Upload, CloudUpload,
  Sparkles, Check, CheckCircle2, Loader2, X, LayoutList,
  Settings, RotateCcw, AlertTriangle, Download,
} from "lucide-react"
import { format, addDays } from "date-fns"
import type { DocumentType } from "@/lib/types"

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_COMPONENTS: Record<DocumentType, React.ElementType> = {
  charter:        Landmark,
  sow:            FileText,
  prd:            ClipboardList,
  architecture:   Cpu,
  meeting_notes:  BookOpen,
  change_request: GitPullRequest,
}

const TYPE_FILTERS = [
  { value: "all",            label: "All" },
  { value: "charter",        label: "Charter" },
  { value: "sow",            label: "SOW" },
  { value: "prd",            label: "PRD" },
  { value: "architecture",   label: "Architecture" },
  { value: "meeting_notes",  label: "Meeting Notes" },
  { value: "change_request", label: "Change Request" },
] as const

const NEW_DOC_TYPES: { type: DocumentType; label: string }[] = [
  { type: "charter",        label: "Project Charter" },
  { type: "sow",            label: "Statement of Work" },
  { type: "prd",            label: "PRD" },
  { type: "architecture",   label: "Architecture Doc" },
  { type: "meeting_notes",  label: "Meeting Notes" },
  { type: "change_request", label: "Change Request" },
]

const ACCEPTED_EXTS = ["html", "htm", "txt", "md"]

// ─── File → HTML converters ────────────────────────────────────────────────────
function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g,   "<strong>$1</strong>")
    .replace(/__(.+?)__/g,        "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,       "<em>$1</em>")
    .replace(/_(.+?)_/g,         "<em>$1</em>")
    .replace(/`(.+?)`/g,         "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
}
function markdownToHtml(md: string): string {
  const lines = md.split("\n")
  const out: string[] = []
  let inList = false; let listType: "ul" | "ol" | null = null
  function closeList() {
    if (inList) { out.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false; listType = null }
  }
  for (const raw of lines) {
    const line = raw.trimEnd()
    if (line.startsWith("### ")) { closeList(); out.push(`<h3>${escapeHtml(line.slice(4))}</h3>`); continue }
    if (line.startsWith("## "))  { closeList(); out.push(`<h2>${escapeHtml(line.slice(3))}</h2>`); continue }
    if (line.startsWith("# "))   { closeList(); out.push(`<h1>${escapeHtml(line.slice(2))}</h1>`); continue }
    const ulMatch = line.match(/^[-*+]\s+(.+)/)
    if (ulMatch) { if (!inList || listType !== "ul") { closeList(); out.push("<ul>"); inList = true; listType = "ul" } out.push(`<li>${inlineFormat(ulMatch[1])}</li>`); continue }
    const olMatch = line.match(/^\d+\.\s+(.+)/)
    if (olMatch) { if (!inList || listType !== "ol") { closeList(); out.push("<ol>"); inList = true; listType = "ol" } out.push(`<li>${inlineFormat(olMatch[1])}</li>`); continue }
    if (line.trim() === "") { closeList(); continue }
    closeList(); out.push(`<p>${inlineFormat(line)}</p>`)
  }
  closeList(); return out.join("\n")
}
function txtToHtml(text: string): string {
  return text.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => `<p>${escapeHtml(l)}</p>`).join("\n")
}
function detectType(fileName: string): DocumentType {
  const l = fileName.toLowerCase()
  if (l.includes("charter"))                                   return "charter"
  if (l.includes("sow") || l.includes("statement"))           return "sow"
  if (l.includes("arch") || l.includes("adr") || l.includes("design")) return "architecture"
  if (l.includes("meeting") || l.includes("notes") || l.includes("minutes")) return "meeting_notes"
  if (l.includes("change") || l.includes("cr-"))              return "change_request"
  return "prd"
}

// ─── Work item generation (module-level, uses store directly) ─────────────────
function generateWorkItemsFromDoc(docType: DocumentType, sprintId?: string): void {
  const { workItems, addWorkItem } = useScheduleStore.getState()
  const template = DOCUMENT_TEMPLATES[docType]
  const today    = new Date()

  const topLevel = workItems.filter((i) => i.projectId === "prj-001" && !i.parentId)
  const maxWbs   = topLevel.reduce((m, i) => {
    const n = parseInt(i.wbsNumber?.split(".")[0] ?? "0")
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  const epicWbs = maxWbs + 1
  const basePos = workItems.filter((i) => i.projectId === "prj-001").length

  // Compute epic progress from children templates
  const trackable  = template.items.filter((t) => t.type !== "milestone" && t.type !== "deliverable")
  const avgPct     = trackable.length
    ? Math.round(trackable.reduce((s, t) => s + (t.completionPct ?? 0), 0) / trackable.length)
    : 0
  const anyDone    = trackable.some((t) => (t.completionPct ?? 0) > 0)
  const epicStatus = avgPct === 100 ? "completed" : anyDone ? "in_progress" : "not_started"

  const epic = addWorkItem({
    projectId:     "prj-001",
    wbsNumber:     String(epicWbs),
    title:         template.epic,
    type:          "epic",
    status:        epicStatus,
    priority:      "high",
    startDate:     format(addDays(today, Math.min(...template.items.map((t) => t.daysOffset))), "yyyy-MM-dd"),
    endDate:       format(addDays(today, Math.max(...template.items.map((t) => t.daysOffset + t.durationDays))), "yyyy-MM-dd"),
    completionPct: avgPct,
    dependencies:  [],
    position:      basePos,
    sprintId,
  })

  template.items.forEach((tmpl, idx) => {
    addWorkItem({
      projectId:      "prj-001",
      parentId:       epic.id,
      wbsNumber:      `${epicWbs}.${idx + 1}`,
      title:          tmpl.title,
      type:           tmpl.type,
      status:         tmpl.status ?? "not_started",
      priority:       tmpl.priority,
      assigneeId:     tmpl.assigneeRole ? ASSIGNEE_BY_ROLE[tmpl.assigneeRole] : undefined,
      startDate:      format(addDays(today, tmpl.daysOffset), "yyyy-MM-dd"),
      endDate:        format(addDays(today, tmpl.daysOffset + tmpl.durationDays), "yyyy-MM-dd"),
      estimatedHours: tmpl.estimatedHours,
      actualHours:    tmpl.actualHours,
      storyPoints:    tmpl.storyPoints,
      completionPct:  tmpl.completionPct ?? 0,
      dependencies:   [],
      position:       basePos + idx + 1,
      sprintId:       tmpl.type !== "milestone" && tmpl.type !== "deliverable" ? sprintId : undefined,
    })
  })
}

// ─── Analysis overlay ──────────────────────────────────────────────────────────
interface ProgressLine { text: string; done: boolean }

type AnalysisPhase = "idle" | "analyzing" | "done"
interface AnalysisState {
  phase: AnalysisPhase
  fileName: string
  docId: string
  docType: DocumentType
  count: number
  breakdown: string     // e.g. "1 Epic · 4 Tasks · 1 Milestone"
  lines: ProgressLine[]
}
const IDLE: AnalysisState = {
  phase: "idle", fileName: "", docId: "", docType: "prd", count: 0, breakdown: "", lines: [],
}

function buildBreakdown(docType: DocumentType): string {
  const template = DOCUMENT_TEMPLATES[docType]
  const counts: Record<string, number> = { epic: 1 }
  for (const item of template.items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([type, n]) => `${n} ${type.charAt(0).toUpperCase() + type.slice(1)}${n > 1 && !type.endsWith("e") ? "s" : ""}`)
    .join(" · ")
}

function AnalysisOverlay({
  analysis,
  onClose,
  onOpenDoc,
  onViewSchedule,
}: {
  analysis: AnalysisState
  onClose: () => void
  onOpenDoc: () => void
  onViewSchedule: () => void
}) {
  const isDone = analysis.phase === "done"
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-[var(--line)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className={cn(
          "flex items-center gap-4 px-6 py-5 border-b border-[var(--line)] transition-colors duration-700",
          isDone ? "bg-success/5" : "bg-sdp-red/5"
        )}>
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500",
            isDone ? "bg-success/15" : "bg-sdp-red/10"
          )}>
            {isDone
              ? <CheckCircle2 className="h-6 w-6 text-success" />
              : <Sparkles className="h-6 w-6 text-sdp-red animate-pulse" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink">
              {isDone ? "Analysis Complete" : "AI Analyzing Document"}
            </p>
            <p className="text-[11px] text-ink-3 mt-0.5 truncate">{analysis.fileName}</p>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-lg text-ink-3 hover:text-ink hover:bg-elevated transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress lines */}
        <div className="px-6 py-5 space-y-3.5">
          {analysis.lines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                {line.done
                  ? <div className="h-5 w-5 rounded-full bg-success/15 flex items-center justify-center">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                  : <Loader2 className="h-4 w-4 text-ink-3 animate-spin" />
                }
              </div>
              <p className={cn(
                "text-xs transition-colors duration-300 leading-snug",
                line.done ? "text-ink" : "text-ink-3"
              )}>
                {line.text}
              </p>
            </div>
          ))}
        </div>

        {/* Done: summary card + views list + actions */}
        {isDone && (
          <div className="px-6 pb-6 space-y-4">
            {/* Stats */}
            <div className="bg-elevated border border-[var(--line)] rounded-xl p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-sdp-red/10 flex items-center justify-center shrink-0">
                <LayoutList className="h-6 w-6 text-sdp-red" />
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">{analysis.count} work items</p>
                <p className="text-[11px] text-ink-3 mt-0.5">{analysis.breakdown}</p>
              </div>
            </div>

            {/* Visible-in chips */}
            <div className="flex flex-wrap gap-1.5">
              {["WBS Tree", "Gantt Timeline", "Kanban Board", "Resource View", "Developer"].map((v) => (
                <span key={v} className="flex items-center gap-1 text-[10px] font-medium bg-elevated border border-[var(--line)] px-2 py-1 rounded-full text-ink-2">
                  <Check className="h-2.5 w-2.5 text-success shrink-0" />
                  {v}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={onViewSchedule}>
                View in Schedule
              </Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={onOpenDoc}>
                Open Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
interface DocumentGalleryProps {
  onSelect: (id: string) => void
}

export function DocumentGallery({ onSelect }: DocumentGalleryProps) {
  const docs             = useProjectDocuments("prj-001")
  const addDocument      = useDocumentStore((s) => s.addDocument)
  const resetDocuments   = useDocumentStore((s) => s.reset)
  const resetSchedule    = useScheduleStore((s) => s.reset)
  const activeSprint     = useActiveSprint("prj-001")
  const router           = useRouter()

  const [filter, setFilter]           = useState<string>("all")
  const [showNewMenu, setShowNewMenu]  = useState(false)
  const [isDragging, setIsDragging]   = useState(false)
  const [analysis, setAnalysis]       = useState<AnalysisState>(IDLE)
  const [showSettings, setShowSettings] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const filtered     = filter === "all" ? docs : docs.filter((d) => d.type === filter)

  // ── Template creation ──────────────────────────────────────────────────────
  function handleNew(type: DocumentType) {
    const meta = DOCUMENT_TYPE_META[type]
    const doc  = addDocument({
      projectId:       "prj-001",
      type,
      title:           `New ${meta.label}`,
      status:          "draft",
      content:         `<h1>${meta.label}</h1><p>Start writing your document here...</p>`,
      version:         "0.1",
      authorId:        "usr-001",
      reviewers:       [],
      linkedWorkItems: [],
      source:          "template",
    })
    setShowNewMenu(false)
    onSelect(doc.id)
  }

  // ── Analysis simulation ────────────────────────────────────────────────────
  function startAnalysis(fileName: string, docId: string, docType: DocumentType) {
    const template   = DOCUMENT_TEMPLATES[docType]
    const count      = template.items.length + 1
    const typeMeta   = DOCUMENT_TYPE_META[docType]
    const sprintId   = activeSprint?.id

    const lines: ProgressLine[] = [
      { text: "Parsing document structure...",                               done: false },
      { text: `Detected: ${typeMeta.label} document`,                        done: false },
      { text: "Extracting deliverables and work breakdown items...",          done: false },
      { text: "Mapping to WBS, Gantt, Kanban, Resource & Developer views...", done: false },
      { text: `Creating ${count} work items...`,                             done: false },
    ]

    setAnalysis({
      phase: "analyzing", fileName, docId, docType,
      count, breakdown: buildBreakdown(docType), lines,
    })

    // Stagger each line completion
    const delays = [0, 750, 1400, 2050, 2650]
    delays.forEach((delay, idx) => {
      setTimeout(() => {
        setAnalysis((prev) =>
          prev.phase === "idle" ? prev : {
            ...prev,
            lines: prev.lines.map((l, i) => (i === idx ? { ...l, done: true } : l)),
          }
        )
      }, delay)
    })

    // Generate actual work items and flip to done
    setTimeout(() => {
      generateWorkItemsFromDoc(docType, sprintId)
      setAnalysis((prev) => (prev.phase === "idle" ? prev : { ...prev, phase: "done" }))
    }, 3100)
  }

  // ── File processing ────────────────────────────────────────────────────────
  function processFiles(files: FileList | File[]) {
    const validFiles = Array.from(files).filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? ""
      return ACCEPTED_EXTS.includes(ext)
    })
    if (validFiles.length === 0) return

    validFiles.forEach((file, fileIdx) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const raw = (e.target?.result as string) ?? ""
        const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
        let content = raw
        if (ext === "txt") content = txtToHtml(raw)
        if (ext === "md")  content = markdownToHtml(raw)

        const docType    = detectType(file.name)
        const titleGuess = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")

        const doc = addDocument({
          projectId:       "prj-001",
          type:            docType,
          title:           titleGuess,
          status:          "draft",
          content,
          version:         "1.0",
          authorId:        "usr-001",
          reviewers:       [],
          linkedWorkItems: [],
          source:          "uploaded",
          fileName:        file.name,
        })

        // Only animate analysis for the first file; open others silently
        if (fileIdx === 0) {
          startAnalysis(file.name, doc.id, docType)
        }
      }
      reader.readAsText(file)
    })
  }

  // ── Drag-and-drop ─────────────────────────────────────────────────────────
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(true)
  }
  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files)
  }

  // ── Overlay actions ────────────────────────────────────────────────────────
  function handleCloseOverlay() { setAnalysis(IDLE) }
  function handleOpenDoc()      { onSelect(analysis.docId); setAnalysis(IDLE) }
  function handleViewSchedule() { router.push("/schedule");  setAnalysis(IDLE) }

  // ── Demo reset ─────────────────────────────────────────────────────────────
  function handleResetClick() {
    if (!confirmReset) {
      setConfirmReset(true)
      confirmTimerRef.current = setTimeout(() => setConfirmReset(false), 4000)
    } else {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
      resetSchedule()
      resetDocuments()
      setConfirmReset(false)
      setShowSettings(false)
    }
  }

  // ── Download all documents ─────────────────────────────────────────────────
  function handleDownloadAll() {
    const html = [
      `<!DOCTYPE html>`,
      `<html lang="en">`,
      `<head>`,
      `<meta charset="UTF-8">`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
      `<title>Meridian Bank — Project Document Pack</title>`,
      `<style>`,
      `  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 960px; margin: 0 auto; padding: 40px 24px; color: #0f172a; line-height: 1.6; }`,
      `  h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.25rem; }`,
      `  h2 { font-size: 1.35rem; font-weight: 600; margin-top: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.4rem; }`,
      `  h3 { font-size: 1.05rem; font-weight: 600; margin-top: 1.5rem; }`,
      `  h4 { font-size: 0.95rem; font-weight: 600; margin-top: 1.25rem; }`,
      `  table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.82rem; }`,
      `  th, td { border: 1px solid #e2e8f0; padding: 7px 11px; text-align: left; vertical-align: top; }`,
      `  th { background: #f8fafc; font-weight: 600; }`,
      `  ul, ol { padding-left: 1.5rem; margin: 0.5rem 0; }`,
      `  li { margin: 0.2rem 0; }`,
      `  p { margin: 0.65rem 0; }`,
      `  hr { border: none; border-top: 1px solid #e2e8f0; margin: 2rem 0; }`,
      `  code { background: #f1f5f9; padding: 2px 5px; border-radius: 4px; font-size: 0.8rem; font-family: monospace; }`,
      `  a { color: #2563eb; }`,
      `  .cover { text-align: center; padding: 64px 0 48px; border-bottom: 3px solid #e2e8f0; margin-bottom: 3rem; }`,
      `  .badge { display: inline-block; background: #fff1f2; color: #e11d48; padding: 4px 14px; border-radius: 999px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 1.25rem; }`,
      `  .cover p { color: #64748b; font-size: 0.92rem; margin-top: 0.75rem; }`,
      `  .toc { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 22px 26px; margin-bottom: 3rem; }`,
      `  .toc h2 { margin-top: 0; border: none; padding: 0 0 0.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; }`,
      `  .toc-item { display: flex; align-items: baseline; gap: 0.5rem; padding: 5px 0; border-bottom: 1px dashed #e2e8f0; font-size: 0.88rem; }`,
      `  .toc-item:last-child { border-bottom: none; }`,
      `  .toc-item a { text-decoration: none; color: #0f172a; font-weight: 500; }`,
      `  .toc-item a:hover { color: #e11d48; }`,
      `  .toc-item .toc-type { color: #94a3b8; font-size: 0.75rem; margin-left: auto; white-space: nowrap; }`,
      `  .doc-section { margin-bottom: 5rem; }`,
      `  .doc-header { display: flex; align-items: flex-start; gap: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px; margin-bottom: 1.75rem; }`,
      `  .doc-type-badge { display: inline-block; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 999px; background: #e2e8f0; color: #475569; }`,
      `  .doc-meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 6px 16px; margin-top: 8px; }`,
      `  .doc-meta-item { font-size: 0.75rem; color: #64748b; }`,
      `  .doc-meta-item strong { color: #334155; }`,
      `  .doc-divider { border: none; border-top: 3px solid #e2e8f0; margin: 4rem 0; }`,
      `  @media print {`,
      `    .doc-section { page-break-before: always; }`,
      `    .cover, .toc { page-break-after: always; }`,
      `    .doc-header { background: none; border: 1px solid #ccc; }`,
      `  }`,
      `</style>`,
      `</head>`,
      `<body>`,
      // Cover page
      `<div class="cover">`,
      `<div class="badge">Confidential · Slalom Consulting × Meridian Bank</div>`,
      `<h1>Meridian Bank Digital Banking Transformation</h1>`,
      `<h2 style="border:none;font-size:1.1rem;font-weight:400;color:#475569;margin-top:0.25rem;">Project Document Pack</h2>`,
      `<p>${docs.length} document${docs.length !== 1 ? "s" : ""} &nbsp;·&nbsp; Exported ${format(new Date(), "MMMM d, yyyy 'at' HH:mm")}</p>`,
      `<p style="font-size:0.8rem;color:#94a3b8;">Generated by Slalom Delivery Platform &nbsp;·&nbsp; Engagement: MBK-CHARTER-2024-001</p>`,
      `</div>`,
      // Table of contents
      `<div class="toc">`,
      `<h2>Table of Contents</h2>`,
      ...docs.map((doc, i) => {
        const meta = DOCUMENT_TYPE_META[doc.type]
        const status = DOCUMENT_STATUS_META[doc.status]
        return [
          `<div class="toc-item">`,
          `<span style="color:#94a3b8;font-weight:600;min-width:1.5rem;">${i + 1}.</span>`,
          `<a href="#doc-${doc.id}">${doc.title}</a>`,
          `<span class="toc-type">${meta.label} · v${doc.version} · ${status.label}</span>`,
          `</div>`,
        ].join("")
      }),
      `</div>`,
      // Documents
      ...docs.map((doc, i) => {
        const meta   = DOCUMENT_TYPE_META[doc.type]
        const status = DOCUMENT_STATUS_META[doc.status]
        const author = MOCK_USERS.find((u) => u.id === doc.authorId)
        const reviewerNames = doc.reviewers
          .map((id) => MOCK_USERS.find((u) => u.id === id)?.name)
          .filter(Boolean).join(", ")
        return [
          `${i > 0 ? '<hr class="doc-divider">' : ""}`,
          `<div class="doc-section" id="doc-${doc.id}">`,
          `<div class="doc-header">`,
          `<div style="flex:1;">`,
          `<span class="doc-type-badge">${meta.label}</span>`,
          `<div class="doc-meta-grid" style="margin-top:10px;">`,
          `<div class="doc-meta-item"><strong>Version</strong> ${doc.version}</div>`,
          `<div class="doc-meta-item"><strong>Status</strong> ${status.label}</div>`,
          `<div class="doc-meta-item"><strong>Author</strong> ${author?.name ?? "Unknown"}</div>`,
          reviewerNames ? `<div class="doc-meta-item"><strong>Reviewers</strong> ${reviewerNames}</div>` : "",
          `<div class="doc-meta-item"><strong>Updated</strong> ${format(new Date(doc.updatedAt), "MMM d, yyyy")}</div>`,
          doc.linkedWorkItems.length > 0 ? `<div class="doc-meta-item"><strong>Linked items</strong> ${doc.linkedWorkItems.length}</div>` : "",
          `</div>`,
          `</div>`,
          `</div>`,
          doc.content,
          `</div>`,
        ].join("\n")
      }),
      `</body>`,
      `</html>`,
    ].join("\n")

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `meridian-bank-documents-${format(new Date(), "yyyy-MM-dd")}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Project Documents"
        subtitle="Meridian Bank — Digital Banking Transformation"
        breadcrumb={[{ label: "Delivery" }, { label: "Project Documents" }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Download all button */}
            <Button variant="outline" size="sm" onClick={handleDownloadAll} title="Download all documents as a single HTML file">
              <Download className="h-3.5 w-3.5" /> Download All
            </Button>

            {/* Upload button */}
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-3.5 w-3.5" /> Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,.txt,.md"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) processFiles(e.target.files); e.target.value = "" }}
            />

            {/* New Document dropdown */}
            <div className="relative">
              <Button variant="primary" size="sm" onClick={() => setShowNewMenu((v) => !v)}>
                <Plus className="h-3.5 w-3.5" /> New Document
              </Button>
              {showNewMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-[var(--line)] rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                  {NEW_DOC_TYPES.map((item) => {
                    const Icon = ICON_COMPONENTS[item.type]
                    const meta = DOCUMENT_TYPE_META[item.type]
                    return (
                      <button
                        key={item.type}
                        onClick={() => handleNew(item.type)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ink-2 hover:bg-elevated hover:text-ink transition-colors"
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", meta.color)} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* Gallery content with drag-drop zone */}
      <div
        className="flex-1 overflow-auto p-6 space-y-6 relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-surface/90 border-2 border-dashed border-sdp-red rounded-xl pointer-events-none">
            <CloudUpload className="h-14 w-14 text-sdp-red" />
            <div className="text-center">
              <p className="text-base font-semibold text-ink">Drop documents to upload</p>
              <p className="text-sm text-ink-3 mt-1">Supports .html · .txt · .md — work items auto-generated</p>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === f.value
                  ? "bg-sdp-red text-white"
                  : "text-ink-2 hover:bg-elevated hover:text-ink border border-[var(--line)]"
              )}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 opacity-60">
                  {docs.filter((d) => d.type === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="h-12 w-12 text-ink-3 mb-4" />
            <p className="text-ink-2 font-medium">No documents yet</p>
            <p className="text-sm text-ink-3 mt-1">
              Click <span className="font-medium text-ink">"New Document"</span> to create from a template, or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="underline text-sdp-red hover:text-sdp-red/80 transition-colors"
              >
                upload a file
              </button>{" "}
              to auto-generate work items.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((doc) => {
              const meta   = DOCUMENT_TYPE_META[doc.type]
              const status = DOCUMENT_STATUS_META[doc.status]
              const author = MOCK_USERS.find((u) => u.id === doc.authorId)
              const Icon   = ICON_COMPONENTS[doc.type]

              return (
                <button
                  key={doc.id}
                  onClick={() => onSelect(doc.id)}
                  className="group text-left bg-surface border border-[var(--line)] rounded-xl overflow-hidden hover:border-sdp-red/30 hover:shadow-lg hover:shadow-sdp-red/5 transition-all duration-200"
                >
                  {/* Coloured header strip */}
                  <div className={cn("flex items-center gap-3 px-5 py-4", meta.bg)}>
                    <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", meta.bg)}>
                      <Icon className={cn("h-5 w-5", meta.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[10px] font-semibold uppercase tracking-wider", meta.color)}>{meta.label}</p>
                      <p className="text-[10px] text-ink-3 mt-0.5">v{doc.version}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {doc.source === "uploaded" && (
                        <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-ink-3 bg-surface/60 px-1.5 py-0.5 rounded">
                          <Upload className="h-2.5 w-2.5" /> Uploaded
                        </span>
                      )}
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", status.color)}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 py-4 space-y-3">
                    <p className="text-sm font-semibold text-ink leading-snug group-hover:text-sdp-red transition-colors line-clamp-2">
                      {doc.title}
                    </p>
                    {doc.fileName && (
                      <p className="text-[10px] text-ink-3 truncate" title={doc.fileName}>{doc.fileName}</p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-ink-3">
                      <div className="flex items-center gap-1.5">
                        {author && <Avatar name={author.name} size="xs" />}
                        <span>{author?.name ?? "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(doc.updatedAt), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    {doc.linkedWorkItems.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-ink-3">
                        <LinkIcon className="h-3 w-3 shrink-0" />
                        <span>{doc.linkedWorkItems.length} linked work item{doc.linkedWorkItems.length > 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Click-away to close new menu */}
      {showNewMenu && <div className="fixed inset-0 z-40" onClick={() => setShowNewMenu(false)} />}

      {/* AI Analysis overlay */}
      {analysis.phase !== "idle" && (
        <AnalysisOverlay
          analysis={analysis}
          onClose={handleCloseOverlay}
          onOpenDoc={handleOpenDoc}
          onViewSchedule={handleViewSchedule}
        />
      )}

      {/* Settings / Presentation reset bar */}
      <div className="shrink-0 border-t border-[var(--line)]">
        {/* Toggle row */}
        <button
          onClick={() => { setShowSettings((v) => !v); setConfirmReset(false) }}
          className="w-full flex items-center gap-2.5 px-6 py-2.5 text-xs text-ink-3 hover:text-ink hover:bg-elevated transition-colors"
        >
          <Settings className={cn("h-3.5 w-3.5 transition-transform duration-300", showSettings && "rotate-45")} />
          <span className="font-medium">Settings</span>
          <span className="ml-auto text-[10px] opacity-50">{showSettings ? "▲" : "▼"}</span>
        </button>

        {/* Expandable panel */}
        {showSettings && (
          <div className="px-6 pb-5 pt-1 bg-elevated border-t border-[var(--line)] space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3">Presentation Controls</p>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink">Reset Demo State</p>
                <p className="text-[11px] text-ink-3 mt-0.5 leading-relaxed">
                  Restores all project schedule data (WBS, Gantt, Kanban, Resource & Developer views) and
                  documents back to the original demo dataset. Use this before each presentation.
                </p>
              </div>
              <button
                onClick={handleResetClick}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all duration-200 border",
                  confirmReset
                    ? "bg-danger/10 border-danger/30 text-danger animate-pulse"
                    : "bg-surface border-[var(--line)] text-ink-2 hover:border-sdp-red/40 hover:text-sdp-red"
                )}
              >
                {confirmReset
                  ? <><AlertTriangle className="h-3.5 w-3.5" /> Confirm reset</>
                  : <><RotateCcw className="h-3.5 w-3.5" /> Reset all</>
                }
              </button>
            </div>
            {confirmReset && (
              <p className="text-[10px] text-danger/80">
                This will remove all uploaded documents and generated work items. Click "Confirm reset" again to proceed, or wait 4 s to cancel.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
