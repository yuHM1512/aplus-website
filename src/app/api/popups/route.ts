import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/popups?page=/products
 * Trả về popup đang active cho trang cụ thể
 */
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "/"

  const now = new Date()

  const popups = await prisma.popup.findMany({
    where: {
      active: true,
      OR: [
        // Không set lịch → luôn hiện
        { startDate: null, endDate: null },
        // Trong khoảng thời gian hiển thị
        { startDate: { lte: now }, endDate: { gte: now } },
        // Chỉ set startDate
        { startDate: { lte: now }, endDate: null },
        // Chỉ set endDate
        { startDate: null, endDate: { gte: now } },
      ],
      showOnPages: { has: page },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(popups)
}
