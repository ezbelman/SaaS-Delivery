"use client"
import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useScheduleStore, useSprints } from "@/stores/scheduleStore"
import { useProjectDocuments, useDocumentStore, DOCUMENT_TYPE_META, DOCUMENT_STATUS_META } from "@/stores/documentStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import {
  Layers, Boxes, BookOpen, CheckSquare, Diamond, Flag, Target,
  ChevronRight, ChevronLeft, Check, Landmark, FileText, ClipboardList, Cpu,
  Link as LinkIcon,
} from "lucide-react"
import type { WorkItemType, WorkItemStatus, Priority, WorkItem } from "@/lib/types"

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

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Basics",   desc: "Title, type & priority" },
  { id: 2, label: "Timeline", desc: "Dates & estimation" },
  { id: 3, label: "Team",     desc: "Assignee, sprint & dependencies" },
  { id: 4, label: "Documents","desc": "Link to project artefacts" },
] as const

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

const PRIORITIES: { value: Priority; label: string; color: string; bg: string }[] = [
  { value: "critical", label: "Critical", color: "text-danger",  bg: "bg-danger/10 border-danger/30" },
  { value: "high",     label: "High",     color: "text-warning", bg: "bg-warning/10 border-warning/30" },
  { value: "medium",   label: "Medium",   color: "text-info",    bg: "bg-info/10 border-info/30" },
  { value: "low",      label: "Low",      color: "text-ink-3",   bg: "bg-elevated border-[var(--line)]" },
]

// ─── Field label ──────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-1.5">{children}</p>
  )
}

function FieldInput({
  value, onChange, placeholder, type = "text",
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-elevated border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none focus:border-sdp-red/40 transition-colors"
    />
  )
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all",
              current === step.id
                ? "bg-sdp-red border-sdp-red text-white"
                : current > step.id
                ? "bg-success/10 border-success text-success"
                : "bg-elevated border-[var(--line)] text-ink-3"
            )}>
              {current > step.id ? <Check className="h-3.5 w-3.5" /> : step.id}
            </div>
            <span className={cn(
              "text-[9px] font-medium whitespace-nowrap",
              current === step.id ? "text-ink" : "text-ink-3"
            )}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              "h-px flex-1 mx-1 mt-[-10px] transition-all",
              current > step.id ? "bg-success/40" : "bg-[var(--line)]"
            )} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────
interface WorkItemWizardProps {
  open: boolean
  onClose: () => void
  projectId: string
  sprintId?: string
  defaultType?: WorkItemType
}

