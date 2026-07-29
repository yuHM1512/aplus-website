"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft, Save, Upload, X, Loader2, Code, ImageIcon, Eye,
  Monitor, Smartphone, ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "./toast"

interface Campaign {
  id: string
  name: string
}

interface PopupFormProps {
  popup?: {
    id: string
    name: string
    type: string
    contentType: string
    imageUrl: string | null
    htmlContent: string | null
    linkUrl: string | null
    linkTarget: string
    position: string
    showOnPages: string[]
    displayFrequency: string
    delay: number
    active: boolean
    startDate: string | null
    endDate: string | null
    campaignId: string | null
  }
  campaigns?: Campaign[]
}

const TYPE_OPTIONS = [
  { value: "popup", label: "Popup (cửa sổ)", description: "Hiện ở giữa màn hình, overlay nền tối" },
  { value: "top_banner", label: "Banner đầu trang", description: "Dải banner cố định ở đầu trang" },
  { value: "landing_hero", label: "Landing Hero", description: "Section lớn thay hero banner trên trang chủ" },
]

const POSITION_OPTIONS = [
  { value: "center", label: "Giữa màn hình" },
  { value: "top", label: "Đầu trang" },
  { value: "bottom", label: "Cuối trang" },
  { value: "fullscreen", label: "Toàn màn hình" },
]

const FREQUENCY_OPTIONS = [
  { value: "every_visit", label: "Mỗi lần truy cập" },
  { value: "once_per_session", label: "1 lần / phiên" },
  { value: "once_per_day", label: "1 lần / ngày" },
]

const PAGE_OPTIONS = [
  { value: "/", label: "Trang chủ" },
  { value: "/products", label: "Sản phẩm" },
  { value: "/blog", label: "Blog" },
  { value: "/about", label: "Giới thiệu" },
  { value: "/contact", label: "Liên hệ" },
  { value: "/projects", label: "Dự án" },
]

