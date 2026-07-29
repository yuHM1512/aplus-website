// ─── Backup toàn bộ database ra file JSON ───────────────
// Snapshot mọi bảng → backups/backup-<timestamp>.json
// Chạy: npx tsx scripts/backup-db.ts  (hoặc: npm run db:backup)
//
// Đây là lớp an toàn CHẠY TRƯỚC mọi lệnh migrate/push (đã wire trong
// package.json). Nếu migrate lỡ làm mất data, vẫn còn file JSON để đối chiếu.
// Lưu ý: đây là bản backup logic dạng JSON, dùng để tham chiếu/khôi phục thủ công.
// Để khôi phục nhanh nguyên trạng, ưu tiên Neon Instant Restore (point-in-time).

import { PrismaClient } from "@prisma/client"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const prisma = new PrismaClient()

async function main() {
  const startedAt = new Date()
  const stamp = startedAt.toISOString().replace(/[:.]/g, "-")
  const dir = join(process.cwd(), "backups")
  mkdirSync(dir, { recursive: true })

  // Đọc toàn bộ bảng. Post kèm quan hệ tag để không mất liên kết.
  const data = {
    _backupAt: startedAt.toISOString(),
    _note: "Backup logic dạng JSON — để khôi phục nhanh nên dùng Neon Instant Restore.",
    users: await prisma.user.findMany(),
    categories: await prisma.category.findMany(),
    tags: await prisma.tag.findMany(),
    posts: await prisma.post.findMany({ include: { tags: true } }),
    products: await prisma.product.findMany(),
    orders: await prisma.order.findMany(),
    orderItems: await prisma.orderItem.findMany(),
    contactSubmissions: await prisma.contactSubmission.findMany(),
    surveySubmissions: await prisma.surveySubmission.findMany(),
    siteSettings: await prisma.siteSetting.findMany(),
  }

  const file = join(dir, `backup-${stamp}.json`)
  writeFileSync(file, JSON.stringify(data, null, 2), "utf8")

  const counts = Object.entries(data)
    .filter(([k]) => !k.startsWith("_"))
    .map(([k, v]) => `${k}=${(v as unknown[]).length}`)
    .join(", ")

  console.log(`✅ Đã backup: backups/backup-${stamp}.json`)
  console.log(`   ${counts}`)
}

main()
  .catch((e) => {
    console.error("❌ Backup thất bại:", e)
    process.exit(1) // Fail cứng để lệnh migrate phía sau KHÔNG chạy khi backup lỗi
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
