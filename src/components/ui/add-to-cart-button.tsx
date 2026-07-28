"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { useCartStore, type CartItem } from "@/lib/cart-store"

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">
  className?: string
  /** Compact mode cho product card (chỉ icon) */
  compact?: boolean
}

export function AddToCartButton({ product, className, compact }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent Link navigation on product cards
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-md border transition-colors ${
          added
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-200 text-gray-500 hover:border-[#006EF5] hover:text-[#006EF5]"
        } ${className || ""}`}
        aria-label={`Thêm ${product.name} vào giỏ`}
        title="Thêm vào giỏ hàng"
      >
        {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-bold uppercase transition-colors ${
        added
          ? "bg-green-500 text-white"
          : "bg-[#006EF5] text-white hover:bg-[#102590]"
      } ${className || ""}`}
    >
      {added ? (
        <>
          <Check className="h-4 w-4" />
          Đã thêm
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          Thêm vào giỏ
        </>
      )}
    </button>
  )
}
