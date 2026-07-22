import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
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
            "text-sm font-semibold uppercase tracking-widest text-[#006EF5]",
            align === "center" && "flex items-center justify-center gap-2"
          )}
        >
          {align === "center" && <span className="h-px w-8 bg-[#006EF5]" />}
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-[#006EF5]" />}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-[#102590] tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base text-gray-600 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
