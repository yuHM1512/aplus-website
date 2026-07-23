import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Calendar, Clock } from "lucide-react"
import { Container } from "@/components/ui/container"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Blog & Kiến thức nước sạch",
  description: "Chia sẻ kiến thức, tin tức và giải pháp lọc nước từ APLUS Technologies",
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  })

  return (
    <>
      <section className="bg-[#F2F3F4] py-10 border-b border-gray-100">
        <Container>
          <h1 className="text-3xl md:text-4xl font-bold text-[#102590]">Blog & Kiến thức</h1>
          <p className="mt-2 text-gray-600">Chia sẻ kiến thức nước sạch cho gia đình Việt</p>
        </Container>
      </section>

      <section className="bg-white py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-[#006EF5] transition-all"
              >
                <div className="relative aspect-[16/10] bg-[#B5DBFF]/40 overflow-hidden">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold uppercase text-[#006EF5] bg-[#B5DBFF] px-2 py-1 rounded">
                    {post.category?.name || "Bài viết"}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-[#111827] line-clamp-2 min-h-[3rem] group-hover:text-[#006EF5] transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3 min-h-[4rem]">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                    {post.publishedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formatDate(post.publishedAt.toISOString())}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {Math.ceil((post.content?.length || 0) / 1000)} phút đọc
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
