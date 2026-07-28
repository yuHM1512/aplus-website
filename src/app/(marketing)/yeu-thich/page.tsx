"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Heart, Trash2, ShoppingCart, Check } from "lucide-react"
import { useState } from "react"
import { Container } from "@/components/ui/container"
import { useWishlistStore } from "@/lib/wishlist-store"
import { useCartStore, formatPrice } from "@/lib/cart-store"

export default function WishlistPage() {
  const { items, remove, clear } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)
  const [addedIds, setAddedIds] = useState<string[]>([])

  const handleAddToCart = (item: (typeof items)[number]) => {
    if (!item.price) return
    addToCart({
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      image: item.image,
      category: item.category,
      price: item.price,
    })
    setAddedIds((prev) => [...prev, item.productId])
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== item.productId))
    }, 1500)
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[#F2F3F4] py-4 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#006EF5] transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#102590] font-semibold">Sản phẩm yêu thích</span>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <h1 className="text-2xl font-bold text-[#102590] uppercase tracking-wide">
              Sản phẩm yêu thích
            </h1>
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Xóa toàn bộ danh sách yêu thích?")) clear()
                }}
                className="text-sm text-red-500 hover:text-red-700 font-medium underline"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyWishlist />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => {
                const added = addedIds.includes(item.productId)
                return (
                  <div
                    key={item.productId}
                    className="group relative flex flex-col bg-white rounded-lg border border-gray-100 hover:border-[#006EF5] hover:shadow-lg overflow-hidden transition-all"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => remove(item.productId)}
                      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white text-gray-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-md transition-all"
                      aria-label="Xóa khỏi yêu thích"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    {/* Image */}
                    <Link href={`/products/${item.slug}`}>
                      <div className="relative aspect-square bg-white flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        ) : (
                          <Heart className="h-12 w-12 text-gray-200" />
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <Link href={`/products/${item.slug}`} className="block flex-1">
                        {item.category && (
                          <span className="text-[10px] font-bold uppercase text-[#006EF5] bg-[#B5DBFF] px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                        <h3 className="mt-2 text-sm font-bold text-[#111827] line-clamp-2 min-h-[2.5rem] group-hover:text-[#006EF5] transition-colors">
                          {item.name}
                        </h3>
                        <div className="mt-2 text-base font-bold text-[#102590]">
                          {item.price > 0 ? formatPrice(item.price) : "Liên hệ"}
                        </div>
                      </Link>

                      {/* Add to cart */}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.price}
                        className={`mt-3 flex items-center justify-center gap-1.5 rounded-md py-2.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                          !item.price
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : added
                            ? "bg-green-500 text-white"
                            : "bg-[#102590] text-white hover:bg-[#006EF5]"
                        }`}
                      >
                        {!item.price ? (
                          "Liên hệ tư vấn"
                        ) : added ? (
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
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

/* ── Empty state ── */
function EmptyWishlist() {
  return (
    <div className="text-center py-20">
      <Heart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Chưa có sản phẩm yêu thích
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Nhấn vào biểu tượng trái tim trên sản phẩm để lưu vào danh sách.
      </p>
      <Link
        href="/products"
        className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] text-white px-6 text-sm font-semibold uppercase hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
      >
        Xem sản phẩm
      </Link>
    </div>
  )
}
