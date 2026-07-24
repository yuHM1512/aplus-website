import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail } from "lucide-react"
import { Container } from "@/components/ui/container"
import { SocialButtons } from "@/components/ui/social-buttons"
import { SITE_CONFIG } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-[#020035] text-white pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/images/logo/logo-white-horizontal.png"
              alt={SITE_CONFIG.name}
              width={200}
              height={44}
              className="h-10 w-auto"
            />
            <p className="text-sm text-white/70 leading-relaxed">
              Chuyên gia lọc nước hàng đầu Việt Nam. Cung cấp các giải pháp công nghệ nước tiên tiến nhất cho gia đình và doanh nghiệp.
            </p>
            <div className="pt-2">
              <SocialButtons size="md" />
            </div>
          </div>

          {/* Product categories */}
          <div>
            <h3 className="text-base font-bold uppercase mb-4">Sản phẩm</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/products?cat=he-thong-loc-nuoc" className="hover:text-[#36D1FF] transition-colors">Hệ thống lọc tổng</Link></li>
              <li><Link href="/products?cat=may-loc-nuoc" className="hover:text-[#36D1FF] transition-colors">Máy lọc nước RO</Link></li>
              <li><Link href="/products?cat=thiet-bi-loc-nuoc" className="hover:text-[#36D1FF] transition-colors">Thiết bị lọc nước</Link></li>
              <li><Link href="/products?cat=loi-loc-nuoc" className="hover:text-[#36D1FF] transition-colors">Lõi lọc & Linh kiện</Link></li>
              <li><Link href="/products?cat=vat-lieu-loc" className="hover:text-[#36D1FF] transition-colors">Vật liệu lọc</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-base font-bold uppercase mb-4">Dịch vụ & Chính sách</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-[#36D1FF] transition-colors">Giới thiệu</Link></li>
              <li><Link href="/services" className="hover:text-[#36D1FF] transition-colors">Dịch vụ bảo trì</Link></li>
              <li><Link href="/projects" className="hover:text-[#36D1FF] transition-colors">Dự án tiêu biểu</Link></li>
              <li><Link href="/policies/warranty" className="hover:text-[#36D1FF] transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-[#36D1FF] transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold uppercase mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#36D1FF]" />
                <a href="https://maps.app.goo.gl/jd5QysnC51g9GcKA6" target="_blank" rel="noopener noreferrer" className="hover:text-[#36D1FF] transition-colors">{SITE_CONFIG.address}</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-[#36D1FF]" />
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="hover:text-[#36D1FF] transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-[#36D1FF]" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-[#36D1FF] transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {SITE_CONFIG.name}. Chuyên gia lọc nước hàng đầu Việt Nam.
        </div>
      </Container>
    </footer>
  )
}
