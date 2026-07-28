"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Eye, Check } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { useWishlistStore } from "@/lib/wishlist-store"
import { shouldSkipImageOptimization } from "@/lib/images"

export interface ProductCardData {
  id: string
  name: string
  slug: string
  image: string | null
  category: string | null
  categoryName: string | null
  brand: string | null
  price: string | null // Display string: "990.000"
  priceOriginal: string | null
  priceNumeric: number | null
  badge: string | null
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const addItem = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const hasInWishlist = useWishlistStore((s) => s.has)

  // Avoid hydration mismatch — persist reads localStorage after mount
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isWishlisted = mounted && hasInWishlist(product.id)

  const [added, setAdded] = useState(false)

  // Fallback: nếu chưa có priceNumeric, parse từ display string
  const priceValue = product.priceNumeric || parsePriceString(product.price)
  const canAddToCart = priceValue > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canAddToCart) return
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      category: product.categoryName || product.category,
      price: priceValue,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      category: product.categoryName || product.category,
      price: priceValue,
    })
  }

  // Discount percent
  const discount =
    product.priceOriginal && product.price
      ? calcDiscount(product.priceOriginal, product.price)
      : null

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border border-gray-100 hover:border-[#006EF5] hover:shadow-lg overflow-hidden transition-all duration-300">
      {/* Image + overlay icons */}
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
            {/* Badges (top-left) */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
              {product.badge && (
                <span className="text-[10px] font-bold uppercase text-white bg-[#006EF5] px-2 py-1 rounded shadow-sm">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="text-[10px] font-bold uppercase text-white bg-red-500 px-2 py-1 rounded shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                unoptimized={shouldSkipImageOptimization(product.image)}
              />
            ) : (
              <div className="text-gray-200">
                <ShoppingCart className="h-12 w-12" />
              </div>
            )}
          </div>
        </Link>

        {/* Overlay icons (top-right) — luôn hiển thị rõ, slide-in trên desktop */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 md:translate-x-14 md:group-hover:translate-x-0 transition-transform duration-300 ease-out">
          <button
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border transition-all ${
              isWishlisted
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 border-gray-200 hover:bg-red-500 hover:text-white hover:border-red-500"
            }`}
            aria-label={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
            title={isWishlisted ? "Bỏ yêu thích" : "Yêu thích"}
          >
            <Heart className={`h-[18px] w-[18px] ${isWishlisted ? "fill-current" : ""}`} strokeWidth={2} />
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="w-10 h-10 rounded-full bg-white text-gray-700 border border-gray-200 hover:bg-[#006EF5] hover:text-white hover:border-[#006EF5] flex items-center justify-center shadow-md transition-all"
            aria-label="Xem chi tiết"
            title="Xem chi tiết"
          >
            <Eye className="h-[18px] w-[18px]" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`} className="block flex-1">
          {(product.categoryName || product.category) && (
            <span className="text-[10px] font-bold uppercase text-[#006EF5] bg-[#B5DBFF] px-2 py-0.5 rounded">
              {product.categoryName || product.category}
            </span>
          )}
          <h3 className="mt-2 text-sm font-bold text-[#111827] line-clamp-2 min-h-[2.5rem] group-hover:text-[#006EF5] transition-colors">
            {product.name}
          </h3>
          {product.brand && (
            <div className="mt-1 text-xs text-gray-400">
              Thương hiệu: <span className="font-medium text-gray-600">{product.brand}</span>
            </div>
          )}
          <div className="mt-2 flex items-baseline gap-2 flex-wrap">
            <span className="text-base font-bold text-[#102590]">
              {product.price ? `${product.price}đ` : "Liên hệ"}
            </span>
            {product.priceOriginal && (
              <span className="text-xs text-gray-400 line-through">
                {product.priceOriginal}đ
              </span>
            )}
          </div>
        </Link>

        {/* CTA — luôn hiển thị nút chính, không dùng "Liên hệ tư vấn" */}
        {canAddToCart ? (
          <button
            onClick={handleAddToCart}
            className={`mt-3 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
              added
                ? "bg-green-500 text-white"
                : "bg-[#102590] text-white hover:bg-[#006EF5]"
            }`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Đã thêm
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Thêm vào giỏ
              </>
            )}
          </button>
        ) : (
          <Link
            href={`/products/${product.slug}`}
            className="mt-3 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-bold uppercase tracking-wide bg-[#102590] text-white hover:bg-[#006EF5] transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Xem chi tiết
          </Link>
        )}
      </div>
    </div>
  )
}

/* ── Helpers ── */
function calcDiscount(original: string, current: string): number | null {
  const o = parsePriceString(original)
  const c = parsePriceString(current)
  if (!o || !c || o <= c) return null
  return Math.round(((o - c) / o) * 100)
}

function parsePriceString(s: string | null): number {
  if (!s) return 0
  return parseInt(s.replace(/[^\d]/g, ""), 10) || 0
}
