// Static content — không quản lý qua admin
// Projects, Services, Testimonials, Stats, USPs là nội dung ít thay đổi

// ─── PRODUCT CATEGORIES (for sidebar filter) ──────────
export const PRODUCT_CATEGORIES = [
  {
    id: "he-thong-loc-nuoc",
    name: "Hệ thống lọc nước",
    slug: "he-thong-loc-nuoc",
    description: "Hệ thống lọc nước công nghiệp và đầu nguồn",
    icon: "Droplets",
    productCount: 12,
  },
  {
    id: "may-loc-nuoc",
    name: "Máy lọc nước",
    slug: "may-loc-nuoc",
    description: "Máy lọc nước RO, UF, Nano cho gia đình và doanh nghiệp",
    icon: "Waves",
    productCount: 26,
  },
  {
    id: "thiet-bi-loc-nuoc",
    name: "Thiết bị lọc nước",
    slug: "thiet-bi-loc-nuoc",
    description: "Van, biến áp, thiết bị điều khiển thông minh",
    icon: "Cog",
    productCount: 45,
  },
  {
    id: "loi-loc-nuoc",
    name: "Lõi lọc & Linh kiện",
    slug: "loi-loc-nuoc",
    description: "Lõi lọc chính hãng cho các dòng máy",
    icon: "Filter",
    productCount: 85,
  },
  {
    id: "vat-lieu-loc",
    name: "Vật liệu lọc",
    slug: "vat-lieu-loc",
    description: "Cát, sỏi, than hoạt tính, hạt nhựa",
    icon: "Package",
    productCount: 18,
  },
  {
    id: "dich-vu-bao-tri",
    name: "Dịch vụ bảo trì",
    slug: "dich-vu-bao-tri",
    description: "Bảo trì, thay lõi tận nhà",
    icon: "Wrench",
    productCount: 11,
  },
]

// ─── PROJECTS (Case Studies) ───────────────────────────
export const PROJECT_CATEGORIES = [
  { key: "all", label: "Tất cả" },
  { key: "gia-dinh", label: "Gia đình" },
  { key: "loc-tong", label: "Lọc tổng đầu nguồn" },
  { key: "cong-nghiep", label: "Công nghiệp" },
  { key: "cong-cong", label: "Nước uống công cộng" },
]

