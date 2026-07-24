import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"

function WaterDropIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Outer glow ring */}
      <circle cx="250" cy="250" r="220" stroke="url(#ringGrad)" strokeWidth="1" opacity="0.3" />
      <circle cx="250" cy="250" r="190" stroke="url(#ringGrad)" strokeWidth="0.5" opacity="0.2" />

      {/* Main water drop */}
      <defs>
        <linearGradient id="dropGrad" x1="250" y1="80" x2="250" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#36D1FF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#006EF5" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#102590" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#36D1FF" />
          <stop offset="100%" stopColor="#006EF5" />
        </linearGradient>
        <radialGradient id="shine" cx="0.35" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="20" floodColor="#36D1FF" floodOpacity="0.3" />
        </filter>
        <clipPath id="dropClip">
          <path d="M250 90 C250 90 160 220 160 300 C160 355 200 400 250 400 C300 400 340 355 340 300 C340 220 250 90 250 90Z" />
        </clipPath>
      </defs>

      {/* Drop shape with shadow */}
      <g filter="url(#dropShadow)">
        <path
          d="M250 90 C250 90 160 220 160 300 C160 355 200 400 250 400 C300 400 340 355 340 300 C340 220 250 90 250 90Z"
          fill="url(#dropGrad)"
        />
      </g>

      {/* Inner highlight / shine */}
      <path
        d="M250 90 C250 90 160 220 160 300 C160 355 200 400 250 400 C300 400 340 355 340 300 C340 220 250 90 250 90Z"
        fill="url(#shine)"
      />

      {/* Reflection lines inside drop */}
      <g clipPath="url(#dropClip)" opacity="0.15">
        <path d="M180 280 Q220 260 280 290" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M190 310 Q230 290 300 320" stroke="white" strokeWidth="1" fill="none" />
        <path d="M200 340 Q240 320 290 345" stroke="white" strokeWidth="0.8" fill="none" />
      </g>

      {/* Small floating bubbles */}
      <circle cx="200" cy="330" r="6" fill="white" opacity="0.2" />
      <circle cx="280" cy="310" r="4" fill="white" opacity="0.15" />
      <circle cx="230" cy="360" r="3" fill="white" opacity="0.1" />
      <circle cx="270" cy="350" r="5" fill="white" opacity="0.12" />

      {/* Top highlight spot */}
      <ellipse cx="225" cy="220" rx="18" ry="30" fill="white" opacity="0.15" transform="rotate(-20 225 220)" />

      {/* Orbiting particles */}
      <circle cx="380" cy="180" r="3" fill="#36D1FF" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="20s" repeatCount="indefinite" />
      </circle>
      <circle cx="120" cy="320" r="2" fill="#36D1FF" opacity="0.4">
        <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="-360 250 250" dur="25s" repeatCount="indefinite" />
      </circle>
      <circle cx="350" cy="380" r="2.5" fill="#006EF5" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="30s" repeatCount="indefinite" />
      </circle>

      {/* Decorative dots around */}
      <circle cx="400" cy="130" r="2" fill="#36D1FF" opacity="0.3" />
      <circle cx="100" cy="200" r="1.5" fill="#36D1FF" opacity="0.25" />
      <circle cx="420" cy="350" r="1.5" fill="#006EF5" opacity="0.3" />
      <circle cx="80" cy="380" r="2" fill="#006EF5" opacity="0.2" />
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative bg-[#102590] text-white overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Decorative wave lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
        fill="none"
      >
        <path d="M0 350 Q 360 300 720 350 T 1440 350" stroke="#36D1FF" strokeWidth="2" fill="none" />
        <path d="M0 400 Q 360 350 720 400 T 1440 400" stroke="#36D1FF" strokeWidth="1.5" fill="none" />
        <path d="M0 450 Q 360 400 720 450 T 1440 450" stroke="#36D1FF" strokeWidth="1" fill="none" />
        <path d="M0 500 Q 360 450 720 500 T 1440 500" stroke="#36D1FF" strokeWidth="0.7" fill="none" />
      </svg>

      {/* Gradient overlays */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#006EF5]/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a1a60] to-transparent" />

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
            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-[#36D1FF]">20+</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wide">Năm kinh nghiệm</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-[#36D1FF]">3,000+</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wide">Khách hàng</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-[#36D1FF]">ISO 9001</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wide">Chứng nhận</div>
              </div>
            </div>
          </div>

          {/* Right visual — SVG water drop illustration */}
          <div className="hidden lg:flex relative items-center justify-center">
            <div className="w-full max-w-[420px] ml-auto">
              <WaterDropIllustration />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
