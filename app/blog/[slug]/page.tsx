import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { format, parseISO } from "date-fns"
import { RevenueCTA } from "@/components/revenue-cta"
import { NewsletterSection } from "@/components/newsletter-section"
import { getBlogPostBySlug, getBlogSlugs } from "@/lib/sanity"

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) return { title: "Post Not Found" }

  return {
    title: `${post.title} | RevEng`,
    description: post.excerpt,
  }
}

function renderMarkdown(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let inList = false
  let listItems: string[] = []
  let inCodeBlock = false
  let codeLines: string[] = []

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-4 ml-6 list-disc flex flex-col gap-1.5">
          {listItems.map((item, i) => (
            <li key={i} className="text-base leading-relaxed text-[#1e3a5f]">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
      listItems = []
      inList = false
    }
  }

  function renderInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = []
    const regex = /\*\*(.+?)\*\*|`(.+?)`/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }
      if (match[1]) {
        parts.push(
          <strong key={match.index} className="font-semibold text-[#0a2540]">
            {match[1]}
          </strong>
        )
      } else if (match[2]) {
        parts.push(
          <code
            key={match.index}
            className="rounded bg-[#e7efff] px-1.5 py-0.5 font-mono text-sm text-[#635bff]"
          >
            {match[2]}
          </code>
        )
      }
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }
    return parts.length === 1 ? parts[0] : parts
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${elements.length}`} className="my-4 overflow-x-auto rounded-xl border border-[#deeaf5] bg-[#f5faff] p-4">
            <code className="font-mono text-sm text-[#0a2540]">{codeLines.join("\n")}</code>
          </pre>
        )
        codeLines = []
        inCodeBlock = false
      } else {
        flushList()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    if (line.startsWith("## ")) {
      flushList()
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="mb-4 mt-10 text-2xl font-bold tracking-tight text-[#0a2540]"
        >
          {line.replace("## ", "")}
        </h2>
      )
    } else if (line.startsWith("### ")) {
      flushList()
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="mb-3 mt-8 text-xl font-semibold text-[#0a2540]"
        >
          {line.replace("### ", "")}
        </h3>
      )
    } else if (/^\d+\.\s/.test(line)) {
      if (!inList) {
        flushList()
        inList = true
      }
      listItems.push(line.replace(/^\d+\.\s/, ""))
    } else if (line.startsWith("- ")) {
      if (!inList) {
        flushList()
        inList = true
      }
      listItems.push(line.replace(/^- /, ""))
    } else if (line.trim() === "") {
      flushList()
    } else {
      flushList()
      elements.push(
        <p
          key={`p-${elements.length}`}
          className="my-4 text-base leading-relaxed text-[#1e3a5f]"
        >
          {renderInline(line)}
        </p>
      )
    }
  }
  flushList()

  return elements
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) notFound()

  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[#3b5a82] transition-colors hover:text-[#635bff]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Link>

        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#e7efff] px-3 py-1 font-mono text-xs text-[#0a2540]">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#3b5a82]">
              <Calendar className="h-3.5 w-3.5" />
              {format(parseISO(post.date), "MMMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1 text-xs text-[#3b5a82]">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-[#0a2540] lg:text-4xl">
            <span className="text-balance">{post.title}</span>
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-[#3b5a82]">
            {post.excerpt}
          </p>

          {/* Author block */}
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-full bg-[#f1f7fe] px-5 py-2.5">
            <User className="h-5 w-5 text-[#1f3d6b]" />
            <span className="text-sm text-[#1e3a62]">
              <strong>Revenue Engineer</strong> &middot; Stripe &amp; Dunning Specialist
            </span>
          </div>
        </div>

        <hr className="my-8 border-[#d7e5fc]" />

        <div className="prose-custom">{renderMarkdown(post.content)}</div>

        <hr className="my-10 border-[#d7e5fc]" />

        {/* Founder section */}
        <div className="mb-8 flex flex-wrap items-center gap-4 rounded-full bg-[#f0f7ff] px-6 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#635bff] to-[#8098ff] text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm text-[#1e3a62]">
            <strong>Revenue Engineer</strong> &ndash; 8 yrs Stripe integrations &amp; dunning
          </span>
        </div>

        <RevenueCTA />

        {/* Pricing hint */}
        <div className="mt-8 rounded-2xl bg-[#f2f8ff] p-5">
          <span className="text-sm text-[#1e3a62]">
            Project: <strong>Stripe Audit $1,800</strong> &middot; includes dunning review
          </span>
        </div>
      </article>

      <NewsletterSection />
    </>
  )
}
