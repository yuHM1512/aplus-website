import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log config:
// - Mặc định KHÔNG bật "error" trong log stream vì Neon serverless đóng connection
//   khi idle → mỗi lần idle sinh ra dòng "prisma:error Error in PostgreSQL
//   connection: Error { kind: Closed }" — đây là noise, không phải lỗi thật:
//   Prisma tự mở lại connection ở query kế tiếp và query vẫn chạy bình thường.
//   Lỗi query THẬT vẫn được throw về try/catch ở API routes.
// - Chỉ giữ "warn" cho các cảnh báo có ý nghĩa (schema mismatch, deprecation...).
// - Bật DEBUG_PRISMA_QUERIES=true khi cần debug query cụ thể.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.DEBUG_PRISMA_QUERIES === "true"
        ? ["query", "error", "warn"]
        : ["warn"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