export function PopupForm({ popup, campaigns = [] }: PopupFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!popup
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: popup?.name || "",
    type: popup?.type || "popup",
    contentType: popup?.contentType || "image",
    imageUrl: popup?.imageUrl || "",
    htmlContent: popup?.htmlContent || "",
    linkUrl: popup?.linkUrl || "",
    linkTarget: popup?.linkTarget || "_self",
    position: popup?.position || "center",
    showOnPages: popup?.showOnPages || ["/"],
    displayFrequency: popup?.displayFrequency || "every_visit",
    delay: popup?.delay || 0,
    active: popup?.active || false,
    startDate: popup?.startDate ? new Date(popup.startDate).toISOString().slice(0, 16) : "",
    endDate: popup?.endDate ? new Date(popup.endDate).toISOString().slice(0, 16) : "",
    campaignId: popup?.campaignId || "",
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  // Fetch campaigns
  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns)
  useEffect(() => {
    if (campaigns.length === 0) {
      fetch("/api/admin/campaigns")
        .then((res) => res.json())
        .then((data) => { if (Array.isArray(data)) setCampaignList(data) })
        .catch(() => {})
    }
  }, [campaigns])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      setForm((prev) => ({ ...prev, imageUrl: url }))
    } catch {
      toast("Không thể tải ảnh lên", "error")
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const url = isEdit ? `/api/admin/popups/${popup.id}` : "/api/admin/popups"
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Có lỗi xảy ra")
        toast(data.error || "Có lỗi xảy ra", "error")
        setLoading(false)
        return
      }

      toast(isEdit ? "Đã cập nhật popup" : "Đã tạo popup mới")
      router.push("/admin/popups")
      router.refresh()
    } catch {
      setError("Không thể kết nối server")
    }
    setLoading(false)
  }

  const togglePage = (page: string) => {
    setForm((prev) => ({
      ...prev,
      showOnPages: prev.showOnPages.includes(page)
        ? prev.showOnPages.filter((p) => p !== page)
        : [...prev.showOnPages, page],
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/popups" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h2 className="text-2xl font-semibold text-deep-blue">
            {isEdit ? "Chỉnh sửa Popup / Banner" : "Tạo Popup / Banner"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Xem trước
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            {loading ? "Đang lưu..." : "Lưu popup"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      {/* Preview */}
      {showPreview && (
        <div className="mb-6 bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2">
            <Monitor className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Xem trước</span>
          </div>
          <div className="p-6 flex justify-center">
            <div
              className="relative bg-gray-100 rounded-lg overflow-hidden"
              style={{ width: form.type === "top_banner" ? "100%" : "400px", maxWidth: "100%" }}
            >
              {form.contentType === "image" && form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" className="w-full h-auto" />
              ) : form.contentType === "html" && form.htmlContent ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: form.htmlContent }}
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                  Chưa có nội dung
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tên & Loại */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Tên popup *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                placeholder="VD: Banner Tết 2027, Popup khuyến mãi..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 mb-3 block">Loại hiển thị</label>
              <div className="space-y-2">
                {TYPE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      form.type === opt.value ? "border-ocean-blue bg-ocean-blue/5" : "border-[#E2E8F0] hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={opt.value}
                      checked={form.type === opt.value}
                      onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                      className="w-4 h-4 text-ocean-blue mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                      <p className="text-xs text-gray-400">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Nội dung — Image hoặc HTML */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Nội dung popup</label>

            {/* Tab chọn loại nội dung */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, contentType: "image" }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  form.contentType === "image"
                    ? "bg-ocean-blue text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Upload ảnh
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, contentType: "html" }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  form.contentType === "html"
                    ? "bg-ocean-blue text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Code className="w-4 h-4" />
                Mã HTML
              </button>
            </div>

            {form.contentType === "image" ? (
              <div>
                {form.imageUrl ? (
                  <div className="relative group rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <img src={form.imageUrl} alt="Popup" className="w-full h-auto max-h-[400px] object-contain" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, imageUrl: "" }))}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-ocean-blue hover:text-ocean-blue transition-colors mb-3 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-sm">Đang tải lên...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8" />
                        <span className="text-sm font-medium">Kéo thả hoặc click để upload</span>
                        <span className="text-xs">PNG, JPEG, GIF — tối đa 5MB</span>
                      </>
                    )}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    e.target.value = ""
                    handleUpload(file)
                  }}
                />

                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs focus:border-ocean-blue outline-none"
                  placeholder="Hoặc dán URL ảnh..."
                />
              </div>
            ) : (
              <div>
                <textarea
                  value={form.htmlContent}
                  onChange={(e) => setForm((prev) => ({ ...prev, htmlContent: e.target.value }))}
                  rows={12}
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg text-sm font-mono focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none resize-y"
                  placeholder={`<div style="background: #102590; color: white; padding: 40px; text-align: center;">
  <h2>Khuyến mãi Tết 2027</h2>
  <p>Giảm giá đến 30% tất cả sản phẩm</p>
  <a href="/products" style="...">Xem ngay</a>
</div>`}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Paste trực tiếp mã HTML đã design. Hỗ trợ inline CSS và hình ảnh.
                </p>
              </div>
            )}
          </div>

          {/* Link khi click */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Link khi click</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.linkUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, linkUrl: e.target.value }))}
                  className="flex-1 px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none"
                  placeholder="/products hoặc https://..."
                />
                <select
                  value={form.linkTarget}
                  onChange={(e) => setForm((prev) => ({ ...prev, linkTarget: e.target.value }))}
                  className="px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
                >
                  <option value="_self">Cùng tab</option>
                  <option value="_blank">Tab mới</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trạng thái */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Kích hoạt</label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form.active ? "bg-emerald-500" : "bg-gray-300"
                }`}
                onClick={() => setForm((prev) => ({ ...prev, active: !prev.active }))}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    form.active ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-700">
                {form.active ? "Đang hiển thị" : "Đã tắt"}
              </span>
            </label>
          </div>

          {/* Vị trí & Hiển thị */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-4">
            {form.type === "popup" && (
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">Vị trí popup</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
                >
                  {POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Tần suất hiển thị</label>
              <select
                value={form.displayFrequency}
                onChange={(e) => setForm((prev) => ({ ...prev, displayFrequency: e.target.value }))}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
              >
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Delay (ms)</label>
              <input
                type="number"
                min={0}
                step={500}
                value={form.delay}
                onChange={(e) => setForm((prev) => ({ ...prev, delay: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none"
                placeholder="0"
              />
              <p className="text-xs text-gray-400 mt-1">0 = hiện ngay, 2000 = sau 2 giây</p>
            </div>
          </div>

          {/* Hiển thị trên trang */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Hiển thị trên trang</label>
            <div className="space-y-2">
              {PAGE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showOnPages.includes(opt.value)}
                    onChange={() => togglePage(opt.value)}
                    className="w-4 h-4 rounded text-ocean-blue"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                  <span className="text-xs text-gray-400">{opt.value}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Lịch hiển thị */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-4">
            <label className="text-sm font-medium text-gray-900 mb-1 block">Lịch hiển thị</label>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Bắt đầu</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kết thúc</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none"
              />
            </div>
            <p className="text-xs text-gray-400">Để trống = hiển thị không giới hạn thời gian</p>
          </div>

          {/* Chiến dịch */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-1.5 block">Chiến dịch</label>
            <select
              value={form.campaignId}
              onChange={(e) => setForm((prev) => ({ ...prev, campaignId: e.target.value }))}
              className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
            >
              <option value="">Không thuộc chiến dịch</option>
              {campaignList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </form>
  )
}
