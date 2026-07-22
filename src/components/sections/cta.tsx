import Link from "next/link"
import { Phone, ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SITE_CONFIG } from "@/lib/constants"

export function Cta() {
  return (
    <section className="bg-[#102590] py-16">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Sẵn sàng cho nguồn nước <span className="text-[#36D1FF]">tinh khiết</span>?
            </h2>
            <p className="text-white/70 text-base">
              Đội ngũ kỹ thuật viên chuyên nghiệp sẵn sàng khảo sát và tư vấn giải pháp phù hợp cho ngôi nhà của bạn.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="inline-flex h-14 items-center gap-2 rounded-md bg-white text-[#102590] px-6 text-sm font-bold uppercase hover:bg-[#36D1FF] transition-colors"
            >
              <Phone className="h-4 w-4" />
              Gọi: {SITE_CONFIG.phone}
            </a>
            <Link
              href="/survey"
              className="inline-flex h-14 items-center gap-2 rounded-md border border-white/40 text-white px-6 text-sm font-bold uppercase hover:bg-white/10 transition-colors"
            >
              Khảo sát ngay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
