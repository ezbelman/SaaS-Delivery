import type { WorkItemType, WorkItemStatus, Priority, DocumentType } from "@/lib/types"

export interface WorkItemTemplate {
  title: string
  type: WorkItemType
  priority: Priority
  status?: WorkItemStatus
  completionPct?: number
  estimatedHours?: number
  actualHours?: number
  storyPoints?: number
  daysOffset: number
  durationDays: number
  assigneeRole?: "pm" | "dev" | "ba" | "sm"
}

export interface DocWorkItemSet {
  epic: string
  items: WorkItemTemplate[]
}

export const ASSIGNEE_BY_ROLE: Record<string, string> = {
  pm:  "usr-003", // Sarah Mitchell — PM
  dev: "usr-005", // Priya Sharma — Dev
  ba:  "usr-006", // Tom Bradley — BA
  sm:  "usr-004", // Marcus Johnson — SM
}

export const DOCUMENT_TEMPLATES: Record<DocumentType, DocWorkItemSet> = {
  charter: {
    epic: "Project Governance & Setup",
    items: [
      { title: "Finalize project charter with stakeholders",   type: "task",      priority: "critical", status: "completed",  completionPct: 100, estimatedHours: 8,  actualHours: 8,  daysOffset: -10, durationDays: 3, assigneeRole: "pm" },
      { title: "Establish governance framework & RACI matrix", type: "task",      priority: "high",     status: "completed",  completionPct: 100, estimatedHours: 6,  actualHours: 6,  daysOffset: -7,  durationDays: 2, assigneeRole: "pm" },
      { title: "Stakeholder kick-off workshop",                type: "task",      priority: "high",     status: "in_progress",completionPct: 65,  estimatedHours: 4,  actualHours: 3,  daysOffset: -2,  durationDays: 1, assigneeRole: "pm" },
      { title: "Set up project communication cadence",         type: "task",      priority: "medium",   status: "not_started",completionPct: 0,   estimatedHours: 3,                   daysOffset: 2,   durationDays: 1, assigneeRole: "sm" },
      { title: "Charter sign-off",                            type: "milestone", priority: "critical", status: "not_started",completionPct: 0,                                        daysOffset: 7,   durationDays: 0  },
    ],
  },
  sow: {
    epic: "SOW Deliverable Tracking",
    items: [
      { title: "Map SOW deliverables to sprint plan",          type: "task",        priority: "critical", status: "completed",  completionPct: 100, estimatedHours: 6,  actualHours: 6,  daysOffset: -7,  durationDays: 2, assigneeRole: "pm" },
      { title: "Assign deliverable owners & acceptance criteria", type: "task",     priority: "high",     status: "in_progress",completionPct: 50,  estimatedHours: 4,  actualHours: 2,  daysOffset: -4,  durationDays: 2, assigneeRole: "ba" },
      { title: "Commercial terms review with legal",           type: "task",        priority: "high",     status: "not_started",completionPct: 0,   estimatedHours: 3,                   daysOffset: 1,   durationDays: 2, assigneeRole: "pm" },
      { title: "Configure billing milestone schedule",         type: "task",        priority: "medium",   status: "not_started",completionPct: 0,   estimatedHours: 2,                   daysOffset: 4,   durationDays: 1, assigneeRole: "pm" },
      { title: "SOW execution kickoff",                       type: "milestone",   priority: "critical", status: "not_started",completionPct: 0,                                        daysOffset: 7,   durationDays: 0  },
      { title: "Deliverable 1 — Discovery Phase Complete",     type: "deliverable", priority: "high",     status: "not_started",completionPct: 0,   estimatedHours: 40,                  daysOffset: 14,  durationDays: 14, assigneeRole: "pm" },
    ],
  },
  prd: {
    epic: "Product Feature Development",
    items: [
      { title: "Product backlog refinement & grooming",        type: "task",      priority: "high",     status: "completed",  completionPct: 100, estimatedHours: 4,  actualHours: 4,  storyPoints: 3,  daysOffset: -8,  durationDays: 1, assigneeRole: "ba"  },
      { title: "User authentication & MFA (TOTP/SMS)",         type: "story",     priority: "critical", status: "in_progress",completionPct: 70,  estimatedHours: 16, actualHours: 11, storyPoints: 8,  daysOffset: -6,  durationDays: 5, assigneeRole: "dev" },
      { title: "Account dashboard & balance overview",         type: "story",     priority: "high",     status: "in_progress",completionPct: 25,  estimatedHours: 12, actualHours: 3,  storyPoints: 5,  daysOffset: -1,  durationDays: 4, assigneeRole: "dev" },
      { title: "Transaction history & advanced filtering",     type: "story",     priority: "high",     status: "not_started",completionPct: 0,   estimatedHours: 10,                  storyPoints: 5,  daysOffset: 5,   durationDays: 4, assigneeRole: "dev" },
      { title: "Non-functional requirements baseline test",    type: "task",      priority: "medium",   status: "not_started",completionPct: 0,   estimatedHours: 6,                                    daysOffset: 3,   durationDays: 2, assigneeRole: "ba"  },
      { title: "MVP Feature Complete",                         type: "milestone", priority: "critical", status: "not_started",completionPct: 0,                                                         daysOffset: 14,  durationDays: 0  },
    ],
  },
  architecture: {
    epic: "Technical Foundation",
    items: [
      { title: "Infrastructure as Code (Terraform) setup",     type: "task",      priority: "critical", status: "completed",  completionPct: 100, estimatedHours: 16, actualHours: 16, storyPoints: 8, daysOffset: -12, durationDays: 5, assigneeRole: "dev" },
      { title: "CI/CD pipeline configuration",                 type: "task",      priority: "high",     status: "in_progress",completionPct: 80,  estimatedHours: 8,  actualHours: 6,  storyPoints: 5, daysOffset: -5,  durationDays: 3, assigneeRole: "dev" },
      { title: "API gateway & service mesh setup",             type: "task",      priority: "high",     status: "in_progress",completionPct: 35,  estimatedHours: 12, actualHours: 4,  storyPoints: 5, daysOffset: -2,  durationDays: 4, assigneeRole: "dev" },
      { title: "Developer local environment setup guide",      type: "task",      priority: "medium",   status: "completed",  completionPct: 100, estimatedHours: 4,  actualHours: 4,  storyPoints: 2, daysOffset: -12, durationDays: 1, assigneeRole: "dev" },
      { title: "Security review & penetration test scope",     type: "task",      priority: "critical", status: "not_started",completionPct: 0,   estimatedHours: 8,                                   daysOffset: 4,   durationDays: 3, assigneeRole: "pm"  },
      { title: "Architecture baseline approved",               type: "milestone", priority: "critical", status: "not_started",completionPct: 0,                                                        daysOffset: 10,  durationDays: 0  },
    ],
  },
  meeting_notes: {
    epic: "Meeting Action Items",
    items: [
      { title: "Follow up with Meridian Bank on open decisions", type: "task", priority: "high",   status: "in_progress",completionPct: 40, estimatedHours: 2, actualHours: 1, daysOffset: -1, durationDays: 1, assigneeRole: "pm" },
      { title: "Update project timeline from meeting outcomes",  type: "task", priority: "high",   status: "not_started",completionPct: 0,  estimatedHours: 3,                daysOffset: 1,  durationDays: 2, assigneeRole: "sm" },
      { title: "Distribute meeting minutes to all stakeholders", type: "task", priority: "medium", status: "completed",  completionPct: 100,estimatedHours: 1, actualHours: 1, daysOffset: -1, durationDays: 1, assigneeRole: "sm" },
      { title: "Schedule next steering committee review",        type: "task", priority: "medium", status: "not_started",completionPct: 0,  estimatedHours: 1,                daysOffset: 2,  durationDays: 1, assigneeRole: "pm" },
    ],
  },
  change_request: {
    epic: "Change Request Assessment",
    items: [
      { title: "Impact analysis — scope, cost & timeline",     type: "task",      priority: "critical", status: "in_progress",completionPct: 45, estimatedHours: 8,  actualHours: 4,  daysOffset: -2,  durationDays: 3, assigneeRole: "pm"  },
      { title: "Technical feasibility assessment",             type: "task",      priority: "high",     status: "not_started",completionPct: 0,  estimatedHours: 6,                  storyPoints: 5,  daysOffset: 1,   durationDays: 3, assigneeRole: "dev" },
      { title: "Stakeholder review & sign-off",                type: "task",      priority: "high",     status: "not_started",completionPct: 0,  estimatedHours: 4,                                   daysOffset: 5,   durationDays: 2, assigneeRole: "pm"  },
      { title: "Update project baseline (plan, budget)",       type: "task",      priority: "medium",   status: "not_started",completionPct: 0,  estimatedHours: 4,                                   daysOffset: 7,   durationDays: 2, assigneeRole: "sm"  },
      { title: "Change request approved",                      type: "milestone", priority: "critical", status: "not_started",completionPct: 0,                                                        daysOffset: 10,  durationDays: 0  },
      { title: "Implement approved changes",                   type: "task",      priority: "high",     status: "not_started",completionPct: 0,  estimatedHours: 16,                 storyPoints: 8,  daysOffset: 12,  durationDays: 7, assigneeRole: "dev" },
    ],
  },
}
