type FakeRole = "admin" | "customer"

export interface FakeProfile {
  id: string
  email: string
  role: FakeRole
  created_at: string
}

export interface FakePost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  featured?: boolean
  content: string
}

export interface FakeProduct {
  id: string
  stripe_product_id: string
  stripe_price_id: string
  name: string
  description: string
  price_cents: number
  delivery_type: "digital_download" | "service"
  download_asset_url?: string | null
  created_at: string
}

export interface FakePurchase {
  id: string
  user_id: string
  product_id: string
  stripe_checkout_session_id?: string
  stripe_payment_intent_id?: string
  status: string
  created_at: string
}

export interface FakePortfolioItem {
  id: string
  category: string
  title: string
  description: string
  tags: string[]
  icon: string
  metrics: { label: string; value: string }[]
}

const STORAGE_KEYS = {
  profiles: "reveng_fake_profiles",
  posts: "reveng_fake_posts",
  products: "reveng_fake_products",
  purchases: "reveng_fake_purchases",
  portfolio: "reveng_fake_portfolio",
  session: "reveng_fake_session",
}

// This module is used both from client components (where it persists to
// localStorage) and from API route handlers (which always run on the
// server, where `window` never exists). We use `globalThis` rather than a
// plain module-level variable so the in-memory fallback stays stable
// across hot-reloads / re-imports in dev.
const globalForFakeData = globalThis as unknown as {
  __revengFakeStore?: Record<string, unknown>
}
const serverStore = (globalForFakeData.__revengFakeStore ??= {})

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return key in serverStore ? (serverStore[key] as T) : fallback
  }
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") {
    serverStore[key] = value
    return
  }
  window.localStorage.setItem(key, JSON.stringify(value))
}

function seedDefaults() {
  const existingProducts = readJson<FakeProduct[]>(STORAGE_KEYS.products, [])
  if (existingProducts.length > 0) return

  const seededProducts: FakeProduct[] = [
    {
      id: "product-dunning-pack",
      stripe_product_id: "prod_fake_dunning_pack",
      stripe_price_id: "price_fake_dunning_pack",
      name: "Dunning Email Template Pack",
      description: "Battle-tested templates for soft-decline and hard-decline recovery.",
      price_cents: 19700,
      delivery_type: "digital_download",
      download_asset_url: "/downloads/dunning-template-pack.pdf",
      created_at: new Date().toISOString(),
    },
    {
      id: "product-webhook-course",
      stripe_product_id: "prod_fake_webhook_course",
      stripe_price_id: "price_fake_webhook_course",
      name: "Stripe Webhook Course",
      description: "A practical course covering webhook architecture, retries, and idempotency.",
      price_cents: 99700,
      delivery_type: "digital_download",
      download_asset_url: "/downloads/webhook-course.zip",
      created_at: new Date().toISOString(),
    },
    {
      id: "product-audit-checklist",
      stripe_product_id: "prod_fake_audit_checklist",
      stripe_price_id: "price_fake_audit_checklist",
      name: "Revenue Audit Checklist",
      description: "A free lead magnet checklist for spotting revenue leakage in Stripe setups.",
      price_cents: 0,
      delivery_type: "digital_download",
      download_asset_url: "/downloads/revenue-audit-checklist.pdf",
      created_at: new Date().toISOString(),
    },
  ]

  writeJson(STORAGE_KEYS.products, seededProducts)

  const existingPosts = readJson<FakePost[]>(STORAGE_KEYS.posts, [])
  if (existingPosts.length === 0) {
    const seededPosts: FakePost[] = [
      {
        slug: "stripe-klaviyo-revenue-recovery",
        title: "Stripe + Klaviyo recovery flows that actually recover revenue",
        excerpt: "A practical walkthrough of payment-triggered automations for failed payments.",
        category: "Revenue Recovery",
        date: "2026-06-18",
        readTime: "6 min read",
        featured: true,
        content: "## Stripe + Klaviyo\n\nUse webhooks to recover failed payments before they become churn.",
      },
    ]
    writeJson(STORAGE_KEYS.posts, seededPosts)
  }

  const existingProfiles = readJson<FakeProfile[]>(STORAGE_KEYS.profiles, [])
  if (existingProfiles.length === 0) {
    const demoProfile: FakeProfile = {
      id: "demo-user-123",
      email: "demo@reveng.local",
      role: "admin",
      created_at: new Date().toISOString(),
    }
    writeJson(STORAGE_KEYS.profiles, [demoProfile])
  }

  const existingPortfolio = readJson<FakePortfolioItem[]>(STORAGE_KEYS.portfolio, [])
  if (existingPortfolio.length === 0) {
    writeJson(STORAGE_KEYS.portfolio, [
      {
        id: "portfolio-1",
        category: "Stripe + Klaviyo",
        title: "Failed Payment Recovery Flow",
        description:
          "Built a 4-step Klaviyo email sequence triggered by Stripe invoice.payment_failed webhooks.",
        tags: ["Webhooks", "Klaviyo Flows", "Dunning", "Email Automation"],
        icon: "Mail",
        metrics: [
          { label: "Recovery Rate", value: "42%" },
          { label: "Revenue Saved", value: "$18K/mo" },
        ],
      },
      {
        id: "portfolio-2",
        category: "GHL + Stripe",
        title: "Automated Invoicing & Pipeline Sync",
        description:
          "Custom webhook bridge that transforms Stripe payment events into GHL API calls.",
        tags: ["Pipeline Automation", "Webhooks", "Custom Fields", "Fulfillment"],
        icon: "Zap",
        metrics: [
          { label: "Manual Tasks Eliminated", value: "95%" },
          { label: "Response Time", value: "<2 min" },
        ],
      },
    ])
  }
}

