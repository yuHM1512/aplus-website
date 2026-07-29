import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PostForm } from "@/components/admin/post-form"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, categories, campaigns] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.campaign.findMany({
      where: { status: { not: "completed" } },
      orderBy: { name: "asc" },
    }),
  ])

  if (!post) notFound()

  return (
    <PostForm
      post={{
        ...post,
        aiGenerated: post.aiGenerated ?? false,
        scheduledAt: post.scheduledAt?.toISOString() || null,
        campaignId: post.campaignId,
      }}
      categories={categories}
      campaigns={campaigns}
    />
  )
}
