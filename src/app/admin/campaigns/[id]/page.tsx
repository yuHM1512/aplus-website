import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CampaignForm } from "@/components/admin/campaign-form"

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await prisma.campaign.findUnique({ where: { id } })

  if (!campaign) notFound()

  return (
    <CampaignForm
      campaign={{
        ...campaign,
        description: campaign.description,
        startDate: campaign.startDate?.toISOString() || null,
        endDate: campaign.endDate?.toISOString() || null,
      }}
    />
  )
}
