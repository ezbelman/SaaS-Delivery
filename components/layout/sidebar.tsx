"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, ShieldAlert, TrendingUp, RefreshCw, BookOpen,
  GitBranch, Network, CalendarRange, Kanban, ChevronLeft, ChevronRight,
  Settings, LogOut, User, Shield, FolderOpen, ClipboardList, ToggleRight,
  Menu, X, Users, Sun, Moon, FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useShallow } from "zustand/react/shallow"
import { useAuthStore } from "@/stores/authStore"
import { useUIStore } from "@/stores/uiStore"
import { Avatar } from "@/components/ui/avatar"
import { MOCK_PROJECTS } from "@/lib/mock-data/users"
import { NAV_ITEMS } from "@/lib/constants"

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, ShieldAlert, TrendingUp, RefreshCw, BookOpen,
  GitBranch, Network, CalendarRange, Kanban, Shield, FolderOpen,
  ClipboardList, ToggleRight, Users, FileText,
}

function NavItem({
  href,
  icon,
  label,
  collapsed,
}: {
  href: string
  icon: string
  label: string
  collapsed: boolean
}) {
  const pathname = usePathname()
  const active = pathname === href || (href !== "/" && pathname.startsWith(href))
  const Icon = ICON_MAP[icon] ?? LayoutDashboard

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-all duration-150 group relative",
        active
          ? "bg-sdp-red/10 text-sdp-red font-medium"
          : "text-ink-2 hover:bg-elevated hover:text-ink"
      )}
      title={collapsed ? label : undefined}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sdp-red rounded-full" />
      )}
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-sdp-red" : "text-ink-3 group-hover:text-ink-2")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore(
    useShallow((s) => ({
      sidebarOpen: s.sidebarOpen,
      toggleSidebar: s.toggleSidebar,
      theme: s.theme,
      toggleTheme: s.toggleTheme,
    }))
  )
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const collapsed = !sidebarOpen
  const currentProject = MOCK_PROJECTS[0]

  const SidebarContent = (
    <div className={cn(
      "flex flex-col h-full bg-surface border-r border-[var(--line)] transition-all duration-300",
      collapsed ? "w-14" : "w-60"
    )}>
      {/* Header — with subtle dot pattern overlay */}
      <div className={cn(
        "relative flex items-center justify-between px-3 py-4 border-b border-[var(--line)] shrink-0 overflow-hidden",
        collapsed ? "justify-center" : ""
      )}>
        {/* Tiny concentric circle decoration */}
        {!collapsed && (
          <div className="absolute right-0 top-0 pointer-events-none opacity-30">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              {[10, 20, 32].map((r, i) => (
                <circle key={r} cx="55" cy="5" r={r} stroke="#F5A623" strokeOpacity={(0.6 - i * 0.15).toFixed(2)} strokeWidth="1" />
              ))}
            </svg>
          </div>
        )}

        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-sdp-red flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-ink truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Slalom{' '}
                <em style={{ fontStyle: 'italic', fontWeight: 300, opacity: 0.65 }}>Delivery</em>
              </p>
              <p className="text-[10px] text-ink-3 truncate tracking-wider uppercase">Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-7 w-7 rounded-lg bg-sdp-red flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">S</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-elevated transition-colors text-ink-3 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Project context */}
      {!collapsed && (
        <div className="px-3 py-2.5 border-b border-[var(--line)] shrink-0">
          <p className="text-[9px] text-ink-3 uppercase tracking-widest font-semibold mb-1.5">Current Program</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
            <p className="text-xs text-ink truncate font-medium">{currentProject.name}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <div className="sdp-sep text-[8px] mb-1.5 mx-1" style={{ letterSpacing: '0.5em' }}>
                {section.section}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Admin link */}
        {(user?.role === "super_admin" || user?.role === "admin") && (
          <div>
            {!collapsed && (
              <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-3">
                Administration
              </p>
            )}
            <NavItem href="/admin" icon="LayoutDashboard" label="Admin Panel" collapsed={collapsed} />
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-[var(--line)] p-2 space-y-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-2.5 py-2 text-sm text-ink-2 hover:bg-elevated hover:text-ink transition-all",
            collapsed && "justify-center"
          )}
        >
          {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </button>

        {/* Collapse toggle (when expanded) */}
        {!collapsed && (
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-3 w-full rounded-lg px-2.5 py-2 text-sm text-ink-2 hover:bg-elevated hover:text-ink transition-all"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" />
            <span>Collapse</span>
          </button>
        )}
        {collapsed && (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-full rounded-lg px-2.5 py-2 text-sm text-ink-2 hover:bg-elevated hover:text-ink transition-all"
          >
            <ChevronRight className="h-4 w-4 shrink-0" />
          </button>
        )}

        {/* User */}
        <div className={cn(
          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-elevated transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}>
          {user && <Avatar name={user.name} size="sm" />}
          {!collapsed && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{user.name}</p>
              <p className="text-xs text-ink-3 truncate">{user.title}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1 rounded hover:bg-elevated transition-colors text-ink-3 hover:text-danger shrink-0"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-full shrink-0">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14 bg-surface border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-sdp-red flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-semibold text-ink" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Slalom Delivery
          </span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-ink-2">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 bottom-0 z-50 flex h-full w-60">
            {SidebarContent}
          </aside>
        </>
      )}
    </>
  )
}
