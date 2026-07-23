import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ChevronRight, MapPin, Calendar, Phone } from "lucide-react"
import { Container } from "@/components/ui/container"
import { PROJECTS, PROJECT_CATEGORIES } from "@/lib/static-data"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Dự án thực tế",
  description:
    "Hình ảnh thực tế các công trình lắp đặt hệ thống lọc nước gia đình, công nghiệp và trạm nước công cộng do APLUS Technologies thi công.",
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const activeCat = cat && PROJECT_CATEGORIES.some((c) => c.key === cat) ? cat : "all"
  const projects =
    activeCat === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCat)

  return (
    <>
      {/* Header */}
      <section className="bg-[#102590] text-white py-14">
        <Container>
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link href="/" className="hover:text-[#36D1FF]">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-semibold">Dự án</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Dự án thực tế</h1>
          <p className="mt-3 text-white/80 max-w-2xl">
            Những công trình APLUS đã thi công — từ máy lọc gia đình, hệ lọc tổng đầu nguồn,
            đến hệ thống RO công nghiệp và trạm nước uống công cộng.
          </p>
        </Container>
      </section>

      {/* Filter + grid */}
      <section className="bg-white py-12">
        <Container>
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {PROJECT_CATEGORIES.map((c) => {
              const isActive = c.key === activeCat
              return (
                <Link
                  key={c.key}
                  href={c.key === "all" ? "/projects" : `/projects?cat=${c.key}`}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#102590] text-white"
                      : "bg-[#F2F3F4] text-gray-700 hover:bg-[#B5DBFF]"
                  }`}
                >
                  {c.label}
                </Link>
              )
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-gray-100 hover:border-[#006EF5] transition-all"
              >
                <div className="relative aspect-[4/5] bg-[#B5DBFF]/30 overflow-hidden">
                  <Image
                    src={p.coverImage}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase text-white bg-[#006EF5] px-2 py-1 rounded">
                    {PROJECT_CATEGORIES.find((c) => c.key === p.category)?.label}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#006EF5]">
                    <MapPin className="h-3 w-3" /> {p.location}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[#111827] line-clamp-2 leading-snug">
                    {p.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">{p.excerpt}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Hoàn thành {p.completedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <p className="text-center text-gray-500 py-12">
              Chưa có dự án trong hạng mục này.
            </p>
          )}
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-[#F2F3F4] py-14">
        <Container>
          <div className="rounded-xl bg-[#102590] px-8 py-10 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold">Bạn cần giải pháp lọc nước tương tự?</h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              Đăng ký khảo sát miễn phí hoặc gọi hotline để được tư vấn giải pháp phù hợp với nguồn nước của bạn.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/survey"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#36D1FF] text-[#102590] px-6 text-sm font-bold uppercase hover:bg-white transition-colors"
              >
                Đăng ký khảo sát
              </Link>
              <a
                href={`tel:${SITE_CONFIG.hotline.replace(/\s/g, "")}`}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-white/40 text-white px-6 text-sm font-bold uppercase hover:bg-white/10 transition-colors"
              >
                <Phone className="h-4 w-4" />
                {SITE_CONFIG.hotline}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
