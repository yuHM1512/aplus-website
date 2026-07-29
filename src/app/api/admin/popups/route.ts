import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const popups = await prisma.popup.findMany({
    orderBy: { createdAt: "desc" },
    include: { campaign: true },
  })
  return NextResponse.json(popups)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const {
    name, type, contentType, imageUrl, htmlContent,
    linkUrl, linkTarget, position, showOnPages,
    displayFrequency, delay, active, startDate, endDate, campaignId,
  } = body

  if (!name) {
    return NextResponse.json({ error: "Tên popup là bắt buộc" }, { status: 400 })
  }

  if (contentType === "image" && !imageUrl) {
    return NextResponse.json({ error: "Vui lòng upload ảnh cho popup" }, { status: 400 })
  }

  if (contentType === "html" && !htmlContent) {
    return NextResponse.json({ error: "Vui lòng nhập mã HTML cho popup" }, { status: 400 })
  }

  const popup = await prisma.popup.create({
    data: {
      name,
      type: type || "popup",
      contentType: contentType || "image",
      imageUrl,
      htmlContent,
      linkUrl,
      linkTarget: linkTarget || "_self",
      position: position || "center",
      showOnPages: showOnPages || ["/"],
      displayFrequency: displayFrequency || "every_visit",
      delay: delay || 0,
      active: active || false,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      campaignId: campaignId || null,
    },
  })

  return NextResponse.json(popup, { status: 201 })
}
