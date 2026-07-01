"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase-client"
import { useTestMode, getTestSession } from "@/lib/test-auth"
import { useAuthStore } from "@/lib/auth-store"
import { setFakeAuthSession } from "@/lib/fake-data"

export default function LoginPage() {
  const router = useRouter()
  const testMode = useTestMode()
  const setSession = useAuthStore((state) => state.setSession)
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (testMode) {
          const stored = typeof window !== "undefined" ? window.localStorage.getItem("reveng_fake_session") : null
          if (stored) {
            const session = JSON.parse(stored)
            setSession({ user: { id: session.id, email: session.email } } as any)
            router.replace("/dashboard")
          }
          return
        }

        const supabase = createBrowserSupabaseClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          setSession(session)
          router.replace("/dashboard")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      }
    }

    checkSession()
  }, [router, testMode, setSession])

  const handleEmailFlow = async (event: React.FormEvent) => {
    event.preventDefault()
    if (testMode) {
      const role = email.includes("admin") ? "admin" : "customer"
      const demoSession = setFakeAuthSession({ id: `fake-${Date.now()}`, email, role })
      setSession({ user: { id: demoSession.id, email: demoSession.email } } as any)
      setMessage(`${mode === "signup" ? "Signed up" : "Signed in"} in test mode.`)
      router.replace("/dashboard")
      return
    }

    setMessage("Email auth is available once Supabase credentials are configured.")
  }

  const handleGoogleSignIn = async () => {
    if (testMode) {
      const testSession = getTestSession()
      setSession(testSession)
      router.replace("/dashboard")
      return
    }

    try {
      const supabase = createBrowserSupabaseClient()
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (error) {
      console.error("Sign in failed:", error)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
      <p className="font-mono text-sm uppercase tracking-[0.35em] text-[#635bff]">Client access</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#0a2540] sm:text-4xl">Sign in or sign up to manage your projects and payments.</h1>
      <p className="mt-4 text-base leading-8 text-[#3b5a82]">Access your dashboard, view subscriptions, and manage service requests with one secure login.</p>

      <form onSubmit={handleEmailFlow} className="mx-auto mt-8 max-w-md rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm text-left">
        <div className="flex gap-3">
          <button type="button" onClick={() => setMode("signin")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${mode === "signin" ? "bg-[#635bff] text-white" : "bg-[#f5faff] text-[#0a2540]"}`}>Sign in</button>
          <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${mode === "signup" ? "bg-[#635bff] text-white" : "bg-[#f5faff] text-[#0a2540]"}`}>Sign up</button>
        </div>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="mt-6 w-full rounded-lg border border-[#d7e5fc] px-4 py-2" required />
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="mt-4 w-full rounded-lg border border-[#d7e5fc] px-4 py-2" required />
        <button type="submit" className="mt-6 w-full rounded-full bg-[#0a2540] px-6 py-2.5 text-sm font-semibold text-white">{mode === "signup" ? "Create account" : "Continue with email"}</button>
        <p className="mt-3 text-sm text-[#3b5a82]">Email confirmation is required before first sign-in in the real Supabase flow.</p>
      </form>

      {message ? <p className="mt-4 text-sm text-[#635bff]">{message}</p> : null}

      <button type="button" onClick={handleGoogleSignIn} className="mt-10 inline-flex items-center justify-center rounded-full bg-[#635bff] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#4f46d5]">Continue with Google</button>
      <a href="/auth/reset-password" className="mt-4 block text-sm font-semibold text-[#635bff]">Forgot password?</a>
    </div>
  )
}
