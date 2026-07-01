import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CreditCard, BarChart3, Plug, RefreshCcw } from "lucide-react"
import { NewsletterSection } from "@/components/newsletter-section"

export const metadata: Metadata = {
  title: "About | RevEng",
  description:
    "Revenue engineer specializing in Stripe optimization, dunning management, and bridging the gap between marketing, sales, and payment data.",
}

const expertise = [
  {
    icon: CreditCard,
    label: "Stripe Architecture",
    detail: "Billing setup, webhook configuration, retry logic, and revenue recognition",
  },
  {
    icon: RefreshCcw,
    label: "Dunning & Recovery",
    detail: "Payment failure analysis, smart retry schedules, and multi-channel recovery flows",
  },
  {
    icon: Plug,
    label: "Platform Integrations",
    detail: "Stripe-Klaviyo email automation, GHL-Stripe CRM pipelines, and data synchronization",
  },
  {
    icon: BarChart3,
    label: "Revenue Analytics",
    detail: "Unified dashboards that connect marketing CAC, sales pipeline, and payment health",
  },
]

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Intro */}
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
              About
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
              <span className="text-balance">
                I help businesses stop losing revenue to the gaps between their systems.
              </span>
            </h1>

            {/* Founder pill */}
            <div className="mt-6 flex flex-wrap items-center gap-4 rounded-full bg-[#f0f7ff] px-6 py-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#635bff] to-[#8098ff] text-lg font-bold text-white shadow-md">
                R
              </div>
              <span className="text-sm text-[#1e3a62]">
                <strong>Revenue Engineer</strong> &ndash; 8 yrs Stripe integrations &amp; dunning
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-4 text-base leading-relaxed text-[#1e3a5f]">
              <p>
                Most companies treat marketing, sales, and payments as three
                separate domains with three separate teams, three separate tools,
                and three separate dashboards. The problem? Revenue doesn't
                happen in silos. A customer's journey from first ad impression to
                recurring subscription payment is one continuous process -- and the
                gaps between your systems are where money goes to die.
              </p>
              <p>
                I'm a revenue engineer. I specialize in connecting the dots that
                most organizations miss: the Stripe webhook that should trigger a
                Klaviyo recovery flow, the GHL pipeline stage that should reflect
                payment health, the dashboard that should show acquisition cost
                alongside actual collected revenue.
              </p>
              <p>
                This blog is where I share everything I've learned about
                recovering failed payments, optimizing Stripe configurations,
                building integration architectures, and engineering revenue
                systems that give businesses full visibility into their customer
                lifecycle.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-[#635bff] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Read the Blog
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-2xl border border-[#deeaf5] bg-card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#635bff]">
                Focus areas
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                <li className="text-sm text-[#3b5a82]">
                  <span className="font-semibold text-[#0a2540]">Involuntary churn reduction</span> -- recovering the 5-10% MRR most SaaS companies silently lose every month
                </li>
                <li className="text-sm text-[#3b5a82]">
                  <span className="font-semibold text-[#0a2540]">Payment stack optimization</span> -- configuring Stripe for maximum recovery and minimal friction
                </li>
                <li className="text-sm text-[#3b5a82]">
                  <span className="font-semibold text-[#0a2540]">Integration architecture</span> -- connecting marketing, CRM, and payment platforms into unified workflows
                </li>
                <li className="text-sm text-[#3b5a82]">
                  <span className="font-semibold text-[#0a2540]">Revenue visibility</span> -- building dashboards that show the full picture across all three domains
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#deeaf5] bg-card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#635bff]">
                The core belief
              </p>
              <blockquote className="mt-4 border-l-2 border-[#635bff] pl-4">
                <p className="text-sm italic leading-relaxed text-[#0a2540]">
                  &ldquo;Revenue is one system, not three. The companies that win are
                  the ones who've eliminated the gaps between their marketing,
                  sales, and payment tools.&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Pricing hint */}
            <div className="rounded-2xl bg-[#0c1f36] p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8eaeff]">Flat-fee projects</p>
              <div className="mt-3 flex flex-col gap-2">
                <span className="rounded-full bg-[#1b3453] px-4 py-1.5 text-xs text-[#c0dbff]">Stripe Audit $1,800</span>
                <span className="rounded-full bg-[#1b3453] px-4 py-1.5 text-xs text-[#c0dbff]">Dunning Engine $2,900</span>
                <span className="rounded-full bg-[#1b3453] px-4 py-1.5 text-xs text-[#c0dbff]">Retainer $950/mo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise grid */}
        <div className="mt-20 border-t border-[#d7e5fc] pt-16">
          <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
            Expertise
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a2540] lg:text-3xl">
            What I work on
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#deeaf5] bg-card p-6 transition-all hover:border-[#b2c9ff] hover:shadow-lg hover:shadow-[#635bff]/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7efff]">
                  <item.icon className="h-5 w-5 text-[#0a2540]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#0a2540]">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#3b5a82]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mt-20 border-t border-[#d7e5fc] pt-16">
          <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
            Tools & Platforms
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a2540]">
            The stack I write about
          </h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Stripe",
              "Klaviyo",
              "GoHighLevel",
              "Zapier",
              "Make",
              "Segment",
              "Webhooks",
              "REST APIs",
              "Revenue Dashboards",
              "Dunning Systems",
            ].map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-[#b9cef0] bg-[#e9f0fc] px-4 py-1.5 text-sm text-[#3b5a82] transition-colors hover:border-[#635bff]/40 hover:bg-[#d3e3ff] hover:text-[#0a2540]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </>
  )
}
