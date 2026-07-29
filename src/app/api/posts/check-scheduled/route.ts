import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * Public endpoint — tự động publish bài viết đã hẹn giờ.
 * Được gọi mỗi khi có visitor truy cập trang public (check-on-visit).
 * Thay thế cron job, phù hợp Vercel Hobby plan.
 *
 * Tối ưu: chỉ query nhẹ, không ảnh hưởng tốc độ tải trang.
 */
export async function POST() {
  try {
    const now = new Date()

    // Tìm và publish tất cả bài viết đến hạn (1 query duy nhất)
    const result = await prisma.post.updateMany({
      where: {
        published: false,
        scheduledAt: {
          not: null,
          lte: now,
        },
      },
      data: {
        published: true,
        publishedAt: now,
        scheduledAt: null,
      },
    })

    return NextResponse.json({ published: result.count })
  } catch {
    // Silent fail — không ảnh hưởng trải nghiệm visitor
    return NextResponse.json({ published: 0 })
  }
}
