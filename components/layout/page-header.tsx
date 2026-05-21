import React from "react"
import { cn } from "@/lib/utils"

/* Slalom signature: last word of every headline rendered italic + lighter weight */
function SlalomTitle({ text }: { text: string }) {
  const words = text.trim().split(/\s+/)
  if (words.length <= 1) return <>{text}</>
  const head = words.slice(0, -1).join(' ')
  const tail = words[words.length - 1]
  return (
    <>
      {head}{' '}
      <em className="sdp-headline-em not-italic" style={{ fontStyle: 'italic' }}>{tail}</em>
    </>
  )
}

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: React.ReactNode
  tabs?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  tabs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("shrink-0 border-b border-[var(--line)] bg-surface", className)}>
      <div className="px-6 pt-5 pb-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-2.5">
            {breadcrumb.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-ink-3 text-xs opacity-50">·</span>}
                {item.href ? (
                  <a href={item.href} className="text-xs text-ink-3 hover:text-ink-2 transition-colors tracking-wide">
                    {item.label}
                  </a>
                ) : (
                  <span className="text-xs text-ink-3 tracking-wide">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="flex items-start justify-between gap-4 pb-4">
          <div className="flex items-start gap-3">
            {/* Slalom-style red accent bar */}
            <div
              className="mt-1 shrink-0 rounded-full"
              style={{ width: 3, height: 22, background: 'var(--sdp-red)' }}
            />
            <div>
              <h1
                className="text-2xl font-bold text-ink tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <SlalomTitle text={title} />
              </h1>
              {subtitle && (
                <p className="text-sm text-ink-2 mt-1 leading-snug">{subtitle}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0 mt-1">{actions}</div>
          )}
        </div>

        {tabs && <div className="flex items-center gap-0">{tabs}</div>}
      </div>
    </div>
  )
}

// ─── Stat / KPI card ─────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  trend?: "up" | "down" | "flat"
  trendValue?: string
  color?: "default" | "red" | "green" | "amber" | "blue"
  icon?: React.ReactNode
  className?: string
}

const colorClasses = {
  default: { text: "text-ink",    bg: "bg-elevated",    border: "border-[var(--line)]" },
  red:     { text: "text-danger",  bg: "bg-danger/5",    border: "border-danger/15" },
  green:   { text: "text-success", bg: "bg-success/5",   border: "border-success/15" },
  amber:   { text: "text-warning", bg: "bg-warning/5",   border: "border-warning/15" },
  blue:    { text: "text-info",    bg: "bg-info/5",      border: "border-info/15" },
}

export function StatCard({ label, value, trend, trendValue, color = "default", icon, className }: StatCardProps) {
  const { text, bg, border } = colorClasses[color]
  return (
    <div className={cn(
      "rounded-xl border p-4 flex flex-col gap-2 transition-colors hover:bg-opacity-80",
      bg, border,
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-ink-2 uppercase tracking-widest">{label}</p>
        {icon && <div className={cn("text-ink-3", text)}>{icon}</div>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className={cn("text-3xl font-bold leading-none", text)} style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {value}
        </p>
        {trendValue && (
          <span className={cn(
            "text-xs font-medium mb-0.5",
            trend === "up"   && "text-success",
            trend === "down" && "text-danger",
            !trend           && "text-ink-3",
          )}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""} {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── KPI Row ──────────────────────────────────────────────────────────────────
interface KPIRowProps {
  stats: StatCardProps[]
  className?: string
}

export function KPIRow({ stats, className }: KPIRowProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  )
}
