import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/posts/[slug]/view
 * Tăng lượt xem cho bài viết — gọi từ client khi user đọc bài
 */
export async function POST(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    await prisma.post.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }
}
