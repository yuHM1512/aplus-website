import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1535868118629-f37bcd69ff59?auto=format&fit=crop&w=1920&q=80"

export function Hero() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] text-white overflow-hidden">
      {/* Full-bleed background photo */}
      <Image
        src={HERO_IMAGE}
        alt="Giọt nước tinh khiết — APLUS Technologies"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Color overlay — deep blue brand tint */}
      <div className="absolute inset-0 bg-[#102590]/65" />
      {/* Left-heavy gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a60]/80 via-[#102590]/40 to-transparent" />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a1a60] to-transparent" />

      <Container className="relative py-24 lg:py-32">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest text-[#36D1FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#36D1FF]" />
            Water Purification Technology
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Giải Pháp Lọc Nước<br />
            <span className="text-[#36D1FF]">Toàn Diện</span>
          </h1>

          <p className="text-lg text-white/85 leading-relaxed max-w-lg">
            Ứng dụng công nghệ lọc nước tiên tiến nhất từ Châu Âu,
            APLUS Technologies mang đến nguồn nước tinh khiết và an toàn
            tuyệt đối cho gia đình và doanh nghiệp của bạn.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/products"
              className="inline-flex h-14 items-center justify-center rounded-md bg-white text-[#102590] px-8 text-sm font-bold uppercase tracking-wide hover:bg-[#36D1FF] hover:text-white transition-colors"
            >
              Xem Sản Phẩm
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-white/40 text-white px-8 text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors"
            >
              Tư Vấn Ngay <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/15">
            <div>
              <div className="text-2xl font-bold text-[#36D1FF]">20+</div>
              <div className="text-[11px] text-white/50 uppercase tracking-wide">Năm kinh nghiệm</div>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <div className="text-2xl font-bold text-[#36D1FF]">3,000+</div>
              <div className="text-[11px] text-white/50 uppercase tracking-wide">Khách hàng</div>
            </div>
            <div className="w-px h-10 bg-white/15" />
            <div>
              <div className="text-2xl font-bold text-[#36D1FF]">ISO 9001</div>
              <div className="text-[11px] text-white/50 uppercase tracking-wide">Chứng nhận</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
