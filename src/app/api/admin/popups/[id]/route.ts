import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const popup = await prisma.popup.findUnique({
    where: { id },
    include: { campaign: true },
  })

  if (!popup) {
    return NextResponse.json({ error: "Không tìm thấy popup" }, { status: 404 })
  }

  return NextResponse.json(popup)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  if (!body.name) {
    return NextResponse.json({ error: "Tên popup là bắt buộc" }, { status: 400 })
  }

  try {
    const popup = await prisma.popup.update({
      where: { id },
      data: {
        name: body.name,
        type: body.type,
        contentType: body.contentType,
        imageUrl: body.imageUrl,
        htmlContent: body.htmlContent,
        linkUrl: body.linkUrl,
        linkTarget: body.linkTarget,
        position: body.position,
        showOnPages: body.showOnPages,
        displayFrequency: body.displayFrequency,
        delay: body.delay,
        active: body.active,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        campaignId: body.campaignId || null,
      },
    })
    return NextResponse.json(popup)
  } catch {
    return NextResponse.json({ error: "Không tìm thấy popup" }, { status: 404 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    await prisma.popup.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Không tìm thấy popup" }, { status: 404 })
  }
}
