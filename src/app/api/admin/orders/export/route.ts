import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// GET /api/admin/orders/export — export to CSV (Excel-compatible)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const search = searchParams.get("search")?.trim()
  const dateFrom = searchParams.get("dateFrom")
  const dateTo = searchParams.get("dateTo")

  const where: Prisma.OrderWhereInput = {}

  if (status && status !== "all") {
    where.status = status
  }

  if (search) {
    where.OR = [
      { phone: { contains: search, mode: "insensitive" } },
      { fullName: { contains: search, mode: "insensitive" } },
      { orderNumber: { contains: search, mode: "insensitive" } },
    ]
  }

  if (dateFrom || dateTo) {
    where.createdAt = {}
    if (dateFrom) where.createdAt.gte = new Date(dateFrom)
    if (dateTo) {
      const end = new Date(dateTo)
      end.setHours(23, 59, 59, 999)
      where.createdAt.lte = end
    }
  }

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  })

  const statusLabels: Record<string, string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  }

  const paymentLabels: Record<string, string> = {
    bank_transfer: "Chuyển khoản",
    cod: "COD",
  }

  // BOM for Excel UTF-8 recognition
  const BOM = "﻿"

  const headers = [
    "Mã đơn", "Ngày đặt", "Khách hàng", "SĐT", "Email",
    "Địa chỉ", "Phường/Xã", "Quận/Huyện", "Tỉnh/TP",
    "Sản phẩm", "Tạm tính", "Phí ship", "Tổng tiền",
    "Thanh toán", "TT Thanh toán", "Trạng thái", "Ghi chú",
  ]

  const rows = orders.map((order) => {
    const products = order.items
      .map((i) => `${i.productName} x${i.quantity}`)
      .join("; ")

    return [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString("vi-VN"),
      order.fullName,
      order.phone,
      order.email,
      order.address,
      order.ward,
      order.district,
      order.province,
      products,
      order.subtotal,
      order.shippingFee,
      order.total,
      paymentLabels[order.paymentMethod] || order.paymentMethod,
      order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán",
      statusLabels[order.status] || order.status,
      order.note || "",
    ]
  })

  const escapeCsv = (val: string | number) => {
    const str = String(val)
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csv =
    BOM +
    [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="don-hang-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
