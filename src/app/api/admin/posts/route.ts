import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "" // all | draft | published | scheduled
  const categoryId = searchParams.get("categoryId") || ""
  const campaignId = searchParams.get("campaignId") || ""
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  // Build where clause
  const where: Record<string, unknown> = {}

  if (search) {
    where.title = { contains: search, mode: "insensitive" }
  }

  if (status === "draft") {
    where.published = false
    where.scheduledAt = null
  } else if (status === "published") {
    where.published = true
  } else if (status === "scheduled") {
    where.published = false
    where.scheduledAt = { not: null }
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  if (campaignId) {
    where.campaignId = campaignId
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true, campaign: true },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const {
    title,
    slug,
    excerpt,
    content,
    coverImage,
    published,
    scheduledAt,
    categoryId,
    campaignId,
    aiGenerated,
    aiPrompt,
  } = body

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "Tiêu đề, slug và nội dung là bắt buộc" },
      { status: 400 }
    )
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
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      categoryId: categoryId || null,
      campaignId: campaignId || null,
      aiGenerated,
      aiPrompt,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
