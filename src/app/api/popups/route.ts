import { NextRequest, NextResponse } from "next/server"
import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

const getActivePopups = unstable_cache(
  async (page: string) => {
    const now = new Date()

    return prisma.popup.findMany({
      where: {
        active: true,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } },
        ],
        showOnPages: { has: page },
      },
      orderBy: { createdAt: "desc" },
    })
  },
  ["active-popups"],
  { revalidate: 60, tags: ["popups"] }
)

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "/"
  const popups = await getActivePopups(page)

  return NextResponse.json(popups)
}
