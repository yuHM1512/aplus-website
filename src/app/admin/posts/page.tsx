import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Sparkles } from "lucide-react"
import { DeletePostButton } from "@/components/admin/delete-post-button"

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  })

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Quản lý bài viết</h2>
          <p className="text-sm text-gray-500 mt-1">{posts.length} bài viết</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo bài viết
        </Link>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">AI</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-4">
                        <Sparkles className="w-7 h-7 text-ocean-blue" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Chưa có bài viết nào</p>
                      <p className="text-xs text-gray-400 mb-4">Bắt đầu tạo bài viết đầu tiên cho website của bạn</p>
                      <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Tạo bài viết
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/posts/${post.id}`} className="text-sm font-bold text-gray-900 hover:text-ocean-blue">
                        {post.title}
                      </Link>
                      <p className="text-[11px] text-gray-400 mt-0.5">/{post.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.category?.name || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      {post.aiGenerated ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
                          <Sparkles className="w-3 h-3" /> AI
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.published ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {post.published ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/posts/${post.id}`} className="p-2 text-gray-400 hover:text-ocean-blue hover:bg-ocean-blue/5 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
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
