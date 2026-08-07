import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
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

    return NextResponse.json({ success: true, published: result.count })
  } catch (e) {
    console.error("[cron/publish-scheduled-posts] Fatal:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Publish scheduled posts failed" },
      { status: 500 }
    )
  }
}
