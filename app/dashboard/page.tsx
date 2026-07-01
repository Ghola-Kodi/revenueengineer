"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import type { Session } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@/lib/supabase-client"
import { useTestMode, getTestSession } from "@/lib/test-auth"
import { useAuthStore } from "@/lib/auth-store"
import { getFakePurchases, getFakeProducts, getFakeProfileByEmail, getFakeAuthSession } from "@/lib/fake-data"

type AuthStatus = "checking" | "authenticated" | "unauthenticated" | "error"

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testMode = useTestMode()
  const authSession = useAuthStore((state) => state.session)
  const setAuthStoreSession = useAuthStore((state) => state.setSession)

  const [status, setStatus] = useState<AuthStatus>("checking")
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  // --- Test mode: short-circuit, no Supabase involved ---
  useEffect(() => {
    if (!testMode) return

    const activeSession = authSession ?? getTestSession()
    const fakeSession = getFakeAuthSession()
    if (activeSession || fakeSession) {
      const sessionValue = activeSession ?? ({ user: { id: fakeSession.id, email: fakeSession.email } } as Session)
      setSession(sessionValue)
      setStatus("authenticated")
    } else {
      setError("Test session not available")
      setStatus("error")
    }
  }, [testMode, authSession])

  // --- Real auth: single source of truth is onAuthStateChange ---
  useEffect(() => {
    if (testMode) {
      const initialProducts = getFakeProducts()
      const currentEmail = (session?.user?.email ?? getFakeAuthSession()?.email ?? "demo@reveng.local") as string
      setProducts(initialProducts)
      setPurchases(getFakePurchases(getFakeProfileByEmail(currentEmail)?.id ?? "demo-user-123"))
      return
    }

    const supabase = createBrowserSupabaseClient()
    let isMounted = true

    // Subscribe BEFORE checking, so we never miss the SIGNED_IN event that
    // fires once Supabase finishes exchanging the post-OAuth-redirect code
    // for a real session. This is what getSession() alone can race against.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return

      if (newSession) {
        setSession(newSession)
        setAuthStoreSession(newSession)
        setStatus("authenticated")
        setError(null)
      } else if (event === "SIGNED_OUT") {
        setSession(null)
        setAuthStoreSession(null)
        setStatus("unauthenticated")
      }
      // event with no session that isn't SIGNED_OUT (e.g. INITIAL_SESSION
      // with nothing yet) is intentionally ignored here — the grace-period
      // timer below is the only thing allowed to declare "unauthenticated".
    })

    // Immediate check, in case a session already exists in storage
    // (e.g. user is returning, not mid-OAuth-redirect).
    supabase.auth.getSession().then(({ data: { session: existing }, error: sessionError }) => {
      if (!isMounted) return
      if (sessionError) {
        setError(sessionError.message)
        setStatus("error")
        return
      }
      if (existing) {
        setSession(existing)
        setAuthStoreSession(existing)
        setStatus("authenticated")
      }
      // If nothing exists yet, stay in "checking" — give the auth event
      // (fired by the in-flight OAuth code exchange, if any) a chance to land.
    })

    // Grace period: if nothing has resolved this to authenticated/error
    // within 3s, there genuinely is no session — redirect to /login.
    const graceTimer = setTimeout(() => {
      if (!isMounted) return
      setStatus((current) => (current === "checking" ? "unauthenticated" : current))
    }, 3000)

    return () => {
      isMounted = false
      clearTimeout(graceTimer)
      subscription.unsubscribe()
    }
  }, [testMode, session?.user?.email, setAuthStoreSession])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (testMode && session?.user?.email) {
      const currentEmail = session.user.email
      const profile = getFakeProfileByEmail(currentEmail)
      const currentPurchases = getFakePurchases(profile?.id ?? "demo-user-123")
      const currentProducts = getFakeProducts()
      setPurchases(currentPurchases)
      setProducts(currentProducts)
      if (searchParams.get("purchased")) {
        setError(null)
      }
    }
  }, [searchParams, session?.user?.email, testMode])

  if (status === "checking") {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#635bff] border-t-transparent" />
          <p className="text-base text-[#3b5a82]">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
          <h2 className="text-2xl font-semibold text-red-700">Authentication Error</h2>
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  // status is "unauthenticated" (redirect effect above will fire) or
  // "authenticated" without a session somehow — render nothing either way.
  if (!session) {
    return null
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
      <div className="rounded-3xl border border-[#d7e5fc] bg-[#f8fbff] p-10 shadow-sm shadow-[#aabcf1]/20">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#0a2540]">
              Welcome back, {session.user?.email || "User"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#3b5a82]">
              This is your client dashboard. As we continue building the admin and payments
              integration, your authenticated session will let you access invoices,
              subscription status, and service details.
            </p>
          </div>
          <button
            onClick={async () => {
              const supabase = createBrowserSupabaseClient()
              await supabase.auth.signOut()
              router.push("/login")
            }}
            className="rounded-full border border-[#d7e5fc] bg-white px-4 py-2 text-sm text-[#3b5a82] hover:bg-[#f0f5ff]"
          >
            Sign Out
          </button>
        </div>

        {testMode && (
          <div className="mt-4 inline-block rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
            🧪 Running in test mode with demo credentials
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/blog-admin"
            className="rounded-3xl border border-[#d7e5fc] bg-white p-6 shadow-sm shadow-[#ccd9ff]/40 transition-all hover:border-[#635bff] hover:shadow-lg"
          >
            <h3 className="text-lg font-semibold text-[#0a2540]">Manage Blog</h3>
            <p className="mt-2 text-sm text-[#3b5a82]">Create and edit blog posts</p>
          </Link>

          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-[#ccd9ff]/40">
            <h2 className="text-lg font-semibold text-[#0a2540]">Your Profile</h2>
            <div className="mt-3 space-y-2 text-sm text-[#3b5a82]">
              <p>
                <span className="font-medium">Email:</span> {session.user?.email || "Not provided"}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {session.user?.id || "N/A"}
              </p>
              <p>
                <span className="font-medium">Account Created:</span>{" "}
                {session.user?.created_at
                  ? new Date(session.user.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-[#ccd9ff]/40">
            <h2 className="text-lg font-semibold text-[#0a2540]">Your Purchases</h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-[#3b5a82]">
              {purchases.length === 0 ? (
                <li>No purchases yet.</li>
              ) : (
                purchases.map((purchase) => {
                  const product = products.find((item) => item.id === purchase.product_id)
                  return (
                    <li key={purchase.id}>
                      <span className="font-semibold text-[#0a2540]">{product?.name ?? "Purchased item"}</span>
                      <div className="text-xs text-[#3b5a82]">{purchase.status}</div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#635bff] border-t-transparent" />
            <p className="text-base text-[#3b5a82]">Loading your dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
