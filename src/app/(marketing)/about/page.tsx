import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle2,
  Target,
  Heart,
  Phone,
  FileText,
  Droplets,
  Shield,
  Users,
  Wrench,
  Building2,
  Lightbulb,
  Sparkles,
  HandHeart,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Giới thiệu — APLUS Technologies | Chuyên gia lọc nước hàng đầu Việt Nam",
  description:
    "APLUS Technologies — Hơn 20 năm kinh nghiệm cung cấp giải pháp lọc nước chuyên biệt cho gia đình và doanh nghiệp. Chứng nhận NSF, WQA, ISO 9001.",
  openGraph: {
    title: "Giới thiệu — APLUS Technologies",
    description:
      "Chuyên gia nước sạch — An tâm sống khỏe. Nhà phát triển giải pháp lọc nước hàng đầu Việt Nam.",
  },
}

/* ── JSON-LD structured data ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "APLUS Technologies",
  alternateName: "Lọc Nước Phước Sang",
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/images/logo/logo-horizontal.png`,
  description: SITE_CONFIG.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Quy Nhơn",
    addressRegion: "Bình Định",
    addressCountry: "VN",
  },
  telephone: SITE_CONFIG.phone,
  email: SITE_CONFIG.email,
  foundingDate: "2005",
  numberOfEmployees: { "@type": "QuantitativeValue", minValue: 50 },
  areaServed: "VN",
  knowsAbout: [
    "Water filtration",
    "RO water purifier",
    "Water treatment systems",
    "Industrial water filtration",
  ],
}

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative bg-gradient-to-br from-[#102590] via-[#0a1a6e] to-[#020035] text-white py-20 lg:py-28 overflow-hidden">
        {/* Decorative water circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#36D1FF]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#006EF5]/10 rounded-full blur-3xl" />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#36D1FF]">
              <span className="h-px w-8 bg-[#36D1FF]" />
              Về chúng tôi
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Chuyên gia nước sạch
              <br />
              <span className="text-[#36D1FF]">An tâm sống khỏe</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
              Hơn 20 năm kinh nghiệm phát triển giải pháp lọc nước chuyên biệt cho gia dụng
              và thương mại. APLUS Technologies là đối tác tin cậy của hàng ngàn gia đình
              và doanh nghiệp trên toàn quốc.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/survey"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#36D1FF] text-[#102590] px-8 text-sm font-bold uppercase hover:bg-white transition-colors"
              >
                Khảo sát miễn phí
              </Link>
              <a
                href="/APLUS_COMPANY_PROFILE_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white/30 text-white px-6 text-sm font-bold uppercase hover:bg-white/10 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Tải hồ sơ năng lực
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ THƯ NGỎ ═══════════════ */}
      <section className="bg-white py-16 lg:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] bg-[#B5DBFF]/30 rounded-xl overflow-hidden">
                <Image
                  src="/images/about/lap-dat-bep.jpg"
                  alt="Kỹ thuật viên APLUS lắp đặt máy lọc nước tại gia đình"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] bg-[#B5DBFF]/30 rounded-xl overflow-hidden mt-8">
                <Image
                  src="/images/about/showroom-tram-nuoc.jpg"
                  alt="Trạm nước uống tinh khiết APLUS tại showroom"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#006EF5]">
                Câu chuyện của chúng tôi
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
                Sự khác biệt của APLUS nằm ở triết lý
                &ldquo;Khách&nbsp;hàng&nbsp;làm&nbsp;trọng&nbsp;tâm&rdquo;
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                APLUS Technologies tự hào là nhà cung cấp giải pháp lọc nước chuyên biệt cho
                gia đình và doanh nghiệp, đem lại nguồn nước sạch và an toàn cho mọi khách
                hàng. Chúng tôi hiểu rằng nước sạch là yếu tố nền tảng cho một cuộc sống
                khỏe mạnh.
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Với các hệ thống lọc nước tối ưu, chúng tôi sẵn sàng giải quyết các vấn đề
                như nhiễm mặn, nhiễm kim loại nặng, vi khuẩn, và hợp chất hữu cơ có hại
                thường tồn tại trong nguồn nước sinh hoạt.
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Đội ngũ kỹ thuật viên được đào tạo chuyên sâu, sẵn sàng hỗ trợ tư vấn, lắp đặt
                và bảo trì tại nhà — giúp khách hàng yên tâm sử dụng nguồn nước an toàn mỗi ngày.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ SỨ MỆNH & TẦM NHÌN ═══════════════ */}
      <section className="bg-[#F2F3F4] py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              <span className="h-px w-8 bg-[#006EF5]" />
              Định hướng phát triển
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
              Sứ mệnh & Tầm nhìn
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sứ mệnh */}
            <div className="bg-white rounded-xl p-8 lg:p-10 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#B5DBFF] flex items-center justify-center mb-5">
                <Target className="h-7 w-7 text-[#006EF5]" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-[#102590] mb-3">Sứ mệnh</h3>
              <p className="text-gray-700 leading-relaxed">
                Mang đến nguồn nước sạch, an toàn cho mọi gia đình và doanh nghiệp Việt Nam
                thông qua các giải pháp lọc nước tiên tiến, được chứng nhận quốc tế. Chúng
                tôi cam kết nâng cao chất lượng cuộc sống bằng công nghệ lọc nước tốt nhất.
              </p>
            </div>

            {/* Tầm nhìn */}
            <div className="bg-white rounded-xl p-8 lg:p-10 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[#B5DBFF] flex items-center justify-center mb-5">
                <Lightbulb className="h-7 w-7 text-[#006EF5]" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-[#102590] mb-3">Tầm nhìn</h3>
              <p className="text-gray-700 leading-relaxed">
                Trở thành thương hiệu lọc nước hàng đầu Việt Nam, được khách hàng tin tưởng
                lựa chọn nhờ chất lượng sản phẩm vượt trội, dịch vụ tận tâm và cam kết
                đồng hành bền vững cùng cộng đồng.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ GIÁ TRỊ CỐT LÕI — TECH ═══════════════ */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              <span className="h-px w-8 bg-[#006EF5]" />
              Giá trị cốt lõi
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
              Triết lý T.E.C.H
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Bốn giá trị cốt lõi định hình mọi hoạt động của APLUS Technologies
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              {
                letter: "T",
                title: "Trust — Tin cậy",
                desc: "Xây dựng lòng tin qua chất lượng sản phẩm đạt chuẩn quốc tế và dịch vụ minh bạch.",
                icon: Shield,
              },
              {
                letter: "E",
                title: "Excellence — Xuất sắc",
                desc: "Không ngừng cải tiến, áp dụng công nghệ lọc nước tiên tiến nhất từ Mỹ, Hàn Quốc, Nhật Bản.",
                icon: Sparkles,
              },
              {
                letter: "C",
                title: "Care — Tận tâm",
                desc: "Lắng nghe, thấu hiểu nhu cầu khách hàng. Đội ngũ hỗ trợ kỹ thuật 7 ngày/tuần.",
                icon: Heart,
              },
              {
                letter: "H",
                title: "Health — Sức khỏe",
                desc: "Đặt sức khỏe cộng đồng làm ưu tiên hàng đầu trong mọi giải pháp lọc nước.",
                icon: HandHeart,
              },
            ].map((v) => (
              <div
                key={v.letter}
                className="group bg-[#F2F3F4] rounded-xl p-6 lg:p-8 hover:bg-[#102590] hover:text-white transition-colors duration-300"
              >
                <span className="text-4xl lg:text-5xl font-black text-[#006EF5] group-hover:text-[#36D1FF] transition-colors">
                  {v.letter}
                </span>
                <div className="mt-3 mb-2">
                  <v.icon className="h-5 w-5 text-[#006EF5] group-hover:text-[#36D1FF] transition-colors" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-[#102590] group-hover:text-white transition-colors mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-gray-600 group-hover:text-white/70 transition-colors leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ GIẢI PHÁP CHO MỌI PHÂN KHÚC ═══════════════ */}
      <section className="bg-[#F2F3F4] py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              <span className="h-px w-8 bg-[#006EF5]" />
              Giải pháp APLUS
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
              Đa dạng giải pháp cho mọi nhu cầu
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Users,
                title: "Hộ gia đình",
                desc: "Máy lọc nước RO, UF, Nano phù hợp mọi nguồn nước sinh hoạt. Bảo hành lên đến 5 năm.",
              },
              {
                icon: Building2,
                title: "Doanh nghiệp",
                desc: "Hệ thống lọc công suất lớn cho nhà máy, văn phòng, trường học, bệnh viện.",
              },
              {
                icon: Droplets,
                title: "Trạm nước công cộng",
                desc: "Trạm nước uống tinh khiết phục vụ cộng đồng với công nghệ RO hiện đại.",
              },
              {
                icon: Wrench,
                title: "Bảo trì & Sửa chữa",
                desc: "Dịch vụ thay lõi, vệ sinh định kỳ, sửa chữa tận nơi. Linh kiện chính hãng.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-[#006EF5] hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#B5DBFF] flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-[#006EF5]" strokeWidth={1.75} />
                </div>
                <h3 className="text-base font-bold text-[#102590] mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ QUY TRÌNH DỊCH VỤ ═══════════════ */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#006EF5] mb-3.5">
              <span className="h-px w-8 bg-[#006EF5]" />
              Quy trình
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#102590] tracking-tight">
              Quy trình dịch vụ 4 bước
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Từ khảo sát đến bảo trì — chúng tôi đồng hành cùng bạn ở mọi bước
            </p>
          </div>

          {/* Desktop: flex row with arrows · Mobile: 2-col grid */}
          <div className="hidden lg:flex items-start">
            {[
              {
                step: "01",
                title: "Khảo sát nguồn nước",
                desc: "Kiểm tra nguồn nước tại chỗ, phân tích TDS, pH và tạp chất để xác định nhu cầu thực tế.",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="M8 10Q9.5 8.5 11 10Q12.5 8.5 14 10" strokeWidth={1.4} />
                    <path d="M8 12.5Q9.5 11 11 12.5Q12.5 11 14 12.5" strokeWidth={1.4} />
                    <line x1="15.5" y1="15.5" x2="21" y2="21" strokeWidth={2.5} />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Tư vấn giải pháp",
                desc: "Đề xuất hệ thống lọc phù hợp với nguồn nước và nhu cầu thực tế của từng gia đình.",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <circle cx="12" cy="14" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Lắp đặt chuyên nghiệp",
                desc: "Kỹ thuật viên có chứng chỉ trực tiếp lắp đặt, kiểm tra và bàn giao hệ thống tại nhà.",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                ),
              },
              {
                step: "04",
                title: "Bảo trì định kỳ",
                desc: "Nhắc lịch thay lõi lọc, kiểm tra định kỳ, đảm bảo hệ thống vận hành hiệu quả liên tục.",
                icon: (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <polyline points="9,16 11.5,18.5 16,13" />
                  </svg>
                ),
              },
            ].map((p, i) => (
              <div key={p.step} className="contents">
                {/* Step card */}
                <div className="flex-1 flex flex-col items-center text-center px-5">
                  <div className="relative mb-5">
                    <div className="w-[88px] h-[88px] rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-[#006EF5] hover:border-[#006EF5] hover:bg-[#006EF5]/[0.04] transition-colors">
                      {p.icon}
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#102590] text-white text-[9px] font-bold flex items-center justify-center">
                      {p.step}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#102590] mb-2.5">{p.title}</h3>
                  <p className="text-[13.5px] leading-relaxed text-gray-500 max-w-[185px]">{p.desc}</p>
                </div>
                {/* Arrow connector (not after last) */}
                {i < 3 && (
                  <div className="flex-none flex items-center mt-11">
                    <svg width="48" height="14" viewBox="0 0 48 14" fill="none">
                      <line x1="0" y1="7" x2="36" y2="7" stroke="#e5e7eb" strokeWidth={1.5} strokeDasharray="4 3" />
                      <polyline points="35,3 43,7 35,11" fill="none" stroke="#36D1FF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile: 2-col grid fallback */}
          <div className="grid grid-cols-2 gap-6 lg:hidden">
            {[
              {
                step: "01",
                title: "Khảo sát nguồn nước",
                desc: "Kiểm tra nguồn nước tại chỗ, phân tích TDS, pH và tạp chất.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="M8 10Q9.5 8.5 11 10Q12.5 8.5 14 10" strokeWidth={1.4} />
                    <path d="M8 12.5Q9.5 11 11 12.5Q12.5 11 14 12.5" strokeWidth={1.4} />
                    <line x1="15.5" y1="15.5" x2="21" y2="21" strokeWidth={2.5} />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Tư vấn giải pháp",
                desc: "Đề xuất hệ thống lọc phù hợp với nguồn nước và nhu cầu.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <circle cx="12" cy="14" r="0.8" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Lắp đặt chuyên nghiệp",
                desc: "Kỹ thuật viên lắp đặt, kiểm tra và bàn giao tại nhà.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                ),
              },
              {
                step: "04",
                title: "Bảo trì định kỳ",
                desc: "Nhắc lịch thay lõi, kiểm tra định kỳ, đảm bảo hiệu suất.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <polyline points="9,16 11.5,18.5 16,13" />
                  </svg>
                ),
              },
            ].map((p) => (
              <div key={p.step} className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center text-[#006EF5]">
                    {p.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#102590] text-white text-[8px] font-bold flex items-center justify-center">
                    {p.step}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#102590] mb-1.5">{p.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ VÌ SAO CHỌN APLUS ═══════════════ */}
      <section className="bg-[#F2F3F4] py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#006EF5] mb-3.5">
              <span className="h-px w-8 bg-[#006EF5]" />
              Cam kết
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#102590] tracking-tight">
              3 lý do khách hàng tin tưởng APLUS
            </h2>
            <p className="mt-4 text-gray-500 leading-relaxed">
              Chất lượng quốc tế, giải pháp riêng biệt và dịch vụ tận tâm — cam kết với mỗi gia đình
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Chất lượng đạt chuẩn */}
            <div className="group bg-white rounded-lg border border-gray-200 border-t-4 border-t-[#006EF5] p-7 md:p-8 hover:border-[#006EF5] hover:border-t-[#36D1FF] transition-colors">
              <div className="w-[60px] h-[60px] rounded-full bg-[#B5DBFF]/35 flex items-center justify-center mb-6 group-hover:bg-[#36D1FF]/[0.18] transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="stroke-[#006EF5] group-hover:stroke-[#36D1FF] transition-colors" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" strokeWidth={2.2} />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#102590] mb-3">Chất lượng đạt chuẩn</h3>
              <p className="text-sm leading-relaxed text-gray-600 mb-5">
                Sản phẩm đạt chứng nhận quốc tế, tuân thủ tiêu chuẩn WHO về nước uống an toàn cho sức khỏe.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["NSF", "WQA", "WHO"].map((badge) => (
                  <span key={badge} className="text-[11px] font-bold text-[#006EF5] bg-[#B5DBFF]/50 px-2.5 py-1 rounded tracking-wider">
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: Giải pháp cá nhân hóa */}
            <div className="group bg-white rounded-lg border border-gray-200 border-t-4 border-t-[#006EF5] p-7 md:p-8 hover:border-[#006EF5] hover:border-t-[#36D1FF] transition-colors">
              <div className="w-[60px] h-[60px] rounded-full bg-[#B5DBFF]/35 flex items-center justify-center mb-6 group-hover:bg-[#36D1FF]/[0.18] transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="stroke-[#006EF5] group-hover:stroke-[#36D1FF] transition-colors" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="4" x2="14" y2="4" />
                  <line x1="10" y1="4" x2="3" y2="4" />
                  <line x1="21" y1="12" x2="12" y2="12" />
                  <line x1="8" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="20" x2="16" y2="20" />
                  <line x1="12" y1="20" x2="3" y2="20" />
                  <line x1="14" y1="2" x2="14" y2="6" />
                  <line x1="8" y1="10" x2="8" y2="14" />
                  <line x1="16" y1="18" x2="16" y2="22" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#102590] mb-3">Giải pháp cá nhân hóa</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Từ phân tích nguồn nước đến thiết kế hệ thống — mỗi giải pháp được tùy chỉnh riêng cho nhu cầu của từng hộ gia đình.
              </p>
            </div>

            {/* Card 3: Dịch vụ tận tâm */}
            <div className="group bg-white rounded-lg border border-gray-200 border-t-4 border-t-[#006EF5] p-7 md:p-8 hover:border-[#006EF5] hover:border-t-[#36D1FF] transition-colors">
              <div className="w-[60px] h-[60px] rounded-full bg-[#B5DBFF]/35 flex items-center justify-center mb-6 group-hover:bg-[#36D1FF]/[0.18] transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="stroke-[#006EF5] group-hover:stroke-[#36D1FF] transition-colors" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 18v-6a9 9 0 0118 0v6" />
                  <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#102590] mb-3">Dịch vụ tận tâm</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                Bảo hành chính hãng, bảo trì định kỳ và hỗ trợ kỹ thuật 7 ngày/tuần — chúng tôi đồng hành lâu dài cùng bạn.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CHỨNG NHẬN & TIÊU CHUẨN ═══════════════ */}
      <section className="bg-[#102590] text-white py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#36D1FF]">
              <span className="h-px w-8 bg-[#36D1FF]" />
              Chứng nhận chất lượng
              <span className="h-px w-8 bg-[#36D1FF]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold">
              Đạt chuẩn quốc tế & quốc gia
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "NSF International",
                desc: "Chứng nhận an toàn vệ sinh nước uống theo tiêu chuẩn Mỹ",
              },
              {
                name: "WQA",
                desc: "Hiệp hội Chất lượng Nước — Gold Seal chứng nhận thiết bị lọc",
              },
              {
                name: "ISO 9001:2015",
                desc: "Hệ thống quản lý chất lượng đạt chuẩn quốc tế",
              },
              {
                name: "QCVN 6-1:2010",
                desc: "Quy chuẩn kỹ thuật quốc gia về nước uống đóng chai — Bộ Y tế",
              },
            ].map((cert) => (
              <div
                key={cert.name}
                className="bg-white/10 backdrop-blur rounded-xl p-6 text-center hover:bg-white/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#36D1FF]/20 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-[#36D1FF]" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{cert.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ ĐỐI TÁC THƯƠNG HIỆU ═══════════════ */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              <span className="h-px w-8 bg-[#006EF5]" />
              Đối tác thương hiệu
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
              Hợp tác cùng những thương hiệu uy tín
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              APLUS phân phối chính hãng sản phẩm từ hơn 20 thương hiệu lọc nước hàng đầu thế giới
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Geyser", src: "/images/brands/geyser.png" },
              { name: "A.O.Smith", src: "/images/brands/aosmith.png" },
              { name: "Karofi", src: "/images/brands/karofi.png" },
              { name: "Kangaroo", src: "/images/brands/kangaroo.jpg" },
              { name: "Mutosi", src: "/images/brands/mutosi.png" },
              { name: "Coway", src: "/images/brands/coway.png" },
              { name: "ChungHo", src: "/images/brands/chungho.png" },
              { name: "Daikiosan", src: "/images/brands/daikiosan.png" },
              { name: "Panasonic", src: "/images/brands/panasonic.jpg" },
              { name: "Philips", src: "/images/brands/philips.png" },
              { name: "DuPont", src: "/images/brands/dupont.png" },
              { name: "Toray", src: "/images/brands/toray.png" },
              { name: "Doulton", src: "/images/brands/doulton.png" },
              { name: "Easywell", src: "/images/brands/easywell.jpg" },
              { name: "Atlas Filtri", src: "/images/brands/atlasfiltri.png" },
              { name: "Ecosoft", src: "/images/brands/pecosoft.png" },
              { name: "Purolite", src: "/images/brands/purolite.jpg" },
              { name: "Jacobi", src: "/images/brands/jacobi.jpg" },
              { name: "Kangen", src: "/images/brands/kangen.png" },
              { name: "Cleansui", src: "/images/brands/cleansui.png" },
            ].map((b) => (
              <div
                key={b.name}
                className="flex items-center justify-center h-16 rounded-lg bg-[#F2F3F4]/60 hover:shadow-md hover:scale-105 transition-all duration-200 p-3"
              >
                <Image
                  src={b.src}
                  alt={`Logo thương hiệu ${b.name} — đối tác APLUS Technologies`}
                  width={120}
                  height={48}
                  className="object-contain max-h-10"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ DẤU ẤN CÔNG TRÌNH ═══════════════ */}
      <section className="bg-[#F2F3F4] py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              <span className="h-px w-8 bg-[#006EF5]" />
              Dấu ấn công trình
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
              Một số dự án tiêu biểu
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                src: "/images/projects/duan-tram-nuoc-congcong.jpg",
                alt: "Trạm nước uống công cộng APLUS",
                label: "Trạm nước công cộng",
              },
              {
                src: "/images/projects/duan-loc-tong-2cot.jpg",
                alt: "Hệ thống lọc tổng 2 cột",
                label: "Lọc tổng 2 cột",
              },
              {
                src: "/images/projects/duan-loc-tong-3cot.jpg",
                alt: "Hệ thống lọc tổng 3 cột công suất lớn",
                label: "Lọc tổng 3 cột",
              },
              {
                src: "/images/projects/duan-ro-500l.jpg",
                alt: "Hệ thống RO công suất 500L/h",
                label: "RO 500L/h",
              },
              {
                src: "/images/projects/duan-tram-ro-3voi.jpg",
                alt: "Trạm nước RO 3 vòi",
                label: "Trạm RO 3 vòi",
              },
              {
                src: "/images/projects/duan-ro-aosmith-bep.jpg",
                alt: "Máy lọc nước A.O. Smith lắp đặt tại bếp",
                label: "A.O. Smith tại bếp",
              },
            ].map((project) => (
              <div
                key={project.src}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden"
              >
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-3 left-3 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/projects"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#006EF5] text-white px-6 text-sm font-bold uppercase hover:bg-[#102590] transition-colors"
            >
              Xem tất cả dự án
            </Link>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CAM KẾT CỘNG ĐỒNG ═══════════════ */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/about/cong-dong-nuoc-sach.jpg"
                alt="Trạm nước sạch APLUS phục vụ cộng đồng"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#006EF5]">
                Cam kết với cộng đồng
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
                APLUS là đối tác đồng hành cùng cộng đồng
              </h2>
              <div className="mt-6 space-y-3">
                {[
                  "Cung cấp các trạm nước sạch miễn phí cho khu dân cư",
                  "Chương trình tái sử dụng thiết bị cũ, giảm rác thải",
                  "Chiến dịch 'Thay cũ đổi mới' bảo vệ môi trường",
                  "Tư vấn miễn phí về chất lượng nước cho cộng đồng",
                  "Hướng đến một tương lai xanh hơn cho Việt Nam",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[#006EF5] mt-0.5 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════ CTA CUỐI TRANG ═══════════════ */}
      <section className="bg-gradient-to-r from-[#102590] to-[#006EF5] text-white py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">
              Bạn cần tư vấn giải pháp lọc nước?
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Liên hệ ngay để được đội ngũ chuyên gia APLUS hỗ trợ miễn phí — khảo sát tận
              nơi, tư vấn giải pháp phù hợp nhất với nhu cầu của bạn.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white text-[#102590] px-8 text-sm font-bold uppercase hover:bg-[#36D1FF] transition-colors"
              >
                Liên hệ tư vấn
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-white/40 text-white px-6 text-sm font-bold uppercase hover:bg-white/10 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
