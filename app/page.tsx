import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { FeaturedPosts } from "@/components/featured-posts"
import { RevenueCTA } from "@/components/revenue-cta"
import { NewsletterSection } from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedPosts />
      <section className="bg-[#f5f8ff] py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl border border-[#d7e5fc] bg-white p-10 shadow-sm">
            <div className="max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
                Resources
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540]">
                Tools and checklists for smarter Stripe recovery.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
                Access audit frameworks, a decline-code decision tree, a revenue leakage calculator, and case studies built for payment teams.
              </p>
              <div className="mt-8">
                <Link
                  href="/resources"
                  className="inline-flex items-center rounded-full bg-[#635bff] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Explore resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <RevenueCTA />
        </div>
      </section>
      <NewsletterSection />
    </>
  )
}
