import { CreditCard, RefreshCcw, BarChart3, Plug } from "lucide-react"

const services = [
  {
    icon: RefreshCcw,
    title: "Revenue Recovery",
    description:
      "Identify and recover revenue lost to failed payments, expired cards, and involuntary churn. Smart dunning strategies that recover 40-60% of failed payments.",
  },
  {
    icon: CreditCard,
    title: "Stripe Optimization",
    description:
      "Configure Stripe billing for maximum recovery. Smart retries, webhook architecture, customer portal setup, and revenue recognition from day one.",
  },
  {
    icon: Plug,
    title: "Integration Architecture",
    description:
      "Connect Stripe to Klaviyo for payment-triggered email flows. Bridge GHL and Stripe for unified pipeline and payment visibility across your business.",
  },
  {
    icon: BarChart3,
    title: "Revenue Engineering",
    description:
      "Build a unified data model that connects marketing spend, sales pipeline, and payment health. See your revenue as one system, not three silos.",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
          What I do
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
          <span className="text-balance">
            Bridging marketing, sales, and payments into one revenue engine.
          </span>
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-2xl border border-[#deeaf5] bg-card p-6 transition-all hover:border-[#b2c9ff] hover:shadow-lg hover:shadow-[#635bff]/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#635bff]">
                <service.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#0a2540]">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3b5a82]">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
