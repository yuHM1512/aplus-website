"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ConfirmDialog } from "./confirm-dialog"

export function DeletePopupButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    await fetch(`/api/admin/popups/${id}`, { method: "DELETE" })
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Xóa popup"
        message={`Bạn có chắc muốn xóa popup "${name}"?`}
        confirmText={loading ? "Đang xóa..." : "Xóa"}
        variant="danger"
      />
    </>
  )
}
