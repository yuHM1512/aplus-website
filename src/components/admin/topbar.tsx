"use client"

import { Bell, HelpCircle, Search } from "lucide-react"

export function AdminTopbar() {
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-white sticky top-0 z-40 shadow-sm border-b border-[#E2E8F0]">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung..."
            className="w-full pl-10 pr-4 py-2 bg-[#eff4ff] border-none rounded-lg text-sm focus:ring-2 focus:ring-ocean-blue/20 outline-none"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="relative hover:text-ocean-blue transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="hover:text-ocean-blue transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="h-8 w-px bg-[#E2E8F0]" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Quản trị viên</p>
            <p className="text-[11px] text-gray-500">Admin</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-deep-blue flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
