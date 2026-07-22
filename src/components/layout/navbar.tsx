"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Container } from "@/components/ui/container"
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants"

export function Navbar() {
  const [open, setOpen] = useState(false)

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
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-gray-700 hover:text-[#006EF5] transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
          <Link
            href="/survey"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#102590] px-6 text-sm font-semibold uppercase text-white hover:bg-[#36D1FF] hover:text-[#102590] transition-colors"
          >
            Đăng Ký Khảo Sát
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-[#102590]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <Container className="py-4 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-gray-700 py-2 border-b border-gray-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/survey"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-[#102590] px-6 text-sm font-semibold uppercase text-white"
              onClick={() => setOpen(false)}
            >
              Đăng Ký Khảo Sát
            </Link>
          </Container>
        </div>
      )}
    </header>
  )
}
