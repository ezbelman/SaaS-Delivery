# Product Requirements Document
## Slalom Delivery Platform (SDP)

**Version:** 1.7
**Last Updated:** 2026-05-20
**Owner:** Slalom Consulting — Delivery Excellence
**Status:** Active Development
**Client Engagement:** Meridian Bank — Digital Banking Transformation

> **Related documents:**
> - [`SDD-meridian-bank.md`](./SDD-meridian-bank.md) — Spec-Driven Development specification (behavioural specs, data models, acceptance criteria)

---

## 1. Overview

The **Slalom Delivery Platform (SDP)** is an enterprise program management tool designed for Slalom consultants and their clients. It consolidates every aspect of project delivery — from WBS planning and sprint tracking to stakeholder management and full developer code delivery — into a single, cohesive workspace aligned with Slalom's brand identity.

The platform is currently deployed for the **Meridian Bank Digital Banking Transformation** programme, a $5.8M engagement running February–December 2024 across three delivery streams: Mobile Banking App, Online Banking Portal, and Open Banking API Gateway.

### 1.1 Goals

- Provide a single source of truth for enterprise delivery programmes
- Reduce context switching for delivery teams (PM, Scrum Master, Developer, Client)
- Visualise delivery health in real time across all tracks
- Enable developers to ship code directly from task context, including IDE handoff
- Support hybrid delivery methodology (Agile + Waterfall)
- Surface RAID governance with escalation chains auditable by the client

### 1.2 Target Users

| Role | Primary Use |
|------|-------------|
| Program Manager | Executive dashboard, RAID log, programme health |
| Project Manager | WBS, Gantt, resource allocation, escalations |
| Scrum Master | Sprint planner, Kanban board, velocity, retrospectives |
| Developer | Developer Workspace, code generation, git flow, VS Code handoff |
| Client Viewer | Read-only executive view (dashboard + RAID summary) |

### 1.3 Current Engagement — Meridian Bank

| Field | Value |
|---|---|
| Client | Meridian Bank (Digital & Innovation) |
| Budget | $5.8M |
| Timeline | Feb 2024 – Dec 2024 |
| Methodology | Hybrid (Agile + Waterfall) |
| Health | Amber |
| Active Sprint | Sprint 8 — Biometric login & OAuth staging fix |
| Fake repo | `slalom/meridian-bank-digital-platform` |
| Demo login | `slalom@slalom.com` / `slalom123` |

---

## 2. Feature Set

### 2.1 Authentication & Access Control

- Email / password login (`slalom@slalom.com / slalom123` for demo)
- Role-based access: `super_admin`, `admin`, `program_manager`, `project_manager`, `scrum_master`, `team_member`, `client_viewer`
- Role simulation (admin can impersonate other roles)
- Protected routes via Next.js `AuthGuard` component wrapping `(platform)` layout
- Admin routes additionally gated at `(admin)` layout level — non-admin roles receive 403 view

### 2.2 Platform Overview (Home Dashboard)

- Programme health scorecard (RAG status, budget, schedule, scope)
- KPI cards: sprint velocity (current vs. planned pts), open RAID items, active blockers, budget burn
- Velocity trend chart — dual-line chart: planned vs. completed story points, last 4 sprints (S5–S8)
- Risk trend chart — open vs. cumulative closed RAID items over 6-week rolling window
- Phase RAG health bars — Green ≥ 70% + no critical blockers; Amber = 40–69% or high RAID; Red = < 40% or escalated items
- Active sprint card: goal, dates, planned/completed points progress bar, top 3 blocked items
- All data reactive to Zustand store mutations (no page refresh required)

### 2.3 Project Schedule — 5 Views

Accessed from the **Delivery → Project Schedule** nav item. A tab bar switches between views; the active sprint indicator is always visible in the header.

#### 2.3.1 Work Breakdown Structure (WBS)

- Hierarchical tree with expand/collapse per node
- Item types: Phase → Stream → Epic → Story → Task / Milestone / Deliverable
- WBS number auto-generation (hierarchical `1.2.3` format)
- Inline progress bars, status badges, priority indicators, assignee avatars
- `expandAll` and `collapseAll` toolbar actions
- Expand/collapse state persisted in Zustand across navigations
- Selecting an item sets global `selectedId` shared across all views
- Context menu on hover: Edit, Add Child, Duplicate, Delete (with confirmation dialog)
- Dependency warnings: if a dependency has `status === "blocked"` and the dependent item is `in_progress`, a visual warning icon is shown
- Milestone nodes: diamond icon, no progress bar, no hours fields

**Banking WBS structure (Meridian Bank)**

