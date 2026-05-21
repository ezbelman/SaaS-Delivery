import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps {
  value: number
  max?: number
  size?: "xs" | "sm" | "md"
  color?: "red" | "green" | "amber" | "blue" | "default"
  showLabel?: boolean
  className?: string
}

const colorMap = {
  red:     "bg-sdp-red",
  green:   "bg-success",
  amber:   "bg-warning",
  blue:    "bg-info",
  default: "bg-sdp-red",
}

const sizeMap = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
}

export function Progress({
  value,
  max = 100,
  size = "sm",
  color = "default",
  showLabel = false,
  className,
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  const autoColor = pct >= 70 ? "green" : pct >= 40 ? "amber" : "red"
  const barColor = colorMap[color === "default" ? autoColor : color]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-elevated overflow-hidden",
          sizeMap[size]
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-ink-2 tabular-nums w-8 text-right">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}
