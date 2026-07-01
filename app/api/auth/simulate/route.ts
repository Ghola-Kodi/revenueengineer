import { NextResponse } from "next/server"
import { getFakeProfileByEmail, setFakeAuthSession, upsertFakeProfile } from "@/lib/fake-data"
import { getTestMode } from "@/lib/test-auth"

export async function POST(request: Request) {
  if (!getTestMode()) {
    return NextResponse.json({ error: "Only available in test mode" }, { status: 403 })
  }

  const { email, role = "customer" } = await request.json()
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const existing = getFakeProfileByEmail(email)
  const profile = upsertFakeProfile({
    id: existing?.id ?? `fake-${Date.now()}`,
    email,
    role: role === "admin" ? "admin" : "customer",
    created_at: existing?.created_at ?? new Date().toISOString(),
  })
  setFakeAuthSession({ id: profile.id, email: profile.email, role: profile.role })

  return NextResponse.json({ profile })
}
