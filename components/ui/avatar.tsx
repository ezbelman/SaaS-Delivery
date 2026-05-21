import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn, getInitials } from "@/lib/utils"

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
))
AvatarRoot.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-sdp-red/10 text-sdp-red text-xs font-semibold",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// ─── High-level Avatar component ─────────────────────────────────────────────
interface AvatarProps {
  name: string
  src?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-7 w-7 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
  xl: "h-12 w-12 text-base",
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  return (
    <AvatarRoot className={cn(sizeMap[size], className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </AvatarRoot>
  )
}

// ─── Avatar Group ─────────────────────────────────────────────────────────────
interface AvatarGroupProps {
  names: string[]
  max?: number
  size?: AvatarProps["size"]
}

export function AvatarGroup({ names, max = 3, size = "sm" }: AvatarGroupProps) {
  const visible = names.slice(0, max)
  const remaining = names.length - max

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((name) => (
        <Avatar
          key={name}
          name={name}
          size={size}
          className="ring-2 ring-surface"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            sizeMap[size],
            "flex items-center justify-center rounded-full bg-elevated ring-2 ring-surface text-ink-2 font-medium text-[10px]"
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export { AvatarRoot, AvatarImage, AvatarFallback }
