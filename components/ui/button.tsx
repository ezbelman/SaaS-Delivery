import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sdp-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-sdp-red text-white shadow-md shadow-sdp-red/20 hover:bg-sdp-red-dark active:scale-[0.97]",
        secondary:
          "bg-elevated text-ink border border-[var(--line)] hover:bg-overlay hover:border-ink-3/30 active:scale-[0.97]",
        outline:
          "border border-[var(--line)] text-ink bg-transparent hover:bg-elevated hover:border-ink-3/30 active:scale-[0.97]",
        ghost:
          "text-ink-2 hover:bg-elevated hover:text-ink active:scale-[0.97]",
        danger:
          "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 active:scale-[0.97]",
        success:
          "bg-success/10 text-success border border-success/20 hover:bg-success/20 active:scale-[0.97]",
        link:
          "text-sdp-red underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        sm:   "h-8 px-3.5 text-xs rounded-md",
        md:   "h-9 px-4",
        lg:   "h-10 px-6 text-base",
        xl:   "h-12 px-8 text-base font-semibold",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
