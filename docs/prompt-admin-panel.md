# Prompt: Build Custom Admin Panel cho APLUS Technologies

## Context

Đây là project Next.js 16 (App Router, TypeScript, Tailwind CSS v4, Prisma + PostgreSQL) cho website SME lọc nước **APLUS Technologies** tại Quy Nhơn, Việt Nam. Website đã deploy tại https://aplus-website-fawn.vercel.app/ với brochure/lead-gen pages hoàn chỉnh.

Đọc file `CLAUDE.md` ở project root để lấy đầy đủ tech stack, design system (brand colors, flat design rules), project structure, và các quyết định kiến trúc đã thống nhất.

## Yêu cầu

Build **Custom Admin Panel** tại route group `(admin)` với các module sau:

---

### 1. Authentication — `/admin/login`

- Dùng **NextAuth.js** (Credentials provider)
- Chỉ cần 1-2 tài khoản admin (hardcode hoặc lưu DB), không cần đăng ký
- Session-based, redirect về `/admin` sau khi login
- Middleware bảo vệ toàn bộ `/admin/*` routes — chưa login thì redirect `/admin/login`
- UI: form login đơn giản, centered, brand colors (Deep Blue `#102590`)

---

### 2. Dashboard — `/admin`

- Overview cards: tổng sản phẩm, tổng bài viết (published / draft), tổng lượt gửi form liên hệ
- Bài viết gần nhất (5 bài)
- Quick actions: "Tạo bài viết mới", "Thêm sản phẩm", "Xem form liên hệ"
- Layout: sidebar navigation (trái) + main content (phải)

---

### 3. Quản lý Sản phẩm — `/admin/products`

#### 3a. Danh sách sản phẩm `/admin/products`
- Table/grid view với: ảnh thumbnail, tên, danh mục, giá, trạng thái (hiện/ẩn), featured (có/không)
- Search + filter theo danh mục
- Bulk actions: ẩn/hiện, xoá
- Pagination

#### 3b. Thêm/Sửa sản phẩm `/admin/products/new` và `/admin/products/[id]/edit`
Form fields:
- **Tên sản phẩm** (text input, required)
- **Slug** (auto-generate từ tên, editable)
- **Danh mục** (select dropdown — lấy từ bảng Category)
- **Giá gốc** + **Giá khuyến mãi** (number inputs, format VNĐ)
- **Mô tả ngắn** (textarea, hiện ở product card)
- **Mô tả chi tiết** (rich text editor — **TipTap** với toolbar: heading, bold, italic, list, image, link, table)
- **Ảnh sản phẩm** (multiple image upload, drag & drop, reorder, crop preview) — lưu lên **Vercel Blob** hoặc **Cloudinary**
- **Thông số kỹ thuật** (dynamic key-value pairs: "Công suất" → "500L/H", "Kích thước" → "30x40cm")
- **Badge/Tag** (multi-select: "Mới nhất", "Bán chạy", "Sale 10%", "Đạt chuẩn BYT")
- **Trạng thái**: Published / Draft / Hidden
- **Featured**: toggle (hiện ở trang chủ hay không)
- Nút: "Lưu nháp", "Xuất bản", "Xem trước"

#### 3c. Quản lý Danh mục `/admin/categories`
- CRUD danh mục sản phẩm (tên, slug, icon, mô tả)
- Kéo thả sắp xếp thứ tự hiển thị

---

### 4. Quản lý Bài viết (Blog) — `/admin/posts`

#### 4a. Danh sách bài viết `/admin/posts`
- Table: tiêu đề, danh mục, trạng thái (Published/Draft/Scheduled), ngày đăng, nguồn (Thủ công/AI)
- Filter: trạng thái, danh mục, nguồn
- Quick actions: edit, duplicate, unpublish, delete

#### 4b. Tạo bài viết `/admin/posts/new` — **3 chế độ (tabs)**

**Tab 1: Viết thủ công**
- Form tương tự editor blog truyền thống:
  - Tiêu đề (text)
  - Slug (auto-generate)
  - Danh mục (select)
  - Tags (multi-select/create)
  - Ảnh bìa (upload)
  - Nội dung (TipTap rich editor — full toolbar)
  - SEO fields: meta title, meta description, focus keyword
  - Trạng thái: Draft / Published / Scheduled (date picker cho hẹn giờ)

**Tab 2: AI viết bài (bán tự động) ⭐ Core feature**
Luồng UX:
1. Admin nhập:
   - **Chủ đề bài viết** (text, ví dụ: "10 dấu hiệu nhận biết nước nhiễm phèn")
   - **Từ khoá SEO chính** (text, ví dụ: "nước nhiễm phèn")
   - **Từ khoá phụ** (optional, comma-separated)
   - **Tone of voice** (select: "Chuyên gia tư vấn", "Thân thiện dễ hiểu", "Khoa học chuyên sâu")
   - **Độ dài mong muốn** (select: "Ngắn ~800 từ", "Trung bình ~1500 từ", "Dài ~2500 từ")
   - **Ghi chú thêm** (textarea, optional — ví dụ: "Nhấn mạnh sản phẩm UF của APLUS")

2. Bấm **"🤖 AI Viết bài"** → loading state với progress indicator
3. AI trả về:
   - Tiêu đề bài viết (editable)
   - Meta description (editable)
   - Nội dung đầy đủ (hiện trong TipTap editor — admin chỉnh sửa tự do)
   - Gợi ý tags
4. Admin review trong editor → chỉnh sửa nếu cần → bấm **"Xuất bản"** hoặc **"Hẹn giờ"**
5. Nút phụ: **"AI Viết lại"** (regenerate), **"AI Cải thiện SEO"** (chỉ optimize lại title + meta + heading structure)

