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

// ─── MEGA MENU — nhóm danh mục hiển thị trong dropdown ─
export interface MegaMenuGroup {
  title: string
  items: { label: string; slug: string; icon: string; badge?: string }[]
}

export const MEGA_MENU_GROUPS: MegaMenuGroup[] = [
  {
    title: "Sản phẩm lọc nước",
    items: [
      { label: "Máy lọc nước", slug: "may-loc-nuoc", icon: "Waves", badge: "HOT" },
      { label: "Cột lọc nước", slug: "cot-loc-nuoc", icon: "Cylinder" },
      { label: "Bộ lọc", slug: "bo-loc", icon: "Droplets" },
      { label: "Combo cột lọc", slug: "combo-cot", icon: "Layers" },
      { label: "Cây nóng lạnh", slug: "cay-nong-lanh", icon: "Thermometer" },
    ],
  },
  {
    title: "Linh kiện & Phụ kiện",
    items: [
      { label: "Linh kiện lọc nước", slug: "linh-kien-loc-nuoc", icon: "Filter" },
      { label: "Phụ kiện", slug: "phu-kien", icon: "Wrench" },
      { label: "Van các loại", slug: "van-cac-loai", icon: "Cog" },
      { label: "Vật liệu lọc", slug: "vat-lieu-loc", icon: "Package" },
    ],
  },
  {
    title: "Thiết bị",
    items: [
      { label: "Thiết bị đo đạc", slug: "thiet-bi-do-dac", icon: "Gauge" },
      { label: "Thiết bị khác", slug: "thiet-bi-khac", icon: "Box" },
    ],
  },
]

export const MEGA_MENU_SERVICES = [
  { label: "Khảo sát nguồn nước", href: "/survey", icon: "Search" },
  { label: "Lắp đặt tận nơi", href: "/contact", icon: "Wrench" },
  { label: "Bảo trì định kỳ", href: "/contact", icon: "Shield" },
  { label: "Thay lõi tận nhà", href: "/contact", icon: "Home" },
]

export const NEED_TYPES = [
  { value: "household", label: "Lọc nước gia đình" },
  { value: "industrial", label: "Lọc nước công nghiệp" },
  { value: "consulting", label: "Tư vấn & khảo sát" },
  { value: "maintenance", label: "Bảo trì & sửa chữa" },
  { value: "other", label: "Khác" },
]