| Phase | Stream | Key Tasks |
|---|---|---|
| 1. Mobile Banking App | 1.1 iOS App | Biometric auth (Face ID/Touch ID), APNs push, App Store |
| | 1.2 Android App | Fingerprint/PIN redesign, Firebase Cloud Messaging (blocked), Google Play |
| 2. Online Banking Portal | 2.1 Frontend | Account dashboard, transaction history (blocked), payee management |
| | 2.2 Security | MFA (TOTP/SMS), PCI-DSS assessment, OAuth 2.0 session fix |
| 3. Open Banking API Gateway | 3.1 PSD2 | Consent management, PIS API, AIS API |
| | 3.2 API Security | Auth0 OIDC, penetration test (NCC Group), Temenos T24 gateway |
| Milestones | | M1 Mobile Beta (Jul 31) · M2 Portal Go-Live (Oct 1) · M3 API Launch (Dec 1) |

#### 2.3.2 Gantt Timeline

- Horizontal bar chart with swimlane rows per work item
- **5 zoom levels** with different day-widths and header behaviour:

  | Zoom | px/day | Primary Header | Secondary Header |
  |---|---|---|---|
  | Week | 40 | Month name | Week start dates |
  | Month | 20 | Month name | Week dashed separators |
  | Quarter | 8 | Q1 2024 / Q2 2024 | Month abbreviations |
  | Semester | 4 | H1 2024 / H2 2024 | Month abbreviations |
  | Year | 2 | 2024 / 2025 | Quarter labels (Q1–Q4) |

- Two-row SVG header (40px total, 20px per row): primary labels top, secondary labels bottom
- Semester is computed manually as H1 (Jan–Jun) and H2 (Jul–Dec) per year in the visible range
- Task bars with inner completion fill (width proportional to `completionPct`)
- Milestone diamond markers at the item's date
- Today-line marker (1px, `sdp-red`, full chart height)
- Task bar click opens work item detail slide-over
- Left label column (280px) sticky during horizontal scroll
- Zoom buttons: segmented pill group; active = `bg-sdp-red text-white`

#### 2.3.3 Kanban Board

- Columns: **To Do · In Progress · Blocked · Done** (maps to `not_started`, `in_progress`, `blocked`, `completed`)
- WIP limits: To Do = 10, In Progress = 6; exceeded limit renders column header in warning colour (soft limit, not enforced)
- **Full drag & drop across columns and within columns** — powered by `@dnd-kit/core` + `@dnd-kit/sortable`
- Drag activates only after pointer moves **≥ 6px** from grab point (`PointerSensor` activation distance constraint) — distinguishes accidental clicks from intentional drags
- The entire card is the drag handle — `listeners` and `attributes` attached to the card wrapper `<div>`, not an inner element
- Grip icon (`GripVertical`) appears on hover as a visual affordance; `pointer-events: none` so it does not intercept drag events
- During drag: source card becomes 25% opacity; `DragOverlay` shows a rotated (`rotate(1deg) scale(1.03)`), elevated card with `border-sdp-red/40 shadow-xl`
- Dropping a card in a column immediately updates `WorkItem.status` in the Zustand store
- Card click (without drag) opens work item detail slide-over
- Card content: priority stripe (left border), title, type badge, assignee avatar, story points, blocked icon
- "Show all" toggle to include items not yet assigned to the active sprint

#### 2.3.4 Resource Heatmap _(enhanced v1.6)_

Team capacity matrix showing weekly utilisation across 5 team members over a configurable rolling window.

**Controls:**
- Week range selector: **4W / 8W / 12W / 24W** (default: 12W, starting current Monday)
- "At risk only" filter toggle — hides rows for members with zero overloaded weeks

**Allocation computation:**
```
utilisation% = MGMT_BASE[userId] + Σ task contributions

task contribution for week i =
  (item.estimatedHours / totalItemDurationMs) × overlapMs / (1000×60×60) / 40 × 100
```

Management overhead baselines (meetings, planning, admin):
- Alex Rivera (`usr-001`) — 50%
- Sarah Mitchell (`usr-003`) — 55%
- Marcus Johnson (`usr-004`) — 40%
- Engineers — 0% base

**Cell colour scale:**

| Utilisation | Background | Meaning |
|---|---|---|
| 0% | Elevated (no tasks) | Free |
| 1–50% | `bg-info/20` | Light |
| 51–80% | `bg-success/25` | Optimal |
| 81–100% | `bg-warning/35` | Full |
| > 100% | `bg-danger/45` | Overloaded |

**Rich table features:**
- Two-level column header: month grouping row (colSpan) + week date row
- Current week highlighted with `border-info/50 ring-1 ring-info/30` in header and cells
- Cell content: utilisation % (bold) + task count (e.g. "3t") when tasks exist
- Cell tooltip: user name, week date, utilisation %, bulleted list of all overlapping task titles
- Per-person summary column: avg %, peak %, overloaded week count with `AlertTriangle` icon
- Team Average row at table bottom
- **Risk panel** below table: lists overloaded members with peak %, overloaded week count, and up to 3 causing task names
- **"All clear" panel** (green) when no members are overloaded

