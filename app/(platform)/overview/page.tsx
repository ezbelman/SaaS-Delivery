"use client"
import { useMemo } from "react"
import { PageHeader, KPIRow, StatCard } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge, RAGBadge, StatusBadge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRaidKPIs } from "@/stores/raidStore"
import { useWorkItems, useSprints, useActiveSprint } from "@/stores/scheduleStore"
import { useCurrentUser } from "@/stores/authStore"
import { MOCK_PROJECTS, MOCK_USERS } from "@/lib/mock-data/users"
import { formatDate, formatDateShort, getDaysBetween } from "@/lib/utils"
import {
  ShieldAlert, TrendingUp, CalendarRange, Kanban,
  AlertTriangle, CheckCircle2, Clock, Activity,
  ArrowRight, Users, Target
} from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts"

const VELOCITY_DATA = [
  { sprint: "S5", planned: 40, completed: 36 },
  { sprint: "S6", planned: 44, completed: 44 },
  { sprint: "S7", planned: 44, completed: 40 },
  { sprint: "S8", planned: 48, completed: 31 },
]

const RISK_TREND = [
  { week: "W1", open: 5, closed: 1 },
  { week: "W2", open: 7, closed: 2 },
  { week: "W3", open: 8, closed: 3 },
  { week: "W4", open: 10, closed: 5 },
  { week: "W5", open: 9, closed: 6 },
  { week: "W6", open: 10, closed: 7 },
]

function MiniRagBar({ label, pct, status }: { label: string; pct: number; status: "green" | "amber" | "red" }) {
  const color = status === "green" ? "bg-success" : status === "amber" ? "bg-warning" : "bg-danger"
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-ink-2 w-28 shrink-0 truncate">{label}</p>
      <div className="flex-1 h-1.5 rounded-full bg-elevated overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-ink-2 w-8 text-right">{pct}%</p>
    </div>
  )
}

