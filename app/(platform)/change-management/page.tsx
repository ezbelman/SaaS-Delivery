"use client"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Plus, ArrowUp, ArrowDown, Minus, Users, GitBranch, Target, TrendingUp } from "lucide-react"
import type { Sentiment, ImpactLevel } from "@/lib/types"

const STAKEHOLDERS = [
  { id: "s1", name: "Diana Foster",   role: "VP Digital Banking",        org: "Meridian Bank (Client)", impact: "high" as ImpactLevel,   sentiment: "champion" as Sentiment,   notes: "Executive sponsor and champion. Drives budget sign-off. Weekly leadership touchpoint." },
  { id: "s2", name: "Robert Kim",     role: "CIO",                       org: "Meridian Bank (Client)", impact: "high" as ImpactLevel,   sentiment: "supportive" as Sentiment, notes: "Supportive but cautious on App Store timeline and PCI-DSS certification gap. Requires monthly executive briefings." },
  { id: "s3", name: "Lisa Hernandez", role: "Head of Compliance",        org: "Meridian Bank (Client)", impact: "high" as ImpactLevel,   sentiment: "neutral" as Sentiment,    notes: "Focused on PSD2 regulatory compliance and GDPR alignment. Needs pre-launch compliance checklist and sign-off." },
  { id: "s4", name: "James Cooper",   role: "Head of Retail Banking",    org: "Meridian Bank (Client)", impact: "medium" as ImpactLevel, sentiment: "resistant" as Sentiment,  notes: "Concerned about customer adoption of biometric login and disruption to branch workflows. Schedule change readiness 1:1." },
  { id: "s5", name: "Maria Santos",   role: "IT Security Manager",       org: "Meridian Bank (Client)", impact: "medium" as ImpactLevel, sentiment: "supportive" as Sentiment, notes: "Positive on Auth0 adoption. Requires early access to OAuth2 integration specs and penetration test plan." },
  { id: "s6", name: "Tom Bradley",    role: "BA Lead",                   org: "Slalom",                 impact: "medium" as ImpactLevel, sentiment: "champion" as Sentiment,   notes: "Internal champion. Key liaison to Meridian Bank operations team. Owns PSD2 requirements." },
]

const SENTIMENT_CONFIG: Record<Sentiment, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  champion:  { label: "Champion",   color: "text-success", bg: "bg-success/10 border-success/20", icon: TrendingUp },
  supportive:{ label: "Supportive", color: "text-info",    bg: "bg-info/10 border-info/20",       icon: ArrowUp },
  neutral:   { label: "Neutral",    color: "text-ink-2",   bg: "bg-elevated border-[var(--line)]", icon: Minus },
  resistant: { label: "Resistant",  color: "text-warning", bg: "bg-warning/10 border-warning/20", icon: ArrowDown },
  blocker:   { label: "Blocker",    color: "text-danger",  bg: "bg-danger/10 border-danger/20",   icon: ArrowDown },
}

const IMPACT_COLORS: Record<ImpactLevel, string> = {
  high:   "text-danger",
  medium: "text-warning",
  low:    "text-ink-2",
}

const CHANGE_PHASES = [
  { phase: "Awareness",   pct: 85, description: "Meridian Bank staff informed of new mobile app, biometric login, and portal redesign" },
  { phase: "Desire",      pct: 62, description: "Building customer and staff motivation — beta programme, internal champions network active" },
  { phase: "Knowledge",   pct: 44, description: "Biometric auth training, new online portal walkthroughs, PSD2 awareness for compliance team" },
  { phase: "Ability",     pct: 28, description: "Staff capability building for new digital channels — TestFlight beta, UAT participation" },
  { phase: "Reinforcement", pct: 10, description: "Post go-live adoption tracking — App Store ratings, support ticket volume, NPS target ≥ 45" },
]

export default function ChangeManagementPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Change Management Plan"
        subtitle="ADKAR model · Meridian Bank Digital Banking Transformation"
        breadcrumb={[{ label: "Governance" }, { label: "Change Management" }]}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-3.5 w-3.5" /> Add Stakeholder
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* ADKAR Progress */}
        <Card className="animate-fade-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ADKAR Progress</CardTitle>
              <Badge variant="warning">In Progress</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {CHANGE_PHASES.map((phase) => (
              <div key={phase.phase}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div>
                    <span className="font-semibold text-ink">{phase.phase}</span>
                    <span className="text-ink-3 ml-2">{phase.description}</span>
                  </div>
                  <span className="font-semibold text-ink">{phase.pct}%</span>
                </div>
                <Progress value={phase.pct} size="sm" showLabel={false} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sentiment summary */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 animate-fade-up delay-50">
          {(["champion", "supportive", "neutral", "resistant", "blocker"] as Sentiment[]).map((s) => {
            const config = SENTIMENT_CONFIG[s]
            const count = STAKEHOLDERS.filter((st) => st.sentiment === s).length
            const Icon = config.icon
            return (
              <div key={s} className={`rounded-xl border px-3 py-3 text-center ${config.bg}`}>
                <Icon className={`h-4 w-4 ${config.color} mx-auto mb-1.5`} />
                <p className={`text-lg font-bold ${config.color}`} style={{ fontFamily: "var(--font-space-grotesk)" }}>{count}</p>
                <p className="text-xs text-ink-2">{config.label}</p>
              </div>
            )
          })}
        </div>

        {/* Stakeholder Map */}
        <div className="animate-fade-up delay-100">
          <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-sdp-red" />
            Stakeholder Map
          </h3>
          <div className="space-y-2">
            {STAKEHOLDERS.map((s) => {
              const config = SENTIMENT_CONFIG[s.sentiment]
              const Icon = config.icon

              return (
                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl border border-[var(--line)] bg-surface hover:bg-elevated/30 transition-colors">
                  <Avatar name={s.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-ink">{s.name}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className={`text-xs font-medium ${IMPACT_COLORS[s.impact]}`}>
                        {s.impact} impact
                      </span>
                      {s.org === "Meridian Bank (Client)" && (
                        <Badge variant="ghost" className="text-[10px]">Client</Badge>
                      )}
                    </div>
                    <p className="text-xs text-ink-3 mt-0.5">{s.role} · {s.org}</p>
                    {s.notes && (
                      <p className="text-xs text-ink-2 mt-1 leading-relaxed">{s.notes}</p>
                    )}
                  </div>
                  <button className="shrink-0 p-1.5 rounded-lg hover:bg-elevated text-ink-3 hover:text-ink transition-colors">
                    <Target className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