#### 2.3.5 Developer Workspace _(v1.6 — enhanced)_

Full end-to-end developer coding and delivery loop, embedded in the platform.

**Left panel — Task list**
- Filterable list of all assigned tasks and stories in the project
- Per-task git status badge persisting between selections:
  `No code → Generating → Ready → Committing → Committed → Pushing → Pushed → PR Open`
- Repository connection badge: `slalom/meridian-bank-digital-platform · slalom-delivery-bot · connected`

**Git auto-population _(v1.6 — new)_**
- Selecting a task **immediately** populates the branch name and commit message fields — no code generation required
- Branch name: derived as `feature/wi-{id}-{kebab-title}` from the work item's ID and title
- Commit message: auto-prefixed in conventional-commit format based on item type (`feat`, `fix`, `test`, `refactor`, `chore`)
- Fields remain user-editable; edits persist per-task in local component state
- `canCommit` gate: true when a task is selected AND a commit message is present (user-entered or auto-populated)
- Branch field shows `border-sdp-red/30` and red `GitBranch` icon when populated; neutral border when empty

**Code editor**
- Code generation triggered by "Generate Code" button with keyword input
- 6 smart banking-domain templates auto-selected from keyword:

  | Keyword match | Template produced |
  |---------------|-------------------|
  | `test` / `spec` | Vitest suite with Meridian Bank fixtures: IBAN, customerId, accountNumber, GBP currency |
  | `auth` / `component` / `portal` / `ui` / `biometric` | React client component with Auth0 headers (`X-Auth-Source: auth0`, `X-Client-Channel: web`), account display with IBAN in `font-mono`, colour-coded status badge |
  | `api` / `route` / `endpoint` / `payment` / `psd2` | Next.js API route with Zod validation, IBAN regex, PSD2 `consentRef` field, soft-delete (status `'closed'` — no hard delete on financial records) |
  | `service` / `push` / `firebase` / `notification` | TypeScript service class with FCM push notification method, `X-Client-Channel: api` header |
  | _(default)_ | Zod schema + type guards with banking domain: `customerId`, IBAN `accountNumber`, `channel` (mobile/web/api), `currency` GBP, `groupByChannel` utility |

- VS Code–styled dark editor: tab bar, active-file tab with blue top border, filename, line count
- Always editable — developer can freely modify generated code before committing
- Regenerate button — re-runs template; Reset button — clears and regenerates immediately
- Copy to clipboard

**Delivery flow panel**
- 4-step visual pipeline: `Code ready → Committed → Pushed → PR created`

**Git operations panel**
- Auto-populated branch and commit message on task selection (no code generation needed)
- Terminal-style log panel: timestamped lines with `[GIT]`, `[PUSH]`, `[PR]`, `[ERROR]` prefixes
- **Commit & Push** button triggers animated git workflow:
  1. `git checkout -b {branch}`
  2. `git add {file}` + `git diff --staged --stat`
  3. `git commit -m "{message}"` → short hash returned
  4. `git push -u origin {branch}` → streams counting/compressing/writing/remote output
  5. `gh pr create --title "…" --base main` → PR `#{N}` created
- PR success card with fake GitHub link `https://github.com/slalom/meridian-bank-digital-platform/pull/{N}`
- Work item status auto-updated to `completed` (100%) on PR creation
- **Open in VS Code** button — triggers VS Code Export Modal

**Terminal**
- macOS-styled terminal chrome (red/yellow/green dots, title bar)
- Background: `#060D1A` (Slalom navy), `font-mono text-[10px]`
- Git output streams line-by-line with realistic delays
- Colour-coded output: commands → blue; info → grey; success → green; remote → purple; errors → red

#### 2.3.6 VS Code Export Modal

A full-screen modal simulating export of the current task's generated code to Visual Studio Code.

**Trigger:** "Open in VS Code" button in code editor header. Active only when code has been generated.

**Phase 1 — Bundling (~1.5s):** Animated checklist: resolving workspace, reading file, tsconfig paths, language server, Git context, ESLint/Prettier, indexing task, opening file.

**Phase 2 — Launching (~1.2s):** VS Code logo + animated progress bar filling to 100%.

**Phase 3 — VS Code preview:** Pixel-perfect simulated VS Code window:
- Title bar with macOS traffic lights
- Activity bar (Explorer, Search, Git, Debug, Extensions, Settings)
- File explorer with project tree, active file highlighted in blue
- Code editor with line numbers, syntax highlighting (Dark+ token colours)
- Status bar: branch name, line/col, Spaces: 2, language, Prettier

