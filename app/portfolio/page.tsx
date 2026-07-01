"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CreditCard,
  Mail,
  BarChart3,
  Zap,
  RefreshCcw,
  Settings,
  TrendingUp,
  ShoppingCart,
  Users,
  Globe,
  Webhook,
  Database,
} from "lucide-react"
import { RevenueCTA } from "@/components/revenue-cta"
import { NewsletterSection } from "@/components/newsletter-section"
import { getFakePortfolioItems } from "@/lib/fake-data"

const integrationProjects = [
  {
    category: "Stripe + Klaviyo",
    title: "Failed Payment Recovery Flow",
    description:
      "Built a 4-step Klaviyo email sequence triggered by Stripe invoice.payment_failed webhooks. Includes smart segmentation by failure reason (soft decline vs. hard decline) and personalized recovery CTAs. Recovers 35-45% of failed payments within 7 days.",
    tags: ["Webhooks", "Klaviyo Flows", "Dunning", "Email Automation"],
    icon: Mail,
    metrics: [
      { label: "Recovery Rate", value: "42%" },
      { label: "Revenue Saved", value: "$18K/mo" },
    ],
  },
  {
    category: "Stripe + Klaviyo",
    title: "Pre-Expiration Card Update Campaign",
    description:
      "Automated card expiration detection that queries Stripe customer objects monthly and pushes at-risk profiles to Klaviyo for a 3-touch update sequence (30, 14, and 3 days before expiry). Prevents 40% of card-related involuntary churn before it happens.",
    tags: ["Prevention", "Segmentation", "Stripe API", "Lifecycle Emails"],
    icon: CreditCard,
    metrics: [
      { label: "Churn Prevented", value: "40%" },
      { label: "Cards Updated", value: "850/mo" },
    ],
  },
  {
    category: "Stripe + Klaviyo",
    title: "Expansion Revenue Trigger System",
    description:
      "Monitors Stripe metered billing usage approaching plan limits and triggers Klaviyo upsell flows. Frames upgrades as growth enablement rather than hard sells. Includes plan comparison data dynamically pulled from Stripe product catalog.",
    tags: ["Metered Billing", "Upsell Flows", "Dynamic Content", "Revenue Growth"],
    icon: TrendingUp,
    metrics: [
      { label: "Upgrade Rate", value: "22%" },
      { label: "MRR Expansion", value: "+$12K/mo" },
    ],
  },
  {
    category: "Stripe + Klaviyo",
    title: "Post-Purchase Onboarding Reinforcement",
    description:
      "Payment-confirmed onboarding sequence triggered by invoice.payment_succeeded on first subscription charge. Reduces buyer's remorse, drives activation milestones, and sets expectations for the subscription lifecycle.",
    tags: ["Onboarding", "Activation", "Retention", "First Payment"],
    icon: ShoppingCart,
    metrics: [
      { label: "Activation Rate", value: "+31%" },
      { label: "30-Day Retention", value: "89%" },
    ],
  },
]

const ghlProjects = [
  {
    category: "GHL + Stripe",
    title: "Automated Invoicing & Pipeline Sync",
    description:
      "Custom webhook bridge that transforms Stripe payment events into GHL API calls. When a payment succeeds, the contact auto-advances through pipeline stages, custom fields update with payment amount and date, and fulfillment workflows trigger automatically.",
    tags: ["Pipeline Automation", "Webhooks", "Custom Fields", "Fulfillment"],
    icon: Zap,
    metrics: [
      { label: "Manual Tasks Eliminated", value: "95%" },
      { label: "Response Time", value: "<2 min" },
    ],
  },
  {
    category: "GHL + Stripe",
    title: "Payment Failure Recovery Workflow",
    description:
      "When Stripe reports a failed payment, GHL tags the contact, triggers a multi-step SMS + email recovery sequence, alerts the account manager via internal notification, and logs the failure in the contact's activity timeline for full audit trail.",
    tags: ["SMS Recovery", "Account Alerts", "Activity Logging", "Multi-Channel"],
    icon: RefreshCcw,
    metrics: [
      { label: "Recovery Rate", value: "38%" },
      { label: "Avg. Recovery Time", value: "3.2 days" },
    ],
  },
  {
    category: "GHL + Stripe",
    title: "Renewal Engagement Scoring",
    description:
      "Pre-renewal automation that checks GHL engagement scores before Stripe processes subscription renewal. Low-engagement accounts route to retention workflows. High-engagement accounts trigger upsell campaigns. Prevents avoidable churn at the renewal gate.",
    tags: ["Engagement Scoring", "Retention", "Upsell", "Pre-Renewal"],
    icon: Users,
    metrics: [
      { label: "Churn Reduced", value: "28%" },
      { label: "Upsell Rate", value: "15%" },
    ],
  },
  {
    category: "GHL + Stripe",
    title: "Revenue Dashboard for Agencies",
    description:
      "Custom reporting dashboard built with GHL custom fields and Stripe data. Shows MRR by pipeline stage, payment success vs. failure rates, average revenue per client, and churn rate by acquisition source. Marketing, sales, and payment data in one view.",
    tags: ["Reporting", "Revenue Visibility", "Custom Dashboard", "Analytics"],
    icon: BarChart3,
    metrics: [
      { label: "Data Sources", value: "3 unified" },
      { label: "Decision Speed", value: "10x faster" },
    ],
  },
]

