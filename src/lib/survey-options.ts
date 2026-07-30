// ─── Survey Options (dùng chung client + server) ────────
// Tách ra module này để form khảo sát VÀ phía server (email, Sapo note,
// admin) cùng dùng một nguồn label, tránh lệch dữ liệu.
// Lưu ý: KHÔNG thêm "use client"/"use server" — chỉ constants + pure functions.

export interface SurveyOption {
  value: string
  label: string
  desc?: string
  icon?: string
}

export const WATER_SOURCES: SurveyOption[] = [
  { value: "nuoc_may", label: "Nước máy", desc: "Nước từ nhà máy cung cấp" },
  { value: "gieng_khoan", label: "Nước giếng khoan", desc: "Nước ngầm tự khai thác" },
  { value: "khac", label: "Nguồn khác", desc: "Nước mưa, nước bồn..." },
]

export const HOUSE_TYPES: SurveyOption[] = [
  { value: "biet_thu", label: "Biệt thự", icon: "🏡" },
  { value: "nha_dat", label: "Nhà đất liền kề", icon: "🏘️" },
  { value: "chung_cu", label: "Căn hộ chung cư", icon: "🏢" },
  { value: "khac", label: "Khác", icon: "🏗️" },
]

export const BUDGET: SurveyOption[] = [
  { value: "duoi_30tr", label: "Dưới 30 triệu" },
  { value: "30_60tr", label: "30 - 60 triệu" },
  { value: "60_100tr", label: "60 - 100 triệu" },
  { value: "100_500tr", label: "100 - 500 triệu" },
  { value: "tren_500tr", label: "Trên 500 triệu" },
]

// WATER_ISSUES: label chính là giá trị lưu trữ (không cần map ngược)
export const WATER_ISSUES: string[] = [
  "Nước có màu vàng, nâu, đen",
  "Nước có cặn bẩn, bùn đất, rỉ sét",
  "Nước có clo, mùi tanh, hôi thối",
  "Nước có vị lạ",
  "Nước có cảm giác nhờn",
  "Nước nhiều cặn đá vôi",
  "Nước nhiễm kim loại nặng (asen, chì...)",
  "Nước nhiễm khuẩn, vi rút",
  "Viêm da, mụn kéo dài",
  "Tóc xơ, khô cứng",
  "Quần áo giặt bị xơ cứng",
  "Vấn đề khác",
]

// ─── Helpers: value → label ─────────────────────────────

/** Lấy label của 1 value. Nếu không khớp, trả về chính value (fallback an toàn). */
export function labelOf(list: SurveyOption[], value: string): string {
  return list.find((o) => o.value === value)?.label ?? value
}

/** Lấy danh sách label từ mảng value. */
export function labelsOf(list: SurveyOption[], values: string[]): string[] {
  return values.map((v) => labelOf(list, v))
}
