import { AuthGuard } from "@/components/layout/auth-guard"
import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
