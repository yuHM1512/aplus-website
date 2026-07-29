import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/popups/track
 * Ghi nhận impression hoặc click cho popup
 */
export async function POST(req: Request) {
  const { popupId, action } = await req.json()

  if (!popupId || !["impression", "click"].includes(action)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 })
  }

  try {
    await prisma.popup.update({
      where: { id: popupId },
      data: action === "impression"
        ? { impressions: { increment: 1 } }
        : { clicks: { increment: 1 } },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Popup not found" }, { status: 404 })
  }
}