const marketingSalesProjects = [
  {
    category: "Marketing + Sales + Payments",
    title: "Unified Revenue Data Model",
    description:
      "End-to-end data architecture connecting Klaviyo acquisition data, GHL/CRM pipeline events, and Stripe payment health into a single queryable model. Every revenue-relevant event is visible and actionable across all three domains.",
    tags: ["Data Architecture", "CDP", "Segment", "ETL"],
    icon: Database,
    metrics: [
      { label: "Visibility Gap", value: "Eliminated" },
      { label: "Attribution Accuracy", value: "+65%" },
    ],
  },
  {
    category: "Marketing + Sales + Payments",
    title: "CAC-to-LTV Pipeline Attribution",
    description:
      "Connects marketing acquisition cost (Klaviyo/ad platform spend) to actual Stripe collected revenue per cohort. Shows which channels produce customers that actually pay and stay, not just convert. Identifies campaigns that attract high-churn subscribers.",
    tags: ["Attribution", "LTV Analysis", "Cohort Tracking", "ROI"],
    icon: Globe,
    metrics: [
      { label: "Wasted Ad Spend Found", value: "$23K/mo" },
      { label: "LTV Accuracy", value: "+40%" },
    ],
  },
  {
    category: "Marketing + Sales + Payments",
    title: "Webhook Orchestration Layer",
    description:
      "Centralized webhook middleware that ingests events from Stripe, Klaviyo, and GHL, normalizes them into a standard schema, and routes actions to the correct platform. Includes idempotent processing, retry logic, dead letter queues, and comprehensive event logging.",
    tags: ["Webhooks", "Middleware", "Event-Driven", "Idempotency"],
    icon: Webhook,
    metrics: [
      { label: "Events Processed", value: "50K+/day" },
      { label: "Reliability", value: "99.97%" },
    ],
  },
  {
    category: "Marketing + Sales + Payments",
    title: "Dunning Engine Setup & Optimization",
    description:
      "Full-stack dunning engine: Stripe retry schedule configuration, failure-type routing, Klaviyo multi-touch recovery sequences, GHL account manager alerts, in-app notifications, and graceful service degradation with configurable grace periods.",
    tags: ["Dunning", "Smart Retry", "Multi-Channel", "Grace Periods"],
    icon: Settings,
    metrics: [
      { label: "Payment Recovery", value: "52%" },
      { label: "Revenue Saved", value: "$47K/mo" },
    ],
  },
]

function ProjectCard({
  project,
}: {
  project: {
    category: string
    title: string
    description: string
    tags: string[]
    icon: React.ComponentType<{ className?: string }>
    metrics: { label: string; value: string }[]
  }
}) {
  const Icon = project.icon
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#deeaf5] bg-card transition-all hover:border-[#b2c9ff] hover:shadow-lg hover:shadow-[#635bff]/5">
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e7efff]">
            <Icon className="h-5 w-5 text-[#0a2540]" />
          </div>
          <span className="rounded-full bg-[#e9f0fc] px-3 py-1 text-[11px] font-medium text-[#3b5a82]">
            {project.category}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-semibold text-[#0a2540]">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3b5a82]">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#deeaf5] px-2.5 py-0.5 text-[11px] text-[#3b5a82]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-[#deeaf5]">
        <div className="flex divide-x divide-[#deeaf5]">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="flex flex-1 flex-col items-center gap-1 px-4 py-4">
              <span className="text-lg font-bold text-[#635bff]">
                {metric.value}
              </span>
              <span className="text-[11px] text-[#3b5a82]">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])

  useEffect(() => {
    setPortfolioItems(getFakePortfolioItems())
  }, [])

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {}
    portfolioItems.forEach((item) => {
      groups[item.category] = groups[item.category] ?? []
      groups[item.category].push(item)
    })
    return groups
  }, [portfolioItems])

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Hero */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
            Portfolio
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
            <span className="text-balance">
              Integration projects that recover revenue and unify your data.
            </span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#3b5a82]">
            Here is the kind of work I do: Stripe + Klaviyo payment-triggered email
            flows, GHL + Stripe pipeline automations, and the cross-platform
            architecture that connects marketing, sales, and payments into a
            single revenue engine.
          </p>
        </div>

        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mt-20 border-t border-[#d7e5fc] pt-12">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7efff]">
                <Mail className="h-5 w-5 text-[#0a2540]" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0a2540]">{category}</h2>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {items.map((project) => (
                <ProjectCard key={project.id} project={{ ...project, icon: Mail }} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-20 border-t border-[#d7e5fc] pt-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
                Work with me
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a2540] lg:text-3xl">
                <span className="text-balance">
                  Need a similar integration for your business?
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#3b5a82]">
                Every project starts with an audit of your current stack, a gap
                analysis across marketing, sales, and payments, and a clear
                roadmap with measurable revenue impact.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#635bff] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  View Pricing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b9cef0] px-7 py-3 text-sm font-semibold text-[#0a2540] transition-colors hover:bg-[#f5faff]"
                >
                  Learn About My Approach
                </Link>
              </div>
            </div>
            <RevenueCTA />
          </div>
        </div>
      </div>

      <NewsletterSection />
    </>
  )
}
