// ─── Auth & Users ─────────────────────────────────────────────────────────────
export type UserRole =
  | "super_admin"
  | "admin"
  | "program_manager"
  | "project_manager"
  | "scrum_master"
  | "team_member"
  | "client_viewer"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  department?: string
  title?: string
  createdAt: string
}

export interface Session {
  user: User
  token: string
  expiresAt: string
}

// ─── Organization & Workspace ─────────────────────────────────────────────────
export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
  plan: "starter" | "professional" | "enterprise"
}

export interface Workspace {
  id: string
  orgId: string
  name: string
  slug: string
  description?: string
  createdAt: string
}

export interface Project {
  id: string
  workspaceId: string
  name: string
  description?: string
  status: ProjectStatus
  health: RagStatus
  startDate: string
  endDate: string
  ownerId: string
  budget?: number
  methodology: "agile" | "waterfall" | "hybrid"
  createdAt: string
}

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled"
export type RagStatus = "green" | "amber" | "red" | "grey"

// ─── RAID ─────────────────────────────────────────────────────────────────────
export type RaidType = "risk" | "assumption" | "issue" | "decision"
export type RaidStatus = "open" | "in_progress" | "escalated" | "closed"
export type Priority = "critical" | "high" | "medium" | "low"

export interface RaidItem {
  id: string
  projectId: string
  type: RaidType
  title: string
  description: string
  status: RaidStatus
  priority: Priority
  ownerId: string
  dueDate?: string
  impact?: string
  probability?: "high" | "medium" | "low"
  responsePlan?: string
  escalatedAt?: string
  closedAt?: string
  closureNote?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// ─── Escalations ──────────────────────────────────────────────────────────────
export type EscalationLevel = "team" | "pm" | "program" | "executive" | "client"
export type EscalationStatus = "open" | "in_progress" | "resolved" | "closed"

export interface Escalation {
  id: string
  projectId: string
  raidItemId?: string
  title: string
  description: string
  level: EscalationLevel
  ownerId: string
  escalatedToId?: string
  status: EscalationStatus
  triggerCondition?: string
  resolution?: string
  slaHours?: number
  createdAt: string
  resolvedAt?: string
}

// ─── Work Items (WBS/Tasks) ────────────────────────────────────────────────────
export type WorkItemType = "phase" | "stream" | "epic" | "story" | "task" | "milestone" | "deliverable"
export type WorkItemStatus = "not_started" | "in_progress" | "completed" | "blocked" | "cancelled"

export interface WorkItem {
  id: string
  projectId: string
  parentId?: string
  wbsNumber: string
  title: string
  description?: string
  type: WorkItemType
  status: WorkItemStatus
  priority: Priority
  assigneeId?: string
  startDate: string
  endDate: string
  estimatedHours?: number
  actualHours?: number
  completionPct: number
  storyPoints?: number
  sprintId?: string
  position: number
  dependencies: string[]
  color?: string
  createdAt: string
  updatedAt: string
}

// ─── Sprints ──────────────────────────────────────────────────────────────────
export type SprintStatus = "planning" | "active" | "review" | "closed"

export interface Sprint {
  id: string
  projectId: string
  name: string
  goal?: string
  startDate: string
  endDate: string
  status: SprintStatus
  velocity?: number
  plannedPoints?: number
  completedPoints?: number
  createdAt: string
}

// ─── Retros ───────────────────────────────────────────────────────────────────
export type RetroItemCategory = "went_well" | "improve" | "action"
export type RetroStatus = "draft" | "active" | "closed"

export interface Retrospective {
  id: string
  projectId: string
  sprintId?: string
  title: string
  type: "sprint" | "milestone" | "engagement"
  status: RetroStatus
  facilitatorId: string
  heldAt?: string
  createdAt: string
}

export interface RetroItem {
  id: string
  retroId: string
  category: RetroItemCategory
  content: string
  votes: number
  ownerId?: string
  status: "open" | "action_created" | "done"
  createdAt: string
}

// ─── RACI ─────────────────────────────────────────────────────────────────────
export type RaciRole = "R" | "A" | "C" | "I"

export interface RaciEntry {
  id: string
  projectId: string
  deliverable: string
  assignments: Record<string, RaciRole>
}

// ─── Change Management ────────────────────────────────────────────────────────
export type ImpactLevel = "high" | "medium" | "low"
export type Sentiment = "champion" | "supportive" | "neutral" | "resistant" | "blocker"

export interface Stakeholder {
  id: string
  projectId: string
  name: string
  role: string
  organization?: string
  impactLevel: ImpactLevel
  sentiment: Sentiment
  engagementStrategy?: string
  notes?: string
}

export interface ChangeAction {
  id: string
  projectId: string
  stakeholderId?: string
  actionType: "communication" | "training" | "engagement" | "feedback"
  description: string
  ownerId: string
  dueDate: string
  status: "not_started" | "in_progress" | "completed"
  createdAt: string
}

// ─── Org Chart ────────────────────────────────────────────────────────────────
export interface OrgNode {
  id: string
  projectId: string
  userId?: string
  name: string
  title: string
  parentId?: string
  department?: string
  isExternal?: boolean
}

// ─── Comments & Activity ──────────────────────────────────────────────────────
export interface Comment {
  id: string
  entityType: string
  entityId: string
  authorId: string
  content: string
  parentId?: string
  createdAt: string
  updatedAt: string
}

export interface ActivityEvent {
  id: string
  entityType: string
  entityId: string
  actorId: string
  action: string
  description: string
  diff?: Record<string, unknown>
  createdAt: string
}

// ─── Dashboard / KPI ──────────────────────────────────────────────────────────
export interface KPICard {
  label: string
  value: string | number
  trend?: "up" | "down" | "flat"
  trendValue?: string
  color?: "green" | "amber" | "red" | "blue" | "default"
  icon?: string
}

// ─── Feature Flags ────────────────────────────────────────────────────────────
export interface FeatureFlag {
  id: string
  key: string
  label: string
  description: string
  enabled: boolean
  rolloutPct: number
  updatedAt: string
}

// ─── Project Documents ────────────────────────────────────────────────────────
export type DocumentType = "charter" | "sow" | "prd" | "architecture" | "meeting_notes" | "change_request"
export type DocumentStatus = "draft" | "review" | "approved" | "archived"

export interface ProjectDocument {
  id: string
  projectId: string
  type: DocumentType
  title: string
  status: DocumentStatus
  content: string
  version: string
  authorId: string
  reviewers: string[]
  approvedBy?: string
  linkedWorkItems: string[]
  source?: "template" | "uploaded"
  fileName?: string
  createdAt: string
  updatedAt: string
}

// ─── Audit ────────────────────────────────────────────────────────────────────
export interface AuditLog {
  id: string
  actorId: string
  actorName: string
  action: string
  resourceType: string
  resourceId: string
  resourceName: string
  changes?: Record<string, unknown>
  ip?: string
  createdAt: string
}
