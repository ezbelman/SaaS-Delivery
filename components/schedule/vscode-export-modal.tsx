"use client"
import { useState, useEffect } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { cn } from "@/lib/utils"
import type { WorkItem } from "@/lib/types"
import {
  X, CheckCircle2, Loader2, GitBranch, ExternalLink,
  ChevronDown, ChevronRight, FileCode2, Folder, FolderOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── VS Code Dark+ palette ────────────────────────────────────────────────────
const VS = {
  bg:          "#1E1E1E",
  titleBar:    "#252526",
  activityBar: "#333333",
  sidebar:     "#252526",
  tabBar:      "#2D2D2D",
  activeTab:   "#1E1E1E",
  gutter:      "#1E1E1E",
  gutterText:  "#858585",
  statusBar:   "#007ACC",
  text:        "#D4D4D4",
  comment:     "#6A9955",
  keyword:     "#569CD6",
  string:      "#CE9178",
  type:        "#4EC9B0",
  number:      "#B5CEA8",
  function:    "#DCDCAA",
  operator:    "#D4D4D4",
  lineHi:      "rgba(255,255,255,0.04)",
}

// ─── Types ────────────────────────────────────────────────────────────────────
type ExportPhase = "idle" | "bundling" | "launching" | "open"

interface BundleStep { label: string; done: boolean }

interface VsCodeExportModalProps {
  open:     boolean
  onClose:  () => void
  item:     WorkItem
  code:     string
  fileName: string
  branch:   string
}

// ─── File tree builder ────────────────────────────────────────────────────────
function buildTree(fileName: string) {
  const parts  = fileName.split("/")
  const folder = parts.slice(0, -1).join("/")
  const file   = parts[parts.length - 1]

  const roots: { path: string; name: string; isFile?: boolean; active?: boolean }[] = [
    { path: "src",        name: "src" },
    { path: "migrations", name: "migrations" },
    { path: "tests",      name: "tests" },
    { path: "package.json",   name: "package.json",   isFile: true },
    { path: "tsconfig.json",  name: "tsconfig.json",  isFile: true },
    { path: ".env.example",   name: ".env.example",   isFile: true },
  ]

  const insideSrc = folder.startsWith("src")
  const isMigration = folder === "migrations"
  const isTest = folder === "tests"

  return { folder, file, insideSrc, isMigration, isTest, roots }
}

// ─── Syntax highlighter (token-based, no dangerouslySetInnerHTML) ─────────────
const TS_KW = new Set([
  "import","export","from","const","let","var","function","class","interface",
  "type","return","async","await","if","else","try","catch","throw","new",
  "extends","private","public","readonly","static","default","void","null",
  "undefined","true","false","this","as","of","for","while","describe","it",
  "expect","beforeEach","afterEach","vi","router","override","protected",
])
const SQL_KW = new Set([
  "SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE",
  "CREATE","TABLE","INDEX","IF","NOT","EXISTS","NULL","DEFAULT","BEGIN","COMMIT",
  "ROLLBACK","AND","OR","ON","ORDER","BY","DESC","ASC","INNER","JOIN","LEFT",
  "PRIMARY","KEY","UNIQUE","VIEW","REPLACE","COUNT","MAX","MIN","FILTER",
  "GROUP","HAVING","LIMIT","OFFSET","CONSTRAINT","FOREIGN","REFERENCES",
])

type Tok = { k: "kw"|"str"|"cmt"|"type"|"num"|"fn"|"op"|"txt"; v: string }

function tokenizeLine(raw: string, isSql: boolean): Tok[] {
  const toks: Tok[] = []
  let i = 0

  // Detect full-line comment
  const tr = raw.trimStart()
  if (tr.startsWith("//") || tr.startsWith("--") || tr.startsWith("* ") || tr === "*") {
    return [{ k: "cmt", v: raw }]
  }

  const kwSet = isSql ? SQL_KW : TS_KW

  while (i < raw.length) {
    const ch = raw[i]

    // Template literal or string
    if (ch === "`" || ch === "'" || ch === '"') {
      let j = i + 1
      const q = ch
      while (j < raw.length && raw[j] !== q) {
        if (raw[j] === "\\") j++
        j++
      }
      toks.push({ k: "str", v: raw.slice(i, j + 1) })
      i = j + 1
      continue
    }

    // Identifier / keyword / type / function
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i
      while (j < raw.length && /[\w$]/.test(raw[j])) j++
      const word = raw.slice(i, j)
      const isKw   = kwSet.has(word) || (isSql && SQL_KW.has(word.toUpperCase()))
      const isType = /^[A-Z]/.test(word) && !isSql
      const isFn   = raw[j] === "("
      toks.push({
        k: isKw ? "kw" : isType ? "type" : isFn ? "fn" : "txt",
        v: word,
      })
      i = j
      continue
    }

    // Number
    if (/[0-9]/.test(ch)) {
      let j = i
      while (j < raw.length && /[0-9.]/.test(raw[j])) j++
      toks.push({ k: "num", v: raw.slice(i, j) })
      i = j
      continue
    }

    toks.push({ k: "txt", v: ch })
    i++
  }
  return toks
}

