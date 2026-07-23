"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ConfirmDialog } from "./confirm-dialog"
import { useToast } from "./toast"

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" })
    setOpen(false)
    if (res.ok) {
      toast("Đã xoá bài viết thành công")
    } else {
      toast("Không thể xoá bài viết", "error")
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
        title="Xoá bài viết"
        message={`Bạn có chắc muốn xoá bài viết "${title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xoá"
        loading={loading}
      />
    </>
  )
}
