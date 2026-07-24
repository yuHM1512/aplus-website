import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ChevronRight, Search, Phone } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SocialButtons } from "@/components/ui/social-buttons"
import { prisma } from "@/lib/prisma"
import { PRODUCT_CATEGORIES } from "@/lib/static-data"
import { SITE_CONFIG } from "@/lib/constants"
import { shouldSkipImageOptimization } from "@/lib/images"

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Danh mục sản phẩm lọc nước công nghệ cao APLUS Technologies",
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const params = await searchParams
  const activeCat = params.cat

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(activeCat ? { category: activeCat } : {}),
    },
    orderBy: { order: "asc" },
  })

  const totalCount = await prisma.product.count({ where: { published: true } })

  return (
    <>
      {/* Breadcrumb + page title */}
      <section className="bg-[#F2F3F4] py-10 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Link href="/" className="hover:text-[#006EF5]">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#102590] font-semibold">Sản phẩm</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#102590]">Danh mục sản phẩm</h1>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-white py-12">
        <Container>
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar filter */}
            <aside className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full h-11 pl-10 pr-4 rounded-md border border-[#B5DBFF] focus:outline-none focus:border-[#006EF5] text-sm"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-[#102590] uppercase mb-3">Danh mục</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/products"
                      className={`flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${
                        !activeCat ? "bg-[#B5DBFF] text-[#102590] font-bold" : "hover:bg-[#F2F3F4] text-gray-700"
                      }`}
                    >
                      <span>Tất cả</span>
                      <span className="text-xs">{totalCount}</span>
                    </Link>
                  </li>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/products?cat=${cat.slug}`}
                        className={`flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${
                          activeCat === cat.slug
                            ? "bg-[#B5DBFF] text-[#102590] font-bold"
                            : "hover:bg-[#F2F3F4] text-gray-700"
                        }`}
                      >
                        <span className="line-clamp-1">{cat.name}</span>
                        <span className="text-xs">{cat.productCount}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brand */}
              <div>
                <h3 className="text-sm font-bold text-[#102590] uppercase mb-3">Thương hiệu</h3>
                <div className="space-y-2">
                  {["APLUS", "Karofi", "AO Smith", "Sagana", "TW"].map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" className="rounded border-[#B5DBFF] text-[#006EF5]" />
                      {b}
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  Hiển thị <span className="font-bold text-[#102590]">{products.length}</span> sản phẩm
                </p>
                <select className="h-10 px-3 rounded-md border border-[#B5DBFF] text-sm">
                  <option>Mới nhất</option>
                  <option>Giá thấp → cao</option>
                  <option>Giá cao → thấp</option>
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="group flex flex-col bg-white rounded-lg border border-gray-100 hover:border-[#006EF5] overflow-hidden transition-all"
                  >
                    <Link href={`/products/${p.slug}`} className="block">
                      <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
                        {p.badge && (
                          <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase text-white bg-[#006EF5] px-2 py-1 rounded">
                            {p.badge}
                          </span>
                        )}
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-contain p-4 group-hover:scale-105 transition-transform"
                            unoptimized={shouldSkipImageOptimization(p.image)}
                          />
                        )}
                      </div>
                      <div className="px-4 pt-4">
                        <span className="text-[10px] font-bold uppercase text-[#006EF5] bg-[#B5DBFF] px-2 py-0.5 rounded">
                          {p.categoryName || p.category}
                        </span>
                        <h3 className="mt-2 text-sm font-bold text-[#111827] line-clamp-2 min-h-[2.5rem] group-hover:text-[#006EF5] transition-colors">
                          {p.name}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-base font-bold text-[#102590]">{p.price}đ</span>
                          {p.priceOriginal && (
                            <span className="text-xs text-gray-400 line-through">{p.priceOriginal}đ</span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Contact + social buttons */}
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

              {/* Pagination placeholder */}
              <div className="mt-10 flex justify-center gap-2">
                {[1, 2, 3, "...", 12].map((n, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 rounded text-sm font-semibold transition-colors ${
                      n === 1
                        ? "bg-[#102590] text-white"
                        : "bg-white border border-[#B5DBFF] text-gray-700 hover:bg-[#B5DBFF]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
