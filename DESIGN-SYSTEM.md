# APLUS Technologies — Design System

> Reference cho AI design tools (Claude, v0, GPT). Copy toàn bộ file này làm system prompt khi tạo UI cho dự án APLUS.

---

## 1. Brand Identity

| | |
|---|---|
| **Tên** | APLUS Technologies / Lọc Nước Phước Sang |
| **Ngành** | Thiết bị lọc nước (gia đình + công nghiệp) |
| **Địa bàn** | Quy Nhơn, Bình Định, Việt Nam |
| **Ngôn ngữ** | Tiếng Việt (toàn bộ UI) |
| **Tone** | Chuyên nghiệp, đáng tin cậy, kỹ thuật nhưng gần gũi |
| **Website** | https://aplus-website-fawn.vercel.app/ |

---

## 2. Color Palette

### Brand Colors

| Token | Hex | Vai trò |
|---|---|---|
| `deep-blue` | `#102590` | **Primary** — heading, CTA chính, navbar hotline, footer heading |
| `ocean-blue` | `#006EF5` | **Accent** — link, hover border, badge text, eyebrow, focus ring |
| `dark-blue` | `#020035` | **Dark** — footer background |
| `light-blue` | `#36D1FF` | **Highlight** — hover state CTA chính, accent text trên nền tối, eyebrow trên dark |
| `powder-blue` | `#B5DBFF` | **Subtle** — tag/badge background, highlight box nhẹ (`/30` opacity) |
| `off-white` | `#F2F3F4` | **Muted** — section background xen kẽ, breadcrumb bar, summary box |

### Semantic Colors

| Token | Hex | Vai trò |
|---|---|---|
| `background` | `#FFFFFF` | Nền chính |
| `foreground` | `#111827` | Text body chính |
| `muted` | `#F2F3F4` | Nền phụ |
| `border` | `#e5e7eb` | Border mặc định (= `gray-200`) |
| `gray-100` | `#f3f4f6` | Border nhẹ (card, divider) |
| `gray-400` | `#9ca3af` | Text disabled, placeholder |
| `gray-500` | `#6b7280` | Text phụ, label nhỏ |
| `gray-600` | `#4b5563` | Text mô tả |
| `gray-700` | `#374151` | Nav link text |

### Social Brand Colors (hover only)

| Mạng | Hex |
|---|---|
| Facebook | `#1877F2` |
| Instagram | `#E4405F` |
| TikTok | `#010101` |
| Shopee | `#EE4D2D` |
| Zalo | `#0068FF` |

### Quy tắc dùng màu

- **KHÔNG dùng gradient** trên UI chrome (button, card, header, form). Chỉ dùng gradient cho hero overlay.
- Flat design: solid color, 1px border.
- Xen kẽ section background: `#FFFFFF` → `#F2F3F4` → `#FFFFFF` → `#102590` (CTA).
- Text trên nền tối (`dark-blue`, `deep-blue`): dùng `white`, `white/70`, `white/50`. Accent dùng `light-blue (#36D1FF)`.

---

## 3. Typography

### Font

| | |
|---|---|
| **Font family** | Inter |
| **Subsets** | `latin`, `vietnamese` |
| **CSS variable** | `--font-inter` |
| **Tailwind** | `font-sans` (mapped to `var(--font-inter)`) |
| **Antialiasing** | `antialiased` |

### Scale (Tailwind classes)

| Dùng cho | Class | Ghi chú |
|---|---|---|
| Hero h1 | `text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight` | |
| Page h1 | `text-2xl md:text-3xl font-bold` | Màu `text-[#102590]` |
| Section h2 | `text-3xl md:text-4xl font-bold tracking-tight` | Màu `text-[#102590]`, dark mode `text-white` |
| Card title | `text-sm font-bold` hoặc `text-base font-bold` | `line-clamp-2` nếu cần |
| Eyebrow | `text-sm font-semibold uppercase tracking-widest` | Màu `text-[#006EF5]`, dark: `text-[#36D1FF]` |
| Body | `text-base leading-relaxed` | Màu `text-gray-600` |
| Small/meta | `text-sm` hoặc `text-xs` | Màu `text-gray-500` |
| Price | `text-3xl font-bold text-[#102590]` | Giá gạch: `text-lg text-gray-400 line-through` |
| Nav link | `text-sm font-semibold text-gray-700` | Hover: `text-[#006EF5]` |
| Footer heading | `text-base font-bold uppercase` | Màu `white` |
| Footer body | `text-sm text-white/70` | Hover: `text-[#36D1FF]` |
| CTA button text | `text-sm font-bold uppercase tracking-wide` | Hoặc `font-semibold` |

