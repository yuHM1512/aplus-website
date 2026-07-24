import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Edit, Trash2, Package } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"
import { shouldSkipImageOptimization } from "@/lib/images"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Quản lý sản phẩm</h2>
          <p className="text-sm text-gray-500 mt-1">{products.length} sản phẩm</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Nổi bật</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-4">
                        <Package className="w-7 h-7 text-ocean-blue" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Chưa có sản phẩm nào</p>
                      <p className="text-xs text-gray-400 mb-4">Thêm sản phẩm để hiển thị trên website</p>
                      <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Thêm sản phẩm
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded object-cover border border-[#E2E8F0]"
                            unoptimized={shouldSkipImageOptimization(product.image)}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-[#eff4ff] flex items-center justify-center">
                            <span className="text-ocean-blue text-xs">IMG</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900">{product.name}</p>
                          <p className="text-[11px] text-gray-400">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{product.categoryName || product.category || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      {product.featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-ocean-blue/10 text-ocean-blue">Nổi bật</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.published !== false
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {product.published !== false ? "Đang hiển thị" : "Đã ẩn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-gray-400 hover:text-ocean-blue hover:bg-ocean-blue/5 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
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
