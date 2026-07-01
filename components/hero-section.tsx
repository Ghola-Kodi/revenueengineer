import Link from "next/link"
import { ArrowRight, AlertTriangle, TrendingUp, Zap, BarChart3 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a2540]">
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Gradient glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#635bff]/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: value proposition */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#315f96] bg-[#142d4b] px-4 py-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-[#8eaeff]" />
              <span className="text-xs font-medium text-[#c0dbff]">
                Is your subscription revenue leaking?
              </span>
            </div>

            <h1 className="mt-8 text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl xl:text-6xl">
              <span className="text-balance">
                Recover{" "}
                <span className="bg-gradient-to-r from-[#635bff] to-[#8098ff] bg-clip-text text-transparent">
                  20-40%
                </span>{" "}
                of failed subscription payments
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#b3cff0]">
              I help SaaS founders and agencies recover lost revenue through
              technical Stripe optimization, smart dunning sequences, and
              Klaviyo/GHL integrations that bridge the gap between
              marketing, sales, and payment data.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#635bff] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#635bff]/25 transition-opacity hover:opacity-90"
              >
                Book a Revenue Discovery Call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2d507a] px-7 py-3.5 text-sm font-semibold text-[#c7ddff] transition-colors hover:border-[#4d7fba] hover:text-white"
              >
                View My Work
              </Link>
            </div>

            {/* Quick stats */}
            <div className="mt-12 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1b3453]">
                  <TrendingUp className="h-4 w-4 text-[#635bff]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">$2M+</p>
                  <p className="text-[11px] text-[#8eaeff]">Revenue Recovered</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1b3453]">
                  <Zap className="h-4 w-4 text-[#635bff]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">50+</p>
                  <p className="text-[11px] text-[#8eaeff]">Integrations Built</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1b3453]">
                  <BarChart3 className="h-4 w-4 text-[#635bff]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">14 SaaS</p>
                  <p className="text-[11px] text-[#8eaeff]">Companies Helped</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="rounded-2xl border border-[#b2c9ff] bg-[#eef5ff] p-6 lg:p-8">
            <div className="flex items-center gap-2 text-lg font-bold text-[#0a2540] lg:text-xl">
              <AlertTriangle className="h-5 w-5 text-[#635bff]" />
              Is your subscription revenue leaking?
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[#1e3a62]">
              I help SaaS founders recover 20-40% of their &ldquo;failed payment&rdquo;
              churn through technical Stripe &amp; Klaviyo optimization.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 rounded-full border border-[#b8cef0] bg-white px-5 py-3 text-sm font-semibold text-[#0a2540] transition-colors hover:border-[#635bff]/40 hover:bg-[#f5faff]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef3fc]">
                  <svg className="h-3.5 w-3.5 text-[#3b5a82]" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                </span>
                Free Revenue Recovery Audit Checklist
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 rounded-full bg-[#0a2540] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1b3453]">
                  <svg className="h-3.5 w-3.5 text-[#8eaeff]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                </span>
                Book a 15-Min Revenue Discovery Call
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-3 rounded-full border border-[#b8cef0] bg-white px-5 py-3 text-sm font-semibold text-[#0a2540] transition-colors hover:border-[#635bff]/40 hover:bg-[#f5faff]"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef3fc]">
                  <svg className="h-3.5 w-3.5 text-[#3b5a82]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm-2 5a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                </span>
                {"Buy \"Stripe Revenue Audit\" on Upwork"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
