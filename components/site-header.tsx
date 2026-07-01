"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, TrendingUp } from "lucide-react"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50">
      {/* Main dark navy bar */}
      <div className="bg-[#0a2540] border-b-4 border-[#635bff]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
          {/* Logo area */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#635bff]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight text-white">
                {"rev\u00b7eng"}
              </span>
              <span className="hidden rounded-full border border-[#315f96] bg-white/10 px-3 py-0.5 text-[11px] text-[#c0dbff] sm:inline">
                stripe / dunning
              </span>
            </div>
          </Link>

          {/* Founder quick pill */}
          <div className="hidden items-center gap-3 rounded-full border border-[#2d507a] bg-[#142d4b] px-4 py-1.5 lg:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#635bff] to-[#8098ff] text-sm text-white">
              R
            </div>
            <span className="text-sm text-[#e1edff]">Revenue Engineer</span>
          </div>

          {/* Nav links */}
          <nav className="hidden items-center gap-5 md:flex" aria-label="Main navigation">
            <Link href="/blog" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              Blog
            </Link>
            <Link href="/resources" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              Resources
            </Link>
            <Link href="/portfolio" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              Portfolio
            </Link>
            <Link href="/templates" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              Templates
            </Link>
            <Link href="/pricing" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              Pricing
            </Link>
            <Link href="/about" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              About
            </Link>
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              Dashboard
            </Link>
            <Link href="/login" className="flex items-center gap-1.5 text-sm font-medium text-[#c7ddff] transition-colors hover:text-white">
              Login
            </Link>
            <Link
              href="/pricing"
              className="rounded-full bg-[#635bff] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Hire Me
            </Link>
          </nav>

          <button
            className="text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-[#1b3453] px-6 pb-6 pt-4 md:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-4">
              <Link href="/blog" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
              <Link href="/resources" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                Resources
              </Link>
              <Link href="/portfolio" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                Portfolio
              </Link>
              <Link href="/templates" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                Templates
              </Link>
              <Link href="/pricing" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                Pricing
              </Link>
              <Link href="/about" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                About
              </Link>
              <Link href="/dashboard" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <Link href="/login" className="text-sm text-[#c7ddff] transition-colors hover:text-white" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link
                href="/pricing"
                className="mt-2 rounded-full bg-[#635bff] px-5 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                onClick={() => setMobileOpen(false)}
              >
                Hire Me
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