Token-based syntax highlighting: keywords → blue; strings → orange; comments → green; types → teal; functions → yellow; numbers → light green.

Footer: file size (KB), line count, "Open in VS Code" → `vscode://file/C:/projects/slalom/meridian-bank-digital-platform/{file}` URI.

### 2.4 Sprint Planner

- Sprint selector with prev/next chevron navigation and dropdown
- Active sprint badge and date range in header
- Sprint burndown chart — ideal vs actual lines (`Recharts AreaChart`)
- Sprint goal card
- Velocity history bar visualization (last 3 sprints)
- KPI bar: completed pts / planned pts, blocked count, progress bar
- Embedded Kanban board filtered to selected sprint
- Add Story slide-over (`WorkItemForm`)
- `moveToSprint(itemId, sprintId)` callable from sprint planning and Kanban context menu

**Active sprints (Meridian Bank):**

| Sprint | Status | Goal | Points |
|---|---|---|---|
| Sprint 8 | Active (Jun 17–28) | Ship biometric login; unblock OAuth session issues | 48 planned / 31 completed |
| Sprint 9 | Planning (Jul 1–12) | Payment hub API integration & PSD2 consent management | 52 planned |
| Sprint 7 | Closed | — | Velocity 90.9% |

### 2.5 RAID Log

- Type tabs: **Risks · Assumptions · Issues · Decisions**
- Filterable by type, status, priority, tag (AND logic between filter types)
- Full-text search by title and description (case-insensitive substring)
- KPI cards: total, open, escalated, critical, overdue — scoped to active `projectId`
- Add / edit RAID items via slide-over with Zod-validated form
- **Escalation flow:** Escalate → select level (team/pm/program/executive/client) → set SLA hours → creates linked `Escalation` record
- SLA tracking: breached when `now > createdAt + slaHours` and `resolvedAt` is null
- Close requires closure note; closed items demoted visually but remain searchable
- Export to CSV (filtered rows only)
- Storage key `"sdp-raid-v2"` — versioned to prevent stale localStorage cache

**Active RAID items (Meridian Bank):**

| ID | Type | Priority | Status | Title |
|---|---|---|---|---|
| raid-001 | Risk | Critical | Escalated | PCI-DSS Tokenisation Certification Gap |
| raid-002 | Issue | High | In Progress | Legacy Core Banking API Rate Limits (Temenos T24 200 req/min) |
| raid-003 | Assumption | High | Open | BioCatch SDK licensing coverage (iOS + Android) |
| raid-004 | Issue | Critical | In Progress | OAuth 2.0 Staging Blocker (clock skew Auth0 ↔ API gateway) |
| raid-005 | Decision | High | Closed | Phased Mobile Release Strategy (TestFlight July → App Store Sept) |
| raid-006 | Assumption | High | Open | PSD2 Sandbox Credentials provision by Jun 28 |
| raid-007 | Risk | Medium | Open | App Store Review Delay (5–14 business days for biometric changes) |
| raid-008 | Risk | High | Open | Penetration Test Not Scheduled (NCC Group unavailable until late Sept) |
| raid-009 | Decision | High | Closed | Auth0 as Unified Identity Provider (replaces legacy LDAP) |
| raid-010 | Risk | High | Open | Single Point of Failure — Priya Sharma (iOS LocalAuthentication) |

### 2.6 Escalation Tracker

- Escalations grouped by level: team → pm → program → executive → client
- Each card: linked RAID item title + priority, assigned user, SLA target datetime, elapsed time, Open/Resolved status
- SLA states: **Within SLA** (info colour), **Breached** (danger colour), **Resolved** (success colour)
- Resolve requires a resolution note; sets `resolvedAt` timestamp
- Summary counts: total active, breached, resolved this week

**Active escalations (Meridian Bank):**
- `esc-001`: PCI-DSS tokenisation → Executive (Diana Foster) — 48-hour SLA
- `esc-002`: OAuth staging blocker → PM (Sarah Mitchell) — 24-hour SLA

### 2.7 Stakeholder & Change Management

- Stakeholder map (sentiment matrix: champion → blocker)
- Impact level and engagement tracking
- Change action plan list with owner and due dates

### 2.8 Retrospectives

- Sprint / milestone retro board: **Went Well · Needs Improvement · Action Items · Kudos** quadrants
- Item voting (anonymous — vote count shown, not voter identity)
- Action item creation from retro items with owner, due date, and status (`open` | `done`)
- Action items exported to next sprint planning session

### 2.9 Project Artifacts Hub _(v1.7 — new)_

