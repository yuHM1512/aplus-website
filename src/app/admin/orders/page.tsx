import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Package, Eye } from "lucide-react"
import { formatPrice } from "@/lib/cart-store"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    shipping: "bg-purple-50 text-purple-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  }

  const statusLabels: Record<string, string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  }

  const paymentLabels: Record<string, string> = {
    bank_transfer: "Chuyển khoản",
    cod: "COD",
  }

  const paymentStatusColors: Record<string, string> = {
    unpaid: "text-red-500",
    paid: "text-emerald-600",
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-deep-blue">Đơn hàng</h2>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} đơn hàng &middot; {pendingCount} chờ xử lý
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Thanh toán</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-4">
                        <Package className="w-7 h-7 text-ocean-blue" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Chưa có đơn hàng nào</p>
                      <p className="text-xs text-gray-400">Khi khách đặt hàng trên website, đơn sẽ hiện ở đây</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className={`hover:bg-[#F8FAFC] transition-colors ${
                      order.status === "pending" ? "bg-yellow-50/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#102590] tracking-wide">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{order.fullName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {order.items.length} SP
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-medium text-gray-600">
                        {paymentLabels[order.paymentMethod] || order.paymentMethod}
                      </span>
                      <div className={`text-[11px] font-medium mt-0.5 ${paymentStatusColors[order.paymentStatus]}`}>
                        {order.paymentStatus === "paid" ? "Đã TT" : "Chưa TT"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#006EF5] hover:text-[#102590] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
