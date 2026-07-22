import { Hero } from "@/components/sections/hero"
import { Usps } from "@/components/sections/usps"
import { Categories } from "@/components/sections/categories"
import { FeaturedProducts } from "@/components/sections/featured-products"
import { Stats } from "@/components/sections/stats"
import { Projects } from "@/components/sections/projects"
import { Services } from "@/components/sections/services"
import { BlogTestimonials } from "@/components/sections/blog-testimonials"
import { Cta } from "@/components/sections/cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Usps />
      <Categories />
      <FeaturedProducts />
      <Stats />
      <Projects />
      <Services />
      <BlogTestimonials />
      <Cta />
    </>
  )
}
