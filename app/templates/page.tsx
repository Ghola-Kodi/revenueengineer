import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail, Clock, Webhook, AlertTriangle } from "lucide-react"
import { RevenueCTA } from "@/components/revenue-cta"
import { NewsletterSection } from "@/components/newsletter-section"

export const metadata: Metadata = {
  title: "Dunning Email Templates | RevEng",
  description:
    "Battle-tested dunning email templates for recovering failed subscription payments. Day 1, Day 3, Day 7, and Smart Retry sequences with webhook triggers.",
}

const templates = [
  {
    day: "Day 1",
    timing: "Sent immediately after first retry fails",
    icon: Mail,
    subject: "Quick heads up: we had trouble with your payment",
    preview:
      "Hey [First Name], just a quick note that we weren't able to process your latest payment of [Amount] for [Product Name]. This happens sometimes and usually resolves itself. We'll retry automatically, but if you'd like to update your payment method now, just click below. No action needed if your card info is current.",
    trigger: "invoice.payment_failed (attempt_count: 1)",
    tone: "Helpful, non-alarming",
    recoveryRate: "18-22%",
  },
  {
    day: "Day 3",
    timing: "48 hours after first email",
    icon: Clock,
    subject: "Your [Product Name] subscription needs attention",
    preview:
      "Hi [First Name], we've tried processing your payment of [Amount] a couple of times now without success. Your subscription is still active, but we want to make sure there's no interruption to your service. The most common fix is simply updating your card on file. Takes about 30 seconds.",
    trigger: "invoice.payment_failed (attempt_count: 2)",
    tone: "Friendly urgency",
    recoveryRate: "12-15%",
  },
  {
    day: "Day 7",
    timing: "4 days after second email",
    icon: AlertTriangle,
    subject: "Action required: your subscription will pause in 48 hours",
    preview:
      "Hi [First Name], we've been unable to process your payment of [Amount] for [Product Name]. To avoid any disruption to your access, please update your payment method in the next 48 hours. After that, we'll need to pause your subscription until the payment goes through. We'd hate to see you lose access.",
    trigger: "invoice.payment_failed (attempt_count: 3)",
    tone: "Direct but empathetic",
    recoveryRate: "8-12%",
  },
  {
    day: "Smart Retry",
    timing: "Dynamic, based on failure reason",
    icon: Webhook,
    subject: "[Varies by failure type]",
    preview:
      "This isn't a single email. It's a branching logic sequence that adapts based on the Stripe decline code. Soft declines (insufficient_funds) get a gentle nudge and automatic retry at optimal times. Hard declines (expired_card, stolen) skip retries and go straight to 'update your payment method' with a direct Stripe Customer Portal link.",
    trigger: "invoice.payment_failed + decline_code routing",
    tone: "Adaptive, failure-type aware",
    recoveryRate: "5-8% incremental",
  },
]

export default function TemplatesPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
            Dunning Templates
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
            <span className="text-balance">
              Email templates that recover failed payments without burning bridges.
            </span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[#3b5a82]">
            Each template is designed for a specific stage of the dunning
            sequence, triggered by Stripe webhook events, and written to
            maximize recovery while preserving customer relationships.
          </p>
        </div>

        {/* Sequence timeline */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-xs text-[#3b5a82]">Combined recovery rate:</span>
          <span className="rounded-full bg-[#e7efff] px-3 py-1 text-sm font-bold text-[#635bff]">
            35-45%
          </span>
        </div>

        {/* Template cards */}
        <div className="mt-12 flex flex-col gap-8">
          {templates.map((template, index) => {
            const Icon = template.icon
            return (
              <div
                key={template.day}
                className="group overflow-hidden rounded-2xl border border-[#c7daf5] bg-[#f5faff] transition-all hover:border-[#b2c9ff] hover:shadow-lg hover:shadow-[#635bff]/5"
              >
                <div className="flex items-center gap-4 border-b border-[#deeaf5] bg-card px-6 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7efff]">
                    <Icon className="h-5 w-5 text-[#1d3a62]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#0a2540]">
                        {template.day}
                      </span>
                      <span className="hidden rounded-full border border-[#deeaf5] px-2.5 py-0.5 text-[10px] text-[#3b5a82] sm:inline">
                        Step {index + 1} of {templates.length}
                      </span>
                    </div>
                    <p className="text-xs text-[#3b5a82]">
                      {template.timing}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#635bff]">
                      {template.recoveryRate}
                    </span>
                    <p className="text-[10px] text-[#3b5a82]">
                      recovery
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#3b5a82]">
                      Subject line
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#0a2540]">
                      {template.subject}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#deeaf5] bg-card p-4">
                    <span className="text-[10px] uppercase tracking-wider text-[#3b5a82]">
                      Email preview
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-[#3b5a82]">
                      {template.preview}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Webhook className="h-3.5 w-3.5 text-[#635bff]" />
                      <span className="text-xs text-[#3b5a82]">
                        Trigger:{" "}
                        <span className="font-medium text-[#0a2540]">{template.trigger}</span>
                      </span>
                    </div>
                    <span className="rounded-full border border-[#deeaf5] px-2.5 py-0.5 text-[10px] text-[#3b5a82]">
                      Tone: {template.tone}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA section */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
              Get the templates
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a2540]">
              Ready to implement these in your stack?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3b5a82]">
              The template pack includes all four emails with full copy, subject
              lines, Stripe webhook trigger specs, and Klaviyo flow configuration
              guides. Or hire me to build and integrate the entire dunning engine
              for you.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#635bff] px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Get Template Pack - $197
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b9cef0] px-7 py-3 text-sm font-semibold text-[#0a2540] transition-colors hover:bg-[#f5faff]"
              >
                Full Dunning Engine - $2,900
              </Link>
            </div>
          </div>
          <RevenueCTA />
        </div>

        {/* Founder + pricing */}
        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-full bg-[#f0f7ff] px-6 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#635bff] to-[#8098ff] text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm text-[#1e3a62]">
            <strong>Revenue Engineer</strong> &ndash; founder &amp; Stripe specialist
          </span>
        </div>
      </div>

      <NewsletterSection />
    </>
  )
}
