import { prisma } from "@/lib/prisma"
import {
  Package, FileText, Mail, BarChart3, TrendingUp, Plus, ChevronRight,
  Sparkles, ShoppingCart, DollarSign, Clock, Eye, Megaphone, Calendar, Layers,
} from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/cart-store"
import { SapoSyncButton } from "@/components/admin/sapo-sync-button"

async function getDashboardStats() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [
    productCount, postCount, publishedPosts, draftPosts, scheduledPosts,
    contactCount, newContacts,
    totalOrders, pendingOrders, todayOrders, todayRevenue, totalRevenue,
    activeCampaigns, totalCampaigns,
    activePopups,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false, scheduledAt: null } }),
    prisma.post.count({ where: { published: false, scheduledAt: { not: null } } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "new" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: startOfToday }, status: { not: "cancelled" } },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "cancelled" } },
    }),
    prisma.campaign.count({ where: { status: "active" } }),
    prisma.campaign.count(),
    prisma.popup.count({ where: { active: true } }),
  ])

  return {
    productCount, postCount, publishedPosts, draftPosts, scheduledPosts,
    contactCount, newContacts,
    totalOrders, pendingOrders, todayOrders,
    todayRevenue: todayRevenue._sum.total || 0,
    totalRevenue: totalRevenue._sum.total || 0,
    activeCampaigns, totalCampaigns,
    activePopups,
  }
}

async function getRecentOrders() {
  return prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })
}

async function getRecentPosts() {
  return prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true, campaign: true },
  })
}

