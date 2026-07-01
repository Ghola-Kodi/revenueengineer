import type { Metadata } from "next"
import Link from "next/link"

const resources = [
  {
    title: "Stripe Audit Checklist",
    description:
      "A practical audit framework for payment systems, webhook reliability, retry schedules, and customer recovery flows.",
    href: "/audit-checklist",
    badge: "Audit",
  },
  {
    title: "Decline-Code Decision Tree",
    description:
      "Use Stripe decline codes to route recovery logic, avoid unnecessary retries, and preserve customer relationships.",
    href: "/decline-codes",
    badge: "Dunning",
  },
  {
    title: "Revenue Leakage Calculator",
    description:
      "Estimate payment recovery opportunity, lost MRR, and project ROI from improved failure handling.",
    href: "/leakage-calculator",
    badge: "Calculator",
  },
  {
    title: "Case Studies",
    description:
      "Real results from Stripe/Klaviyo/GHL builds: recovery lifts, retention wins, and conversion improvements.",
    href: "/case-studies",
    badge: "Proof",
  },
]

export const metadata: Metadata = {
  title: "Revenue Tools & Resources | RevEng",
  description:
    "High-value revenue engineering tools, Stripe audit resources, decline-code guidance, and recovery calculators.",
}

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
          Revenue tools
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
          Resources built for Stripe teams and revenue operators
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
          Actionable checklists, recovery calculators, decision trees, and case studies to help you stop revenue leakage and optimize payment recovery.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {resources.map((resource) => (
          <Link
            key={resource.href}
            href={resource.href}
            className="group rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-[#635bff] hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-[#f0f5ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2c4f90]">
                {resource.badge}
              </span>
              <span className="text-xs font-semibold text-[#5e7ab6]">View tool</span>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-[#0a2540]">
              {resource.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#3b5a82]">{resource.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
