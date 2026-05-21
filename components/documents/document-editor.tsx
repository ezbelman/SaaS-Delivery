"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useDocumentStore, useDocument, DOCUMENT_TYPE_META, DOCUMENT_STATUS_META } from "@/stores/documentStore"
import { useScheduleStore } from "@/stores/scheduleStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft, Bold, Italic, Underline, Heading1, Heading2, Heading3,
  List, ListOrdered, Minus, Save, Link as LinkIcon, Unlink,
  ChevronDown, ExternalLink, Upload,
} from "lucide-react"
import { format } from "date-fns"
import type { DocumentStatus } from "@/lib/types"

// ─── Toolbar button ────────────────────────────────────────────────────────────
function ToolBtn({
  onMouseDown,
  active,
  children,
  title,
}: {
  onMouseDown: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onMouseDown()
      }}
      className={cn(
        "h-7 w-7 flex items-center justify-center rounded transition-all text-sm",
        active
          ? "bg-sdp-red/15 text-sdp-red"
          : "text-ink-2 hover:bg-elevated hover:text-ink"
      )}
    >
      {children}
    </button>
  )
}

function ToolSep() {
  return <div className="w-px h-4 bg-[var(--line)] mx-0.5" />
}

// ─── Status picker ─────────────────────────────────────────────────────────────
function StatusPicker({ current, onChange }: { current: DocumentStatus; onChange: (s: DocumentStatus) => void }) {
  const [open, setOpen] = useState(false)
  const meta = DOCUMENT_STATUS_META[current]
  const statuses: DocumentStatus[] = ["draft", "review", "approved", "archived"]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all",
          meta.color, "border-current/30"
        )}
      >
        {meta.label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-surface border border-[var(--line)] rounded-lg shadow-xl z-50 py-1 min-w-32 overflow-hidden">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => { onChange(s); setOpen(false) }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs transition-colors hover:bg-elevated",
                  DOCUMENT_STATUS_META[s].color.split(" ")[1]
                )}
              >
                {DOCUMENT_STATUS_META[s].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
interface DocumentEditorProps {
  docId: string
  onBack: () => void
}

export function DocumentEditor({ docId, onBack }: DocumentEditorProps) {
  const doc            = useDocument(docId)
  const updateDocument = useDocumentStore((s) => s.updateDocument)
  const unlinkWorkItem = useDocumentStore((s) => s.unlinkWorkItem)
  const { workItems }  = useScheduleStore()

  const editorRef  = useRef<HTMLDivElement>(null)
  const [title, setTitle]   = useState(doc?.title ?? "")
  const [isDirty, setIsDirty] = useState(false)
  const [saved, setSaved]   = useState(false)

  // Set editor HTML when doc changes
  useEffect(() => {
    if (editorRef.current && doc) {
      editorRef.current.innerHTML = doc.content
      setTitle(doc.title)
      setIsDirty(false)
    }
  }, [docId]) // eslint-disable-line react-hooks/exhaustive-deps

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value ?? undefined)
    editorRef.current?.focus()
    setIsDirty(true)
  }, [])

  function handleSave() {
    if (!doc) return
    updateDocument(docId, {
      title,
      content: editorRef.current?.innerHTML ?? doc.content,
    })
    setIsDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleStatusChange(status: DocumentStatus) {
    updateDocument(docId, { status })
  }

  if (!doc) return null

  const meta    = DOCUMENT_TYPE_META[doc.type]
  const author  = MOCK_USERS.find((u) => u.id === doc.authorId)
  const linkedItems = workItems.filter((wi) => doc.linkedWorkItems.includes(wi.id))

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-[var(--line)] bg-elevated shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink transition-colors shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Documents
        </button>
        <div className="h-4 w-px bg-[var(--line)]" />
        <span className={cn("text-[10px] font-semibold uppercase tracking-wider shrink-0", meta.color)}>
          {meta.label}
        </span>
        <div className="flex-1 min-w-0">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setIsDirty(true) }}
            className="w-full bg-transparent text-sm font-semibold text-ink placeholder:text-ink-3 outline-none truncate"
            placeholder="Document title…"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusPicker current={doc.status} onChange={handleStatusChange} />
          <span className="text-[10px] text-ink-3">v{doc.version}</span>
          <Button
            variant={saved ? "outline" : isDirty ? "primary" : "outline"}
            size="sm"
            onClick={handleSave}
            disabled={!isDirty && !saved}
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main editor area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Formatting toolbar */}
          <div className="flex items-center gap-0.5 px-4 py-2 border-b border-[var(--line)] bg-elevated shrink-0 flex-wrap">
            <ToolBtn title="Bold" onMouseDown={() => exec("bold")}><Bold className="h-3.5 w-3.5" /></ToolBtn>
            <ToolBtn title="Italic" onMouseDown={() => exec("italic")}><Italic className="h-3.5 w-3.5" /></ToolBtn>
            <ToolBtn title="Underline" onMouseDown={() => exec("underline")}><Underline className="h-3.5 w-3.5" /></ToolBtn>
            <ToolSep />
            <ToolBtn title="Heading 1" onMouseDown={() => exec("formatBlock", "h1")}><Heading1 className="h-3.5 w-3.5" /></ToolBtn>
            <ToolBtn title="Heading 2" onMouseDown={() => exec("formatBlock", "h2")}><Heading2 className="h-3.5 w-3.5" /></ToolBtn>
            <ToolBtn title="Heading 3" onMouseDown={() => exec("formatBlock", "h3")}><Heading3 className="h-3.5 w-3.5" /></ToolBtn>
            <ToolSep />
            <ToolBtn title="Bullet list" onMouseDown={() => exec("insertUnorderedList")}><List className="h-3.5 w-3.5" /></ToolBtn>
            <ToolBtn title="Numbered list" onMouseDown={() => exec("insertOrderedList")}><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
            <ToolSep />
            <ToolBtn title="Horizontal rule" onMouseDown={() => exec("insertHorizontalRule")}><Minus className="h-3.5 w-3.5" /></ToolBtn>
            <ToolBtn
              title="Insert link"
              onMouseDown={() => {
                const url = window.prompt("Enter URL:", "https://")
                if (url) exec("createLink", url)
              }}
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </ToolBtn>
          </div>

          {/* Author info bar */}
          <div className="flex items-center gap-3 px-8 py-2.5 border-b border-[var(--line)] shrink-0 text-[11px] text-ink-3">
            {author && (
              <div className="flex items-center gap-2">
                <Avatar name={author.name} size="xs" />
                <span>{author.name}</span>
              </div>
            )}
            <span>·</span>
            <span>Last updated {format(new Date(doc.updatedAt), "MMMM d, yyyy 'at' h:mm a")}</span>
            {isDirty && <span className="text-warning">· Unsaved changes</span>}
          </div>

          {/* Editor content */}
          <div className="flex-1 overflow-auto px-8 py-6">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={() => setIsDirty(true)}
              className={cn(
                "outline-none min-h-[600px] max-w-3xl mx-auto text-sm leading-7 text-ink-2",
                // Prose-like styles via Tailwind arbitrary variants
                "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-ink [&_h1]:mb-4 [&_h1]:mt-2 [&_h1]:leading-tight",
                "[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-[var(--line)]",
                "[&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-ink [&_h3]:mb-2 [&_h3]:mt-4",
                "[&_p]:mb-3 [&_p]:text-ink-2",
                "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-3 [&_ul]:space-y-1",
                "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-3 [&_ol]:space-y-1",
                "[&_li]:text-ink-2",
                "[&_strong]:font-semibold [&_strong]:text-ink",
                "[&_em]:italic",
                "[&_hr]:border-t [&_hr]:border-[var(--line)] [&_hr]:my-6",
                "[&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_table]:text-xs",
                "[&_th]:border [&_th]:border-[var(--line)] [&_th]:px-3 [&_th]:py-2 [&_th]:bg-elevated [&_th]:font-semibold [&_th]:text-ink [&_th]:text-left",
                "[&_td]:border [&_td]:border-[var(--line)] [&_td]:px-3 [&_td]:py-2 [&_td]:text-ink-2",
                "[&_a]:text-sdp-red [&_a]:underline [&_a]:underline-offset-2",
                "[&_blockquote]:border-l-4 [&_blockquote]:border-sdp-red/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-ink-3 [&_blockquote]:my-4",
              )}
            />
          </div>
        </div>

        {/* Right sidebar — metadata */}
        <div className="w-64 shrink-0 border-l border-[var(--line)] overflow-auto p-4 space-y-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-2">Document Info</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-3">Type</span>
                <span className={cn("font-medium", meta.color)}>{meta.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">Version</span>
                <span className="text-ink">v{doc.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-3">Created</span>
                <span className="text-ink">{format(new Date(doc.createdAt), "MMM d, yyyy")}</span>
              </div>
              {doc.source === "uploaded" && (
                <div className="pt-1 border-t border-[var(--line)]">
                  <div className="flex items-center gap-1.5 text-[10px] text-ink-3 mb-1">
                    <Upload className="h-3 w-3 shrink-0" />
                    <span className="font-medium text-ink-2">Uploaded file</span>
                  </div>
                  {doc.fileName && (
                    <p className="text-[10px] text-ink-3 break-all leading-relaxed">{doc.fileName}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-2">Author</p>
            {author && (
              <div className="flex items-center gap-2 text-xs text-ink">
                <Avatar name={author.name} size="xs" />
                <div>
                  <p className="font-medium">{author.name}</p>
                  <p className="text-ink-3 text-[10px]">{author.title}</p>
                </div>
              </div>
            )}
          </div>

          {doc.reviewers.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-2">Reviewers</p>
              <div className="space-y-1.5">
                {doc.reviewers.map((rId) => {
                  const reviewer = MOCK_USERS.find((u) => u.id === rId)
                  return reviewer ? (
                    <div key={rId} className="flex items-center gap-2 text-xs text-ink">
                      <Avatar name={reviewer.name} size="xs" />
                      <span>{reviewer.name}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-2">
              Linked Work Items ({linkedItems.length})
            </p>
            {linkedItems.length === 0 ? (
              <p className="text-[11px] text-ink-3">No linked items</p>
            ) : (
              <div className="space-y-1.5">
                {linkedItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-1.5 group">
                    <ExternalLink className="h-3 w-3 text-ink-3 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-ink-2 flex-1 leading-tight line-clamp-2">{item.title}</p>
                    <button
                      onClick={() => unlinkWorkItem(docId, item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      title="Unlink"
                    >
                      <Unlink className="h-3 w-3 text-ink-3 hover:text-danger" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
