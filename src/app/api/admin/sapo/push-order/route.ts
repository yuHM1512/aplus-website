// src/app/api/admin/sapo/push-order/route.ts
// Đẩy 1 đơn hàng APLUS → SAPO thủ công (dùng helper chung)

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pushOrderToSapo } from "@/lib/sapo-push-order"

// POST /api/admin/sapo/push-order
// Body: { orderId: string }
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { orderId } = await req.json()
  if (!orderId) {
    return NextResponse.json({ error: "orderId là bắt buộc" }, { status: 400 })
  }

  const result = await pushOrderToSapo(orderId)

  if (result.success) {
    return NextResponse.json({
      success: true,
      sapoOrderId: result.sapoOrderId,
      sapoOrderNumber: result.sapoOrderNumber,
      message: `Đã tạo đơn #${result.sapoOrderNumber} trên SAPO. Tồn kho đã được cập nhật tự động.`,
    })
  }

  return NextResponse.json(
    { error: result.error || "Đẩy đơn sang SAPO thất bại" },
    { status: result.skipped ? 400 : 500 }
  )
}
