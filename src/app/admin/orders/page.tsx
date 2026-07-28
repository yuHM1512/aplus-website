"use client"

import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { Package, Eye, Search, Download, ChevronLeft, ChevronRight, Filter, Trash2, RefreshCw } from "lucide-react"
import { formatPrice } from "@/lib/cart-store"

interface OrderItem {
  id: string
  productName: string
  price: number
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  paymentStatus: string
  fullName: string
  phone: string
  total: number
  createdAt: string
  items: OrderItem[]
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
]

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

function SapoSyncButton({ onSynced }: { onSynced: () => void }) {
  const [syncing, setSyncing] = useState(false)
  const [msg, setMsg] = useState("")

  const handleSync = async () => {
    setSyncing(true)
    setMsg("")
    try {
      const res = await fetch("/api/admin/sapo/sync-orders", { method: "POST" })
      const data = await res.json()
      setMsg(data.message || "Hoàn tất")
      onSynced()
    } catch {
      setMsg("Lỗi kết nối")
    } finally {
      setSyncing(false)
      setTimeout(() => setMsg(""), 5000)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={syncing}
        onClick={handleSync}
        className="inline-flex items-center gap-2 px-4 h-10 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
        Đồng bộ Sapo
      </button>
      {msg && <span className="text-xs text-gray-500 max-w-[200px] truncate">{msg}</span>}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)

  // Filters
  const [status, setStatus] = useState("all")
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    if (search) params.set("search", search)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    params.set("page", String(page))
    params.set("limit", "20")

    try {
      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders || [])
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
    } catch {
      console.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }, [status, search, dateFrom, dateTo, page])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Debounced search
  const [searchInput, setSearchInput] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (order: Order) => {
    if (!confirm(`Xoá đơn hàng ${order.orderNumber} của ${order.fullName}?\nHành động này không thể hoàn tác.`)) {
      return
    }
    setDeletingId(order.id)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      // Tải lại danh sách
      fetchOrders()
    } catch {
      alert("Xoá đơn hàng thất bại")
    } finally {
      setDeletingId(null)
    }
  }

  const handleExport = async () => {
    const params = new URLSearchParams()
    if (status !== "all") params.set("status", status)
    if (search) params.set("search", search)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)

    const res = await fetch(`/api/admin/orders/export?${params}`)
    if (!res.ok) return alert("Export thất bại")
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `don-hang-${new Date().toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const pendingCount = orders.filter((o) => o.status === "pending").length

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Đơn hàng</h2>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} đơn hàng
            {pendingCount > 0 && <> &middot; {pendingCount} chờ xử lý</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SapoSyncButton onSynced={fetchOrders} />
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 h-10 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo SĐT, tên, mã đơn..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-10 pl-10 pr-4 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1) }}
              className="h-10 pl-10 pr-8 border border-[#E2E8F0] rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="h-10 px-3 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="h-10 px-3 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue"
            />
          </div>

          {/* Clear */}
          {(status !== "all" || search || dateFrom || dateTo) && (
            <button
              onClick={() => { setStatus("all"); setSearchInput(""); setSearch(""); setDateFrom(""); setDateTo(""); setPage(1) }}
              className="h-10 px-3 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Table */}
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
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-sm text-gray-400">Đang tải...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-4">
                        <Package className="w-7 h-7 text-ocean-blue" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Không tìm thấy đơn hàng</p>
                      <p className="text-xs text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
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
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#006EF5] hover:text-[#102590] transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          Xem
                        </Link>
                        <button
                          onClick={() => handleDelete(order)}
                          disabled={deletingId === order.id}
                          title="Xoá đơn hàng"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          {deletingId === order.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Hiển thị {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1]) > 1) acc.push("...")
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`h-9 w-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-[#102590] text-white"
                          : "border border-[#E2E8F0] text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E2E8F0] text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
