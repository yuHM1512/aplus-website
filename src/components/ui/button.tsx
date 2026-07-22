import { cn } from "@/lib/utils"
import { forwardRef, ButtonHTMLAttributes } from "react"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-[#102590] text-white hover:bg-[#36D1FF] hover:text-[#102590]",
  secondary: "bg-[#006EF5] text-white hover:bg-[#0058C7]",
  outline: "border border-[#102590] text-[#102590] hover:bg-[#102590] hover:text-white",
  ghost: "text-[#102590] hover:bg-[#F2F3F4]",
  white: "bg-white text-[#102590] hover:bg-[#F2F3F4]",
}

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006EF5] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
)
Button.displayName = "Button"
