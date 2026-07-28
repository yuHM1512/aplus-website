// src/app/api/admin/sapo/debug-images/route.ts
// Debug: kiểm tra sản phẩm nào thiếu ảnh hoặc ảnh URL lỗi

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const allProducts = await prisma.product.findMany({
    where: { published: true },
    select: { id: true, name: true, image: true, slug: true },
    orderBy: { createdAt: "desc" },
  })

  const noImage = allProducts.filter((p) => !p.image)
  const withImage = allProducts.filter((p) => p.image)

  // Nhóm theo domain ảnh
  const domains: Record<string, number> = {}
  for (const p of withImage) {
    try {
      const hostname = new URL(p.image!).hostname
      domains[hostname] = (domains[hostname] || 0) + 1
    } catch {
      domains["INVALID_URL"] = (domains["INVALID_URL"] || 0) + 1
    }
  }

  return NextResponse.json({
    total: allProducts.length,
    withImage: withImage.length,
    noImage: noImage.length,
    noImageProducts: noImage.slice(0, 20).map((p) => ({ name: p.name, slug: p.slug })),
    imageDomains: domains,
  })
}
