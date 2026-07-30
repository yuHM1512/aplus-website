import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle2,
  Target,
  Heart,
  Award,
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
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              <span className="h-px w-8 bg-[#006EF5]" />
              Đối tác trọn gói
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
              Quy trình dịch vụ 4 bước
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Khảo sát nguồn nước",
                desc: "Kỹ thuật viên đến tận nơi kiểm tra chất lượng nước, xác định vấn đề cần xử lý.",
              },
              {
                step: "02",
                title: "Tư vấn giải pháp",
                desc: "Đề xuất hệ thống lọc phù hợp nhất với nguồn nước, nhu cầu sử dụng và ngân sách.",
              },
              {
                step: "03",
                title: "Lắp đặt chuyên nghiệp",
                desc: "Đội ngũ kỹ thuật lắp đặt tận nơi, hướng dẫn sử dụng chi tiết, nghiệm thu cẩn thận.",
              },
              {
                step: "04",
                title: "Bảo trì định kỳ",
                desc: "Theo dõi, nhắc lịch thay lõi, vệ sinh hệ thống định kỳ để đảm bảo hiệu suất.",
              },
            ].map((p) => (
              <div key={p.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#102590] text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">{p.step}</span>
                </div>
                <h3 className="text-base font-bold text-[#102590] mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ VÌ SAO CHỌN APLUS ═══════════════ */}
      <section className="bg-[#F2F3F4] py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              <span className="h-px w-8 bg-[#006EF5]" />
              Vì sao chọn chúng tôi
              <span className="h-px w-8 bg-[#006EF5]" />
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
              3 lý do khách hàng tin tưởng APLUS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: "Chất lượng đạt chuẩn",
                desc: "Sản phẩm chứng nhận bởi Bộ Y tế Việt Nam, WQA, WHO — cam kết loại bỏ tạp chất và mang đến nguồn nước an toàn.",
              },
              {
                icon: Target,
                title: "Giải pháp cá nhân hóa",
                desc: "Cung cấp đa dạng hệ thống lọc, từ đầu nguồn đến điểm sử dụng, đáp ứng chính xác yêu cầu từng khách hàng.",
              },
              {
                icon: Heart,
                title: "Dịch vụ tận tâm",
                desc: "Đội ngũ chuyên gia sẵn sàng tư vấn và hỗ trợ kỹ thuật. Bảo hành, bảo trì định kỳ đầy đủ.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-[#B5DBFF] flex items-center justify-center mb-5">
                  <c.icon className="h-6 w-6 text-[#006EF5]" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-[#102590] mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
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
            {/* Mỗi logo được style riêng để gần giống nhận diện thương hiệu */}
            {[
              { name: "GEYSER",       color: "#1a5276", weight: "font-bold",     size: "text-sm",  tracking: "tracking-widest" },
              { name: "A.O.Smith",    color: "#003da5", weight: "font-extrabold", size: "text-base", tracking: "" },
              { name: "KAROFI",       color: "#0099dd", weight: "font-extrabold", size: "text-lg",  tracking: "tracking-wider" },
              { name: "Kangaroo",     color: "#00a651", weight: "font-bold",     size: "text-base", tracking: "" },
              { name: "MUTOSI",       color: "#1a237e", weight: "font-black",    size: "text-base", tracking: "tracking-[0.3em]" },
              { name: "coway",        color: "#0072bc", weight: "font-bold",     size: "text-lg",  tracking: "tracking-wide", lower: true },
              { name: "CHUNGHO",      color: "#0054a6", weight: "font-extrabold", size: "text-sm",  tracking: "tracking-wider", bg: "bg-blue-50" },
              { name: "DAIKIOSAN",    color: "#0066cc", weight: "font-bold",     size: "text-xs",  tracking: "tracking-widest" },
              { name: "Panasonic",    color: "#000000", weight: "font-bold",     size: "text-base", tracking: "" },
              { name: "PHILIPS",      color: "#0b5ed7", weight: "font-bold",     size: "text-lg",  tracking: "tracking-wider" },
              { name: "DuPont",       color: "#cc0000", weight: "font-extrabold", size: "text-base", tracking: "", border: "border-2 border-red-600 rounded-full" },
              { name: "'TORAY'",      color: "#003399", weight: "font-extrabold", size: "text-base", tracking: "" },
              { name: "Doulton",      color: "#1a3c6e", weight: "font-medium",   size: "text-lg",  tracking: "", italic: true },
              { name: "easywell",     color: "#4caf50", weight: "font-bold",     size: "text-sm",  tracking: "tracking-wide", lower: true },
              { name: "ATLAS FILTRI", color: "#003399", weight: "font-bold",     size: "text-[10px]", tracking: "tracking-wider" },
              { name: "ecosoft",      color: "#0072bc", weight: "font-bold",     size: "text-base", tracking: "", lower: true },
              { name: "Purolite",     color: "#003399", weight: "font-bold",     size: "text-base", tracking: "" },
              { name: "Jacobi",       color: "#8b4513", weight: "font-extrabold", size: "text-base", tracking: "" },
              { name: "KANGEN",       color: "#003399", weight: "font-bold",     size: "text-sm",  tracking: "tracking-widest" },
              { name: "Cleansui",     color: "#ffffff", weight: "font-bold",     size: "text-sm",  tracking: "", redPill: true },
            ].map((b) => (
              <div
                key={b.name}
                className={[
                  "flex items-center justify-center h-16 rounded-lg transition-all duration-200",
                  "hover:shadow-md hover:scale-105",
                  b.bg || "bg-[#F2F3F4]/60",
                  b.border || "",
                  b.redPill ? "!bg-[#cc0000] rounded-full" : "",
                ].filter(Boolean).join(" ")}
              >
                <span
                  className={[
                    b.weight, b.size, b.tracking || "",
                    b.italic ? "italic" : "",
                    "select-none whitespace-nowrap leading-none",
                  ].filter(Boolean).join(" ")}
                  style={{ color: b.color }}
                >
                  {b.name}
                </span>
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
