import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

export function Skeleton({ className, lines, ...props }: SkeletonProps) {
  if (lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn("skeleton h-4 rounded", i === lines - 1 && "w-3/4", className)}
          />
        ))}
      </div>
    )
  }
  return <div className={cn("skeleton rounded", className)} {...props} />
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-surface p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <Skeleton lines={3} />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-0">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--line)]">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      ))}
    </div>
  )
}
