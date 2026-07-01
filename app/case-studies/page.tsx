import type { Metadata } from "next"

const caseStudies = [
  {
    headline: "Recovered 28% of failed SaaS revenue in 30 days",
    summary:
      "A subscription business was losing recurring payments because declines were treated identically. We built a decline-code-aware retry flow and recovery messaging for Stripe + Klaviyo.",
    results: [
      "28% recovery of failed payments",
      "30% fewer hard declines after retry optimization",
      "$12,000 in recovered MRR in the first quarter",
    ],
  },
  {
    headline: "Cut involuntary churn by 21% with automated updates",
    summary:
      "A payments-heavy agency had expired-card churn. The solution combined Stripe customer portal links, proactive card update campaigns, and webhookbacked customer status tracking.",
    results: [
      "21% reduction in involuntary churn",
      "42% more payment method updates before renewal",
      "Stronger visibility across billing and CRM pipelines",
    ],
  },
  {
    headline: "Unified Stripe + GHL data for clear retention decisions",
    summary:
      "We created a reporting model that connects Stripe payments, customer pipeline stage, and acquisition source so teams can see which channels drive high-quality revenue.",
    results: [
      "MRR by pipeline stage in one dashboard",
      "Improved retention follow-up for at-risk accounts",
      "Faster action on payment failures with sales context",
    ],
  },
]

export const metadata: Metadata = {
  title: "Case Studies | RevEng",
  description:
    "Results-focused Stripe recovery and revenue engineering case studies from real clients.",
}

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
          Case studies
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
          Real outcomes from revenue engineering work
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
          These examples show how intelligent Stripe recovery systems can turn payment failures into cash recovery, lower churn, and better retention visibility.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {caseStudies.map((study) => (
          <article key={study.headline} className="rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#0a2540]">{study.headline}</h2>
            <p className="mt-4 text-sm leading-7 text-[#3b5a82]">{study.summary}</p>
            <ul className="mt-6 space-y-3 text-sm text-[#3b5a82]">
              {study.results.map((result) => (
                <li key={result} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#635bff]" />
                  {result}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}
