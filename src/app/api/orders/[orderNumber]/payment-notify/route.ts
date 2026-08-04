import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendPaymentNotifyToAdmin } from "@/lib/mailer"

// POST /api/orders/[orderNumber]/payment-notify
// Khách bấm "Tôi đã chuyển khoản" trên trang xác nhận
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
    })

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 })
    }

    if (order.paymentMethod !== "bank_transfer") {
      return NextResponse.json(
        { error: "Đơn hàng này không phải thanh toán chuyển khoản" },
        { status: 400 }
      )
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Đơn hàng đã được xác nhận thanh toán" },
        { status: 400 }
      )
    }

    // Prevent duplicate notifies (cool-down 5 phút)
    if (order.paymentNotifiedAt) {
      const elapsed = Date.now() - order.paymentNotifiedAt.getTime()
      if (elapsed < 5 * 60 * 1000) {
        return NextResponse.json(
          {
            success: true,
            alreadyNotified: true,
            notifiedAt: order.paymentNotifiedAt,
          },
          { status: 200 }
        )
      }
    }

    const updated = await prisma.order.update({
      where: { orderNumber },
      data: { paymentNotifiedAt: new Date() },
    })

    // Await email để Vercel serverless không kill trước khi gửi xong
    await sendPaymentNotifyToAdmin({
      orderNumber: updated.orderNumber,
      fullName: updated.fullName,
      phone: updated.phone,
      total: updated.total,
    }).catch((err) => console.error("[payment-notify] email error:", err))

    return NextResponse.json({
      success: true,
      notifiedAt: updated.paymentNotifiedAt,
    })
  } catch (error) {
    console.error("[payment-notify] Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// GET — kiểm tra trạng thái notify (dùng cho trang xác nhận đơn khi refresh)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      paymentStatus: true,
      paymentNotifiedAt: true,
    },
  })

  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 })
  }

  return NextResponse.json({
    paymentStatus: order.paymentStatus,
    notifiedAt: order.paymentNotifiedAt,
  })
}
