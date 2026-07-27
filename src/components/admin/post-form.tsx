"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Save, ArrowLeft, Sparkles, FileText, Upload, X, Loader2 } from "lucide-react"
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

interface PostFormProps {
  post?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverImage: string | null
    published: boolean
    categoryId: string | null
    aiGenerated: boolean
  }
  categories: Category[]
}

export function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!post

  const [tab, setTab] = useState<"manual" | "ai">(post?.aiGenerated ? "ai" : "manual")
  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    categoryId: post?.categoryId || "",
    aiGenerated: post?.aiGenerated || false,
    aiPrompt: "",
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)
  const [error, setError] = useState("")
  const coverInputRef = useRef<HTMLInputElement>(null)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u0111/g, "d")
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

  const submitPost = async (published: boolean) => {
    setLoading(true)
    setError("")

    const url = isEdit ? `/api/admin/posts/${post.id}` : "/api/admin/posts"
    const method = isEdit ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, published }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Có lỗi xảy ra")
      toast(data.error || "Có lỗi xảy ra", "error")
      setLoading(false)
      return
    }

    toast(isEdit ? "Đã cập nhật bài viết" : "Đã tạo bài viết mới")
    router.push("/admin/posts")
    router.refresh()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submitPost(form.published)
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
          <button
            type="button"
            onClick={() => submitPost(false)}
            disabled={loading}
            className="px-4 py-2.5 bg-white border border-[#E2E8F0] text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Lưu nháp
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => submitPost(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {loading ? "Đang lưu..." : "Xuất bản"}
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
          </div>
        </div>
      </div>
    </form>
  )
}
