"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Shield, FolderOpen, ClipboardList, ToggleRight, ArrowLeft, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/authStore"
import { Avatar } from "@/components/ui/avatar"

const ADMIN_NAV = [
  { label: "Overview",      href: "/admin",          icon: LayoutDashboard },
  { label: "Users",         href: "/admin/users",    icon: Users },
  { label: "Roles",         href: "/admin/roles",    icon: Shield },
  { label: "Projects",      href: "/admin/projects", icon: FolderOpen },
  { label: "Audit Logs",    href: "/admin/audit",    icon: ClipboardList },
  { label: "Feature Flags", href: "/admin/flags",    icon: ToggleRight },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()

  return (
    <aside className="w-56 h-full flex flex-col bg-surface border-r border-[var(--line)] shrink-0">
      {/* Header */}
      <div className="px-4 py-4 border-b border-[var(--line)]">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-6 w-6 rounded-md bg-sdp-red flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="text-sm font-semibold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Admin Panel
          </span>
        </div>
        <p className="text-xs text-ink-3">Platform administration</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all",
                active
                  ? "bg-sdp-red/10 text-sdp-red font-medium"
                  : "text-ink-2 hover:bg-elevated hover:text-ink"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-sdp-red" : "text-ink-3")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--line)] p-3 space-y-1">
        <Link
          href="/overview"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-ink-2 hover:bg-elevated hover:text-ink transition-all"
        >
          <ArrowLeft className="h-4 w-4 text-ink-3" />
          Back to Platform
        </Link>
        {user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <Avatar name={user.name} size="xs" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink truncate">{user.name}</p>
              <p className="text-[10px] text-ink-3 capitalize">{user.role.replace(/_/g, " ")}</p>
            </div>
            <button
              onClick={() => { logout(); router.push("/login") }}
              className="p-1 text-ink-3 hover:text-danger transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
