"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<"idle" | "success" | "already_subscribed" | "invalid_email" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await response.json()
    setState(data.state ?? "error")
    setMessage(data.message ?? "Something went wrong.")
    if (data.state === "success") {
      setEmail("")
    }
  }

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-2xl border border-[#deeaf5] bg-card p-8 lg:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
              Newsletter
            </p>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#0a2540] lg:text-3xl">
              <span className="text-balance">
                Revenue insights delivered to your inbox
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#3b5a82]">
              Get weekly articles on Stripe optimization, dunning strategies,
              integration guides, and revenue engineering practices. No spam, just
              signal.
            </p>

            {state !== "idle" ? (
              <div className={`mt-8 rounded-xl border px-6 py-4 ${state === "success" ? "border-[#635bff]/30 bg-[#635bff]/10" : state === "already_subscribed" ? "border-amber-300 bg-amber-50" : state === "invalid_email" ? "border-red-300 bg-red-50" : "border-red-300 bg-red-50"}`}>
                <p className={`text-sm font-medium ${state === "success" ? "text-[#635bff]" : state === "already_subscribed" ? "text-amber-700" : "text-red-700"}`}>
                  {message}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 flex-1 rounded-full border border-[#b9cef0] bg-[#f5faff] px-5 text-sm text-[#0a2540] placeholder:text-[#3b5a82]/60 focus:border-[#635bff] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 sm:max-w-xs"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#635bff] px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Send className="h-4 w-4" />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
