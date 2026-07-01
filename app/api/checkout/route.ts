import { NextResponse } from "next/server"
import { getFakeProducts, saveFakePurchase } from "@/lib/fake-data"
import { getTestMode } from "@/lib/test-auth"

export async function POST(request: Request) {
  if (!getTestMode()) {
    return NextResponse.json({ error: "Real backend unavailable in test mode only" }, { status: 501 })
  }

  const { productId, userId = "demo-user-123", email = "demo@reveng.local" } = await request.json()
  const product = getFakeProducts().find((item) => item.id === productId)

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  const checkoutUrl = `/dashboard?purchased=${product.id}`
  saveFakePurchase({
    id: `purchase-${Date.now()}`,
    user_id: userId,
    product_id: product.id,
    stripe_checkout_session_id: `cs_test_${Date.now()}`,
    stripe_payment_intent_id: `pi_test_${Date.now()}`,
    status: "completed",
    created_at: new Date().toISOString(),
  })

  return NextResponse.json({ checkoutUrl, email, product })
}
