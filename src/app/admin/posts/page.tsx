"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Plus, Edit, Sparkles, Search, Filter, Calendar, Eye, CheckSquare, Square, Trash2, Send, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { DeletePostButton } from "@/components/admin/delete-post-button"

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  scheduledAt: string | null
  createdAt: string
  viewCount: number
  aiGenerated: boolean
  category: { id: string; name: string } | null
  campaign: { id: string; name: string; color: string } | null
}

interface Category {
  id: string
  name: string
}

// Trạng thái hiển thị
function getStatusInfo(post: Post) {
  if (post.published) return { label: "Đã xuất bản", color: "bg-emerald-50 text-emerald-600" }
  if (post.scheduledAt) {
    const d = new Date(post.scheduledAt)
    const dateStr = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
    return { label: `Lên lịch ${dateStr}`, color: "bg-blue-50 text-blue-600" }
  }
  return { label: "Bản nháp", color: "bg-amber-50 text-amber-600" }
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Categories for filter
  const [categories, setCategories] = useState<Category[]>([])

  // Load categories
  useEffect(() => {
    fetch("/api/admin/campaigns")
      .then(() => {}) // campaigns already handled
      .catch(() => {})
  }, [])

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (statusFilter) params.set("status", statusFilter)
    if (categoryFilter) params.set("categoryId", categoryFilter)
    params.set("page", page.toString())
    params.set("limit", "15")

    try {
      const res = await fetch(`/api/admin/posts?${params}`)
      const data = await res.json()
      setPosts(data.posts || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)

      // Trích xuất danh mục từ bài viết
      const cats = new Map<string, Category>()
      for (const p of data.posts || []) {
        if (p.category) cats.set(p.category.id, p.category)
      }
      if (cats.size > 0) setCategories(Array.from(cats.values()))
    } catch {
      setPosts([])
    }
    setLoading(false)
  }, [search, statusFilter, categoryFilter, page])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Debounce search
  const [searchInput, setSearchInput] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Bulk select
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === posts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(posts.map((p) => p.id)))
    }
  }

  // Bulk publish/unpublish
  const bulkAction = async (action: "publish" | "unpublish") => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return

    const promises = ids.map((id) =>
      fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...posts.find((p) => p.id === id),
          published: action === "publish",
          scheduledAt: null,
        }),
      })
    )

    await Promise.all(promises)
    setSelectedIds(new Set())
    fetchPosts()
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Quản lý bài viết</h2>
          <p className="text-sm text-gray-500 mt-1">{total} bài viết</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo bài viết
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
            />
          </div>

          {/* Quick filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="scheduled">Đã lên lịch</option>
            </select>

            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
                className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 border rounded-lg transition-colors ${
                showFilters ? "border-ocean-blue bg-ocean-blue/5 text-ocean-blue" : "border-[#E2E8F0] text-gray-400 hover:text-gray-600"
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bulk actions bar */}
        {selectedIds.size > 0 && (
          <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Đã chọn <strong className="text-ocean-blue">{selectedIds.size}</strong> bài viết
            </span>
            <button
              type="button"
              onClick={() => bulkAction("publish")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
            >
              <Send className="w-3 h-3" />
              Xuất bản
            </button>
            <button
              type="button"
              onClick={() => bulkAction("unpublish")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
            >
              <Clock className="w-3 h-3" />
              Gỡ xuất bản
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-4 w-10">
                  <button type="button" onClick={toggleSelectAll} className="text-gray-400 hover:text-ocean-blue">
                    {selectedIds.size === posts.length && posts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-ocean-blue" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chiến dịch</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Lượt xem</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="text-sm text-gray-400">Đang tải...</p>
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-4">
                        <Sparkles className="w-7 h-7 text-ocean-blue" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {search || statusFilter || categoryFilter
                          ? "Không tìm thấy bài viết phù hợp"
                          : "Chưa có bài viết nào"}
                      </p>
                      <p className="text-xs text-gray-400 mb-4">
                        {search || statusFilter || categoryFilter
                          ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                          : "Bắt đầu tạo bài viết đầu tiên cho website của bạn"}
                      </p>
                      {!search && !statusFilter && !categoryFilter && (
                        <Link
                          href="/admin/posts/new"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Tạo bài viết
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => {
                  const status = getStatusInfo(post)
                  return (
                    <tr key={post.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => toggleSelect(post.id)}
                          className="text-gray-400 hover:text-ocean-blue"
                        >
                          {selectedIds.has(post.id) ? (
                            <CheckSquare className="w-4 h-4 text-ocean-blue" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <Link href={`/admin/posts/${post.id}`} className="text-sm font-bold text-gray-900 hover:text-ocean-blue">
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[11px] text-gray-400">/{post.slug}</p>
                          {post.aiGenerated && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-600">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{post.category?.name || "—"}</td>
                      <td className="px-4 py-4">
                        {post.campaign ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: post.campaign.color + "15", color: post.campaign.color }}
                          >
                            {post.campaign.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-3.5 h-3.5" />
                          {post.viewCount || 0}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {post.scheduledAt && !post.published && <Calendar className="w-3 h-3 mr-1" />}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/posts/${post.id}`} className="p-2 text-gray-400 hover:text-ocean-blue hover:bg-ocean-blue/5 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeletePostButton id={post.id} title={post.title} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Trang {page} / {totalPages} ({total} bài viết)
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 border border-[#E2E8F0] rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page + i - 2
                if (p < 1 || p > totalPages) return null
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page ? "bg-ocean-blue text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 border border-[#E2E8F0] rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
