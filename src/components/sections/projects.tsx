import Link from "next/link"
import Image from "next/image"
import { MapPin, ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { MOCK_PROJECTS } from "@/lib/mock-data"

export function Projects() {
  const projects = MOCK_PROJECTS.slice(0, 6)

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Dự án thực tế"
            title="Công Trình Đã Thi Công"
            description="Hình ảnh thực tế các dự án lắp đặt hệ thống lọc nước gia đình, công nghiệp và trạm nước công cộng."
            align="left"
          />
          <Link
            href="/projects"
            className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-[#006EF5] hover:underline shrink-0"
          >
            Xem tất cả dự án <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Link
              key={p.id}
              href="/projects"
              className="group relative block overflow-hidden rounded-lg border border-gray-100 hover:border-[#006EF5] transition-all"
            >
              <div className="relative aspect-[4/5] bg-[#B5DBFF]/30 overflow-hidden">
                <Image
                  src={p.coverImage}
                  alt={p.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient + caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020035]/90 via-[#020035]/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#36D1FF]">
                    <MapPin className="h-3 w-3" /> {p.location}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-white line-clamp-2 leading-snug">
                    {p.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center lg:hidden">
          <Link
            href="/projects"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] text-white px-6 text-sm font-bold uppercase hover:bg-[#006EF5] transition-colors"
          >
            Xem tất cả dự án
          </Link>
        </div>
      </Container>
    </section>
  )
}