A dedicated section for all project-level governance documents. Accessible from the **Delivery → Project Documents** sidebar nav item. Serves as the single authoritative source for SOW, Project Charter, PRD, and Architecture decisions, with each document directly linkable to work items in the WBS.

#### Document Gallery

- **Type filter tabs:** All | Charter | SOW | PRD | Architecture | Meeting Notes | Change Request
- **Card grid** (3 columns): coloured type-specific header strip (icon + type label + version), document title, status badge (Draft / Review / Approved / Archived), author avatar + name, last updated date, linked work items count
- **"New Document" menu:** dropdown with all document types; each new document opens pre-populated with a template

**Pre-loaded Meridian Bank documents:**

| Document | Type | Status | Version |
|---|---|---|---|
| Project Charter — Digital Banking Transformation | Charter | Approved | 2.0 |
| Statement of Work — SLM-MBK-2024-SOW-001 | SOW | Approved | 1.2 |
| Product Requirements Document — v1.5 | PRD | In Review | 1.5 |
| Technical Architecture Document — v0.8 Draft | Architecture | Draft | 0.8 |

#### WYSIWYG Document Editor

Clicking any card opens a full-platform editor:

**Top bar:** Back to gallery → document title (inline editable) → type label → status picker (click to change) → version → Save button with "Unsaved changes" indicator.

**Formatting toolbar:** Bold · Italic · Underline · | · H1 · H2 · H3 · | · Bullet list · Numbered list · Horizontal rule · Insert link.

Implementation: `contentEditable` div with `document.execCommand` for formatting; Tailwind arbitrary-variant prose styles for H1–H3, tables, lists, bold, italic, links, blockquotes — all in dark theme.

**Author info bar:** Author avatar + name · Last updated timestamp · "Unsaved changes" warning in amber.

**Right metadata sidebar (256px):**
- Document type, version, created date
- Author (avatar + title)
- Reviewers list (avatars)
- Linked Work Items — each item linkable/unlinkable with hover `Unlink` button

**Save behaviour:** Save button disabled when no changes; on save, `updateDocument(id, { title, content })` is called and a "Saved" confirmation flashes for 2 seconds.

#### Work Item Linking

Work items created via the 4-step wizard (§2.11) can be linked to a document in Step 4. The `documentStore.linkWorkItem(docId, workItemId)` action adds the work item ID to `ProjectDocument.linkedWorkItems`. Unlinking is available from the editor sidebar.

### 2.11 Work Item Wizard _(v1.7 — new)_

Replaces the single-slide-over `WorkItemForm` on the Project Schedule page. The wizard is a centred Dialog (`max-w-2xl`) with a 4-step progression. Triggered by the "Add Item" button in the schedule page header (all views except Developer Workspace).

#### Step Indicator

A horizontal stepper at the top of the dialog: numbered circles (1–4) with step labels below, connected by a progress line. Completed steps show a green `Check` icon; the active step is filled with `sdp-red`.

#### Step 1 — Basics

| Field | UI | Validation |
|---|---|---|
| Title | Text input | Required; blocks Next if empty |
| Type | 7-item icon grid (Phase, Stream, Epic, Story, Task, Milestone, Deliverable) | Pre-selected from view context |
| Priority | 4-button row (Critical/High/Medium/Low) with colour coding | Default: Medium |
| Description | 3-row textarea | Optional |

#### Step 2 — Timeline

| Field | UI | Validation |
|---|---|---|
| Start Date | Date input | Required; blocks Next if empty |
| End Date | Date input | Required; must be ≥ Start Date |
| Estimated Hours | Number input | Optional |
| Story Points | Fibonacci button row (1 2 3 5 8 13 21) | Optional |
| Initial Completion % | Range slider (0–100, step 5) | Default: 0% |

#### Step 3 — Team

| Field | UI |
|---|---|
| Assignee | Avatar grid (Unassigned + 5 team members); selected member highlighted in `sdp-red` |
| Sprint | Dropdown of sprints for the project; active/planning sprints labelled |
| Parent Item | Dropdown of Phase/Stream/Epic items for hierarchy placement |
| Dependencies | Scrollable checkbox list of existing work items (up to 12 shown) |

#### Step 4 — Link Document

- Descriptive copy explaining the link behaviour
- Radio list: "No document link" + one card per project document
- Each card: type label + status badge + title + linked items count
- Selected card highlighted with `sdp-red/5` background + `sdp-red/40` border
- On create: `documentStore.linkWorkItem(docId, newItem.id)` is called if a document was selected

#### Create Action

The "Create Item" button on Step 4 calls:
1. `generateWbsNumber(workItems, parentId, projectId)` — computes the next sequential WBS number
2. `scheduleStore.addWorkItem({ ...fields, wbsNumber })` — adds item to the store
3. `documentStore.linkWorkItem(docId, item.id)` — if Step 4 had a document selected
4. Resets all form state and closes the dialog

