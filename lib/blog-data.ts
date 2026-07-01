export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  featured?: boolean
  content: string
}

export const categories = [
  "All",
  "Revenue Recovery",
  "Stripe Setup",
  "Dunning",
  "Klaviyo Integration",
  "GHL Integration",
  "Revenue Engineering",
] as const

export const blogPosts: BlogPost[] = [
  {
    slug: "involuntary-churn-silent-revenue-killer",
    title: "Involuntary Churn: The Silent Revenue Killer Hiding in Your Payment Stack",
    excerpt:
      "Most SaaS companies lose 5-10% of MRR to failed payments. Learn how to identify, measure, and recover involuntary churn before it compounds into a growth ceiling.",
    category: "Revenue Recovery",
    date: "2026-02-24",
    readTime: "8 min read",
    featured: true,
    content: `Involuntary churn is one of the most underestimated threats to SaaS revenue. Unlike voluntary churn — where a customer actively decides to cancel — involuntary churn happens silently. A credit card expires. A bank declines a charge. A payment method hits its limit. And just like that, a paying customer disappears from your MRR without ever making a conscious decision to leave.

## The Scale of the Problem

The average SaaS business loses between 5% and 10% of its monthly recurring revenue to involuntary churn. For a company doing $500K in MRR, that's $25,000 to $50,000 walking out the door every month — not because customers don't want your product, but because a transaction failed silently in the background.

What makes this particularly dangerous is the compounding effect. Unlike a one-time revenue hit, churn compounds. Losing 7% of your base each month doesn't just mean you need to replace that revenue — it means your growth rate has to outpace the leak just to stay flat.

## Why Traditional Dashboards Miss It

Here's the uncomfortable truth: most companies don't even know how much revenue they're losing to failed payments. Why? Because marketing, sales, and payment data live in completely different systems.

Your marketing team tracks acquisition costs in Klaviyo or HubSpot. Your sales team monitors pipeline in a CRM. Your finance team watches Stripe or your payment processor. But nobody is looking at the intersection — the moment where a successfully acquired, successfully converted customer quietly falls off due to a preventable payment failure.

This is what I call the **Revenue Visibility Gap**. It's the blind spot created when organizations treat marketing, sales, and payments as separate domains instead of a unified revenue engine.

## Building a Dunning Strategy That Actually Works

Effective dunning isn't just about sending retry emails. It's a systematic approach that combines:

1. **Smart retry logic** — Not all failures are equal. A soft decline (insufficient funds) should be retried differently than a hard decline (card stolen). Stripe's Smart Retries are a start, but they need to be supplemented with your own logic.

2. **Pre-dunning notifications** — Alert customers before their card expires. A simple email 30 days before expiration can prevent 40% of involuntary churn events.

3. **Multi-channel recovery** — Email alone recovers about 15-20% of failed payments. Add SMS and in-app notifications and you can push that to 40-50%.

4. **Graceful degradation** — Don't immediately lock customers out. Give them a grace period with gentle nudges. The goal is recovery, not punishment.

## The Revenue Engineering Mindset

Revenue engineering means treating the entire customer lifecycle — from first touch to recurring payment — as a single, optimizable system. When you connect your Stripe data to your Klaviyo flows, you can trigger re-engagement campaigns based on payment status. When you pipe payment health into your GHL automations, your sales team knows which accounts need attention before they churn.

The companies that win aren't the ones with the best product or the biggest ad spend. They're the ones who've eliminated the gaps between their marketing, sales, and payment systems — and turned involuntary churn from a silent killer into a solved problem.`,
  },
  {
    slug: "stripe-billing-setup-saas-guide",
    title: "The Definitive Stripe Billing Setup Guide for SaaS Companies",
    excerpt:
      "A step-by-step walkthrough of configuring Stripe for subscription billing, including webhook setup, retry logic, and the settings most companies get wrong.",
    category: "Stripe Setup",
    date: "2026-02-17",
    readTime: "12 min read",
    featured: true,
    content: `Getting Stripe right from the start saves you months of technical debt and thousands in lost revenue. This guide walks through the critical configuration decisions that most SaaS companies either skip or get wrong.

## Subscription Model Architecture

Before writing a single line of code, you need to decide on your billing architecture. Stripe offers several approaches:

**Price-per-seat**: Best for B2B tools where value scales with team size. Configure this using per-unit pricing with metered quantities.

**Tiered pricing**: Good for products with clear feature gates. Use Stripe's product catalog to define tiers with graduated pricing.

**Usage-based**: Ideal for API products or infrastructure tools. Requires metered billing with usage records reported via the API.

## Webhook Configuration That Won't Let You Down

Webhooks are the nervous system of your billing integration. Here are the events you absolutely must handle:

- \`invoice.payment_succeeded\` — Confirm active subscription status
- \`invoice.payment_failed\` — Trigger your dunning flow
- \`customer.subscription.updated\` — Handle plan changes
- \`customer.subscription.deleted\` — Process cancellations
- \`payment_method.attached\` / \`payment_method.detached\` — Track payment method changes

The most common mistake? Not handling webhook retries idempotently. Stripe will retry failed webhook deliveries for up to 3 days. If your handler isn't idempotent, you'll process the same event multiple times.

## Smart Retry Configuration

Stripe's default retry schedule is fine for most cases, but you should customize it based on your data:

1. First retry: 1 hour after failure (catches temporary holds)
2. Second retry: 24 hours later (new day, potentially new funds)
3. Third retry: 3 days later (covers weekly pay cycles)
4. Final retry: 7 days later (covers monthly pay cycles)

## Customer Portal Setup

Stripe's customer portal is often underutilized. Configure it to allow:
- Payment method updates (critical for reducing involuntary churn)
- Plan changes (upsell opportunity)
- Invoice history access (reduces support tickets)
- Cancellation flow with retention offers

## Revenue Recognition Considerations

If you're doing accrual accounting (you should be), configure Stripe Revenue Recognition from day one. It's much harder to set up retroactively, and your finance team will thank you when audit season arrives.

The key is treating your Stripe setup not as a one-time configuration task, but as a living system that needs monitoring, optimization, and regular review.`,
  },
  {
    slug: "stripe-klaviyo-integration-revenue-flows",
    title: "Connecting Stripe to Klaviyo: Revenue-Driven Email Flows That Convert",
    excerpt:
      "How to build email automations triggered by payment events — from failed payment recovery sequences to expansion revenue campaigns based on usage patterns.",
    category: "Klaviyo Integration",
    date: "2026-02-10",
    readTime: "10 min read",
    content: `The most powerful marketing automations aren't triggered by opens or clicks — they're triggered by payment events. When you connect Stripe to Klaviyo, you unlock a category of email flows that most companies never build.

## Why Payment-Triggered Emails Outperform

Traditional email marketing operates on behavioral signals: someone visited a page, opened an email, clicked a link. These are useful, but they're proxies for intent. Payment data is direct signal — it tells you exactly what a customer has done with their wallet.

A customer whose payment just failed is in a fundamentally different state than one who's browsing your pricing page. The messaging, urgency, and call-to-action should reflect that difference.

## The Core Integration Architecture

The Stripe-Klaviyo integration works through a few key mechanisms:

1. **Stripe webhooks → your server → Klaviyo API**: The most flexible approach. Your server receives Stripe events, enriches them with your own data, and pushes profiles and events to Klaviyo.

2. **Stripe → Klaviyo native integration**: Simpler setup but less customizable. Good for basic flows but limiting for advanced segmentation.

3. **Stripe → Segment → Klaviyo**: Best for companies already using Segment as their CDP. Adds a layer of data transformation and routing.

## Five Revenue Flows You Should Build Today

### 1. Failed Payment Recovery Sequence
Trigger: \`invoice.payment_failed\` event
- Email 1 (immediately): Soft notification with update payment link
- Email 2 (48 hours): Urgency messaging about service interruption
- Email 3 (5 days): Final warning with personal tone
- Recovery rate: 35-45% when all three emails are optimized

### 2. Pre-Expiration Card Update Campaign
Trigger: Card expiration within 30 days (check via Stripe customer object)
- Single, clear email with one CTA: update your payment method
- Send 30 days, 14 days, and 3 days before expiration
- Prevention rate: Eliminates 40% of card-related failures

### 3. Post-Payment Onboarding Reinforcement
Trigger: \`invoice.payment_succeeded\` for first subscription payment
- Confirm the purchase and set expectations
- Deliver immediate value to reduce buyer's remorse
- Guide toward activation milestones

### 4. Expansion Revenue Trigger
Trigger: Usage approaching plan limits (tracked via Stripe metered billing)
- Proactive outreach about upgrading before hitting walls
- Frame as enabling growth, not upselling
- Include comparison of current vs. next tier

### 5. Win-Back After Involuntary Churn
Trigger: \`customer.subscription.deleted\` due to payment failure (not voluntary cancellation)
- Wait 7 days after final retry fails
- Acknowledge the lapse without blame
- Offer a seamless re-subscription path with payment method update

## Segmentation Power Moves

With Stripe data in Klaviyo, you can build segments that marketing teams dream about:
- Customers by LTV tier
- Accounts with payment health issues
- Subscribers approaching renewal
- Customers who upgraded vs. those who haven't

This is what revenue engineering looks like in practice — not just collecting data, but activating it across every customer touchpoint.`,
  },
  {
    slug: "ghl-stripe-integration-agency-guide",
    title: "GHL + Stripe: Building Payment Automations for Agencies and Service Businesses",
    excerpt:
      "A practical guide to integrating GoHighLevel with Stripe for automated invoicing, payment tracking, and revenue visibility across your client pipeline.",
    category: "GHL Integration",
    date: "2026-02-03",
    readTime: "9 min read",
    content: `GoHighLevel (GHL) has become the operating system for agencies and service businesses. But its native payment capabilities have limitations. By integrating Stripe properly, you unlock a level of payment automation and revenue visibility that transforms how you manage client relationships.

## Why the Native GHL Payments Fall Short

GHL's built-in payment processing works for simple one-time charges, but it struggles with:
- Complex subscription billing
- Automated dunning and retry logic
- Revenue reporting and analytics
- Multi-currency support
- Advanced payment method management

Stripe fills every one of these gaps. The challenge is building the integration correctly so data flows seamlessly between your CRM workflows and your payment infrastructure.

## Integration Architecture Options

### Option 1: GHL Native Stripe Integration
GHL offers a built-in Stripe connection through its Payments settings. This handles:
- One-time product charges
- Basic subscription creation
- Payment form embedding

**Limitation**: Limited webhook handling and no custom retry logic.

### Option 2: Custom Webhook Bridge
Build a middleware layer that:
1. Receives Stripe webhooks
2. Transforms payment events into GHL API calls
3. Updates contact records, triggers workflows, and logs activities

This gives you full control over how payment data flows into your CRM.

### Option 3: Zapier/Make Middleware
For non-technical teams, tools like Zapier or Make can bridge Stripe events to GHL actions. Less flexible but faster to set up.

## Critical Workflows to Automate

### Payment Received → Pipeline Update
When Stripe confirms a payment, automatically:
- Move the contact to the appropriate pipeline stage
- Update custom fields with payment amount and date
- Trigger a fulfillment workflow
- Send a confirmation message via SMS or email

### Payment Failed → Recovery Workflow
When a payment fails:
- Tag the contact for your recovery segment
- Trigger a multi-step outreach sequence
- Alert the account manager via internal notification
- Log the failure in the contact's activity timeline

### Subscription Renewal → Engagement Check
Before renewal:
- Check engagement scores from GHL's tracking
- Route low-engagement accounts to retention workflows
- Trigger upsell campaigns for high-engagement accounts

## Revenue Dashboard in GHL

Build a custom dashboard using GHL's reporting and custom fields:
- Monthly recurring revenue by pipeline stage
- Payment success vs. failure rates
- Average revenue per client
- Churn rate by acquisition source

This is where marketing, sales, and payment data finally come together in one view — giving you the Revenue Visibility that most agencies completely lack.`,
  },
  {
    slug: "dunning-management-best-practices",
    title: "Dunning Management: The Complete Playbook for Recovering Failed Payments",
    excerpt:
      "Everything you need to know about building a dunning system that recovers revenue without damaging customer relationships. Includes retry schedules, messaging templates, and metrics.",
    category: "Dunning",
    date: "2026-01-27",
    readTime: "11 min read",
    content: `Dunning — the process of communicating with customers about failed payments — is where revenue recovery lives or dies. Get it right and you can recover 40-60% of failed payments. Get it wrong and you'll accelerate churn while annoying your best customers.

## Understanding Payment Failure Types

Not all failures are created equal. Your dunning strategy should differ based on the failure type:

### Soft Declines
- Insufficient funds
- Temporary hold
- Card issuer unavailable
- **Recovery rate**: 60-70% with proper retry timing

### Hard Declines
- Card expired
- Card reported stolen/lost
- Account closed
- **Recovery rate**: 10-20% (requires new payment method)

### Processing Errors
- Network timeout
- Gateway error
- **Recovery rate**: 85-95% (usually resolve on retry)

## The Optimal Retry Schedule

Based on data across thousands of subscription businesses:

**Day 0 (failure)**: Automatic retry after 2 hours. Don't notify the customer yet — many soft declines resolve on their own.

**Day 1**: Second retry. If it fails, send the first customer notification. Keep it informational: "We had trouble processing your payment. Here's a link to update your method."

**Day 3**: Third retry. Second notification with slightly more urgency. Mention that their service may be affected.

**Day 5**: Fourth retry. Third notification. Be direct about the timeline: "Your subscription will be paused in 48 hours unless we can process your payment."

**Day 7**: Final retry. Final notification. If this fails, move to a grace period or pause the subscription.

## Messaging That Recovers Without Alienating

The tone of your dunning messages matters enormously. These are paying customers who want your product — their payment just failed.

**Do:**
- Use a helpful, non-accusatory tone
- Provide a single, clear CTA (update payment method)
- Include the payment amount and what they're paying for
- Make the update process as frictionless as possible

**Don't:**
- Use threatening language
- Send too many messages too quickly
- Hide the unsubscribe option
- Blame the customer for the failure

## Pre-Dunning: Prevention Over Cure

The best dunning message is the one you never have to send:

1. **Card expiration monitoring**: Check stored payment methods monthly. Send update requests 30 days before expiration.

2. **Account updater enrollment**: Stripe's automatic card updater catches 15-25% of expired card issues before they cause failures.

3. **Backup payment methods**: Encourage customers to add a secondary payment method. If the primary fails, charge the backup automatically.

4. **Payment method health scoring**: Build a simple scoring model that flags accounts at risk of payment failure based on card age, issuer history, and past decline patterns.

## Measuring Dunning Performance

Track these metrics weekly:

- **Recovery rate**: Percentage of failed payments successfully retried or recovered
- **Time to recovery**: Average days between first failure and successful charge
- **Dunning email performance**: Open rate, click rate, and recovery rate per message
- **Net revenue impact**: Total revenue recovered minus the cost of any discounts or incentives offered
- **False positive rate**: Customers who would have churned anyway (voluntary churn misclassified as involuntary)

A well-optimized dunning system should recover 40-60% of failed payments and keep your involuntary churn rate below 2% of MRR.`,
  },
  {
    slug: "revenue-engineering-unified-data-model",
    title: "Revenue Engineering: Why Your Marketing, Sales, and Payment Data Need a Unified Model",
    excerpt:
      "The case for treating revenue as a single system — and the practical architecture for connecting your marketing stack, CRM, and payment processor into a unified revenue engine.",
    category: "Revenue Engineering",
    date: "2026-01-20",
    readTime: "10 min read",
    content: `Revenue doesn't happen in silos. A customer's journey from first ad impression to recurring subscription payment is one continuous process. But most companies treat it as three separate domains: marketing, sales, and payments. This fragmentation creates blind spots that cost real money.

## The Three-Silo Problem

**Marketing** tracks CAC, conversion rates, and campaign performance. They know how much it costs to acquire a customer and which channels work best.

**Sales** tracks pipeline value, close rates, and deal velocity. They know which accounts are likely to convert and how long it takes.

**Finance/Payments** tracks MRR, churn, and LTV. They know how much revenue is coming in and how much is walking out.

But here's what nobody tracks: the complete picture. When a customer acquired through a specific Klaviyo campaign churns due to a failed Stripe payment, who connects those dots? When a GHL pipeline deal closes but then fails its first payment, who triggers the right response?

## What Revenue Engineering Actually Means

Revenue engineering is the practice of designing, building, and optimizing the systems that connect these three domains into a single revenue engine. It's part data architecture, part process design, and part tooling.

The core principle: **every revenue-relevant event should be visible and actionable across all three domains.**

When a payment fails in Stripe, your Klaviyo flows should trigger recovery emails AND your GHL pipeline should reflect the account's at-risk status. When a high-value lead enters your pipeline, your payment system should be pre-configured for their billing preferences. When a marketing campaign drives a spike in signups, your payment infrastructure should be ready to handle the volume.

## The Unified Revenue Data Model

At the center of a revenue engineering practice is a unified data model that maps the customer journey end-to-end:

### Customer Record
- Acquisition source and campaign data (from marketing)
- Pipeline stage and deal value (from sales)
- Subscription status and payment health (from payments)
- Lifetime value and churn risk score (calculated from all three)

### Event Stream
Every significant customer event, regardless of source, flows into a single event stream:
- Marketing: email opens, ad clicks, form submissions
- Sales: calls, demos, proposals, closed deals
- Payments: charges, failures, refunds, subscription changes

### Metrics That Bridge Silos
- **Revenue per acquisition channel**: Combines marketing spend with actual collected revenue (not just converted revenue)
- **Payment-adjusted close rate**: Your sales close rate minus involuntary churn within the first 90 days
- **True customer acquisition cost**: Marketing spend + sales cost + payment recovery cost for each customer that reaches 90 days of healthy payments
- **Revenue retention by segment**: How different customer segments perform across the entire lifecycle

## Practical Implementation

You don't need a massive data warehouse to start. Begin with these integrations:

1. **Stripe → Klaviyo**: Push payment events to trigger marketing automation
2. **Stripe → GHL**: Sync payment status to CRM records
3. **Klaviyo → GHL**: Connect email engagement to sales pipeline
4. **All sources → a simple dashboard**: Build a single view that shows acquisition, conversion, and payment health together

The tools already exist. What's missing in most organizations is the mindset — the recognition that revenue is one system, not three, and that the gaps between your tools are where money goes to die.

## Getting Started

Start by answering three questions:
1. How much revenue did you lose last month to failed payments? (Check your Stripe dashboard)
2. What percentage of those customers were contactable through your marketing automation? (Cross-reference Klaviyo)
3. Did your sales team know about any of those at-risk accounts? (Check your GHL activity logs)

If you can't answer all three, you have a revenue visibility problem. And that's exactly where revenue engineering begins.`,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getPostsByCategory(category: string): BlogPost[] {
  if (category === "All") return blogPosts
  return blogPosts.filter((post) => post.category === category)
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured)
}
