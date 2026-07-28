import Link from "next/link"
import type { Metadata } from "next"
import { ChevronRight, X } from "lucide-react"
import { Container } from "@/components/ui/container"
import { ProductCard } from "@/components/products/product-card"
import { ProductsToolbar } from "@/components/products/products-toolbar"
import { ProductsSearch } from "@/components/products/products-search"
import { prisma } from "@/lib/prisma"
import { PRODUCT_CATEGORIES } from "@/lib/static-data"

export const metadata: Metadata = {
  title: "Sản phẩm | Aplus Technologies",
  description:
    "Danh mục sản phẩm lọc nước công nghệ cao APLUS Technologies. Máy lọc nước RO, hệ thống lọc tổng, lõi lọc chính hãng.",
}

// ─── Price tiers ───────────────────────────────────────
const PRICE_TIERS = [
  { id: "under-3m", label: "Dưới 3 triệu", min: 0, max: 3_000_000 },
  { id: "3-8m", label: "3 – 8 triệu", min: 3_000_000, max: 8_000_000 },
  { id: "8-15m", label: "8 – 15 triệu", min: 8_000_000, max: 15_000_000 },
  { id: "over-15m", label: "Trên 15 triệu", min: 15_000_000, max: 999_999_999 },
] as const

// ─── Brands ────────────────────────────────────────────
const BRANDS = ["APLUS", "Karofi", "AO Smith", "Sagana", "TW"] as const

// ─── Sort options ──────────────────────────────────────
type SortKey = "default" | "newest" | "price-asc" | "price-desc" | "name-asc"

function getOrderBy(sort: SortKey) {
  switch (sort) {
    case "newest":
      return { createdAt: "desc" as const }
    case "price-asc":
      return { priceNumeric: "asc" as const }
    case "price-desc":
      return { priceNumeric: "desc" as const }
    case "name-asc":
      return { name: "asc" as const }
    default:
      return { order: "asc" as const }
  }
}

