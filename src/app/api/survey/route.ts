import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Note: Prisma sẽ enable khi có DATABASE_URL thật
// Demo hiện tại chỉ log ra console
const surveySchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  address: z.string().min(3, "Vui lòng nhập địa chỉ"),
  waterSources: z.array(z.string()).min(1),
  houseType: z.string().min(1),
  budget: z.string().min(1),
  issues: z.array(z.string()).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = surveySchema.parse(body)

    // TODO: Save to database when Prisma is connected
    // await prisma.surveySubmission.create({ data })

    console.log("[survey] New submission:", {
      name: data.fullName,
      phone: data.phone,
      timestamp: new Date().toISOString(),
    })

    // TODO: Send email notification via Nodemailer

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
