"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, ExternalLink } from "lucide-react"

interface SapoOrderSyncProps {
  orderId: string
  sapoOrderId: number | null
  sapoOrderNumber: number | null
  lastSyncedAt: string | null
  sapoFinancialStatus: string | null
  sapoFulfillmentStatus: string | null
}

const SAPO_STORE = process.env.NEXT_PUBLIC_SAPO_STORE || ""

export function SapoOrderSync({
  orderId,
  sapoOrderId,
  sapoOrderNumber,
  lastSyncedAt,
  sapoFinancialStatus,
  sapoFulfillmentStatus,
}: SapoOrderSyncProps) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState("")

  const handleSync = async () => {
    setSyncing(true)
    setMessage("")
    try {
      const res = await fetch(`/api/admin/sapo/sync-orders?orderId=${orderId}`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || "Đồng bộ thất bại")
      } else {
        setMessage(data.message)
        router.refresh()
      }
    } catch {
      setMessage("Lỗi kết nối")
    } finally {
      setSyncing(false)
    }
  }

  const handlePush = async () => {
    setSyncing(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/sapo/push-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || "Đẩy đơn thất bại")
      } else {
        setMessage(data.message)
        router.refresh()
      }
    } catch {
      setMessage("Lỗi kết nối")
    } finally {
      setSyncing(false)
    }
  }

  const formatSyncTime = (date: string) =>
    new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })

  const financialLabels: Record<string, string> = {
    pending: "Chưa TT",
    paid: "Đã TT",
    refunded: "Hoàn tiền",
    partially_paid: "TT 1 phần",
    authorized: "Đã xác thực",
  }

  const fulfillmentLabels: Record<string, string> = {
    fulfilled: "Đã giao",
    partial: "Giao 1 phần",
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
        Sapo
      </h3>

      {sapoOrderId ? (
        <>
          {/* Sapo info */}
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Mã Sapo</span>
              <span className="font-semibold text-gray-900">
                #{sapoOrderNumber || sapoOrderId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Thanh toán</span>
              <span className="font-medium text-gray-700">
                {financialLabels[sapoFinancialStatus || ""] || sapoFinancialStatus || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Giao hàng</span>
              <span className="font-medium text-gray-700">
                {fulfillmentLabels[sapoFulfillmentStatus || ""] || sapoFulfillmentStatus || "Chưa giao"}
              </span>
            </div>
            {lastSyncedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Sync lúc</span>
                <span className="text-xs text-gray-400">{formatSyncTime(lastSyncedAt)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              disabled={syncing}
              onClick={handleSync}
              className="w-full h-9 flex items-center justify-center gap-2 bg-[#eff4ff] text-[#102590] rounded-md text-sm font-semibold hover:bg-[#dde6ff] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
              Đồng bộ từ Sapo
            </button>

            {SAPO_STORE && (
              <a
                href={`https://${SAPO_STORE}.mysapo.net/admin/orders/${sapoOrderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-9 flex items-center justify-center gap-2 border border-[#E2E8F0] rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Mở trên Sapo
              </a>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">Đơn chưa được đẩy sang Sapo</p>
          <button
            disabled={syncing}
            onClick={handlePush}
            className="w-full h-9 flex items-center justify-center gap-2 bg-[#102590] text-white rounded-md text-sm font-semibold hover:bg-[#006EF5] transition-colors disabled:opacity-50"
          >
            {syncing ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              "Đẩy sang Sapo"
            )}
          </button>
        </>
      )}

      {/* Message */}
      {message && (
        <p className={`mt-3 text-xs ${message.includes("thất bại") || message.includes("Lỗi") ? "text-red-500" : "text-emerald-600"}`}>
          {message}
        </p>
      )}
    </div>
  )
}

/**
 * Nút sync tất cả đơn — dùng ở trang danh sách đơn hàng
 */
export function SapoSyncAllButton() {
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState("")

  const handleSyncAll = async () => {
    setSyncing(true)
    setResult("")
    try {
      const res = await fetch("/api/admin/sapo/sync-orders", { method: "POST" })
      const data = await res.json()
      setResult(data.message || "Hoàn tất")
    } catch {
      setResult("Lỗi kết nối")
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={syncing}
        onClick={handleSyncAll}
        className="inline-flex items-center gap-2 px-4 h-10 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
        Đồng bộ Sapo
      </button>
      {result && <span className="text-xs text-gray-500">{result}</span>}
    </div>
  )
}
