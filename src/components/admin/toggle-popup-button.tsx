"use client"

import { useState } from "react"
import { Power, PowerOff } from "lucide-react"
import { useRouter } from "next/navigation"

export function TogglePopupButton({ id, active }: { id: string; active: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    setLoading(true)
    // Lấy popup hiện tại rồi toggle active
    const res = await fetch(`/api/admin/popups/${id}`)
    if (res.ok) {
      const popup = await res.json()
      await fetch(`/api/admin/popups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...popup, active: !active }),
      })
    }
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? "text-emerald-500 hover:text-red-500 hover:bg-red-50"
          : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
      }`}
      title={active ? "Tắt popup" : "Bật popup"}
    >
      {active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
    </button>
  )
}
