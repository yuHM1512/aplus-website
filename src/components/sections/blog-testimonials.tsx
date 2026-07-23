import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Quote } from "lucide-react"
import { Container } from "@/components/ui/container"
import { TESTIMONIALS } from "@/lib/static-data"
import { formatDate } from "@/lib/utils"

interface PostItem {
  id: string
  slug: string
  title: string
  coverImage: string | null
  publishedAt: Date | null
  category: { name: string } | null
}

export function BlogTestimonials({ posts }: { posts: PostItem[] }) {
  return (
    <section className="bg-[#F2F3F4] py-20">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Testimonials */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-[#006EF5]" />
              <h2 className="text-xl font-bold text-[#102590] uppercase">Ý kiến khách hàng</h2>
            </div>
            <div className="space-y-4">
              {TESTIMONIALS.slice(0, 3).map((t) => (
                <div key={t.id} className="bg-white rounded-lg p-5 border border-gray-100">
                  <Quote className="h-6 w-6 text-[#B5DBFF] mb-3" />
                  <p className="text-sm text-gray-700 italic leading-relaxed mb-3">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#006EF5] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {t.name.split(" ").pop()?.[0] ?? "K"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#102590]">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blog preview */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-[#006EF5]" />
              <h2 className="text-xl font-bold text-[#102590] uppercase">Kiến thức nước sạch</h2>
            </div>
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 bg-white rounded-lg p-4 border border-gray-100 hover:border-[#006EF5] transition-colors"
                >
                  <div className="relative w-24 h-24 rounded-md bg-[#B5DBFF] shrink-0 overflow-hidden">
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase text-[#006EF5] bg-[#B5DBFF] px-2 py-0.5 rounded">
                      {post.category?.name || "Bài viết"}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-[#111827] line-clamp-2 group-hover:text-[#006EF5] transition-colors">
                      {post.title}
                    </h3>
                    {post.publishedAt && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt.toISOString())}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006EF5] hover:underline"
              >
                Xem tất cả bài viết <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
