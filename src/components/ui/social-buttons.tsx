import { Facebook, Instagram } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/constants"

// TikTok + Shopee aren't in lucide, so we use inline SVGs
function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.2v12.6a2.6 2.6 0 1 1-1.86-2.5V7.8a5.8 5.8 0 1 0 5.06 5.75V9.01a7.4 7.4 0 0 0 4.32 1.38V7.2a4.28 4.28 0 0 1-3.4-1.38Z" />
    </svg>
  )
}

function ShopeeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C9.6 2 7.7 3.9 7.7 6.3v.4H4.6c-.5 0-.9.4-1 .9l-.9 12.1c0 .6.4 1.1 1 1.1h16.6c.6 0 1-.5 1-1.1l-.9-12.1c0-.5-.5-.9-1-.9h-3.1v-.4C16.3 3.9 14.4 2 12 2Zm0 1.7c1.5 0 2.6 1.2 2.6 2.6v.4H9.4v-.4c0-1.4 1.1-2.6 2.6-2.6Zm.1 6c1.6 0 2.8.8 2.8 2.3 0 .3-.3.6-.6.6-.3 0-.5-.2-.6-.5-.1-.6-.7-.9-1.6-.9-.9 0-1.5.4-1.5 1 0 .6.5.8 1.7 1.1 1.6.4 2.7.9 2.7 2.3 0 1.5-1.3 2.3-2.9 2.3-1.7 0-3-.9-3-2.4 0-.3.3-.6.6-.6.3 0 .5.2.6.5.1.7.8 1.1 1.8 1.1 1 0 1.6-.4 1.6-1s-.5-.9-1.8-1.2c-1.4-.4-2.6-.8-2.6-2.2 0-1.4 1.3-2.3 2.8-2.3Z" />
    </svg>
  )
}

const buttons = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: Facebook, hover: "hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white" },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: Instagram, hover: "hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white" },
  { label: "TikTok", href: SOCIAL_LINKS.tiktok, Icon: TiktokIcon, hover: "hover:bg-[#010101] hover:border-[#010101] hover:text-white" },
  { label: "Shopee", href: SOCIAL_LINKS.shopee, Icon: ShopeeIcon, hover: "hover:bg-[#EE4D2D] hover:border-[#EE4D2D] hover:text-white" },
]

export function SocialButtons({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md"
  className?: string
}) {
  const box = size === "md" ? "w-9 h-9" : "w-8 h-8"
  const icon = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {buttons.map(({ label, href, Icon, hover }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={`Xem trên ${label}`}
          className={`${box} flex items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors ${hover}`}
        >
          <Icon className={icon} />
        </a>
      ))}
    </div>
  )
}
