import nodemailer from "nodemailer"
import { formatPrice } from "@/lib/cart-store"

// ─── SMTP transport (Gmail App Password) ──────────────
let cachedTransporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter

  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || "587", 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.warn("[mailer] SMTP not configured — email disabled")
    return null
  }

  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })

  return cachedTransporter
}

// ─── Types ────────────────────────────────────────────
export interface OrderEmailData {
  orderNumber: string
  fullName: string
  email: string
  phone: string
  province: string
  district: string
  ward: string
  address: string
  note: string | null
  paymentMethod: "bank_transfer" | "cod"
  subtotal: number
  shippingFee: number
  total: number
  items: Array<{
    productName: string
    price: number
    quantity: number
  }>
}

// ─── Send helper (fail silently, log) ─────────────────
async function sendMail(options: {
  to: string
  subject: string
  html: string
}): Promise<boolean> {
  const transporter = getTransporter()
  if (!transporter) return false

  try {
    await transporter.sendMail({
      from: `"APLUS Technologies" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
    return true
  } catch (error) {
    console.error("[mailer] Send failed:", error)
    return false
  }
}

// ─── Public site URL ──────────────────────────────────
function siteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://aplus-website-fawn.vercel.app"
}

// ─── Common HTML wrapper ──────────────────────────────
function wrap(title: string, content: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F2F3F4;font-family:Arial,sans-serif;color:#111827;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#F2F3F4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:white;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="background:#102590;padding:20px 24px;color:white;">
            <div style="font-size:18px;font-weight:700;letter-spacing:1px;">APLUS TECHNOLOGIES</div>
            <div style="font-size:12px;opacity:0.8;">Lọc nước Phước Sang — Quy Nhơn, Bình Định</div>
          </td>
        </tr>
        <tr><td style="padding:28px 24px;">${content}</td></tr>
        <tr>
          <td style="background:#F2F3F4;padding:16px 24px;font-size:12px;color:#6b7280;text-align:center;">
            Cần hỗ trợ? Gọi <a href="tel:0935455558" style="color:#006EF5;text-decoration:none;font-weight:600;">0935 455 558</a>
            hoặc Zalo <a href="https://zalo.me/0935455558" style="color:#006EF5;text-decoration:none;font-weight:600;">0935 455 558</a><br/>
            <span style="opacity:0.7;">${siteUrl()}</span>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Items table HTML ─────────────────────────────────
function itemsTable(items: OrderEmailData["items"], subtotal: number, shippingFee: number, total: number): string {
  const rows = items
    .map(
      (i) => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:13px;">${escapeHtml(i.productName)}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:13px;text-align:center;">${i.quantity}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #f3f4f6;font-size:13px;text-align:right;">${formatPrice(i.price * i.quantity)}</td>
    </tr>`
    )
    .join("")

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:16px 0;">
    <thead>
      <tr>
        <th style="text-align:left;padding:8px;background:#F2F3F4;font-size:11px;text-transform:uppercase;color:#6b7280;">Sản phẩm</th>
        <th style="text-align:center;padding:8px;background:#F2F3F4;font-size:11px;text-transform:uppercase;color:#6b7280;">SL</th>
        <th style="text-align:right;padding:8px;background:#F2F3F4;font-size:11px;text-transform:uppercase;color:#6b7280;">Thành tiền</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding:8px;font-size:13px;color:#6b7280;text-align:right;">Tạm tính</td>
        <td style="padding:8px;font-size:13px;text-align:right;">${formatPrice(subtotal)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:8px;font-size:13px;color:#6b7280;text-align:right;">Phí vận chuyển</td>
        <td style="padding:8px;font-size:13px;text-align:right;">${formatPrice(shippingFee)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:12px 8px;font-size:15px;font-weight:700;text-align:right;border-top:2px solid #e5e7eb;">Tổng cộng</td>
        <td style="padding:12px 8px;font-size:16px;font-weight:700;text-align:right;color:#102590;border-top:2px solid #e5e7eb;">${formatPrice(total)}</td>
      </tr>
    </tfoot>
  </table>`
}

// ─── Escape helper ────────────────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/* ═══════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════ */

// ─── 1. Email khách hàng — xác nhận đơn hàng ─────────
export async function sendOrderConfirmationToCustomer(data: OrderEmailData): Promise<boolean> {
  const paymentText =
    data.paymentMethod === "bank_transfer"
      ? `<div style="background:#eff4ff;border:1px solid #B5DBFF;border-radius:6px;padding:16px;margin:16px 0;">
          <div style="font-weight:700;color:#102590;margin-bottom:8px;">💳 Thanh toán qua chuyển khoản</div>
          <div style="font-size:13px;color:#374151;line-height:1.6;">
            Vui lòng chuyển khoản với nội dung: <strong style="color:#006EF5;">${data.orderNumber}</strong><br/>
            Xem chi tiết và quét mã QR tại: <a href="${siteUrl()}/don-hang/xac-nhan?order=${data.orderNumber}&total=${data.total}&pm=bank_transfer" style="color:#006EF5;">Trang xác nhận đơn</a>
          </div>
        </div>`
      : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:16px;margin:16px 0;">
          <div style="font-weight:700;color:#166534;margin-bottom:8px;">🚚 Thanh toán khi nhận hàng (COD)</div>
          <div style="font-size:13px;color:#374151;">Chuẩn bị ${formatPrice(data.total)} khi nhận hàng.</div>
        </div>`

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#102590;">Cảm ơn bạn đã đặt hàng!</h2>
    <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">
      Xin chào <strong>${escapeHtml(data.fullName)}</strong>, đơn hàng của bạn đã được tiếp nhận.
    </p>

    <div style="background:#F2F3F4;border-radius:6px;padding:16px;margin-bottom:16px;text-align:center;">
      <div style="font-size:12px;color:#6b7280;">Mã đơn hàng</div>
      <div style="font-size:24px;font-weight:700;color:#102590;letter-spacing:2px;margin-top:4px;">${data.orderNumber}</div>
    </div>

    ${paymentText}

    ${itemsTable(data.items, data.subtotal, data.shippingFee, data.total)}

    <div style="background:#fafafa;border:1px solid #f3f4f6;border-radius:6px;padding:14px;margin-top:16px;">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Địa chỉ giao hàng</div>
      <div style="font-size:14px;color:#111827;line-height:1.5;">
        <strong>${escapeHtml(data.fullName)}</strong> — ${escapeHtml(data.phone)}<br/>
        ${escapeHtml(data.address)}, ${escapeHtml(data.ward)}, ${escapeHtml(data.district)}, ${escapeHtml(data.province)}
      </div>
      ${data.note ? `<div style="font-size:13px;color:#6b7280;margin-top:6px;"><em>Ghi chú:</em> ${escapeHtml(data.note)}</div>` : ""}
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="${siteUrl()}/don-hang/xac-nhan?order=${data.orderNumber}&total=${data.total}&pm=${data.paymentMethod}"
         style="display:inline-block;background:#102590;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">
        Xem đơn hàng
      </a>
    </div>
  `

  return sendMail({
    to: data.email,
    subject: `[APLUS] Xác nhận đơn hàng ${data.orderNumber}`,
    html: wrap(`Xác nhận đơn hàng ${data.orderNumber}`, content),
  })
}

// ─── 2. Email admin — thông báo đơn mới ──────────────
export async function sendNewOrderToAdmin(data: OrderEmailData): Promise<boolean> {
  const adminEmail = process.env.MAIL_TO
  if (!adminEmail) {
    console.warn("[mailer] MAIL_TO not set — skip admin email")
    return false
  }

  const paymentBadge =
    data.paymentMethod === "bank_transfer"
      ? `<span style="background:#eff4ff;color:#102590;padding:3px 8px;border-radius:4px;font-size:12px;font-weight:600;">Chuyển khoản</span>`
      : `<span style="background:#f0fdf4;color:#166534;padding:3px 8px;border-radius:4px;font-size:12px;font-weight:600;">COD</span>`

  const content = `
    <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;margin-bottom:16px;border-radius:4px;">
      <strong style="color:#92400e;">🔔 Đơn hàng mới cần xử lý</strong>
    </div>

    <h2 style="margin:0 0 8px;font-size:20px;color:#102590;">Đơn hàng ${data.orderNumber}</h2>
    <div style="font-size:13px;color:#6b7280;margin-bottom:16px;">
      ${paymentBadge}
      <span style="margin-left:8px;">Tổng: <strong style="color:#102590;">${formatPrice(data.total)}</strong></span>
    </div>

    <div style="background:#fafafa;border:1px solid #f3f4f6;border-radius:6px;padding:14px;margin-bottom:16px;">
      <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Khách hàng</div>
      <table style="width:100%;font-size:14px;">
        <tr><td style="padding:2px 0;color:#6b7280;width:100px;">Họ tên:</td><td style="font-weight:600;">${escapeHtml(data.fullName)}</td></tr>
        <tr><td style="padding:2px 0;color:#6b7280;">SĐT:</td><td style="font-weight:600;"><a href="tel:${data.phone}" style="color:#006EF5;">${escapeHtml(data.phone)}</a></td></tr>
        <tr><td style="padding:2px 0;color:#6b7280;">Email:</td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:2px 0;color:#6b7280;vertical-align:top;">Địa chỉ:</td><td>${escapeHtml(data.address)}, ${escapeHtml(data.ward)}, ${escapeHtml(data.district)}, ${escapeHtml(data.province)}</td></tr>
        ${data.note ? `<tr><td style="padding:2px 0;color:#6b7280;vertical-align:top;">Ghi chú:</td><td><em>${escapeHtml(data.note)}</em></td></tr>` : ""}
      </table>
    </div>

    ${itemsTable(data.items, data.subtotal, data.shippingFee, data.total)}

    <div style="text-align:center;margin-top:24px;">
      <a href="${siteUrl()}/admin/orders"
         style="display:inline-block;background:#102590;color:white;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">
        Xem trong Admin
      </a>
    </div>
  `

  return sendMail({
    to: adminEmail,
    subject: `[APLUS - Đơn mới] ${data.orderNumber} — ${data.fullName} — ${formatPrice(data.total)}`,
    html: wrap(`Đơn hàng mới ${data.orderNumber}`, content),
  })
}

// ─── 3. Email admin — khách báo đã CK ────────────────
export async function sendPaymentNotifyToAdmin(data: {
  orderNumber: string
  fullName: string
  phone: string
  total: number
}): Promise<boolean> {
  const adminEmail = process.env.MAIL_TO
  if (!adminEmail) return false

  const content = `
    <div style="background:#dbeafe;border-left:4px solid #006EF5;padding:12px 16px;margin-bottom:16px;border-radius:4px;">
      <strong style="color:#1e40af;">💰 Khách hàng báo đã chuyển khoản — vui lòng đối soát</strong>
    </div>

    <h2 style="margin:0 0 8px;font-size:20px;color:#102590;">Đơn hàng ${data.orderNumber}</h2>

    <table style="width:100%;font-size:14px;background:#fafafa;padding:16px;border-radius:6px;">
      <tr><td style="padding:4px 0;color:#6b7280;width:120px;">Khách hàng:</td><td style="font-weight:600;">${escapeHtml(data.fullName)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">SĐT:</td><td style="font-weight:600;"><a href="tel:${data.phone}" style="color:#006EF5;">${escapeHtml(data.phone)}</a></td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Số tiền:</td><td style="font-weight:700;color:#102590;font-size:16px;">${formatPrice(data.total)}</td></tr>
      <tr><td style="padding:4px 0;color:#6b7280;">Nội dung CK:</td><td style="font-weight:700;color:#006EF5;">${data.orderNumber}</td></tr>
    </table>

    <div style="margin-top:16px;padding:14px;background:#fef3c7;border-radius:6px;font-size:13px;color:#92400e;">
      <strong>⚠️ Cần làm ngay:</strong> Kiểm tra sao kê Techcombank (STK 35455558) → xác nhận đã nhận tiền
      → cập nhật trạng thái đơn "Đã thanh toán" trong <a href="${siteUrl()}/admin/orders" style="color:#006EF5;">Admin</a>.
    </div>
  `

  return sendMail({
    to: adminEmail,
    subject: `[APLUS - Báo CK] ${data.orderNumber} — ${data.fullName} — ${formatPrice(data.total)}`,
    html: wrap(`Khách báo CK ${data.orderNumber}`, content),
  })
}