seedDefaults()

export function getFakeProfiles(): FakeProfile[] {
  return readJson<FakeProfile[]>(STORAGE_KEYS.profiles, [])
}

export function upsertFakeProfile(profile: FakeProfile) {
  const next = getFakeProfiles().filter((item) => item.id !== profile.id)
  next.push(profile)
  writeJson(STORAGE_KEYS.profiles, next)
  return profile
}

export function getFakeProfileByEmail(email: string) {
  return getFakeProfiles().find((profile) => profile.email.toLowerCase() === email.toLowerCase())
}

export function getFakeProfileById(id: string) {
  return getFakeProfiles().find((profile) => profile.id === id)
}

export function getFakePosts(): FakePost[] {
  return readJson<FakePost[]>(STORAGE_KEYS.posts, [])
}

export function saveFakePost(post: FakePost) {
  const next = getFakePosts().filter((item) => item.slug !== post.slug)
  next.unshift(post)
  writeJson(STORAGE_KEYS.posts, next)
  return post
}

export function deleteFakePost(slug: string) {
  const next = getFakePosts().filter((item) => item.slug !== slug)
  writeJson(STORAGE_KEYS.posts, next)
  return next
}

export function getFakeProducts(): FakeProduct[] {
  seedDefaults()
  return readJson<FakeProduct[]>(STORAGE_KEYS.products, [])
}

export function saveFakeProduct(product: FakeProduct) {
  const next = getFakeProducts().filter((item) => item.id !== product.id)
  next.unshift(product)
  writeJson(STORAGE_KEYS.products, next)
  return product
}

export function getFakePurchases(userId?: string): FakePurchase[] {
  const purchases = readJson<FakePurchase[]>(STORAGE_KEYS.purchases, [])
  if (!userId) return purchases
  return purchases.filter((item) => item.user_id === userId)
}

export function saveFakePurchase(purchase: FakePurchase) {
  const next = readJson<FakePurchase[]>(STORAGE_KEYS.purchases, []).filter((item) => item.id !== purchase.id)
  next.unshift(purchase)
  writeJson(STORAGE_KEYS.purchases, next)
  return purchase
}

export function getFakePortfolioItems(): FakePortfolioItem[] {
  seedDefaults()
  return readJson<FakePortfolioItem[]>(STORAGE_KEYS.portfolio, [])
}

export function setFakeAuthSession(session: { id: string; email: string; role: "admin" | "customer" }) {
  writeJson(STORAGE_KEYS.session, session)
  return session
}

export function getFakeAuthSession() {
  return readJson<{ id: string; email: string; role: "admin" | "customer" } | null>(STORAGE_KEYS.session, null)
}

export function clearFakeAuthSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEYS.session)
  } else {
    delete serverStore[STORAGE_KEYS.session]
  }
}

export function clearFakeData() {
  if (typeof window !== "undefined") {
    Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
  } else {
    Object.values(STORAGE_KEYS).forEach((key) => delete serverStore[key])
  }
  seedDefaults()
}
