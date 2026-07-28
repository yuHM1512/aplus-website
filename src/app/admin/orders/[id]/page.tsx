import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/cart-store"
import { ArrowLeft, MapPin, Phone, Mail, Package } from "lucide-react"
import { OrderStatusButtons } from "@/components/admin/order-status-buttons"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) return notFound()

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const statusLabels: Record<string, string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#006EF5] mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
          <h2 className="text-2xl font-semibold text-deep-blue">
            Đơn hàng {order.orderNumber}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Đặt lúc {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
              Sản phẩm ({order.items.length})
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-[#102590]">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tạm tính</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển</span>
                <span className="font-medium">{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span className="text-gray-700">Tổng cộng</span>
                <span className="text-[#102590]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
              Thông tin khách hàng
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">Họ tên</dt>
                <dd className="font-semibold text-gray-900">{order.fullName}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> SĐT</dt>
                <dd className="font-semibold text-gray-900">{order.phone}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> Email</dt>
                <dd className="font-semibold text-gray-900">{order.email}</dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> Địa chỉ</dt>
                <dd className="font-semibold text-gray-900">
                  {order.address}, {order.ward}, {order.district}, {order.province}
                </dd>
              </div>
            </dl>
            {order.note && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-gray-700">
                <strong>Ghi chú:</strong> {order.note}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
              Trạng thái
            </h3>
            <div className="mb-4">
              <span className="text-sm text-gray-500">Đơn hàng:</span>
              <span className="ml-2 font-semibold text-gray-900">
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-sm text-gray-500">Thanh toán:</span>
              <span className={`ml-2 font-semibold ${order.paymentStatus === "paid" ? "text-emerald-600" : "text-red-500"}`}>
                {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
              </span>
            </div>
            <div className="mb-6">
              <span className="text-sm text-gray-500">Phương thức:</span>
              <span className="ml-2 font-semibold text-gray-900">
                {order.paymentMethod === "bank_transfer" ? "Chuyển khoản" : "COD"}
              </span>
            </div>

            <OrderStatusButtons
              orderId={order.id}
              currentStatus={order.status}
              currentPaymentStatus={order.paymentStatus}
            />
          </div>
        </div>
      </div>
    </>
  )
}
