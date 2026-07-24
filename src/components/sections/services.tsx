import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import {
  Search,
  Wrench,
  Shield,
  CreditCard,
  Package,
  Home,
  ArrowRight,
} from "lucide-react"

const iconMap = { Search, Wrench, Shield, CreditCard, Package, Home }

const SERVICES_DATA = [
  {
    icon: "Search" as const,
    name: "Khảo sát nguồn nước tận nơi",
    excerpt:
      "Phân tích chất lượng nước đầu vào và tư vấn giải pháp lọc phù hợp cho từng nguồn nước.",
    image:
      "https://images.unsplash.com/photo-1593410007149-d56f28d22493?auto=format&fit=crop&w=800&q=80",
    stat: "Miễn phí",
    statLabel: "khảo sát",
  },
  {
    icon: "Wrench" as const,
    name: "Lắp đặt nhanh chóng",
    excerpt:
      "Đội ngũ kỹ thuật viên tay nghề cao, đảm bảo lắp đặt đúng chuẩn kỹ thuật và thẩm mỹ cao.",
    image:
      "https://images.unsplash.com/photo-1676210133055-eab6ef033ce3?auto=format&fit=crop&w=800&q=80",
    stat: "24h",
    statLabel: "hoàn thành",
  },
  {
    icon: "Shield" as const,
    name: "Bảo trì định kỳ",
    excerpt:
      "Chăm sóc, thay lõi lọc, bảo dưỡng hệ thống lọc nước định kỳ, đảm bảo nguồn nước luôn tinh khiết.",
    image:
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
    stat: "Trọn đời",
    statLabel: "bảo hành",
  },
  {
    icon: "CreditCard" as const,
    name: "Trả góp 0% lãi suất",
    excerpt:
      "Giải pháp mua máy lọc nước dễ dàng với chính sách trả góp 0% lãi suất, thủ tục nhanh gọn.",
    image:
      "https://images.unsplash.com/photo-1605802927108-4ff34bfe86a9?auto=format&fit=crop&w=800&q=80",
    stat: "0%",
    statLabel: "lãi suất",
  },
  {
    icon: "Package" as const,
    name: "Cho thuê máy lọc nước",
    excerpt:
      "Sử dụng máy lọc nước chất lượng cao mà không cần đầu tư ban đầu lớn.",
    image:
      "https://images.unsplash.com/photo-1628239532628-160d6033f01a?auto=format&fit=crop&w=800&q=80",
    stat: "Linh hoạt",
    statLabel: "hợp đồng",
  },
  {
    icon: "Home" as const,
    name: "Thay lõi lọc tận nhà",
    excerpt:
      "Dịch vụ thay lõi lọc tại nhà nhanh chóng với lõi chính hãng đa dạng thương hiệu.",
    image:
      "https://images.unsplash.com/photo-1685186112493-564c68f75d57?auto=format&fit=crop&w=800&q=80",
    stat: "Tận nơi",
    statLabel: "phục vụ",
  },
]

export function Services() {
  return (
    <section className="bg-[#102590] py-20">
      <Container>
        <SectionHeading
          eyebrow="Dịch vụ"
          title="Dịch Vụ Chuyên Nghiệp"
          description="Hỗ trợ đồng hành cùng khách hàng từ khảo sát thực tế đến bảo trì định kỳ trọn đời sản phẩm"
          className="mb-12"
          dark
        />

        {/* ── 6 photo cards — uniform grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((sv) => {
            const Icon = iconMap[sv.icon] || Wrench
            return (
              <div
                key={sv.name}
                className="group relative isolate overflow-hidden rounded-xl min-h-[320px] flex flex-col justify-end"
              >
                {/* Photo */}
                <Image
                  src={sv.image}
                  alt={sv.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a60]/90 via-[#102590]/40 to-transparent" />

                {/* Content */}
                <div className="relative p-6 text-white">
                  {/* Stat badge */}
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#36D1FF] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#102590]">
                    {sv.stat}
                    <span className="font-medium text-[#102590]/70">
                      {sv.statLabel}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                      <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-snug">{sv.name}</h3>
                      <p className="mt-1 text-sm text-white/70 leading-relaxed">
                        {sv.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/contact"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[#36D1FF] px-8 text-sm font-bold uppercase tracking-wide text-[#102590] transition-colors hover:bg-white"
          >
            Liên Hệ Tư Vấn <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}
