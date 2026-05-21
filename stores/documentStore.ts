"use client"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"
import type { ProjectDocument, DocumentType, DocumentStatus } from "@/lib/types"
import { MOCK_DOCUMENTS } from "@/lib/mock-data/documents"
import { generateId } from "@/lib/utils"

interface DocumentState {
  documents: ProjectDocument[]
  selectedId: string | null
  addDocument: (doc: Omit<ProjectDocument, "id" | "createdAt" | "updatedAt">) => ProjectDocument
  updateDocument: (id: string, patch: Partial<ProjectDocument>) => void
  deleteDocument: (id: string) => void
  setSelected: (id: string | null) => void
  linkWorkItem: (docId: string, workItemId: string) => void
  unlinkWorkItem: (docId: string, workItemId: string) => void
  reset: () => void
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: MOCK_DOCUMENTS,
      selectedId: null,

      addDocument: (doc) => {
        const now = new Date().toISOString()
        const newDoc: ProjectDocument = { ...doc, id: generateId(), createdAt: now, updatedAt: now }
        set((s) => ({ documents: [newDoc, ...s.documents] }))
        return newDoc
      },

      updateDocument: (id, patch) => {
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d
          ),
        }))
      },

      deleteDocument: (id) => {
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) }))
      },

      setSelected: (id) => set({ selectedId: id }),

      linkWorkItem: (docId, workItemId) => {
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === docId && !d.linkedWorkItems.includes(workItemId)
              ? { ...d, linkedWorkItems: [...d.linkedWorkItems, workItemId], updatedAt: new Date().toISOString() }
              : d
          ),
        }))
      },

      unlinkWorkItem: (docId, workItemId) => {
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === docId
              ? { ...d, linkedWorkItems: d.linkedWorkItems.filter((id) => id !== workItemId), updatedAt: new Date().toISOString() }
              : d
          ),
        }))
      },

      reset: () => set({ documents: MOCK_DOCUMENTS, selectedId: null }),
    }),
    {
      name: "sdp-documents-v2",
      partialize: (s) => ({ documents: s.documents }),
    }
  )
)

export const useProjectDocuments = (projectId: string) =>
  useDocumentStore(
    useShallow((s) => s.documents.filter((d) => d.projectId === projectId))
  )

export const useDocument = (id: string) =>
  useDocumentStore((s) => s.documents.find((d) => d.id === id))

export const DOCUMENT_TYPE_META: Record<
  DocumentType,
  { label: string; icon: string; color: string; bg: string }
> = {
  charter:        { label: "Project Charter",    icon: "Landmark",       color: "text-sdp-red",   bg: "bg-sdp-red/10" },
  sow:            { label: "Statement of Work",  icon: "FileText",       color: "text-warning",   bg: "bg-warning/10" },
  prd:            { label: "Product Req. Doc.",  icon: "ClipboardList",  color: "text-info",      bg: "bg-info/10" },
  architecture:   { label: "Architecture Doc",   icon: "Cpu",            color: "text-success",   bg: "bg-success/10" },
  meeting_notes:  { label: "Meeting Notes",      icon: "BookOpen",       color: "text-ink-2",     bg: "bg-elevated" },
  change_request: { label: "Change Request",     icon: "GitPullRequest", color: "text-warning",   bg: "bg-warning/10" },
}

export const DOCUMENT_STATUS_META: Record<
  DocumentStatus,
  { label: string; color: string }
> = {
  draft:    { label: "Draft",    color: "bg-ink-3/20 text-ink-3" },
  review:   { label: "Review",   color: "bg-warning/10 text-warning" },
  approved: { label: "Approved", color: "bg-success/10 text-success" },
  archived: { label: "Archived", color: "bg-ink-3/20 text-ink-3" },
}
