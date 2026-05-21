"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { useUIStore } from "@/stores/uiStore"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const theme = useUIStore((s) => s.theme)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light")
  }, [theme])

  if (!isAuthenticated) return null
  return <>{children}</>
}
