import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: true, popups: true } },
    },
  })
  return NextResponse.json(campaigns)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, slug, description, status, startDate, endDate, color } = body

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Tên và slug chiến dịch là bắt buộc" },
      { status: 400 }
    )
  }

  const existing = await prisma.campaign.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 })
  }

  const campaign = await prisma.campaign.create({
    data: {
      name,
      slug,
      description,
      status: status || "planning",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      color: color || "#006EF5",
    },
  })

  return NextResponse.json(campaign, { status: 201 })
}