export function WorkItemWizard({ open, onClose, projectId, sprintId, defaultType = "task" }: WorkItemWizardProps) {
  const { workItems, addWorkItem } = useScheduleStore()
  const sprints      = useSprints(projectId)
  const documents    = useProjectDocuments(projectId)
  const linkWorkItem = useDocumentStore((s) => s.linkWorkItem)

  const [step, setStep]   = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Step 1 — Basics
  const [title, setTitle]         = useState("")
  const [type, setType]           = useState<WorkItemType>(defaultType)
  const [priority, setPriority]   = useState<Priority>("medium")
  const [description, setDesc]    = useState("")

  // Step 2 — Timeline
  const [startDate, setStart]     = useState("")
  const [endDate, setEnd]         = useState("")
  const [estHours, setHours]      = useState("")
  const [storyPts, setPoints]     = useState("")
  const [completion, setCompletion] = useState("0")

  // Step 3 — Team
  const [assigneeId, setAssignee] = useState("")
  const [selectedSprintId, setSprint] = useState(sprintId ?? "")
  const [parentId, setParent]     = useState("")
  const [deps, setDeps]           = useState<string[]>([])

  // Step 4 — Link docs
  const [linkedDocId, setLinkedDoc] = useState("")

  const teamMembers = MOCK_USERS.filter((u) =>
    ["program_manager", "project_manager", "scrum_master", "team_member"].includes(u.role)
  )

  const potentialParents = workItems
    .filter((i) => i.projectId === projectId && ["phase", "stream", "epic"].includes(i.type))

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {}
    if (s === 1 && !title.trim()) errs.title = "Title is required"
    if (s === 2 && !startDate) errs.startDate = "Start date is required"
    if (s === 2 && !endDate) errs.endDate = "End date is required"
    if (s === 2 && startDate && endDate && endDate < startDate) errs.endDate = "End must be after start date"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function next() {
    if (!validateStep(step)) return
    setStep((s) => Math.min(s + 1, 4))
  }
  function back() { setStep((s) => Math.max(s - 1, 1)) }

  function handleCreate() {
    if (!validateStep(step)) return
    const wbsNumber = generateWbsNumber(workItems, parentId || undefined, projectId)
    const item = addWorkItem({
      projectId,
      wbsNumber,
      parentId:       parentId || undefined,
      title:          title.trim(),
      description:    description || undefined,
      type,
      status:         "not_started" as WorkItemStatus,
      priority,
      assigneeId:     assigneeId || undefined,
      startDate:      startDate || new Date().toISOString().split("T")[0],
      endDate:        endDate   || new Date().toISOString().split("T")[0],
      estimatedHours: estHours  ? parseFloat(estHours) : undefined,
      storyPoints:    storyPts  ? parseInt(storyPts)   : undefined,
      completionPct:  parseInt(completion) || 0,
      sprintId:       selectedSprintId || undefined,
      dependencies:   deps,
      position:       workItems.filter((i) => i.projectId === projectId).length,
    })
    if (linkedDocId && item) {
      linkWorkItem(linkedDocId, item.id)
    }
    handleClose()
  }

  function handleClose() {
    setStep(1); setTitle(""); setType(defaultType); setPriority("medium"); setDesc("")
    setStart(""); setEnd(""); setHours(""); setPoints(""); setCompletion("0")
    setAssignee(""); setSprint(sprintId ?? ""); setParent(""); setDeps([])
    setLinkedDoc(""); setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Work Item</DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4 pb-2">
          <StepIndicator current={step} />

          {/* ── Step 1: Basics ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <FieldLabel>Title *</FieldLabel>
                <FieldInput
                  value={title}
                  onChange={setTitle}
                  placeholder="e.g. Implement biometric authentication for iOS"
                />
                {errors.title && <p className="text-danger text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <FieldLabel>Type</FieldLabel>
                <div className="grid grid-cols-4 gap-2">
                  {TYPE_OPTIONS.map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      onClick={() => setType(value)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all",
                        type === value
                          ? "border-sdp-red/50 bg-sdp-red/5 text-sdp-red"
                          : "border-[var(--line)] text-ink-2 hover:bg-elevated hover:text-ink"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", type === value ? "text-sdp-red" : color)} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Priority</FieldLabel>
                <div className="flex gap-2">
                  {PRIORITIES.map(({ value, label, color, bg }) => (
                    <button
                      key={value}
                      onClick={() => setPriority(value)}
                      className={cn(
                        "flex-1 py-2 rounded-lg border text-xs font-medium transition-all",
                        priority === value ? cn(bg, color) : "border-[var(--line)] text-ink-3 hover:bg-elevated"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Optional: describe the work item, acceptance criteria, or context…"
                  className="w-full bg-elevated border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3 outline-none focus:border-sdp-red/40 resize-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Timeline ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Start Date *</FieldLabel>
                  <FieldInput type="date" value={startDate} onChange={setStart} />
                  {errors.startDate && <p className="text-danger text-xs mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <FieldLabel>End Date *</FieldLabel>
                  <FieldInput type="date" value={endDate} onChange={setEnd} />
                  {errors.endDate && <p className="text-danger text-xs mt-1">{errors.endDate}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel>Estimated Hours</FieldLabel>
                  <FieldInput type="number" value={estHours} onChange={setHours} placeholder="e.g. 16" />
                </div>
                <div>
                  <FieldLabel>Story Points</FieldLabel>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1, 2, 3, 5, 8, 13, 21].map((pt) => (
                      <button
                        key={pt}
                        onClick={() => setPoints(String(pt))}
                        className={cn(
                          "h-8 w-9 rounded-lg border text-xs font-medium transition-all",
                          storyPts === String(pt)
                            ? "bg-sdp-red text-white border-sdp-red"
                            : "border-[var(--line)] text-ink-2 hover:bg-elevated"
                        )}
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Initial Completion % — {completion}%</FieldLabel>
                <input
                  type="range" min={0} max={100} step={5}
                  value={completion}
                  onChange={(e) => setCompletion(e.target.value)}
                  className="w-full accent-sdp-red"
                />
                <div className="flex justify-between text-[10px] text-ink-3 mt-1">
                  <span>0%</span><span>50%</span><span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Team ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <FieldLabel>Assignee</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAssignee("")}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs transition-all",
                      !assigneeId ? "border-sdp-red/40 bg-sdp-red/5 text-sdp-red" : "border-[var(--line)] text-ink-3 hover:bg-elevated"
                    )}
                  >
                    <div className="h-7 w-7 rounded-full bg-elevated flex items-center justify-center text-[10px] font-bold text-ink-3">?</div>
                    Unassigned
                  </button>
                  {teamMembers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setAssignee(u.id)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-xs transition-all",
                        assigneeId === u.id ? "border-sdp-red/40 bg-sdp-red/5" : "border-[var(--line)] hover:bg-elevated"
                      )}
                    >
                      <Avatar name={u.name} size="sm" />
                      <span className={cn("text-[10px] font-medium truncate max-w-full px-1", assigneeId === u.id ? "text-sdp-red" : "text-ink-2")}>
                        {u.name.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel>Sprint</FieldLabel>
                <select
                  value={selectedSprintId}
                  onChange={(e) => setSprint(e.target.value)}
                  className="w-full bg-elevated border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-sdp-red/40 transition-colors"
                >
                  <option value="">No sprint (backlog)</option>
                  {sprints.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.status === "active" ? "(Active)" : s.status === "planning" ? "(Planning)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Parent Item</FieldLabel>
                <select
                  value={parentId}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full bg-elevated border border-[var(--line)] rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-sdp-red/40 transition-colors"
                >
                  <option value="">None (top-level)</option>
                  {potentialParents.map((p) => (
                    <option key={p.id} value={p.id}>{p.wbsNumber} — {p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel>Dependencies</FieldLabel>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {workItems
                    .filter((i) => i.projectId === projectId && i.type !== "phase")
                    .slice(0, 12)
                    .map((item) => (
                      <label key={item.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={deps.includes(item.id)}
                          onChange={(e) =>
                            setDeps(e.target.checked
                              ? [...deps, item.id]
                              : deps.filter((d) => d !== item.id)
                            )
                          }
                          className="accent-sdp-red rounded"
                        />
                        <span className="text-xs text-ink-2 group-hover:text-ink transition-colors truncate">
                          {item.wbsNumber} — {item.title}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Link Documents ── */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-ink-2">
                Optionally link this work item to a project document. The item will appear in the document's linked work items list.
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-[var(--line)] cursor-pointer hover:bg-elevated transition-colors group">
                  <input
                    type="radio"
                    name="doc"
                    value=""
                    checked={linkedDocId === ""}
                    onChange={() => setLinkedDoc("")}
                    className="accent-sdp-red mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink-2">No document link</p>
                    <p className="text-xs text-ink-3 mt-0.5">Create the work item without linking it to a document</p>
                  </div>
                </label>

                {documents.map((doc) => {
                  const meta   = DOCUMENT_TYPE_META[doc.type]
                  const status = DOCUMENT_STATUS_META[doc.status]
                  return (
                    <label
                      key={doc.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                        linkedDocId === doc.id
                          ? "border-sdp-red/40 bg-sdp-red/5"
                          : "border-[var(--line)] hover:bg-elevated"
                      )}
                    >
                      <input
                        type="radio"
                        name="doc"
                        value={doc.id}
                        checked={linkedDocId === doc.id}
                        onChange={() => setLinkedDoc(doc.id)}
                        className="accent-sdp-red mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn("text-[10px] font-semibold uppercase tracking-wider", meta.color)}>{meta.label}</span>
                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", status.color)}>{status.label}</span>
                        </div>
                        <p className="text-sm font-medium text-ink truncate">{doc.title}</p>
                        <p className="text-[10px] text-ink-3 mt-0.5 flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          {doc.linkedWorkItems.length} linked item{doc.linkedWorkItems.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-ink-3">Step {step} of {STEPS.length}</div>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button variant="outline" size="sm" onClick={back}>
                  <ChevronLeft className="h-3.5 w-3.5" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button variant="primary" size="sm" onClick={next}>
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handleCreate} disabled={!title.trim()}>
                  <Check className="h-3.5 w-3.5" /> Create Item
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
