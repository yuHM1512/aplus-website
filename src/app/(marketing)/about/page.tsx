import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2, Target, Heart, Award } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Stats } from "@/components/sections/stats"

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "APLUS Technologies — Nhà phát triển giải pháp lọc nước hàng đầu Việt Nam",
}

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#102590] text-white py-16 lg:py-20">
        <Container>
          <div className="max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-widest text-[#36D1FF]">
              Về chúng tôi
            </span>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold leading-tight">
              APLUS Technologies — Chuyên gia lọc nước hàng đầu Việt Nam
            </h1>
            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              Chuyên gia nước sạch - An tâm sống khỏe. Nhà phát triển giải pháp lọc nước
              chuyên biệt cho gia dụng và thương mại với hơn 20 năm kinh nghiệm.
            </p>
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] bg-[#B5DBFF]/40 rounded-xl overflow-hidden">
              <Image
                src="/images/about/lap-dat-bep.jpg"
                alt="Kỹ thuật viên APLUS lắp đặt máy lọc nước tại gia đình"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#006EF5]">
                Câu chuyện của chúng tôi
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
                Sự khác biệt của APLUS nằm ở triết lý &ldquo;Khách hàng làm trọng tâm&rdquo;
              </h2>
              <p className="mt-6 text-gray-700 leading-relaxed">
                APLUS Technologies tự hào là nhà cung cấp giải pháp lọc nước chuyên biệt cho gia đình
                và doanh nghiệp, đem lại nguồn nước sạch và an toàn cho mọi khách hàng. Chúng tôi hiểu
                rằng nước sạch là yếu tố nền tảng cho một cuộc sống khỏe mạnh.
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed">
                Với các hệ thống lọc nước tối ưu, chúng tôi sẵn sàng giải quyết các vấn đề như nhiễm
                mặn, nhiễm kim loại nặng, vi khuẩn, và hợp chất hữu cơ có hại thường tồn tại trong
                nguồn nước.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Why choose */}
      <section className="bg-[#F2F3F4] py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-[#006EF5]">
              Vì sao chọn chúng tôi
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
              <div key={c.title} className="bg-white rounded-lg p-8">
                <div className="w-14 h-14 rounded-md bg-[#B5DBFF] flex items-center justify-center mb-5">
                  <c.icon className="h-6 w-6 text-[#006EF5]" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-[#102590] mb-2">{c.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Stats />

      {/* Commitment */}
      <section className="bg-white py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                <Image
                  src="/images/about/cong-dong-nuoc-sach.jpg"
                  alt="Trạm nước sạch APLUS phục vụ cộng đồng"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mt-8">
                <Image
                  src="/images/about/showroom-tram-nuoc.jpg"
                  alt="Trạm nước uống tinh khiết APLUS"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
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
                  "Cung cấp các trạm nước sạch miễn phí",
                  "Chương trình tái sử dụng thiết bị cũ",
                  "Chiến dịch 'Thay cũ đổi mới' bảo vệ môi trường",
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
    </>
  )
}
