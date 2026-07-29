// ─── Xóa toàn bộ sản phẩm hiện tại (seed) ───────────────
// Dùng một lần để dọn sạch sản phẩm mẫu trước khi sync lại từ Sapo.
// Chạy: npx tsx scripts/clear-products.ts
//
// An toàn: model Product KHÔNG có quan hệ FK tới Order/OrderItem
// (OrderItem chỉ lưu snapshot productId dạng string), nên xóa sản phẩm
// không ảnh hưởng đơn hàng đã có.

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const before = await prisma.product.count()
  const { count } = await prisma.product.deleteMany({})
  console.log(`🗑️  Đã xóa ${count}/${before} sản phẩm.`)
  console.log("➡️  Giờ vào /admin/sapo/sync-products để đồng bộ lại từ Sapo.")
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi xóa sản phẩm:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
