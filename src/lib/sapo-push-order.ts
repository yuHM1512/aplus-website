// ─── Helper: Đẩy 1 đơn hàng APLUS → SAPO ────────────────
// Dùng chung cho: checkout tự động (/api/orders) và nút đẩy thủ công (admin)
// Server-side only.

import { prisma } from "@/lib/prisma"
import { createOrder, findCustomer, createCustomer, updateCustomer } from "@/lib/sapo"
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

  // ── 2. Tách họ & tên (Sapo yêu cầu first_name + last_name) ──
  const nameParts = (order.fullName || "").trim().split(/\s+/)
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : nameParts[0] || ""
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""

  // ── 3. Tìm hoặc tạo khách hàng (không bắt buộc — lỗi thì vẫn tạo đơn) ──
  let sapoCustomerId: number | undefined
  try {
    const existing = await findCustomer(order.phone)
    if (existing.length > 0 && existing[0].id) {
      sapoCustomerId = existing[0].id
      // Cập nhật tên nếu customer cũ chưa có tên (tránh Sapo hiện SĐT)
      if (!existing[0].first_name && !existing[0].last_name) {
        await updateCustomer(existing[0].id, {
          first_name: firstName,
          last_name: lastName,
        })
      }
    } else {
      const newCustomer = await createCustomer({
        first_name: firstName,
        last_name: lastName,
        email: order.email || undefined,
        phone: order.phone,
        addresses: [
          {
            address1: order.address,
            ward: order.ward,
            city: order.district,
            province: order.province,
            phone: order.phone,
            first_name: firstName,
            last_name: lastName,
            default: true,
          },
        ],
      })
      sapoCustomerId = newCustomer.id
    }
  } catch (e) {
    console.error("[sapo] Không xử lý được khách hàng, tạo đơn không gắn customer:", e)
  }

  // ── 4. Build địa chỉ giao + billing + phí ship ──
  const shippingAddress: SapoAddress = {
    address1: order.address,
    ward: order.ward,
    city: order.district,
    province: order.province,
    phone: order.phone,
    first_name: firstName,
    last_name: lastName,
  }

  // Billing address = shipping address (Sapo dùng billing để hiện tên khách hàng)
  const billingAddress: SapoAddress = { ...shippingAddress }

  const shippingLines: SapoShippingLine[] =
    order.shippingFee > 0
      ? [{ title: "Phí vận chuyển", price: order.shippingFee, code: "standard" }]
      : []

  // ── 5. Tạo đơn trong SAPO ──
  try {
    const sapoOrder = await createOrder({
      line_items: lineItems,
      // Truyền cả id lẫn tên — Sapo dùng id để link, tên để hiển thị
      customer: sapoCustomerId
        ? { id: sapoCustomerId, first_name: firstName, last_name: lastName }
        : { first_name: firstName, last_name: lastName, email: order.email || undefined, phone: order.phone },
      shipping_address: shippingAddress,
      billing_address: billingAddress,
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
      confirmed_at: new Date().toISOString(),
      shipping_lines: shippingLines,
      tags: `aplus-website,${order.orderNumber}`,
      source_name: "web",
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
