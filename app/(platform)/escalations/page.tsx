"use client"
import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, PriorityBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { useRaidStore } from "@/stores/raidStore"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { formatDate, timeAgo } from "@/lib/utils"
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, Plus, ArrowUpRight, Users } from "lucide-react"
import type { EscalationLevel, EscalationStatus } from "@/lib/types"
import { ESCALATION_LEVEL_LABELS } from "@/lib/constants"

const LEVEL_COLORS: Record<EscalationLevel, string> = {
  team:      "bg-info/10 text-info border-info/20",
  pm:        "bg-warning/10 text-warning border-warning/20",
  program:   "bg-warning/10 text-warning border-warning/20",
  executive: "bg-danger/10 text-danger border-danger/20",
  client:    "bg-danger/10 text-danger border-danger/20",
}

export default function EscalationsPage() {
  const { escalations, updateEscalation } = useRaidStore()
  const projectEscalations = escalations.filter((e) => e.projectId === "prj-001")

  const open  = projectEscalations.filter((e) => e.status === "open").length
  const inProg = projectEscalations.filter((e) => e.status === "in_progress").length
  const resolved = projectEscalations.filter((e) => e.status === "resolved").length

  const levelOrder: EscalationLevel[] = ["executive", "client", "program", "pm", "team"]
  const sorted = [...projectEscalations].sort((a, b) => levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level))

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Escalation Path"
        subtitle="Track and manage program escalations"
        breadcrumb={[{ label: "Governance" }, { label: "Escalation Path" }]}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-3.5 w-3.5" /> New Escalation
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 animate-fade-up">
          {[
            { label: "Open",        value: open,     color: "red" as const,   icon: <AlertTriangle className="h-4 w-4" /> },
            { label: "In Progress", value: inProg,   color: "amber" as const, icon: <Clock className="h-4 w-4" /> },
            { label: "Resolved",    value: resolved, color: "green" as const, icon: <CheckCircle2 className="h-4 w-4" /> },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl border border-[var(--line)] p-4 ${
              s.color === "red" ? "bg-danger/5" : s.color === "amber" ? "bg-warning/5" : "bg-success/5"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-ink-2 uppercase tracking-wider">{s.label}</p>
                <span className={s.color === "red" ? "text-danger" : s.color === "amber" ? "text-warning" : "text-success"}>
                  {s.icon}
                </span>
              </div>
              <p className={`text-2xl font-bold ${
                s.color === "red" ? "text-danger" : s.color === "amber" ? "text-warning" : "text-success"
              }`} style={{ fontFamily: "var(--font-space-grotesk)" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Escalation Matrix Header */}
        <div className="animate-fade-up delay-50">
          <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-sdp-red" />
            Escalation Levels
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {levelOrder.map((level, i) => (
              <div key={level} className="flex items-center gap-2 shrink-0">
                <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${LEVEL_COLORS[level]}`}>
                  {ESCALATION_LEVEL_LABELS[level]}
                  <div className="text-[10px] opacity-60 mt-0.5">
                    {projectEscalations.filter((e) => e.level === level).length} escalation{projectEscalations.filter((e) => e.level === level).length !== 1 ? "s" : ""}
                  </div>
                </div>
                {i < levelOrder.length - 1 && (
                  <ArrowUpRight className="h-4 w-4 text-ink-3 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Cards */}
        <div className="space-y-3 animate-fade-up delay-100">
          <h3 className="text-sm font-semibold text-ink">Active Escalations</h3>
          {sorted.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3" />
              <p className="text-ink-2 font-medium">No active escalations</p>
              <p className="text-sm text-ink-3 mt-1">All issues are being managed at the team level</p>
            </div>
          ) : (
            sorted.map((esc) => {
              const owner = MOCK_USERS.find((u) => u.id === esc.ownerId)
              const escalatedTo = MOCK_USERS.find((u) => u.id === esc.escalatedToId)
              const isHighPriority = esc.level === "executive" || esc.level === "client"

              return (
                <Card key={esc.id} className={isHighPriority ? "border-danger/20" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${LEVEL_COLORS[esc.level]}`}>
                            {ESCALATION_LEVEL_LABELS[esc.level]}
                          </span>
                          <Badge variant={
                            esc.status === "open" ? "danger" :
                            esc.status === "in_progress" ? "warning" :
                            esc.status === "resolved" ? "success" : "ghost"
                          } dot>
                            {esc.status.replace("_", " ")}
                          </Badge>
                          {esc.slaHours && (
                            <span className="text-xs text-ink-3 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {esc.slaHours}h SLA
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-ink mb-1">{esc.title}</h4>
                        <p className="text-xs text-ink-2 leading-relaxed">{esc.description}</p>

                        {esc.triggerCondition && (
                          <div className="mt-2 px-2 py-1 rounded bg-elevated text-xs text-ink-2">
                            <span className="font-medium text-ink-3">Trigger: </span>
                            {esc.triggerCondition}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 items-end shrink-0">
                        {/* Owner */}
                        {owner && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-ink-3">Owner:</span>
                            <Avatar name={owner.name} size="xs" />
                            <span className="text-xs text-ink-2">{owner.name.split(" ")[0]}</span>
                          </div>
                        )}
                        {/* Escalated to */}
                        {escalatedTo && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-ink-3">To:</span>
                            <Avatar name={escalatedTo.name} size="xs" />
                            <span className="text-xs text-ink-2">{escalatedTo.name.split(" ")[0]}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-ink-3">{timeAgo(esc.createdAt)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--line)]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateEscalation(esc.id, { status: "in_progress" })}
                        disabled={esc.status === "in_progress"}
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => updateEscalation(esc.id, { status: "resolved", resolvedAt: new Date().toISOString() })}
                        disabled={esc.status === "resolved"}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Resolve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
