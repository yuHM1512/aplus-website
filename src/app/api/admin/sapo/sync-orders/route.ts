// POST /api/admin/sapo/sync-orders — Manual sync all active orders from Sapo
// POST /api/admin/sapo/sync-orders?orderId=xxx — Sync single order

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { syncAllOrdersFromSapo, syncOrderById } from "@/lib/sapo-sync-orders"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get("orderId")

  // Sync single order
  if (orderId) {
    const result = await syncOrderById(orderId)
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json({
      success: true,
      updated: result.updated,
      message: result.updated
        ? "Đã cập nhật trạng thái từ Sapo"
        : "Trạng thái không thay đổi",
    })
  }

  // Sync all active orders
  const result = await syncAllOrdersFromSapo()
  return NextResponse.json({
    success: true,
    ...result,
    message: `Đồng bộ ${result.total} đơn: ${result.updated} cập nhật, ${result.skipped} không đổi${
      result.errors.length > 0 ? `, ${result.errors.length} lỗi` : ""
    }`,
  })
}
