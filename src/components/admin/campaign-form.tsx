"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Megaphone } from "lucide-react"
import Link from "next/link"
import { useToast } from "./toast"

const STATUS_OPTIONS = [
  { value: "planning", label: "Đang lên kế hoạch", color: "bg-gray-100 text-gray-700" },
  { value: "active", label: "Đang chạy", color: "bg-emerald-50 text-emerald-700" },
  { value: "paused", label: "Tạm dừng", color: "bg-amber-50 text-amber-700" },
  { value: "completed", label: "Đã kết thúc", color: "bg-blue-50 text-blue-700" },
]

const COLOR_PRESETS = [
  "#006EF5", "#102590", "#36D1FF", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
]

interface CampaignFormProps {
  campaign?: {
    id: string
    name: string
    slug: string
    description: string | null
    status: string
    startDate: string | null
    endDate: string | null
    color: string
  }
}

export function CampaignForm({ campaign }: CampaignFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!campaign

  const [form, setForm] = useState({
    name: campaign?.name || "",
    slug: campaign?.slug || "",
    description: campaign?.description || "",
    status: campaign?.status || "planning",
    startDate: campaign?.startDate ? new Date(campaign.startDate).toISOString().slice(0, 10) : "",
    endDate: campaign?.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : "",
    color: campaign?.color || "#006EF5",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const url = isEdit ? `/api/admin/campaigns/${campaign.id}` : "/api/admin/campaigns"
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

      toast(isEdit ? "Đã cập nhật chiến dịch" : "Đã tạo chiến dịch mới")
      router.push("/admin/campaigns")
      router.refresh()
    } catch {
      setError("Không thể kết nối server")
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/campaigns" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: form.color }} />
            <h2 className="text-2xl font-semibold text-deep-blue">
              {isEdit ? "Chỉnh sửa chiến dịch" : "Tạo chiến dịch mới"}
            </h2>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {loading ? "Đang lưu..." : "Lưu chiến dịch"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Tên chiến dịch *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                placeholder="VD: Khuyến mãi Tết Nguyên Đán 2027"
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
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none resize-none"
                placeholder="Mô tả mục tiêu, nội dung chính của chiến dịch..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trạng thái */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Trạng thái</label>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 p-2.5 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={form.status === opt.value}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                    className="w-4 h-4 text-ocean-blue"
                  />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${opt.color}`}>
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-4">
            <label className="text-sm font-medium text-gray-900 mb-1 block">Timeline chiến dịch</label>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày bắt đầu</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày kết thúc</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none"
              />
            </div>
          </div>

          {/* Color */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Màu hiển thị</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    form.color === c ? "border-gray-900 scale-110" : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </form>
  )
}
