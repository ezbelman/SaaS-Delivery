"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIState {
  sidebarOpen: boolean
  theme: "dark" | "light"
  currentProjectId: string
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: "dark" | "light") => void
  toggleTheme: () => void
  setCurrentProject: (id: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: "dark",
      currentProjectId: "prj-001",

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      setCurrentProject: (id) => set({ currentProjectId: id }),
    }),
    {
      name: "sdp-ui",
      partialize: (s) => ({
        theme: s.theme,
        sidebarOpen: s.sidebarOpen,
        currentProjectId: s.currentProjectId,
      }),
    }
  )
)
