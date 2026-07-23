import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image,
      category: body.category,
      categoryName: body.categoryName,
      brand: body.brand,
      featured: body.featured,
      order: body.order,
      price: body.price,
      priceOriginal: body.priceOriginal,
      badge: body.badge,
      specs: body.specs,
      published: body.published,
    },
  })

  return NextResponse.json(product)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
