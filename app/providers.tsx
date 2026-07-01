"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@/lib/supabase-client"

interface SessionContextValue {
  session: Session | null
  loading: boolean
}

const SessionContext = createContext<SessionContextValue>({ session: null, loading: true })

export function useSession() {
  return useContext(SessionContext)
}

// Global session provider. Currently unused by app/layout.tsx — wire it in
// with <Providers>{children}</Providers> if you want session state
// available outside of /login and /dashboard (e.g. in the site header).
//
// Uses the same lib/supabase-client.ts singleton as the rest of the app,
// instead of a separate auth-helpers-react client/package, so there is only
// ever one GoTrueClient instance and one source of truth for the session.
export function Providers({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserSupabaseClient()
    let isMounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!isMounted) return
      setSession(newSession)
      setLoading(false)
    })

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      if (!isMounted) return
      setSession(existing)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider value={{ session, loading }}>{children}</SessionContext.Provider>
  )
}
