"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useWishlistStore } from "@/lib/wishlist-store"

export function WishlistIcon() {
  const items = useWishlistStore((s) => s.items)
  // Avoid hydration mismatch — persist hydrates after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const count = mounted ? items.length : 0

  return (
    <Link
      href="/yeu-thich"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:text-red-500 transition-colors"
      aria-label={`Danh sách yêu thích${count > 0 ? ` (${count} sản phẩm)` : ""}`}
    >
      <Heart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
