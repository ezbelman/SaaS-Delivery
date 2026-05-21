"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"
import type { RaidItem, Escalation, RaidType, RaidStatus, Priority } from "@/lib/types"
import { MOCK_RAID_ITEMS, MOCK_ESCALATIONS } from "@/lib/mock-data/raid-items"
import { generateId } from "@/lib/utils"

interface RaidState {
  items: RaidItem[]
  escalations: Escalation[]
  selectedId: string | null
  addItem: (item: Omit<RaidItem, "id" | "createdAt" | "updatedAt">) => RaidItem
  updateItem: (id: string, patch: Partial<RaidItem>) => void
  deleteItem: (id: string) => void
  setSelected: (id: string | null) => void
  addEscalation: (esc: Omit<Escalation, "id" | "createdAt">) => Escalation
  updateEscalation: (id: string, patch: Partial<Escalation>) => void
}

export const useRaidStore = create<RaidState>()(
  persist(
    (set, get) => ({
      items: MOCK_RAID_ITEMS,
      escalations: MOCK_ESCALATIONS,
      selectedId: null,

      addItem: (item) => {
        const now = new Date().toISOString()
        const newItem: RaidItem = { ...item, id: generateId(), createdAt: now, updatedAt: now }
        set((s) => ({ items: [newItem, ...s.items] }))
        return newItem
      },

      updateItem: (id, patch) => {
        set((s) => ({
          items: s.items.map((item) =>
            item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
          ),
        }))
      },

      deleteItem: (id) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }))
      },

      setSelected: (id) => set({ selectedId: id }),

      addEscalation: (esc) => {
        const now = new Date().toISOString()
        const newEsc: Escalation = { ...esc, id: generateId(), createdAt: now }
        set((s) => ({ escalations: [newEsc, ...s.escalations] }))
        return newEsc
      },

      updateEscalation: (id, patch) => {
        set((s) => ({
          escalations: s.escalations.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }))
      },
    }),
    {
      name: "sdp-raid-v2",
      partialize: (s) => ({ items: s.items, escalations: s.escalations }),
    }
  )
)

// Selectors
export const useRaidItems = (projectId?: string) =>
  useRaidStore(
    useShallow((s) => (projectId ? s.items.filter((i) => i.projectId === projectId) : s.items))
  )

export const useRaidKPIs = (projectId: string) =>
  useRaidStore(
    useShallow((s) => {
      const items = s.items.filter((i) => i.projectId === projectId)
      return {
        total: items.length,
        open: items.filter((i) => i.status === "open").length,
        escalated: items.filter((i) => i.status === "escalated").length,
        critical: items.filter((i) => i.priority === "critical").length,
        overdue: items.filter(
          (i) => i.dueDate && new Date(i.dueDate) < new Date() && i.status !== "closed"
        ).length,
        riskCount: items.filter((i) => i.type === "risk").length,
        assumptionCount: items.filter((i) => i.type === "assumption").length,
        issueCount: items.filter((i) => i.type === "issue").length,
        decisionCount: items.filter((i) => i.type === "decision").length,
      }
    })
  )
