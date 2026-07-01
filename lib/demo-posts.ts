import { BlogPost } from "./types"

export const demoPostsData: BlogPost[] = [
  {
    slug: "intro-to-revenue-recovery",
    title: "Getting Started with Revenue Recovery",
    excerpt: "A beginner's guide to understanding and implementing revenue recovery strategies.",
    category: "Revenue Recovery",
    date: "2026-06-22",
    readTime: "6 min read",
    featured: false,
    content: `# Getting Started with Revenue Recovery

Revenue recovery isn't magic — it's a system. In this post, we'll break down the fundamentals.

## What is Revenue Recovery?

Revenue recovery is the process of collecting payments that fail in your billing system. It's one of the highest ROI activities you can implement.

## The Basic Formula

1. **Identify failures** — Monitor your payment processor for failed charges
2. **Categorize the failure** — Soft decline vs. hard decline
3. **Respond appropriately** — Different messaging for different issues
4. **Track results** — Measure recovery rate and optimize

## Why It Matters

For a $1M ARR business losing 7% to involuntary churn, that's $70,000 per month. If you can recover just 30% of that with an automated system, you've built a $25,000/month recovery machine with one-time setup cost.

## Next Steps

Start by auditing your current payment failures. Check your Stripe dashboard for the last 30 days of failed payments. That's your baseline.`,
  },
  {
    slug: "stripe-webhook-basics",
    title: "Understanding Stripe Webhooks",
    excerpt: "A practical guide to setting up and handling Stripe webhook events correctly.",
    category: "Stripe Setup",
    date: "2026-06-20",
    readTime: "7 min read",
    featured: false,
    content: `# Understanding Stripe Webhooks

Webhooks are how Stripe tells you what's happening with your payments. Getting them right is critical.

## What's a Webhook?

A webhook is an HTTP request from Stripe to your server when something happens. A payment succeeds, fails, a subscription renews — Stripe sends you a notification.

## Key Events You Need

- \`invoice.payment_succeeded\` — Money came in
- \`invoice.payment_failed\` — Payment attempt failed
- \`customer.subscription.created\` — New subscription
- \`customer.subscription.deleted\` — Subscription cancelled

## Setting Up Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint pointing to your server
3. Select events to listen for
4. Save and copy signing secret

## Handling Events Safely

Always verify the webhook signature. This prevents forged requests.

\`\`\`typescript
const secret = process.env.STRIPE_WEBHOOK_SECRET
const sig = req.headers['stripe-signature']
const event = stripe.webhooks.constructEvent(body, sig, secret)
\`\`\`

The key principle: **idempotency**. Process the same event twice safely.`,
  },
]
