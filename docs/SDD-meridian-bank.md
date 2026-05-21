# Spec-Driven Development Document
## Meridian Bank — Digital Banking Transformation Platform (SDP v3.0)

---

| Field | Value |
|---|---|
| Document ID | SDD-MBK-2024-001 |
| Version | 1.1.0 |
| Status | Approved |
| Owner | Alex Rivera (Program Manager, Slalom Consulting) |
| Client Sponsor | Diana Foster (VP Digital Banking, Meridian Bank) |
| Project Inception | February 1, 2024 |
| Target Completion | December 1, 2024 |
| Classification | Confidential — Slalom / Meridian Bank NDA |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Feature Specifications](#4-feature-specifications)
   - 4.1 Authentication & Authorization
   - 4.2 Overview Dashboard
   - 4.3 Work Breakdown Structure (WBS)
   - 4.4 Gantt Chart
   - 4.5 Kanban Board
   - 4.6 Resource Heatmap
   - 4.7 Developer Workspace
   - 4.8 RAID Log
   - 4.9 Sprint Management
   - 4.10 Escalation Tracker
   - 4.11 Retrospectives
   - 4.12 Admin Panel
   - 4.13 Project Artifacts Hub
   - 4.14 Work Item Wizard
5. [Data Models](#5-data-models)
6. [API Contracts](#6-api-contracts)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Compliance & Security](#8-compliance--security)
9. [Acceptance Criteria Matrix](#9-acceptance-criteria-matrix)
10. [Glossary](#10-glossary)

---

## 1. Executive Summary

### 1.1 Purpose

This Spec-Driven Development (SDD) document defines the complete behavioural, structural, and operational specifications for the **Slalom Delivery Platform (SDP) v3.0** as deployed for the Meridian Bank Digital Banking Transformation programme. Every feature, data contract, and acceptance criterion recorded here was written *before* implementation and served as the binding agreement between Slalom Consulting engineering and Meridian Bank stakeholders.

SDD treats specifications as executable contracts: no line of production code may be merged unless a corresponding specification exists and all derived acceptance tests pass.

### 1.2 Project Context

Meridian Bank is undertaking a full digital channel modernisation across three parallel streams:

| Stream | Scope | Target |
|---|---|---|
| Mobile Banking App | iOS & Android native refresh with biometric auth, instant payments, push notifications | M1 — July 31, 2024 |
| Online Banking Portal | Web portal rebuilt with modern stack; PCI-DSS security hardening, MFA | M2 — October 1, 2024 |
| Open Banking API Gateway | PSD2-compliant gateway; PIS/AIS endpoints; Auth0 OIDC; Temenos T24 integration | M3 — December 1, 2024 |

### 1.3 Delivery Platform Goals

The SDP must give the Slalom engagement team a single, real-time command centre to:

1. Track all work items across three delivery phases using a hierarchical WBS
2. Visualise the schedule across five zoom levels (week → year) on a Gantt timeline
3. Manage sprint execution with drag-and-drop Kanban workflow
4. Monitor team capacity and identify overallocation risks proactively
5. Log and govern RAID items (Risks, Assumptions, Issues, Decisions) with escalation chains
6. Surface Git/PR context per task so engineers move from ticket to code without context switching
7. Provide client-facing dashboards with RAG health indicators for executive stakeholders

### 1.4 Out of Scope

- Core banking system (Temenos T24) integration — integration specifications are in a separate architecture document
- Meridian Bank customer-facing application code — that codebase is maintained by Meridian's internal engineering team
- Billing, invoicing, or commercial contract management

---

## 2. System Architecture

### 2.1 Technology Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Framework | Next.js (App Router) | 16.2.6 | SSR + RSC for fast initial load; route groups for role-based layouts |
| Language | TypeScript | 5.x | Static typing eliminates class of runtime bugs critical in financial delivery context |
| UI Runtime | React | 19.2.4 | Concurrent features; Server Components reduce client JS bundle |
| State — Client | Zustand | 5.0.13 | Minimal boilerplate; `persist` middleware for offline-resilient local state |
| State — Server | TanStack React Query | 5.100.11 | Declarative server-state caching for future API integration |
| Forms | React Hook Form + Zod | 7.76 / 4.4.3 | Uncontrolled form performance; Zod schemas double as runtime validators and spec artefacts |
| UI Components | Radix UI | latest | Accessible headless primitives; keyboard-navigable out of the box |
| Styling | Tailwind CSS | 4.x | Utility-first; design tokens via CSS custom properties |
| Animations | Framer Motion | 12.39.0 | Declarative transitions; used sparingly for layout shifts |
| Charts | Recharts | 3.8.1 | Composable React charting; AreaChart, LineChart, BarChart |
| Drag & Drop | @dnd-kit | core 6.3 / sortable 10.0 | Accessible, pointer-sensor drag with activation distance constraint |
| Date Utilities | date-fns | 4.2.1 | Tree-shakeable; all locale-aware operations |
| Icons | Lucide React | 1.16.0 | Consistent icon set; SVG-based, theme-aware |

### 2.2 Routing Architecture

```
app/
├── (auth)/
│   └── login/                 → Public; redirects authenticated users to /overview
├── (platform)/
│   ├── layout.tsx             → AuthGuard + Sidebar + PageHeader
│   ├── overview/              → Executive dashboard
│   ├── schedule/              → Multi-view schedule (WBS, Gantt, Kanban, Resource, Workspace)
│   ├── sprint/                → Sprint planning & execution
│   ├── raid/                  → RAID log with escalations
│   ├── escalations/           → Escalation path management
│   ├── retro/                 → Retrospective board
│   ├── ways-of-working/       → Team norms & working agreements
│   ├── change-management/     → Stakeholder engagement
│   └── org-chart/             → RACI matrix & org structure
└── (admin)/
    ├── layout.tsx             → Role-checked (admin | super_admin only)
    ├── users/                 → User provisioning & role assignment
    ├── roles/                 → Permission definitions
    ├── projects/              → Project settings
    ├── audit/                 → Immutable audit log
    └── flags/                 → Feature flag management
```

### 2.3 State Architecture

Two Zustand stores govern all mutable client state:

```
scheduleStore  (persisted: "sdp-schedule-v2")
  ├── workItems: WorkItem[]
  ├── sprints: Sprint[]
  ├── view: ScheduleView
  ├── expandedIds: Set<string>
  └── selectedId: string | null

raidStore  (persisted: "sdp-raid-v2")
  ├── items: RaidItem[]
  ├── escalations: Escalation[]
  └── selectedId: string | null
```

Persistence keys are versioned. Bumping the version (e.g. `v2` → `v3`) forces a clean hydration from mock/server data, invalidating any stale cached state. This is the canonical mechanism for breaking cache after data schema migrations.

### 2.4 Component Hierarchy

```
(platform) Layout
└── Sidebar
└── Page
    └── PageHeader (breadcrumb, actions)
    └── <FeaturePage>
        ├── schedule/page.tsx
        │   ├── ViewSwitcher (tabs: WBS | Gantt | Kanban | Resource | Workspace)
        │   ├── WbsTree
        │   ├── GanttChart
        │   ├── KanbanBoard
        │   ├── ResourceHeatmap
        │   └── DeveloperWorkspace
        ├── raid/page.tsx
        │   ├── RaidKPIRow
        │   ├── RaidFilters
        │   ├── RaidTable
        │   └── RaidSlideOver (detail + escalation history)
        └── overview/page.tsx
            ├── KPIRow (velocity, risk count, sprint health, budget)
            └── Charts (velocity trend, risk trend, phase RAG)
```

---

## 3. User Roles & Permissions

### 3.1 Role Definitions

| Role | Description | Platform Access |
|---|---|---|
| `super_admin` | Platform owner; full access to all organisations and admin functions | All routes including `/admin` |
| `admin` | Workspace administrator; manages users, projects, roles within their org | All platform routes + `/admin` |
| `program_manager` | Leads the full engagement; owns programme-level views and escalation | All platform routes; read `/admin` |
| `project_manager` | Owns a delivery stream; manages WBS, RAID, sprints | All platform routes; no `/admin` |
| `scrum_master` | Facilitates sprint ceremonies; manages Kanban board | `/schedule`, `/sprint`, `/retro`, `/ways-of-working` |
| `team_member` | Engineer or analyst; interacts with tasks assigned to them | `/schedule` (own tasks), `/sprint` |
| `client_viewer` | Meridian Bank stakeholder with read-only access to approved views | `/overview`, `/raid` (read-only) |

### 3.2 Permission Matrix

| Capability | super_admin | admin | program_manager | project_manager | scrum_master | team_member | client_viewer |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| View overview dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View schedule (all views) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Create / edit work items | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Delete work items | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Move Kanban cards | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ (own) | — |
| Create RAID items | ✓ | ✓ | ✓ | ✓ | — | — | — |
| Escalate RAID items | ✓ | ✓ | ✓ | ✓ | — | — | — |
| View RAID log | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ (read) |
| Manage sprints | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Access Developer Workspace | ✓ | ✓ | ✓ | ✓ | — | ✓ | — |
| Access Admin panel | ✓ | ✓ | — | — | — | — | — |
| Manage feature flags | ✓ | ✓ | — | — | — | — | — |
| View audit log | ✓ | ✓ | — | — | — | — | — |

### 3.3 Assigned Users — Meridian Bank Engagement

| Name | User ID | Role | Stream |
|---|---|---|---|
| Alex Rivera | usr-001 | `program_manager` | Delivery Excellence |
| Sarah Mitchell | usr-003 | `project_manager` | Banking Transformation |
| Marcus Johnson | usr-004 | `scrum_master` | Agile Delivery |
| Priya Sharma | usr-005 | `team_member` | iOS Engineering |
| Tom Bradley | usr-006 | `team_member` | Business Analysis / PO |
| Diana Foster | usr-007 | `client_viewer` | VP Digital Banking, Meridian Bank |
| Jordan Chen | usr-008 | `admin` | Platform Administration |
| Nathan Park | usr-009 | `super_admin` | Platform Owner |

---

## 4. Feature Specifications

Each specification section follows this structure:
- **Purpose** — why the feature exists
- **Behavioural Spec** — what it must do (numbered, testable statements)
- **UI Spec** — layout, interaction, visual rules
- **Acceptance Criteria** — pass/fail conditions derived from the behavioural spec

---

### 4.1 Authentication & Authorization

#### Purpose
Protect all platform routes behind identity verification. Enforce role-based access so client stakeholders see only approved data and engineers see only their relevant views.

#### Behavioural Spec

**AUTH-001** — The root path `/` shall redirect unauthenticated users to `/login` and authenticated users to `/overview`.

**AUTH-002** — The login page shall accept an email address and a password. On successful authentication, a session token shall be stored and the user redirected to `/overview`.

**AUTH-003** — Demo credentials `slalom@slalom.com` / `slalom123` shall be accepted in all non-production environments without external identity provider dependency.

**AUTH-004** — An `AuthGuard` component shall wrap all `(platform)` routes. Any navigation to a protected route without a valid session shall redirect to `/login` with the intended path stored for post-login redirect.

**AUTH-005** — Role checks shall be enforced at the layout level for `(admin)` routes. Users without `admin` or `super_admin` roles navigating to `/admin/**` shall receive a 403 Forbidden view.

**AUTH-006** — Session state shall persist across browser tab refreshes but shall not persist after explicit logout.

**AUTH-007** — All role checks shall be performed on the server (Next.js middleware or layout-level guard), not solely in client components.

#### UI Spec

- Login page: centred card (max-width 400px), Slalom logo, email + password fields, primary CTA "Sign in", error inline below fields
- No registration or password-reset flows in v1.0 (admin-provisioned accounts only)

#### Acceptance Criteria

| ID | Given | When | Then | Pass |
|---|---|---|---|---|
| AC-AUTH-1 | Unauthenticated user | Navigates to `/schedule` | Redirected to `/login` | — |
| AC-AUTH-2 | Valid credentials entered | Click "Sign in" | Redirected to `/overview`; session active | — |
| AC-AUTH-3 | Invalid credentials entered | Click "Sign in" | Inline error; no redirect | — |
| AC-AUTH-4 | `client_viewer` role | Navigates to `/admin` | Sees 403 view; not redirected to login | — |
| AC-AUTH-5 | Authenticated user | Refreshes browser | Session persists; no redirect to login | — |

---

### 4.2 Overview Dashboard

#### Purpose
Give programme managers and client stakeholders a real-time, single-page summary of delivery health without needing to navigate into detailed views.

#### Behavioural Spec

**DASH-001** — The dashboard shall display four KPI cards at the top: sprint velocity (current vs. planned story points), open RAID items count, active blockers count, and overall budget utilisation percentage.

**DASH-002** — A velocity trend chart shall render the last four sprints (S5–S8) as a dual-line chart: planned points vs. completed points. Axes shall be labelled and a tooltip shall display exact values on hover.

**DASH-003** — A risk trend chart shall render open vs. cumulatively closed RAID items over a six-week rolling window as an area chart.

**DASH-004** — Phase health bars shall display a RAG (Red/Amber/Green) indicator and a completion percentage for each of the three delivery phases. The colour mapping is: `green` ≥ 70% completion and no critical blockers; `amber` = 40–69% or active high-priority RAID items; `red` = < 40% or escalated critical items.

**DASH-005** — An active sprint card shall display: sprint name, goal statement, start/end dates, planned vs. completed story points as a progress bar, and a list of the top three blocked work items by priority.

**DASH-006** — All dashboard data shall be derived from the same Zustand stores consumed by the detailed views, ensuring zero data divergence.

**DASH-007** — The dashboard shall update reactively when work items or RAID items are mutated in other tabs (within the same browser session via Zustand store subscription).

#### UI Spec

- Layout: responsive 12-column grid; KPI row spans full width; charts in 2-column layout below; phase bars and sprint card in 2-column layout at bottom
- Colour tokens: `text-success` for green, `text-warning` for amber, `text-danger` for red
- Charts use `Recharts` `ResponsiveContainer` so they adapt to viewport width

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-DASH-1 | Sprint 8 active with 31/48 points | Velocity card shows "31 / 48 pts" |
| AC-DASH-2 | 3 critical RAID items open | KPI card shows badge count 3 |
| AC-DASH-3 | Phase 1 at 42% with 1 escalated item | Phase bar shows Amber |
| AC-DASH-4 | Work item status changed in Kanban | Dashboard blocked count updates without page refresh |

---

### 4.3 Work Breakdown Structure (WBS)

#### Purpose
Provide a structured, hierarchical representation of all delivery work across all phases. The WBS is the single source of truth for the project's scope.

#### Behavioural Spec

**WBS-001** — Work items shall be organised in a tree with the following supported types in order of hierarchy: `phase` → `stream` → `epic` → `story` → `task`. Additionally: `milestone` and `deliverable` as leaf node types.

**WBS-002** — Each node shall display: WBS number, title, status badge, priority indicator, completion percentage, estimated vs. actual hours, assignee avatar, start date, and end date.

**WBS-003** — Nodes of type `phase`, `stream`, and `epic` shall be expandable/collapsible. Collapsed state shall be persisted in the Zustand store across page navigations within the session.

**WBS-004** — `expandAll` and `collapseAll` toolbar actions shall set all expandable nodes to the respective state simultaneously.

**WBS-005** — Clicking any row shall open a detail slide-over panel (640px wide) showing all fields plus: description, dependencies, sprint assignment, story points, and a change log.

**WBS-006** — Right-clicking (or activating the context menu icon on hover) shall present: Edit, Add Child, Duplicate, and Delete. Delete shall prompt a confirmation dialog before executing.

**WBS-007** — Work items shall support the following statuses: `not_started`, `in_progress`, `blocked`, `completed`, `cancelled`. Status changes shall update `updatedAt` and record the actor and timestamp in the change log.

**WBS-008** — A work item may declare `dependencies` as an array of other work item IDs. The system shall render a visual dependency warning if a dependency has `status === "blocked"` and the dependent item is `in_progress`.

**WBS-009** — Milestone nodes shall be visually distinct: diamond icon, no progress bar, no hours fields. They represent a point-in-time gate, not a duration.

**WBS-010** — The WBS shall be the source from which all other views (Gantt, Kanban, Resource) derive their data. There is no separate per-view data store.

#### UI Spec

- Row height: 44px; depth indented by 20px per level (max visual depth: 4)
- Status badge colour: `not_started` → grey, `in_progress` → blue, `blocked` → red, `completed` → green, `cancelled` → muted
- Priority stripe: 3px left border on the row; `critical` → `sdp-red`, `high` → `text-warning`, `medium` → `text-info`, `low` → `text-ink-3`
- Hover state reveals context menu icon (three-dot) at row right edge
- Completion percentage: rendered as a thin progress bar inside the row

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-WBS-1 | Phase node clicked to collapse | All children hidden; expanded state saved |
| AC-WBS-2 | `expandAll` triggered | All phase, stream, epic nodes open |
| AC-WBS-3 | Milestone row rendered | Diamond icon shown; no progress bar rendered |
| AC-WBS-4 | Dependency has `blocked` status | Warning indicator shown on dependent in-progress item |
| AC-WBS-5 | Delete triggered on a task | Confirmation dialog appears before removal |

---

### 4.4 Gantt Chart

#### Purpose
Visualise the entire delivery timeline at multiple zoom levels so the programme manager can track schedule health, identify slippage, and communicate timelines to stakeholders.

#### Behavioural Spec

**GANTT-001** — The chart shall support five zoom levels. Day-width and header behaviour per level:

| Zoom | px / day | Primary Header | Secondary Header |
|---|---|---|---|
| Week | 40 | Month name | Week start dates |
| Month | 20 | Month name | Week dashed separators |
| Quarter | 8 | Quarter label (Q1 2024) | Month abbreviations |
| Semester | 4 | H1/H2 + Year (H1 2024) | Month abbreviations |
| Year | 2 | Year (2024) | Quarter labels (Q1–Q4) |

**GANTT-002** — The chart shall render a two-row SVG header (total height 40px; 20px per row): primary labels in the top row, secondary labels in the bottom row.

**GANTT-003** — Each work item visible in the current WBS expanded state shall be rendered as a horizontal task bar. Bar x-position and width are computed from `startDate`, `endDate`, and the current `dayWidth`.

**GANTT-004** — Task bars shall contain an inner completion fill (width = `completionPct / 100 * barWidth`) rendered in a lighter shade of the bar colour.

**GANTT-005** — Milestone nodes shall render as a diamond (rotated square) centred on their date, not a bar.

**GANTT-006** — A vertical "today" reference line in `sdp-red` shall be rendered at the current date position across the full chart height.

**GANTT-007** — Task bars shall be clickable; clicking shall open the work item detail slide-over (same as WBS-005).

**GANTT-008** — The chart container shall be horizontally scrollable. The left column (WBS labels, 280px fixed) shall remain sticky during horizontal scroll.

**GANTT-009** — Zoom level changes shall preserve the horizontal scroll position such that the "today" line remains in the visible viewport after zoom.

**GANTT-010** — The visible date range shall extend from the earliest `startDate` of any visible work item to the latest `endDate`, with a 14-day buffer on each side.

#### UI Spec

- Left label column: WBS number + title, indented by depth, 280px wide, sticky
- Row height: 36px; alternating row background for readability
- Today line: 1px solid `sdp-red`, full height, z-index above bars
- Zoom buttons: segmented pill group in the toolbar; active = `bg-sdp-red text-white`

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-GANTT-1 | Zoom set to "Year" | Primary header shows years; secondary shows Q1–Q4 |
| AC-GANTT-2 | Zoom set to "Semester" | Primary shows "H1 2024" / "H2 2024" |
| AC-GANTT-3 | Task at 65% complete rendered | Inner fill occupies 65% of bar width |
| AC-GANTT-4 | Milestone item rendered | Diamond shown; no bar |
| AC-GANTT-5 | Current date is within range | Red vertical today line visible |
| AC-GANTT-6 | Left column scroll tested | WBS labels remain sticky during horizontal scroll |

---

### 4.5 Kanban Board

#### Purpose
Manage sprint execution by surfacing work item status as columns and allowing drag-and-drop status transitions. The board is the primary daily-standup artefact.

#### Behavioural Spec

**KANBAN-001** — The board shall display four columns in fixed order: **To Do**, **In Progress**, **Blocked**, **Done**. Column titles map directly to work item statuses: `not_started`, `in_progress`, `blocked`, `completed`.

**KANBAN-002** — Each column shall display a WIP (work-in-progress) limit. Exceeding the limit shall render the column header in a warning colour; it shall not block the drop.

  - To Do: 10 items
  - In Progress: 6 items
  - Blocked: no limit (visibility is the intervention)
  - Done: no limit

**KANBAN-003** — Cards shall be draggable across columns. Dropping a card in a column shall immediately update the work item's `status` in the Zustand store.

**KANBAN-004** — Drag shall be activated only when the pointer has moved at least **6px** from the grab point (activation distance constraint). This prevents accidental drags when clicking cards to open them.

**KANBAN-005** — The drag source element shall become semi-transparent (`opacity: 0.25`) during drag. A drag overlay showing a rotated, scaled-up card (`rotate(1deg) scale(1.03)`) shall follow the cursor.

**KANBAN-006** — Clicking a card (without dragging) shall open the work item detail slide-over.

**KANBAN-007** — Cards within a column shall be reorderable by dragging. The order shall be persisted in the `position` field of `WorkItem`.

**KANBAN-008** — Each card shall display: priority stripe (left border), title, type badge, assignee avatar, story point count, and a blocked indicator icon if `status === "blocked"`.

**KANBAN-009** — A grip icon shall appear on card hover as a visual affordance for dragging. The grip icon itself shall have `pointer-events: none` so it does not intercept drag events from the card wrapper.

**KANBAN-010** — Cards filtered by the active sprint shall be shown by default. A "Show all" toggle shall include items not yet sprint-assigned.

#### UI Spec

- Column width: `calc(25% - 12px)` with 16px gap; minimum 240px
- Card: rounded-xl, border `var(--line)`, bg `var(--card)`, 4px priority stripe on left
- Priority stripe colours: critical → `#E5312B`, high → amber, medium → blue, low → muted
- Drag overlay: `shadow-xl`, `border-sdp-red/40`, `rotate-1`, `scale-[1.03]`
- WIP exceeded: column header badge turns `text-warning bg-warning/10`

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-KANBAN-1 | Card dragged to "In Progress" column | `status` updates to `in_progress` in store |
| AC-KANBAN-2 | Card clicked without drag | Detail slide-over opens; no status change |
| AC-KANBAN-3 | Pointer moved < 6px then released | Treated as click; slide-over opens |
| AC-KANBAN-4 | "In Progress" column at 7 items | Column header shows warning colour |
| AC-KANBAN-5 | Card dragged from "To Do" to "Blocked" | Card appears in Blocked column; priority stripe visible |
| AC-KANBAN-6 | Card in drag state | Source card is 25% opacity; overlay follows cursor |

---

### 4.6 Resource Heatmap

#### Purpose
Give the programme manager a weekly view of each team member's allocation so overloads are caught before they cause delivery risk, not after.

#### Behavioural Spec

**RSRC-001** — The heatmap shall display rows for five configured team members: `usr-001` (Alex Rivera), `usr-003` (Sarah Mitchell), `usr-004` (Marcus Johnson), `usr-005` (Priya Sharma), `usr-006` (Tom Bradley).

**RSRC-002** — The visible week range shall be configurable: 4, 8, 12, or 24 weeks starting from the current Monday. Default: 12 weeks.

**RSRC-003** — Allocation for each person per week shall be computed dynamically:

```
utilisation% = MGMT_BASE[userId] + Σ (task contributions for the week)

task contribution for week i =
  (item.estimatedHours / totalItemDurationMs) × overlapMs / (1000×60×60) / 40 × 100

where:
  overlapMs = min(itemEndDate, weekEnd) − max(itemStartDate, weekStart)
  40 = hours in a full working week
```

**RSRC-004** — Management overhead baselines (meetings, admin, planning) shall be added automatically:
  - Alex Rivera (`usr-001`): 50%
  - Sarah Mitchell (`usr-003`): 55%
  - Marcus Johnson (`usr-004`): 40%
  - Engineers (`usr-005`, `usr-006`): 0% base

**RSRC-005** — Cell colour shall encode utilisation level:

| Range | Background | Text |
|---|---|---|
| 0% | Elevated (no tasks) | Muted |
| 1–50% | `bg-info/20` | `text-info` |
| 51–80% | `bg-success/25` | `text-success` |
| 81–100% | `bg-warning/35` | `text-warning` |
| > 100% | `bg-danger/45` | `text-danger bold` |

**RSRC-006** — Each cell shall display the utilisation percentage. If `utilisation > 0` and the user has tasks that week, a task count indicator (e.g. "3t") shall appear below the percentage in a smaller font.

**RSRC-007** — Hovering a cell shall display a tooltip containing: user name, week date, utilisation percentage, and a bulleted list of all work item titles overlapping that week.

**RSRC-008** — The current week column shall be highlighted with a coloured ring (`border-info/50 ring-1 ring-info/30`) in the column header and all data cells.

**RSRC-009** — A two-level column header shall group weeks under their containing month. The month row shall use `colSpan` equal to the number of weeks partially or fully within that month.

**RSRC-010** — A per-person summary cell at the right of each row shall display: average utilisation (%), peak utilisation (%), and overloaded week count with a warning icon if count > 0.

**RSRC-011** — A team average row at the bottom of the table shall compute the mean utilisation across all displayed team members for each week.

**RSRC-012** — An "At risk only" filter toggle shall, when active, hide rows for team members with zero overloaded weeks.

**RSRC-013** — A risk panel below the table shall list each overloaded member with their peak utilisation, overloaded week count, and up to three task titles causing the overload. When no members are overloaded, a green "All clear" panel shall be shown instead.

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-RSRC-1 | usr-001 (Alex) has no tasks but 50% base | All cells show ≥ 50% |
| AC-RSRC-2 | Priya has 80-hr task spanning 2 weeks | Each week shows ~100% (40h/week ÷ 40 × 100) |
| AC-RSRC-3 | Week range switched to 4W | Table renders 4 week columns only |
| AC-RSRC-4 | Cell hovered with 3 overlapping tasks | Tooltip shows all 3 task names |
| AC-RSRC-5 | Current week identified | Column header and cells show info-coloured ring |
| AC-RSRC-6 | At risk filter on with 1 overloaded member | Only that member's row visible |
| AC-RSRC-7 | No overloaded members | Green "All clear" panel displayed |

---

### 4.7 Developer Workspace

#### Purpose
Eliminate the context-switch between the delivery platform and the engineer's IDE by surfacing Git branch, commit message, and PR metadata directly on the selected task — and simulating the full commit-push-PR flow within the platform.

#### Behavioural Spec

**DEV-001** — The Developer Workspace shall only be active when a work item is selected. An empty state with instructional copy shall be shown otherwise.

**DEV-002** — Selecting a work item shall immediately populate:
  - **Branch name**: derived from the item's `wbsNumber` and `title` in the format `feature/wi-{id}-{kebab-title}` (e.g. `feature/wi-003-biometric-auth-ios`)
  - **Commit message**: derived from item type and title in conventional-commit format (e.g. `feat(ios): implement Face ID / Touch ID via LocalAuthentication API`)

**DEV-003** — Branch name and commit message fields shall be pre-populated on task selection but user-editable. Edits shall persist in the task's local state (not the shared work item store).

**DEV-004** — The "Generate Code" action shall accept a keyword and produce a code template appropriate to the matched category:

| Keyword match | Template category |
|---|---|
| `test`, `spec` | Test file with banking domain fixtures (IBAN, customerId, accountNumber) |
| `auth`, `component`, `portal`, `biometric`, `ui` | React component with Auth0 headers, account display |
| `api`, `route`, `endpoint`, `payment`, `psd2` | Next.js API route with Zod validation, IBAN regex, PSD2 consent reference |
| `service`, `push`, `firebase`, `notification` | Service class with FCM push notification method |
| *(default)* | Utility module with banking-domain schema (customerId, IBAN, channel, currency) |

**DEV-005** — Code generation shall simulate async work through states: `idle` → `generating` → `ready`. State transitions shall be time-delayed to model real code generation.

**DEV-006** — A terminal-style log panel shall render each state transition as a timestamped log line with colour-coded prefixes:
  - `[GIT]` — branch operations
  - `[PUSH]` — remote push confirmation
  - `[PR]` — pull request creation
  - `[QA]` — QA pipeline output
  - `[ERROR]` — failure state (red)

**DEV-007** — The simulated PR shall reference the fake repository `slalom/meridian-bank-digital-platform` and produce a fake PR URL in the format `https://github.com/slalom/meridian-bank-digital-platform/pull/{number}`.

**DEV-008** — When `pr_created` state is reached, a clickable PR link badge shall appear. Clicking shall open the fake URL in a new tab.

**DEV-009** — A "Export to VSCode" action shall open a modal containing the generated code pre-formatted as a VSCode snippet JSON, with a copy-to-clipboard button.

**DEV-010** — The `canCommit` gate shall be true only when: a work item is selected AND status is `qa_passed` AND a commit message is present (either user-entered or auto-populated from the selected item). The `ready` state alone shall NOT unlock the commit button.

**DEV-011** — When code is in `ready` state, a developer-facing **Approve for QA** button shall be displayed. Clicking it shall log an approval line to the terminal and advance status to `dev_approved`, then immediately begin the QA pipeline.

**DEV-012** — The QA pipeline shall run 5 checks sequentially in the following order, each with a fixed simulated duration:

| Order | Check | Duration |
|---|---|---|
| 1 | ESLint — lint source files | ~900 ms |
| 2 | Unit tests & coverage | ~1800 ms |
| 3 | TypeScript type-check | ~700 ms |
| 4 | Security audit / OWASP | ~1200 ms |
| 5 | Production build | ~1400 ms |

Status shall advance to `qa_running` while the pipeline executes.

**DEV-013** — Each QA check shall transition through states `pending → running → passed`. A live checklist panel shall render the current state of all 5 checks simultaneously. Running checks shall display a spinner; passed checks shall display a green tick.

**DEV-014** — Each QA check shall emit at least one realistic terminal log line during its `running` phase (e.g. ESLint: `✓ 0 errors · 0 warnings found across 47 source files`).

**DEV-015** — When all 5 checks reach `passed`, the terminal shall print `✅ QA Gate: PASSED — all checks green` and status shall advance to `qa_passed`. The **Commit & Push** button shall then become active.

#### UI Spec

- Layout: two-panel; left = task context + git controls; right = code editor panel (monospace, dark bg)
- Terminal log: `bg-[#060D1A]` background, `font-mono text-[10px]`, line-by-line append animation
- Branch field: always visible when task selected; `border-sdp-red/30` when populated
- Generate button: disabled + spinner during `generating` state

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-DEV-1 | Task `wi-003` selected | Branch auto-populates as `feature/wi-003-biometric-auth-ios` |
| AC-DEV-2 | Task selected | Commit message pre-populated in conventional-commit format |
| AC-DEV-3 | Keyword "api" entered, Generate clicked | API route template rendered with Zod + IBAN validation |
| AC-DEV-4 | State reaches `pr_created` | PR URL badge appears; correct fake URL shown |
| AC-DEV-5 | No task selected, Commit clicked | Button disabled; `canCommit` is false |
| AC-DEV-6 | "Export to VSCode" clicked | Modal opens with snippet JSON; copy button works |
| AC-DEV-7 | Code in `ready` state | "Approve for QA" button visible; "Commit & Push" disabled |
| AC-DEV-8 | "Approve for QA" clicked | Terminal logs approval; 5 QA checks begin sequentially |
| AC-DEV-9 | QA pipeline running | Checklist shows spinner on active check; prior checks show green tick |
| AC-DEV-10 | All 5 checks pass | Terminal prints `QA Gate: PASSED`; "Commit & Push" button activates |
| AC-DEV-11 | Status is `ready` (not `qa_passed`) | "Commit & Push" button remains disabled |

---

### 4.8 RAID Log

#### Purpose
Maintain a structured, auditable register of all Risks, Assumptions, Issues, and Decisions so the programme team can track, escalate, and resolve governance items transparently with the client.

#### Behavioural Spec

**RAID-001** — Every RAID item shall carry: `id`, `projectId`, `type` (`risk` | `assumption` | `issue` | `decision`), `status` (`open` | `in_progress` | `escalated` | `closed`), `priority` (`critical` | `high` | `medium` | `low`), `title`, `description`, `impact`, `responsePlan`, `owner`, `dueDate`, `tags`, `createdAt`, `updatedAt`.

**RAID-002** — Risk items shall additionally carry: `probability` (`high` | `medium` | `low`).

**RAID-003** — The RAID log page shall display KPI cards: total items, open, escalated, critical, and overdue counts. These shall update reactively when items are mutated.

**RAID-004** — The log shall be filterable by: type (multi-select), status (multi-select), priority (multi-select), and tag (multi-select). Filters shall be combinative (AND logic between filter types).

**RAID-005** — A search input shall filter items by `title` and `description` using case-insensitive substring match.

**RAID-006** — Clicking a row shall open a detail slide-over containing all fields plus: escalation history timeline, closure notes, and linked work items.

**RAID-007** — An "Escalate" action shall be available on items with `status !== "closed"`. Escalating shall: set `status` to `escalated`, prompt for escalation level (`team` | `pm` | `program` | `executive` | `client`) and SLA hours, and create an `Escalation` record linked to the item.

**RAID-008** — Escalations shall track: `raidItemId`, `level`, `assignedTo` (user), `slaHours`, `createdAt`, and `resolvedAt`. The SLA status (within / breached) shall be computed from `createdAt + slaHours` vs. current time.

**RAID-009** — Closing an item shall require a `closureNote`. Closed items shall be visually demoted (muted row) but remain searchable and filterable.

**RAID-010** — The log shall be exportable to CSV including all visible columns after active filters are applied.

**RAID-011** — RAID KPI counts shall be scoped to the active `projectId`. The store selector `useRaidKPIs(projectId)` shall return: total, open, escalated, critical, overdue, and per-type counts.

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-RAID-1 | Filter by type "risk" | Only risk items visible |
| AC-RAID-2 | Filter by priority "critical" AND type "issue" | Only critical issues shown |
| AC-RAID-3 | Item escalated | Status → `escalated`; Escalation record created with SLA |
| AC-RAID-4 | Escalation SLA breached | SLA indicator shows "Breached" in danger colour |
| AC-RAID-5 | Close item without closure note | Save blocked; validation error shown |
| AC-RAID-6 | Export to CSV triggered | File downloaded; only filtered rows included |

---

### 4.9 Sprint Management

#### Purpose
Structure delivery into fixed-length iterations, track sprint goals and velocity, and provide the basis for capacity planning.

#### Behavioural Spec

**SPRINT-001** — Each sprint shall carry: `id`, `projectId`, `name`, `goal`, `status` (`planning` | `active` | `review` | `closed`), `startDate`, `endDate`, `plannedPoints`, `completedPoints`, `velocity`.

**SPRINT-002** — Only one sprint per project may have `status === "active"` at any time.

**SPRINT-003** — Work items may be assigned to a sprint via the `sprintId` field. The sprint planning view shall display all work items assigned to the selected sprint grouped by assignee.

**SPRINT-004** — `moveToSprint(itemId, sprintId)` shall update `WorkItem.sprintId` and be callable from both the sprint planning page and the Kanban board context menu.

**SPRINT-005** — Velocity shall be computed at sprint close as: `completedPoints / plannedPoints × 100`. Historical velocity shall feed the velocity trend chart on the overview dashboard.

**SPRINT-006** — The active sprint card shall display days remaining as a countdown and a burn-down indicator (story points remaining vs. ideal burn line).

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-SPRINT-1 | Sprint 8 active | No other sprint has `status === "active"` |
| AC-SPRINT-2 | Work item moved to Sprint 9 | Item's `sprintId` updated; appears in Sprint 9 planning list |
| AC-SPRINT-3 | Sprint 8 closed with 31/48 pts | Velocity computed as 64.6%; stored in sprint record |

---

### 4.10 Escalation Tracker

#### Purpose
Provide a dedicated view of all active and historical escalations so the programme manager can track SLA compliance and resolution progress without scanning the full RAID log.

#### Behavioural Spec

**ESC-001** — The escalation tracker shall list all escalations grouped by level: `team`, `pm`, `program`, `executive`, `client`.

**ESC-002** — Each escalation card shall show: linked RAID item title and priority, assigned-to user name, SLA target datetime, elapsed time, and status (Open / Resolved).

**ESC-003** — SLA computation: `slaDeadline = createdAt + slaHours`. If `now > slaDeadline` and `resolvedAt` is null, the escalation is **Breached**. If `now ≤ slaDeadline`, it is **Within SLA**. If `resolvedAt` is set, it is **Resolved**.

**ESC-004** — Resolving an escalation shall require a resolution note and shall set `resolvedAt` to the current timestamp.

**ESC-005** — The page shall display a summary count of: total active escalations, breached SLAs, and resolved this week.

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-ESC-1 | `esc-001` created 60 hrs ago with 48-hr SLA | Shows "Breached" in danger colour |
| AC-ESC-2 | `esc-002` created 12 hrs ago with 24-hr SLA | Shows "Within SLA" with countdown |
| AC-ESC-3 | Escalation resolved | `resolvedAt` set; card shows "Resolved" state |

---

### 4.11 Retrospectives

#### Purpose
Capture sprint and milestone retrospective data to drive continuous improvement across the engagement.

#### Behavioural Spec

**RETRO-001** — Retros shall be scoped to either a sprint or a milestone. Each retro shall carry: `id`, `projectId`, `scopeType` (`sprint` | `milestone`), `scopeId`, `status` (`draft` | `active` | `closed`), `items`, `actionItems`, `createdAt`.

**RETRO-002** — Retro items shall use the four-quadrant format: **Went Well**, **Needs Improvement**, **Action Items**, **Kudos**. Each item carries: `quadrant`, `text`, `votes`, `author`.

**RETRO-003** — During an active retro, participants may add items and cast votes. Voting shall be anonymous (vote count shown, not voter identity).

**RETRO-004** — Action items generated from retros shall carry an owner, due date, and status (`open` | `done`), and shall be exported to the next sprint planning session.

---

### 4.12 Admin Panel

#### Purpose
Allow platform administrators to provision users, manage roles, configure projects, review the audit log, and control feature flag rollouts.

#### Behavioural Spec

**ADMIN-001** — Access to `/admin/**` shall be restricted to users with `admin` or `super_admin` roles. All other roles receive a 403 page.

**ADMIN-002** — The **Users** page shall list all users in the organisation with their name, email, role, last active date, and an "Edit Role" inline action.

**ADMIN-003** — The **Audit Log** page shall display an immutable, append-only log of all write operations across the platform. Each entry: actor (user name + role), action verb, resource type, resource ID, before/after JSON diff, IP address, and timestamp. The log shall not be editable or deletable by any role including `super_admin`.

**ADMIN-004** — The **Feature Flags** page shall list all registered flags with: key, description, enabled state (toggle), and rollout percentage (0–100%). Saving a flag change shall write to the audit log.

**ADMIN-005** — The **Roles** page shall display the role-to-permission matrix as a read-only table. In v1.0, role permissions are code-defined and not runtime-configurable.

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-ADMIN-1 | `team_member` navigates to `/admin` | 403 Forbidden view; no admin content visible |
| AC-ADMIN-2 | User role changed | Audit log entry created; actor and diff recorded |
| AC-ADMIN-3 | Attempt to delete audit log entry | No delete action available in the UI or API |
| AC-ADMIN-4 | Feature flag rollout set to 50% | Flag record saved; audit entry created |

---

### 4.13 Project Artifacts Hub

#### Purpose
Centralise all project-level governance documents — Project Charter, Statement of Work, PRD, Architecture Decisions — in a single hub within the platform, so the delivery team and client stakeholders have one authoritative source for all artefacts. Documents are directly linkable to work items, closing the traceability gap between requirements and delivery.

#### Behavioural Spec

**DOC-001** — The platform shall provide a dedicated route `/documents` accessible from the Delivery section of the sidebar navigation.

**DOC-002** — The hub shall display a **gallery view** of all project documents as a card grid (3 columns on large viewports). Each card shall display: document type (icon + colour-coded label), title, status badge, version, author avatar + name, last updated date, and linked work items count.

**DOC-003** — Documents shall support six types: `charter` | `sow` | `prd` | `architecture` | `meeting_notes` | `change_request`. Each type shall have a distinct icon, colour, and label.

**DOC-004** — Documents shall have four statuses: `draft` | `review` | `approved` | `archived`. Status shall be changeable via an inline dropdown in the editor without navigating away.

**DOC-005** — A "New Document" button shall open a type-selection dropdown menu. Selecting a type shall create a blank document with a default template and immediately open the WYSIWYG editor.

**DOC-006** — The gallery shall support filtering by document type. Selecting a type filter shall show only documents of that type. The "All" filter shall show all documents.

**DOC-007** — The WYSIWYG editor shall open when a document card is clicked. The editor shall be a full-page layout with: a top bar, a formatting toolbar, an author info bar, a main `contentEditable` content area, and a right metadata sidebar.

**DOC-008** — The formatting toolbar shall provide the following formatting commands via `document.execCommand`:

| Button | Command | Effect |
|---|---|---|
| Bold | `bold` | Wraps selection in `<strong>` |
| Italic | `italic` | Wraps selection in `<em>` |
| Underline | `underline` | Wraps selection in `<u>` |
| H1 / H2 / H3 | `formatBlock` | Wraps paragraph as heading element |
| Bullet list | `insertUnorderedList` | Creates or continues `<ul>` |
| Numbered list | `insertOrderedList` | Creates or continues `<ol>` |
| Horizontal rule | `insertHorizontalRule` | Inserts `<hr>` |
| Link | `createLink` | Prompts for URL; wraps selection in `<a>` |

**DOC-009** — The document title shall be editable inline via a text input in the top bar. Title and content changes shall set the "Unsaved changes" indicator. The Save button shall call `updateDocument(id, { title, content })` and show a "Saved" flash for 2 seconds.

**DOC-010** — The initial content of the `contentEditable` div shall be set via a `useEffect` that fires on `docId` change, writing directly to `editorRef.current.innerHTML`. React shall not control the contentEditable's children after mount to prevent re-render conflicts.

**DOC-011** — The metadata sidebar shall display: type, version, created date, author (avatar + title), reviewers list, and linked work items. Each linked work item shall have a hover-revealed `Unlink` button that calls `documentStore.unlinkWorkItem(docId, workItemId)`.

**DOC-012** — The Meridian Bank deployment shall include four pre-loaded documents with authentic content: Project Charter (Approved, v2.0), Statement of Work (Approved, v1.2), PRD (In Review, v1.5), and Architecture Document (Draft, v0.8).

**DOC-013** — All document mutations (create, update, status change, link/unlink) shall be persisted to `localStorage` via Zustand `persist` middleware under key `sdp-documents-v1`.

#### UI Spec

- Gallery card: coloured type strip header (bg matches type colour at 10% opacity), card body with title + metadata, hover lifts card with `shadow-lg` and `border-sdp-red/30`
- Editor content area: `max-w-3xl mx-auto`, `min-h-[600px]`, Tailwind `[&_h1]:`, `[&_table]:` arbitrary variants for prose styles
- Status picker: coloured pill with `ChevronDown` icon; click-outside via fixed `inset-0 z-40` overlay
- Metadata sidebar: `w-64 shrink-0`, `border-l border-[var(--line)]`

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-DOC-1 | Gallery loads | 4 pre-loaded Meridian Bank documents shown |
| AC-DOC-2 | Filter set to "PRD" | Only PRD documents visible |
| AC-DOC-3 | "New Document → Architecture" clicked | Editor opens with blank template; status "Draft" |
| AC-DOC-4 | Bold applied to selected text | Selection wrapped in `<strong>`; toolbar button highlighted |
| AC-DOC-5 | Title edited in top bar | "Unsaved changes" indicator appears |
| AC-DOC-6 | Save button clicked | `updateDocument` called; "Saved" flash appears; indicator clears |
| AC-DOC-7 | Status changed to "Approved" | Badge updates immediately; change persisted to store |
| AC-DOC-8 | Work item unlinked from sidebar | Item removed from linked list; `unlinkWorkItem` called |
| AC-DOC-9 | Page refreshed | Documents rehydrated from `sdp-documents-v1` localStorage |

---

### 4.14 Work Item Wizard

#### Purpose
Replace the single-step slide-over form with a structured 4-step wizard that collects richer metadata at item creation time — including team assignment, timeline estimation, and document linkage — reducing incomplete items entering the WBS and closing the traceability loop between requirements documents and delivery tasks.

#### Behavioural Spec

**WIZ-001** — The Work Item Wizard shall be a centred Dialog modal (`max-w-2xl`) opened from the "Add Item" button on the Project Schedule page. It shall replace the previous `WorkItemForm` slide-over.

**WIZ-002** — The wizard shall display a horizontal step indicator at the top of the dialog showing 4 steps: Basics, Timeline, Team, Documents. Each step shows: a numbered circle (active = `sdp-red` filled; completed = `success`-coloured check icon; pending = muted border), step label below, connecting progress line between steps.

**WIZ-003 — Step 1 (Basics)** shall collect:
- **Title** (text input, required — `Next` is blocked if empty)
- **Type** (7-item icon grid: Phase, Stream, Epic, Story, Task, Milestone, Deliverable; pre-selected from view context)
- **Priority** (4-button row: Critical / High / Medium / Low with type-specific colour coding; default: Medium)
- **Description** (3-row textarea, optional)

**WIZ-004 — Step 2 (Timeline)** shall collect:
- **Start Date** (date input, required — `Next` blocked if empty)
- **End Date** (date input, required; must be ≥ Start Date; blocked with error message if violated)
- **Estimated Hours** (number input, optional)
- **Story Points** (Fibonacci button row: 1 2 3 5 8 13 21; tap to select; optional)
- **Initial Completion %** (range slider 0–100 step 5; default 0; current value displayed above slider)

**WIZ-005 — Step 3 (Team)** shall collect:
- **Assignee** (grid: "Unassigned" + one button per team member with avatar and first name; selected member shown with `sdp-red` border and background)
- **Sprint** (select dropdown of project sprints; active and planning sprints labelled; default: active sprint if one exists)
- **Parent Item** (select dropdown of Phase/Stream/Epic items for hierarchy placement; default: none)
- **Dependencies** (scrollable checkbox list of up to 12 existing work items; checked items added to `dependencies[]`)

**WIZ-006 — Step 4 (Link Document)** shall display:
- Explanatory copy about what linking does
- A radio list: "No document link" (default) + one card per project document
- Each card: type label + status badge + title + linked items count
- Selected card: `sdp-red/5` background + `sdp-red/40` border

**WIZ-007** — The "Create Item" button shall be active on Step 4 when `title.trim()` is non-empty. Clicking it shall:
1. Call `generateWbsNumber(workItems, parentId, projectId)` to compute the correct WBS number
2. Call `scheduleStore.addWorkItem({ ...fields, wbsNumber })` — returns the created `WorkItem`
3. If a document was selected in Step 4, call `documentStore.linkWorkItem(docId, item.id)`
4. Reset all form state to defaults
5. Close the dialog

**WIZ-008** — Validation shall be enforced per-step when "Next" is clicked. Validation errors shall appear as red text below the offending field. The step shall not advance until all required fields in the current step are valid.

**WIZ-009** — Each step shall have "Back" (from steps 2–4) and "Next" (steps 1–3) / "Create Item" (step 4) navigation buttons in the dialog footer. A "Step N of 4" label shall appear at the left of the footer.

**WIZ-010** — Closing the dialog (X button, Escape key, or backdrop click) shall reset all form state before closing, so a subsequent open starts fresh.

#### UI Spec

- Dialog: `max-w-2xl`, `bg-surface`, `rounded-xl shadow-2xl`
- Step circle: `h-7 w-7`, active = `bg-sdp-red text-white`, completed = `bg-success/10 border-success text-success`, pending = `bg-elevated border-[var(--line)] text-ink-3`
- Type grid: 4-column, `rounded-xl border`, selected = `border-sdp-red/50 bg-sdp-red/5 text-sdp-red`
- Priority buttons: flex row, `flex-1`, selected = type-specific bg/border/text colours
- Fibonacci buttons: `h-8 w-9 rounded-lg`, selected = `bg-sdp-red text-white`
- Assignee grid: 3-column, `rounded-xl border`, selected = `border-sdp-red/40 bg-sdp-red/5`

#### Acceptance Criteria

| ID | Condition | Expected Result |
|---|---|---|
| AC-WIZ-1 | "Add Item" button clicked | Wizard opens at Step 1 |
| AC-WIZ-2 | "Next" clicked with empty title | Error shown; step does not advance |
| AC-WIZ-3 | End Date set before Start Date | Error "End must be after start date"; step blocked |
| AC-WIZ-4 | Story point "8" clicked | Button filled with `sdp-red`; field value = 8 |
| AC-WIZ-5 | Team member selected in Step 3 | Avatar highlighted; `assigneeId` set to their ID |
| AC-WIZ-6 | Document card selected in Step 4 | Card highlighted; radio checked |
| AC-WIZ-7 | "Create Item" clicked with doc link | Work item created in scheduleStore; `linkWorkItem` called on documentStore |
| AC-WIZ-8 | "Create Item" clicked without doc link | Work item created; `linkWorkItem` not called |
| AC-WIZ-9 | Dialog closed mid-wizard | State reset; next open starts at Step 1 with empty fields |
| AC-WIZ-10 | WBS number generated | Item has correct dotted notation (e.g. "2.1.4") relative to parent |

---

## 5. Data Models

All models are defined in TypeScript and enforced at runtime via Zod schemas. The following are the canonical type definitions.

### 5.1 WorkItem

```typescript
interface WorkItem {
  id:             string               // UUID, generated on create
  projectId:      string               // Foreign key → Project
  parentId:       string | null        // Self-referential tree parent
  wbsNumber:      string               // e.g. "1.2.3" — computed from tree position
  title:          string               // Required, max 120 chars
  description:    string               // Rich text / Markdown
  type:           WorkItemType         // phase | stream | epic | story | task | milestone | deliverable
  status:         WorkItemStatus       // not_started | in_progress | blocked | completed | cancelled
  priority:       Priority             // critical | high | medium | low
  completionPct:  number               // 0–100; integer
  estimatedHours: number               // Planned effort in hours
  actualHours:    number               // Logged effort in hours
  storyPoints:    number | null        // Fibonacci: 1,2,3,5,8,13,21
  startDate:      string               // ISO 8601 date string
  endDate:        string               // ISO 8601 date string
  assigneeId:     string | null        // Foreign key → User
  sprintId:       string | null        // Foreign key → Sprint
  dependencies:   string[]             // WorkItem IDs this item depends on
  position:       number               // Ordering within parent (for Kanban / WBS sort)
  color:          string | null        // Hex colour for Gantt bar
  tags:           string[]
  createdAt:      string               // ISO 8601 datetime
  updatedAt:      string               // ISO 8601 datetime
}
```

### 5.2 Sprint

```typescript
interface Sprint {
  id:              string
  projectId:       string
  name:            string              // e.g. "Sprint 8"
  goal:            string              // Sprint goal narrative
  status:          SprintStatus        // planning | active | review | closed
  startDate:       string
  endDate:         string
  plannedPoints:   number
  completedPoints: number
  velocity:        number | null       // Computed on close: completedPoints / plannedPoints * 100
}
```

### 5.3 RaidItem

```typescript
interface RaidItem {
  id:           string
  projectId:    string
  type:         RaidType              // risk | assumption | issue | decision
  status:       RaidStatus            // open | in_progress | escalated | closed
  priority:     Priority
  title:        string
  description:  string
  impact:       string
  probability:  "high" | "medium" | "low" | null   // risks only
  responsePlan: string
  owner:        string                // Free-text owner name
  dueDate:      string | null
  tags:         string[]
  escalatedAt:  string | null
  closedAt:     string | null
  closureNote:  string | null
  createdAt:    string
  updatedAt:    string
}
```

### 5.4 Escalation

```typescript
interface Escalation {
  id:          string
  raidItemId:  string
  level:       "team" | "pm" | "program" | "executive" | "client"
  assignedTo:  string                 // User ID
  slaHours:    number
  note:        string
  resolvedAt:  string | null
  resolution:  string | null
  createdAt:   string
}
```

### 5.5 User

```typescript
interface User {
  id:        string
  name:      string
  email:     string
  role:      UserRole
  title:     string                   // Job title display string
  avatar:    string | null            // URL or null (initials fallback)
  orgId:     string
  lastActive: string | null
}
```

### 5.6 Project

```typescript
interface Project {
  id:          string
  workspaceId: string
  name:        string
  description: string
  status:      "planning" | "active" | "on_hold" | "completed" | "cancelled"
  health:      "green" | "amber" | "red" | "grey"
  budget:      number                 // USD
  startDate:   string
  endDate:     string
  methodology: "agile" | "waterfall" | "hybrid"
  createdAt:   string
  updatedAt:   string
}
```

---

## 6. API Contracts

The following contracts define the shape of all write operations. In v1.0 these are enforced client-side via Zod; in v2.0 they will be enforced at the API layer.

### 6.1 Create Work Item

```typescript
// POST /api/projects/:projectId/work-items
const CreateWorkItemSchema = z.object({
  parentId:       z.string().nullable().default(null),
  title:          z.string().min(1).max(120),
  type:           z.enum(["phase","stream","epic","story","task","milestone","deliverable"]),
  status:         z.enum(["not_started","in_progress","blocked","completed","cancelled"])
                   .default("not_started"),
  priority:       z.enum(["critical","high","medium","low"]).default("medium"),
  estimatedHours: z.number().min(0).default(0),
  storyPoints:    z.number().nullable().optional(),
  startDate:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  assigneeId:     z.string().nullable().optional(),
  sprintId:       z.string().nullable().optional(),
  dependencies:   z.array(z.string()).default([]),
  color:          z.string().regex(/^#[0-9A-Fa-f]{6}$/).nullable().optional(),
  tags:           z.array(z.string()).default([]),
})
```

### 6.2 Create RAID Item

```typescript
// POST /api/projects/:projectId/raid
const CreateRaidItemSchema = z.object({
  type:         z.enum(["risk","assumption","issue","decision"]),
  priority:     z.enum(["critical","high","medium","low"]),
  title:        z.string().min(1).max(200),
  description:  z.string().min(1),
  impact:       z.string().min(1),
  probability:  z.enum(["high","medium","low"]).nullable().optional(),
  responsePlan: z.string().min(1),
  owner:        z.string().min(1),
  dueDate:      z.string().nullable().optional(),
  tags:         z.array(z.string()).default([]),
})
```

### 6.3 Banking Domain API Route (Code Generation Template)

```typescript
// Template used in Developer Workspace code generation for API/payment/PSD2 keywords
// POST /api/accounts
const CreateAccountSchema = z.object({
  customerId:    z.string().min(1),
  accountNumber: z.string().regex(/^[A-Z]{2}[0-9A-Z]{13,30}$/, "IBAN format required"),
  channel:       z.enum(["mobile","web","api"]).default("mobile"),
  currency:      z.string().length(3).default("GBP"),
  consentRef:    z.string().optional(),    // PSD2 consent reference
  metadata:      z.record(z.unknown()).optional().default({}),
})

// Roles with access: project_manager, admin, super_admin, compliance_officer
// DELETE: soft-close only — UPDATE SET status = 'closed' (no hard delete on financial records)
```

### 6.4 Standard Response Envelope

```typescript
interface ApiResponse<T> {
  success:  boolean
  data:     T | null
  error:    string | null
  meta?: {
    total:  number
    page:   number
    limit:  number
  }
}
```

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Requirement |
|---|---|
| Initial page load (LCP) | ≤ 2.5 seconds on 50 Mbps connection |
| Schedule view render (300 work items) | ≤ 500ms to interactive |
| Gantt SVG re-render on zoom change | ≤ 100ms |
| Kanban drag response (card pickup) | ≤ 16ms (single frame at 60 fps) |
| Resource heatmap computation (12W × 5 members) | ≤ 50ms via `useMemo` |
| Store mutation → UI update latency | ≤ 32ms (Zustand synchronous commit) |

### 7.2 Accessibility

- All interactive elements shall be keyboard navigable (Tab, Enter, Space, Arrow keys)
- Drag-and-drop actions shall have keyboard alternatives (context menu for status change)
- Colour shall never be the sole carrier of information (status badges include text labels)
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text (WCAG 2.1 AA)
- All form fields shall have associated `<label>` elements or `aria-label` attributes
- The Gantt SVG shall provide `role="img"` with `aria-label` for screen-reader users

### 7.3 Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 120 |
| Firefox | 121 |
| Safari | 17 |
| Edge | 120 |
| Mobile Safari (iOS) | 17 |
| Chrome Android | 120 |

### 7.4 Scalability

- The WBS tree renderer shall handle up to 500 work items without virtual scrolling degradation
- The Gantt chart shall render up to 500 task bars in SVG without frame drops at quarter zoom level
- The RAID log shall filter and sort up to 1,000 items client-side in < 200ms
- Zustand stores with `persist` shall not write payloads > 2MB to `localStorage`

### 7.5 Reliability

- All Zustand mutations shall be wrapped in try/catch; failures shall surface user-visible toast notifications
- Optimistic UI updates shall be applied immediately; on failure the store shall be rolled back to pre-mutation state
- The `persist` middleware versioned key ensures that schema-breaking changes do not cause silent data corruption — the store reinitialises from defaults

---

## 8. Compliance & Security

### 8.1 Regulatory Context

The platform is a **delivery management tool** — it does not process, store, or transmit Meridian Bank customer financial data. However, it operates within Meridian Bank's regulatory environment and must comply with their information security policies.

| Regulation | Applicability | Requirement |
|---|---|---|
| PCI-DSS Level 1 | Indirect — platform used to track PCI scope items | No cardholder data may appear in work item descriptions or RAID log fields |
| PSD2 (EU) | Referenced in work items and RAID — not directly regulated | PSD2 credentials (client_id, client_secret, MTLS certs) must not be stored in the platform |
| OWASP ASVS Level 2 | Applies to the platform itself | Penetration test required before public deployment |
| Meridian Bank ISMS | Contractual | Platform must be deployed within approved cloud region (EU-West) |

### 8.2 Input Validation

- All user inputs shall be validated with Zod schemas before being written to state or sent to an API
- Rich text fields (description, impact, responsePlan) shall sanitise HTML to prevent XSS
- Date fields shall validate ISO 8601 format and reject dates more than 10 years in the past or future
- No field shall accept SQL-like syntax; queries use typed Zustand selectors, not string interpolation

### 8.3 Authentication Security

- Session tokens shall be stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies (not `localStorage`) in the production deployment
- Demo mode (slalom@slalom.com) is gated by `NODE_ENV !== "production"` check
- Password fields shall never be logged, serialised to state, or included in error messages
- All admin operations shall re-verify role on the server at the API layer, not solely in client guards

### 8.4 Audit Trail

- All create, update, delete, and role-change operations shall write an immutable audit entry
- Audit entries shall record: actor ID, action, resource type, resource ID, timestamp, and a JSON diff of before/after state
- The audit log shall be stored separately from mutable application state and shall not be purgeable by any application role

### 8.5 Secrets Management

- No API keys, client secrets, or credentials shall be committed to the repository
- Environment variables required at runtime: `AUTH_SECRET`, `DATABASE_URL`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
- The `.env` file is `.gitignore`-listed; `.env.example` with placeholder values is committed instead

---

## 9. Acceptance Criteria Matrix

This matrix maps each major feature specification to its test coverage requirements.

| Feature | Spec IDs | Required Unit Tests | Required Integration Tests | Required E2E Tests |
|---|---|---|---|---|
| Authentication | AUTH-001 to 007 | Role guard logic | Session persistence, redirect behaviour | Login flow; 403 enforcement |
| Dashboard | DASH-001 to 007 | KPI computation, RAG logic | Store-to-chart data binding | Dashboard renders correct health |
| WBS Tree | WBS-001 to 010 | Node expand/collapse state | Context menu CRUD | Add child → appears in tree |
| Gantt Chart | GANTT-001 to 010 | Day-width math, date positioning | Zoom level header rendering | Task bars render at correct positions |
| Kanban Board | KANBAN-001 to 010 | WIP limit computation | Status mutation on drop | Drag card → status updates |
| Resource Heatmap | RSRC-001 to 013 | Allocation formula, overlap math | Management base overlay | Overloaded member appears in risk panel |
| Developer Workspace | DEV-001 to 010 | Branch/commit derivation, keyword matching | State machine transitions | Full commit-push-PR flow |
| RAID Log | RAID-001 to 011 | KPI selector, filter logic | Escalation creation + SLA math | Close item with closure note |
| Sprint | SPRINT-001 to 006 | Velocity computation | moveToSprint mutation | Sprint reassignment reflected in board |
| Escalations | ESC-001 to 005 | SLA breach computation | Escalation resolve mutation | Breached SLA shown in danger colour |
| Admin Panel | ADMIN-001 to 005 | Role access guard | Audit log entry on write | Non-admin blocked from `/admin` |

### Test Coverage Requirement

Minimum **80%** line coverage for:
- All Zustand store action functions
- All Zod schema validators
- All utility functions in `lib/utils.ts`
- All selector functions (`useRaidKPIs`, `useRaidItems`, schedule selectors)

E2E tests (Playwright) shall cover all **critical user paths**:
1. Login → View dashboard → Navigate to schedule
2. Create work item → Assign to sprint → Move to In Progress on Kanban
3. Create RAID item → Escalate → Verify SLA countdown
4. Select task in Developer Workspace → Generate code → Export to VSCode
5. Admin: Change user role → Verify audit log entry

---

## 10. Glossary

| Term | Definition |
|---|---|
| **AIS** | Account Information Service — PSD2-defined API enabling licensed third parties to read bank account data |
| **Auth0** | Cloud identity provider replacing Meridian Bank's legacy LDAP; supports OIDC, MFA (TOTP/SMS), and biometric passkeys |
| **BioCatch** | Behavioural biometrics vendor whose SDK is integrated into the Meridian mobile app for continuous authentication |
| **Burn-down** | Chart showing remaining story points in a sprint over time vs. an ideal linear burn rate |
| **Conventional Commits** | Commit message format: `type(scope): description`. Types: feat, fix, refactor, docs, test, chore, perf |
| **dnd-kit** | Accessibility-first drag-and-drop library for React used in the Kanban board |
| **FCM** | Firebase Cloud Messaging — Google's push notification service for Android devices |
| **IBAN** | International Bank Account Number — standard format `[A-Z]{2}[0-9A-Z]{13,30}` used in all banking domain code templates |
| **LocalAuthentication** | Apple iOS framework for Face ID / Touch ID biometric authentication |
| **MGMT_BASE** | Per-person management overhead percentage added to resource utilisation before task allocations (Alex 50%, Sarah 55%, Marcus 40%) |
| **Milestone** | Point-in-time gate in the WBS; rendered as a diamond on the Gantt chart; has no duration or hours |
| **MFA** | Multi-Factor Authentication — TOTP (time-based one-time password) and SMS OTP for online banking portal login |
| **MTLS** | Mutual TLS — certificate-based authentication required for PSD2 API client identification |
| **NCC Group** | External security vendor contracted to perform the OWASP ASVS Level 2 penetration test before M2 go-live |
| **OIDC** | OpenID Connect — identity layer on top of OAuth 2.0 used for Auth0 SSO integration |
| **APNs** | Apple Push Notification service — Apple's infrastructure for delivering push notifications to iOS devices |
| **PCI-DSS** | Payment Card Industry Data Security Standard — Level 1 certification required for the payment tokenisation vendor |
| **PIS** | Payment Initiation Service — PSD2-defined API enabling licensed third parties to initiate payments from bank accounts |
| **PSD2** | Payment Services Directive 2 (EU) — regulation mandating open banking APIs and strong customer authentication |
| **RAG** | Red/Amber/Green — three-state health indicator used on the overview dashboard |
| **RAID** | Risks, Assumptions, Issues, Decisions — the four categories of governance log items |
| **RSC** | React Server Component — Next.js rendering mode where component runs on the server; no client JS shipped |
| **SDD** | Spec-Driven Development — methodology where specifications are written before implementation and serve as binding contracts |
| **SLA** | Service Level Agreement — time-bound commitment for escalation resolution (e.g. 24-hour SLA for PM-level escalation) |
| **SDP** | Slalom Delivery Platform — the internal name for this project management platform |
| **Temenos T24** | Core banking system used by Meridian Bank; subject to a 200 req/min API rate limit |
| **TestFlight** | Apple's beta distribution platform used as the M1 milestone delivery vehicle before public App Store release |
| **TOTP** | Time-Based One-Time Password — authenticator app–based second factor (RFC 6238) |
| **TPP** | Third-Party Provider — licensed fintech accessing Meridian Bank APIs under PSD2 |
| **Velocity** | Sprint metric: `completedPoints / plannedPoints × 100`; used to forecast future sprint capacity |
| **WBS** | Work Breakdown Structure — hierarchical decomposition of all project scope into manageable work items |
| **WIP Limit** | Work-in-progress limit on a Kanban column; exceeded limit is a visual warning, not a hard block |
| **Zustand** | Lightweight React state management library; `persist` middleware syncs state to `localStorage` |

---

*Document prepared by Slalom Consulting — Digital & Technology Practice*
*For internal use and Meridian Bank programme governance only*
*Version 1.0.0 — May 2026*
