import type { Metadata } from "next"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SITE_CONFIG } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ APLUS Technologies — Trụ sở Quy Nhơn và chi nhánh Hồ Chí Minh",
}

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#102590] text-white py-16">
        <Container>
          <h1 className="text-3xl md:text-4xl font-bold">Liên hệ với chúng tôi</h1>
          <p className="mt-3 text-white/80">Đội ngũ APLUS sẵn sàng hỗ trợ bạn 24/7</p>
        </Container>
      </section>

      <section className="bg-white py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Trụ sở chính */}
            <div className="bg-[#B5DBFF]/40 rounded-lg p-8">
              <div className="text-sm font-bold uppercase text-[#006EF5] mb-2">Trụ sở chính</div>
              <h2 className="text-xl font-bold text-[#102590] mb-6">Quy Nhơn, Bình Định</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#006EF5] mt-0.5 shrink-0" />
                  <span className="text-gray-700">95 Lê Hồng Phong, TP Quy Nhơn, tỉnh Bình Định</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#006EF5] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-700">Hotline: <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="font-bold text-[#102590] hover:underline">{SITE_CONFIG.phone}</a></div>
                    <div className="text-gray-700">Trụ sở: <a href={`tel:${SITE_CONFIG.officePhone.replace(/[\s()]/g, "")}`} className="hover:underline">{SITE_CONFIG.officePhone}</a></div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#006EF5] mt-0.5 shrink-0" />
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-[#102590] font-semibold hover:underline">{SITE_CONFIG.email}</a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#006EF5] mt-0.5 shrink-0" />
                  <span className="text-gray-700">7h30 - 22h00 (Thứ 2 - Thứ 7)</span>
                </li>
              </ul>
            </div>

            {/* Chi nhánh HCM */}
            <div className="bg-[#B5DBFF]/40 rounded-lg p-8">
              <div className="text-sm font-bold uppercase text-[#006EF5] mb-2">Chi nhánh</div>
              <h2 className="text-xl font-bold text-[#102590] mb-6">Hồ Chí Minh</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#006EF5] mt-0.5 shrink-0" />
                  <span className="text-gray-700">343/59 Nguyễn Trọng Tuyển, Tân Bình, Hồ Chí Minh</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#006EF5] mt-0.5 shrink-0" />
                  <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="font-bold text-[#102590] hover:underline">{SITE_CONFIG.phone}</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-8 aspect-[21/9] bg-[#F2F3F4] rounded-lg flex items-center justify-center border border-gray-100">
            <div className="text-center text-gray-500">
              <MapPin className="h-10 w-10 mx-auto mb-2 text-[#006EF5]" />
              <p>Google Maps embed sẽ được tích hợp khi có link chính thức</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
