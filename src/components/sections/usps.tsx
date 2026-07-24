import { Container } from "@/components/ui/container"
import { Headphones, Settings, Banknote, ShieldCheck } from "lucide-react"

const USP_DATA = [
  {
    icon: Headphones,
    figure: "24/7",
    title: "Tư vấn miễn phí",
    description: "Hỗ trợ tận tâm mọi lúc",
  },
  {
    icon: Settings,
    figure: "5 phút",
    title: "Đơn giản bảo trì",
    description: "Thiết kế module thông minh",
  },
  {
    icon: Banknote,
    figure: "30%",
    title: "Tiết kiệm chi phí",
    description: "So với giải pháp truyền thống",
  },
  {
    icon: ShieldCheck,
    figure: "ISO",
    title: "Chất lượng kiểm chứng",
    description: "Đạt chuẩn quốc tế",
  },
]

export function Usps() {
  return (
    <section className="bg-white py-0 -mt-8 relative z-10">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {USP_DATA.map((usp) => {
            const Icon = usp.icon
            return (
              <div
                key={usp.title}
                className="bg-white rounded-xl border border-gray-100 p-5 lg:p-6 shadow-sm hover:shadow-md hover:border-[#006EF5]/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#EFF4FF] flex items-center justify-center shrink-0 group-hover:bg-[#006EF5] transition-colors">
                    <Icon className="h-5 w-5 text-[#006EF5] group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-extrabold text-[#102590] leading-none mb-1">{usp.figure}</div>
                    <h3 className="text-sm font-bold text-gray-900 mb-0.5">{usp.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{usp.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
