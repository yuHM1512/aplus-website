import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PopupForm } from "@/components/admin/popup-form"

export default async function EditPopupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const popup = await prisma.popup.findUnique({
    where: { id },
    include: { campaign: true },
  })

  if (!popup) notFound()

  const campaigns = await prisma.campaign.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

  return (
    <PopupForm
      popup={{
        ...popup,
        imageUrl: popup.imageUrl,
        htmlContent: popup.htmlContent,
        linkUrl: popup.linkUrl,
        startDate: popup.startDate?.toISOString() || null,
        endDate: popup.endDate?.toISOString() || null,
      }}
      campaigns={campaigns}
    />
  )
}
