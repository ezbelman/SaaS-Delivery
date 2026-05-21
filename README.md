# Slalom Delivery Platform (SDP)

Enterprise project delivery management platform built for consulting engagements. Ships with a fully pre-loaded demo environment for the **Meridian Bank Digital Banking Transformation** engagement — a fictional $4.2M, 18-month core banking modernisation programme used for MVP presentations.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State | Zustand 5.0.13 with `persist` middleware |
| UI primitives | Radix UI |
| Drag & drop | dnd-kit |
| Charts | Recharts |
| Date utilities | date-fns 4.2.1 |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Login

```
Email:    slalom@slalom.com
Password: slalom123
```

---

## Features

### Project Schedule (`/schedule`)

Five views over the same Zustand work-item store — switching tabs preserves all state.

| View | Description |
|---|---|
| **Work Breakdown** | Collapsible WBS tree with inline status, priority, RAG and assignee. Drag rows to reorder. |
| **Gantt Timeline** | Horizontal bar chart. Zoom levels: Day · Week · Month · Quarter · Semester · Year. Dependency arrows rendered as SVG. |
| **Kanban Board** | Swimlane board by sprint. Full card drag-and-drop across columns via dnd-kit. |
| **Resource View** | Heatmap showing allocation % per team member per week. Cells colour from green → amber → red as load increases. |
| **Developer** | VS Code–style workspace. Browse the repo tree, view banking code templates (PCI-DSS, Auth0 OIDC, Temenos T24 connector, FCM/APNs push). Export sprint as a `.vscode-workspace` file. |

**Work Item Wizard** — 4-step slide-over for creating new items:

1. Title, type (7 types), priority, description
2. Dates, estimated hours, story points (Fibonacci), completion slider
3. Assignee, sprint, parent item, dependencies
4. Link to a Project Document

Work item types: `phase · stream · epic · story · task · milestone · deliverable`

---

### Project Documents (`/documents`)

Document gallery with a WYSIWYG rich-text editor.

**Creating documents**

Click **New Document** and pick a template — the editor opens pre-filled with Meridian Bank–specific content.

Pre-loaded templates: Project Charter · SOW · PRD · Architecture Doc · Meeting Notes · Change Request

**Uploading external documents**

Click **Upload** or drag-and-drop files anywhere onto the gallery.

- Supported formats: `.html` · `.txt` · `.md`
- `.md` files are converted to HTML (headings, bold, italic, lists, links)
- Document type is auto-detected from the filename (`arch-overview.md` → Architecture Doc, `charter.html` → Project Charter, etc.)

**AI work item generation (simulated)**

When a file is uploaded, an animated overlay simulates AI document analysis and automatically generates a full set of work items in the project schedule:

| Document type | Generated epic | Items |
|---|---|---|
| Charter | Project Governance & Setup | 4 tasks + 1 milestone |
| SOW | SOW Deliverable Tracking | 4 tasks + 1 milestone + 1 deliverable |
| PRD | Product Feature Development | 2 tasks + 3 stories + 1 milestone |
| Architecture | Technical Foundation | 4 tasks + 1 milestone |
| Meeting Notes | Meeting Action Items | 4 action-item tasks |
| Change Request | Change Request Assessment | 4 tasks + 1 milestone + 1 impl. task |

Generated items appear immediately in all five schedule views (WBS, Gantt, Kanban, Resource, Developer).

**WYSIWYG editor**

Toolbar: Bold · Italic · Underline · H1–H3 · Bullet list · Numbered list · Horizontal rule · Insert link.

Content stored as HTML. Metadata sidebar shows type, version, author, reviewers, and linked work items. Uploaded documents show their original filename and an "Uploaded" badge.

---

### RAID Log (`/raid`)

Risks · Assumptions · Issues · Decisions log with inline status updates and escalation links.

### Escalation Path (`/escalations`)

5-level escalation tree: Team → PM → Program → Executive → Client. Each node shows trigger condition, SLA hours, owner, and resolution status.

### Sprint Planner (`/sprint`)

Sprint capacity planning with velocity tracking and backlog grooming.

### Engagement Retro (`/retro`)

Sprint retrospective board: What went well · What to improve · Action items.

