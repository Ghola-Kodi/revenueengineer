import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

// Singleton browser client. Calling createClient() more than once in the
// same browser context triggers "Multiple GoTrueClient instances detected"
// warnings and can cause inconsistent auth state across components.
let browserClient: SupabaseClient | undefined

export const createBrowserSupabaseClient = () => {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return browserClient
}

// Server-side client uses the service role key and bypasses RLS.
// A fresh instance per call is fine here since each call is scoped to a
// single server request, not a long-lived browser session.
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}
