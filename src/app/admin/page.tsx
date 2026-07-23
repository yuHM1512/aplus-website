import { prisma } from "@/lib/prisma"
import { Package, FileText, Mail, BarChart3, TrendingUp, Plus, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
  const [productCount, postCount, publishedPosts, draftPosts, contactCount, newContacts] =
    await Promise.all([
      prisma.product.count(),
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { status: "new" } }),
    ])

  return { productCount, postCount, publishedPosts, draftPosts, contactCount, newContacts }
}

async function getRecentPosts() {
  return prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()
  const recentPosts = await getRecentPosts()

  const statCards: Array<{
    label: string
    value: number
    icon: typeof Package
    trend?: string | null
    badge?: string | null
    extra?: React.ReactNode
  }> = [
    {
      label: "Tổng sản phẩm",
      value: stats.productCount,
      icon: Package,
      trend: null,
    },
    {
      label: "Tổng bài viết",
      value: stats.postCount,
      icon: FileText,
      extra: (
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500"><span className="font-bold text-emerald-500">{stats.publishedPosts}</span> Xuất bản</span>
          <span className="text-xs text-gray-500"><span className="font-bold text-amber-500">{stats.draftPosts}</span> Nháp</span>
        </div>
      ),
    },
    {
      label: "Form liên hệ mới",
      value: stats.newContacts,
      icon: Mail,
      badge: stats.newContacts > 0 ? "Mới" : null,
    },
    {
      label: "Tổng liên hệ",
      value: stats.contactCount,
      icon: BarChart3,
      trend: null,
    },
  ]

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-white p-6 border border-[#E2E8F0] rounded-xl shadow-sm hover:border-ocean-blue/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#eff4ff] rounded-lg group-hover:bg-ocean-blue/5 transition-colors">
                  <Icon className="w-5 h-5 text-ocean-blue" />
                </div>
                {card.extra || null}
                {card.badge && (
                  <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded uppercase">
                    {card.badge}
                  </span>
                )}
                {card.trend && (
                  <span className="text-emerald-500 text-xs font-bold flex items-center">
                    {card.trend} <TrendingUp className="w-3 h-3 ml-0.5" />
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{card.value}</h3>
              <p className="text-[13px] text-gray-500">{card.label}</p>
            </div>
          )
        })}
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
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{post.category?.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            post.published
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {post.published ? "Đã xuất bản" : "Bản nháp"}
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
