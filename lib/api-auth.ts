import { createServerSupabaseClient } from "@/lib/supabase-client"
import { getFakeProfileById } from "@/lib/fake-data"
import { getTestMode } from "@/lib/test-auth"

export interface AdminCheckResult {
  ok: boolean
  status: number
  error?: string
  userId?: string
}

/**
 * Verifies the caller is an authenticated admin before allowing a
 * write (POST/PUT/DELETE) against the blog API.
 *
 * Production mode: expects `Authorization: Bearer <supabase_access_token>`.
 * The token is verified against Supabase directly (not trusted from the
 * client), then the user's role is looked up server-side in `profiles`.
 *
 * Test mode: there is no real credential to verify (this mirrors the rest
 * of the test-mode scaffolding, e.g. /api/auth/simulate), so the client
 * sends `x-test-user-id`, which is resolved against the server-side fake
 * profile store. This is fine for local/demo use but must never be the
 * pattern used in production — that's why the two paths are kept
 * explicitly separate below rather than sharing a single "trust the
 * header" branch.
 */
export async function requireAdmin(request: Request): Promise<AdminCheckResult> {
  if (getTestMode()) {
    const userId = request.headers.get("x-test-user-id")
    if (!userId) {
      return { ok: false, status: 401, error: "Missing test session" }
    }
    const profile = getFakeProfileById(userId)
    if (!profile) {
      return { ok: false, status: 401, error: "Unknown test session" }
    }
    if (profile.role !== "admin") {
      return { ok: false, status: 403, error: "Admin role required" }
    }
    return { ok: true, status: 200, userId: profile.id }
  }

  const authHeader = request.headers.get("authorization") ?? ""
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
  if (!token) {
    return { ok: false, status: 401, error: "Missing bearer token" }
  }

  const supabase = createServerSupabaseClient()

  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  if (userError || !userData?.user) {
    return { ok: false, status: 401, error: "Invalid or expired session" }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single()

  if (profileError || !profile) {
    return { ok: false, status: 403, error: "No profile found for user" }
  }

  if (profile.role !== "admin") {
    return { ok: false, status: 403, error: "Admin role required" }
  }

  return { ok: true, status: 200, userId: userData.user.id }
}
