import Link from "next/link"
import {
  ArrowRight,
  Cog,
  Droplets,
  Filter,
  Package,
  Wrench,
  Waves,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { PRODUCT_CATEGORIES } from "@/lib/static-data"

const iconMap = { Droplets, Waves, Cog, Filter, Package, Wrench }

const categoryVisuals: Record<
  string,
  {
    label: string
    image: string
    kicker: string
    cta: string
  }
> = {
  "he-thong-loc-nuoc": {
    label: "Hệ thống lọc nước",
    image: "/images/products/bo-loc-dau-nguon-uf-vo-inox-cong-suat-5000lh-1769415880.png",
    kicker: "Gia đình, nhà phố, xưởng nhỏ",
    cta: "Xem hệ thống",
  },
  "may-loc-nuoc": {
    label: "Máy lọc nước",
    image: "/images/products/may-loc-nuoc-karofi-kad-m59-1764649392.png",
    kicker: "RO, nóng lạnh, để bàn",
    cta: "Xem máy",
  },
  "thiet-bi-loc-nuoc": {
    label: "Thiết bị lọc nước",
    image: "/images/products/van-tu-dong-f65p1-5-nga-1763285913.png",
    kicker: "Van, bơm, thiết bị điều khiển",
    cta: "Xem thiết bị",
  },
  "loi-loc-nuoc": {
    label: "Lõi lọc & linh kiện",
    image: "/images/products/163-1744700869.png",
    kicker: "Chính hãng, thay đúng lịch",
    cta: "Xem lõi",
  },
  "vat-lieu-loc": {
    label: "Vật liệu lọc",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    kicker: "Than, cát, sỏi, hạt lọc",
    cta: "Xem vật liệu",
  },
  "dich-vu-bao-tri": {
    label: "Dịch vụ bảo trì",
    image:
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=900&q=80",
    kicker: "Khảo sát, lắp đặt, bảo trì",
    cta: "Đặt lịch",
  },
}

export function Categories() {
  const featuredCategories = PRODUCT_CATEGORIES.slice(0, 2)
  const compactCategories = PRODUCT_CATEGORIES.slice(2)

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
          <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:flex lg:flex-col">
            <div className="bg-[#006EF5] px-3 py-4 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-white">
              Danh mục
            </div>
            {PRODUCT_CATEGORIES.map((cat) => {
              const Icon = iconMap[cat.icon as keyof typeof iconMap] || Droplets
              const visual = categoryVisuals[cat.slug]

              return (
                <Link
                  key={cat.id}
                  href={`/products?cat=${cat.slug}`}
                  className="group flex h-16 items-center justify-center border-t border-gray-100 bg-white text-[#102590] transition-colors hover:bg-[#B5DBFF]/50 hover:text-[#006EF5]"
                  aria-label={visual.label}
                  title={visual.label}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </Link>
              )
            })}
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {featuredCategories.map((cat) => (
                <CategoryVisualCard key={cat.id} category={cat} featured />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {compactCategories.map((cat) => (
                <CategoryVisualCard key={cat.id} category={cat} />
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
  category: (typeof PRODUCT_CATEGORIES)[number]
  featured?: boolean
}) {
  const visual = categoryVisuals[category.slug]

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
            {category.productCount} sản phẩm
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
