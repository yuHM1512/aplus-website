import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Calendar, Clock, ArrowLeft, Facebook, Twitter, Link2 } from "lucide-react"
import { Container } from "@/components/ui/container"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({ where: { slug } })
  if (!post) return { title: "Không tìm thấy bài viết" }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!post) return notFound()

  const related = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  })

  const readingTime = Math.ceil((post.content?.length || 0) / 1000)

  return (
    <>
      {/* Cover */}
      <section className="bg-[#102590] text-white py-16 lg:py-20">
        <Container>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-[#36D1FF] mb-6">
            <ArrowLeft className="h-4 w-4" /> Quay lại blog
          </Link>
          <span className="text-[10px] font-bold uppercase text-[#36D1FF] bg-white/10 px-3 py-1.5 rounded">
            {post.category?.name || "Bài viết"}
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight max-w-4xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-5 text-sm text-white/70">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {formatDate(post.publishedAt.toISOString())}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {readingTime} phút đọc
            </span>
            <span>Bởi <strong className="text-white">APLUS Technologies</strong></span>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-white py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            {post.coverImage && (
              <div className="relative aspect-[16/9] bg-[#B5DBFF]/40 rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <article
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Chia sẻ bài viết:</span>
              <div className="flex gap-2">
                {[Facebook, Twitter, Link2].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-[#006EF5] hover:text-white hover:border-[#006EF5] transition-colors">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[#F2F3F4] py-16">
          <Container>
            <h2 className="text-2xl font-bold text-[#102590] mb-8">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group bg-white rounded-lg border border-gray-100 hover:border-[#006EF5] overflow-hidden transition-all"
                >
                  {p.coverImage && (
                    <div className="relative aspect-[16/10] bg-[#B5DBFF]/40 overflow-hidden">
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[#111827] line-clamp-2 group-hover:text-[#006EF5] transition-colors">
                      {p.title}
                    </h3>
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
