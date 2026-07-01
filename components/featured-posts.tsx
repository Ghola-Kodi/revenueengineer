import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getFeaturedPosts } from "@/lib/blog-data"

export function FeaturedPosts() {
  const posts = getFeaturedPosts()

  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
              Featured Articles
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0a2540]">
              Latest from the blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1 text-sm font-medium text-[#635bff] transition-opacity hover:opacity-80 sm:flex"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl border border-[#deeaf5] bg-card p-6 transition-all hover:border-[#b2c9ff] hover:shadow-lg hover:shadow-[#635bff]/5"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#e3eaff] px-3 py-1 font-mono text-xs text-[#2a3f6e]">
                  {post.category}
                </span>
                <span className="text-xs text-[#4b5f7e]">
                  {post.readTime}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-snug text-[#0a2540] transition-colors group-hover:text-[#635bff]">
                <span className="text-pretty">{post.title}</span>
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#2f405b]">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-[#635bff]">
                Read article
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/blog"
            className="flex items-center justify-center gap-1 text-sm font-medium text-[#635bff]"
          >
            View all articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
