"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Building2, Phone, X } from "lucide-react"
import { SITE_CONFIG } from "@/lib/constants"

export function FloatingContact() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-5 right-4 z-50 flex w-[min(18rem,calc(100vw-2rem))] flex-col items-end gap-3 sm:right-6">
      {open && (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg shadow-gray-900/10 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <div className="flex items-center justify-between bg-[#102590] px-4 py-3">
            <span className="text-sm font-bold text-white">Liên hệ nhanh</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 transition-colors hover:text-white"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 p-3">
            <ContactRow
              href={`tel:${SITE_CONFIG.hotline.replace(/\s/g, "")}`}
              label="Hotline"
              value="0935.455.558"
              icon={<Phone className="h-6 w-6 text-red-600" fill="currentColor" />}
            />

            <ContactRow
              href={`tel:${SITE_CONFIG.officePhone.replace(/[\s()]/g, "")}`}
              label="Trụ sở"
              value="(0256) 3821.410"
              icon={<Building2 className="h-6 w-6 text-gray-900" />}
            />

            <ContactRow
              href={SITE_CONFIG.zaloUrl}
              label={`Zalo Chat (${SITE_CONFIG.zaloHours})`}
              value="Nhắn tin ngay"
              icon={<ZaloLogo />}
              external
            />
          </div>
        </div>
      )}

      {!open && (
        <a
          href={SITE_CONFIG.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center gap-3 rounded-full bg-[#0068ff] p-2 pr-5 text-white shadow-lg shadow-blue-900/20 ring-4 ring-white/90 transition-transform hover:-translate-y-0.5"
          aria-label={`Chat Zalo ${SITE_CONFIG.zaloPhone}`}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
            <ZaloLogo compact />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-xs font-bold uppercase tracking-wide text-white/85">
              Zalo
            </span>
            <span className="block truncate text-lg font-black tracking-wide">
              0935455558
            </span>
          </span>
        </a>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-3 rounded-full p-2 pr-5 text-left shadow-lg transition-colors ${
          open
            ? "bg-gray-700 text-white hover:bg-gray-800"
            : "bg-white text-[#102590] ring-1 ring-gray-200 hover:bg-[#B5DBFF]/30"
        }`}
        aria-label={open ? "Đóng liên hệ" : "Liên hệ nhanh"}
      >
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            open ? "bg-white/15" : "bg-red-50"
          }`}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Phone className="h-6 w-6 text-red-600" fill="currentColor" />
          )}
        </span>
        <span className="min-w-0 leading-tight">
          <span className={open ? "text-xs font-semibold text-white/75" : "text-xs font-semibold text-gray-500"}>
            {open ? "Đóng bảng liên hệ" : "Hotline"}
          </span>
          <span className="block truncate text-lg font-black">
            {open ? "Thu gọn" : "0935.455.558"}
          </span>
        </span>
      </button>
    </div>
  )
}

function ContactRow({
  href,
  label,
  value,
  icon,
  external = false,
}: {
  href: string
  label: string
  value: string
  icon: ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-3 py-3 shadow-sm transition-colors hover:border-[#006EF5] hover:bg-[#F2F8FF]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block text-base font-medium text-gray-600">{label}</span>
        <span className="block break-words text-xl font-black text-gray-900 transition-colors group-hover:text-[#006EF5]">
          {value}
        </span>
      </span>
    </a>
  )
}

function ZaloLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={[
        "relative flex items-center justify-center rounded-full bg-white font-black text-[#0068ff]",
        compact ? "h-9 w-9 text-[12px]" : "h-10 w-10 text-[13px]",
      ].join(" ")}
      aria-hidden="true"
    >
      <span className="absolute inset-1 rounded-full border-2 border-[#0068ff]" />
      <span className="relative tracking-[-0.03em]">Zalo</span>
    </span>
  )
}
