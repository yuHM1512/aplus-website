import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product) notFound()

  return <ProductForm product={{
    ...product,
    published: (product as { published?: boolean }).published ?? true,
    price: (product as { price?: string | null }).price ?? null,
    specs: (product as { specs?: string | null }).specs ?? null,
  }} />
}
