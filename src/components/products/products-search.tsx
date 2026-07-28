"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { Search, X } from "lucide-react"

export function ProductsSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get("q") || "")

  const submit = (v: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (v.trim()) {
      params.set("q", v.trim())
    } else {
      params.delete("q")
    }
    params.delete("page")
    startTransition(() => {
      router.push(`/products?${params.toString()}`)
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit(value)
      }}
      className="relative"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full h-11 pl-10 pr-10 rounded-md border border-gray-200 focus:outline-none focus:border-[#006EF5] focus:ring-1 focus:ring-[#006EF5] text-sm transition-colors"
        disabled={pending}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("")
            submit("")
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Xóa tìm kiếm"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
