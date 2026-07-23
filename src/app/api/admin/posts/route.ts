import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, slug, excerpt, content, coverImage, published, categoryId, aiGenerated, aiPrompt } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Tiêu đề, slug và nội dung là bắt buộc" }, { status: 400 })
  }

  const existing = await prisma.post.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 })
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      publishedAt: published ? new Date() : null,
      categoryId: categoryId || null,
      aiGenerated,
      aiPrompt,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
