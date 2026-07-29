import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Edit, Megaphone, FileText, Image as ImageIcon, Trash2 } from "lucide-react"
import { DeleteCampaignButton } from "@/components/admin/delete-campaign-button"

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  planning: { label: "Lên kế hoạch", color: "bg-gray-100 text-gray-700" },
  active: { label: "Đang chạy", color: "bg-emerald-50 text-emerald-700" },
  paused: { label: "Tạm dừng", color: "bg-amber-50 text-amber-700" },
  completed: { label: "Đã kết thúc", color: "bg-blue-50 text-blue-700" },
}

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: true, popups: true } },
    },
  })

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      : "—"

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Chiến dịch Marketing</h2>
          <p className="text-sm text-gray-500 mt-1">{campaigns.length} chiến dịch</p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tạo chiến dịch
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-7 h-7 text-ocean-blue" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Chưa có chiến dịch nào</p>
          <p className="text-xs text-gray-400 mb-4">Tạo chiến dịch để gom nhóm bài viết và popup theo mục tiêu marketing</p>
          <Link
            href="/admin/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo chiến dịch đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((campaign: typeof campaigns[number]) => {
            const statusInfo = STATUS_LABELS[campaign.status] || STATUS_LABELS.planning
            return (
              <div
                key={campaign.id}
                className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden hover:border-ocean-blue/30 transition-all group"
              >
                {/* Color bar */}
                <div className="h-1.5" style={{ backgroundColor: campaign.color }} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/campaigns/${campaign.id}`}
                        className="text-base font-bold text-gray-900 hover:text-ocean-blue transition-colors block truncate"
                      >
                        {campaign.name}
                      </Link>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium mt-1 ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {campaign.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
                  )}

                  {/* Timeline */}
                  <div className="text-xs text-gray-400 mb-4">
                    {campaign.startDate || campaign.endDate ? (
                      <span>{formatDate(campaign.startDate)} → {formatDate(campaign.endDate)}</span>
                    ) : (
                      <span>Chưa đặt timeline</span>
                    )}
                  </div>

                  {/* Counts */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{campaign._count.posts} bài viết</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{campaign._count.popups} popup</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0]">
                    <Link
                      href={`/admin/campaigns/${campaign.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-ocean-blue hover:bg-ocean-blue/5 rounded-lg transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Chỉnh sửa
                    </Link>
                    <DeleteCampaignButton id={campaign.id} name={campaign.name} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
