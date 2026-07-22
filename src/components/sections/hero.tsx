import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"

export function Hero() {
  return (
    <section className="relative bg-[#102590] text-white overflow-hidden">
      {/* Decorative wave lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
        fill="none"
      >
        <path d="M0 400 Q 360 350 720 400 T 1440 400" stroke="#36D1FF" strokeWidth="2" fill="none" />
        <path d="M0 450 Q 360 400 720 450 T 1440 450" stroke="#36D1FF" strokeWidth="1.5" fill="none" />
        <path d="M0 500 Q 360 450 720 500 T 1440 500" stroke="#36D1FF" strokeWidth="1" fill="none" />
      </svg>

      <Container className="relative py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-semibold uppercase tracking-widest text-[#36D1FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#36D1FF]" />
              Water Purification Technology
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Giải Pháp Lọc Nước<br />
              <span className="text-[#36D1FF]">Toàn Diện</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-lg">
              Ứng dụng công nghệ lọc nước tiên tiến nhất từ Châu Âu,
              APLUS Technologies mang đến nguồn nước tinh khiết và an toàn
              tuyệt đối cho gia đình và doanh nghiệp của bạn.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex h-14 items-center justify-center rounded-md bg-white text-[#102590] px-8 text-sm font-bold uppercase tracking-wide hover:bg-[#36D1FF] transition-colors"
              >
                Xem Sản Phẩm
              </Link>
              <Link
                href="/survey"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md border border-white/40 text-white px-8 text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors"
              >
                Tư Vấn Ngay <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right visual placeholder */}
          <div className="hidden lg:block relative">
            <div className="aspect-square max-w-md ml-auto rounded-xl bg-gradient-to-br from-[#36D1FF]/20 to-[#006EF5]/10 border border-white/10 backdrop-blur flex items-center justify-center">
              <div className="text-9xl">💧</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
