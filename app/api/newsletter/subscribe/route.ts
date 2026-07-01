import { NextResponse } from "next/server"
import { getTestMode } from "@/lib/test-auth"

export async function POST(request: Request) {
  if (getTestMode()) {
    const { email } = await request.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, state: "invalid_email", message: "Please enter a valid email address." }, { status: 400 })
    }

    const normalized = email.toLowerCase()
    const alreadySubscribed = normalized.includes("already")
    if (alreadySubscribed) {
      return NextResponse.json({ ok: false, state: "already_subscribed", message: "That email is already subscribed." })
    }

    return NextResponse.json({ ok: true, state: "success", message: "Thanks for subscribing. Check your inbox to confirm." })
  }

  return NextResponse.json({ ok: false, state: "error", message: "Newsletter integration is unavailable without credentials." }, { status: 501 })
}
