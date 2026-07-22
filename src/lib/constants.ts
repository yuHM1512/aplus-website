import type { NavItem } from "@/types"

export const SITE_CONFIG = {
  name: "Aplus Technologies",
  brandName: "Lọc Nước Phước Sang",
  tagline: "Giải Pháp Lọc Nước Toàn Diện",
  description:
    "Aplus Technologies cung cấp các giải pháp lọc nước chất lượng cao cho hộ gia đình và doanh nghiệp tại Việt Nam.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  email: "contact@aplustechnologies.vn",
  hotline: "0935 455 558",
  phone: "0935 455 558",
  officePhone: "(0256) 3821 410",
  zaloPhone: "0935455558",
  zaloUrl: "https://zalo.me/0935455558",
  zaloHours: "7h30 - 22h00",
  address: "Quy Nhơn, Bình Định",
  addressFull: "TP. Quy Nhơn, Tỉnh Bình Định, Việt Nam",
}

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/locnuocphuocsang",
  instagram: "https://www.instagram.com/aqualife_plus/",
  tiktok: "https://www.tiktok.com/@aqualife_plus",
  shopee: "https://shopee.vn/aqualife_plus",
}

export const BRAND_COLORS = {
  deepBlue: "#102590",
  oceanBlue: "#006EF5",
  darkBlue: "#020035",
  lightBlue: "#36D1FF",
  powderBlue: "#B5DBFF",
  offWhite: "#F2F3F4",
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Sản phẩm", href: "/products" },
  { label: "Dự án", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Liên hệ", href: "/contact" },
]

export const NEED_TYPES = [
  { value: "household", label: "Lọc nước gia đình" },
  { value: "industrial", label: "Lọc nước công nghiệp" },
  { value: "consulting", label: "Tư vấn & khảo sát" },
  { value: "maintenance", label: "Bảo trì & sửa chữa" },
  { value: "other", label: "Khác" },
]
