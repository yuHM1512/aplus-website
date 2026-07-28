// ─── Sapo → Web: Đồng bộ trạng thái đơn hàng ──────────
// Dùng cho cả cron poll (tự động) và nút sync (thủ công)
// Server-side only.

import { prisma } from "@/lib/prisma"
import { getOrders as getSapoOrders, getOrder as getSapoOrder } from "@/lib/sapo"

// ─── Status Mapping ────────────────────────────────────
// Sapo dùng 2 trục: financial_status + fulfillment_status
// Web dùng: status (pending/confirmed/shipping/delivered/cancelled) + paymentStatus (unpaid/paid)

/**
 * Map Sapo financial_status → Web paymentStatus
 * Sapo: pending | authorized | paid | partially_paid | partially_refunded | refunded | voided
 */
function mapPaymentStatus(sapoFinancial: string | null | undefined): "unpaid" | "paid" {
  if (!sapoFinancial) return "unpaid"
  const paidStatuses = ["paid", "partially_refunded"]
  return paidStatuses.includes(sapoFinancial) ? "paid" : "unpaid"
}

/**
 * Map Sapo fulfillment_status + financial_status → Web order status
 * Sapo fulfillment: null | partial | fulfilled
 * Sapo cũng có cancelled_on (check qua order.cancelled_on hoặc status)
 */
function mapOrderStatus(
  sapoFulfillment: string | null | undefined,
  sapoFinancial: string | null | undefined,
  sapoCancelled: boolean
): string {
  // Đơn bị huỷ
  if (sapoCancelled) return "cancelled"

  // Đã giao xong
  if (sapoFulfillment === "fulfilled") return "delivered"

  // Đang giao (có fulfillment 1 phần)
  if (sapoFulfillment === "partial") return "shipping"

  // Chưa giao — phân biệt confirmed vs pending bằng financial_status
  // Nếu đã thanh toán (hoặc COD đã xác nhận) → confirmed
  // Nếu chưa → pending
  if (sapoFinancial === "paid" || sapoFinancial === "authorized") {
    return "confirmed"
  }

  return "pending"
}

// ─── Sync Result ───────────────────────────────────────

export interface SyncResult {
  total: number       // Tổng đơn kiểm tra
  updated: number     // Số đơn cập nhật
  skipped: number     // Không thay đổi
  errors: string[]    // Lỗi (nếu có)
}

// ─── Sync tất cả đơn website có sapoOrderId ────────────

/**
 * Poll Sapo để lấy trạng thái mới nhất cho tất cả đơn website
 * chưa hoàn thành (status != delivered && status != cancelled).
 * Gọi từ cron mỗi 5-10 phút, hoặc từ nút sync thủ công.
 */
export async function syncAllOrdersFromSapo(): Promise<SyncResult> {
  const result: SyncResult = { total: 0, updated: 0, skipped: 0, errors: [] }

  // Chỉ sync đơn chưa kết thúc VÀ đã push sang Sapo
  const localOrders = await prisma.order.findMany({
    where: {
      sapoOrderId: { not: null },
      status: { notIn: ["delivered", "cancelled"] },
    },
    select: {
      id: true,
      sapoOrderId: true,
      status: true,
      paymentStatus: true,
      sapoFinancialStatus: true,
      sapoFulfillmentStatus: true,
    },
  })

  result.total = localOrders.length
  if (localOrders.length === 0) return result

  for (const local of localOrders) {
    try {
      const synced = await syncSingleOrder(local.id, local.sapoOrderId!)
      if (synced) result.updated++
      else result.skipped++
    } catch (e) {
      const msg = `Order ${local.id} (Sapo #${local.sapoOrderId}): ${e instanceof Error ? e.message : String(e)}`
      result.errors.push(msg)
      console.error(`[sapo-sync] ${msg}`)
    }
  }

  return result
}

/**
 * Sync 1 đơn cụ thể từ Sapo → Web.
 * Returns true nếu có cập nhật, false nếu không thay đổi.
 */
export async function syncSingleOrder(localOrderId: string, sapoOrderId: number): Promise<boolean> {
  // Fetch từ Sapo
  const sapoOrder = await getSapoOrder(sapoOrderId)
  if (!sapoOrder) {
    throw new Error("Đơn không tồn tại trên Sapo")
  }

  const isCancelled = !!sapoOrder.cancelled_on
  const newStatus = mapOrderStatus(
    sapoOrder.fulfillment_status || null,
    sapoOrder.financial_status || null,
    isCancelled
  )
  const newPaymentStatus = mapPaymentStatus(sapoOrder.financial_status)

  // Đọc local hiện tại
  const local = await prisma.order.findUnique({
    where: { id: localOrderId },
    select: { status: true, paymentStatus: true, sapoFinancialStatus: true, sapoFulfillmentStatus: true },
  })
  if (!local) throw new Error("Đơn local không tồn tại")

  // So sánh — chỉ update nếu có thay đổi
  const hasChange =
    local.status !== newStatus ||
    local.paymentStatus !== newPaymentStatus ||
    local.sapoFinancialStatus !== (sapoOrder.financial_status || null) ||
    local.sapoFulfillmentStatus !== (sapoOrder.fulfillment_status || null)

  if (!hasChange) return false

  await prisma.order.update({
    where: { id: localOrderId },
    data: {
      status: newStatus,
      paymentStatus: newPaymentStatus,
      sapoFinancialStatus: sapoOrder.financial_status || null,
      sapoFulfillmentStatus: sapoOrder.fulfillment_status || null,
      lastSyncedAt: new Date(),
    },
  })

  console.log(
    `[sapo-sync] ${localOrderId}: ${local.status}→${newStatus}, payment: ${local.paymentStatus}→${newPaymentStatus}`
  )
  return true
}

/**
 * Sync 1 đơn theo localOrderId (lookup sapoOrderId tự động).
 * Dùng cho nút "Đồng bộ Sapo" trên UI.
 */
export async function syncOrderById(localOrderId: string): Promise<{
  success: boolean
  updated: boolean
  error?: string
}> {
  const order = await prisma.order.findUnique({
    where: { id: localOrderId },
    select: { sapoOrderId: true },
  })

  if (!order) return { success: false, updated: false, error: "Đơn không tồn tại" }
  if (!order.sapoOrderId) return { success: false, updated: false, error: "Đơn chưa được đẩy sang Sapo" }

  try {
    const updated = await syncSingleOrder(localOrderId, order.sapoOrderId)
    return { success: true, updated }
  } catch (e) {
    return { success: false, updated: false, error: e instanceof Error ? e.message : String(e) }
  }
}