export const PROJECTS = [
  {
    id: "1",
    slug: "ro-ao-smith-am-tu-bep",
    name: "Lắp đặt máy lọc RO A.O. Smith âm tủ bếp",
    excerpt: "Máy lọc nước RO A.O. Smith lắp gọn dưới bồn rửa, vòi điện tử hiện đại, nước tinh khiết uống trực tiếp.",
    category: "gia-dinh",
    location: "Quy Nhơn, Bình Định",
    client: "Gia đình anh T.",
    coverImage: "/images/projects/duan-ro-aosmith-bep.jpg",
    completedAt: "2026-05",
  },
  {
    id: "2",
    slug: "loc-tong-1-cot-dau-nguon",
    name: "Hệ lọc tổng 1 cột đầu nguồn (bình inox)",
    excerpt: "Cột lọc tổng vỏ inox lắp đầu nguồn, cải thiện nước sinh hoạt cho tắm rửa, giặt giũ toàn bộ ngôi nhà.",
    category: "loc-tong",
    location: "Bình Định",
    client: "Gia đình anh M.",
    coverImage: "/images/projects/duan-loc-tong-1cot.jpg",
    completedAt: "2026-05",
  },
  {
    id: "3",
    slug: "tram-nuoc-uong-cong-cong",
    name: "Trạm nước uống tinh khiết công cộng",
    excerpt: "Trạm cấp nước uống tinh khiết nhiều vòi gắn bảng hiệu APLUS – phục vụ cộng đồng, trường học, khu dân cư.",
    category: "cong-cong",
    location: "Quy Nhơn, Bình Định",
    client: "Dự án cộng đồng",
    coverImage: "/images/projects/duan-tram-nuoc-congcong.jpg",
    completedAt: "2026-04",
  },
  {
    id: "4",
    slug: "loc-tong-3-cot-cong-nghiep",
    name: "Hệ lọc tổng 3 cột composite",
    excerpt: "Hệ thống 3 cột lọc composite kèm van tự động, xử lý nước đầu nguồn quy mô lớn cho nhà xưởng.",
    category: "cong-nghiep",
    location: "Bình Định",
    client: "Doanh nghiệp sản xuất",
    coverImage: "/images/projects/duan-loc-tong-3cot.jpg",
    completedAt: "2026-04",
  },
  {
    id: "5",
    slug: "ro-cong-nghiep-500l",
    name: "Hệ thống RO công nghiệp 500L/h",
    excerpt: "Dây chuyền RO công nghiệp 500L/h với tủ điều khiển, cột tiền lọc – cấp nước tinh khiết ổn định cho sản xuất.",
    category: "cong-nghiep",
    location: "Bình Định",
    client: "Nhà máy sản xuất",
    coverImage: "/images/projects/duan-ro-500l.jpg",
    completedAt: "2026-03",
  },
  {
    id: "6",
    slug: "may-nong-lanh-van-phong",
    name: "Máy lọc nước nóng lạnh cho văn phòng",
    excerpt: "Lắp đặt máy lọc nước nóng lạnh Karofi phục vụ nước uống tiện lợi cho văn phòng, cơ quan.",
    category: "gia-dinh",
    location: "Quy Nhơn, Bình Định",
    client: "Văn phòng doanh nghiệp",
    coverImage: "/images/projects/duan-may-nonglanh-vp.jpg",
    completedAt: "2026-03",
  },
  {
    id: "7",
    slug: "loc-tong-2-cot-composite",
    name: "Hệ lọc tổng 2 cột + cột cải hóa",
    excerpt: "Hệ lọc tổng 2 cột composite kèm cột cải hóa, xử lý nước cứng và cặn cho hộ gia đình quy mô lớn.",
    category: "loc-tong",
    location: "Bình Định",
    client: "Gia đình chị H.",
    coverImage: "/images/projects/duan-loc-tong-2cot.jpg",
    completedAt: "2026-02",
  },
  {
    id: "8",
    slug: "tram-ro-tinh-khiet-3-voi",
    name: "Trạm RO tinh khiết 3 vòi lấy nước",
    excerpt: "Trạm lọc nước RO tinh khiết 3 vòi gắn bảng hiệu APLUS – lắp đặt cho khu vực đông người sử dụng.",
    category: "cong-cong",
    location: "Bình Định",
    client: "Dự án cộng đồng",
    coverImage: "/images/projects/duan-tram-ro-3voi.jpg",
    completedAt: "2026-01",
  },
  {
    id: "9",
    slug: "loi-loc-phuoc-sang-am-tu",
    name: "Bộ lõi lọc Phước Sang lắp âm tủ",
    excerpt: "Cận cảnh bộ lõi lọc thương hiệu Phước Sang lắp gọn gàng dưới bồn rửa – chính hãng, thay dễ dàng.",
    category: "gia-dinh",
    location: "Quy Nhơn, Bình Định",
    client: "Gia đình anh K.",
    coverImage: "/images/projects/duan-loi-phuocsang.jpg",
    completedAt: "2025-12",
  },
]