### 2.13 Ways of Working

- Team norms and working agreements document (rich text)
- Version-controlled; last-modified timestamp and author displayed

### 2.14 Admin Console

- **Users:** List, edit role, invite by email
- **Roles:** Read-only role-to-permission matrix (code-defined in v1.0)
- **Feature flags:** Enabled toggle + rollout percentage (0–100%); all changes write to audit log
- **Audit log:** Immutable append-only log — actor, action, resource type, resource ID, JSON diff, IP, timestamp. Not editable or deletable by any role including `super_admin`
- **Projects:** Project settings, status, health

---

## 3. Design System

### 3.1 Brand Identity

Slalom brand palette applied throughout via CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--slalom-blue` | `#0C62FB` | Primary action, accents (aliased to `--sdp-red`) |
| `--slalom-blue-mid` | `#5B9AFF` | Info, secondary highlights |
| `--sdp-gold` | `#F5A623` | Decorative dot grid, separators |
| `--bg` | `#060D1A` | App background |
| `--surface` | `#091525` | Card backgrounds |
| `--elevated` | `#0F2240` | Inputs, elevated surfaces |
| `--overlay` | `#162D55` | Hover overlays |
| `--line` | `rgba(255,255,255,0.07)` | Borders, dividers |
| `--ink` | `#EFF2F8` | Primary text |
| `--ink-2` | `#8FA4C0` | Secondary text |
| `--ink-3` | `#3D5470` | Muted / placeholder text |

### 3.2 Typography & Decoration

- **Italic last-word headline** pattern on all page titles (Slalom brand convention)
- Concentric circle SVG motifs in auth panel and sidebar header
- Gold dot grid (`sdp-dots`) as decorative background fill
- `* * *` asterisk separators (`sdp-sep`) between nav sections
- Space Grotesk as display font for section headers

### 3.3 Component Library

Built on Radix UI primitives with Tailwind CSS v4 (CSS-first config):

| Component | Variants / Notes |
|-----------|-----------------|
| `Button` | primary, outline, ghost, danger |
| `Badge` / `StatusBadge` | success, warning, danger, info, dot |
| `Card` / `CardHeader` / `CardContent` | |
| `Progress` | xs / sm / md, optional label |
| `SlideOver` | Radix Dialog, sm / md / lg / xl widths |
| `PageHeader` | breadcrumb, tabs, actions slots |
| `Avatar` | initials fallback, sizes: xs / sm / md |
| `VsCodeExportModal` | Radix Dialog, full-screen, 3-phase export flow |

---

## 4. Technical Architecture

### 4.1 Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router (Turbopack) | 16.2.6 |
| Language | TypeScript, strict mode | 5.x |
| Styling | Tailwind CSS v4, CSS-first `@theme inline` | 4.x |
| State management | Zustand + `useShallow` (infinite-loop safe selectors) | 5.0.13 |
| Forms | React Hook Form + Zod | 7.76 / 4.4.3 |
| Drag & drop | dnd-kit (`useDroppable`, `useSortable`, `DragOverlay`) | core 6.3 / sortable 10.0 |
| Charts | Recharts (`AreaChart`, `LineChart`, `ResponsiveContainer`) | 3.8.1 |
| UI primitives | Radix UI (Dialog, VisuallyHidden, DropdownMenu) | latest |
| Animations | Framer Motion | 12.39.0 |
| Date utilities | date-fns (all operations; no moment.js) | 4.2.1 |
| Icons | lucide-react | 1.16.0 |
| Persistence | Zustand `persist` middleware → localStorage | — |

### 4.2 Route Structure

```
app/
  (auth)/
    login                   — split-panel Slalom login
  (platform)/
    overview                — executive dashboard
    schedule                — WBS / Gantt / Kanban / Resource / Developer
    sprint                  — sprint planner + burndown
    raid                    — RAID log + escalation tracker
    escalations             — dedicated escalation path view
    retro                   — retrospective board
    ways-of-working         — team norms
    change-management       — stakeholder map + sentiment
    org-chart               — RACI matrix + org structure
    documents               — Project Artifacts Hub (Charter, SOW, PRD, Architecture)
  (admin)/
    users                   — user management + role assignment
    roles                   — permission matrix (read-only)
    projects                — project settings
    audit                   — immutable audit log
    flags                   — feature flag management
```

### 4.3 State Architecture

| Store | Key | Contents |
|-------|-----|----------|
| `useScheduleStore` | `sdp-schedule-v2` | workItems, sprints, expandedIds, selectedId, view |
| `useRaidStore` | `sdp-raid-v2` | RAID items, escalations, selectedId |
| `useDocumentStore` | `sdp-documents-v1` | ProjectDocuments[], selectedId; CRUD + linkWorkItem/unlinkWorkItem |
| `useAuthStore` | `sdp-auth` | session, user, simulatedRole |
| `useUIStore` | `sdp-ui` | theme, sidebarOpen |

