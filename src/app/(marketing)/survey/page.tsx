import type { Metadata } from "next"
import { ShieldCheck, Users, Clock } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SurveyForm } from "@/components/forms/survey-form"

export const metadata: Metadata = {
  title: "Khảo sát nguồn nước miễn phí",
  description: "Đăng ký khảo sát nhu cầu lọc nước miễn phí với đội ngũ chuyên gia APLUS Technologies",
}

export default function SurveyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#102590] text-white py-16 lg:py-20 text-center">
        <Container>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Khảo Sát Nguồn Nước <span className="text-[#36D1FF]">Miễn Phí</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/80 text-base md:text-lg leading-relaxed">
            Chúng tôi giúp bạn tìm ra giải pháp lọc nước tối ưu cho gia đình
            thông qua 5 bước khảo sát nhanh chóng.
          </p>
        </Container>
      </section>

      {/* Form */}
      <section className="bg-[#F2F3F4] py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <SurveyForm />

            {/* Reassurance */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
              <div className="inline-flex items-center gap-2 justify-center text-gray-600">
                <ShieldCheck className="h-4 w-4 text-[#006EF5]" />
                Cam kết bảo mật thông tin
              </div>
              <div className="inline-flex items-center gap-2 justify-center text-gray-600">
                <Users className="h-4 w-4 text-[#006EF5]" />
                Tư vấn bởi chuyên gia hàng đầu
              </div>
              <div className="inline-flex items-center gap-2 justify-center text-gray-600">
                <Clock className="h-4 w-4 text-[#006EF5]" />
                Kết quả chỉ sau 24h
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
