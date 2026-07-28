"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Grid, List, Loader2 } from "lucide-react"

interface Props {
  totalCount: number
  view: "grid" | "list"
}

export function ProductsToolbar({ totalCount, view }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const currentSort = searchParams.get("sort") || "default"

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === null || value === "") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete("page") // reset pagination
    startTransition(() => {
      router.push(`/products?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">
          Hiển thị <span className="font-bold text-[#102590]">{totalCount}</span> sản phẩm
        </p>
        {pending && <Loader2 className="h-4 w-4 animate-spin text-[#006EF5]" />}
      </div>

      <div className="flex items-center gap-3">
        {/* View toggle */}
        <div className="hidden md:flex items-center border border-gray-200 rounded-md overflow-hidden">
          <button
            onClick={() => updateParam("view", "grid")}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              view === "grid" ? "bg-[#102590] text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
            aria-label="Grid view"
            title="Xem lưới"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => updateParam("view", "list")}
            className={`w-9 h-9 flex items-center justify-center transition-colors ${
              view === "list" ? "bg-[#102590] text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
            aria-label="List view"
            title="Xem danh sách"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Sort */}
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value === "default" ? null : e.target.value)}
          className="h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-[#006EF5] text-gray-700 cursor-pointer"
        >
          <option value="default">Sắp xếp mặc định</option>
          <option value="newest">Mới nhất</option>
          <option value="price-asc">Giá: Thấp → cao</option>
          <option value="price-desc">Giá: Cao → thấp</option>
          <option value="name-asc">Tên: A → Z</option>
        </select>
      </div>
    </div>
  )
}
