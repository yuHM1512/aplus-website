import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Layers, Eye, MousePointer, Trash2, Power, PowerOff } from "lucide-react"
import { DeletePopupButton } from "@/components/admin/delete-popup-button"
import { TogglePopupButton } from "@/components/admin/toggle-popup-button"

const TYPE_LABELS: Record<string, string> = {
  popup: "Popup",
  top_banner: "Banner đầu trang",
  landing_hero: "Landing Hero",
}

export default async function PopupsPage() {
  const popups = await prisma.popup.findMany({
    orderBy: { createdAt: "desc" },
    include: { campaign: true },
  })

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
      : "—"

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Popup & Banner</h2>
          <p className="text-sm text-gray-500 mt-1">{popups.length} popup / banner</p>
        </div>
        <Link
          href="/admin/popups/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo Popup / Banner
        </Link>
      </div>

      {popups.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mx-auto mb-4">
            <Layers className="w-7 h-7 text-ocean-blue" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Chưa có popup / banner nào</p>
          <p className="text-xs text-gray-400 mb-4">Tạo popup quảng cáo hoặc banner khuyến mãi để thu hút khách hàng</p>
          <Link
            href="/admin/popups/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo popup đầu tiên
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Loại</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Chiến dịch</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Hiển thị</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Click</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lịch</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {popups.map((popup: typeof popups[number]) => {
                  const ctr = popup.impressions > 0 ? ((popup.clicks / popup.impressions) * 100).toFixed(1) : "0"
                  return (
                    <tr key={popup.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/admin/popups/${popup.id}`} className="text-sm font-bold text-gray-900 hover:text-ocean-blue">
                          {popup.name}
                        </Link>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {popup.contentType === "image" ? "Ảnh" : "HTML"} • {popup.showOnPages.join(", ")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {TYPE_LABELS[popup.type] || popup.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {popup.campaign ? (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: popup.campaign.color + "15", color: popup.campaign.color }}
                          >
                            {popup.campaign.name}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-3.5 h-3.5" />
                          {popup.impressions}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <MousePointer className="w-3.5 h-3.5" />
                            {popup.clicks}
                          </span>
                          <p className="text-[10px] text-gray-400">CTR: {ctr}%</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          popup.active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                        }`}>
                          {popup.active ? "Đang bật" : "Đã tắt"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {popup.startDate ? (
                          <div>
                            <p>{formatDate(popup.startDate)}</p>
                            <p className="text-gray-400">→ {formatDate(popup.endDate)}</p>
                          </div>
                        ) : (
                          "Không giới hạn"
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TogglePopupButton id={popup.id} active={popup.active} />
                          <Link href={`/admin/popups/${popup.id}`} className="p-2 text-gray-400 hover:text-ocean-blue hover:bg-ocean-blue/5 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeletePopupButton id={popup.id} name={popup.name} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
