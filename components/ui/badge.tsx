import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { RagStatus, Priority, RaidType, WorkItemStatus } from "@/lib/types"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-elevated text-ink-2 ring-[var(--line)]",
        primary:   "bg-sdp-red/10 text-sdp-red ring-sdp-red/20",
        success:   "bg-success/10 text-success ring-success/20",
        warning:   "bg-warning/10 text-warning ring-warning/20",
        danger:    "bg-danger/10 text-danger ring-danger/20",
        info:      "bg-info/10 text-info ring-info/20",
        ghost:     "bg-transparent text-ink-3 ring-[var(--line)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-success",
            variant === "warning" && "bg-warning",
            variant === "danger"  && "bg-danger",
            variant === "info"    && "bg-info",
            variant === "primary" && "bg-sdp-red",
            (!variant || variant === "default" || variant === "ghost") && "bg-ink-3"
          )}
        />
      )}
      {children}
    </span>
  )
}

// ─── Semantic Badges ──────────────────────────────────────────────────────────

export function RAGBadge({ status }: { status: RagStatus }) {
  const map: Record<RagStatus, { variant: BadgeProps["variant"]; label: string }> = {
    green: { variant: "success", label: "On Track" },
    amber: { variant: "warning", label: "At Risk" },
    red:   { variant: "danger",  label: "Off Track" },
    grey:  { variant: "ghost",   label: "Not Started" },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { variant: BadgeProps["variant"]; label: string }> = {
    critical: { variant: "danger",  label: "Critical" },
    high:     { variant: "warning", label: "High" },
    medium:   { variant: "info",    label: "Medium" },
    low:      { variant: "ghost",   label: "Low" },
  }
  const { variant, label } = map[priority]
  return <Badge variant={variant}>{label}</Badge>
}

export function RaidTypeBadge({ type }: { type: RaidType }) {
  const map: Record<RaidType, { variant: BadgeProps["variant"]; label: string }> = {
    risk:       { variant: "danger",  label: "Risk" },
    assumption: { variant: "info",    label: "Assumption" },
    issue:      { variant: "warning", label: "Issue" },
    decision:   { variant: "success", label: "Decision" },
  }
  const { variant, label } = map[type]
  return <Badge variant={variant}>{label}</Badge>
}

export function StatusBadge({ status }: { status: WorkItemStatus | string }) {
  const map: Record<string, { variant: BadgeProps["variant"]; label: string }> = {
    not_started: { variant: "ghost",   label: "Not Started" },
    in_progress: { variant: "info",    label: "In Progress" },
    completed:   { variant: "success", label: "Completed" },
    blocked:     { variant: "danger",  label: "Blocked" },
    cancelled:   { variant: "ghost",   label: "Cancelled" },
    open:        { variant: "info",    label: "Open" },
    escalated:   { variant: "danger",  label: "Escalated" },
    closed:      { variant: "success", label: "Closed" },
    active:      { variant: "success", label: "Active" },
    planning:    { variant: "info",    label: "Planning" },
    review:      { variant: "warning", label: "In Review" },
  }
  const entry = map[status] ?? { variant: "default" as const, label: status }
  return <Badge variant={entry.variant} dot>{entry.label}</Badge>
}

export { Badge, badgeVariants }
