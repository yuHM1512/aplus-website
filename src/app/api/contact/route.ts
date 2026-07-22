import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Simple contact endpoint (không dùng Prisma trong demo — sẽ enable khi có DB)
const contactSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    console.log("[contact] New message:", data)

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
