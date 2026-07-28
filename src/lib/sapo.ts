// ─── Sapo Admin API Client ──────────────────────────────
// Server-side only — KHÔNG import file này từ client components
// Docs: https://docs.sapo.vn/

const SAPO_API_KEY = process.env.SAPO_API_KEY!
const SAPO_API_SECRET = process.env.SAPO_API_SECRET!
const SAPO_STORE = process.env.SAPO_STORE! // e.g. "aplustechnologies"

// ─── Base fetch helper ──────────────────────────────────
// Sapo dùng Basic Auth: API Key là username, API Secret là password
// Node.js fetch() không cho nhúng credentials vào URL → dùng Authorization header

function getBaseUrl() {
  return `https://${SAPO_STORE}.mysapo.net/admin`
}

function getAuthHeader() {
  const credentials = Buffer.from(`${SAPO_API_KEY}:${SAPO_API_SECRET}`).toString("base64")
  return `Basic ${credentials}`
}

async function sapoFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBaseUrl()}${endpoint}`

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
      ...options.headers,
    },
    // Không cache — luôn lấy data mới nhất từ Sapo
    cache: "no-store",
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "")
    throw new Error(
      `Sapo API error ${res.status}: ${res.statusText} — ${errorBody}`
    )
  }

  // Một số endpoint trả 204 No Content (vd: DELETE)
  if (res.status === 204) return {} as T

  return res.json()
}

// ─── Types ──────────────────────────────────────────────

export interface SapoProduct {
  id: number
  name: string
  alias?: string          // slug
  content?: string        // HTML description
  summary?: string
  vendor?: string         // brand
  product_type?: string   // category
  tags?: string
  images: SapoImage[]
  variants: SapoVariant[]
  published?: boolean
  created_on?: string
  modified_on?: string
}

export interface SapoImage {
  id: number
  src: string
  position?: number
}

export interface SapoVariant {
  id: number
  product_id: number
  sku?: string
  barcode?: string
  price: number           // Giá bán (VNĐ)
  compare_at_price?: number  // Giá gốc
  inventory_quantity?: number
  inventory_management?: string
  taxable?: boolean
  position?: number
  option1?: string
  option2?: string
  option3?: string
}

export interface SapoCustomer {
  id?: number
  first_name: string
  last_name: string
  email?: string
  phone?: string
  addresses?: SapoAddress[]
  note?: string
  tags?: string
}

export interface SapoAddress {
  address1: string
  city?: string         // Quận/Huyện
  province?: string     // Tỉnh/Thành phố
  ward?: string
  phone?: string
  first_name?: string
  last_name?: string
  default?: boolean
}

export interface SapoOrder {
  id?: number
  order_number?: number
  email?: string
  phone?: string
  note?: string
  financial_status?: string   // pending | paid | refunded
  fulfillment_status?: string // null | fulfilled
  line_items: SapoLineItem[]
  shipping_address?: SapoAddress
  billing_address?: SapoAddress
  customer?: { id: number } | SapoCustomer
  total_price?: number
  subtotal_price?: number
  shipping_lines?: SapoShippingLine[]
  source_name?: string        // Tên kênh bán (đặt "APLUS Website")
  tags?: string
  created_on?: string
}

export interface SapoLineItem {
  variant_id: number
  quantity: number
  price?: number
  title?: string
}

export interface SapoShippingLine {
  title: string
  price: number
  code?: string
}

// ─── Products API ───────────────────────────────────────

/** Lấy danh sách sản phẩm (phân trang, max 250/page) */
export async function getProducts(params?: {
  page?: number
  limit?: number
  published?: boolean
  query?: string
  collection_id?: number
  vendor?: string
  fields?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.limit) searchParams.set("limit", String(Math.min(params.limit, 250)))
  if (params?.published !== undefined) searchParams.set("published_status", params.published ? "published" : "unpublished")
  if (params?.query) searchParams.set("query", params.query)
  if (params?.collection_id) searchParams.set("collection_id", String(params.collection_id))
  if (params?.vendor) searchParams.set("vendor", params.vendor)
  if (params?.fields) searchParams.set("fields", params.fields)

  const qs = searchParams.toString()
  const endpoint = `/products.json${qs ? `?${qs}` : ""}`
  const data = await sapoFetch<{ products: SapoProduct[] }>(endpoint)
  return data.products
}

/** Lấy 1 sản phẩm theo ID */
export async function getProduct(id: number) {
  const data = await sapoFetch<{ product: SapoProduct }>(`/products/${id}.json`)
  return data.product
}

/** Đếm tổng sản phẩm */
export async function getProductCount(params?: { published?: boolean; vendor?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.published !== undefined) searchParams.set("published_status", params.published ? "published" : "unpublished")
  if (params?.vendor) searchParams.set("vendor", params.vendor)

  const qs = searchParams.toString()
  const data = await sapoFetch<{ count: number }>(`/products/count.json${qs ? `?${qs}` : ""}`)
  return data.count
}

/** Lấy TẤT CẢ sản phẩm (auto paginate) */
export async function getAllProducts() {
  const allProducts: SapoProduct[] = []
  let page = 1
  const limit = 250

  while (true) {
    const products = await getProducts({ page, limit })
    allProducts.push(...products)
    if (products.length < limit) break
    page++
  }

  return allProducts
}

// ─── Orders API ─────────────────────────────────────────

/** Tạo đơn hàng mới trong Sapo */
export async function createOrder(order: {
  line_items: SapoLineItem[]
  customer?: { id: number } | SapoCustomer
  shipping_address: SapoAddress
  email?: string
  phone?: string
  note?: string
  financial_status?: string
  shipping_lines?: SapoShippingLine[]
  tags?: string
  source_name?: string
}) {
  const data = await sapoFetch<{ order: SapoOrder }>("/orders.json", {
    method: "POST",
    body: JSON.stringify({
      order: {
        ...order,
        source_name: order.source_name || "APLUS Website",
        tags: order.tags || "aplus-website",
      },
    }),
  })
  return data.order
}

/** Lấy danh sách đơn hàng */
export async function getOrders(params?: {
  page?: number
  limit?: number
  status?: string
  financial_status?: string
  fulfillment_status?: string
  created_on_min?: string
  created_on_max?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.limit) searchParams.set("limit", String(Math.min(params.limit, 250)))
  if (params?.status) searchParams.set("status", params.status)
  if (params?.financial_status) searchParams.set("financial_status", params.financial_status)
  if (params?.fulfillment_status) searchParams.set("fulfillment_status", params.fulfillment_status)
  if (params?.created_on_min) searchParams.set("created_on_min", params.created_on_min)
  if (params?.created_on_max) searchParams.set("created_on_max", params.created_on_max)

  const qs = searchParams.toString()
  const data = await sapoFetch<{ orders: SapoOrder[] }>(`/orders.json${qs ? `?${qs}` : ""}`)
  return data.orders
}

/** Lấy 1 đơn hàng theo ID */
export async function getOrder(id: number) {
  const data = await sapoFetch<{ order: SapoOrder }>(`/orders/${id}.json`)
  return data.order
}

/** Đóng đơn hàng */
export async function closeOrder(id: number) {
  return sapoFetch(`/orders/${id}/close.json`, { method: "POST" })
}

/** Hủy đơn hàng */
export async function cancelOrder(id: number) {
  return sapoFetch(`/orders/${id}/cancel.json`, { method: "POST" })
}

// ─── Customers API ──────────────────────────────────────

/** Tạo khách hàng mới */
export async function createCustomer(customer: SapoCustomer) {
  const data = await sapoFetch<{ customer: SapoCustomer }>("/customers.json", {
    method: "POST",
    body: JSON.stringify({ customer }),
  })
  return data.customer
}

/** Tìm khách hàng theo SĐT hoặc email */
export async function findCustomer(query: string) {
  const data = await sapoFetch<{ customers: SapoCustomer[] }>(
    `/customers.json?query=${encodeURIComponent(query)}&limit=5`
  )
  return data.customers
}

// ─── Inventory API ──────────────────────────────────────

/** Kiểm tra tồn kho 1 variant */
export async function getVariantStock(variantId: number) {
  const data = await sapoFetch<{ variant: SapoVariant }>(
    `/variants/${variantId}.json?fields=id,inventory_quantity,sku`
  )
  return data.variant
}

// ─── Webhooks API ───────────────────────────────────────

export interface SapoWebhook {
  id?: number
  topic: string       // e.g. "orders/create", "products/update"
  address: string     // callback URL
  format?: "json" | "xml"
}

/** Đăng ký webhook */
export async function createWebhook(webhook: SapoWebhook) {
  const data = await sapoFetch<{ webhook: SapoWebhook }>("/webhooks.json", {
    method: "POST",
    body: JSON.stringify({
      webhook: { ...webhook, format: webhook.format || "json" },
    }),
  })
  return data.webhook
}

/** Liệt kê webhooks đã đăng ký */
export async function getWebhooks() {
  const data = await sapoFetch<{ webhooks: SapoWebhook[] }>("/webhooks.json")
  return data.webhooks
}

/** Xóa webhook */
export async function deleteWebhook(id: number) {
  return sapoFetch(`/webhooks/${id}.json`, { method: "DELETE" })
}

// ─── Helper: Map Sapo Product → APLUS Product data ─────

export function mapSapoToLocal(sp: SapoProduct) {
  const variant = sp.variants?.[0]  // Lấy variant đầu tiên (sản phẩm đơn giản)
  const price = variant?.price ?? 0
  const comparePrice = variant?.compare_at_price

  return {
    name: sp.name,
    slug: sp.alias || sp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: sp.content || sp.summary || null,
    image: sp.images?.[0]?.src || null,
    category: sp.product_type || null,
    categoryName: sp.product_type || null,
    brand: sp.vendor || null,
    price: price > 0 ? new Intl.NumberFormat("vi-VN").format(price) : null,
    priceOriginal: comparePrice && comparePrice > price
      ? new Intl.NumberFormat("vi-VN").format(comparePrice)
      : null,
    priceNumeric: price > 0 ? Math.round(price) : null,
    sku: variant?.sku || null,
    stock: variant?.inventory_quantity ?? -1,
    published: sp.published ?? true,
    // Lưu Sapo product ID vào specs để mapping ngược
    specs: JSON.stringify({
      sapoProductId: sp.id,
      sapoVariantId: variant?.id,
      ...(sp.tags ? { tags: sp.tags } : {}),
    }),
  }
}
