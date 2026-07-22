import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { Search, Wrench, Shield, CreditCard, Package, Home } from "lucide-react"
import { MOCK_SERVICES } from "@/lib/mock-data"

const iconMap = { Search, Wrench, Shield, CreditCard, Package, Home }

export function Services() {
  return (
    <section className="bg-white py-20">
      <Container>
        <SectionHeading
          eyebrow="Dịch vụ"
          title="Dịch Vụ Chuyên Nghiệp"
          description="Hỗ trợ đồng hành cùng khách hàng từ khảo sát thực tế đến bảo trì định kỳ trọn đời sản phẩm"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SERVICES.map((sv) => {
            const Icon = iconMap[sv.icon as keyof typeof iconMap] || Wrench
            return (
              <div
                key={sv.id}
                className="group bg-[#B5DBFF]/40 rounded-lg p-8 text-center hover:bg-[#B5DBFF] border border-transparent hover:border-[#006EF5] transition-all"
              >
                <div className="mx-auto w-16 h-16 rounded-md bg-white flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7 text-[#006EF5]" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-[#102590] mb-2">{sv.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{sv.excerpt}</p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
