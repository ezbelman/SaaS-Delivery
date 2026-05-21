"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthHasHydrated, useAuthStore } from "@/stores/authStore"
import { useUIStore } from "@/stores/uiStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const hasHydrated = useAuthHasHydrated()
  const theme = useUIStore((s) => s.theme)
  const router = useRouter()

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hasHydrated, isAuthenticated, router])

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light")
  }, [theme])

  if (!hasHydrated) return null
  if (!isAuthenticated) return null
  return <>{children}</>
}
