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

          {/* Google Maps */}
          <div className="mt-8 overflow-hidden rounded-lg border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.204!2d109.2196!3d13.7756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f6c53b4448aef%3A0xb4f95b0f5f11dec6!2s95%20L%C3%AA%20H%E1%BB%93ng%20Phong%2C%20Tr%E1%BA%A7n%20H%C6%B0ng%20%C4%90%E1%BA%A1o%2C%20Th%C3%A0nh%20ph%E1%BB%91%20Quy%20Nh%C6%A1n%2C%20B%C3%ACnh%20%C4%90%E1%BB%8Bnh!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="APLUS Technologies — 95 Lê Hồng Phong, Quy Nhơn"
            />
            <div className="bg-white px-6 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">95 Lê Hồng Phong, TP Quy Nhơn, Bình Định</span>
              <a
                href="https://maps.app.goo.gl/jd5QysnC51g9GcKA6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#006EF5] hover:underline"
              >
                Mở trong Google Maps &rarr;
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
