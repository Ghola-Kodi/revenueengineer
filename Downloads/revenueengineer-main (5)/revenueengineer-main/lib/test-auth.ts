import type { Session } from "@supabase/supabase-js"

export const getTestMode = () => {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true"
}

export const useTestMode = () => {
  return getTestMode()
}

export const getTestSession = (): Session => {
  const id = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "test-user-123"
  const email = process.env.NEXT_PUBLIC_TEST_USER_EMAIL ?? "demo@reveng.local"
  const now = new Date().toISOString()

  return {
    access_token: "test-token-" + Math.random().toString(36).substring(7),
    refresh_token: "test-refresh-" + Math.random().toString(36).substring(7),
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: {
      id,
      app_metadata: {},
      user_metadata: {
        name: "Demo User",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
      },
      aud: "authenticated",
      email,
      created_at: now,
    },
  }
}
