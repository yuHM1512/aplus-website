"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight, FileText, Layers, Megaphone,
  Plus, Calendar as CalendarIcon, Eye, Clock, Send,
} from "lucide-react"

interface CalendarPost {
  id: string
  title: string
  published: boolean
  scheduledAt: string | null
  publishedAt: string | null
  createdAt: string
  campaign: { id: string; name: string; color: string } | null
}

interface CalendarCampaign {
  id: string
  name: string
  color: string
  status: string
  startDate: string | null
  endDate: string | null
}

interface CalendarPopup {
  id: string
  name: string
  type: string
  active: boolean
  startDate: string | null
  endDate: string | null
  campaign: { id: string; name: string; color: string } | null
}

const DAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
const MONTHS_VI = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
]

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [posts, setPosts] = useState<CalendarPost[]>([])
  const [campaigns, setCampaigns] = useState<CalendarCampaign[]>([])
  const [popups, setPopups] = useState<CalendarPopup[]>([])
  const [loading, setLoading] = useState(true)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [postsRes, campaignsRes, popupsRes] = await Promise.all([
        fetch("/api/admin/posts?limit=100"),
        fetch("/api/admin/campaigns"),
        fetch("/api/admin/popups"),
      ])

      const postsData = await postsRes.json()
      setPosts(postsData.posts || [])

      const campaignsData = await campaignsRes.json()
      setCampaigns(Array.isArray(campaignsData) ? campaignsData : [])

      const popupsData = await popupsRes.json()
      setPopups(Array.isArray(popupsData) ? popupsData : [])
    } catch {
      // Silent fail
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // Calendar grid
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = (firstDay.getDay() + 6) % 7 // Monday = 0
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => setCurrentDate(new Date())

  // Check ngày cùng ngày
  const isSameDate = (d1: string | null, day: number) => {
    if (!d1) return false
    const d = new Date(d1)
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
  }

  // Tìm events cho ngày
  const getEventsForDay = (day: number) => {
    const dayPosts = posts.filter((p) => {
      if (p.scheduledAt && !p.published) return isSameDate(p.scheduledAt, day)
      if (p.published && p.publishedAt) return isSameDate(p.publishedAt, day)
      return isSameDate(p.createdAt, day)
    })

    const dayPopups = popups.filter((p) => {
      return isSameDate(p.startDate, day)
    })

    return { posts: dayPosts, popups: dayPopups }
  }

  // Active campaigns cho tháng này
  const activeCampaigns = campaigns.filter((c) => {
    if (!c.startDate && !c.endDate) return c.status === "active"
    const start = c.startDate ? new Date(c.startDate) : new Date(0)
    const end = c.endDate ? new Date(c.endDate) : new Date(9999, 11, 31)
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0)
    return start <= monthEnd && end >= monthStart
  })

  const today = new Date()
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  // Build calendar grid
  const cells: (number | null)[] = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Lịch nội dung</h2>
          <p className="text-sm text-gray-500 mt-1">Tổng quan kế hoạch content marketing</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo bài viết
          </Link>
        </div>
      </div>

      {/* Active campaigns bar */}
      {activeCampaigns.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeCampaigns.map((c) => (
            <Link
              key={c.id}
              href={`/admin/campaigns/${c.id}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: c.color + "10",
                borderColor: c.color + "30",
                color: c.color,
              }}
            >
              <Megaphone className="w-3 h-3" />
              {c.name}
              <span className="opacity-60">
                ({c.status === "active" ? "đang chạy" : c.status === "planning" ? "kế hoạch" : c.status})
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Calendar navigation */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-deep-blue min-w-[180px] text-center">
              {MONTHS_VI[month]} {year}
            </h3>
            <button type="button" onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-medium text-ocean-blue bg-ocean-blue/5 hover:bg-ocean-blue/10 rounded-lg transition-colors"
          >
            Hôm nay
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-ocean-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Đang tải lịch...</p>
          </div>
        ) : (
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_VI.map((d) => (
                <div key={d} className="text-center text-xs font-bold text-gray-400 py-2 uppercase">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-px bg-[#E2E8F0] rounded-lg overflow-hidden">
              {cells.map((day, i) => {
                if (day === null) {
                  return <div key={i} className="bg-[#F8FAFC] min-h-[100px]" />
                }

                const events = getEventsForDay(day)
                const hasEvents = events.posts.length > 0 || events.popups.length > 0

                return (
                  <div
                    key={i}
                    className={`bg-white min-h-[100px] p-2 ${
                      isToday(day) ? "ring-2 ring-inset ring-ocean-blue" : ""
                    }`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday(day) ? "text-ocean-blue" : "text-gray-700"
                    }`}>
                      {day}
                    </div>

                    <div className="space-y-1">
                      {events.posts.slice(0, 3).map((p) => (
                        <Link
                          key={p.id}
                          href={`/admin/posts/${p.id}`}
                          className={`block px-1.5 py-0.5 rounded text-[10px] font-medium truncate transition-colors ${
                            p.published
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : p.scheduledAt
                              ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          style={p.campaign ? { borderLeft: `2px solid ${p.campaign.color}` } : undefined}
                          title={p.title}
                        >
                          {p.scheduledAt && !p.published && <Clock className="w-2.5 h-2.5 inline mr-0.5" />}
                          {p.published && <Send className="w-2.5 h-2.5 inline mr-0.5" />}
                          {p.title}
                        </Link>
                      ))}

                      {events.popups.slice(0, 2).map((p) => (
                        <Link
                          key={p.id}
                          href={`/admin/popups/${p.id}`}
                          className="block px-1.5 py-0.5 rounded text-[10px] font-medium truncate bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
                          title={`Popup: ${p.name}`}
                        >
                          <Layers className="w-2.5 h-2.5 inline mr-0.5" />
                          {p.name}
                        </Link>
                      ))}

                      {(events.posts.length > 3 || events.popups.length > 2) && (
                        <p className="text-[10px] text-gray-400 px-1.5">
                          +{events.posts.length - 3 + Math.max(0, events.popups.length - 2)} khác
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />
          <span>Đã xuất bản</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-50 border border-blue-200" />
          <span>Đã lên lịch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
          <span>Bản nháp</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-purple-50 border border-purple-200" />
          <span>Popup / Banner</span>
        </div>
      </div>
    </>
  )
}
