"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, ArrowRight, Star } from "lucide-react"
import { NewsletterSection } from "@/components/newsletter-section"
import { useTestMode } from "@/lib/test-auth"

const tiers = [
  {
    name: "Stripe Audit",
    price: "$1,800",
    period: "one-time",
    description:
      "Comprehensive analysis of your Stripe configuration, webhook architecture, and dunning gaps. Delivered as a prioritized action plan.",
    popular: false,
    features: [
      "Full webhook event analysis",
      "Dunning gap identification",
      "Retry schedule audit",
      "Payment method health assessment",
      "Revenue leakage quantification",
      "Prioritized 30-point action plan",
      "7-day delivery",
    ],
    cta: "Book a Stripe Audit",
  },
  {
    name: "Dunning Engine",
    price: "$2,900",
    period: "one-time",
    description:
      "Full dunning system build: Stripe retry configuration, multi-channel recovery flows, webhook architecture, and Klaviyo/GHL integration.",
    popular: true,
    features: [
      "Everything in Stripe Audit",
      "Smart retry schedule configuration",
      "3 custom recovery email templates",
      "Idempotent webhook handler setup",
      "Klaviyo or GHL flow integration",
      "Pre-dunning card expiration alerts",
      "Failure-type routing logic",
      "Recovery rate dashboard",
      "14-day delivery",
    ],
    cta: "Build My Dunning Engine",
  },
  {
    name: "Retention Retainer",
    price: "$950",
    period: "/month",
    description:
      "Ongoing optimization of your revenue recovery system. Monthly analysis, A/B testing, and continuous improvement of recovery rates.",
    popular: false,
    features: [
      "Monthly recovery rate analysis",
      "Dunning email A/B testing",
      "Retry schedule optimization",
      "Payment health monitoring",
      "Integration maintenance",
      "Monthly revenue impact report",
      "Priority Slack support",
      "Quarterly strategy review",
    ],
    cta: "Start Retainer",
  },
]

export default function PricingPage() {
  const testMode = useTestMode()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (!testMode) return
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
  }, [testMode])

  const handleBuy = async (productId: string) => {
    if (!testMode) return
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    })
    const data = await response.json()
    window.location.href = data.checkoutUrl ?? "/dashboard"
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
            Pricing
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
            <span className="text-balance">
              Stop the leak. Recover your revenue.
            </span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
            Every package starts with understanding where your revenue is going and
            ends with systems that bring it back. Clear scope, fixed pricing, measurable
            impact.
          </p>
        </div>

        {/* Pricing tiers */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card ${
                tier.popular
                  ? "border-[#635bff] shadow-xl shadow-[#635bff]/10"
                  : "border-[#deeaf5]"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-px left-0 right-0 h-1 bg-[#635bff]" />
              )}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#635bff] px-4 py-1 text-xs font-semibold text-white">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#3b5a82]">
                  {tier.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-[#0a2540]">
                    {tier.price}
                  </span>
                  <span className="text-sm text-[#3b5a82]">
                    {tier.period}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#3b5a82]">
                  {tier.description}
                </p>

                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#635bff]" />
                      <span className="text-sm text-[#3b5a82]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href="/about"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                      tier.popular
                        ? "bg-[#635bff] text-white shadow-lg shadow-[#635bff]/25"
                        : "border border-[#b9cef0] bg-[#f5faff] text-[#0a2540]"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Digital Products */}
        <div className="mt-20 border-t border-[#d7e5fc] pt-12">
          <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
            Digital Products
          </p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a2540]">
            Templates, courses, and self-serve tools
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col rounded-2xl border border-[#deeaf5] bg-card p-6 transition-all hover:border-[#b2c9ff] hover:shadow-lg hover:shadow-[#635bff]/5"
              >
                <h3 className="text-base font-semibold text-[#0a2540]">{product.name}</h3>
                <span className="mt-1 text-sm font-bold text-[#635bff]">
                  {product.price_cents === 0 ? "Free" : `$${(product.price_cents / 100).toFixed(2)}`}
                </span>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#3b5a82]">{product.description}</p>
                <button
                  type="button"
                  onClick={() => handleBuy(product.id)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#635bff] transition-opacity hover:opacity-80"
                >
                  {product.price_cents === 0 ? "Download Now" : "Buy"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />
    </>
  )
}
