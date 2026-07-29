"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Save, ArrowLeft, Sparkles, FileText, Upload, X, Loader2, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useToast } from "./toast"

const RichTextEditor = dynamic(
  () => import("./rich-text-editor").then((m) => m.RichTextEditor),
  { ssr: false, loading: () => <div className="h-[400px] border border-[#E2E8F0] rounded-lg animate-pulse bg-gray-50" /> }
)

interface Category {
  id: string
  name: string
  slug: string
}

interface Campaign {
  id: string
  name: string
  slug: string
  status: string
}

interface PostFormProps {
  post?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverImage: string | null
    published: boolean
    scheduledAt: string | null
    categoryId: string | null
    campaignId: string | null
    aiGenerated: boolean
  }
  categories: Category[]
  campaigns?: Campaign[]
}

type PublishMode = "draft" | "publish" | "schedule"

export function PostForm({ post, categories, campaigns = [] }: PostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!post

  // Xác định chế độ xuất bản ban đầu
  const getInitialMode = (): PublishMode => {
    if (post?.published) return "publish"
    if (post?.scheduledAt) return "schedule"
    return "draft"
  }

  const [tab, setTab] = useState<"manual" | "ai">(post?.aiGenerated ? "ai" : "manual")
  const [publishMode, setPublishMode] = useState<PublishMode>(getInitialMode())
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    scheduledAt: post?.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : "",
    categoryId: post?.categoryId || "",
    campaignId: post?.campaignId || "",
    aiGenerated: post?.aiGenerated || false,
    aiPrompt: "",
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [error, setError] = useState("")
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Fetch campaigns khi component mount (nếu chưa truyền qua props)
  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns)
  useEffect(() => {
    if (campaigns.length === 0) {
      fetch("/api/admin/campaigns")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCampaignList(data)
        })
        .catch(() => {})
    }
  }, [campaigns])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : generateSlug(title),
    }))
  }

  const handleAiGenerate = async () => {
    if (!form.aiPrompt.trim()) return
    setAiLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.aiPrompt }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "AI generation failed")
        setAiLoading(false)
        return
      }

      const data = await res.json()
      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        content: data.content || prev.content,
        excerpt: data.excerpt || prev.excerpt,
        slug: data.title ? generateSlug(data.title) : prev.slug,
        aiGenerated: true,
      }))
    } catch {
      setError("Không thể kết nối AI service")
    }
    setAiLoading(false)
  }

  const submitPost = async () => {
    setLoading(true)
    setError("")

    // Validate lịch đăng
    if (publishMode === "schedule" && !form.scheduledAt) {
      setError("Vui lòng chọn thời gian lên lịch")
      setLoading(false)
      return
    }

    if (publishMode === "schedule" && new Date(form.scheduledAt) <= new Date()) {
      setError("Thời gian lên lịch phải ở tương lai")
      setLoading(false)
      return
    }

    const url = isEdit ? `/api/admin/posts/${post.id}` : "/api/admin/posts"
    const method = isEdit ? "PUT" : "POST"

    const payload = {
      ...form,
      published: publishMode === "publish",
      scheduledAt: publishMode === "schedule" ? form.scheduledAt : null,
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Có lỗi xảy ra")
      toast(data.error || "Có lỗi xảy ra", "error")
      setLoading(false)
      return
    }

    const modeLabel = publishMode === "publish" ? "xuất bản" : publishMode === "schedule" ? "lên lịch" : "lưu nháp"
    toast(isEdit ? `Đã cập nhật & ${modeLabel} bài viết` : `Đã tạo & ${modeLabel} bài viết mới`)
    router.push("/admin/posts")
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitPost()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h2 className="text-2xl font-semibold text-deep-blue">
            {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Nút lưu nháp */}
          <button
            type="button"
            onClick={() => { setPublishMode("draft"); setTimeout(() => submitPost(), 0) }}
            disabled={loading}
            className="px-4 py-2.5 bg-white border border-[#E2E8F0] text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Lưu nháp
          </button>
          {/* Nút xuất bản / lên lịch */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm disabled:opacity-70"
          >
            {publishMode === "schedule" ? (
              <Calendar className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading
              ? "Đang lưu..."
              : publishMode === "schedule"
              ? "Lên lịch đăng"
              : "Xuất bản"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-[#E2E8F0]">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setTab("manual")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "manual"
                ? "border-ocean-blue text-ocean-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            Viết thủ công
          </button>
          <button
            type="button"
            onClick={() => setTab("ai")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "ai"
                ? "border-ocean-blue text-ocean-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Viết bằng AI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Prompt (only in AI tab) */}
          {tab === "ai" && (
            <div className="bg-gradient-to-r from-deep-blue to-ocean-blue rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold">AI Content Generator</h3>
              </div>
              <textarea
                value={form.aiPrompt}
                onChange={(e) => setForm((prev) => ({ ...prev, aiPrompt: e.target.value }))}
                rows={3}
                placeholder="Mô tả nội dung bạn muốn viết... VD: Viết bài giới thiệu máy lọc nước RO 5 lõi của APLUS, nhấn mạnh công nghệ Nano và ưu điểm cho gia đình"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:border-white/50 outline-none resize-none"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={aiLoading || !form.aiPrompt.trim()}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 bg-white text-deep-blue rounded-lg text-sm font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Tạo nội dung
                  </>
                )}
              </button>
            </div>
          )}

          {/* Title & Content */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Tiêu đề *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                placeholder="Tiêu đề bài viết..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-mono focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Tóm tắt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none resize-none"
                placeholder="Tóm tắt ngắn cho SEO..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Nội dung *</label>
              <RichTextEditor
                content={form.content}
                onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
                placeholder="Nhập nội dung bài viết... Gõ / để chèn nhanh"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chế độ xuất bản */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Chế độ xuất bản</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="publishMode"
                  checked={publishMode === "draft"}
                  onChange={() => setPublishMode("draft")}
                  className="w-4 h-4 text-ocean-blue"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Bản nháp</span>
                  <p className="text-xs text-gray-400">Lưu nhưng chưa hiển thị</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="publishMode"
                  checked={publishMode === "publish"}
                  onChange={() => setPublishMode("publish")}
                  className="w-4 h-4 text-ocean-blue"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">Xuất bản ngay</span>
                  <p className="text-xs text-gray-400">Hiển thị trên website ngay lập tức</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-ocean-blue/30 rounded-lg cursor-pointer hover:bg-blue-50/50 transition-colors">
                <input
                  type="radio"
                  name="publishMode"
                  checked={publishMode === "schedule"}
                  onChange={() => setPublishMode("schedule")}
                  className="w-4 h-4 text-ocean-blue"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ocean-blue" />
                    <span className="text-sm font-medium text-gray-900">Lên lịch đăng</span>
                  </div>
                  <p className="text-xs text-gray-400">Tự động xuất bản vào thời gian chỉ định</p>
                </div>
              </label>
            </div>

            {/* Date-time picker cho schedule */}
            {publishMode === "schedule" && (
              <div className="mt-4 p-3 bg-blue-50/50 border border-ocean-blue/20 rounded-lg">
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Thời gian xuất bản
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
                />
                {form.scheduledAt && (
                  <p className="text-xs text-ocean-blue mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(form.scheduledAt).toLocaleString("vi-VN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Ảnh bìa */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Ảnh bìa</label>

            {form.coverImage ? (
              <div className="relative group rounded-lg overflow-hidden mb-3">
                <div className="relative aspect-[16/9] bg-gray-100">
                  <Image
                    src={form.coverImage}
                    alt="Ảnh bìa"
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, coverImage: "" }))}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  title="Xóa ảnh bìa"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="w-full aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-ocean-blue hover:text-ocean-blue transition-colors mb-3 disabled:opacity-50"
              >
                {coverUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-xs">Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    <span className="text-xs font-medium">Tải ảnh bìa lên</span>
                  </>
                )}
              </button>
            )}

            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                e.target.value = ""
                setCoverUploading(true)
                try {
                  const fd = new FormData()
                  fd.append("file", file)
                  const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
                  if (!res.ok) throw new Error()
                  const { url } = await res.json()
                  setForm((prev) => ({ ...prev, coverImage: url }))
                } catch {
                  toast("Không thể tải ảnh lên", "error")
                }
                setCoverUploading(false)
              }}
            />

            <input
              type="text"
              value={form.coverImage}
              onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs focus:border-ocean-blue outline-none"
              placeholder="Hoặc dán URL ảnh..."
            />
          </div>

          {/* Danh mục & Chiến dịch */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Danh mục</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Chiến dịch</label>
              <select
                value={form.campaignId}
                onChange={(e) => setForm((prev) => ({ ...prev, campaignId: e.target.value }))}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
              >
                <option value="">Không thuộc chiến dịch</option>
                {campaignList
                  .filter((c) => c.status !== "completed")
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
