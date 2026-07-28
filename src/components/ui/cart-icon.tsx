"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export function CartIcon() {
  const items = useCartStore((s) => s.items)
  // Avoid hydration mismatch — Zustand persist loads from localStorage after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const count = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0

  return (
    <Link
      href="/gio-hang"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-md text-gray-700 hover:text-[#006EF5] transition-colors"
      aria-label={`Giỏ hàng${count > 0 ? ` (${count} sản phẩm)` : ""}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#006EF5] text-white text-[10px] font-bold px-1">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  )
}
