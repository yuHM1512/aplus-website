# APLUS Technologies — CLAUDE.md

## Tổng quan
Website brochure + lead-gen cho **APLUS Technologies / Lọc Nước Phước Sang** (Quy Nhơn, Bình Định).
KHÔNG phải e-commerce — mua hàng qua Hotline/Zalo/Social.

- **Live:** https://aplus-website-fawn.vercel.app/
- **GitHub:** https://github.com/yuHM1512/aplus-website
- **Old site:** https://aqualifeplus.vn/

## Tech Stack
| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (`@theme inline`) + `@tailwindcss/typography` |
| UI primitives | Radix UI (dialog, dropdown, select, toast, navigation-menu, label) |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Rich text | TipTap (image, link, placeholder, underline) |
| Auth | NextAuth v4 (credentials provider, JWT strategy) |
| ORM | Prisma 5 + PostgreSQL |
| Image upload | Vercel Blob |
| Email | Nodemailer (SMTP) |
| Icons | Lucide React |
| Utils | clsx, tailwind-merge, class-variance-authority |
| Deploy | Vercel Hobby |
| Font | Inter (latin + vietnamese) |

## Commands
```bash
npm run dev          # Dev server (Turbopack)
npm run build        # prisma generate + next build
npm run start        # Production server
npm run lint         # ESLint
npm run db:seed      # Seed database (npx tsx prisma/seed.ts)
npm run db:migrate   # Prisma migrate dev
npm run db:push      # Prisma db push
bash deploy.sh       # git add + commit + push (Vercel auto-deploy)
```

## Cấu trúc thư mục
```
src/
├── app/
│   ├── (marketing)/              # Route group — public pages
│   │   ├── page.tsx              # Homepage
│   │   ├── about/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── products/page.tsx
│   │   ├── products/[slug]/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── survey/page.tsx
│   │   └── layout.tsx            # Marketing layout (Navbar + Footer + FloatingContact)
│   │
│   ├── admin/                    # Admin panel (protected)
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/page.tsx        # Login page
│   │   ├── contacts/page.tsx     # Contact submissions
│   │   ├── posts/                # Blog CRUD (list, new, [id] edit)
│   │   ├── products/             # Product CRUD (list, new, [id] edit)
│   │   ├── settings/page.tsx
│   │   └── layout.tsx            # Admin layout (Sidebar + Topbar)
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # NextAuth handler
│   │   ├── contact/route.ts              # Public contact form
│   │   ├── survey/route.ts               # Public survey form
│   │   └── admin/                        # Protected admin APIs
│   │       ├── ai/generate/route.ts      # AI content generation
│   │       ├── contacts/[id]/route.ts
│   │       ├── posts/route.ts + [id]/route.ts
│   │       ├── products/route.ts + [id]/route.ts
│   │       ├── settings/route.ts
│   │       └── upload/route.ts           # Vercel Blob upload
│   │
│   ├── layout.tsx                # Root layout (Inter font, metadata)
│   └── globals.css               # Tailwind v4 + brand CSS vars
│
├── components/
│   ├── layout/                   # Navbar, Footer, TopBar, FloatingContact
│   ├── sections/                 # Homepage sections (xem chi tiết bên dưới)
│   ├── forms/                    # SurveyForm
│   ├── admin/                    # Admin-specific components
│   └── ui/                       # Button, Container, SectionHeading, SocialButtons
│
├── lib/
│   ├── constants.ts              # SITE_CONFIG, SOCIAL_LINKS, BRAND_COLORS, NAV_ITEMS
│   ├── mock-data.ts              # Demo data (products, blog, projects)
│   ├── static-data.ts            # Static content (categories, services, USPs, stats)
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client singleton
│   ├── images.ts                 # Image optimization helper
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
│
├── proxy.ts
└── types/index.ts                # Post, Category, Tag, ContactFormData, Product, NavItem

prisma/
├── schema.prisma                 # Models: User, Post, Category, Tag, ContactSubmission, Product, SiteSetting
└── seed.ts                       # Database seeder

public/images/
├── about/          # Company photos
├── logo/           # Brand logos
├── products/       # Product placeholder images
├── products-real/  # Actual product photos
└── projects/       # Project gallery photos
```

