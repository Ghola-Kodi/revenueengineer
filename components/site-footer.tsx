import Link from "next/link"
import { TrendingUp, Zap } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-[#0a1d31]">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635bff]">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">{"rev\u00b7eng"}</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#b3cff0]">
              Bridging the gap between marketing, sales, and payment data.
              Revenue engineering insights for modern businesses.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8eaeff]">
              Topics
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link href="/blog" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Revenue Recovery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Stripe Setup
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Dunning Management
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8eaeff]">
              Services
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link href="/portfolio" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Dunning Templates
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8eaeff]">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li>
                <Link href="/about" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-[#b3cff0] transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing strip */}
        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-xl bg-[#1b3453] px-5 py-3">
          <Zap className="h-4 w-4 text-[#635bff]" />
          <span className="text-sm font-medium text-white">Flat-fee projects:</span>
          <span className="rounded-full bg-[#0a2540] px-3 py-1 text-xs text-[#c0dbff]">Stripe Audit $1,800</span>
          <span className="rounded-full bg-[#0a2540] px-3 py-1 text-xs text-[#c0dbff]">Dunning Engine $2,900</span>
          <span className="rounded-full bg-[#0a2540] px-3 py-1 text-xs text-[#c0dbff]">Retainer $950/mo</span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#1b3453] pt-8 sm:flex-row">
          <p className="text-xs text-[#b3cff0]">
            &copy; {new Date().getFullYear()} RevEng. All rights reserved.
          </p>
          <p className="text-xs text-[#8eaeff]">
            Revenue is one system, not three.
          </p>
        </div>
      </div>
    </footer>
  )
}
