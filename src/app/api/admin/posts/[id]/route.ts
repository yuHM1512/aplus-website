import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  if (!body.title || !body.slug || !body.content) {
    return NextResponse.json(
      { error: "Tiêu đề, slug và nội dung là bắt buộc" },
      { status: 400 }
    )
  }

  const existing = await prisma.post.findUnique({ where: { slug: body.slug } })
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 })
  }

  try {
    // Xử lý logic publishedAt
    let publishedAt = undefined
    if (body.published) {
      // Nếu publish ngay → set publishedAt = now (trừ khi đã có)
      const current = await prisma.post.findUnique({ where: { id } })
      publishedAt = current?.publishedAt || new Date()
    } else {
      publishedAt = null
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        published: body.published,
        publishedAt,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        categoryId: body.categoryId || null,
        campaignId: body.campaignId || null,
        aiGenerated: body.aiGenerated,
      },
    })

    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 })
  }
}
