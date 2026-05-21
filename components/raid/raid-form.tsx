"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input, Textarea } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import type { RaidItem } from "@/lib/types"

const schema = z.object({
  type: z.enum(["risk", "assumption", "issue", "decision"]),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide more detail"),
  priority: z.enum(["critical", "high", "medium", "low"]),
  status: z.enum(["open", "in_progress", "escalated", "closed"]),
  ownerId: z.string().min(1, "Owner is required"),
  dueDate: z.string().optional(),
  impact: z.string().optional(),
  probability: z.enum(["high", "medium", "low"]).optional(),
  responsePlan: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface RaidFormProps {
  defaultValues?: Partial<RaidItem>
  onSubmit: (values: Omit<RaidItem, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
  isLoading?: boolean
}

import { MOCK_USERS } from "@/lib/mock-data/users"

export function RaidForm({ defaultValues, onSubmit, onCancel, isLoading }: RaidFormProps) {
  const [type, setType] = useState<string>(defaultValues?.type ?? "risk")

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: defaultValues?.type ?? "risk",
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      priority: defaultValues?.priority ?? "medium",
      status: defaultValues?.status ?? "open",
      ownerId: defaultValues?.ownerId ?? "",
      dueDate: defaultValues?.dueDate ?? "",
      impact: defaultValues?.impact ?? "",
      probability: defaultValues?.probability ?? undefined,
      responsePlan: defaultValues?.responsePlan ?? "",
    },
  })

  const watchType = watch("type")

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      projectId: defaultValues?.projectId ?? "prj-001",
      tags: defaultValues?.tags ?? [],
      dueDate: values.dueDate || undefined,
      impact: values.impact || undefined,
      responsePlan: values.responsePlan || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Type + Priority row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Type</label>
          <select
            {...register("type")}
            className="flex h-9 w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
          >
            <option value="risk">Risk</option>
            <option value="assumption">Assumption</option>
            <option value="issue">Issue</option>
            <option value="decision">Decision</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Priority</label>
          <select
            {...register("priority")}
            className="flex h-9 w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Title *</label>
        <input
          {...register("title")}
          placeholder="Brief, descriptive title..."
          className="flex h-9 w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
        />
        {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Description *</label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Detailed description of the item..."
          className="flex w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30 resize-none"
        />
        {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
      </div>

      {/* Owner + Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Owner *</label>
          <select
            {...register("ownerId")}
            className="flex h-9 w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
          >
            <option value="">Select owner...</option>
            {MOCK_USERS.filter(u => u.role !== "client_viewer").map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          {errors.ownerId && <p className="text-xs text-danger">{errors.ownerId.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Due Date</label>
          <input
            {...register("dueDate")}
            type="date"
            className="flex h-9 w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
          />
        </div>
      </div>

      {/* Risk-specific fields */}
      {(watchType === "risk" || watchType === "issue") && (
        <>
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Impact</label>
            <input
              {...register("impact")}
              placeholder="Schedule, cost, quality, or reputational impact..."
              className="flex h-9 w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
            />
          </div>
          {watchType === "risk" && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Probability</label>
              <select
                {...register("probability")}
                className="flex h-9 w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30"
              >
                <option value="">Select...</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-ink-2">Response Plan</label>
            <textarea
              {...register("responsePlan")}
              rows={2}
              placeholder="Mitigation or response strategy..."
              className="flex w-full rounded-md border border-[var(--line)] bg-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-3 focus:outline-none focus:border-sdp-red focus:ring-1 focus:ring-sdp-red/30 resize-none"
            />
          </div>
        </>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          {defaultValues?.id ? "Save Changes" : "Create Item"}
        </Button>
      </div>
    </form>
  )
}
