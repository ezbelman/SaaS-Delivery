import type { WorkItemType, Priority, DocumentType } from "@/lib/types"

export interface WorkItemTemplate {
  title: string
  type: WorkItemType
  priority: Priority
  estimatedHours?: number
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
  pm: "usr-003", // Sarah Mitchell — PM
  dev: "usr-005", // Priya Sharma — Dev
  ba:  "usr-006", // Tom Bradley — BA
  sm:  "usr-004", // Marcus Johnson — SM
}

export const DOCUMENT_TEMPLATES: Record<DocumentType, DocWorkItemSet> = {
  charter: {
    epic: "Project Governance & Setup",
    items: [
      { title: "Finalize project charter with stakeholders",      type: "task",      priority: "critical", estimatedHours: 8,  daysOffset: 0,  durationDays: 3,  assigneeRole: "pm" },
      { title: "Establish governance framework & RACI matrix",    type: "task",      priority: "high",     estimatedHours: 6,  daysOffset: 2,  durationDays: 2,  assigneeRole: "pm" },
      { title: "Stakeholder kick-off workshop",                   type: "task",      priority: "high",     estimatedHours: 4,  daysOffset: 5,  durationDays: 1,  assigneeRole: "pm" },
      { title: "Set up project communication cadence",            type: "task",      priority: "medium",   estimatedHours: 3,  daysOffset: 6,  durationDays: 1,  assigneeRole: "sm" },
      { title: "Charter sign-off",                               type: "milestone", priority: "critical",                     daysOffset: 10, durationDays: 0  },
    ],
  },
  sow: {
    epic: "SOW Deliverable Tracking",
    items: [
      { title: "Map SOW deliverables to sprint plan",             type: "task",        priority: "critical", estimatedHours: 6,  daysOffset: 0,  durationDays: 2,  assigneeRole: "pm" },
      { title: "Assign deliverable owners & acceptance criteria", type: "task",        priority: "high",     estimatedHours: 4,  daysOffset: 1,  durationDays: 2,  assigneeRole: "ba" },
      { title: "Commercial terms review with legal",              type: "task",        priority: "high",     estimatedHours: 3,  daysOffset: 3,  durationDays: 2,  assigneeRole: "pm" },
      { title: "Configure billing milestone schedule",            type: "task",        priority: "medium",   estimatedHours: 2,  daysOffset: 5,  durationDays: 1,  assigneeRole: "pm" },
      { title: "SOW execution kickoff",                          type: "milestone",   priority: "critical",                     daysOffset: 7,  durationDays: 0  },
      { title: "Deliverable 1 — Discovery Phase Complete",        type: "deliverable", priority: "high",     estimatedHours: 40, daysOffset: 14, durationDays: 14, assigneeRole: "pm" },
    ],
  },
  prd: {
    epic: "Product Feature Development",
    items: [
      { title: "Product backlog refinement & grooming",           type: "task",      priority: "high",     estimatedHours: 4,  storyPoints: 3, daysOffset: 0,  durationDays: 1,  assigneeRole: "ba"  },
      { title: "User authentication & MFA (TOTP/SMS)",            type: "story",     priority: "critical", estimatedHours: 16, storyPoints: 8, daysOffset: 1,  durationDays: 5,  assigneeRole: "dev" },
      { title: "Account dashboard & balance overview",            type: "story",     priority: "high",     estimatedHours: 12, storyPoints: 5, daysOffset: 6,  durationDays: 4,  assigneeRole: "dev" },
      { title: "Transaction history & advanced filtering",        type: "story",     priority: "high",     estimatedHours: 10, storyPoints: 5, daysOffset: 10, durationDays: 4,  assigneeRole: "dev" },
      { title: "Non-functional requirements baseline test",       type: "task",      priority: "medium",   estimatedHours: 6,                  daysOffset: 2,  durationDays: 2,  assigneeRole: "ba"  },
      { title: "MVP Feature Complete",                            type: "milestone", priority: "critical",                                     daysOffset: 21, durationDays: 0  },
    ],
  },
  architecture: {
    epic: "Technical Foundation",
    items: [
      { title: "Infrastructure as Code (Terraform) setup",        type: "task",      priority: "critical", estimatedHours: 16, storyPoints: 8, daysOffset: 0,  durationDays: 5,  assigneeRole: "dev" },
      { title: "CI/CD pipeline configuration",                    type: "task",      priority: "high",     estimatedHours: 8,  storyPoints: 5, daysOffset: 3,  durationDays: 3,  assigneeRole: "dev" },
      { title: "API gateway & service mesh setup",                type: "task",      priority: "high",     estimatedHours: 12, storyPoints: 5, daysOffset: 5,  durationDays: 4,  assigneeRole: "dev" },
      { title: "Developer local environment setup guide",         type: "task",      priority: "medium",   estimatedHours: 4,  storyPoints: 2, daysOffset: 0,  durationDays: 1,  assigneeRole: "dev" },
      { title: "Security review & penetration test scope",        type: "task",      priority: "critical", estimatedHours: 8,                  daysOffset: 8,  durationDays: 3,  assigneeRole: "pm"  },
      { title: "Architecture baseline approved",                  type: "milestone", priority: "critical",                                     daysOffset: 14, durationDays: 0  },
    ],
  },
  meeting_notes: {
    epic: "Meeting Action Items",
    items: [
      { title: "Follow up with Meridian Bank on open decisions",  type: "task", priority: "high",   estimatedHours: 2, daysOffset: 1, durationDays: 1, assigneeRole: "pm" },
      { title: "Update project timeline from meeting outcomes",   type: "task", priority: "high",   estimatedHours: 3, daysOffset: 1, durationDays: 2, assigneeRole: "sm" },
      { title: "Distribute meeting minutes to all stakeholders",  type: "task", priority: "medium", estimatedHours: 1, daysOffset: 0, durationDays: 1, assigneeRole: "sm" },
      { title: "Schedule next steering committee review",         type: "task", priority: "medium", estimatedHours: 1, daysOffset: 2, durationDays: 1, assigneeRole: "pm" },
    ],
  },
  change_request: {
    epic: "Change Request Assessment",
    items: [
      { title: "Impact analysis — scope, cost & timeline",        type: "task",      priority: "critical", estimatedHours: 8,  daysOffset: 0,  durationDays: 3,  assigneeRole: "pm"  },
      { title: "Technical feasibility assessment",                type: "task",      priority: "high",     estimatedHours: 6,  storyPoints: 5, daysOffset: 1,  durationDays: 3,  assigneeRole: "dev" },
      { title: "Stakeholder review & sign-off",                   type: "task",      priority: "high",     estimatedHours: 4,  daysOffset: 5,  durationDays: 2,  assigneeRole: "pm"  },
      { title: "Update project baseline (plan, budget)",          type: "task",      priority: "medium",   estimatedHours: 4,  daysOffset: 7,  durationDays: 2,  assigneeRole: "sm"  },
      { title: "Change request approved",                         type: "milestone", priority: "critical",                     daysOffset: 10, durationDays: 0  },
      { title: "Implement approved changes",                      type: "task",      priority: "high",     estimatedHours: 16, storyPoints: 8, daysOffset: 12, durationDays: 7,  assigneeRole: "dev" },
    ],
  },
}
