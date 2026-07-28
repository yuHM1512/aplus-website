"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect, useCallback } from "react"
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Search,
  Shield,
  Home,
  Wrench,
  Waves,
  Droplets,
  Cylinder,
  Layers,
  Filter,
  Cog,
  Package,
  Thermometer,
  Gauge,
  Box,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { CartIcon } from "@/components/ui/cart-icon"
import { WishlistIcon } from "@/components/ui/wishlist-icon"
import {
  NAV_ITEMS,
  SITE_CONFIG,
  MEGA_MENU_GROUPS,
  MEGA_MENU_SERVICES,
} from "@/lib/constants"

// Icon mapping — lucide icons for each category
const iconMap: Record<string, typeof Waves> = {
  Waves,
  Droplets,
  Cylinder,
  Layers,
  Filter,
  Wrench,
  Cog,
  Package,
  Thermometer,
  Gauge,
  Box,
  Search,
  Shield,
  Home,
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close mega menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        megaRef.current &&
        !megaRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setMegaOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mega menu on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Hover handlers with delay to prevent flicker
  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setMegaOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setMegaOpen(false)
    }, 200)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <Container className="flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo/logo-horizontal.png"
            alt={SITE_CONFIG.name}
            width={200}
            height={44}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Menu chính">
          {NAV_ITEMS.map((item) =>
            item.label === "Sản phẩm" ? (
              /* -- San pham trigger with mega menu -- */
              <div
                key={item.href}
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  ref={triggerRef}
                  type="button"
                  className={[
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                    megaOpen
                      ? "bg-[#006EF5]/10 text-[#006EF5]"
                      : "text-gray-700 hover:text-[#006EF5] hover:bg-gray-50",
                  ].join(" ")}
                  onClick={() => setMegaOpen((prev) => !prev)}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown
                    className={[
                      "h-4 w-4 transition-transform duration-200",
                      megaOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {/* -- Mega menu dropdown -- */}
                <div
                  ref={megaRef}
                  className={[
                    "absolute left-1/2 top-full pt-2 -translate-x-1/2",
                    "transition-all duration-200 ease-out",
                    megaOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none",
                  ].join(" ")}
                  style={{ width: "min(860px, calc(100vw - 2rem))" }}
                >
                  <div className="rounded-xl border border-gray-200 bg-white shadow-xl shadow-gray-200/60 overflow-hidden">
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#102590] to-[#006EF5] px-6 py-3">
                      <span className="text-sm font-bold uppercase tracking-wider text-white">
                        Danh Mục Sản Phẩm
                      </span>
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#B5DBFF] hover:text-white transition-colors"
                        onClick={() => setMegaOpen(false)}
                      >
                        Xem tất cả
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    {/* Body — product groups + services sidebar */}
                    <div className="grid grid-cols-[1fr_220px]">
                      {/* Left: category groups */}
                      <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100 p-1">
                        {MEGA_MENU_GROUPS.map((group) => (
                          <div key={group.title} className="px-4 py-4">
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#102590]">
                              {group.title}
                            </h3>
                            <ul className="space-y-0.5">
                              {group.items.map((cat) => {
                                const Icon = iconMap[cat.icon] || Droplets
                                return (
                                  <li key={cat.slug}>
                                    <Link
                                      href={`/products?cat=${cat.slug}`}
                                      className="group/item flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-700 transition-colors hover:bg-[#006EF5]/8 hover:text-[#006EF5]"
                                      onClick={() => setMegaOpen(false)}
                                    >
                                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F2F3F4] text-[#102590] transition-colors group-hover/item:bg-[#006EF5]/15 group-hover/item:text-[#006EF5]">
                                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                                      </span>
                                      <span className="font-medium">{cat.label}</span>
                                      {cat.badge && (
                                        <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none text-white">
                                          {cat.badge}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Right: services sidebar */}
                      <div className="border-l border-gray-100 bg-[#F8F9FB] px-5 py-4">
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#102590]">
                          Dịch vụ
                        </h3>
                        <ul className="space-y-1">
                          {MEGA_MENU_SERVICES.map((svc) => {
                            const Icon = iconMap[svc.icon] || Wrench
                            return (
                              <li key={svc.label}>
                                <Link
                                  href={svc.href}
                                  className="group/svc flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition-colors hover:bg-white hover:text-[#006EF5] hover:shadow-sm"
                                  onClick={() => setMegaOpen(false)}
                                >
                                  <Icon className="h-4 w-4 text-[#006EF5] opacity-60 group-hover/svc:opacity-100" strokeWidth={1.8} />
                                  <span className="font-medium">{svc.label}</span>
                                </Link>
                              </li>
                            )
                          })}
                        </ul>

                        {/* CTA */}
                        <Link
                          href="/survey"
                          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#102590] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#006EF5]"
                          onClick={() => setMegaOpen(false)}
                        >
                          Đăng Ký Khảo Sát
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* -- Regular nav item -- */
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#006EF5] hover:bg-gray-50 transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#102590]"
          >
            <Phone className="h-4 w-4" />
            {SITE_CONFIG.phone}
          </a>
          <WishlistIcon />
          <CartIcon />
          <Link
            href="/survey"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] px-6 text-sm font-semibold uppercase text-white hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
          >
            Đăng Ký Khảo Sát
          </Link>
        </div>

        {/* Mobile: cart icon + hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <WishlistIcon />
          <CartIcon />
          <button
            className="p-2 text-[#102590]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* -- Mobile drawer -- */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[81px] bottom-0 z-40 overflow-y-auto bg-white border-t border-gray-100">
          <Container className="py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) =>
              item.label === "Sản phẩm" ? (
                <div key={item.href}>
                  {/* Accordion trigger */}
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileProductsOpen((prev) => !prev)}
                    aria-expanded={mobileProductsOpen}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={[
                        "h-4 w-4 text-gray-400 transition-transform duration-200",
                        mobileProductsOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  {/* Expandable categories */}
                  <div
                    className={[
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      mobileProductsOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0",
                    ].join(" ")}
                  >
                    <div className="ml-2 border-l-2 border-[#006EF5]/20 pl-3 pb-2">
                      {/* View all link */}
                      <Link
                        href="/products"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#006EF5] hover:bg-[#006EF5]/8"
                        onClick={() => setMobileOpen(false)}
                      >
                        <ArrowRight className="h-4 w-4" />
                        Xem tất cả sản phẩm
                      </Link>

                      {MEGA_MENU_GROUPS.map((group) => (
                        <div key={group.title} className="mt-3">
                          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {group.title}
                          </p>
                          {group.items.map((cat) => {
                            const Icon = iconMap[cat.icon] || Droplets
                            return (
                              <Link
                                key={cat.slug}
                                href={`/products?cat=${cat.slug}`}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#006EF5]"
                                onClick={() => setMobileOpen(false)}
                              >
                                <Icon className="h-4 w-4 text-[#102590]/60" strokeWidth={1.8} />
                                <span>{cat.label}</span>
                                {cat.badge && (
                                  <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                                    {cat.badge}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      ))}

                      {/* Mobile services */}
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Dịch vụ
                        </p>
                        {MEGA_MENU_SERVICES.map((svc) => {
                          const Icon = iconMap[svc.icon] || Wrench
                          return (
                            <Link
                              key={svc.label}
                              href={svc.href}
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#006EF5]"
                              onClick={() => setMobileOpen(false)}
                            >
                              <Icon className="h-4 w-4 text-[#006EF5]/60" strokeWidth={1.8} />
                              <span>{svc.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Mobile CTA */}
            <Link
              href="/survey"
              className="mt-3 inline-flex h-11 items-center justify-center rounded-md bg-[#102590] px-6 text-sm font-semibold uppercase text-white"
              onClick={() => setMobileOpen(false)}
            >
              Đăng Ký Khảo Sát
            </Link>

            {/* Mobile phone */}
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
              className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-[#102590] px-6 py-2.5 text-sm font-bold text-[#102590]"
            >
              <Phone className="h-4 w-4" />
              {SITE_CONFIG.phone}
            </a>
          </Container>
        </div>
      )}
    </header>
  )
}
