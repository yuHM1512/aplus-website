"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ConfirmDialog } from "./confirm-dialog"
import { useToast } from "./toast"

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    setOpen(false)
    if (res.ok) {
      toast("Đã xoá sản phẩm thành công")
    } else {
      toast("Không thể xoá sản phẩm", "error")
    }
    router.refresh()
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title="Xoá sản phẩm"
        message={`Bạn có chắc muốn xoá sản phẩm "${name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xoá"
        loading={loading}
      />
    </>
  )
}