// ─── SERVICES ──────────────────────────────────────────
export const SERVICES = [
  {
    id: "1",
    slug: "khao-sat-nguon-nuoc",
    name: "Khảo sát nguồn nước tận nơi",
    excerpt: "Phân tích chất lượng nước đầu vào và tư vấn giải pháp lọc phù hợp cho từng nguồn nước.",
    icon: "Search",
  },
  {
    id: "2",
    slug: "lap-dat-nhanh-chong",
    name: "Lắp đặt nhanh chóng",
    excerpt: "Đội ngũ kỹ thuật viên tay nghề cao, đảm bảo lắp đặt đúng chuẩn kỹ thuật và thẩm mỹ cao.",
    icon: "Wrench",
  },
  {
    id: "3",
    slug: "bao-tri-dinh-ky",
    name: "Bảo trì định kỳ",
    excerpt: "Chăm sóc, thay lõi lọc, bảo dưỡng hệ thống lọc nước định kỳ, đảm bảo nguồn nước luôn tinh khiết.",
    icon: "Shield",
  },
  {
    id: "4",
    slug: "tra-gop-0-lai-suat",
    name: "Trả góp 0% lãi suất",
    excerpt: "Giải pháp mua máy lọc nước dễ dàng với chính sách trả góp 0% lãi suất, thủ tục nhanh gọn.",
    icon: "CreditCard",
  },
  {
    id: "5",
    slug: "cho-thue-may-loc",
    name: "Cho thuê máy lọc nước",
    excerpt: "Sử dụng máy lọc nước chất lượng cao mà không cần đầu tư ban đầu lớn.",
    icon: "Package",
  },
  {
    id: "6",
    slug: "thay-loi-tan-nha",
    name: "Thay lõi lọc tận nhà",
    excerpt: "Dịch vụ thay lõi lọc tại nhà nhanh chóng với lõi chính hãng đa dạng thương hiệu.",
    icon: "Home",
  },
]

// ─── TESTIMONIALS ──────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: "1",
    name: "Chị Ngân",
    role: "Nhân viên ngân hàng",
    content: "Lắp đặt nhanh, gọn, nước trong và sạch hơn hẳn, mình mua cho ba má nên dùng rất yên tâm. Tư vấn nhiệt tình, giá cả hợp lý.",
    avatar: null,
  },
  {
    id: "2",
    name: "Anh Tuấn",
    role: "Chủ shop",
    content: "Chủ shop tư vấn rất tận tâm, giải thích kỹ nên rất yên tâm. Cửa hàng là đại lý chính hãng nên nhìn vào là thấy chuyên nghiệp và đáng tin cậy.",
    avatar: null,
  },
  {
    id: "3",
    name: "Chị Hoa",
    role: "Nhân viên tài chính",
    content: "Vừa sử dụng dịch vụ thay lõi tận nhà, giá cả rất hợp lý, phụ kiện lõi lọc thay đều là hàng chính hãng.",
    avatar: null,
  },
  {
    id: "4",
    name: "Anh Minh",
    role: "Nhân viên văn phòng",
    content: "Nước nhà tôi bị nhiễm phèn nặng, hôi. Lắp hệ thống lọc Aqualife Plus xong, nước trong và hết mùi.",
    avatar: null,
  },
  {
    id: "5",
    name: "Chị Lan",
    role: "Nội trợ",
    content: "Từ khi lắp đặt cột lọc tổng sinh hoạt của Lọc Nước Phước Sang, nước trong nhà tôi trong hơn hẳn.",
    avatar: null,
  },
]

// ─── STATS ─────────────────────────────────────────────
export const STATS = [
  { label: "Năm kinh nghiệm", value: "20+" },
  { label: "Khách hàng tin tưởng", value: "3000+" },
  { label: "Đối tác chiến lược", value: "100+" },
  { label: "Dự án lớn hoàn thành", value: "51+" },
]

// ─── USPs ──────────────────────────────────────────────
export const USPS = [
  {
    icon: "Headphones",
    title: "Tư vấn miễn phí",
    description: "Hỗ trợ 24/7 tận tâm",
  },
  {
    icon: "Wrench",
    title: "Đơn giản bảo trì",
    description: "Thiết kế module thông minh",
  },
  {
    icon: "TrendingDown",
    title: "Chi phí hợp lý",
    description: "Tiết kiệm ngân sách tối đa",
  },
  {
    icon: "ShieldCheck",
    title: "Chất lượng kiểm chứng",
    description: "Đạt chuẩn quốc tế",
  },
]
