import { prisma } from "@/lib/prisma"
import { Mail, Phone } from "lucide-react"
import { ContactStatusButton } from "@/components/admin/contact-status-button"

export default async function ContactsPage() {
  const contacts = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const statusColors: Record<string, string> = {
    new: "bg-red-50 text-red-600",
    read: "bg-blue-50 text-blue-600",
    replied: "bg-emerald-50 text-emerald-600",
  }

  const statusLabels: Record<string, string> = {
    new: "Mới",
    read: "Đã xem",
    replied: "Đã trả lời",
  }

  const needTypeLabels: Record<string, string> = {
    household: "Gia đình",
    industrial: "Công nghiệp",
    consulting: "Tư vấn",
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-deep-blue">Liên hệ & Khảo sát</h2>
        <p className="text-sm text-gray-500 mt-1">
          {contacts.length} liên hệ &middot; {contacts.filter((c) => c.status === "new").length} mới
        </p>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nhu cầu</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày gửi</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center mb-4">
                        <Mail className="w-7 h-7 text-ocean-blue" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Chưa có liên hệ nào</p>
                      <p className="text-xs text-gray-400">Khi khách hàng gửi form trên website, thông tin sẽ hiện ở đây</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className={`hover:bg-[#F8FAFC] transition-colors ${contact.status === "new" ? "bg-blue-50/30" : ""}`}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{contact.fullName}</p>
                      {contact.description && (
                        <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">{contact.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Phone className="w-3 h-3" /> {contact.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#eff4ff] text-deep-blue">
                        {needTypeLabels[contact.needType] || contact.needType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(contact.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[contact.status] || "bg-gray-100 text-gray-500"}`}>
                        {statusLabels[contact.status] || contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ContactStatusButton id={contact.id} currentStatus={contact.status} />
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
