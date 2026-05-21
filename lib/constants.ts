import type { UserRole, Priority, RaidType, RaidStatus, WorkItemStatus, WorkItemType, RagStatus, EscalationLevel } from "./types"

export const MOCK_CREDENTIALS = {
  email: "slalom@slalom.com",
  password: "slalom123",
} as const

export const RAG_LABELS: Record<RagStatus, string> = {
  green: "On Track",
  amber: "At Risk",
  red: "Off Track",
  grey: "Not Started",
}

export const RAG_COLORS: Record<RagStatus, string> = {
  green: "text-success",
  amber: "text-warning",
  red:   "text-danger",
  grey:  "text-ink-3",
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  critical: "Critical",
  high:     "High",
  medium:   "Medium",
  low:      "Low",
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: "text-danger",
  high:     "text-warning",
  medium:   "text-info",
  low:      "text-ink-2",
}

export const RAID_TYPE_LABELS: Record<RaidType, string> = {
  risk:       "Risk",
  assumption: "Assumption",
  issue:      "Issue",
  decision:   "Decision",
}

export const RAID_TYPE_COLORS: Record<RaidType, string> = {
  risk:       "bg-danger/10 text-danger",
  assumption: "bg-info/10 text-info",
  issue:      "bg-warning/10 text-warning",
  decision:   "bg-success/10 text-success",
}

export const RAID_STATUS_LABELS: Record<RaidStatus, string> = {
  open:        "Open",
  in_progress: "In Progress",
  escalated:   "Escalated",
  closed:      "Closed",
}

export const WORK_ITEM_TYPE_LABELS: Record<WorkItemType, string> = {
  phase:       "Phase",
  stream:      "Stream",
  epic:        "Epic",
  story:       "Story",
  task:        "Task",
  milestone:   "Milestone",
  deliverable: "Deliverable",
}

export const WORK_STATUS_LABELS: Record<WorkItemStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed:   "Completed",
  blocked:     "Blocked",
  cancelled:   "Cancelled",
}

export const WORK_STATUS_COLORS: Record<WorkItemStatus, string> = {
  not_started: "bg-ink-3/20 text-ink-3",
  in_progress: "bg-info/10 text-info",
  completed:   "bg-success/10 text-success",
  blocked:     "bg-danger/10 text-danger",
  cancelled:   "bg-ink-3/20 text-ink-3",
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:      "Super Admin",
  admin:            "Admin",
  program_manager:  "Program Manager",
  project_manager:  "Project Manager",
  scrum_master:     "Scrum Master",
  team_member:      "Team Member",
  client_viewer:    "Client Viewer",
}

export const ESCALATION_LEVEL_LABELS: Record<EscalationLevel, string> = {
  team:      "Team Level",
  pm:        "PM Level",
  program:   "Program Level",
  executive: "Executive",
  client:    "Client",
}

export const NAV_ITEMS = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/overview", icon: "LayoutDashboard" },
    ],
  },
  {
    section: "Governance",
    items: [
      { label: "RAID Log",              href: "/raid",              icon: "ShieldAlert" },
      { label: "Escalation Path",       href: "/escalations",       icon: "TrendingUp" },
      { label: "Engagement Retro",      href: "/retro",             icon: "RefreshCw" },
      { label: "Ways of Working",       href: "/ways-of-working",   icon: "BookOpen" },
      { label: "Change Management",     href: "/change-management", icon: "GitBranch" },
      { label: "Org Chart & RACI",      href: "/org-chart",         icon: "Network" },
    ],
  },
  {
    section: "Delivery",
    items: [
      { label: "Project Schedule",  href: "/schedule",   icon: "CalendarRange" },
      { label: "Sprint Planner",    href: "/sprint",     icon: "Kanban" },
      { label: "Project Documents", href: "/documents",  icon: "FileText" },
    ],
  },
] as const

export const ADMIN_NAV_ITEMS = [
  { label: "Overview",       href: "/admin",          icon: "LayoutDashboard" },
  { label: "Users",          href: "/admin/users",    icon: "Users" },
  { label: "Roles",          href: "/admin/roles",    icon: "Shield" },
  { label: "Projects",       href: "/admin/projects", icon: "FolderOpen" },
  { label: "Audit Logs",     href: "/admin/audit",    icon: "ClipboardList" },
  { label: "Feature Flags",  href: "/admin/flags",    icon: "ToggleRight" },
] as const
