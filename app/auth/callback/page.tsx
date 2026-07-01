"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase-client"
import { useAuthStore } from "@/lib/auth-store"

function AuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setSession = useAuthStore((state) => state.setSession)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const completeSignIn = async () => {
      const code = searchParams.get("code")
      const authError = searchParams.get("error_description") ?? searchParams.get("error")

      if (authError) {
        setError(authError)
        return
      }

      if (!code) {
        setError("Missing authorization code. Please try signing in again.")
        return
      }

      const supabase = createBrowserSupabaseClient()
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Auth callback failed:", exchangeError)
        setError(exchangeError.message)
        return
      }

      if (data.session) {
        setSession(data.session)
      }

      router.replace("/dashboard")
    }

    completeSignIn()
  }, [router, searchParams, setSession])

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-red-700">Sign in failed</h1>
        <p className="mt-4 text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => router.replace("/login")}
          className="mt-6 rounded-full bg-[#635bff] px-6 py-2 text-sm font-semibold text-white hover:bg-[#4f46e5]"
        >
          Back to login
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#635bff] border-t-transparent" />
      <p className="mt-4 text-[#3b5a82]">Completing sign in...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg px-6 py-24 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#635bff] border-t-transparent" />
          <p className="mt-4 text-[#3b5a82]">Completing sign in...</p>
        </div>
      }
    >
      <AuthCallbackHandler />
    </Suspense>
  )
}