interface SearchParams {
  cat?: string
  price?: string
  brand?: string
  q?: string
  sort?: SortKey
  view?: "grid" | "list"
  page?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const activeCat = params.cat
  const activePrice = PRICE_TIERS.find((t) => t.id === params.price)
  const activeBrand = params.brand
  const query = params.q?.trim()
  const sort = (params.sort || "default") as SortKey
  const view = params.view === "list" ? "list" : "grid"
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1)
  const perPage = 12

  // ─── Build Prisma where clause ───
  const where: Record<string, unknown> = { published: true }

  if (activeCat) where.category = activeCat
  if (activeBrand) where.brand = activeBrand
  if (activePrice) {
    where.priceNumeric = { gte: activePrice.min, lte: activePrice.max }
  }
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ]
  }

  const [products, totalCount, allCount] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
    prisma.product.count({ where: { published: true } }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))

  // Active filter chips
  const activeFilters: { label: string; removeHref: string }[] = []
  const buildHref = (removeKey: string) => {
    const p = new URLSearchParams()
    if (activeCat && removeKey !== "cat") p.set("cat", activeCat)
    if (params.price && removeKey !== "price") p.set("price", params.price)
    if (activeBrand && removeKey !== "brand") p.set("brand", activeBrand)
    if (query && removeKey !== "q") p.set("q", query)
    if (sort !== "default") p.set("sort", sort)
    if (view !== "grid") p.set("view", view)
    return `/products${p.toString() ? "?" + p.toString() : ""}`
  }
  if (activeCat) {
    const catName = PRODUCT_CATEGORIES.find((c) => c.slug === activeCat)?.name || activeCat
    activeFilters.push({ label: `Danh mục: ${catName}`, removeHref: buildHref("cat") })
  }
  if (activePrice) {
    activeFilters.push({ label: `Giá: ${activePrice.label}`, removeHref: buildHref("price") })
  }
  if (activeBrand) {
    activeFilters.push({ label: `Thương hiệu: ${activeBrand}`, removeHref: buildHref("brand") })
  }
  if (query) {
    activeFilters.push({ label: `Tìm: "${query}"`, removeHref: buildHref("q") })
  }

  return (
    <>
      {/* Breadcrumb + page title */}
      <section className="bg-[#F2F3F4] py-10 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Link href="/" className="hover:text-[#006EF5] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#102590] font-semibold">Sản phẩm</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#102590]">Danh mục sản phẩm</h1>
          <p className="mt-2 text-sm text-gray-600">
            {allCount} sản phẩm chính hãng — Bảo hành đầy đủ, giao hàng toàn quốc
          </p>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-white py-10">
        <Container>
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* ─── Sidebar filter ─── */}
            <aside className="space-y-8">
              {/* Search */}
              <div>
                <h3 className="text-sm font-bold text-[#102590] uppercase mb-3 tracking-wide">
                  Tìm kiếm
                </h3>
                <ProductsSearch />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-[#102590] uppercase mb-3 tracking-wide">
                  Danh mục sản phẩm
                </h3>
                <ul className="space-y-1">
                  <FilterLink
                    href={buildFilterHref({ ...params, cat: undefined })}
                    active={!activeCat}
                    label="Tất cả sản phẩm"
                    count={allCount}
                  />
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <FilterLink
                      key={cat.slug}
                      href={buildFilterHref({ ...params, cat: cat.slug, page: undefined })}
                      active={activeCat === cat.slug}
                      label={cat.name}
                      count={cat.productCount}
                    />
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-sm font-bold text-[#102590] uppercase mb-3 tracking-wide">
                  Phân khúc giá
                </h3>
                <ul className="space-y-1">
                  <FilterLink
                    href={buildFilterHref({ ...params, price: undefined })}
                    active={!activePrice}
                    label="Tất cả giá"
                  />
                  {PRICE_TIERS.map((tier) => (
                    <FilterLink
                      key={tier.id}
                      href={buildFilterHref({ ...params, price: tier.id, page: undefined })}
                      active={activePrice?.id === tier.id}
                      label={tier.label}
                    />
                  ))}
                </ul>
              </div>

              {/* Brand */}
              <div>
                <h3 className="text-sm font-bold text-[#102590] uppercase mb-3 tracking-wide">
                  Thương hiệu
                </h3>
                <ul className="space-y-1">
                  <FilterLink
                    href={buildFilterHref({ ...params, brand: undefined })}
                    active={!activeBrand}
                    label="Tất cả thương hiệu"
                  />
                  {BRANDS.map((b) => (
                    <FilterLink
                      key={b}
                      href={buildFilterHref({ ...params, brand: b, page: undefined })}
                      active={activeBrand === b}
                      label={b}
                    />
                  ))}
                </ul>
              </div>
            </aside>

            {/* ─── Product grid ─── */}
            <div>
              <ProductsToolbar totalCount={totalCount} view={view} />

              {/* Active filter chips */}
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="text-xs text-gray-500">Đang lọc:</span>
                  {activeFilters.map((f) => (
                    <Link
                      key={f.label}
                      href={f.removeHref}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#B5DBFF] text-[#102590] text-xs font-semibold rounded hover:bg-[#36D1FF] transition-colors"
                    >
                      {f.label}
                      <X className="h-3 w-3" />
                    </Link>
                  ))}
                  <Link
                    href="/products"
                    className="text-xs text-red-500 hover:text-red-700 font-medium underline ml-1"
                  >
                    Xóa tất cả
                  </Link>
                </div>
              )}

              {products.length === 0 ? (
                <EmptyState />
              ) : (
                <div
                  className={
                    view === "list"
                      ? "flex flex-col gap-4"
                      : "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                  }
                >
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                    const href = buildFilterHref({ ...params, page: n === 1 ? undefined : String(n) })
                    return (
                      <Link
                        key={n}
                        href={href}
                        className={`min-w-10 h-10 px-3 rounded flex items-center justify-center text-sm font-semibold transition-colors ${
                          n === page
                            ? "bg-[#102590] text-white"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-[#B5DBFF] hover:border-[#B5DBFF]"
                        }`}
                      >
                        {n}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

/* ── Helpers ── */
function buildFilterHref(p: SearchParams): string {
  const params = new URLSearchParams()
  if (p.cat) params.set("cat", p.cat)
  if (p.price) params.set("price", p.price)
  if (p.brand) params.set("brand", p.brand)
  if (p.q) params.set("q", p.q)
  if (p.sort && p.sort !== "default") params.set("sort", p.sort)
  if (p.view && p.view !== "grid") params.set("view", p.view)
  if (p.page) params.set("page", p.page)
  const q = params.toString()
  return `/products${q ? "?" + q : ""}`
}

/* ── Filter link (sidebar) ── */
function FilterLink({
  href,
  active,
  label,
  count,
}: {
  href: string
  active: boolean
  label: string
  count?: number
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center justify-between px-3 py-2 rounded text-sm transition-colors ${
          active
            ? "bg-[#B5DBFF] text-[#102590] font-bold"
            : "hover:bg-[#F2F3F4] text-gray-700"
        }`}
      >
        <span className="line-clamp-1">{label}</span>
        {typeof count === "number" && <span className="text-xs text-gray-500">{count}</span>}
      </Link>
    </li>
  )
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
      <p className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</p>
      <p className="text-sm text-gray-500 mb-6">
        Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
      </p>
      <Link
        href="/products"
        className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] text-white px-6 text-sm font-semibold uppercase hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
      >
        Xem tất cả sản phẩm
      </Link>
    </div>
  )
}
