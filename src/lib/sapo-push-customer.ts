// ─── Đẩy khách khảo sát sang Sapo ───────────────────────
// Khi khách đăng ký khảo sát trên web → CHỈ tạo customer mới trên Sapo nếu SĐT
// chưa tồn tại. Nếu SĐT đã có → để nguyên khách cũ, KHÔNG cập nhật gì cả.
// Server-side only.

import { createCustomer, findCustomer } from "@/lib/sapo"
import {
  WATER_SOURCES,
  HOUSE_TYPES,
  BUDGET,
  labelOf,
  labelsOf,
} from "@/lib/survey-options"

const SURVEY_TAG = "khao-sat-web"

export interface SurveyCustomerInput {
  fullName: string
  phone: string
  email?: string | null
  address: string
  waterSources: string[]
  houseType: string
  budget: string
  issues: string[]
}

export interface PushCustomerResult {
  success: boolean
  skipped?: boolean // Bỏ qua vì chưa cấu hình Sapo
  existed?: boolean // SĐT đã có trên Sapo → giữ nguyên, không tạo/không sửa
  sapoCustomerId?: number
  error?: string
}

// Tách "Nguyễn Văn A" → last_name "Nguyễn Văn", first_name "A"
function splitName(fullName: string): { first_name: string; last_name: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first_name: "Khách", last_name: "" }
  if (parts.length === 1) return { first_name: parts[0], last_name: "" }
  return {
    first_name: parts[parts.length - 1],
    last_name: parts.slice(0, -1).join(" "),
  }
}

// Lấy 9 số cuối của SĐT để so khớp — bất kể lưu dạng 0xxx hay 84xxx hay +84
function phoneKey(phone: string): string {
  return (phone || "").replace(/\D/g, "").slice(-9)
}

// Sapo giới hạn note tối đa 255 ký tự → cắt cứng để không lỗi 422.
const SAPO_NOTE_MAX = 255

/** Cắt chuỗi về đúng maxLen ký tự, thêm dấu … nếu bị cắt. */
function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s
  return s.slice(0, Math.max(0, maxLen - 1)) + "…"
}

// Note trên Sapo chỉ giữ 3 điểm chính để nhân viên bán hàng lướt qua biết context:
// ngân sách, loại nhà, nguồn nước — cộng số lượng vấn đề nước để biết mức độ.
// Chi tiết đầy đủ (địa chỉ, danh sách vấn đề, ghi chú riêng) đã có trong email
// gửi admin qua Gmail và trong bản ghi khảo sát ở DB.
function buildNote(input: SurveyCustomerInput): string {
  const sources = labelsOf(WATER_SOURCES, input.waterSources).join(", ") || "—"
  const house = labelOf(HOUSE_TYPES, input.houseType)
  const budget = labelOf(BUDGET, input.budget)
  const issueCount = input.issues.length

  const note = `[Khảo sát web] Ngân sách: ${budget} | ${house} | Nguồn: ${sources} | ${issueCount} vấn đề nước — xem email admin để biết chi tiết.`
  return truncate(note, SAPO_NOTE_MAX)
}

// Tìm customer trên Sapo theo SĐT — thử nhiều biến thể query + so khớp 9 số cuối
// để không bị trượt do Sapo lưu số ở dạng quốc tế (84xxx) khác với form (0xxx).
async function findByPhone(phone: string) {
  const key = phoneKey(phone)
  if (!key) return null

  // Thử lần lượt: số gốc → 9 số cuối → dạng 0xxx → dạng 84xxx
  const queries = [phone, key, `0${key}`, `84${key}`]
  const tried = new Set<string>()

  for (const q of queries) {
    if (!q || tried.has(q)) continue
    tried.add(q)
    const list = await findCustomer(q).catch(() => [])
    const hit = list.find((c) => c.phone && phoneKey(c.phone) === key)
    if (hit?.id) return hit
  }
  return null
}

/**
 * Đẩy khách khảo sát sang Sapo.
 * - SĐT ĐÃ tồn tại → giữ nguyên khách cũ, KHÔNG sửa (trả existed = true).
 * - SĐT CHƯA có → tạo customer mới, gắn tag + note khảo sát.
 * KHÔNG throw ra ngoài — luôn trả về kết quả để caller log, tránh làm hỏng request.
 */
export async function pushSurveyCustomerToSapo(
  input: SurveyCustomerInput
): Promise<PushCustomerResult> {
  // Chưa cấu hình Sapo → bỏ qua êm (không coi là lỗi)
  if (!process.env.SAPO_STORE || !process.env.SAPO_API_KEY || !process.env.SAPO_API_SECRET) {
    return { success: false, skipped: true, error: "SAPO chưa cấu hình" }
  }

  try {
    // 1) SĐT đã có trên Sapo → giữ nguyên, không tạo/không sửa
    const existing = await findByPhone(input.phone)
    if (existing?.id) {
      return { success: true, existed: true, sapoCustomerId: existing.id }
    }

    // 2) Chưa có → tạo mới
    const { first_name, last_name } = splitName(input.fullName)
    const created = await createCustomer({
      first_name,
      last_name,
      email: input.email || undefined,
      phone: input.phone,
      note: buildNote(input),
      tags: SURVEY_TAG,
      addresses: [
        {
          address1: input.address,
          phone: input.phone,
          first_name,
          last_name,
          default: true,
        },
      ],
    })

    return { success: true, sapoCustomerId: created.id }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)

    // Fallback: Sapo báo SĐT đã tồn tại (search trượt) → coi như đã có, giữ nguyên.
    if (/taken|đã tồn tại|phone/i.test(msg)) {
      const again = await findByPhone(input.phone).catch(() => null)
      return {
        success: true,
        existed: true,
        sapoCustomerId: again?.id,
      }
    }

    return { success: false, error: msg || "Lỗi không xác định khi đẩy Sapo" }
  }
}
