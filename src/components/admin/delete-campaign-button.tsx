"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "./confirm-dialog"

export function DeleteCampaignButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" })
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Xóa
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Xóa chiến dịch"
        message={`Bạn có chắc muốn xóa chiến dịch "${name}"? Các bài viết và popup sẽ được gỡ khỏi chiến dịch nhưng không bị xóa.`}
        confirmText={loading ? "Đang xóa..." : "Xóa"}
        variant="danger"
      />
    </>
  )
}