## Conventions

### Naming
- **Files/folders:** kebab-case (`floating-contact.tsx`, `mock-data.ts`)
- **Components:** PascalCase (`FloatingContact`, `SurveyForm`)
- **Routes:** kebab-case, tiếng Việt không dấu (`/products`, `/about`, `/blog`)
- **DB tables:** snake_case (`contact_submissions`, `site_settings`) via `@@map`
- **CSS vars:** `--color-deep-blue`, `--color-ocean-blue`, ...

### Component patterns
- **Server components** cho pages (products, projects, blog, about)
- **Client components** (`"use client"`) cho interactive: `FloatingContact`, `FeaturedProducts`, `SurveyForm`, admin forms
- Path alias: `@/*` → `./src/*`

### Comments
- Nghiệp vụ: tiếng Việt
- Kỹ thuật: tiếng Anh

## Module chính

### Homepage sections (`components/sections/`)
- `hero.tsx` — Banner chính với CTA
- `categories.tsx` — Grid danh mục sản phẩm
- `featured-products.tsx` — Carousel sản phẩm nổi bật (client component)
- `services.tsx` — Dịch vụ cung cấp
- `projects.tsx` — Gallery dự án đã thực hiện
- `stats.tsx` — Số liệu thống kê (năm kinh nghiệm, khách hàng, dự án)
- `usps.tsx` — Unique selling points
- `blog-testimonials.tsx` — Blog preview + testimonials
- `cta.tsx` — Call-to-action banner

### Admin panel (`app/admin/` + `components/admin/`)
- Dashboard với stats tổng quan
- CRUD Products: form với key-value specs, brand, badge, pricing
- CRUD Posts: TipTap rich text editor, category, AI metadata
- Contacts: quản lý status (new → read → replied)
- Settings: site configuration
- Components: `auth-provider`, `sidebar`, `topbar`, `toast`, `confirm-dialog`, `post-form`, `product-form`, `rich-text-editor`, `delete-*-button`, `contact-status-button`

### Conversion widgets
- `FloatingContact` — Zalo pill + Hotline pill + expandable panel
- `SocialButtons` — Facebook, Instagram, TikTok, Shopee (server component, pure CSS)
- Hotline/Zalo CTA trên mỗi product card

### API routes
- `POST /api/contact` — Nhận form liên hệ (+ gửi email qua Nodemailer)
- `POST /api/survey` — Nhận form khảo sát
- `POST /api/admin/ai/generate` — AI content generation
- `POST /api/admin/upload` — Upload ảnh lên Vercel Blob
- CRUD: `/api/admin/posts`, `/api/admin/products`, `/api/admin/contacts`, `/api/admin/settings`

## Data source
- **Public pages:** 100% mock data từ `mock-data.ts` + `static-data.ts`
- **Admin panel:** Prisma queries đến PostgreSQL
- **DATABASE_URL trên Vercel:** placeholder dummy (chỉ để `prisma generate` pass)
- **Production DB:** chưa kết nối cloud (Neon free tier planned)

## Design System
- **Flat design** — KHÔNG gradient trên UI chrome
- Solid color, 1px border, 8px card radius
- Brand colors defined trong `constants.ts` → `BRAND_COLORS` và `globals.css` → CSS vars
- Colors: Deep Blue `#102590`, Ocean Blue `#006EF5`, Dark Blue `#020035`, Light Blue `#36D1FF`, Powder Blue `#B5DBFF`, Off-white `#F2F3F4`

## Env vars (xem `.env.example`)
- `DATABASE_URL` — PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` — Base URL
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — Auth
- `GOOGLE_AI_KEY` / `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` — AI content gen
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_TO` — Email

## Prisma Models
`User`, `Post`, `Category`, `Tag`, `ContactSubmission`, `Product`, `SiteSetting`

## Contact Info
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

## Notes
- Vercel Hobby = **non-commercial** → cần upgrade Pro ($20/mo) khi kinh doanh thật
- `prisma generate` chạy trong `postinstall` + `build` scripts
- Remote images allowed: `images.unsplash.com`, `*.public.blob.vercel-storage.com`
- Local images đã optimize: max 1400px, JPEG, 130-300KB
