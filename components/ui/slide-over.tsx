"use client"
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const SlideOver = DialogPrimitive.Root
const SlideOverTrigger = DialogPrimitive.Trigger
const SlideOverClose = DialogPrimitive.Close

const SlideOverOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-40 bg-black/40 backdrop-blur-sm", className)}
    {...props}
  />
))
SlideOverOverlay.displayName = "SlideOverOverlay"

interface SlideOverContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  width?: "sm" | "md" | "lg" | "xl"
}

const widthMap = {
  sm:  "w-[380px]",
  md:  "w-[480px]",
  lg:  "w-[560px]",
  xl:  "w-[680px]",
}

const SlideOverContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SlideOverContentProps
>(({ className, children, width = "md", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <SlideOverOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 z-50 h-full flex flex-col",
        "bg-surface border-l border-[var(--line)] shadow-2xl",
        "data-[state=open]:animate-slide-right focus:outline-none",
        widthMap[width],
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
SlideOverContent.displayName = "SlideOverContent"

const SlideOverHeader = ({
  className,
  title,
  subtitle,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title?: string; subtitle?: string }) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4 p-5 border-b border-[var(--line)] shrink-0",
      className
    )}
    {...props}
  >
    <div>
      {title && (
        <h2
          className="font-semibold text-base text-ink"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {title}
        </h2>
      )}
      {subtitle && <p className="text-sm text-ink-2 mt-0.5">{subtitle}</p>}
    </div>
    <SlideOverClose className="rounded p-1 opacity-70 hover:opacity-100 hover:bg-elevated transition-all">
      <X className="h-4 w-4 text-ink-2" />
      <span className="sr-only">Close</span>
    </SlideOverClose>
  </div>
)

const SlideOverBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto p-5 space-y-5", className)} {...props} />
)

const SlideOverFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "shrink-0 flex items-center justify-end gap-2 p-5 border-t border-[var(--line)]",
      className
    )}
    {...props}
  />
)

export {
  SlideOver,
  SlideOverTrigger,
  SlideOverClose,
  SlideOverContent,
  SlideOverHeader,
  SlideOverBody,
  SlideOverFooter,
}
