import { Container } from "@/components/ui/container"
import { STATS } from "@/lib/static-data"

export function Stats() {
  return (
    <section className="bg-[#102590] py-16">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-4xl md:text-5xl font-bold text-[#36D1FF] mb-2 tracking-tight">
                {s.value}
              </div>
              <div className="text-sm text-white/80 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
