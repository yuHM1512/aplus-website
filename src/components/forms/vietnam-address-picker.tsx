"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"

// ─── Types ──────────────────────────────────────────────
interface AreaNode {
  code: number
  name: string
}

interface Province extends AreaNode {
  districts?: AreaNode[]
}

interface District extends AreaNode {
  wards?: AreaNode[]
}

// ─── API + localStorage cache ───────────────────────────
const API = "https://provinces.open-api.vn/api"
const CACHE_KEY = "aplus-address-provinces"
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 ngày

async function fetchProvinces(): Promise<Province[]> {
  // Try cache
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const { data, ts } = JSON.parse(raw)
        if (Date.now() - ts < CACHE_TTL_MS && Array.isArray(data)) {
          return data
        }
      }
    } catch {
      // ignore
    }
  }

  const res = await fetch(`${API}/p/`)
  if (!res.ok) throw new Error("Không tải được danh sách tỉnh/thành")
  const data = await res.json()

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
    } catch {
      // storage full — ignore
    }
  }

  return data
}

async function fetchDistricts(provinceCode: number): Promise<AreaNode[]> {
  const res = await fetch(`${API}/p/${provinceCode}?depth=2`)
  if (!res.ok) throw new Error("Không tải được danh sách quận/huyện")
  const data: Province = await res.json()
  return data.districts || []
}

async function fetchWards(districtCode: number): Promise<AreaNode[]> {
  const res = await fetch(`${API}/d/${districtCode}?depth=2`)
  if (!res.ok) throw new Error("Không tải được danh sách phường/xã")
  const data: District = await res.json()
  return data.wards || []
}

// ─── Component ──────────────────────────────────────────
interface Props {
  /** Selected name values (used for form submission) */
  province: string
  district: string
  ward: string
  onChange: (val: { province: string; district: string; ward: string }) => void
  errors?: {
    province?: string
    district?: string
    ward?: string
  }
}

export function VietnamAddressPicker({ province, district, ward, onChange, errors }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<AreaNode[]>([])
  const [wards, setWards] = useState<AreaNode[]>([])

  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)

  // Load provinces on mount
  useEffect(() => {
    fetchProvinces()
      .then(setProvinces)
      .catch((err) => console.error("[address]", err))
      .finally(() => setLoadingProvinces(false))
  }, [])

  // Handlers — dùng name làm value để submit thẳng lên form
  const handleProvinceChange = async (name: string) => {
    onChange({ province: name, district: "", ward: "" })
    setDistricts([])
    setWards([])
    if (!name) return
    const p = provinces.find((x) => x.name === name)
    if (!p) return
    setLoadingDistricts(true)
    try {
      const list = await fetchDistricts(p.code)
      setDistricts(list)
    } catch (err) {
      console.error("[address]", err)
    } finally {
      setLoadingDistricts(false)
    }
  }

  const handleDistrictChange = async (name: string) => {
    onChange({ province, district: name, ward: "" })
    setWards([])
    if (!name) return
    const d = districts.find((x) => x.name === name)
    if (!d) return
    setLoadingWards(true)
    try {
      const list = await fetchWards(d.code)
      setWards(list)
    } catch (err) {
      console.error("[address]", err)
    } finally {
      setLoadingWards(false)
    }
  }

  const handleWardChange = (name: string) => {
    onChange({ province, district, ward: name })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Tỉnh / Thành phố */}
      <Field label="Tỉnh / Thành phố" required error={errors?.province}>
        <SelectWrapper loading={loadingProvinces}>
          <select
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            disabled={loadingProvinces}
            className={selectClass(!!errors?.province)}
          >
            <option value="">-- Chọn tỉnh / thành --</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </Field>

      {/* Quận / Huyện */}
      <Field label="Quận / Huyện" required error={errors?.district}>
        <SelectWrapper loading={loadingDistricts}>
          <select
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!province || loadingDistricts}
            className={selectClass(!!errors?.district)}
          >
            <option value="">
              {!province ? "-- Chọn tỉnh trước --" : "-- Chọn quận / huyện --"}
            </option>
            {districts.map((d) => (
              <option key={d.code} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </Field>

      {/* Phường / Xã */}
      <Field label="Phường / Xã" required error={errors?.ward}>
        <SelectWrapper loading={loadingWards}>
          <select
            value={ward}
            onChange={(e) => handleWardChange(e.target.value)}
            disabled={!district || loadingWards}
            className={selectClass(!!errors?.ward)}
          >
            <option value="">
              {!district ? "-- Chọn huyện trước --" : "-- Chọn phường / xã --"}
            </option>
            {wards.map((w) => (
              <option key={w.code} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </SelectWrapper>
      </Field>
    </div>
  )
}

/* ── Field wrapper ── */
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[#111827]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

/* ── Select wrapper với loading + chevron ── */
function SelectWrapper({
  loading,
  children,
}: {
  loading?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {children}
      {loading ? (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin pointer-events-none" />
      ) : (
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      )}
    </div>
  )
}

/* ── Select styling ── */
function selectClass(error: boolean): string {
  return `h-11 w-full border rounded-md pl-3.5 pr-9 text-sm text-[#111827] bg-white outline-none transition-colors appearance-none cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 focus:border-[#006EF5] focus:ring-1 focus:ring-[#006EF5] ${
    error ? "border-red-400" : "border-gray-200"
  }`
}
