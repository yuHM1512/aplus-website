import { prisma } from "@/lib/prisma"
import { PostForm } from "@/components/admin/post-form"

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } })
  return <PostForm categories={categories} />
}
