import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  dark?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "text-sm font-semibold uppercase tracking-widest",
            dark ? "text-[#36D1FF]" : "text-[#006EF5]",
            align === "center" && "flex items-center justify-center gap-2"
          )}
        >
          {align === "center" && (
            <span className={cn("h-px w-8", dark ? "bg-[#36D1FF]" : "bg-[#006EF5]")} />
          )}
          {eyebrow}
          {align === "center" && (
            <span className={cn("h-px w-8", dark ? "bg-[#36D1FF]" : "bg-[#006EF5]")} />
          )}
        </div>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight",
          dark ? "text-white" : "text-[#102590]"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base leading-relaxed",
            dark ? "text-white/70" : "text-gray-600"
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
