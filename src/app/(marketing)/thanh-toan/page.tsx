"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight, ShoppingBag, Landmark, Truck, Gift, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Container } from "@/components/ui/container"
import { useCartStore, formatPrice, SHIPPING_FEE } from "@/lib/cart-store"

// ─── Validation schema ─────────────────────────────────
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .regex(/^[0-9\s]+$/, "Số điện thoại chỉ chứa số"),
  email: z.string().email("Email không hợp lệ"),
  province: z.string().min(1, "Vui lòng nhập tỉnh / thành phố"),
  district: z.string().min(1, "Vui lòng nhập quận / huyện"),
  ward: z.string().min(1, "Vui lòng nhập phường / xã"),
  address: z.string().min(3, "Vui lòng nhập địa chỉ chi tiết"),
  note: z.string().optional(),
  paymentMethod: z.enum(["bank_transfer", "cod"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [submitting, setSubmitting] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const total = subtotal + (items.length > 0 ? SHIPPING_FEE : 0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "bank_transfer",
    },
  })

  const paymentMethod = watch("paymentMethod")

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.name,
            productImage: i.image,
            productSlug: i.slug,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal,
          shippingFee: SHIPPING_FEE,
          total,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Đặt hàng thất bại")
      }

      const { orderNumber } = await res.json()
      clearCart()
      router.push(`/don-hang/xac-nhan?order=${orderNumber}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setSubmitting(false)
    }
  }

  // Redirect nếu giỏ hàng trống
  if (items.length === 0) {
    return (
      <>
        <Breadcrumb />
        <section className="bg-white py-16">
          <Container>
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h1 className="text-lg font-semibold text-gray-700 mb-2">Giỏ hàng trống</h1>
              <p className="text-sm text-gray-500 mb-6">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] text-white px-6 text-sm font-semibold uppercase hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
              >
                Xem sản phẩm
              </Link>
            </div>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <Breadcrumb />

      <section className="bg-white py-12">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-10 items-start">
            {/* ── LEFT: Billing form ── */}
            <div>
              <h1 className="text-[22px] font-bold text-[#102590] uppercase tracking-wide mb-7">
                Thông tin thanh toán
              </h1>

              <form
                id="checkout-form"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                {/* Họ tên */}
                <Field label="Họ và tên" required error={errors.fullName?.message}>
                  <input
                    {...register("fullName")}
                    placeholder="Nguyễn Văn An"
                    className={inputClass(errors.fullName)}
                  />
                </Field>

                {/* SĐT */}
                <Field label="Số điện thoại" required error={errors.phone?.message}>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="0912 345 678"
                    className={inputClass(errors.phone)}
                  />
                </Field>

                {/* Email */}
                <Field label="Email" required error={errors.email?.message}>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="example@email.com"
                    className={inputClass(errors.email)}
                  />
                </Field>

                {/* Tỉnh / Huyện / Xã — text inputs cho Phase 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Tỉnh / Thành phố" required error={errors.province?.message}>
                    <input
                      {...register("province")}
                      placeholder="Bình Định"
                      className={inputClass(errors.province)}
                    />
                  </Field>
                  <Field label="Quận / Huyện" required error={errors.district?.message}>
                    <input
                      {...register("district")}
                      placeholder="TP. Quy Nhơn"
                      className={inputClass(errors.district)}
                    />
                  </Field>
                  <Field label="Phường / Xã" required error={errors.ward?.message}>
                    <input
                      {...register("ward")}
                      placeholder="Trần Hưng Đạo"
                      className={inputClass(errors.ward)}
                    />
                  </Field>
                </div>

                {/* Địa chỉ */}
                <Field label="Địa chỉ chi tiết" required error={errors.address?.message}>
                  <input
                    {...register("address")}
                    placeholder="Số nhà, tên đường, khu phố..."
                    className={inputClass(errors.address)}
                  />
                </Field>

                {/* Ghi chú */}
                <Field label="Ghi chú đơn hàng" optional>
                  <textarea
                    {...register("note")}
                    placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay địa điểm giao hàng..."
                    className="w-full min-h-[100px] border border-gray-200 rounded-md px-3.5 py-3 text-sm text-[#111827] bg-white focus:border-[#006EF5] focus:ring-1 focus:ring-[#006EF5] outline-none transition-colors resize-y"
                  />
                </Field>
              </form>
            </div>

            {/* ── RIGHT: Order summary (mobile-first → shows on top on mobile) ── */}
            <div className="order-first lg:order-none lg:sticky lg:top-24">
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-[15px] font-bold text-[#102590] uppercase tracking-wide mb-5">
                  Đơn hàng của bạn
                </h2>

                {/* Product list */}
                <div className="flex flex-col">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 py-3 border-b border-gray-100"
                    >
                      <div className="w-14 h-14 border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="object-contain p-1.5"
                            unoptimized
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#111827] leading-snug line-clamp-2">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">× {item.quantity}</div>
                      </div>
                      <div className="text-[13px] font-semibold text-[#102590] shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals */}
                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-medium text-[#111827]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-medium text-[#111827]">{formatPrice(SHIPPING_FEE)}</span>
                  </div>
                </div>

                <div className="h-0.5 bg-gray-200 my-4" />

                <div className="flex justify-between items-baseline">
                  <span className="text-[15px] font-semibold text-gray-700">Tổng cộng</span>
                  <span className="text-[22px] font-bold text-[#102590]">{formatPrice(total)}</span>
                </div>

                {/* Payment method */}
                <div className="mt-6">
                  <div className="text-[13px] font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    Phương thức thanh toán
                  </div>

                  {/* Bank transfer */}
                  <PaymentOption
                    selected={paymentMethod === "bank_transfer"}
                    onClick={() => setValue("paymentMethod", "bank_transfer")}
                    icon={<Landmark className="h-[18px] w-[18px] text-[#102590]" />}
                    label="Chuyển khoản ngân hàng"
                  >
                    <div className="mt-3 bg-[#F2F3F4] rounded-md p-3.5 text-[13px] text-gray-600 leading-relaxed">
                      Chuyển khoản trực tiếp vào tài khoản ngân hàng của chúng tôi.
                      Vui lòng ghi <strong>mã đơn hàng</strong> trong nội dung chuyển khoản.
                      Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán.
                    </div>
                  </PaymentOption>

                  {/* COD */}
                  <PaymentOption
                    selected={paymentMethod === "cod"}
                    onClick={() => setValue("paymentMethod", "cod")}
                    icon={<Truck className="h-[18px] w-[18px] text-[#102590]" />}
                    label="Thanh toán khi nhận hàng (COD)"
                  >
                    <div className="mt-3 bg-[#F2F3F4] rounded-md p-3.5 text-[13px] text-gray-600 leading-relaxed">
                      Thanh toán trực tiếp cho nhân viên giao hàng khi nhận hàng.
                    </div>
                  </PaymentOption>

                  {errors.paymentMethod && (
                    <p className="text-xs text-red-500 mt-1">{errors.paymentMethod.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="mt-5 flex items-center justify-center gap-2 w-full h-14 bg-[#102590] text-white rounded-md text-[15px] font-bold uppercase tracking-wide hover:bg-[#36D1FF] hover:text-[#102590] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Gift className="h-[18px] w-[18px]" />
                      Đặt hàng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

/* ── Breadcrumb ── */
function Breadcrumb() {
  return (
    <section className="bg-[#F2F3F4] py-4 border-b border-gray-100">
      <Container>
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-[#006EF5] transition-colors">Trang chủ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/gio-hang" className="hover:text-[#006EF5] transition-colors">Giỏ hàng</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#102590] font-semibold">Thanh toán</span>
        </div>
      </Container>
    </section>
  )
}

/* ── Form field wrapper ── */
function Field({
  label,
  required,
  optional,
  error,
  children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#111827]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {optional && <span className="text-gray-400 font-normal ml-1">(tùy chọn)</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ── Payment option radio ── */
function PaymentOption({
  selected,
  onClick,
  icon,
  label,
  children,
}: {
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  children?: React.ReactNode
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`p-4 border rounded-md mb-2 cursor-pointer transition-colors ${
        selected
          ? "border-[#006EF5] bg-white"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Radio dot */}
        <div
          className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 ${
            selected ? "border-[#006EF5]" : "border-gray-300"
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#006EF5]" />}
        </div>
        {icon}
        <span className="text-sm font-medium text-[#111827]">{label}</span>
      </div>
      {selected && children}
    </div>
  )
}

/* ── Input class helper ── */
function inputClass(error?: { message?: string }) {
  return `h-11 w-full border rounded-md px-3.5 text-sm text-[#111827] bg-white outline-none transition-colors focus:border-[#006EF5] focus:ring-1 focus:ring-[#006EF5] ${
    error ? "border-red-400" : "border-gray-200"
  }`
}
