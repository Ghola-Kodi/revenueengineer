import { NextResponse } from "next/server"
import { getFakeProducts, saveFakeProduct } from "@/lib/fake-data"
import { getTestMode } from "@/lib/test-auth"

export async function GET() {
  if (!getTestMode()) {
    return NextResponse.json({ products: [] })
  }

  return NextResponse.json({ products: getFakeProducts() })
}

export async function POST(request: Request) {
  if (!getTestMode()) {
    return NextResponse.json({ error: "Real backend unavailable in test mode only" }, { status: 501 })
  }

  const body = await request.json()
  const product = saveFakeProduct({
    id: body.id ?? `product-${Date.now()}`,
    stripe_product_id: body.stripe_product_id ?? `prod_fake_${Date.now()}`,
    stripe_price_id: body.stripe_price_id ?? `price_fake_${Date.now()}`,
    name: body.name,
    description: body.description,
    price_cents: Number(body.price_cents ?? 0),
    delivery_type: body.delivery_type,
    download_asset_url: body.download_asset_url ?? null,
    created_at: new Date().toISOString(),
  })

  return NextResponse.json({ product })
}
