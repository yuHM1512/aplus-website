"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"
import { CheckCircle, Copy, Phone, ChevronRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SITE_CONFIG } from "@/lib/constants"
import { useState } from "react"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!orderNumber) return
    navigator.clipboard.writeText(orderNumber)
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
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#102590] mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-sm text-gray-600 mb-8">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
            </p>

            {/* Order number */}
            <div className="bg-[#F2F3F4] rounded-lg p-6 mb-8">
              <div className="text-sm text-gray-500 mb-2">Mã đơn hàng</div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-bold text-[#102590] tracking-wider">
                  {orderNumber}
                </span>
                <button
                  onClick={handleCopy}
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
              <p className="text-xs text-gray-400 mt-3">
                Vui lòng lưu mã đơn hàng để tra cứu trạng thái.
              </p>
            </div>

            {/* Bank transfer info */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8 text-left">
              <h3 className="text-sm font-bold text-[#102590] mb-3">
                Thông tin chuyển khoản
              </h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Ngân hàng</dt>
                  <dd className="font-semibold text-[#111827]">Vietcombank</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Số tài khoản</dt>
                  <dd className="font-semibold text-[#111827]">0491000XXXXXX</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Chủ tài khoản</dt>
                  <dd className="font-semibold text-[#111827]">APLUS TECHNOLOGIES</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Nội dung CK</dt>
                  <dd className="font-semibold text-[#006EF5]">{orderNumber}</dd>
                </div>
              </dl>
            </div>

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
