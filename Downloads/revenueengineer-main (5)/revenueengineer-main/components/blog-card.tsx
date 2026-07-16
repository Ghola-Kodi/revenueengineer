import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import type { BlogPost } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl border border-[#deeaf5] bg-card p-6 transition-all hover:border-[#b2c9ff] hover:shadow-lg hover:shadow-[#635bff]/5"
    >
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-[#e3eaff] px-3 py-1 font-mono text-xs text-[#2a3f6e]">
          {post.category}
        </span>
        <span className="text-xs text-[#4b5f7e]">{post.readTime}</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold leading-snug text-[#0a2540] transition-colors group-hover:text-[#635bff]">
        <span className="text-pretty">{post.title}</span>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[#2f405b]">
        {post.excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#4b5f7e]">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(post.date, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <span className="flex items-center gap-1 text-sm font-semibold text-[#635bff]">
          Read
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
