"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"
import type { WorkItem, Sprint } from "@/lib/types"
import { MOCK_WORK_ITEMS, MOCK_SPRINTS } from "@/lib/mock-data/work-items"
import { generateId } from "@/lib/utils"

type ScheduleView = "wbs" | "gantt" | "kanban" | "resource" | "executive"

interface ScheduleState {
  workItems: WorkItem[]
  sprints: Sprint[]
  view: ScheduleView
  expandedIds: Set<string>
  selectedId: string | null
  setView: (view: ScheduleView) => void
  toggleExpanded: (id: string) => void
  expandAll: () => void
  collapseAll: () => void
  addWorkItem: (item: Omit<WorkItem, "id" | "createdAt" | "updatedAt">) => WorkItem
  updateWorkItem: (id: string, patch: Partial<WorkItem>) => void
  deleteWorkItem: (id: string) => void
  setSelected: (id: string | null) => void
  addSprint: (sprint: Omit<Sprint, "id" | "createdAt">) => Sprint
  updateSprint: (id: string, patch: Partial<Sprint>) => void
  moveToSprint: (itemId: string, sprintId: string | undefined) => void
  reset: () => void
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      workItems: MOCK_WORK_ITEMS,
      sprints: MOCK_SPRINTS,
      view: "wbs",
      expandedIds: new Set(["wi-001", "wi-002", "wi-005", "wi-010", "wi-011", "wi-014", "wi-030", "wi-031", "wi-035"]),
      selectedId: null,

      setView: (view) => set({ view }),

      toggleExpanded: (id) =>
        set((s) => {
          const next = new Set(s.expandedIds)
          next.has(id) ? next.delete(id) : next.add(id)
          return { expandedIds: next }
        }),

      expandAll: () =>
        set((s) => ({
          expandedIds: new Set(s.workItems.filter((i) => i.parentId === undefined).map((i) => i.id)),
        })),

      collapseAll: () => set({ expandedIds: new Set() }),

      addWorkItem: (item) => {
        const now = new Date().toISOString()
        const newItem: WorkItem = { ...item, id: generateId(), createdAt: now, updatedAt: now }
        set((s) => ({ workItems: [...s.workItems, newItem] }))
        return newItem
      },

      updateWorkItem: (id, patch) =>
        set((s) => ({
          workItems: s.workItems.map((i) =>
            i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i
          ),
        })),

      deleteWorkItem: (id) =>
        set((s) => ({
          workItems: s.workItems.filter((i) => i.id !== id && i.parentId !== id),
        })),

      setSelected: (id) => set({ selectedId: id }),

      addSprint: (sprint) => {
        const now = new Date().toISOString()
        const newSprint: Sprint = { ...sprint, id: generateId(), createdAt: now }
        set((s) => ({ sprints: [newSprint, ...s.sprints] }))
        return newSprint
      },

      updateSprint: (id, patch) =>
        set((s) => ({
          sprints: s.sprints.map((sp) => (sp.id === id ? { ...sp, ...patch } : sp)),
        })),

      moveToSprint: (itemId, sprintId) =>
        set((s) => ({
          workItems: s.workItems.map((i) =>
            i.id === itemId
              ? { ...i, sprintId, updatedAt: new Date().toISOString() }
              : i
          ),
        })),

      reset: () =>
        set({
          workItems:   MOCK_WORK_ITEMS,
          sprints:     MOCK_SPRINTS,
          expandedIds: new Set(["wi-001", "wi-002", "wi-005", "wi-010", "wi-011", "wi-014", "wi-030", "wi-031", "wi-035"]),
          selectedId:  null,
          view:        "wbs",
        }),
    }),
    {
      name: "sdp-schedule-v2",
      partialize: (s) => ({
        workItems: s.workItems,
        sprints: s.sprints,
        expandedIds: Array.from(s.expandedIds),
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Record<string, unknown>
        return {
          ...current,
          ...p,
          expandedIds: new Set(
            Array.isArray(p?.expandedIds) ? (p.expandedIds as string[]) : []
          ),
        }
      },
    }
  )
)

export const useWorkItems = (projectId?: string) =>
  useScheduleStore(
    useShallow((s) => (projectId ? s.workItems.filter((i) => i.projectId === projectId) : s.workItems))
  )

export const useSprints = (projectId?: string) =>
  useScheduleStore(
    useShallow((s) => (projectId ? s.sprints.filter((sp) => sp.projectId === projectId) : s.sprints))
  )

export const useActiveSprint = (projectId: string) =>
  useScheduleStore((s) => s.sprints.find((sp) => sp.projectId === projectId && sp.status === "active"))
