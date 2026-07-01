import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Stripe Audit Checklist | RevEng",
  description:
    "Follow a proven Stripe audit checklist for payment reliability, webhook health, retry schedules, and dunning readiness.",
}

export default function AuditChecklistPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
          Stripe audit
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
          Stripe audit checklist for revenue resiliency
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
          A practical, execution-focused checklist for payment orchestration, decline recovery, and payment health across Stripe, Klaviyo, and GHL.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a2540]">Core Stripe health</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[#3b5a82]">
            <li>• Confirm webhook delivery and endpoint retries are enabled.</li>
            <li>• Validate event handling for invoice.payment_failed, invoice.payment_succeeded, and customer.updated.</li>
            <li>• Ensure idempotent processing with Stripe event IDs and dedupe logic.</li>
            <li>• Use the Stripe Customer Portal for secure payment updates.</li>
            <li>• Track failure reasons with decline_code, payment_method_details, and status.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a2540]">Recovery & dunning</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[#3b5a82]">
            <li>• Map retry attempts to failure types instead of using a one-size-fits-all schedule.</li>
            <li>• Route soft declines to follow-up messages and hard declines to payment method updates.</li>
            <li>• Protect customer experience with escalation paths and grace period rules.</li>
            <li>• Capture data on recovery reasons and iterate content based on actual results.</li>
            <li>• Surface payment health in dashboards so non-technical teams can act quickly.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a2540]">Integration fidelity</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[#3b5a82]">
            <li>• Verify data flows between Stripe, Klaviyo, and GHL are complete and audited.</li>
            <li>• Keep customer identifiers consistent across systems: email, Stripe customer ID, and CRM contact ID.</li>
            <li>• Ensure retry state is stored outside ephemeral sessions or cache.</li>
            <li>• Build alerts for webhook failures, duplicate events, and missing customer records.</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[#0a2540]">Execution plan</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-[#3b5a82]">
            <li>• Prioritize the highest-leakage flows first: dunning, customer updates, and webhook recovery.</li>
            <li>• Use a shared tracking model for payment failures, retries, and recovered value.</li>
            <li>• Schedule a cadence for reviewing recovered revenue and declined-card trends.</li>
            <li>• Add post-mortem checks after major payment outages or decline-rate spikes.</li>
          </ul>
        </section>
      </div>

      <div className="mt-14 rounded-3xl border border-[#c7daf5] bg-[#f5f9ff] p-8 text-[#0a2540] shadow-sm">
        <h2 className="text-2xl font-semibold">Next step</h2>
        <p className="mt-4 text-sm leading-7 text-[#3b5a82]">
          This checklist is a starting point. If you want help closing implementation gaps, I build and integrate Stripe recovery systems with Klaviyo and GHL so you stop losing revenue to failed payments.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-flex items-center rounded-full bg-[#635bff] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Review pricing
        </Link>
      </div>
    </div>
  )
}
