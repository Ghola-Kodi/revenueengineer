"use client"

import { useState } from "react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (process.env.NEXT_PUBLIC_TEST_MODE === "true") {
      setMessage("Password reset flow is simulated in test mode. Check your inbox for the reset link.")
      return
    }

    setMessage("Password reset email requested.")
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-24">
      <h1 className="text-3xl font-semibold text-[#0a2540]">Reset password</h1>
      <p className="mt-3 text-sm text-[#3b5a82]">In local test mode, this is a simulated reset flow.</p>
      <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm">
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="w-full rounded-lg border border-[#d7e5fc] px-4 py-2" required />
        <button type="submit" className="mt-6 rounded-full bg-[#635bff] px-6 py-2.5 text-sm font-semibold text-white">Send reset link</button>
      </form>
      {message ? <p className="mt-4 text-sm text-[#635bff]">{message}</p> : null}
    </div>
  )
}
