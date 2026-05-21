"use client"
import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Edit2, CheckCircle2, Clock, Users, Calendar, MessageSquare } from "lucide-react"

interface WoWSection {
  id: string
  title: string
  icon: React.ElementType
  items: string[]
  lastUpdated: string
  owner: string
}

const SECTIONS: WoWSection[] = [
  {
    id: "cadences",
    title: "Operating Cadences",
    icon: Calendar,
    owner: "Alex Rivera",
    lastUpdated: "2024-06-15",
    items: [
      "Daily Standup — 9:30 AM EST · 15 minutes max · Zoom · All team members",
      "Sprint Planning — Monday AM · 2 hours max · Bi-weekly · PM + SM + Dev Team (pre-groomed backlog required)",
      "Backlog Refinement — Thursday 2 PM · 1 hour · Weekly · PM + SM + Dev Team",
      "Steering Committee — Every other Friday 11 AM · 1 hour · Alex Rivera + Diana Foster (Meridian Bank)",
      "Client Status Report — Sent every Friday by 5 PM EST · PM owned · Covers mobile app, portal, and RAID",
      "RAID Review — Monday 10 AM · 30 minutes · PM + SM · Flag any Meridian Bank IT dependencies",
      "PCI-DSS / Compliance Check-in — Monthly · 1 hour · PM + Head of Compliance (Lisa Hernandez)",
    ],
  },
  {
    id: "norms",
    title: "Team Norms & Agreements",
    icon: Users,
    owner: "Sarah Mitchell",
    lastUpdated: "2024-06-10",
    items: [
      "Cameras on during all Meridian Bank client-facing meetings; optional during internal sessions",
      "Respond to Slack messages within 2 hours during core hours (9 AM–5 PM local)",
      "Flag staging environment blockers in standup — do not wait; escalate within 24 hours if unresolved",
      "No meeting Fridays after 3 PM for focused development and testing work",
      "All decisions with cross-team or compliance impact documented in RAID log same day",
      "Sprint commitments are firm — no scope additions mid-sprint without PM approval; biometric and payment features require security pre-review",
      "No credentials, tokens, or PII to be committed to source control — enforced via pre-commit hooks",
    ],
  },
  {
    id: "tools",
    title: "Tools & Channels",
    icon: MessageSquare,
    owner: "Marcus Johnson",
    lastUpdated: "2024-06-08",
    items: [
      "Slack: #mb-banking-general (all announcements), #mb-banking-dev (engineering), #mb-banking-client (client comms), #mb-banking-security (PCI-DSS / Auth0 issues)",
      "Jira: Sprint tracking, bug reports, story management — linked to GitHub PRs",
      "Confluence: Architecture decisions, Auth0 integration runbooks, API documentation, PSD2 specs",
      "GitHub (slalom/meridian-bank-digital-platform): Source control — main branch protected, PRs required, 2 reviewers for auth/payment code",
      "Auth0 Dashboard: Identity provider admin — OIDC config, MFA policies, token lifetimes",
      "TestFlight / Firebase App Distribution: Internal beta distribution for iOS / Android builds",
      "SDP: Program governance, RAID log, schedule (this platform)",
    ],
  },
  {
    id: "dod",
    title: "Definition of Done",
    icon: CheckCircle2,
    owner: "Marcus Johnson",
    lastUpdated: "2024-06-15",
    items: [
      "All acceptance criteria met and verified by Product Owner (Tom Bradley)",
      "Unit test coverage ≥ 80% for new code; ≥ 90% for authentication and payment flows",
      "Integration tests passing in staging environment — including Auth0 token refresh flow",
      "Staging smoke test passed: biometric login, balance fetch, and transaction history all functional",
      "Code reviewed by at least 2 peers for security-critical modules (auth, payments, biometric, push notifications)",
      "Security & PCI-DSS review completed for any payment, biometric, or auth-related changes",
      "App Store / Play Store compliance checklist verified for any mobile-facing feature changes",
      "API documentation updated (Swagger / Confluence) for any endpoint additions or changes",
      "Demo completed to PM/SM and recorded before sprint close",
    ],
  },
]

export default function WaysOfWorkingPage() {
  const [expandedId, setExpandedId] = useState<string | null>("cadences")

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Ways of Working"
        subtitle="Team agreements, cadences, and operating norms"
        breadcrumb={[{ label: "Governance" }, { label: "Ways of Working" }]}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-3.5 w-3.5" /> Add Section
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon
          const isExpanded = expandedId === section.id

          return (
            <Card key={section.id} className={isExpanded ? "border-sdp-red/20" : ""}>
              <button
                className="w-full text-left"
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
              >
                <div className="flex items-center gap-3 p-4">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isExpanded ? "bg-sdp-red/10" : "bg-elevated"
                  }`}>
                    <Icon className={`h-4.5 w-4.5 ${isExpanded ? "text-sdp-red" : "text-ink-2"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-ink">{section.title}</h3>
                    <p className="text-xs text-ink-3">
                      {section.items.length} items · Owner: {section.owner} · Updated {section.lastUpdated}
                    </p>
                  </div>
                  <Badge variant="ghost">{section.items.length}</Badge>
                </div>
              </button>

              {isExpanded && (
                <CardContent className="pt-0 pb-4">
                  <div className="border-t border-[var(--line)] pt-4 space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 group">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <p className="text-sm text-ink-2 flex-1">{item}</p>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-elevated text-ink-3">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <button className="flex items-center gap-2 text-sm text-sdp-red hover:text-sdp-red-dark transition-colors mt-3">
                      <Plus className="h-3.5 w-3.5" />
                      Add item
                    </button>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
