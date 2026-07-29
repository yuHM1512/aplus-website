import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import {
  sendSurveyConfirmationToCustomer,
  sendNewSurveyToAdmin,
  type SurveyEmailData,
} from "@/lib/mailer"
import { pushSurveyCustomerToSapo } from "@/lib/sapo-push-customer"

// ─── Validation ─────────────────────────────────────────
// Email là TÙY CHỌN: cho phép rỗng, nếu có thì phải đúng định dạng
const surveySchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
  address: z.string().min(3, "Vui lòng nhập địa chỉ"),
  waterSources: z.array(z.string()).min(1, "Chọn ít nhất 1 nguồn nước"),
  houseType: z.string().min(1, "Chọn loại nhà"),
  budget: z.string().min(1, "Chọn mức đầu tư"),
  issues: z.array(z.string()).min(1, "Chọn ít nhất 1 vấn đề"),
})

// ─── POST /api/survey ──────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = surveySchema.parse(body)

    // Chuẩn hóa email rỗng -> null
    const email = data.email && data.email.trim() !== "" ? data.email.trim() : null

    // 1) Lưu khảo sát vào DB (nguồn dữ liệu chính — luôn an toàn dù email/Sapo lỗi)
    const survey = await prisma.surveySubmission.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email,
        address: data.address,
        waterSources: data.waterSources,
        houseType: data.houseType,
        budget: data.budget,
        issues: data.issues,
        status: "new",
      },
    })

    console.log(
      `[survey] New submission: ${survey.id} — ${data.fullName} — ${data.phone}`
    )

    const emailData: SurveyEmailData = {
      fullName: data.fullName,
      phone: data.phone,
      email,
      address: data.address,
      waterSources: data.waterSources,
      houseType: data.houseType,
      budget: data.budget,
      issues: data.issues,
    }

    // 2) Email — chạy nền, KHÔNG await để không làm chậm response
    //    - Xác nhận cho khách (chỉ khi có email)
    //    - Thông báo cho admin
    Promise.all([
      sendSurveyConfirmationToCustomer(emailData),
      sendNewSurveyToAdmin(emailData),
    ]).catch((err) => console.error("[survey] email error:", err))

    // 3) Đẩy tạo customer trên Sapo — chạy nền, KHÔNG block response.
    //    Lưu lại sapoCustomerId vào bản khảo sát để đối chiếu về sau.
    pushSurveyCustomerToSapo({
      fullName: data.fullName,
      phone: data.phone,
      email,
      address: data.address,
      waterSources: data.waterSources,
      houseType: data.houseType,
      budget: data.budget,
      issues: data.issues,
    })
      .then(async (r) => {
        if (r.success) {
          // Lưu liên kết sapoCustomerId (kể cả khi SĐT đã tồn tại) — chỉ ghi vào DB local,
          // KHÔNG chỉnh sửa gì trên Sapo.
          if (r.sapoCustomerId) {
            await prisma.surveySubmission
              .update({
                where: { id: survey.id },
                data: { sapoCustomerId: r.sapoCustomerId },
              })
              .catch((e: unknown) => console.error("[survey] lưu sapoCustomerId lỗi:", e))
          }
          const label = r.existed ? "đã tồn tại — giữ nguyên" : "tạo mới"
          console.log(
            `[survey] ${survey.id} → Sapo customer #${r.sapoCustomerId ?? "?"} (${label})`
          )
        } else if (r.skipped) {
          console.log(`[survey] ${survey.id} — bỏ qua Sapo: ${r.error}`)
        } else {
          console.error(`[survey] ${survey.id} — đẩy Sapo THẤT BẠI: ${r.error}`)
        }
      })
      .catch((err) => console.error("[survey] Sapo push error:", err))

    return NextResponse.json({ success: true, id: survey.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      )
    }
    console.error("[survey] Error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
