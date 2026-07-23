# APLUS Technologies Website — CLAUDE.md

## Project Overview
Website redesign cho **APLUS Technologies / Lọc Nước Phước Sang** — SME lọc nước tại Quy Nhơn, Bình Định.
Đây là brochure + lead-gen site (KHÔNG phải e-commerce). Giá sản phẩm hiển thị nhưng mua hàng qua Hotline/Zalo/Social.

**Live URL:** https://aplus-website-fawn.vercel.app/
**GitHub:** https://github.com/yuHM1512/aplus-website
**Old site:** https://aqualifeplus.vn/

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (`@theme inline` brand tokens)
- **ORM:** Prisma (schema defined, chưa kết nối DB cloud)
- **DB:** PostgreSQL (local dev only, production chưa có)
- **Deployment:** Vercel Hobby plan
- **Package manager:** npm

## Design System — Flat Design
- **KHÔNG gradient** trên UI chrome — dùng solid color, 1px border, 8px card radius
- Brand colors (đã define trong `src/lib/constants.ts` → `BRAND_COLORS`):
  - Deep Blue `#102590` — header, primary buttons, section backgrounds
  - Ocean Blue `#006EF5` — links, hover states, badges
  - Dark Blue `#020035` — overlay gradients
  - Light Blue `#36D1FF` — accents, CTA text trên nền tối
  - Powder Blue `#B5DBFF` — light backgrounds, icon containers
  - Off-white `#F2F3F4` — section alternating backgrounds

## Project Structure
```
src/
├── app/
│   ├── (marketing)/        # Public pages (route group)
│   │   ├── page.tsx         # Homepage
│   │   ├── about/
│   │   ├── blog/ + [slug]/
│   │   ├── contact/
│   │   ├── products/ + [slug]/
│   │   ├── projects/
│   │   ├── survey/
│   │   └── layout.tsx       # Marketing layout (includes FloatingContact)
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── survey/route.ts
│   └── layout.tsx           # Root layout
├── components/
│   ├── layout/              # Navbar, Footer, TopBar, FloatingContact
│   ├── sections/            # Homepage sections (Hero, Categories, FeaturedProducts, Projects, Stats, etc.)
│   ├── forms/               # SurveyForm
│   └── ui/                  # Button, Container, SectionHeading, SocialButtons
├── lib/
│   ├── constants.ts         # SITE_CONFIG, SOCIAL_LINKS, BRAND_COLORS, NAV_ITEMS
│   ├── mock-data.ts         # All demo data (products, blog, projects)
│   ├── prisma.ts            # Prisma client singleton
│   └── utils.ts             # cn() helper
└── types/index.ts
```

## Key Architecture Decisions

### Data Source
- **Hiện tại:** 100% mock data từ `src/lib/mock-data.ts` — không query DB
- **DATABASE_URL trên Vercel:** placeholder dummy, chỉ để `prisma generate` pass
- **Tương lai:** kết nối Neon/Supabase free tier khi build Admin Panel

### Component Patterns
- **Server components** cho pages (products, projects, blog, about)
- **Client components** (`"use client"`) cho interactive widgets: `FloatingContact`, `FeaturedProducts`, `SurveyForm`
- **SocialButtons:** server component, pure CSS hover (no JS onMouseEnter)

### Image Strategy
- Local images: `public/images/` (projects, about, products-real)
- Remote images: `aqualifeplus.vn` + `images.unsplash.com` (configured in `next.config.ts`)
- All local images optimized: max 1400px, JPEG, EXIF rotation fixed, 130-300KB

### Conversion Features
- **FloatingContact widget:** Zalo pill + Hotline pill + expandable panel (3 contact rows)
- **SocialButtons:** Facebook, Instagram, TikTok, Shopee — on every product card, detail page, footer
- **Hotline/Zalo CTA banner:** under every product card

## Contact Info (from old site)
```
Hotline: 0935 455 558
Office:  (0256) 3821 410
Zalo:    https://zalo.me/0935455558 (7h30-22h00)
Facebook: https://www.facebook.com/locnuocphuocsang
Instagram: https://www.instagram.com/aqualife_plus/
TikTok: https://www.tiktok.com/@aqualife_plus
Shopee: https://shopee.vn/aqualife_plus
Address: TP. Quy Nhơn, Tỉnh Bình Định, Việt Nam
```

## Client Photos
- Source: `D:\Data Analyst\diy\aplus\Company Assest\Drive Photos` (~28 photos)
- Used: 9 for projects gallery, 3 for about page, 2 for products (not yet wired)
- Unused photos available for future use

## Prisma Schema (defined but not migrated to cloud)
Models: `Post`, `Category`, `Tag`, `ContactSubmission`, `Product`
File: `prisma/schema.prisma`

## Next Steps — Admin Panel + AI Content
Đã thống nhất phương án:
1. **Custom Admin Panel** tại `/admin` route group
2. **NextAuth** cho authentication (1-2 admin accounts)
3. **Rich text editor:** TipTap
4. **AI content generation:** GPT-4o-mini (viết bài) + GPT-4o (SEO review)
5. **DB cloud:** Neon free tier (0.5GB)
6. **Image upload:** Vercel Blob hoặc Cloudinary free tier
7. **Hai chế độ:**
   - Bán tự động: Admin chọn chủ đề → AI viết → Admin duyệt → Publish
   - Tự động: Cron job theo lịch → AI viết → auto-publish hoặc email duyệt
8. **Chi phí API:** ~2.000-5.000đ/tháng cho 30 bài (GPT-4o-mini cực rẻ)

## Cost Structure
| Hạng mục | Chi phí |
|---|---|
| Vercel Hobby | 0đ (non-commercial) |
| Vercel Pro (nếu cần) | $20/tháng |
| Domain .com.vn | ~350-570k/năm |
| Neon DB free | 0đ |
| OpenAI API (30 bài/tháng) | ~5.000đ/tháng |
| **Tổng vận hành/năm** | **~400-600k** (chưa Pro) |

## Important Notes
- Vercel Hobby plan là **non-commercial** — cần upgrade Pro ($20/mo) khi dùng kinh doanh thật
- `prisma generate` chạy trong `postinstall` script + `build` script
- Linter/user đã chỉnh `floating-contact.tsx` — không revert
- TypeScript compile clean (đã verify)
- Production build chưa test trên máy local (SWC download bị block trong sandbox trước đó)
