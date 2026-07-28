// ─── Helper: Đẩy 1 đơn hàng APLUS → SAPO ────────────────
// Dùng chung cho: checkout tự động (/api/orders) và nút đẩy thủ công (admin)
// Server-side only.

import { prisma } from "@/lib/prisma"
import { createOrder, findCustomer, createCustomer } from "@/lib/sapo"
import type { SapoLineItem, SapoAddress, SapoShippingLine } from "@/lib/sapo"

export interface PushResult {
  success: boolean
  skipped?: boolean          // true = bỏ qua vì chưa cấu hình SAPO (không tính là lỗi)
  sapoOrderId?: number
  sapoOrderNumber?: number
  error?: string
}

/** SAPO đã cấu hình đủ credentials chưa? */
function isSapoConfigured() {
  return Boolean(
    process.env.SAPO_API_KEY &&
    process.env.SAPO_API_SECRET &&
    process.env.SAPO_STORE
  )
}

/**
 * Đẩy đơn hàng (theo orderId) sang SAPO.
 * KHÔNG throw — luôn trả PushResult để caller tự quyết định.
 * Đơn local vẫn được giữ nguyên dù đẩy thất bại (không mất đơn khách).
 */
export async function pushOrderToSapo(orderId: string): Promise<PushResult> {
  // Guard: chưa cấu hình key → bỏ qua êm, không coi là lỗi
  if (!isSapoConfigured()) {
    return { success: false, skipped: true, error: "SAPO chưa cấu hình (thiếu API key/secret)" }
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })
  if (!order) {
    return { success: false, error: "Không tìm thấy đơn hàng" }
  }

  // ── 1. Map line items — cần sapoVariantId lưu trong product.specs ──
  const lineItems: SapoLineItem[] = []
  const missing: string[] = []

  for (const item of order.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })

    let sapoVariantId: number | null = null
    if (product?.specs) {
      try {
        sapoVariantId = JSON.parse(product.specs).sapoVariantId || null
      } catch {
        // specs không phải JSON hợp lệ — bỏ qua
      }
    }

    if (!sapoVariantId) {
      missing.push(item.productName)
      continue
    }

    lineItems.push({
      variant_id: sapoVariantId,
      quantity: item.quantity,
      price: item.price,
      title: item.productName,
    })
  }

  if (lineItems.length === 0) {
    return {
      success: false,
      error: `Không sản phẩm nào có sapoVariantId (${missing.join(", ")}). Hãy chạy "Đồng bộ Sapo" trước.`,
    }
  }

  // ── 2. Tìm hoặc tạo khách hàng (không bắt buộc — lỗi thì vẫn tạo đơn) ──
  let sapoCustomerId: number | undefined
  try {
    const existing = await findCustomer(order.phone)
    if (existing.length > 0 && existing[0].id) {
      sapoCustomerId = existing[0].id
    } else {
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
  } catch (e) {
    console.error("[sapo] Không xử lý được khách hàng, tạo đơn không gắn customer:", e)
  }

  // ── 3. Build địa chỉ giao + phí ship ──
  const shippingAddress: SapoAddress = {
    address1: order.address,
    ward: order.ward,
    city: order.district,
    province: order.province,
    phone: order.phone,
    first_name: order.fullName,
    last_name: "",
  }

  const shippingLines: SapoShippingLine[] =
    order.shippingFee > 0
      ? [{ title: "Phí vận chuyển", price: order.shippingFee, code: "standard" }]
      : []

  // ── 4. Tạo đơn trong SAPO ──
  try {
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
      financial_status: order.paymentStatus === "paid" ? "paid" : "pending",
      shipping_lines: shippingLines,
      tags: `aplus-website,${order.orderNumber}`,
      source_name: "APLUS Website",
    })

    // Lưu Sapo order ID vào DB để sync trạng thái ngược
    await prisma.order.update({
      where: { id: orderId },
      data: {
        sapoOrderId: sapoOrder.id,
        sapoOrderNumber: sapoOrder.order_number,
        sapoFinancialStatus: sapoOrder.financial_status || null,
        sapoFulfillmentStatus: sapoOrder.fulfillment_status || null,
        lastSyncedAt: new Date(),
      },
    })

    return {
      success: true,
      sapoOrderId: sapoOrder.id,
      sapoOrderNumber: sapoOrder.order_number,
    }
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) }
  }
}