Persistence keys are **versioned**. Bumping the version (e.g. `v2 → v3`) forces clean hydration from mock/server data, clearing any stale cached state. This is the canonical mechanism for breaking cache after data schema migrations.

### 4.4 Key Patterns

- **Selector stability:** selectors returning arrays or objects wrapped with `useShallow` to prevent Zustand v5 / `useSyncExternalStore` infinite loops
- **Immutable updates:** all store mutations use functional spread (`{ ...prev, [id]: { ...cur, ...patch } }`)
- **Activation distance constraint:** `PointerSensor` configured with `{ activationConstraint: { distance: 6 } }` — 6px movement required before drag activates; eliminates click/drag ambiguity
- **Git auto-population:** branch and commit message derived directly from `WorkItem` on selection (`getBranch(item)`, `getCommitMsg(item)`) as fallbacks to user-edited state; no code generation required
- **Resource allocation:** computed via `useMemo` from work items using millisecond-precision overlap calculation against week boundaries; management overhead applied as base before task contributions
- **Semester headers:** computed manually as H1 (Jan–Jun) / H2 (Jul–Dec) per year — date-fns has no built-in semester concept
- **Code generation:** character-by-character reveal via `setInterval` at 16ms (≈60fps)
- **Git flow simulation:** `async/await` chains with `delay()` helpers; each step updates `TaskGitState` via functional `setTaskStates`
- **VS Code modal phases:** `useEffect` auto-advances `idle → bundling → launching → open` with `setTimeout` chains
- **WYSIWYG editor:** `contentEditable` div + `document.execCommand` for formatting; initial content set via `useEffect` on `docId` change to avoid React re-render conflicts; Tailwind `[&_h1]:` arbitrary variants for prose styles without an external typography plugin
- **WBS number generation:** `generateWbsNumber(items, parentId, projectId)` computes the next sibling index by scanning existing items at the same depth, producing dotted notation (e.g. `1.2.3`)
- **Cross-store linking:** work item creation in the wizard writes to `scheduleStore` then immediately calls `documentStore.linkWorkItem` — two independent Zustand stores updated in sequence within a single user action
- **Document status picker:** inline dropdown built without Radix (click-outside via a fixed `inset-0 z-40` overlay div); avoids Dialog nesting inside the editor layout

---

## 5. Developer Workspace — Complete Flow

```
Developer selects a task from the left panel
     │
     ├── Branch auto-populates: feature/wi-{id}-{kebab-title}
     └── Commit message auto-populates: feat(scope): {title description}
     │
     ▼
Developer enters keyword → clicks "Generate Code"
Template chosen from keyword category
Code generates with typing animation
     │
     ├── Edit inline (textarea always writable)
     ├── Regenerate (re-runs template)
     ├── Copy to clipboard
     └── Open in VS Code → VS Code Export Modal
           │
           ├── Phase 1: Bundling (checklist animation)
           ├── Phase 2: Launching (progress bar)
           └── Phase 3: Fake VS Code window preview
                 └── "Open in VS Code" → vscode:// URI
     │
     ▼
Edit commit message if needed (auto-populated from task)
     │
     ▼
Click "Commit & Push"
     │
     ├── git checkout -b feature/{id}-{slug}
     ├── git add {file}
     ├── git diff --staged --stat                  (shows +N lines)
     ├── git commit -m "{msg}"                    → short hash
     ├── git push -u origin {branch}              → remote output streamed
     └── gh pr create --base main                 → PR #{N}
     │
     ▼
Work item → status: completed, completionPct: 100
PR success card shown with GitHub link
Task badge in left panel → "PR Open"
```

---

## 6. Mock Data & Fake Connections

| Artefact | Value |
|----------|-------|
| GitHub repo | `slalom/meridian-bank-digital-platform` |
| Git bot user | `slalom-delivery-bot` |
| PR base URL | `https://github.com/slalom/meridian-bank-digital-platform/pull/{N}` |
| VS Code URI | `vscode://file/C:/projects/slalom/meridian-bank-digital-platform/{file}` |
| Login credentials | `slalom@slalom.com` / `slalom123` |
| Client org | Meridian Bank — Digital Banking Transformation |
| Demo projects | Digital Banking Platform v3.0 (active, $5.8M) · Open Banking API Gateway (planning, $2.4M) |
| Banking domain | IBAN format (`GB29NWBK60161331926819`), GBP currency, PSD2 consent flow, Auth0 OIDC |
| Core banking | Temenos T24 (API rate limit: 200 req/min; Redis caching mitigation) |
| Identity | Auth0 replacing legacy LDAP; OIDC, TOTP/SMS MFA, biometric passkeys |
| Sprints | Sprint 8 (active — biometric & OAuth fix) · Sprint 9 (planning — payments & PSD2) |
| RAID items | 10 total: 4 critical, 4 high, 2 medium; 2 active escalations |
| Team | Alex Rivera (PM) · Sarah Mitchell (PM) · Marcus Johnson (SM) · Priya Sharma (iOS) · Tom Bradley (BA/PO) · Diana Foster (Client VP) |

