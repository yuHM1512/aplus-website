"use client"

import { useState } from "react"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface SyncResult {
  success: boolean
  summary?: {
    total: number
    created: number
    updated: number
    skipped: number
    errors: number
  }
  error?: string
}

export function SapoSyncButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)

  async function handleSync() {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/admin/sapo/sync-products", {
        method: "POST",
      })
      const data = await res.json()

      if (!res.ok) {
        setResult({ success: false, error: data.error || "Lỗi không xác định" })
      } else {
        setResult(data)
      }
    } catch {
      setResult({ success: false, error: "Không kết nối được server" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={loading}
        className="w-full flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-3">
          <RefreshCw className={`w-5 h-5 text-emerald-600 group-hover:text-white ${loading ? "animate-spin" : ""}`} />
          <span className="text-sm font-bold">
            {loading ? "Đang đồng bộ..." : "Đồng bộ Sapo"}
          </span>
        </div>
      </button>

      {result && (
        <div className={`mt-2 p-3 rounded-lg text-xs ${result.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {result.success && result.summary ? (
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Đồng bộ thành công!</p>
                <p className="mt-1">
                  Tổng: {result.summary.total} · Mới: {result.summary.created} · Cập nhật: {result.summary.updated}
                  {result.summary.skipped > 0 && ` · Bỏ qua: ${result.summary.skipped}`}
                  {result.summary.errors > 0 && ` · Lỗi: ${result.summary.errors}`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Lỗi đồng bộ</p>
                <p className="mt-1">{result.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
