"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { label: "Sản phẩm", href: "/admin/products", icon: Package },
  { label: "Bài viết", href: "/admin/posts", icon: FileText },
  { label: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { label: "Liên hệ", href: "/admin/contacts", icon: MessageSquare },
  { label: "Cài đặt", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <aside className="flex flex-col h-full w-[260px] fixed left-0 top-0 z-50 bg-deep-blue">
      {/* Logo */}
      <div className="p-6 mb-4">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo-icon.png"
            alt="APLUS"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-lg font-bold text-white">APLUS Tech</h1>
            <p className="text-xs font-medium text-white/60">Admin Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-r-lg transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white border-l-4 border-ocean-blue"
                  : "text-white/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
