import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/admin/post-form"

export default async function NewPostPage() {
  const [categories, campaigns] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.campaign.findMany({
      where: { status: { not: "completed" } },
      orderBy: { name: "asc" },
    }),
  ])
  return <PostForm categories={categories} campaigns={campaigns} />
}
