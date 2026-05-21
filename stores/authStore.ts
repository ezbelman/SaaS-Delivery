"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, UserRole } from "@/lib/types"
import { MOCK_USERS } from "@/lib/mock-data/users"
import { MOCK_CREDENTIALS } from "@/lib/constants"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  simulatedRole: UserRole | null
  hasHydrated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  setSimulatedRole: (role: UserRole) => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      simulatedRole: null,
      hasHydrated: false,

      login: (email, password) => {
        if (
          email.toLowerCase() === MOCK_CREDENTIALS.email &&
          password === MOCK_CREDENTIALS.password
        ) {
          const user = MOCK_USERS.find((u) => u.email === MOCK_CREDENTIALS.email) ?? MOCK_USERS[0]
          set({ user, isAuthenticated: true })
          return { success: true }
        }
        return { success: false, error: "Invalid email or password" }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, simulatedRole: null })
      },

      setSimulatedRole: (role) => set({ simulatedRole: role }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "sdp-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        simulatedRole: state.simulatedRole,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

export const useCurrentUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useAuthHasHydrated = () => useAuthStore((s) => s.hasHydrated)
export const useEffectiveRole = (): UserRole | null =>
  useAuthStore((s) => s.simulatedRole ?? s.user?.role ?? null)