async function getUpcomingScheduled() {
  return prisma.post.findMany({
    where: { published: false, scheduledAt: { not: null, gte: new Date() } },
    orderBy: { scheduledAt: "asc" },
    take: 5,
    include: { campaign: true },
  })
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  const recentPosts = await getRecentPosts()
  const recentOrders = await getRecentOrders()
  const upcomingScheduled = await getUpcomingScheduled()

  // Order stat cards (highlighted row)
  const orderCards = [
    {
      label: "Đơn hàng hôm nay",
      value: stats.todayOrders.toString(),
      icon: ShoppingCart,
      badge: stats.todayOrders > 0 ? "Mới" : null,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Chờ xác nhận",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      badge: stats.pendingOrders > 0 ? `${stats.pendingOrders}` : null,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Doanh thu hôm nay",
      value: formatPrice(stats.todayRevenue),
      icon: DollarSign,
      badge: null,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Tổng doanh thu",
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      badge: null,
      color: "bg-[#eff4ff] text-[#102590]",
    },
  ]

  const statCards: Array<{
    label: string
    value: number
    icon: typeof Package
    trend?: string | null
    badge?: string | null
    extra?: React.ReactNode
    href?: string
  }> = [
    {
      label: "Tổng sản phẩm",
      value: stats.productCount,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Tổng bài viết",
      value: stats.postCount,
      icon: FileText,
      href: "/admin/posts",
      extra: (
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500"><span className="font-bold text-emerald-500">{stats.publishedPosts}</span> Xuất bản</span>
          <span className="text-xs text-gray-500"><span className="font-bold text-amber-500">{stats.draftPosts}</span> Nháp</span>
          {stats.scheduledPosts > 0 && (
            <span className="text-xs text-gray-500"><span className="font-bold text-blue-500">{stats.scheduledPosts}</span> Lên lịch</span>
          )}
        </div>
      ),
    },
    {
      label: "Chiến dịch",
      value: stats.totalCampaigns,
      icon: Megaphone,
      href: "/admin/campaigns",
      badge: stats.activeCampaigns > 0 ? `${stats.activeCampaigns} active` : null,
    },
    {
      label: "Form liên hệ mới",
      value: stats.newContacts,
      icon: Mail,
      badge: stats.newContacts > 0 ? "Mới" : null,
      href: "/admin/contacts",
    },
  ]

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue mb-1">Chào mừng, Admin</h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Order Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {orderCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href="/admin/orders"
              className="bg-white p-5 border border-[#E2E8F0] rounded-xl shadow-sm hover:border-ocean-blue/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${card.color.split(" ")[0]}`}>
                  <Icon className={`w-4 h-4 ${card.color.split(" ")[1]}`} />
                </div>
                {card.badge && (
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold rounded-full">
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{card.value}</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">{card.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon
          const Wrapper = card.href ? Link : "div"
          return (
            <Wrapper
              key={card.label}
              href={card.href || "#"}
              className="bg-white p-6 border border-[#E2E8F0] rounded-xl shadow-sm hover:border-ocean-blue/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-ocean-blue/5 transition-colors">
                  <Icon className="w-5 h-5 text-ocean-blue" />
                </div>
                {card.extra || null}
                {card.badge && (
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase">
                    {card.badge}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{card.value}</h3>
              <p className="text-[13px] text-gray-500">{card.label}</p>
            </Wrapper>
          )
        })}
      </div>

      {/* Upcoming Scheduled Posts */}
      {upcomingScheduled.length > 0 && (
        <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-blue-100 bg-blue-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-800">Bài viết sắp xuất bản</h3>
            </div>
            <Link href="/admin/calendar" className="text-xs text-blue-600 hover:underline">
              Xem lịch
            </Link>
          </div>
          <div className="divide-y divide-blue-100">
            {upcomingScheduled.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-blue-50/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate">{post.title}</span>
                  {post.campaign && (
                    <span
                      className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: post.campaign.color + "15", color: post.campaign.color }}
                    >
                      {post.campaign.name}
                    </span>
                  )}
                </div>
                <span className="text-xs text-blue-600 font-medium shrink-0 ml-3">
                  {post.scheduledAt && formatDateTime(post.scheduledAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
          <h3 className="text-base font-semibold text-deep-blue">Đơn hàng gần đây</h3>
          <Link href="/admin/orders" className="text-sm text-ocean-blue hover:underline">
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Tổng</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const statusColor: Record<string, string> = {
                    pending: "bg-yellow-50 text-yellow-700",
                    confirmed: "bg-blue-50 text-blue-700",
                    shipping: "bg-purple-50 text-purple-700",
                    delivered: "bg-emerald-50 text-emerald-700",
                    cancelled: "bg-red-50 text-red-700",
                  }
                  const statusLabel: Record<string, string> = {
                    pending: "Chờ xử lý",
                    confirmed: "Đã xác nhận",
                    shipping: "Đang giao",
                    delivered: "Đã giao",
                    cancelled: "Đã hủy",
                  }
                  return (
                    <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-3">
                        <span className="text-sm font-bold text-[#102590]">{order.orderNumber}</span>
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm font-semibold text-gray-900">{order.fullName}</p>
                        <p className="text-xs text-gray-400">{order.phone}</p>
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[order.status] || "bg-gray-100 text-gray-500"}`}>
                          {statusLabel[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link href={`/admin/orders/${order.id}`} className="text-sm text-[#006EF5] hover:text-[#102590]">
                          <Eye className="h-4 w-4 inline" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content row */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Recent Posts Table */}
        <div className="lg:w-[70%] bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
            <h3 className="text-base font-semibold text-deep-blue">Bài viết gần đây</h3>
            <Link href="/admin/posts" className="text-sm text-ocean-blue hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {recentPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-[#eff4ff] flex items-center justify-center mb-3">
                          <FileText className="w-6 h-6 text-ocean-blue" />
                        </div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Chưa có bài viết nào</p>
                        <p className="text-xs text-gray-400">Hãy tạo bài viết đầu tiên cho website</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/posts/${post.id}`} className="text-sm font-bold text-gray-900 hover:text-ocean-blue">
                          {post.title}
                        </Link>
                        {post.campaign && (
                          <span
                            className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ backgroundColor: post.campaign.color + "15", color: post.campaign.color }}
                          >
                            {post.campaign.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{post.category?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? "bg-emerald-50 text-emerald-600"
                              : post.scheduledAt
                              ? "bg-blue-50 text-blue-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {post.published
                            ? "Đã xuất bản"
                            : post.scheduledAt
                            ? "Lên lịch"
                            : "Bản nháp"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:w-[30%] space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <h3 className="text-base font-semibold text-deep-blue mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <Link
                href="/admin/posts/new"
                className="w-full flex items-center justify-between p-4 bg-[#eff4ff] hover:bg-ocean-blue hover:text-white rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-ocean-blue group-hover:text-white" />
                  <span className="text-sm font-bold">Tạo bài viết mới</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/admin/campaigns/new"
                className="w-full flex items-center justify-between p-4 bg-[#eff4ff] hover:bg-ocean-blue hover:text-white rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Megaphone className="w-5 h-5 text-ocean-blue group-hover:text-white" />
                  <span className="text-sm font-bold">Tạo chiến dịch</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/admin/popups/new"
                className="w-full flex items-center justify-between p-4 bg-[#eff4ff] hover:bg-ocean-blue hover:text-white rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-ocean-blue group-hover:text-white" />
                  <span className="text-sm font-bold">Tạo popup / banner</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/admin/products/new"
                className="w-full flex items-center justify-between p-4 bg-[#eff4ff] hover:bg-ocean-blue hover:text-white rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-ocean-blue group-hover:text-white" />
                  <span className="text-sm font-bold">Thêm sản phẩm</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
              <Link
                href="/admin/contacts"
                className="w-full flex items-center justify-between p-4 bg-[#eff4ff] hover:bg-ocean-blue hover:text-white rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-ocean-blue group-hover:text-white" />
                  <span className="text-sm font-bold">Xem form liên hệ</span>
                </div>
                <div className="flex items-center gap-2">
                  {stats.newContacts > 0 && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                      {stats.newContacts}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </Link>
              <SapoSyncButton />
            </div>
          </div>

          {/* AI Card */}
          <div className="relative rounded-xl overflow-hidden p-6 bg-deep-blue text-white shadow-lg">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-ocean-blue" />
                <p className="text-xs font-bold tracking-widest uppercase">Hỗ trợ bởi AI</p>
              </div>
              <p className="text-base font-semibold mb-2">Tạo nội dung với AI</p>
              <p className="text-[13px] text-white/70 mb-4">
                Sử dụng AI để viết bài blog SEO-optimized cho APLUS Technologies.
              </p>
              <Link
                href="/admin/posts/new"
                className="text-sm font-bold flex items-center gap-2 hover:translate-x-1 transition-transform"
              >
                Bắt đầu <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
