import { MapPin, Phone, Mail } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SITE_CONFIG } from "@/lib/constants"

export function TopBar() {
  return (
    <div className="hidden md:block bg-[#020035] text-white text-xs py-2.5">
      <Container className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#36D1FF]" />
            {SITE_CONFIG.address}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href={`tel:${SITE_CONFIG.hotline.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 hover:text-[#36D1FF] transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-[#36D1FF]" />
            Hotline: {SITE_CONFIG.hotline}
          </a>
          <a
            href={SITE_CONFIG.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#36D1FF] transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-[#36D1FF]" />
            Zalo: {SITE_CONFIG.hotline}
          </a>
        </div>
      </Container>
    </div>
  )
}
