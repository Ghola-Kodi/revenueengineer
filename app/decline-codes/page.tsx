import type { Metadata } from "next"

const declineCodes = [
  {
    code: "insufficient_funds",
    description:
      "Soft decline due to temporary account balance issues. Best handled with a gentle retry and reminder flow.",
    action: "Retry automatically, send a friendly email, and provide an update payment link.",
  },
  {
    code: "expired_card",
    description:
      "Hard decline from an expired card. Stop retries and ask the customer to update payment details.",
    action: "Send clear instructions and a direct Stripe Customer Portal link immediately.",
  },
  {
    code: "stolen_card",
    description:
      "Fraud-related decline that requires immediate customer attention.",
    action: "Pause retries, notify the customer, and prompt payment method update through a secure link.",
  },
  {
    code: "processing_error",
    description:
      "A temporary processor issue that may resolve quickly. Reattempt later and alert the ops team.",
    action: "Retry on a delayed schedule and surface the issue to monitoring dashboards.",
  },
  {
    code: "card_declined",
    description:
      "Generic decline that needs more context. Use follow-up messaging and collect additional payment data.",
    action: "Route to a diagnostic email, ask for updated card details, and retry once after customer action.",
  },
]

export const metadata: Metadata = {
  title: "Decline-Code Decision Tree | RevEng",
  description:
    "Guide Stripe decline codes to the right retry, email, and payment update path for smarter recovery.",
}

export default function DeclineCodesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
          Decline codes
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
          Use decline codes to route recovery logic, not just retry blindly
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
          A practical decision tree for the most common Stripe decline codes and the right action for each failure type.
        </p>
      </div>

      <div className="mt-12 grid gap-6">
        {declineCodes.map((item) => (
          <div key={item.code} className="rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#e7efff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1e3c69]">
                {item.code}
              </span>
              <p className="text-sm text-[#3b5a82]">Recommended action</p>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[#0a2540]">{item.description}</h2>
            <p className="mt-4 text-sm leading-7 text-[#3b5a82]">{item.action}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-[#c7daf5] bg-[#eff6ff] p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-[#0a2540]">How to use this decision tree</h2>
        <p className="mt-4 text-sm leading-7 text-[#3b5a82]">
          The key to higher recovery is pairing Stripe decline codes with behavior. Soft declines like insufficient funds should be retried and reminded. Hard declines like expired or stolen cards should skip retries and prompt customers to update payment details.
        </p>
      </div>
    </div>
  )
}
