// src/app/api/admin/sapo/sync-products/route.ts
// Đồng bộ sản phẩm Sapo → APLUS local DB

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getAllProducts, mapSapoToLocal } from "@/lib/sapo"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 1. Kéo toàn bộ sản phẩm từ Sapo
    const sapoProducts = await getAllProducts()

    let created = 0
    let updated = 0
    let skipped = 0
    const errors: string[] = []

    // 2. Upsert từng sản phẩm vào DB local
    for (const sp of sapoProducts) {
      try {
        const localData = mapSapoToLocal(sp)

        // Kiểm tra đã tồn tại chưa (theo slug hoặc sapoProductId trong specs)
        const existing = await prisma.product.findUnique({
          where: { slug: localData.slug },
        })

        if (existing) {
          // Cập nhật — giữ nguyên featured, order, badge (do admin set thủ công)
          await prisma.product.update({
            where: { slug: localData.slug },
            data: {
              name: localData.name,
              description: localData.description,
              image: localData.image || existing.image, // Không ghi đè nếu Sapo không có ảnh
              category: localData.category,
              categoryName: localData.categoryName,
              brand: localData.brand,
              price: localData.price,
              priceOriginal: localData.priceOriginal,
              priceNumeric: localData.priceNumeric,
              sku: localData.sku,
              stock: localData.stock,
              specs: localData.specs,
              published: localData.published,
            },
          })
          updated++
        } else {
          // Tạo mới
          await prisma.product.create({ data: localData })
          created++
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        // Slug trùng có thể xảy ra nếu 2 SP Sapo tạo cùng slug
        if (msg.includes("Unique constraint")) {
          skipped++
        } else {
          errors.push(`SP "${sp.name}": ${msg}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: sapoProducts.length,
        created,
        updated,
        skipped,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: `Lỗi đồng bộ Sapo: ${message}` },
      { status: 500 }
    )
  }
}
