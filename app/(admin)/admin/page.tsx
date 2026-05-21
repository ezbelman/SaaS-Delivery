"use client"
import { PageHeader, KPIRow } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_USERS, MOCK_PROJECTS } from "@/lib/mock-data/users"
import { formatDate } from "@/lib/utils"
import { Users, FolderOpen, ShieldAlert, ToggleRight, Activity, CheckCircle2 } from "lucide-react"

const RECENT_ACTIVITY = [
  { action: "User login",         actor: "Alex Rivera",    resource: "Authentication",          time: "2 min ago" },
  { action: "RAID item created",  actor: "Sarah Mitchell", resource: "PCI-DSS tokenisation risk",    time: "15 min ago" },
  { action: "Sprint started",     actor: "Marcus Johnson", resource: "Sprint 8",                     time: "1 hour ago" },
  { action: "Work item updated",  actor: "Priya Sharma",   resource: "Biometric authentication task", time: "2 hours ago" },
  { action: "User invited",       actor: "Admin",          resource: "tom.ba@slalom.com",             time: "3 hours ago" },
  { action: "Project created",    actor: "Alex Rivera",    resource: "Open Banking API Gateway",      time: "1 day ago" },
]

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Platform Overview"
        subtitle="Administration dashboard"
        breadcrumb={[{ label: "Admin" }]}
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
          <div className="rounded-xl border border-[var(--line)] p-4 bg-surface">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-ink-2 uppercase tracking-wider">Total Users</p>
              <Users className="h-4 w-4 text-info" />
            </div>
            <p className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {MOCK_USERS.length}
            </p>
            <p className="text-xs text-ink-3 mt-1">across all roles</p>
          </div>
          <div className="rounded-xl border border-[var(--line)] p-4 bg-surface">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-ink-2 uppercase tracking-wider">Active Projects</p>
              <FolderOpen className="h-4 w-4 text-success" />
            </div>
            <p className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {MOCK_PROJECTS.filter((p) => p.status === "active").length}
            </p>
            <p className="text-xs text-ink-3 mt-1">of {MOCK_PROJECTS.length} total</p>
          </div>
          <div className="rounded-xl border border-[var(--line)] p-4 bg-surface">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-ink-2 uppercase tracking-wider">Feature Flags</p>
              <ToggleRight className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>12</p>
            <p className="text-xs text-ink-3 mt-1">8 enabled</p>
          </div>
          <div className="rounded-xl border border-[var(--line)] p-4 bg-surface">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-ink-2 uppercase tracking-wider">Audit Events</p>
              <Activity className="h-4 w-4 text-sdp-red" />
            </div>
            <p className="text-2xl font-bold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>1,284</p>
            <p className="text-xs text-ink-3 mt-1">last 30 days</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-up delay-50">
          {/* Users by Role */}
          <Card>
            <CardHeader><CardTitle>Users by Role</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { role: "super_admin",     label: "Super Admin",     count: 1 },
                { role: "admin",           label: "Admin",           count: 1 },
                { role: "program_manager", label: "Program Manager", count: 1 },
                { role: "project_manager", label: "Project Manager", count: 1 },
                { role: "scrum_master",    label: "Scrum Master",    count: 1 },
                { role: "team_member",     label: "Team Member",     count: 2 },
                { role: "client_viewer",   label: "Client Viewer",   count: 1 },
              ].map((r) => (
                <div key={r.role} className="flex items-center justify-between py-1">
                  <span className="text-sm text-ink-2">{r.label}</span>
                  <Badge variant={r.role === "super_admin" ? "danger" : r.role === "admin" ? "warning" : "ghost"}>
                    {r.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-0">
              {RECENT_ACTIVITY.map((event, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[var(--line)] last:border-0">
                  <CheckCircle2 className="h-4 w-4 text-ink-3 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink">
                      <span className="font-medium">{event.actor}</span>
                      {" "}{event.action.toLowerCase()}
                    </p>
                    <p className="text-[11px] text-ink-3 truncate">{event.resource}</p>
                  </div>
                  <span className="text-[10px] text-ink-3 shrink-0">{event.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card className="animate-fade-up delay-100">
          <CardHeader><CardTitle>All Projects</CardTitle></CardHeader>
          <CardContent className="p-0">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--line)] last:border-0">
                <div className={`h-2 w-2 rounded-full shrink-0 ${
                  project.health === "green" ? "bg-success" :
                  project.health === "amber" ? "bg-warning" : "bg-danger"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{project.name}</p>
                  <p className="text-xs text-ink-3">{project.methodology} · {formatDate(project.startDate)} → {formatDate(project.endDate)}</p>
                </div>
                <Badge variant={project.status === "active" ? "success" : "ghost"} dot>
                  {project.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
