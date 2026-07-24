import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ChevronRight, Check, Phone } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SocialButtons } from "@/components/ui/social-buttons"
import { prisma } from "@/lib/prisma"
import { SITE_CONFIG } from "@/lib/constants"
import { shouldSkipImageOptimization } from "@/lib/images"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await prisma.product.findUnique({ where: { slug } })
  if (!p) return { title: "Không tìm thấy sản phẩm" }
  return {
    title: p.name,
    description: p.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return notFound()

  const related = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
      published: true,
    },
    take: 4,
    orderBy: { order: "asc" },
  })

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[#F2F3F4] py-6 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-[#006EF5]">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-[#006EF5]">Sản phẩm</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#102590] font-semibold">{product.categoryName || product.category}</span>
          </div>
        </Container>
      </section>

      {/* Detail */}
      <section className="bg-white py-12">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Gallery */}
            <div>
              <div className="aspect-square bg-white rounded-xl flex items-center justify-center relative overflow-hidden border border-gray-100">
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 text-xs font-bold uppercase text-white bg-[#006EF5] px-3 py-1.5 rounded">
                    {product.badge}
                  </span>
                )}
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-8"
                    priority
                    unoptimized={shouldSkipImageOptimization(product.image)}
                  />
                )}
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative aspect-square bg-white rounded-md flex items-center justify-center cursor-pointer border border-gray-100 hover:border-[#006EF5] overflow-hidden">
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={`${product.name} ${i}`}
                        fill
                        sizes="120px"
                        className="object-contain p-2 opacity-60 hover:opacity-100 transition-opacity"
                        unoptimized={shouldSkipImageOptimization(product.image)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase text-[#006EF5] bg-[#B5DBFF] px-2 py-1 rounded">
                  {product.categoryName || product.category}
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-bold text-[#102590]">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-baseline gap-3 pb-5 border-b border-gray-100">
                <span className="text-3xl font-bold text-[#102590]">{product.price}đ</span>
                {product.priceOriginal && (
                  <span className="text-lg text-gray-400 line-through">{product.priceOriginal}đ</span>
                )}
              </div>

              {/* Meta */}
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-gray-500">Thương hiệu</dt>
                  <dd className="font-semibold text-[#111827]">{product.brand || "—"}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Danh mục</dt>
                  <dd className="font-semibold text-[#111827]">{product.categoryName || product.category}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Bảo hành</dt>
                  <dd className="font-semibold text-[#111827]">36 tháng</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Xuất xứ</dt>
                  <dd className="font-semibold text-[#111827]">Chính hãng</dd>
                </div>
              </dl>

              {/* Features */}
              <div className="bg-[#B5DBFF]/30 rounded-lg p-5 space-y-2">
                <h3 className="text-sm font-bold text-[#102590] uppercase mb-2">Đặc điểm nổi bật</h3>
                {[
                  "Công nghệ RO tiên tiến từ Mỹ",
                  "Loại bỏ 99.99% vi khuẩn, kim loại nặng",
                  "Lõi Smax thay nhanh, tuổi thọ cao",
                  "Tiết kiệm điện năng đến 40%",
                ].map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-[#006EF5] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/survey"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-[#102590] text-white px-6 text-sm font-bold uppercase hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
                >
                  Đăng ký khảo sát
                </Link>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-[#006EF5] text-[#006EF5] px-6 text-sm font-bold uppercase hover:bg-[#006EF5] hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Gọi tư vấn
                </a>
              </div>

              {/* Order channels */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-600">Đặt mua qua:</span>
                <SocialButtons size="md" />
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[#F2F3F4] py-16">
          <Container>
            <h2 className="text-2xl font-bold text-[#102590] mb-8">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-white rounded-lg border border-gray-100 hover:border-[#006EF5] overflow-hidden"
                >
                  <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-4"
                        unoptimized={shouldSkipImageOptimization(p.image)}
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-[#111827] line-clamp-2 min-h-[2.5rem] group-hover:text-[#006EF5] transition-colors">
                      {p.name}
                    </h3>
                    <div className="mt-2 text-sm font-bold text-[#102590]">{p.price}đ</div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
