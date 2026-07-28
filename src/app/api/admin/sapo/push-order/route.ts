// src/app/api/admin/sapo/push-order/route.ts
// Đẩy đơn hàng từ APLUS → Sapo (tạo đơn + tự động trừ kho)

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createOrder, findCustomer, createCustomer } from "@/lib/sapo"
import type { SapoLineItem, SapoAddress, SapoShippingLine } from "@/lib/sapo"

// POST /api/admin/sapo/push-order
// Body: { orderId: string }  — ID đơn hàng APLUS cần đẩy lên Sapo
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "orderId là bắt buộc" }, { status: 400 })
    }

    // 1. Lấy đơn hàng APLUS từ DB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 })
    }

    // 2. Map line items — cần variant_id từ Sapo
    //    Lấy từ specs.sapoVariantId đã lưu khi sync sản phẩm
    const lineItems: SapoLineItem[] = []

    for (const item of order.items) {
      // Tìm sản phẩm local để lấy sapoVariantId
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      let sapoVariantId: number | null = null
      if (product?.specs) {
        try {
          const specs = JSON.parse(product.specs)
          sapoVariantId = specs.sapoVariantId || null
        } catch {
          // specs không phải JSON — bỏ qua
        }
      }

      if (!sapoVariantId) {
        return NextResponse.json(
          {
            error: `Sản phẩm "${item.productName}" chưa được đồng bộ với Sapo (thiếu sapoVariantId). Hãy chạy Sync Products trước.`,
          },
          { status: 400 }
        )
      }

      lineItems.push({
        variant_id: sapoVariantId,
        quantity: item.quantity,
        price: item.price,
        title: item.productName,
      })
    }

    // 3. Tìm hoặc tạo khách hàng trong Sapo
    let sapoCustomerId: number | undefined
    const existingCustomers = await findCustomer(order.phone)

    if (existingCustomers.length > 0 && existingCustomers[0].id) {
      sapoCustomerId = existingCustomers[0].id
    } else {
      // Tạo khách hàng mới
      const newCustomer = await createCustomer({
        first_name: order.fullName,
        last_name: "",
        email: order.email || undefined,
        phone: order.phone,
        addresses: [
          {
            address1: order.address,
            ward: order.ward,
            city: order.district,
            province: order.province,
            phone: order.phone,
            first_name: order.fullName,
            last_name: "",
            default: true,
          },
        ],
      })
      sapoCustomerId = newCustomer.id
    }

    // 4. Build shipping address
    const shippingAddress: SapoAddress = {
      address1: order.address,
      ward: order.ward,
      city: order.district,
      province: order.province,
      phone: order.phone,
      first_name: order.fullName,
      last_name: "",
    }

    // 5. Shipping lines
    const shippingLines: SapoShippingLine[] = order.shippingFee > 0
      ? [{ title: "Phí vận chuyển", price: order.shippingFee, code: "standard" }]
      : []

    // 6. Tạo đơn hàng trong Sapo
    const sapoOrder = await createOrder({
      line_items: lineItems,
      customer: sapoCustomerId ? { id: sapoCustomerId } : undefined,
      shipping_address: shippingAddress,
      email: order.email || undefined,
      phone: order.phone,
      note: [
        order.note || "",
        `Đơn APLUS: ${order.orderNumber}`,
        `Thanh toán: ${order.paymentMethod === "bank_transfer" ? "Chuyển khoản" : "COD"}`,
      ]
        .filter(Boolean)
        .join(" | "),
      financial_status:
        order.paymentStatus === "paid" ? "paid" : "pending",
      shipping_lines: shippingLines,
      tags: `aplus-website,${order.orderNumber}`,
      source_name: "APLUS Website",
    })

    // 7. Lưu Sapo order ID vào note hoặc field mở rộng của đơn APLUS
    //    (Hiện tại Order model chưa có field sapoOrderId,
    //     nên tạm ghi vào note. Sau này nên thêm field riêng.)
    await prisma.order.update({
      where: { id: orderId },
      data: {
        note: [order.note, `[Sapo #${sapoOrder.id}]`].filter(Boolean).join(" | "),
      },
    })

    return NextResponse.json({
      success: true,
      sapoOrderId: sapoOrder.id,
      sapoOrderNumber: sapoOrder.order_number,
      message: `Đã tạo đơn #${sapoOrder.order_number} trên Sapo. Tồn kho đã được cập nhật tự động.`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: `Lỗi đẩy đơn lên Sapo: ${message}` },
      { status: 500 }
    )
  }
}
