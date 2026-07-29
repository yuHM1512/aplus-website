"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { WATER_SOURCES, HOUSE_TYPES, BUDGET, WATER_ISSUES } from "@/lib/survey-options"

const STEPS = [
  "Thông tin liên hệ",
  "Nguồn nước",
  "Loại nhà",
  "Mức đầu tư",
  "Vấn đề nước",
]

export function SurveyForm() {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [data, setData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    waterSources: [] as string[],
    houseType: "" as string,
    budget: "" as string,
    issues: [] as string[],
  })

  // Email là tùy chọn: bỏ trống thì hợp lệ, có nhập thì phải đúng định dạng
  const emailValid =
    data.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())

  const toggleArray = (key: "waterSources" | "issues", value: string) => {
    setData((d) => ({
      ...d,
      [key]: d[key].includes(value)
        ? d[key].filter((v) => v !== value)
        : [...d[key], value],
    }))
  }

  const canProceed = () => {
    if (step === 0) return data.fullName.length >= 2 && data.phone.length >= 9 && data.address.length >= 3 && emailValid
    if (step === 1) return data.waterSources.length > 0
    if (step === 2) return data.houseType.length > 0
    if (step === 3) return data.budget.length > 0
    if (step === 4) return data.issues.length > 0
    return false
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) setDone(true)
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-lg p-10 text-center border border-gray-100">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#006EF5] flex items-center justify-center mb-5">
          <Check className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#102590] mb-2">Cảm ơn bạn!</h2>
        <p className="text-gray-600 leading-relaxed">
          Chúng tôi đã nhận được thông tin khảo sát của bạn. Đội ngũ chuyên gia APLUS sẽ liên hệ tư vấn trong vòng 24 giờ.
        </p>
      </div>
    )
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6 md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold text-[#102590]">
            Bước {step + 1} trên {STEPS.length}
          </span>
          <span className="text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-[#F2F3F4] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#006EF5] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-[#102590] mb-6">{STEPS[step]}</h2>

      {/* Step 1: Contact info */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Họ và tên *
            </label>
            <input
              type="text"
              placeholder="Nhập họ và tên"
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
              className="w-full h-11 px-4 rounded-md border border-[#B5DBFF] focus:outline-none focus:border-[#006EF5] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="font-normal text-gray-400">(không bắt buộc — để nhận email xác nhận)</span>
            </label>
            <input
              type="email"
              inputMode="email"
              placeholder="email@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className={cn(
                "w-full h-11 px-4 rounded-md border focus:outline-none text-sm",
                emailValid
                  ? "border-[#B5DBFF] focus:border-[#006EF5]"
                  : "border-red-400 focus:border-red-500"
              )}
            />
            {!emailValid && (
              <p className="mt-1 text-xs text-red-500">Email chưa đúng định dạng</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số điện thoại *
              </label>
              <input
                type="tel"
                placeholder="09xx xxx xxx"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full h-11 px-4 rounded-md border border-[#B5DBFF] focus:outline-none focus:border-[#006EF5] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Địa chỉ lắp đặt *
              </label>
              <input
                type="text"
                placeholder="Thành phố, Quận/Huyện"
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                className="w-full h-11 px-4 rounded-md border border-[#B5DBFF] focus:outline-none focus:border-[#006EF5] text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Water sources */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {WATER_SOURCES.map((s) => {
            const active = data.waterSources.includes(s.value)
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleArray("waterSources", s.value)}
                className={cn(
                  "text-left rounded-lg p-4 border-2 transition-all",
                  active
                    ? "border-[#006EF5] bg-[#B5DBFF]/40"
                    : "border-gray-200 hover:border-[#B5DBFF]"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-[#102590]">{s.label}</span>
                  {active && (
                    <div className="w-5 h-5 rounded-full bg-[#006EF5] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </button>
            )
          })}
        </div>
      )}

      {/* Step 3: House type */}
      {step === 2 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {HOUSE_TYPES.map((h) => (
            <button
              key={h.value}
              type="button"
              onClick={() => setData({ ...data, houseType: h.value })}
              className={cn(
                "rounded-lg p-6 border-2 text-center transition-all",
                data.houseType === h.value
                  ? "border-[#006EF5] bg-[#B5DBFF]/40 text-[#102590] font-bold"
                  : "border-gray-200 hover:border-[#B5DBFF] text-gray-700"
              )}
            >
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-sm">{h.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Step 4: Budget */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BUDGET.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setData({ ...data, budget: b.value })}
              className={cn(
                "rounded-lg p-4 border-2 text-left transition-all",
                data.budget === b.value
                  ? "border-[#006EF5] bg-[#B5DBFF]/40 text-[#102590] font-bold"
                  : "border-gray-200 hover:border-[#B5DBFF] text-gray-700"
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}

      {/* Step 5: Issues */}
      {step === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {WATER_ISSUES.map((i) => {
            const active = data.issues.includes(i)
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleArray("issues", i)}
                className={cn(
                  "flex items-center gap-3 rounded-md p-3 border text-left text-sm transition-all",
                  active
                    ? "border-[#006EF5] bg-[#B5DBFF]/40 text-[#102590]"
                    : "border-gray-200 hover:border-[#B5DBFF] text-gray-700"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0",
                    active ? "border-[#006EF5] bg-[#006EF5]" : "border-gray-300"
                  )}
                >
                  {active && <Check className="h-3 w-3 text-white" />}
                </div>
                <span>{i}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="inline-flex items-center gap-2 h-11 px-4 text-sm font-semibold text-gray-600 hover:text-[#102590] disabled:opacity-0 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[#006EF5] text-white text-sm font-bold uppercase hover:bg-[#0058C7] disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Tiếp theo <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || submitting}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-md bg-[#102590] text-white text-sm font-bold uppercase hover:bg-[#36D1FF] hover:text-[#102590] disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi khảo sát"}
          </button>
        )}
      </div>
    </div>
  )
}
