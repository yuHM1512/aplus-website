"use client"

import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

interface PopupData {
  id: string
  name: string
  type: string // popup | top_banner | landing_hero
  contentType: string // image | html
  imageUrl: string | null
  htmlContent: string | null
  linkUrl: string | null
  linkTarget: string
  position: string
  displayFrequency: string
  delay: number
}

/**
 * Component hiển thị popup/banner trên trang public.
 * Tự động fetch popup active cho trang hiện tại.
 */
export function PopupDisplay() {
  const pathname = usePathname()
  const [popups, setPopups] = useState<PopupData[]>([])
  const [visiblePopups, setVisiblePopups] = useState<Set<string>>(new Set())
  const [dismissedPopups, setDismissedPopups] = useState<Set<string>>(new Set())

  // Check-on-visit: tự động publish bài viết đã hẹn giờ khi có visitor
  useEffect(() => {
    fetch("/api/posts/check-scheduled", { method: "POST" }).catch(() => {})
  }, [])

  // Fetch popups cho trang hiện tại
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await fetch(`/api/popups?page=${pathname}`)
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data)) setPopups(data)
      } catch {
        // Silent fail — popup không hiện thì thôi
      }
    }
    fetchPopups()
  }, [pathname])

  // Hiển thị popup theo delay
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    for (const popup of popups) {
      // Check display frequency
      const storageKey = `popup_seen_${popup.id}`
      const frequency = popup.displayFrequency

      if (frequency === "once_per_session") {
        // Dùng biến JS thay vì sessionStorage (không support trong Claude.ai artifacts)
        if (dismissedPopups.has(popup.id)) continue
      } else if (frequency === "once_per_day") {
        // Check thời gian hiển thị gần nhất
        if (dismissedPopups.has(popup.id)) continue
      }

      const timer = setTimeout(() => {
        setVisiblePopups((prev) => new Set(prev).add(popup.id))
        // Track impression
        fetch("/api/popups/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ popupId: popup.id, action: "impression" }),
        }).catch(() => {})
      }, popup.delay)

      timers.push(timer)
    }

    return () => timers.forEach(clearTimeout)
  }, [popups, dismissedPopups])

  const dismissPopup = useCallback((id: string) => {
    setVisiblePopups((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setDismissedPopups((prev) => new Set(prev).add(id))
  }, [])

  const handleClick = useCallback((popup: PopupData) => {
    // Track click
    fetch("/api/popups/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ popupId: popup.id, action: "click" }),
    }).catch(() => {})

    if (popup.linkUrl) {
      if (popup.linkTarget === "_blank") {
        window.open(popup.linkUrl, "_blank")
      } else {
        window.location.href = popup.linkUrl
      }
    }
  }, [])

  // Phân loại popup theo type
  const topBanners = popups.filter(
    (p) => p.type === "top_banner" && visiblePopups.has(p.id) && !dismissedPopups.has(p.id)
  )

  const centerPopups = popups.filter(
    (p) => (p.type === "popup" || p.type === "landing_hero") && visiblePopups.has(p.id) && !dismissedPopups.has(p.id)
  )

  return (
    <>
      {/* Top Banners */}
      {topBanners.map((popup) => (
        <div
          key={popup.id}
          className="relative w-full bg-deep-blue text-white"
        >
          <div className="relative">
            {popup.contentType === "image" && popup.imageUrl ? (
              <div
                className="cursor-pointer"
                onClick={() => handleClick(popup)}
              >
                <img src={popup.imageUrl} alt={popup.name} className="w-full h-auto max-h-[80px] object-cover" />
              </div>
            ) : popup.contentType === "html" && popup.htmlContent ? (
              <div
                className="cursor-pointer"
                onClick={() => handleClick(popup)}
                dangerouslySetInnerHTML={{ __html: popup.htmlContent }}
              />
            ) : null}

            <button
              onClick={() => dismissPopup(popup.id)}
              className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
              aria-label="Đóng banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Center Popups (modal overlay) */}
      {centerPopups.length > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => dismissPopup(centerPopups[0].id)}
          />

          {/* Popup content */}
          {centerPopups.slice(0, 1).map((popup) => (
            <div
              key={popup.id}
              className={`relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden max-w-lg w-full animate-in fade-in zoom-in duration-300 ${
                popup.position === "fullscreen" ? "max-w-4xl" : ""
              }`}
            >
              <button
                onClick={() => dismissPopup(popup.id)}
                className="absolute top-3 right-3 z-20 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                aria-label="Đóng popup"
              >
                <X className="w-4 h-4" />
              </button>

              <div
                className={popup.linkUrl ? "cursor-pointer" : ""}
                onClick={() => popup.linkUrl && handleClick(popup)}
              >
                {popup.contentType === "image" && popup.imageUrl ? (
                  <img src={popup.imageUrl} alt={popup.name} className="w-full h-auto" />
                ) : popup.contentType === "html" && popup.htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: popup.htmlContent }} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
