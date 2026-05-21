"use client"
import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ToggleRight, Zap } from "lucide-react"

interface Flag {
  id: string
  key: string
  label: string
  description: string
  enabled: boolean
  rolloutPct: number
}

const INITIAL_FLAGS: Flag[] = [
  { id: "f1",  key: "ai_wbs_generator",        label: "AI WBS Generator",           description: "Generate Work Breakdown Structures using Claude AI — banking delivery templates included",    enabled: false, rolloutPct: 0   },
  { id: "f2",  key: "ai_risk_detection",       label: "AI Risk Detection",          description: "Automatically surface PCI-DSS, OAuth, and delivery risks from RAID and schedule data",        enabled: false, rolloutPct: 0   },
  { id: "f3",  key: "ai_sprint_planner",       label: "AI Sprint Planning",         description: "AI-recommended sprint planning for mobile and portal workstreams based on velocity history",   enabled: false, rolloutPct: 0   },
  { id: "f4",  key: "pdf_export",              label: "PDF Export",                 description: "Export RAID logs, Gantt charts, and executive dashboards to PDF for client reporting",         enabled: true,  rolloutPct: 100 },
  { id: "f5",  key: "resource_heatmap",        label: "Resource Heatmap",           description: "Visual allocation heatmap — flags overallocation on iOS, Android, and security streams",      enabled: true,  rolloutPct: 100 },
  { id: "f6",  key: "executive_dashboard",     label: "Executive Dashboard",        description: "Client-facing executive reporting view with RAG indicators for Diana Foster (Meridian Bank)",  enabled: true,  rolloutPct: 100 },
  { id: "f7",  key: "compliance_tracker",      label: "PCI-DSS Compliance Tracker", description: "Track PCI-DSS, PSD2, and GDPR compliance checklist items with status and ownership",         enabled: true,  rolloutPct: 75  },
  { id: "f8",  key: "mobile_release_dashboard",label: "Mobile Release Dashboard",   description: "App Store and Google Play release tracking — build versions, TestFlight status, review state", enabled: true,  rolloutPct: 50  },
  { id: "f9",  key: "advanced_gantt",          label: "Advanced Gantt (Beta)",      description: "Critical path analysis and baseline comparison — highlights M1 mobile beta risk path",        enabled: false, rolloutPct: 10  },
  { id: "f10", key: "sso_integration",         label: "SSO Integration",            description: "Slalom staff sign-on via Auth0 OIDC — same IdP as the Meridian Bank platform",               enabled: false, rolloutPct: 0   },
]

export default function AdminFlagsPage() {
  const [flags, setFlags] = useState(INITIAL_FLAGS)

  const toggle = (id: string) => {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, enabled: !f.enabled, rolloutPct: !f.enabled ? 100 : 0 } : f))
  }

  const enabled = flags.filter((f) => f.enabled).length

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Feature Flags"
        subtitle={`${enabled} of ${flags.length} features enabled`}
        breadcrumb={[{ label: "Admin" }, { label: "Feature Flags" }]}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {/* Phase callout */}
        <div className="rounded-xl border border-info/20 bg-info/5 p-4 flex items-start gap-3 animate-fade-up">
          <Zap className="h-4 w-4 text-info shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-info">AI Features — Architecture Ready</p>
            <p className="text-xs text-ink-2 mt-0.5">
              AI WBS Generator, Risk Detection, and Sprint Planning are designed for the Meridian Bank delivery context. Enable in Phase 4 when Claude API is connected.
            </p>
          </div>
        </div>

        {flags.map((flag) => (
          <div
            key={flag.id}
            className={`rounded-xl border p-4 flex items-start gap-4 transition-all animate-fade-up ${
              flag.enabled ? "border-success/20 bg-success/3" : "border-[var(--line)] bg-surface"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-ink">{flag.label}</p>
                {flag.enabled ? (
                  <Badge variant="success" dot>Enabled</Badge>
                ) : (
                  <Badge variant="ghost">Disabled</Badge>
                )}
              </div>
              <p className="text-xs text-ink-2">{flag.description}</p>
              <p className="text-[10px] font-mono text-ink-3 mt-1.5">{flag.key}</p>

              {flag.enabled && flag.rolloutPct < 100 && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-ink-3 shrink-0">Rollout:</span>
                  <Progress value={flag.rolloutPct} size="xs" className="flex-1" showLabel />
                </div>
              )}
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggle(flag.id)}
              className={`relative h-6 w-11 rounded-full transition-colors shrink-0 mt-0.5 ${
                flag.enabled ? "bg-success" : "bg-elevated border border-[var(--line)]"
              }`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                flag.enabled ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
