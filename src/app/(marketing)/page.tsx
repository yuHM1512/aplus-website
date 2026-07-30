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
