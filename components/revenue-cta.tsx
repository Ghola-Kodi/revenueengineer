import Link from "next/link"
import { AlertTriangle } from "lucide-react"

export function RevenueCTA() {
  return (
    <div className="rounded-2xl border-2 border-[#b2c9ff] bg-[#eef5ff] p-6 lg:p-8">
      <div className="flex items-center gap-2 text-lg font-bold text-[#0a2540]">
        <AlertTriangle className="h-5 w-5 shrink-0 text-[#635bff]" />
        Is your subscription revenue leaking?
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-[#1e3a62]">
        I help SaaS founders recover 20-40% of their &ldquo;failed payment&rdquo;
        churn through technical Stripe &amp; Klaviyo optimization.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-3 rounded-full border border-[#b8cef0] bg-white px-5 py-3 text-sm font-semibold text-[#0a2540] transition-colors hover:border-[#635bff]/40"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef3fc]">
            <svg className="h-3.5 w-3.5 text-[#3b5a82]" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
          </span>
          Free Revenue Recovery Audit Checklist
        </Link>
        <Link
          href="/about"
          className="inline-flex items-center gap-3 rounded-full bg-[#0a2540] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1b3453]">
            <svg className="h-3.5 w-3.5 text-[#8eaeff]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
          </span>
          Book a 15-Min Revenue Discovery Call
        </Link>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-3 rounded-full border border-[#b8cef0] bg-white px-5 py-3 text-sm font-semibold text-[#0a2540] transition-colors hover:border-[#635bff]/40"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef3fc]">
            <svg className="h-3.5 w-3.5 text-[#3b5a82]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm-2 5a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
          </span>
          {"Buy \"Stripe Revenue Audit\" on Upwork"}
        </Link>
      </div>
    </div>
  )
}