### Heading hierarchy

- Mỗi page chỉ **1 thẻ `<h1>`**.
- Section heading dùng `<h2>`.
- Sub-heading trong card/box dùng `<h3>`.

---

## 4. Layout

### Container

```
max-width: 1280px
padding-x: 24px (px-6)
margin: auto
```

Tailwind: `mx-auto w-full max-w-[1280px] px-6`

### Grid

| Layout | Class |
|---|---|
| 2 cột (desktop) | `grid lg:grid-cols-2 gap-10` |
| 3 cột | `grid md:grid-cols-3 gap-6` |
| 4 cột | `grid grid-cols-2 md:grid-cols-4 gap-4` |
| Footer | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10` |
| Checkout (form:summary) | `grid lg:grid-cols-[7fr_5fr] gap-10` |

### Section spacing

| Phần | Class |
|---|---|
| Section padding | `py-16` (chuẩn), `py-12` (compact), `py-24 lg:py-32` (hero) |
| Breadcrumb bar | `py-6`, `bg-[#F2F3F4]`, `border-b border-gray-100` |
| Card gap | `gap-4` (grid nhỏ), `gap-6` (grid lớn), `gap-10` (2 cột chính) |
| Stack spacing | `space-y-3` đến `space-y-6` |

### Breakpoints (Tailwind default)

| | |
|---|---|
| Mobile | `< 768px` (mặc định) |
| Tablet | `md:` (768px+) |
| Desktop | `lg:` (1024px+) |

---

## 5. Components

### 5.1 Button

**Base class:** `inline-flex items-center justify-center gap-2 rounded-md font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006EF5] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none`

| Variant | Class | Hover |
|---|---|---|
| **Primary** | `bg-[#102590] text-white` | `hover:bg-[#36D1FF] hover:text-[#102590]` |
| **Secondary** | `bg-[#006EF5] text-white` | `hover:bg-[#0058C7]` |
| **Outline** | `border border-[#102590] text-[#102590]` | `hover:bg-[#102590] hover:text-white` |
| **Outline Blue** | `border border-[#006EF5] text-[#006EF5]` | `hover:bg-[#006EF5] hover:text-white` |
| **Ghost** | `text-[#102590]` | `hover:bg-[#F2F3F4]` |
| **White** | `bg-white text-[#102590]` | `hover:bg-[#F2F3F4]` |
| **White (hero)** | `bg-white text-[#102590]` | `hover:bg-[#36D1FF] hover:text-white` |
| **Ghost border (dark)** | `border border-white/40 text-white` | `hover:bg-white/10` |

| Size | Class |
|---|---|
| **sm** | `h-9 px-4 text-sm` |
| **md** | `h-11 px-6 text-sm` |
| **lg** | `h-14 px-8 text-base` |

### 5.2 Card

```
bg-white rounded-lg border border-gray-100 overflow-hidden
hover:border-[#006EF5] transition-colors
```

- Border radius: `rounded-lg` (8px)
- Không shadow mặc định, chỉ dùng shadow cho floating elements
- Padding nội dung: `p-3` đến `p-6`
- Ảnh trong card: `aspect-square`, `object-contain`, `p-4`

### 5.3 Badge / Tag

```
text-xs font-bold uppercase
text-[#006EF5] bg-[#B5DBFF] px-2 py-1 rounded
```

Product badge (overlay):
```
text-xs font-bold uppercase text-white bg-[#006EF5] px-3 py-1.5 rounded
```

### 5.4 Form Input

```
h-11 w-full rounded-md border border-gray-200 px-4 text-sm
focus:border-[#006EF5] focus:ring-1 focus:ring-[#006EF5] focus:outline-none
placeholder:text-gray-400
```

Label:
```
text-sm font-medium text-[#111827]
```
Required marker: `<span class="text-red-500">*</span>`

Select dropdown: same style as input, with Radix UI Select.

Textarea: same border/focus style, `min-h-[100px] resize-y`.

### 5.5 Section Heading

Pattern dùng cho mỗi section trên trang:

```
Eyebrow:  text-sm font-semibold uppercase tracking-widest text-[#006EF5]
          (centered: kèm 2 line ngang w-8 h-px bg-[#006EF5] 2 bên)
Title:    text-3xl md:text-4xl font-bold tracking-tight text-[#102590]
Desc:     text-base leading-relaxed text-gray-600
```

Alignment: `text-center mx-auto max-w-2xl` (mặc định) hoặc `text-left`.

### 5.6 Breadcrumb

```
Container: bg-[#F2F3F4] py-6 border-b border-gray-100
Items:     text-sm text-gray-600, flex items-center gap-2
Separator: ChevronRight (lucide), h-3 w-3
Active:    text-[#102590] font-semibold
Link:      hover:text-[#006EF5]
```

### 5.7 Navbar

```
Position:  sticky top-0 z-50
Background: bg-white border-b border-gray-100 shadow-sm
Height:    h-20
Nav links: text-sm font-semibold text-gray-700, hover:text-[#006EF5]
CTA:       Primary button (md size)
Hotline:   text-sm font-bold text-[#102590], kèm icon Phone
Mobile:    Hamburger (Menu/X icon), drawer slide-down
```

### 5.8 Footer

```
Background: bg-[#020035] (dark-blue)
Text:      text-white (heading), text-white/70 (body), text-white/50 (copyright)
Hover:     text-[#36D1FF]
Icon:      text-[#36D1FF]
Heading:   text-base font-bold uppercase mb-4
Copyright: text-xs text-white/50, border-t border-white/10
```

### 5.9 Highlight Box

Dùng cho feature list, order summary, info panel:
```
bg-[#B5DBFF]/30 rounded-lg p-5
```
hoặc:
```
bg-[#F2F3F4] rounded-lg p-6
```

### 5.10 Social Buttons

```
Container: flex items-center gap-1.5
Each:      w-8 h-8 (sm) / w-9 h-9 (md)
           flex items-center justify-center rounded-md
           border border-gray-200 text-gray-500
           hover → brand color background + white text
```

### 5.11 Floating Contact (Fixed bottom-right)

- Zalo pill: `rounded-full bg-[#0068ff] text-white`, ring-4 ring-white/90, shadow
- Hotline pill: `rounded-full bg-white text-[#102590]`, ring-1 ring-gray-200
- Expanded panel: `rounded-lg border border-gray-200 bg-white shadow-lg`
  - Header: `bg-[#102590] px-4 py-3`
  - Contact rows: `rounded-lg border border-gray-200`, hover:border-[#006EF5]

### 5.12 Price Display

```
Current:    text-3xl font-bold text-[#102590]
Original:   text-lg text-gray-400 line-through
Suffix:     đ (VND, không dùng ₫ symbol)
Format:     990.000đ (dấu chấm phân cách hàng nghìn)
```

### 5.13 Radio Group (payment method style)

```
Container:  space-y-3
Each option: border rounded-lg p-4, cursor-pointer
  Selected:  border-[#006EF5] bg-[#006EF5]/5
  Default:   border-gray-200
Radio dot:   w-4 h-4, accent-[#006EF5]
Expand box:  bg-[#F2F3F4] p-4 rounded mt-3 text-sm text-gray-600
```

### 5.14 Table (cart/order)

```
Desktop:    <table> with:
  Header:   text-sm font-semibold text-gray-500 uppercase, border-b
  Row:      border-b border-gray-100, py-4
  Cell:     text-sm
Mobile:     Card stack (mỗi item = 1 card ngang)
```

### 5.15 Quantity Input

```
Container: inline-flex items-center border border-gray-200 rounded-md h-10
Button [-]: px-3, hover:bg-[#F2F3F4], text-gray-600
Input:     w-12 text-center text-sm font-semibold, border-x border-gray-200
Button [+]: px-3, hover:bg-[#F2F3F4], text-gray-600
```

---

## 6. Spacing & Sizing

| Token | Value | Dùng cho |
|---|---|---|
| Card radius | `rounded-lg` (8px) | Card, input, box |
| Button radius | `rounded-md` (6px) | Button, input, badge |
| Pill radius | `rounded-full` | Floating contact, hero badge |
| Section gap | `mb-8` đến `mb-12` | Giữa heading và content |
| Card padding | `p-3` đến `p-6` | Tùy kích thước card |
| Product image | `aspect-square`, `object-contain`, `p-4`–`p-8` | Trong card và detail |

---

## 7. Icons

**Library:** Lucide React

Các icon thường dùng:

| Ngữ cảnh | Icon |
|---|---|
| Điện thoại | `Phone` |
| Menu mobile | `Menu`, `X` |
| Breadcrumb | `ChevronRight` |
| Feature check | `Check` |
| Mũi tên CTA | `ArrowRight`, `ArrowLeft` |
| Địa chỉ | `MapPin` |
| Email | `Mail` |
| Văn phòng | `Building2` |
| Xóa | `Trash2` |
| Giỏ hàng | `ShoppingCart`, `ShoppingBag` |
| Giao hàng | `Truck` |
| Thanh toán | `CreditCard`, `Banknote` |
| Loading | `Loader2` (animate-spin) |
| Social | `Facebook`, `Instagram` (+ custom SVG cho TikTok, Shopee, Zalo) |

Icon size: `h-3 w-3` (breadcrumb), `h-4 w-4` (inline), `h-6 w-6` (standalone).

---

## 8. Patterns

### Page Layout

```
<Navbar />                          ← sticky top-0
<Breadcrumb />                      ← bg-[#F2F3F4], border-b
<main>
  <Section bg="white" />            ← py-12 hoặc py-16
  <Section bg="#F2F3F4" />          ← xen kẽ
  <Section bg="white" />
  <CTA bg="#102590" />              ← py-16
</main>
<Footer bg="#020035" />
<FloatingContact />                 ← fixed bottom-right
```

### Product Card

```
<Link> wrapper, group class
  <div> aspect-square, bg-white, border, overflow-hidden
    Badge overlay (nếu có): absolute top-4 left-4
    <Image> object-contain p-4
  </div>
  <div> p-3
    Category tag: text-xs text-gray-500
    Name: text-sm font-bold, group-hover:text-[#006EF5]
    Price: text-sm font-bold text-[#102590]
  </div>
</Link>
```

### Form Layout

```
<form> space-y-4
  2 cột nhỏ: grid grid-cols-2 gap-4 (Họ + Tên)
  1 cột: mỗi field full-width
  Label + Input stack: space-y-1.5
  Submit: full-width primary button (lg size)
</form>
```

### Dark Section (CTA / Hero on dark)

```
Text:       text-white
Desc:       text-white/70
Accent:     text-[#36D1FF]
Link hover: text-[#36D1FF]
Border:     border-white/15 hoặc border-white/40
Button:     bg-white text-[#102590] (primary on dark)
            border border-white/40 text-white (ghost on dark)
```

---

## 9. Animation & Transitions

| Thuộc tính | Dùng cho |
|---|---|
| `transition-colors` | Button, link, card border, nav hover |
| `transition-opacity` | Image hover trong gallery |
| `transition-transform` | Floating contact (`hover:-translate-y-0.5`) |
| `animate-spin` | Loading spinner (Loader2) |
| Framer Motion | Homepage sections (fade-in, slide-up khi scroll) |

**Không dùng:** animation phức tạp, parallax, auto-play carousel.

---

## 10. Responsive Rules

- **Mobile-first**: viết class mobile trước, override bằng `md:`, `lg:`.
- **Grid collapse**: 4 cột → 2 cột (mobile), 2 cột → 1 cột (mobile).
- **Navbar**: ẩn nav links + CTA trên mobile, hiện hamburger drawer.
- **Checkout**: 2 cột → 1 cột, order summary hiển thị trước form trên mobile.
- **Table**: chuyển thành card stack trên mobile.
- **Font size**: heading giảm 1 bậc trên mobile (`text-4xl` → `text-2xl`).

---

## 11. Accessibility

| Quy tắc | Chi tiết |
|---|---|
| WCAG | 2.1 AA |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-[#006EF5] focus-visible:ring-offset-2` |
| Alt text | Tiếng Việt, mô tả sản phẩm |
| Semantic HTML | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` |
| `aria-label` | Trên icon-only button, social link |
| Language | `<html lang="vi">` |
| Contrast | Deep Blue trên white = 10.4:1 ✓ |

---

## 12. Contact Info (for footer, floating widget)

```
Hotline:   0935 455 558
Office:    (0256) 3821 410
Zalo:      https://zalo.me/0935455558 (7h30–22h00)
Email:     contact@aplustechnologies.vn
Facebook:  https://www.facebook.com/locnuocphuocsang
Instagram: https://www.instagram.com/aqualife_plus/
TikTok:    https://www.tiktok.com/@aqualife_plus
Shopee:    https://shopee.vn/aqualife_plus
Address:   TP. Quy Nhơn, Tỉnh Bình Định, Việt Nam
```

---

## 13. Do / Don't

### Do ✓
- Dùng solid color, flat design
- Xen kẽ white / off-white giữa các section
- Uppercase cho button text và eyebrow
- Format giá kiểu Việt: `990.000đ`
- Dùng `tracking-wide` hoặc `tracking-widest` cho uppercase text
- Mỗi trang có breadcrumb
- CTA section cuối trang (bg deep-blue)

### Don't ✗
- Gradient trên button, card, header
- Shadow trên card (chỉ dùng cho floating element)
- Emoji trong UI
- Rounded-full cho card (chỉ dùng cho avatar, pill)
- Text tiếng Anh trong nội dung chính (trừ tên kỹ thuật)
- Nhiều hơn 1 `<h1>` trên 1 trang
- Dùng `any` trong TypeScript
