import type { Metadata } from "next"
import { BlogList } from "@/components/blog-list"
import { getAllBlogPosts } from "@/lib/sanity"

// ✅ ADD THIS - Force dynamic rendering to prevent stale caching
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Blog | RevEng",
  description:
    "Articles on revenue recovery, Stripe optimization, dunning management, and integration guides for Klaviyo and GoHighLevel.",
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
          Blog
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540] lg:text-4xl">
          Revenue engineering insights
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#3b5a82]">
          Practical guides on recovering revenue, optimizing Stripe, building
          integrations, and engineering your marketing, sales, and payment data
          into a unified system.
        </p>
      </div>

      <div className="mt-10">
        <BlogList posts={posts} />
      </div>
    </div>
  )
}
