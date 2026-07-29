import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * API endpoint tự động xuất bản bài viết đã lên lịch.
 * Gọi bằng cron job (Vercel Cron hoặc external) mỗi phút.
 *
 * Cách dùng:
 * - Vercel cron: thêm vào vercel.json → crons
 * - External: GET /api/admin/posts/publish-scheduled?key=CRON_SECRET
 */
export async function GET(req: NextRequest) {
  // Verify cron secret (tùy chọn - bảo vệ endpoint)
  const cronSecret = process.env.CRON_SECRET
  const key = req.nextUrl.searchParams.get("key")

  if (cronSecret && key !== cronSecret) {
    // Nếu có CRON_SECRET trong env, yêu cầu key khớp
    // Nếu không set CRON_SECRET, cho phép gọi tự do (dev mode)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date()

  // Tìm bài viết đã lên lịch và đến giờ xuất bản
  const scheduledPosts = await prisma.post.findMany({
    where: {
      published: false,
      scheduledAt: {
        not: null,
        lte: now,
      },
    },
  })

  if (scheduledPosts.length === 0) {
    return NextResponse.json({ published: 0, message: "Không có bài viết cần xuất bản" })
  }

  // Xuất bản tất cả bài viết đã đến lịch
  const result = await prisma.post.updateMany({
    where: {
      id: { in: scheduledPosts.map((p: { id: string }) => p.id) },
    },
    data: {
      published: true,
      publishedAt: now,
      scheduledAt: null,
    },
  })

  return NextResponse.json({
    published: result.count,
    message: `Đã xuất bản ${result.count} bài viết`,
    posts: scheduledPosts.map((p: { id: string; title: string }) => ({ id: p.id, title: p.title })),
  })
}
