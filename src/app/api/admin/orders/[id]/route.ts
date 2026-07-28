import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH /api/admin/orders/:id — update order status / payment
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const updateData: Record<string, string> = {}

    // Validate allowed fields
    if (body.status) {
      const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"]
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }
      updateData.status = body.status
    }

    if (body.paymentStatus) {
      const validPayment = ["unpaid", "paid"]
      if (!validPayment.includes(body.paymentStatus)) {
        return NextResponse.json({ error: "Invalid payment status" }, { status: 400 })
      }
      updateData.paymentStatus = body.paymentStatus
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("[admin/orders] Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// GET /api/admin/orders/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}