const TOK_COLOR: Record<Tok["k"], string> = {
  kw:   VS.keyword,
  str:  VS.string,
  cmt:  VS.comment,
  type: VS.type,
  num:  VS.number,
  fn:   VS.function,
  op:   VS.operator,
  txt:  VS.text,
}

function CodeLine({ line, num, isSql, isActive }: {
  line: string; num: number; isSql: boolean; isActive: boolean
}) {
  const toks = tokenizeLine(line, isSql)
  return (
    <div style={{ display:"flex", background: isActive ? VS.lineHi : "transparent", minHeight: 18 }}>
      <span style={{ width:36, minWidth:36, textAlign:"right", paddingRight:16,
                     color:VS.gutterText, userSelect:"none", fontSize:11, lineHeight:"18px" }}>
        {num}
      </span>
      <span style={{ flex:1, fontSize:12, lineHeight:"18px", whiteSpace:"pre", letterSpacing:0 }}>
        {toks.map((t, i) => (
          <span key={i} style={{ color: TOK_COLOR[t.k] }}>{t.v}</span>
        ))}
      </span>
    </div>
  )
}

// ─── Activity bar icons ───────────────────────────────────────────────────────
function ActivityIcon({ icon, active }: { icon: string; active?: boolean }) {
  return (
    <div style={{
      width:48, height:48, display:"flex", alignItems:"center", justifyContent:"center",
      borderLeft: active ? "2px solid #fff" : "2px solid transparent",
      opacity: active ? 1 : 0.5, cursor:"pointer",
      fontSize: 18,
    }}>
      {icon}
    </div>
  )
}

