"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const STATUS_FLOW = ["pending", "confirmed", "shipping", "delivered"] as const
const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Xác nhận",
  shipping: "Giao hàng",
  delivered: "Đã giao",
  cancelled: "Hủy đơn",
}

export function OrderStatusButtons({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const updateOrder = async (updates: Record<string, string>) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      alert("Cập nhật thất bại")
    } finally {
      setLoading(false)
    }
  }

  const currentIdx = STATUS_FLOW.indexOf(currentStatus as typeof STATUS_FLOW[number])
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIdx + 1]
    : null

  return (
    <div className="flex flex-col gap-2">
      {/* Next status */}
      {nextStatus && currentStatus !== "cancelled" && (
        <button
          disabled={loading}
          onClick={() => updateOrder({ status: nextStatus })}
          className="w-full h-10 bg-[#102590] text-white rounded-md text-sm font-semibold hover:bg-[#006EF5] transition-colors disabled:opacity-50"
        >
          → {STATUS_LABELS[nextStatus]}
        </button>
      )}

      {/* Toggle payment */}
      {currentPaymentStatus === "unpaid" && currentStatus !== "cancelled" && (
        <button
          disabled={loading}
          onClick={() => updateOrder({ paymentStatus: "paid" })}
          className="w-full h-10 bg-emerald-600 text-white rounded-md text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
        >
          Xác nhận đã thanh toán
        </button>
      )}

      {/* Cancel */}
      {currentStatus !== "cancelled" && currentStatus !== "delivered" && (
        <button
          disabled={loading}
          onClick={() => {
            if (confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
              updateOrder({ status: "cancelled" })
            }
          }}
          className="w-full h-10 border border-red-300 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Hủy đơn hàng
        </button>
      )}
    </div>
  )
}
