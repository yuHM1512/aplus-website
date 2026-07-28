"use client"

import Link from "next/link"
import { useState } from "react"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { ProductCard, type ProductCardData } from "@/components/products/product-card"
import { cn } from "@/lib/utils"

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "he-thong-loc-nuoc", label: "Hệ thống lọc" },
  { key: "may-loc-nuoc", label: "Máy lọc RO" },
  { key: "loi-loc-nuoc", label: "Lõi lọc" },
]

export function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  const [tab, setTab] = useState<string>("all")

  const filtered = products
    .filter((p) => tab === "all" || p.category === tab)
    .slice(0, 8)

  return (
    <section className="bg-[#F2F3F4] py-20">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Sản phẩm nổi bật"
            title="Sản Phẩm Chất Lượng"
            description="Top giải pháp lọc nước được ưu chuộng nhất 2026"
            align="left"
          />
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                  tab === t.key
                    ? "bg-[#102590] text-white"
                    : "bg-white text-gray-700 hover:bg-[#B5DBFF]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#102590] text-white px-8 text-sm font-bold uppercase hover:bg-[#006EF5] transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </Container>
    </section>
  )
}
