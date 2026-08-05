import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { Hero } from "@/components/sections/hero"
import { Usps } from "@/components/sections/usps"
import { Categories } from "@/components/sections/categories"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { Stats } from "@/components/sections/stats"
import { Projects } from "@/components/sections/projects"
import { Services } from "@/components/sections/services"
import { BlogTestimonials } from "@/components/sections/blog-testimonials"
import { Cta } from "@/components/sections/cta"

// SEO: Homepage metadata riêng — override default từ root layout
// Title 56 ký tự, description 155 ký tự — nằm trong khoảng tối ưu
export const metadata: Metadata = {
  title: "Máy Lọc Nước Chính Hãng Quy Nhơn, Bình Định | Aplus Technologies",
  description:
    "Đại lý máy lọc nước chính hãng Karofi, Kangaroo, A.O. Smith tại Quy Nhơn. Khảo sát miễn phí, lắp đặt trong 24h, bảo hành trọn đời. Gọi ngay 0935 455 558.",
  alternates: {
    canonical: "/",
  },
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { published: true, image: { not: null } },
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      price: true,
      priceOriginal: true,
      priceNumeric: true,
      category: true,
      categoryName: true,
      brand: true,
      image: true,
      badge: true,
    },
  })

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  })

  return (
    <>
      <Hero />
      <Usps />
      <Categories />
      <FeaturedProducts products={products} />
      <Stats />
      <Projects />
      <Services />
      <BlogTestimonials posts={posts} />
      <Cta />
    </>
  )
}