// ─── VS Code Mock window ──────────────────────────────────────────────────────
function VsCodeWindow({ item, code, fileName, branch }: {
  item: WorkItem; code: string; fileName: string; branch: string
}) {
  const lines       = code.split("\n")
  const isSql       = fileName.endsWith(".sql")
  const { folder, file, insideSrc, isMigration, isTest, roots } = buildTree(fileName)
  const lang        = fileName.endsWith(".sql") ? "SQL" : fileName.endsWith(".tsx") ? "TypeScript JSX" : "TypeScript"
  const lineCount   = lines.length
  const [activeLine, setActiveLine] = useState(1)

  return (
    <div
      style={{ background:VS.bg, fontFamily:"'SF Mono','Fira Code','Consolas',monospace",
               display:"flex", flexDirection:"column", height:"100%", borderRadius:8,
               overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.7)" }}
    >
      {/* ── Title bar ── */}
      <div style={{ background:VS.titleBar, height:32, display:"flex", alignItems:"center",
                    paddingLeft:12, paddingRight:12, gap:8, flexShrink:0 }}>
        <div style={{ display:"flex", gap:6 }}>
          <div style={{ width:12,height:12,borderRadius:6,background:"#FF5F57" }} />
          <div style={{ width:12,height:12,borderRadius:6,background:"#FFBD2E" }} />
          <div style={{ width:12,height:12,borderRadius:6,background:"#28CA41" }} />
        </div>
        <div style={{ flex:1, textAlign:"center", fontSize:11, color:"#CCCCCC", opacity:0.8 }}>
          {file} — {folder || "root"} — Visual Studio Code
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* Activity bar */}
        <div style={{ background:VS.activityBar, width:48, flexShrink:0, display:"flex",
                      flexDirection:"column", alignItems:"center", paddingTop:8 }}>
          <ActivityIcon icon="⧉" active />
          <ActivityIcon icon="🔍" />
          <ActivityIcon icon="⎇" />
          <ActivityIcon icon="🐛" />
          <div style={{ flex:1 }} />
          <ActivityIcon icon="⚙" />
        </div>

        {/* Sidebar – file explorer */}
        <div style={{ background:VS.sidebar, width:200, flexShrink:0, overflow:"hidden",
                      borderRight:`1px solid ${VS.activityBar}`, paddingTop:4 }}>
          <div style={{ padding:"4px 12px", fontSize:10, letterSpacing:1.5,
                        color:"#BBBBBB", fontWeight:700, textTransform:"uppercase" }}>
            Explorer
          </div>
          <div style={{ padding:"2px 0" }}>
            {/* Repo root */}
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"2px 8px",
                          fontSize:11, color:"#CCCCCC", cursor:"pointer" }}>
              <ChevronDown style={{ width:12,height:12,flexShrink:0 }} />
              <span style={{ textTransform:"uppercase", fontSize:10, letterSpacing:0.5,
                             fontWeight:600, opacity:0.7 }}>
                meridian-bank-digital-platform
              </span>
            </div>

            {roots.map((r) => {
              const isActiveFolder =
                (r.path === "src" && insideSrc) ||
                (r.path === "migrations" && isMigration) ||
                (r.path === "tests" && isTest)

              if (r.isFile) {
                return (
                  <div key={r.path} style={{ display:"flex", alignItems:"center", gap:5,
                                             padding:"1.5px 8px 1.5px 24px", fontSize:11,
                                             color:"#CCCCCC", cursor:"pointer", opacity:0.7 }}>
                    <FileCode2 style={{ width:12,height:12,flexShrink:0 }} />
                    {r.name}
                  </div>
                )
              }

              return (
                <div key={r.path}>
                  <div style={{ display:"flex", alignItems:"center", gap:4,
                                padding:"1.5px 8px 1.5px 16px", fontSize:11,
                                color:"#CCCCCC", cursor:"pointer" }}>
                    {isActiveFolder
                      ? <><ChevronDown style={{ width:11,height:11,flexShrink:0 }} /><FolderOpen style={{ width:12,height:12,flexShrink:0,color:"#DCAF64" }} /></>
                      : <><ChevronRight style={{ width:11,height:11,flexShrink:0 }} /><Folder style={{ width:12,height:12,flexShrink:0,color:"#DCAF64" }} /></>
                    }
                    <span>{r.name}</span>
                  </div>

                  {isActiveFolder && (
                    <div style={{ display:"flex", alignItems:"center", gap:5,
                                  padding:"1.5px 8px 1.5px 44px", fontSize:11,
                                  background:"rgba(255,255,255,0.08)", cursor:"pointer",
                                  color:"#FFFFFF" }}>
                      <FileCode2 style={{ width:12,height:12,flexShrink:0,color:"#519ABA" }} />
                      {file}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Editor area */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
          {/* Tab bar */}
          <div style={{ background:VS.tabBar, display:"flex", flexShrink:0,
                        borderBottom:`1px solid ${VS.activityBar}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 16px",
                          height:34, background:VS.activeTab, fontSize:12, color:"#FFFFFF",
                          borderTop:"1px solid #007ACC" }}>
              <FileCode2 style={{ width:12,height:12,color:"#519ABA" }} />
              <span>{file}</span>
              <span style={{ marginLeft:4, opacity:0.5, cursor:"pointer", fontSize:14 }}>×</span>
            </div>
          </div>

          {/* Code scroll area */}
          <div style={{ flex:1, overflowY:"auto", overflowX:"auto", background:VS.bg, paddingTop:8,paddingBottom:24 }}>
            {lines.map((line, i) => (
              <CodeLine
                key={i}
                line={line}
                num={i + 1}
                isSql={isSql}
                isActive={activeLine === i + 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{ background:VS.statusBar, height:22, display:"flex", alignItems:"center",
                    padding:"0 12px", gap:16, flexShrink:0, color:"#FFFFFF", fontSize:11 }}>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span>⎇</span> {branch.slice(0,28)}{branch.length > 28 ? "…" : ""}
        </span>
        <span style={{ marginLeft:"auto" }}>Ln {activeLine}, Col 1</span>
        <span>Spaces: 2</span>
        <span>{lang}</span>
        <span>{lineCount} lines</span>
        <span>UTF-8</span>
        <span>✓ Prettier</span>
      </div>
    </div>
  )
}

// ─── Bundle steps ─────────────────────────────────────────────────────────────
function buildSteps(fileName: string, branch: string, item: WorkItem): string[] {
  return [
    "Resolving workspace…",
    `Reading ${fileName}`,
    "Resolving tsconfig.json paths…",
    `Configuring language server (TypeScript ${fileName.endsWith(".sql") ? "/ SQL" : ""})`,
    `Attaching Git context: ${branch.slice(0, 40)}`,
    `Loading ESLint & Prettier configs…`,
    `Indexing ${item.title} (WBS ${item.wbsNumber})`,
    "Opening file in editor…",
  ]
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function VsCodeExportModal({
  open, onClose, item, code, fileName, branch,
}: VsCodeExportModalProps) {
  const [phase,     setPhase]     = useState<ExportPhase>("idle")
  const [stepsDone, setStepsDone] = useState<number>(0)

  const steps = buildSteps(fileName, branch, item)

  // Auto-advance through phases when modal opens
  useEffect(() => {
    if (!open) { setPhase("idle"); setStepsDone(0); return }

    setPhase("bundling")
    setStepsDone(0)

    let step = 0
    const advance = () => {
      step++
      setStepsDone(step)
      if (step < steps.length) {
        setTimeout(advance, 180 + Math.random() * 120)
      } else {
        setTimeout(() => {
          setPhase("launching")
          setTimeout(() => setPhase("open"), 1200)
        }, 300)
      }
    }
    const t = setTimeout(advance, 250)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const launchReal = () => window.open(`vscode://file/C:/projects/slalom/meridian-bank-digital-platform/${fileName}`)

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onEscapeKeyDown={onClose}
        >
          <VisuallyHidden.Root>
            <Dialog.Title>Open in Visual Studio Code — {fileName}</Dialog.Title>
          </VisuallyHidden.Root>
          <div className="relative w-full max-w-6xl h-[88vh] flex flex-col rounded-xl overflow-hidden bg-[#1E1E1E] shadow-2xl border border-white/[0.06]">

            {/* ── Modal header ── */}
            <div className="flex items-center gap-3 px-5 py-3 bg-[#252526] border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2">
                {/* VS Code icon */}
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                  <path d="M74.9 7.5L50 31.3 25 7.5 0 25v50l25 17.5 25-23.8 25 23.8 25-17.5V25L74.9 7.5z" fill="#007ACC"/>
                  <path d="M74.9 7.5L50 31.3V68.8L74.9 92.5 100 75V25L74.9 7.5z" fill="#1BA1E2"/>
                  <path d="M25 7.5v85L0 75V25L25 7.5z" fill="#0065A9"/>
                  <path d="M50 31.3L25 7.5 0 25l25 25L50 31.3z" fill="#007ACC"/>
                </svg>
                <span className="text-sm font-semibold text-white">Visual Studio Code</span>
                <span className="text-xs text-[#858585]">— Export Preview</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {phase === "open" && (
                  <Button variant="outline" size="sm" onClick={launchReal} className="h-7 text-xs gap-1.5">
                    <ExternalLink className="h-3 w-3" />
                    Launch VS Code
                  </Button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded hover:bg-white/10 text-[#858585] hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Phase: bundling ── */}
            {(phase === "bundling" || phase === "launching") && (
              <div className="flex-1 flex flex-col items-center justify-center gap-8 bg-[#1E1E1E] px-8">
                <div className="flex items-center gap-4">
                  <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                    <path d="M74.9 7.5L50 31.3 25 7.5 0 25v50l25 17.5 25-23.8 25 23.8 25-17.5V25L74.9 7.5z" fill="#007ACC"/>
                    <path d="M74.9 7.5L50 31.3V68.8L74.9 92.5 100 75V25L74.9 7.5z" fill="#1BA1E2"/>
                    <path d="M25 7.5v85L0 75V25L25 7.5z" fill="#0065A9"/>
                    <path d="M50 31.3L25 7.5 0 25l25 25L50 31.3z" fill="#007ACC"/>
                  </svg>
                  <div>
                    <p className="text-white text-lg font-semibold">
                      {phase === "launching" ? "Launching Visual Studio Code…" : "Preparing workspace"}
                    </p>
                    <p className="text-[#858585] text-xs mt-0.5">{fileName}</p>
                  </div>
                </div>

                {phase === "bundling" && (
                  <div className="w-full max-w-lg space-y-1.5 font-mono text-xs">
                    {steps.map((step, i) => {
                      const done    = i < stepsDone
                      const current = i === stepsDone - 1 && stepsDone < steps.length
                      return (
                        <div key={i} className={cn(
                          "flex items-center gap-2.5 transition-opacity duration-200",
                          done || current ? "opacity-100" : "opacity-0"
                        )}>
                          {done ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#4ADE80] shrink-0" />
                          ) : (
                            <Loader2 className="h-3.5 w-3.5 text-[#007ACC] shrink-0 animate-spin" />
                          )}
                          <span className={done ? "text-[#6A9955]" : "text-[#D4D4D4]"}>
                            {step}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {phase === "launching" && (
                  <div className="w-full max-w-lg">
                    <div className="h-1 bg-[#333] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#007ACC] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <p className="text-[#858585] text-xs mt-2 text-center">Opening {fileName} in editor…</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Phase: open — VS Code preview ── */}
            {phase === "open" && (
              <div className="flex-1 overflow-hidden p-0">
                <VsCodeWindow
                  item={item}
                  code={code}
                  fileName={fileName}
                  branch={branch}
                />
              </div>
            )}

            {/* ── Footer when open ── */}
            {phase === "open" && (
              <div className="shrink-0 flex items-center gap-3 px-5 py-2.5 bg-[#252526] border-t border-white/[0.06]">
                <div className="flex items-center gap-2 text-xs text-[#858585]">
                  <GitBranch className="h-3 w-3" />
                  <span className="font-mono">{branch.slice(0, 50)}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] text-[#858585]">
                    {code.split("\n").length} lines · {(new Blob([code]).size / 1024).toFixed(1)} KB
                  </span>
                  <Button variant="outline" size="sm" onClick={launchReal} className="h-7 text-xs gap-1.5">
                    <ExternalLink className="h-3 w-3" />
                    Open in VS Code
                  </Button>
                  <Button variant="primary" size="sm" onClick={onClose} className="h-7 text-xs">
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
