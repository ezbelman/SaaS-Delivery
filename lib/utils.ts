import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(date: string | Date, fmt = "MMM d, yyyy"): string {
  return format(new Date(date), fmt)
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "MMM d")
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function isOverdue(dueDate: string | Date): boolean {
  return isBefore(new Date(dueDate), new Date())
}

export function isDueSoon(dueDate: string | Date, days = 3): boolean {
  return isBefore(new Date(dueDate), addDays(new Date(), days))
}

export function isAfterDate(date: string | Date, reference: string | Date): boolean {
  return isAfter(new Date(date), new Date(reference))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key])
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(arr: T[], key: keyof T, dir: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av < bv) return dir === "asc" ? -1 : 1
    if (av > bv) return dir === "asc" ? 1 : -1
    return 0
  })
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen)}…`
}

export function downloadCSV(filename: string, rows: Record<string, unknown>[]): void {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ]
  const blob = new Blob([lines.join("\n")], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function getDaysBetween(start: string | Date, end: string | Date): number {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export function addWorkingDays(date: Date, days: number): Date {
  let d = new Date(date)
  let count = 0
  while (count < days) {
    d = addDays(d, 1)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) count++
  }
  return d
}
