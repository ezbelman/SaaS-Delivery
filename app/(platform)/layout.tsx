import { Sidebar } from "@/components/layout/sidebar"
import { AuthGuard } from "@/components/layout/auth-guard"

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col md:pt-0 pt-14">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