### Ways of Working (`/ways-of-working`)

Team norms, ceremonies, and agreed practices documented per engagement.

### Change Management (`/change-management`)

Change request log linked to the RAID register.

### Org Chart & RACI (`/org-chart`)

Visual org chart with RACI matrix for the engagement.

### Admin (`/admin`)

| Section | Description |
|---|---|
| Users | Manage platform users and roles |
| Roles | Role permission matrix |
| Projects | Project registry |
| Audit Logs | Immutable action log |
| Feature Flags | Toggle platform features per environment |

Roles: `super_admin · admin · program_manager · project_manager · scrum_master · team_member · client_viewer`

---

## Presentation / Demo Guide

The app ships with realistic mock data for the Meridian Bank engagement pre-loaded in every view.

### Reset before presenting

1. Open `/documents`
2. Click **Settings** at the bottom of the page
3. Click **Reset all** → **Confirm reset**

All schedule data and documents are restored to the original demo state instantly. No page refresh needed.

### Suggested demo flow

1. Open `/schedule` — walk through Work Breakdown → Gantt → Kanban → Resource → Developer
2. Navigate to `/documents`
3. Drag any `.md` or `.txt` file onto the gallery
4. Watch the AI analysis overlay (auto-detects document type → generates work items → 3-second animation)
5. Click **View in Schedule** — the new epic and all child items are live in every view
6. Return to `/documents` → open the document in the WYSIWYG editor

### Re-running the demo

Settings → Reset all → Confirm reset. Done in under a second.

---

## Project Structure

```
app/
├── (auth)/login/          # Login page
├── (platform)/            # Main app (sidebar layout)
│   ├── overview/          # Dashboard
│   ├── schedule/          # Project Schedule (5 views)
│   ├── documents/         # Project Documents
│   ├── raid/              # RAID Log
│   ├── escalations/       # Escalation Path
│   ├── sprint/            # Sprint Planner
│   ├── retro/             # Engagement Retro
│   ├── org-chart/         # Org Chart & RACI
│   ├── ways-of-working/
│   └── change-management/
└── (admin)/               # Admin portal

components/
├── layout/                # Sidebar, PageHeader, AuthGuard
├── schedule/              # WBSTree, GanttChart, KanbanBoard,
│                          # ResourceHeatmap, DeveloperWorkspace,
│                          # WorkItemWizard
├── documents/             # DocumentGallery, DocumentEditor
├── raid/                  # RaidForm
└── ui/                    # Button, Avatar, Badge, Dialog, SlideOver, …

stores/
├── scheduleStore.ts       # Work items + sprints  (sdp-schedule-v2)
├── documentStore.ts       # Project documents     (sdp-documents-v1)
├── raidStore.ts           # RAID items            (sdp-raid-v2)
├── authStore.ts           # Session
└── uiStore.ts             # Sidebar, theme

lib/
├── types/                 # All TypeScript interfaces
├── mock-data/
│   ├── users.ts           # Team + client contacts
│   ├── work-items.ts      # Seed WBS + sprints
│   ├── documents.ts       # Pre-filled HTML documents
│   └── document-work-items.ts  # Work item templates per doc type
└── constants.ts           # NAV_ITEMS, label maps, colour maps
```

---

## State Architecture

All client state lives in Zustand stores with `persist` middleware writing to `localStorage`. Stores use versioned storage keys — bumping the suffix (e.g. `v2` → `v3`) busts the cache on deploy.

| Store | Storage key | Persisted fields |
|---|---|---|
| `scheduleStore` | `sdp-schedule-v2` | `workItems`, `sprints`, `expandedIds` |
| `documentStore` | `sdp-documents-v1` | `documents` |
| `raidStore` | `sdp-raid-v2` | `items` |
| `authStore` | `sdp-auth` | `session` |

Each store exposes a `reset()` action that restores initial mock data and overwrites `localStorage` in the same synchronous call.

---

## Specification Documents

| Document | Description |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document (v1.7) |
| [`docs/SDD-meridian-bank.md`](docs/SDD-meridian-bank.md) | Spec-Driven Development spec (v1.1.0) — 14 feature domains, numbered behavioural specs, acceptance criteria tables, data models, API contracts, 30-term glossary |
