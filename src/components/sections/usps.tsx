import { Container } from "@/components/ui/container"
import { Headphones, Wrench, TrendingDown, ShieldCheck } from "lucide-react"
import { MOCK_USPS } from "@/lib/mock-data"

const iconMap = { Headphones, Wrench, TrendingDown, ShieldCheck }

export function Usps() {
  return (
    <section className="bg-white py-10 -mt-10 relative z-10">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_USPS.map((usp) => {
            const Icon = iconMap[usp.icon as keyof typeof iconMap] || ShieldCheck
            return (
              <div
                key={usp.title}
                className="bg-white rounded-lg border border-gray-100 p-5 hover:border-[#006EF5] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-[#B5DBFF] flex items-center justify-center shrink-0 group-hover:bg-[#006EF5] transition-colors">
                    <Icon className="h-5 w-5 text-[#006EF5] group-hover:text-white transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#102590] uppercase truncate">{usp.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{usp.description}</p>
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
