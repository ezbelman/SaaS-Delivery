"use client"
import { useState } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { ROLE_LABELS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { Plus, Search, MoreHorizontal, Edit2, Trash2, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

const ROLE_BADGE: Record<string, "primary" | "warning" | "danger" | "success" | "info" | "ghost"> = {
  super_admin:      "danger",
  admin:            "warning",
  program_manager:  "primary",
  project_manager:  "info",
  scrum_master:     "success",
  team_member:      "ghost",
  client_viewer:    "ghost",
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")

  const filtered = MOCK_USERS.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="User Management"
        subtitle={`${MOCK_USERS.length} users across all roles`}
        breadcrumb={[{ label: "Admin" }, { label: "Users" }]}
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-3.5 w-3.5" /> Invite User
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Search */}
        <div className="relative max-w-sm animate-fade-up">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-3" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="h-9 w-full rounded-md border border-[var(--line)] bg-elevated pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red"
          />
        </div>

        <Card className="animate-fade-up delay-50 overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-4 px-4 py-2.5 bg-elevated border-b border-[var(--line)] text-xs font-semibold text-ink-2 uppercase tracking-wider">
            <div className="flex-1">User</div>
            <div className="w-36 hidden md:block">Role</div>
            <div className="w-32 hidden lg:block">Department</div>
            <div className="w-28 hidden lg:block">Joined</div>
            <div className="w-8" />
          </div>

          {filtered.map((user) => (
            <div key={user.id} className="flex items-center gap-4 px-4 py-3.5 border-b border-[var(--line)] last:border-0 hover:bg-elevated/30 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar name={user.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                  <p className="text-xs text-ink-3 truncate">{user.email}</p>
                </div>
              </div>
              <div className="w-36 hidden md:block">
                <Badge variant={ROLE_BADGE[user.role] ?? "ghost"}>
                  {ROLE_LABELS[user.role]}
                </Badge>
              </div>
              <div className="w-32 hidden lg:block">
                <p className="text-xs text-ink-2">{user.department ?? "—"}</p>
              </div>
              <div className="w-28 hidden lg:block">
                <p className="text-xs text-ink-3">{formatDate(user.createdAt, "MMM d, yyyy")}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded hover:bg-elevated text-ink-3 hover:text-ink transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit2 className="h-3.5 w-3.5" /> Edit User
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="h-3.5 w-3.5" /> Change Role
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem danger>
                    <Trash2 className="h-3.5 w-3.5" /> Remove User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
