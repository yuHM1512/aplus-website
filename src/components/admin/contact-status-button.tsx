"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, CheckCircle } from "lucide-react"
import { useToast } from "./toast"

export function ContactStatusButton({ id, currentStatus }: { id: string; currentStatus: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const nextStatus = currentStatus === "new" ? "read" : currentStatus === "read" ? "replied" : null

  if (!nextStatus) return <span className="text-xs text-gray-400">Hoàn tất</span>

  const statusLabels: Record<string, string> = { read: "Đã đánh dấu đã xem", replied: "Đã đánh dấu đã trả lời" }

  const handleUpdate = async () => {
    setLoading(true)
    await fetch(`/api/admin/contacts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    })
    toast(statusLabels[nextStatus] || "Đã cập nhật")
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleUpdate}
      disabled={loading}
      className="p-2 text-gray-400 hover:text-ocean-blue hover:bg-ocean-blue/5 rounded-lg transition-colors disabled:opacity-50"
      title={nextStatus === "read" ? "Đánh dấu đã xem" : "Đánh dấu đã trả lời"}
    >
      {nextStatus === "read" ? <Eye className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
    </button>
  )
}