export default function OverviewPage() {
  const user = useCurrentUser()
  const project = MOCK_PROJECTS[0]
  const raidKPIs = useRaidKPIs("prj-001")
  const workItems = useWorkItems("prj-001")
  const activeSprint = useActiveSprint("prj-001")
  const sprints = useSprints("prj-001")

  const completedItems = workItems.filter((i) => i.status === "completed").length
  const blockedItems = workItems.filter((i) => i.status === "blocked").length
  const totalTasks = workItems.filter((i) => i.type === "task" || i.type === "story").length

  const programPct = useMemo(() => {
    const tasks = workItems.filter((i) => i.type === "task" || i.type === "story")
    if (!tasks.length) return 0
    return Math.round(tasks.reduce((sum, t) => sum + t.completionPct, 0) / tasks.length)
  }, [workItems])

  const daysRemaining = getDaysBetween(new Date(), project.endDate)
  const totalDays = getDaysBetween(project.startDate, project.endDate)
  const timePct = Math.round(((totalDays - daysRemaining) / totalDays) * 100)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Program Overview"
        subtitle={`${project.name} · Last updated: ${formatDate(new Date())}`}
        breadcrumb={[{ label: "Workspace" }, { label: "Meridian Bank Digital Banking" }]}
        actions={
          <Button variant="primary" size="sm">
            <Activity className="h-3.5 w-3.5" />
            Status Report
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Welcome + Program RAG */}
        <div className="flex items-start gap-4 animate-fade-up">
          <div className="flex-1">
            <p className="text-ink-2 text-sm">
              Good morning, <span className="text-ink font-medium">{user?.name?.split(" ")[0]}</span>
              {" "}· Sprint {activeSprint?.name} is active with{" "}
              {(activeSprint?.plannedPoints ?? 0) - (activeSprint?.completedPoints ?? 0)} points remaining.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-2">Program Health:</span>
            <RAGBadge status={project.health} />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-50">
          <StatCard
            label="Open RAID Items"
            value={raidKPIs.open}
            color={raidKPIs.open > 5 ? "amber" : "green"}
            trend={raidKPIs.open > 5 ? "up" : "flat"}
            trendValue={`${raidKPIs.escalated} escalated`}
            icon={<ShieldAlert className="h-4 w-4" />}
          />
          <StatCard
            label="Program Complete"
            value={`${programPct}%`}
            color={programPct >= 50 ? "green" : "amber"}
            trendValue={`Time: ${timePct}%`}
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            label="Active Blockers"
            value={blockedItems}
            color={blockedItems > 0 ? "red" : "green"}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <StatCard
            label="Days to Deadline"
            value={daysRemaining}
            color={daysRemaining < 60 ? "amber" : "green"}
            trendValue={formatDateShort(project.endDate)}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up delay-100">
          {/* Left: Program schedule progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Workstream Progress</CardTitle>
                <a href="/schedule" className="text-xs text-sdp-red hover:underline flex items-center gap-1">
                  View Schedule <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <MiniRagBar label="iOS App Update" pct={52} status="green" />
              <MiniRagBar label="Android App Update" pct={30} status="amber" />
              <MiniRagBar label="Biometric Auth" pct={45} status="amber" />
              <MiniRagBar label="Frontend Modernization" pct={40} status="amber" />
              <MiniRagBar label="Security & Compliance" pct={35} status="amber" />
              <MiniRagBar label="Open Banking API" pct={0} status="red" />
              <div className="pt-2 border-t border-[var(--line)]">
                <div className="flex items-center justify-between text-xs text-ink-2 mb-2">
                  <span>Overall Program</span>
                  <span className="font-semibold text-ink">{programPct}%</span>
                </div>
                <Progress value={programPct} size="md" showLabel={false} />
              </div>
            </CardContent>
          </Card>

          {/* Right: RAID Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>RAID Summary</CardTitle>
                <a href="/raid" className="text-xs text-sdp-red hover:underline flex items-center gap-1">
                  View All <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["risk", "assumption", "issue", "decision"] as const).map((type) => {
                const count =
                  type === "risk" ? raidKPIs.riskCount :
                  type === "assumption" ? raidKPIs.assumptionCount :
                  type === "issue" ? raidKPIs.issueCount :
                  raidKPIs.decisionCount
                const typeLabel = type.charAt(0).toUpperCase() + type.slice(1)
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        type === "risk" ? "bg-danger" :
                        type === "issue" ? "bg-warning" :
                        type === "assumption" ? "bg-info" : "bg-success"
                      }`} />
                      <span className="text-sm text-ink-2">{typeLabel}s</span>
                    </div>
                    <span className="text-sm font-semibold text-ink">{count}</span>
                  </div>
                )
              })}
              <div className="pt-3 border-t border-[var(--line)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-2">Escalated</span>
                  <Badge variant="danger">{raidKPIs.escalated}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-2">Critical Priority</span>
                  <Badge variant="danger">{raidKPIs.critical}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-2">Overdue</span>
                  <Badge variant={raidKPIs.overdue > 0 ? "warning" : "default"}>{raidKPIs.overdue}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-150">
          {/* Velocity */}
          <Card>
            <CardHeader>
              <CardTitle>Sprint Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={VELOCITY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0C62FB" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0C62FB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "var(--ink-3)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--ink-3)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--elevated)", border: "1px solid var(--line)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "var(--ink)" }}
                  />
                  <Area type="monotone" dataKey="planned" stroke="var(--ink-3)" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Planned" />
                  <Area type="monotone" dataKey="completed" stroke="#0C62FB" strokeWidth={2} fill="url(#vGrad)" name="Completed" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend (6 Weeks)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={RISK_TREND} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--ink-3)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--ink-3)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--elevated)", border: "1px solid var(--line)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "var(--ink)" }}
                  />
                  <Line type="monotone" dataKey="open" stroke="#EF4444" strokeWidth={2} dot={false} name="Open" />
                  <Line type="monotone" dataKey="closed" stroke="#22C55E" strokeWidth={2} dot={false} name="Closed" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Sprint + Team */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-200">
          {/* Active Sprint */}
          {activeSprint && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{activeSprint.name}</CardTitle>
                  <StatusBadge status="active" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSprint.goal && (
                  <p className="text-sm text-ink-2 italic">&ldquo;{activeSprint.goal}&rdquo;</p>
                )}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-ink-2">
                    <span>Sprint Progress</span>
                    <span className="font-semibold">
                      {activeSprint.completedPoints} / {activeSprint.plannedPoints} pts
                    </span>
                  </div>
                  <Progress
                    value={activeSprint.completedPoints ?? 0}
                    max={activeSprint.plannedPoints ?? 1}
                    size="md"
                    showLabel
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-ink-3">
                  <span>{formatDateShort(activeSprint.startDate)} → {formatDateShort(activeSprint.endDate)}</span>
                  <a href="/sprint" className="text-sdp-red hover:underline flex items-center gap-1">
                    View Board <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Delivery Team</CardTitle>
                <Badge variant="ghost">{MOCK_USERS.slice(0, 5).length} members</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {MOCK_USERS.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar name={member.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">{member.name}</p>
                    <p className="text-xs text-ink-3 truncate">{member.title}</p>
                  </div>
                  <Badge variant={
                    member.role === "program_manager" ? "primary" :
                    member.role === "scrum_master" ? "info" : "default"
                  } className="text-[10px]">
                    {member.role.replace(/_/g, " ")}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
