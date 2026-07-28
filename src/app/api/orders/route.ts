import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// ─── Validation ─────────────────────────────────────────
const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productImage: z.string().nullable(),
  productSlug: z.string().nullable(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
})

const orderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),
  address: z.string().min(3),
  note: z.string().optional(),
  paymentMethod: z.enum(["bank_transfer", "cod"]),
  items: z.array(orderItemSchema).min(1, "Giỏ hàng không được trống"),
  subtotal: z.number().int(),
  shippingFee: z.number().int(),
  total: z.number().int(),
})

// ─── Generate order number: APL-YYYYMMDD-XXX ───────────
async function generateOrderNumber(): Promise<string> {
  const today = new Date()
  const dateStr =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0")

  const prefix = `APL-${dateStr}-`

  // Count today's orders to get sequence
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 86400000)

  const count = await prisma.order.count({
    where: {
      createdAt: { gte: startOfDay, lt: endOfDay },
    },
  })

  const seq = String(count + 1).padStart(3, "0")
  return `${prefix}${seq}`
}

// ─── POST /api/orders ──────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = orderSchema.parse(body)

    // Verify totals server-side
    const calcSubtotal = data.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    )
    if (calcSubtotal !== data.subtotal) {
      return NextResponse.json(
        { error: "Tổng tiền không khớp, vui lòng thử lại" },
        { status: 400 }
      )
    }

    const orderNumber = await generateOrderNumber()

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: "pending",
        paymentMethod: data.paymentMethod,
        paymentStatus: "unpaid",
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        province: data.province,
        district: data.district,
        ward: data.ward,
        address: data.address,
        note: data.note || null,
        subtotal: data.subtotal,
        shippingFee: data.shippingFee,
        total: data.total,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            productImage: i.productImage,
            productSlug: i.productSlug,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      },
    })

    // TODO: Gửi email xác nhận qua Nodemailer (Phase 1.1)
    console.log(`[order] Created: ${order.orderNumber} — ${data.fullName} — ${data.total}đ`)

    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        id: order.id,
        total: order.total,
        paymentMethod: order.paymentMethod,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: error.issues },
        { status: 400 }
      )
    }
    console.error("[order] Error:", error)
    return NextResponse.json(
      { error: "Đã có lỗi xảy ra, vui lòng thử lại sau" },
      { status: 500 }
    )
  }
}
