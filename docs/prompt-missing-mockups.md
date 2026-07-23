# Prompt: Tạo mockup cho các màn hình Admin Panel còn thiếu

## Context

Đây là bộ UI mockup cho **APLUS Technologies Admin Panel** — hệ thống quản trị nội bộ của công ty lọc nước SME tại Quy Nhơn, Bình Định, Việt Nam.

Đã có 4 màn hình mockup sẵn (Dashboard, Product Management, Create Post AI, Settings). Cần tạo thêm **5 màn hình còn thiếu** dưới đây.

## Design System (bắt buộc tuân thủ)

Copy nguyên file `DESIGN.md` có sẵn trong folder `aplus_admin_interface/`. Tóm tắt key points:

- **Sidebar:** Deep Blue `#102590`, 260px fixed, active item có border-left Ocean Blue 4px + bg white/10
- **Font:** Inter (UI) + Courier Prime (mono/technical)
- **Colors:** Ocean Blue `#006EF5` cho interactive, Slate neutrals cho nền, semantic colors (Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`)
- **Cards:** White bg, 1px `#E2E8F0` border, rounded-xl, shadow-sm
- **Buttons primary:** Ocean Blue bg, white text, rounded-lg
- **Buttons AI:** Gradient Ocean Blue → Deep Blue
- **Tables:** Header bg `#F1F5F9`, no zebra stripes, 1px separator, hover row highlight
- **Flat design** — không heavy shadows, dùng tonal layers
- **Icons:** Material Symbols Outlined (stroke, 20px)
- **Tailwind CDN** setup giống các file code.html đã có

## Thông tin APLUS thực tế (dùng làm mock data)

- **Tên:** Aplus Technologies / Lọc Nước Phước Sang
- **Hotline:** 0935 455 558
- **Email:** contact@aplustechnologies.vn
- **Địa chỉ:** Quy Nhơn, Bình Định
- **Facebook:** https://www.facebook.com/locnuocphuocsang
- **Zalo:** https://zalo.me/0935455558
- **TikTok:** https://www.tiktok.com/@aqualife_plus
- **Shopee:** https://shopee.vn/aqualife_plus

Sản phẩm thực tế: Máy lọc nước RO, Hệ thống lọc tổng, Máy tạo kiềm, Lõi lọc thay thế, Hệ thống khử trùng UV, Bộ lọc Nano, Máy lọc công nghiệp.

---

## Màn hình 1: Login Page (`/admin/login`)

**Layout:** Full-page centered, không sidebar, không header.

**Thiết kế:**
- Nền: gradient nhẹ từ `#F8FAFC` → `#E5EEFF` (trái sang phải)
- Card login centered: white, max-width 420px, rounded-xl, shadow-lg
- Logo "APLUS Tech" + subtitle "Admin Portal" ở trên cùng card
- Form fields:
  - Email (input type email, placeholder "admin@aplustechnologies.vn")
  - Mật khẩu (input type password, có toggle visibility icon)
- Nút "Đăng nhập" — full width, Ocean Blue, rounded-lg
- Checkbox "Ghi nhớ đăng nhập" bên dưới
- Footer nhỏ: "© 2026 APLUS Technologies"
- Không có link "Quên mật khẩu" hay "Đăng ký" (vì chỉ dành cho admin nội bộ)

---

## Màn hình 2: Product Add/Edit Form (`/admin/products/new`)

**Layout:** Sidebar + Header giống các màn đã có, active item = "Products"

**Breadcrumb:** Sản phẩm > Danh sách > Thêm sản phẩm mới

**Content — 2 cột:**

**Cột trái (60%):**
- **Thông tin cơ bản** (card):
  - Tên sản phẩm (text input, value: "Máy lọc nước RO APLUS Premium 10 cấp")
  - Slug (text input, auto-generated: "may-loc-nuoc-ro-aplus-premium-10-cap", editable, có icon link)
  - Danh mục (select dropdown: "Máy lọc nước RO")
  - Mô tả ngắn (textarea, 3 rows)
- **Mô tả chi tiết** (card):
  - TipTap rich text editor toolbar: B, I, U, H1, H2, bullet list, ordered list, image, link, table
  - Editor area với sample content: heading "Đặc điểm nổi bật" + paragraph + bullet list
- **Thông số kỹ thuật** (card):
  - Dynamic key-value pairs, mỗi hàng: input "Tên thông số" + input "Giá trị" + nút xóa (x)
  - 3 hàng mẫu: "Công suất" → "10L/H", "Số cấp lọc" → "10 cấp", "Kích thước" → "35 x 25 x 50 cm"
  - Nút "+ Thêm thông số" ở dưới

**Cột phải (40%):**
- **Trạng thái & Hiển thị** (card):
  - Trạng thái: select (Draft / Published / Hidden), currently "Draft"
  - Featured: toggle switch (hiện ở trang chủ)
  - Nút "Lưu nháp" (secondary) + "Xuất bản" (primary Ocean Blue)
- **Giá** (card):
  - Giá gốc: number input, value "8.500.000", suffix "đ"
  - Giá khuyến mãi: number input, value "7.200.000", suffix "đ"
  - Badge auto-calculated: "-15%" (pill badge, error-red)
- **Ảnh sản phẩm** (card):
  - Upload area: dashed border, drag & drop zone, icon cloud_upload
  - 3 thumbnail previews đã upload (grid 3 cột), mỗi ảnh có nút xóa (x) overlay
  - Text "Kéo thả hoặc click để tải ảnh lên"
- **Tags / Badges** (card):
  - Multi-select chips: "Mới nhất" (active), "Bán chạy", "Đạt chuẩn BYT" (active), "Sale"
  - Chip active: Ocean Blue bg, white text. Inactive: border gray, text gray

---

## Màn hình 3: Posts List (`/admin/posts`)

**Layout:** Sidebar + Header, active item = "Posts"

**Header row:**
- Title: "Quản lý Bài viết"
- Nút: "+ Tạo bài viết" (primary Ocean Blue)

**Filter bar (card):**
- Search input: "Tìm theo tiêu đề hoặc từ khóa..."
- Select: Trạng thái (Tất cả / Published / Draft / Scheduled)
- Select: Danh mục (Tất cả danh mục)
- Select: Nguồn (Tất cả / Thủ công / AI)
- Icon filter advanced

**Table:**
Columns: Checkbox | Tiêu đề | Danh mục | Nguồn | Ngày đăng | Trạng thái | Hành động

Mock data 6 rows:
1. "10 dấu hiệu nhận biết nước nhiễm phèn" | Kiến thức | AI (badge nhỏ icon auto_awesome) | 20/07/2026 | Published (green pill) | ⋮
2. "Hệ thống lọc nước Nano APLUS Gen 5" | Công nghệ | Thủ công | 18/07/2026 | Published | ⋮
3. "Giải pháp nước sạch cho trường học" | Giải pháp | AI | 15/07/2026 | Published | ⋮
4. "So sánh máy lọc RO và UF: Nên chọn loại nào?" | Tư vấn | AI | 25/07/2026 | Scheduled (blue pill, kèm icon schedule) | ⋮
5. "Cách thay lõi lọc nước định kỳ" | Hướng dẫn | Thủ công | — | Draft (amber pill) | ⋮
6. "Review máy lọc nước kiềm APLUS Pro" | Đánh giá | AI | 10/07/2026 | Published | ⋮

Pagination: "Hiển thị 1-6 trong 42 bài viết" + page numbers

---

## Màn hình 4: Contacts / Form Submissions (`/admin/contacts`)

**Layout:** Sidebar + Header, active item = "Contacts"

**Header row:**
- Title: "Form liên hệ & Khảo sát"
- Nút: "Xuất CSV" (secondary, icon download)

**Stats mini-row (3 cards nhỏ ngang hàng):**
- Tổng: 156 | Mới (chưa xem): 12 (badge error-red) | Đã phản hồi: 98

**Filter bar:**
- Search: "Tìm theo tên, SĐT..."
- Select: Trạng thái (Tất cả / Mới / Đã xem / Đã phản hồi)
- Select: Loại (Tất cả / Liên hệ / Khảo sát)
- Date range picker

**Table:**
Columns: Checkbox | Họ tên | SĐT | Loại nhu cầu | Ngày gửi | Trạng thái | Hành động

Mock data 5 rows:
1. "Nguyễn Văn Hùng" | 0905 xxx 123 | Lọc nước gia đình | 22/07/2026 | Mới (red dot + text) | Xem
2. "Trần Thị Mai" | 0935 xxx 456 | Lọc nước công nghiệp | 21/07/2026 | Mới | Xem
3. "Lê Quang Vinh" | 0912 xxx 789 | Tư vấn & khảo sát | 20/07/2026 | Đã xem (gray) | Xem
4. "Công ty TNHH Phát Đạt" | 0256 xxx 100 | Lọc nước công nghiệp | 19/07/2026 | Đã phản hồi (green) | Xem
5. "Phạm Minh Tuấn" | 0978 xxx 321 | Bảo trì & sửa chữa | 18/07/2026 | Đã phản hồi | Xem

**Detail panel (slide-in từ phải hoặc modal):** Khi click "Xem" row 1:
- Header: "Nguyễn Văn Hùng" + badge "Mới"
- Info grid: SĐT, Email, Loại nhu cầu, Nguồn nước hiện tại, Ngày gửi
- Ghi chú của khách: "Muốn lắp hệ thống lọc tổng cho nhà mới xây, 3 tầng, khu vực Nhơn Bình."
- Action buttons: "Đánh dấu đã xem" (secondary) + "Đánh dấu đã phản hồi" (primary)

---

## Màn hình 5: AI Tự động — Lên lịch hàng loạt (`/admin/posts/new` — Tab 3 "AI tự động")

**Layout:** Giống màn Create Post AI đã có, nhưng Tab 3 "AI tự động" được active thay vì Tab 2.

**Content:**

**Phần trên — Control bar:**
- Toggle: "Tự động xuất bản" (on/off) — kèm text giải thích: "Bật: bài viết tự publish khi AI viết xong. Tắt: gửi email admin duyệt trước."
- Info: "Lịch chạy tiếp theo: 25/07/2026 08:00" | "3 bài chờ generate"
- Nút: "AI Gợi ý 10 chủ đề" (gradient AI button)

**Phần dưới — Bảng lịch đăng bài:**
Columns: # | Chủ đề | Từ khóa SEO | Ngày dự kiến | Trạng thái | Hành động

Mock data 5 rows:
1. "Nước nhiễm phèn: Nguyên nhân và cách xử lý" | nước nhiễm phèn | 25/07/2026 | Pending (gray pill) | Sửa / Xóa
2. "Top 5 máy lọc nước RO tốt nhất 2026" | máy lọc nước RO | 28/07/2026 | Pending | Sửa / Xóa
3. "Lợi ích uống nước kiềm mỗi ngày" | nước kiềm | 01/08/2026 | Generated (blue pill, clickable → preview) | Duyệt / Sửa / Xóa
4. "Hướng dẫn chọn hệ thống lọc tổng cho biệt thự" | lọc tổng biệt thự | 05/08/2026 | Pending | Sửa / Xóa
5. "Tiêu chuẩn nước uống theo WHO và BYT" | tiêu chuẩn nước uống | 10/08/2026 | Published (green pill) | Xem bài

Nút: "+ Thêm chủ đề" (secondary, mở inline form hoặc modal nhỏ)

Pagination nếu cần.

---

## Lưu ý chung cho tất cả màn hình

- Mỗi màn hình tạo 1 folder riêng (ví dụ: `login_aplus_admin/`, `product_form_aplus_admin/`, `posts_list_aplus_admin/`, `contacts_aplus_admin/`, `auto_schedule_aplus_admin/`)
- Mỗi folder có `code.html` + `screen.png`
- Dùng cùng Tailwind CDN config, font imports, và style base giống 4 file đã có
- Năm trong mock data: **2026** (không phải 2024)
- Sidebar nav items: Dashboard, Products, Posts, Contacts, Settings — highlight đúng item active
- Top bar: "Administrator" + "Quản trị viên" + avatar
- Lang: `vi`
