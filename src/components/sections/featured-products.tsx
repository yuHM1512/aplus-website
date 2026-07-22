"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Phone } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { SocialButtons } from "@/components/ui/social-buttons"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { SITE_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "he-thong-loc-nuoc", label: "Hệ thống lọc" },
  { key: "may-loc-nuoc", label: "Máy lọc RO" },
  { key: "loi-loc-nuoc", label: "Lõi lọc" },
]

export function FeaturedProducts() {
  const [tab, setTab] = useState<string>("all")

  const products = MOCK_PRODUCTS.filter(
    (p) => tab === "all" || p.category === tab
  ).slice(0, 8)

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
          {products.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col bg-white rounded-lg overflow-hidden border border-transparent hover:border-[#006EF5] transition-all"
            >
              <Link href={`/products/${p.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
                  {p.badge && (
                    <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase text-white bg-[#006EF5] px-2 py-1 rounded">
                      {p.badge}
                    </span>
                  )}
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info */}
                <div className="px-4 pt-4 space-y-2">
                  <h3 className="text-sm font-bold text-[#111827] line-clamp-2 min-h-[2.5rem] group-hover:text-[#006EF5] transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">{p.excerpt}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-base font-bold text-[#102590]">{p.price}đ</span>
                    {p.priceOriginal && (
                      <span className="text-xs text-gray-400 line-through">{p.priceOriginal}đ</span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Contact + social — conversion channels */}
              <div className="mt-auto px-4 pb-4 pt-3">
                <a
                  href={SITE_CONFIG.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-md bg-[#102590] py-2 text-xs font-bold text-white transition-colors hover:bg-[#006EF5]"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Hotline/Zalo: {SITE_CONFIG.hotline}
                </a>
                <SocialButtons className="mt-2 justify-center" />
              </div>
            </div>
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