**Tab 3: AI tự động (lên lịch hàng loạt)**
- Table lịch đăng bài:
  - Mỗi hàng: chủ đề, từ khoá, ngày dự kiến đăng, trạng thái (Pending/Generated/Published)
- Nút **"+ Thêm chủ đề"** → form nhỏ (chủ đề + từ khoá + ngày)
- Nút **"AI Gợi ý 10 chủ đề"** → AI suggest danh sách chủ đề liên quan đến lọc nước, sức khoẻ, nước sạch
- Toggle: **"Tự động xuất bản"** (on: publish ngay khi AI viết xong) vs **"Gửi email duyệt"** (off: gửi email admin preview trước khi publish)
- Cron info: hiện lịch chạy tiếp theo, số bài chờ generate

---

### 5. Form submissions — `/admin/contacts`

- Danh sách form liên hệ + khảo sát đã gửi
- Table: tên, SĐT, loại nhu cầu, ngày gửi, trạng thái (Mới/Đã xem/Đã phản hồi)
- Click vào → xem chi tiết
- Mark as read / replied
- Export CSV

---

### 6. Cài đặt — `/admin/settings`

- **Thông tin website**: tên, mô tả, hotline, email, địa chỉ (sync với `SITE_CONFIG`)
- **Social links**: Facebook, Instagram, TikTok, Shopee URLs
- **AI Settings**:
  - API Key input (OpenAI) — masked, lưu encrypted trong DB hoặc env var
  - Model mặc định (select: GPT-4o-mini / GPT-4o / Claude Haiku)
  - System prompt template cho AI (editable textarea — prompt mặc định chứa context về APLUS, ngành lọc nước, tone SEO tiếng Việt)
  - Token usage dashboard: tổng tokens đã dùng tháng này, ước tính chi phí

---

## Technical Requirements

### API Routes (`/api/admin/*`)
- `POST /api/admin/auth` — NextAuth endpoints
- `GET/POST/PUT/DELETE /api/admin/products` — CRUD sản phẩm
- `GET/POST/PUT/DELETE /api/admin/posts` — CRUD bài viết
- `GET/PUT /api/admin/contacts` — Đọc + cập nhật trạng thái form
- `POST /api/ai/generate` — Gọi OpenAI API viết bài
- `POST /api/ai/seo-review` — Gọi OpenAI API review SEO
- `POST /api/ai/suggest-topics` — Gọi OpenAI API gợi ý chủ đề
- `POST /api/upload` — Upload ảnh lên Vercel Blob/Cloudinary

### AI Integration (`/api/ai/*`)
- Dùng **OpenAI SDK** (`openai` npm package)
- System prompt mặc định:
```
Bạn là chuyên gia content marketing cho APLUS Technologies — công ty chuyên về giải pháp lọc nước tại Việt Nam.
Viết bài blog bằng tiếng Việt, chuẩn SEO, tone chuyên nghiệp nhưng dễ hiểu.
Cấu trúc bài: H2/H3 headings rõ ràng, đoạn ngắn, có bullet points khi cần.
Cuối bài luôn có CTA hướng đến liên hệ APLUS (hotline 0935 455 558, Zalo).
Không bịa số liệu. Nếu đề cập tiêu chuẩn (WHO, BYT), dùng thông tin chính xác.
```
- Streaming response (`stream: true`) để hiện real-time trong editor
- Rate limiting: max 10 calls/giờ
- Log mỗi API call: model, tokens used, cost estimate

### Database Schema Updates (Prisma)
Cần thêm/update models:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // hashed
  name      String
  role      String   @default("admin")
  createdAt DateTime @default(now())
}

model Post {
  // ... existing fields ...
  source      String   @default("manual") // manual | ai | auto
  seoTitle    String?
  seoDescription String?
  focusKeyword String?
  scheduledAt DateTime? // for scheduled publishing
}

model Product {
  // ... existing fields ...
  price        Int?      // giá gốc (VNĐ)
  salePrice    Int?      // giá KM
  specs        Json?     // thông số kỹ thuật [{key, value}]
  badges       String[]  // ["Mới", "BYT"]
  images       String[]  // multiple image URLs
  status       String    @default("draft") // draft | published | hidden
}

model AiLog {
  id        String   @id @default(cuid())
  model     String
  prompt    String
  tokens    Int
  cost      Float
  postId    String?
  createdAt DateTime @default(now())
}
```

### UI/UX Guidelines
- Admin layout **tách biệt** hoàn toàn với marketing layout — dùng route group `(admin)`
- Sidebar: logo nhỏ + nav items (Dashboard, Sản phẩm, Bài viết, Liên hệ, Cài đặt) + user avatar + logout
- Responsive nhưng ưu tiên desktop (admin thường dùng laptop)
- Dùng **shadcn/ui** components nếu phù hợp (Table, Dialog, Tabs, Select, Toast)
- Color scheme admin: neutral (gray/slate) + brand accent (Ocean Blue `#006EF5`) — không cần quá rực rỡ như marketing site
- Loading states, error handling, toast notifications cho mọi action
- Optimistic updates cho toggle actions (featured, status)

---

## Thứ tự ưu tiên build
1. Auth + Layout (sidebar, protected routes)
2. Dashboard overview
3. Product CRUD (vì dữ liệu sản phẩm cần có trước)
4. Blog — Viết thủ công
5. Blog — AI viết bài (bán tự động)
6. Blog — AI lên lịch tự động
7. Form submissions viewer
8. Settings page
