"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { CheckCircle, Copy, Phone, ChevronRight, Truck, Loader2, BadgeCheck } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SITE_CONFIG } from "@/lib/constants"
import { formatPrice } from "@/lib/cart-store"
import { useEffect, useState } from "react"

// ─── Bank config ──────────────────────────────────────
const BANK = {
  code: "TCB",           // Techcombank (VietQR bank code)
  bin: "970407",
  name: "Techcombank",
  accountNumber: "35455558",
  accountName: "CONG TY TNHH APLUS TECHNOLOGIES",
} as const

/** Build VietQR image URL — qr_only template for custom branding */
function buildVietQRUrl(amount: number, description: string): string {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: description,
    accountName: BANK.accountName,
  })
  return `https://img.vietqr.io/image/${BANK.code}-${BANK.accountNumber}-qr_only.png?${params.toString()}`
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const totalAmount = parseInt(searchParams.get("total") || "0", 10)
  const paymentMethod = searchParams.get("pm") || "bank_transfer"
  const [copied, setCopied] = useState(false)

  // Payment notify state
  const [notifying, setNotifying] = useState(false)
  const [notified, setNotified] = useState(false)
  const [notifyError, setNotifyError] = useState<string | null>(null)

  // Load trạng thái notified khi mount (nếu khách refresh trang)
  useEffect(() => {
    if (!orderNumber || paymentMethod !== "bank_transfer") return
    fetch(`/api/orders/${orderNumber}/payment-notify`)
      .then((r) => r.json())
      .then((data) => {
        if (data.notifiedAt) setNotified(true)
      })
      .catch(() => {
        // ignore
      })
  }, [orderNumber, paymentMethod])

  const handleNotifyPaid = async () => {
    if (!orderNumber) return
    setNotifying(true)
    setNotifyError(null)
    try {
      const res = await fetch(`/api/orders/${orderNumber}/payment-notify`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        setNotifyError(data.error || "Không gửi được thông báo")
        return
      }
      setNotified(true)
    } catch {
      setNotifyError("Lỗi kết nối, vui lòng thử lại")
    } finally {
      setNotifying(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!orderNumber) {
    return (
      <section className="bg-white py-16">
        <Container>
          <div className="text-center">
            <p className="text-gray-500">Không tìm thấy thông tin đơn hàng.</p>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] text-white px-6 text-sm font-semibold uppercase mt-6 hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </Container>
      </section>
    )
  }

  const isBankTransfer = paymentMethod === "bank_transfer"
  const qrUrl = isBankTransfer && totalAmount > 0
    ? buildVietQRUrl(totalAmount, orderNumber)
    : null

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[#F2F3F4] py-4 border-b border-gray-100">
        <Container>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#006EF5] transition-colors">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#102590] font-semibold">Xác nhận đơn hàng</span>
          </div>
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Success header */}
            <div className="text-center mb-10">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-[#102590] mb-2">
                Đặt hàng thành công!
              </h1>
              <p className="text-sm text-gray-600">
                Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
              </p>
            </div>

            {/* Order number card */}
            <div className="bg-[#F2F3F4] rounded-lg p-6 mb-8 text-center">
              <div className="text-sm text-gray-500 mb-2">Mã đơn hàng</div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-[#102590] tracking-wider">
                  {orderNumber}
                </span>
                <button
                  onClick={() => handleCopy(orderNumber)}
                  className="p-2 text-gray-400 hover:text-[#006EF5] transition-colors"
                  title="Sao chép mã đơn"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
              {totalAmount > 0 && (
                <div className="mt-3 text-lg font-bold text-[#102590]">
                  Tổng thanh toán: {formatPrice(totalAmount)}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Vui lòng lưu mã đơn hàng để tra cứu trạng thái.
              </p>
            </div>

            {/* Payment info — Bank Transfer with branded QR card */}
            {isBankTransfer && (
              <div className="mb-8">
                {/* Branded QR Card */}
                {qrUrl && (
                  <div className="max-w-[320px] mx-auto mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                    {/* Card header — APLUS logo on light bg with brand accent */}
                    <div className="bg-white px-5 py-4 flex items-center justify-center border-b-[3px] border-[#102590]">
                      <Image
                        src="/images/logo/logo-qr-header.png"
                        alt="APLUS Technologies"
                        width={200}
                        height={80}
                        className="h-10 w-auto"
                      />
                    </div>

                    {/* QR code */}
                    <div className="bg-white p-5 flex justify-center">
                      <Image
                        src={qrUrl}
                        alt={`QR chuyển khoản đơn hàng ${orderNumber}`}
                        width={240}
                        height={240}
                        className="rounded"
                        unoptimized
                      />
                    </div>

                    {/* Bank info strip */}
                    <div className="bg-[#F2F3F4] px-5 py-3 text-center">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wide">{BANK.name}</div>
                      <div className="text-base font-bold text-[#102590] tracking-wider mt-0.5">{BANK.accountNumber}</div>
                      <div className="text-[11px] font-medium text-gray-700 mt-0.5">{BANK.accountName}</div>
                    </div>

                    {/* Amount + description */}
                    <div className="bg-white border-t border-gray-100 px-5 py-3">
                      {totalAmount > 0 && (
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-500">Số tiền</span>
                          <span className="text-sm font-bold text-[#102590]">{formatPrice(totalAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Nội dung CK</span>
                        <span className="text-sm font-bold text-[#006EF5]">{orderNumber}</span>
                      </div>
                    </div>

                    {/* Footer accent */}
                    <div className="h-1 bg-gradient-to-r from-[#102590] via-[#006EF5] to-[#36D1FF]" />
                  </div>
                )}

                <p className="text-center text-[13px] text-gray-500 mb-5">
                  Quét mã QR bằng app ngân hàng để chuyển khoản tự động
                </p>

                {/* Manual transfer details (collapsible-style) */}
                <details className="group bg-[#F2F3F4] rounded-lg overflow-hidden">
                  <summary className="px-5 py-3.5 text-sm font-semibold text-[#102590] cursor-pointer select-none flex items-center justify-between">
                    Chuyển khoản thủ công
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <dl className="text-sm space-y-2.5 bg-white px-5 py-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-500">Ngân hàng</dt>
                      <dd className="font-semibold text-[#111827]">{BANK.name}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-500">Số tài khoản</dt>
                      <dd className="font-semibold text-[#111827] flex items-center gap-2">
                        {BANK.accountNumber}
                        <button
                          onClick={() => handleCopy(BANK.accountNumber)}
                          className="text-gray-400 hover:text-[#006EF5] transition-colors"
                          title="Sao chép STK"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-500">Chủ tài khoản</dt>
                      <dd className="font-semibold text-[#111827]">{BANK.accountName}</dd>
                    </div>
                    {totalAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <dt className="text-gray-500">Số tiền</dt>
                        <dd className="font-bold text-[#102590]">{formatPrice(totalAmount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <dt className="text-gray-500">Nội dung CK</dt>
                      <dd className="font-semibold text-[#006EF5] flex items-center gap-2">
                        {orderNumber}
                        <button
                          onClick={() => handleCopy(orderNumber)}
                          className="text-gray-400 hover:text-[#006EF5] transition-colors"
                          title="Sao chép nội dung CK"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </dd>
                    </div>
                  </dl>
                </details>

                <div className="mt-3 text-center text-[12px] text-gray-400">
                  Đơn hàng sẽ được xử lý sau khi xác nhận thanh toán (thường trong 1-2 giờ làm việc)
                </div>

                {/* ── Nút "Tôi đã chuyển khoản" ── */}
                <div className="mt-6">
                  {notified ? (
                    <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                      <BadgeCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-emerald-800 mb-0.5">
                          Đã ghi nhận báo chuyển khoản
                        </div>
                        <p className="text-[13px] text-emerald-700 leading-relaxed">
                          Cảm ơn bạn! Chúng tôi sẽ đối soát và xác nhận trong 1-2 giờ làm việc.
                          Có thể liên hệ Hotline{" "}
                          <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="font-semibold underline">
                            {SITE_CONFIG.phone}
                          </a>{" "}
                          nếu cần gấp.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handleNotifyPaid}
                        disabled={notifying}
                        className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-md text-sm font-bold uppercase tracking-wide hover:bg-emerald-700 transition-colors disabled:opacity-60"
                      >
                        {notifying ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <BadgeCheck className="h-5 w-5" />
                        )}
                        {notifying ? "Đang gửi..." : "Tôi đã chuyển khoản"}
                      </button>
                      <p className="text-[12px] text-gray-500 text-center mt-2">
                        Nhấn nút này sau khi hoàn tất chuyển khoản để admin đối soát nhanh hơn
                      </p>
                      {notifyError && (
                        <p className="text-xs text-red-500 text-center mt-2">{notifyError}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Payment info — COD */}
            {!isBankTransfer && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-5 mb-8">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-green-800 mb-1">
                      Thanh toán khi nhận hàng (COD)
                    </h3>
                    <p className="text-[13px] text-green-700 leading-relaxed">
                      Nhân viên giao hàng sẽ liên hệ bạn trước khi giao.
                      Vui lòng chuẩn bị {totalAmount > 0 ? <strong>{formatPrice(totalAmount)}</strong> : "số tiền"} để
                      thanh toán khi nhận hàng.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] text-white px-6 text-sm font-semibold uppercase hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-[#006EF5] text-[#006EF5] px-6 text-sm font-semibold uppercase hover:bg-[#006EF5] hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                Gọi hỗ trợ
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-white py-16">
          <Container>
            <div className="text-center text-gray-400">Đang tải...</div>
          </Container>
        </section>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  )
}
