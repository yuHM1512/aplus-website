// GET /api/cron/sync-sapo-orders — Auto poll Sapo mỗi 5 phút
// Gọi bởi Vercel Cron Jobs (vercel.json cấu hình schedule)
// Xác thực bằng CRON_SECRET header

import { NextRequest, NextResponse } from "next/server"
import { syncAllOrdersFromSapo } from "@/lib/sapo-sync-orders"

export async function GET(req: NextRequest) {
  // Xác thực — Vercel gửi header Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await syncAllOrdersFromSapo()
    console.log(
      `[cron/sync-sapo] Done: ${result.updated}/${result.total} updated, ${result.errors.length} errors`
    )
    return NextResponse.json({ success: true, ...result })
  } catch (e) {
    console.error("[cron/sync-sapo] Fatal:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Sync failed" },
      { status: 500 }
    )
  }
}
