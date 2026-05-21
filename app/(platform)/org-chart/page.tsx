"use client"
import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { Plus, Network, Download } from "lucide-react"

const RACI_DATA = {
  roles: ["Program Manager", "Project Manager", "Scrum Master", "Developer", "BA", "Client VP"],
  deliverables: [
    { name: "RAID Log",                  assignments: ["R/A", "C", "C", "I", "I", "I"] },
    { name: "Sprint Planning",           assignments: ["I", "C", "R/A", "C", "C", "I"] },
    { name: "Architecture Decisions",    assignments: ["A", "C", "I", "R", "C", "I"] },
    { name: "Steering Committee",        assignments: ["R/A", "C", "I", "I", "I", "C"] },
    { name: "Mobile App Release Plan",   assignments: ["A", "R", "I", "C", "R", "I"] },
    { name: "PCI-DSS Compliance Sign-off", assignments: ["C", "A", "I", "C", "R", "R/A"] },
    { name: "Change Management Plan",    assignments: ["R/A", "C", "I", "I", "C", "C"] },
    { name: "Technical Architecture",    assignments: ["I", "A", "C", "R", "C", "I"] },
  ],
}

const RACI_COLORS: Record<string, string> = {
  "R":   "bg-sdp-red/10 text-sdp-red",
  "A":   "bg-warning/10 text-warning",
  "C":   "bg-info/10 text-info",
  "I":   "bg-elevated text-ink-3",
  "R/A": "bg-sdp-red/20 text-sdp-red font-bold",
}

// Simple org chart nodes
const ORG_NODES = [
  { id: "n1", userId: "usr-007", name: "Diana Foster",   title: "VP Digital Banking",        parentId: null,  depth: 0 },
  { id: "n2", userId: "usr-001", name: "Alex Rivera",    title: "Program Manager",           parentId: "n1",  depth: 1 },
  { id: "n3", userId: "usr-003", name: "Sarah Mitchell", title: "Project Manager — Banking",  parentId: "n2",  depth: 2 },
  { id: "n4", userId: "usr-004", name: "Marcus Johnson", title: "Scrum Master",              parentId: "n2",  depth: 2 },
  { id: "n5", userId: "usr-005", name: "Priya Sharma",   title: "Senior Developer",          parentId: "n4",  depth: 3 },
  { id: "n6", userId: "usr-006", name: "Tom Bradley",    title: "Business Analyst",          parentId: "n3",  depth: 3 },
]

function OrgNode({ node, allNodes }: { node: typeof ORG_NODES[0]; allNodes: typeof ORG_NODES }) {
  const children = allNodes.filter((n) => n.parentId === node.id)

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-xl border border-[var(--line)] bg-surface p-3 text-center w-40 hover:border-sdp-red/30 transition-colors">
        <Avatar name={node.name} size="md" className="mx-auto mb-2" />
        <p className="text-xs font-semibold text-ink truncate">{node.name}</p>
        <p className="text-[10px] text-ink-3 truncate mt-0.5">{node.title}</p>
      </div>
      {children.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-px h-5 bg-[var(--line)]" />
          <div className="flex items-start gap-4 relative">
            {children.length > 1 && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-[var(--line)]"
                style={{ width: `${(children.length - 1) * 180}px` }}
              />
            )}
            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-5 bg-[var(--line)]" />
                <OrgNode node={child} allNodes={allNodes} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrgChartPage() {
  const roots = ORG_NODES.filter((n) => !n.parentId)

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Org Chart & RACI"
        subtitle="Team structure and responsibility matrix"
        breadcrumb={[{ label: "Governance" }, { label: "Org Chart & RACI" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button variant="primary" size="sm">
              <Plus className="h-3.5 w-3.5" /> Add Member
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Org Chart */}
        <Card className="animate-fade-up">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-sdp-red" />
              <CardTitle>Organization Structure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex flex-col items-center py-4 min-w-max">
                {roots.map((root) => (
                  <OrgNode key={root.id} node={root} allNodes={ORG_NODES} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RACI Matrix */}
        <Card className="animate-fade-up delay-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>RACI Matrix</CardTitle>
              <div className="flex items-center gap-3 text-xs text-ink-2">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-sdp-red/20" />R=Responsible</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-warning/10" />A=Accountable</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-info/10" />C=Consulted</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-elevated" />I=Informed</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] bg-elevated/50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wider w-52">
                    Deliverable
                  </th>
                  {RACI_DATA.roles.map((role) => (
                    <th key={role} className="text-center px-2 py-2.5 text-xs font-semibold text-ink-2 uppercase tracking-wider">
                      <div className="max-w-[80px] leading-tight">{role}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RACI_DATA.deliverables.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--line)] hover:bg-elevated/30 transition-colors">
                    <td className="px-4 py-2.5 text-xs font-medium text-ink">{row.name}</td>
                    {row.assignments.map((assignment, j) => (
                      <td key={j} className="px-2 py-2.5 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-[11px] font-semibold ${RACI_COLORS[assignment] ?? "bg-elevated text-ink-3"}`}>
                          {assignment}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
