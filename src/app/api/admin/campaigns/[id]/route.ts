import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      posts: { orderBy: { createdAt: "desc" }, include: { category: true } },
      popups: { orderBy: { createdAt: "desc" } },
      _count: { select: { posts: true, popups: true } },
    },
  })

  if (!campaign) {
    return NextResponse.json({ error: "Không tìm thấy chiến dịch" }, { status: 404 })
  }

  return NextResponse.json(campaign)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  if (!body.name || !body.slug) {
    return NextResponse.json(
      { error: "Tên và slug chiến dịch là bắt buộc" },
      { status: 400 }
    )
  }

  const existing = await prisma.campaign.findUnique({ where: { slug: body.slug } })
  if (existing && existing.id !== id) {
    return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 })
  }

  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        status: body.status,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        color: body.color,
      },
    })
    return NextResponse.json(campaign)
  } catch {
    return NextResponse.json({ error: "Không tìm thấy chiến dịch" }, { status: 404 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    // Gỡ liên kết posts và popups trước khi xóa
    await prisma.post.updateMany({ where: { campaignId: id }, data: { campaignId: null } })
    await prisma.popup.updateMany({ where: { campaignId: id }, data: { campaignId: null } })
    await prisma.campaign.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Không tìm thấy chiến dịch" }, { status: 404 })
  }
}
