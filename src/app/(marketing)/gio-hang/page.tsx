"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, Trash2, ShoppingBag, Truck } from "lucide-react"
import { Container } from "@/components/ui/container"
import { useCartStore, formatPrice, SHIPPING_FEE } from "@/lib/cart-store"

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0)

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[#F2F3F4] py-4 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#006EF5] transition-colors">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#102590] font-semibold">Giỏ hàng</span>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12">
        <Container>
          <h1 className="text-2xl font-bold text-[#102590] uppercase tracking-wide mb-8">
            Giỏ hàng của bạn
          </h1>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                {/* Header */}
                <div className="grid grid-cols-[80px_1fr_140px_148px_140px_40px] gap-4 items-center pb-3 border-b-2 border-gray-200">
                  <div />
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Sản phẩm</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">Đơn giá</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 text-center">Số lượng</div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 text-right">Thành tiền</div>
                  <div />
                </div>

                {/* Rows */}
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="grid grid-cols-[80px_1fr_140px_148px_140px_40px] gap-4 items-center py-5 border-b border-gray-100"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                      )}
                    </div>

                    {/* Name + category */}
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-semibold text-[#111827] hover:text-[#006EF5] transition-colors leading-snug"
                      >
                        {item.name}
                      </Link>
                      {item.category && (
                        <div className="mt-1">
                          <span className="text-[10px] font-bold uppercase text-[#006EF5] bg-[#B5DBFF] px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Unit price */}
                    <div className="text-sm text-gray-700 text-center">
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity */}
                    <div className="flex justify-center">
                      <QuantityInput
                        value={item.quantity}
                        onChange={(qty) => updateQuantity(item.productId, qty)}
                      />
                    </div>

                    {/* Line total */}
                    <div className="text-sm font-bold text-[#102590] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded"
                        aria-label={`Xóa ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile cards */}
              <div className="md:hidden flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="object-contain p-2"
                          unoptimized
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-[13px] font-semibold text-[#111827] leading-snug"
                      >
                        {item.name}
                      </Link>
                      {item.category && (
                        <div className="text-[11px] text-gray-500 mt-0.5">{item.category}</div>
                      )}
                      <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
                        <QuantityInput
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.productId, qty)}
                          size="sm"
                        />
                        <div className="text-sm font-bold text-[#102590]">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Xóa ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom row */}
              <div className="mt-8 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#006EF5] hover:text-[#102590] transition-colors pb-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Tiếp tục mua sắm
                </Link>

                {/* Summary box */}
                <div className="w-full lg:w-[380px] bg-[#F2F3F4] rounded-lg p-6">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-semibold text-[#111827]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-start text-sm mb-5">
                    <span className="text-gray-500">
                      Phí vận chuyển
                      <span className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Truck className="h-3 w-3" />
                        Giao hàng toàn quốc
                      </span>
                    </span>
                    <span className="font-semibold text-[#111827]">{formatPrice(SHIPPING_FEE)}</span>
                  </div>
                  <div className="h-px bg-gray-300 mb-5" />
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-[15px] font-semibold text-gray-700">Tổng cộng</span>
                    <span className="text-[26px] font-bold text-[#102590]">{formatPrice(total)}</span>
                  </div>
                  <Link
                    href="/thanh-toan"
                    className="flex items-center justify-center gap-2 w-full h-14 bg-[#102590] text-white rounded-md text-sm font-bold uppercase tracking-wide hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
                  >
                    Tiến hành thanh toán
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  )
}

/* ── Empty state ── */
function EmptyCart() {
  return (
    <div className="text-center py-16">
      <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Giỏ hàng trống</h2>
      <p className="text-sm text-gray-500 mb-6">
        Bạn chưa thêm sản phẩm nào vào giỏ hàng.
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

/* ── Quantity input ── */
function QuantityInput({
  value,
  onChange,
  size = "md",
}: {
  value: number
  onChange: (qty: number) => void
  size?: "sm" | "md"
}) {
  const h = size === "sm" ? "h-9" : "h-10"
  const w = size === "sm" ? "w-9" : "w-11"
  const text = size === "sm" ? "text-[13px]" : "text-sm"

  return (
    <div className={`inline-flex items-center border border-gray-200 rounded-md ${h} overflow-hidden`}>
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`px-3 ${h} flex items-center justify-center text-gray-600 hover:bg-[#F2F3F4] transition-colors text-lg leading-none`}
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <div
        className={`${w} ${h} flex items-center justify-center ${text} font-semibold text-[#111827] border-x border-gray-200`}
      >
        {value}
      </div>
      <button
        onClick={() => onChange(value + 1)}
        className={`px-3 ${h} flex items-center justify-center text-gray-600 hover:bg-[#F2F3F4] transition-colors text-lg leading-none`}
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  )
}
