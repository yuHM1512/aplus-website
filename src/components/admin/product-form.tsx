"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft, ImageIcon, Plus, X } from "lucide-react"
import Link from "next/link"
import { useToast } from "./toast"

interface ProductFormProps {
  product?: {
    id: string
    name: string
    slug: string
    description: string | null
    image: string | null
    category: string | null
    categoryName: string | null
    brand: string | null
    featured: boolean
    order: number
    price: string | null
    priceOriginal: string | null
    badge: string | null
    specs: string | null
    published: boolean
  }
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!product

  // Parse existing specs JSON into key-value pairs
  const parseSpecs = (specsStr: string | null): { key: string; value: string }[] => {
    if (!specsStr) return [{ key: "", value: "" }]
    try {
      const obj = JSON.parse(specsStr)
      const pairs = Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }))
      return pairs.length > 0 ? pairs : [{ key: "", value: "" }]
    } catch {
      return [{ key: "", value: "" }]
    }
  }

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    image: product?.image || "",
    category: product?.category || "",
    categoryName: product?.categoryName || "",
    brand: product?.brand || "",
    featured: product?.featured || false,
    order: product?.order || 0,
    price: product?.price || "",
    priceOriginal: product?.priceOriginal || "",
    badge: product?.badge || "",
    published: product?.published ?? true,
  })
  const [specPairs, setSpecPairs] = useState(parseSpecs(product?.specs || null))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\u0111/g, "d")
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

    const url = isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products"
    const method = isEdit ? "PUT" : "POST"

    // Serialize key-value specs to JSON string
    const specsObj: Record<string, string> = {}
    specPairs.forEach((pair) => {
      if (pair.key.trim()) specsObj[pair.key.trim()] = pair.value.trim()
    })
    const specs = Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : ""

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, specs }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Có lỗi xảy ra")
      toast(data.error || "Có lỗi xảy ra", "error")
      setLoading(false)
      return
    }

    toast(isEdit ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm mới")
    router.push("/admin/products")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h2 className="text-2xl font-semibold text-deep-blue">
              {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {loading ? "Đang lưu..." : "Lưu sản phẩm"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Tên sản phẩm *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                placeholder="VD: Máy lọc nước RO APLUS Pro"
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
                placeholder="Mô tả chi tiết sản phẩm..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">Giá</label>
                <input
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                  placeholder="VD: 5.500.000"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">Giá gốc (nếu giảm giá)</label>
                <input
                  type="text"
                  value={form.priceOriginal}
                  onChange={(e) => setForm((prev) => ({ ...prev, priceOriginal: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                  placeholder="VD: 6.500.000"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">Thương hiệu</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                  placeholder="VD: Karofi, AO Smith..."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">Nhãn (badge)</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                  placeholder="VD: Mới, Bán chạy, Sale 10%"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-2 block">Thông số kỹ thuật</label>
              <div className="space-y-2">
                {specPairs.map((pair, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pair.key}
                      onChange={(e) => {
                        const updated = [...specPairs]
                        updated[idx] = { ...updated[idx], key: e.target.value }
                        setSpecPairs(updated)
                      }}
                      className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                      placeholder="VD: Công suất"
                    />
                    <input
                      type="text"
                      value={pair.value}
                      onChange={(e) => {
                        const updated = [...specPairs]
                        updated[idx] = { ...updated[idx], value: e.target.value }
                        setSpecPairs(updated)
                      }}
                      className="flex-1 px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                      placeholder="VD: 10L/h"
                    />
                    {specPairs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSpecPairs(specPairs.filter((_, i) => i !== idx))}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSpecPairs([...specPairs, { key: "", value: "" }])}
                  className="flex items-center gap-1.5 text-sm text-ocean-blue hover:text-deep-blue font-medium mt-1 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm thông số
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6">
            <label className="text-sm font-medium text-gray-900 mb-3 block">Hình ảnh</label>
            {form.image ? (
              <div className="relative mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="" className="w-full h-40 object-cover rounded-lg border border-[#E2E8F0]" />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-full h-40 border-2 border-dashed border-[#E2E8F0] rounded-lg flex flex-col items-center justify-center text-gray-400 mb-3">
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-xs">Chưa có ảnh</span>
              </div>
            )}
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs focus:border-ocean-blue outline-none"
              placeholder="URL hình ảnh"
            />
          </div>

          {/* Category & Options */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Danh mục</label>
              <select
                value={form.category}
                onChange={(e) => {
                  const slug = e.target.value
                  const names: Record<string, string> = {
                    "he-thong-loc-nuoc": "Hệ thống lọc",
                    "may-loc-nuoc": "Máy lọc nước",
                    "thiet-bi-loc-nuoc": "Thiết bị lọc",
                    "loi-loc-nuoc": "Lõi lọc & Linh kiện",
                    "vat-lieu-loc": "Vật liệu lọc",
                    "dich-vu-bao-tri": "Dịch vụ bảo trì",
                  }
                  setForm((prev) => ({ ...prev, category: slug, categoryName: names[slug] || "" }))
                }}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
              >
                <option value="">Chọn danh mục</option>
                <option value="he-thong-loc-nuoc">Hệ thống lọc nước</option>
                <option value="may-loc-nuoc">Máy lọc nước</option>
                <option value="thiet-bi-loc-nuoc">Thiết bị lọc nước</option>
                <option value="loi-loc-nuoc">Lõi lọc & Linh kiện</option>
                <option value="vat-lieu-loc">Vật liệu lọc</option>
                <option value="dich-vu-bao-tri">Dịch vụ bảo trì</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Thứ tự hiển thị</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
                className="w-4 h-4 text-ocean-blue rounded border-gray-300 focus:ring-ocean-blue"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">Sản phẩm nổi bật</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={form.published}
                onChange={(e) => setForm((prev) => ({ ...prev, published: e.target.checked }))}
                className="w-4 h-4 text-ocean-blue rounded border-gray-300 focus:ring-ocean-blue"
              />
              <label htmlFor="published" className="text-sm text-gray-700">Hiển thị trên website</label>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
