import Link from "next/link"
import {
  ArrowRight,
  Box,
  Cog,
  Cylinder,
  Droplets,
  Filter,
  Gauge,
  Layers,
  Package,
  Thermometer,
  Waves,
  Wrench,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { prisma } from "@/lib/prisma"
import { SAPO_CATEGORY_MAP, getSortedCategories } from "@/lib/static-data"

const iconMap: Record<string, typeof Waves> = {
  Waves,
  Droplets,
  Cylinder,
  Layers,
  Filter,
  Wrench,
  Cog,
  Package,
  Thermometer,
  Gauge,
  Box,
}

// Visual cards cho các danh mục chính — chỉ hiển thị danh mục có hình ảnh
const categoryVisuals: Record<
  string,
  {
    label: string
    image: string
    kicker: string
    cta: string
  }
> = {
  "may-loc-nuoc": {
    label: "Máy lọc nước",
    image: "/images/products/may-loc-nuoc-karofi-kad-m59-1764649392.png",
    kicker: "RO, nóng lạnh, để bàn",
    cta: "Xem máy",
  },
  "cot-loc-nuoc": {
    label: "Cột lọc nước",
    image: "/images/products/bo-loc-dau-nguon-uf-vo-inox-cong-suat-5000lh-1769415880.png",
    kicker: "Cột composite, inox đầu nguồn",
    cta: "Xem cột lọc",
  },
  "bo-loc": {
    label: "Bộ lọc",
    image: "/images/products/163-1744700869.png",
    kicker: "Bộ lọc thô, tinh, UF, RO",
    cta: "Xem bộ lọc",
  },
  "linh-kien-loc-nuoc": {
    label: "Linh kiện lọc nước",
    image: "/images/products/163-1744700869.png",
    kicker: "Lõi lọc, phụ kiện chính hãng",
    cta: "Xem linh kiện",
  },
  "van-cac-loai": {
    label: "Van các loại",
    image: "/images/products/van-tu-dong-f65p1-5-nga-1763285913.png",
    kicker: "Van tự động, van thủ công",
    cta: "Xem van",
  },
  "vat-lieu-loc": {
    label: "Vật liệu lọc",
    image: "/images/products/163-1744700869.png",
    kicker: "Than, cát, sỏi, hạt lọc",
    cta: "Xem vật liệu",
  },
}

// Danh mục hiển thị trên homepage (chỉ lấy các danh mục có visual)
const HOMEPAGE_CAT_SLUGS = [
  "may-loc-nuoc",
  "cot-loc-nuoc",
  "bo-loc",
  "linh-kien-loc-nuoc",
  "van-cac-loai",
  "vat-lieu-loc",
]

interface CategoryItem {
  key: string
  slug: string
  name: string
  icon: string
  count: number
}

export async function Categories() {
  // Query số lượng sản phẩm thật theo category
  const categoryCounts = await prisma.product.groupBy({
    by: ["category"],
    where: { published: true },
    _count: { _all: true },
  })

  const countMap = new Map(
    categoryCounts.map((c) => [c.category, c._count._all])
  )

  // Lấy danh mục đã sort, gắn count thật
  const allCategories = getSortedCategories().map((cat) => ({
    ...cat,
    count: countMap.get(cat.key) ?? 0,
  }))

  // Chỉ lấy danh mục có visual cho homepage cards
  const displayCategories = HOMEPAGE_CAT_SLUGS
    .map((slug) => allCategories.find((c) => c.slug === slug))
    .filter((c) => c !== undefined)

  const featuredCategories = displayCategories.slice(0, 2)
  const compactCategories = displayCategories.slice(2)

  return (
    <section className="bg-white py-20" id="product-categories">
      <Container>
        <SectionHeading
          eyebrow="Ngành hàng"
          title="Danh Mục Sản Phẩm"
          description="Chọn nhanh nhóm giải pháp lọc nước theo nhu cầu sử dụng, quy mô lắp đặt và lịch bảo trì."
          className="mb-12"
        />

        <div className="grid gap-6 lg:grid-cols-[84px_minmax(0,1fr)]">
          {/* Sidebar icon strip — hiện tất cả danh mục */}
          <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:flex lg:flex-col">
            <div className="bg-[#006EF5] px-3 py-4 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-white">
              Danh mục
            </div>
            {allCategories.map((cat) => {
              const Icon = iconMap[cat.icon] || Droplets
              const visual = categoryVisuals[cat.slug]
              const label = visual?.label || cat.name

              return (
                <Link
                  key={cat.key}
                  href={`/products?cat=${cat.slug}`}
                  className="group flex h-16 items-center justify-center border-t border-gray-100 bg-white text-[#102590] transition-colors hover:bg-[#B5DBFF]/50 hover:text-[#006EF5]"
                  aria-label={label}
                  title={label}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </Link>
              )
            })}
          </div>

          {/* Category cards */}
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredCategories.map((cat) => (
                <CategoryVisualCard key={cat.key} category={cat} featured />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {compactCategories.map((cat) => (
                <CategoryVisualCard key={cat.key} category={cat} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function CategoryVisualCard({
  category,
  featured = false,
}: {
  category: CategoryItem
  featured?: boolean
}) {
  const visual = categoryVisuals[category.slug]
  if (!visual) return null

  return (
    <Link
      href={`/products?cat=${category.slug}`}
      className={[
        "group relative isolate block overflow-hidden rounded-lg border border-gray-200 bg-[#102590] shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:border-[#006EF5] hover:shadow-lg",
        featured ? "min-h-[300px]" : "min-h-[220px]",
      ].join(" ")}
    >
      {/* Product image — top right area */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${visual.image})` }}
      />
      {/* Lighter overlay — lets product image show through more */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#102590]/70 via-[#102590]/45 to-[#102590]/10" />
      {/* Bottom band — enough contrast for text, but not too heavy */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#102590]/90 via-[#102590]/60 to-transparent" />

      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 text-white">
        <div className="max-w-[88%]">
          <div className="mb-3 inline-flex rounded-full bg-[#006EF5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {category.count} sản phẩm
          </div>
          <h3
            className={[
              "font-bold leading-tight tracking-tight text-white",
              featured ? "text-3xl md:text-4xl" : "text-2xl",
            ].join(" ")}
          >
            {visual.label}
          </h3>
          <p className="mt-2 text-sm font-medium text-[#B5DBFF]">{visual.kicker}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#36D1FF] underline underline-offset-4">
            {visual.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}
