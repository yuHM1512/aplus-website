import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const products = await prisma.product.findMany({ orderBy: { order: "asc" } })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, slug, description, image, category, categoryName, brand, featured, order, price, priceOriginal, badge, specs, published } = body

  if (!name || !slug) {
    return NextResponse.json({ error: "Tên và slug là bắt buộc" }, { status: 400 })
  }

  const existing = await prisma.product.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: { name, slug, description, image, category, categoryName, brand, featured, order, price, priceOriginal, badge, specs, published },
  })

  return NextResponse.json(product, { status: 201 })
}