---

## 7. Accessibility

- All Radix Dialog instances include `Dialog.Title` (visually hidden where not shown in UI)
- Keyboard navigation supported via Radix primitives (Escape to close, Tab focus trapping)
- Drag-and-drop status changes accessible via card context menu keyboard alternative
- Colour is never the sole carrier of information — status badges always include text labels
- Minimum contrast ratio: 4.5:1 for body text (WCAG 2.1 AA)
- Gantt SVG provides `role="img"` with `aria-label` for screen-reader users
- All form fields have associated `<label>` elements or `aria-label` attributes

---

## 8. Roadmap

| Status | Feature | Version |
|--------|---------|---------|
| ✅ Shipped | Platform overview dashboard | v1.0 |
| ✅ Shipped | WBS tree view | v1.0 |
| ✅ Shipped | Gantt timeline (week / month / quarter) | v1.0 |
| ✅ Shipped | Kanban board (drag & drop) | v1.0 |
| ✅ Shipped | Resource heatmap (basic) | v1.0 |
| ✅ Shipped | Sprint planner + burndown | v1.0 |
| ✅ Shipped | RAID log | v1.0 |
| ✅ Shipped | Slalom brand identity (dark navy palette) | v1.1 |
| ✅ Shipped | Work item add form (slide-over, WBS auto-number) | v1.1 |
| ✅ Shipped | Developer Workspace — auto-generate + git flow | v1.2 |
| ✅ Shipped | Always-editable code, richer terminal git output | v1.3 |
| ✅ Shipped | VS Code Export Modal — 3-phase animated preview | v1.4 |
| ✅ Shipped | Token-based syntax highlighting (Dark+ theme) | v1.4 |
| ✅ Shipped | Accessibility: Dialog.Title for all Radix modals | v1.4 |
| ✅ Shipped | Full Meridian Bank context — work items, users, RAID | v1.5 |
| ✅ Shipped | Kanban whole-card drag (6px activation distance) | v1.6 |
| ✅ Shipped | Gantt semester + year zoom levels (H1/H2 headers) | v1.6 |
| ✅ Shipped | Resource heatmap: week range selector, computed allocations, risk panel | v1.6 |
| ✅ Shipped | Git auto-population (branch + commit message on task select) | v1.6 |
| ✅ Shipped | Banking domain code templates (IBAN, Auth0, FCM, PSD2) | v1.6 |
| ✅ Shipped | Spec-Driven Development document (`docs/SDD-meridian-bank.md`) | v1.6 |
| ✅ Shipped | Project Artifacts Hub (`/documents`) — gallery + WYSIWYG editor | v1.7 |
| ✅ Shipped | Pre-loaded Meridian Bank documents (Charter, SOW, PRD, Architecture) | v1.7 |
| ✅ Shipped | Document ↔ Work Item bi-directional linking | v1.7 |
| ✅ Shipped | Work Item 4-step Wizard (Basics → Timeline → Team → Link Document) | v1.7 |
| ✅ Shipped | `documentStore` with Zustand persist (`sdp-documents-v1`) | v1.7 |
| 🔜 Planned | Document version history (diff between versions) | v1.8 |
| 🔜 Planned | Document comment threads (inline annotations) | v1.8 |
| 🔜 Planned | Auto-generate WBS from PRD requirements (AI-assisted) | v1.8 |
| 🔜 Planned | Real diff view (changed lines highlighted red/green) | v1.8 |
| 🔜 Planned | PR review comments panel in Developer Workspace | v1.8 |
| 🔜 Planned | Time tracking & actual hours input on tasks | v1.8 |
| 🔜 Planned | Executive PDF / PowerPoint export | v1.9 |
| 🔜 Planned | Notification centre (in-app alerts for RAID SLA, sprint end) | v1.9 |
| 🔜 Planned | Multi-project switcher | v1.9 |
| 🔜 Planned | Real-time collaboration (WebSocket presence) | v2.0 |
| 🔜 Planned | Backend API + PostgreSQL (replace localStorage persistence) | v2.0 |
| 🔜 Planned | Native Temenos T24 API integration | v2.0 |
