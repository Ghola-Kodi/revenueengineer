"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useTestMode, getTestSession } from "@/lib/test-auth"
import { useAuthStore } from "@/lib/auth-store"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { getFakeAuthSession } from "@/lib/fake-data"

const postSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.string().min(3),
  readTime: z.string().min(3),
  content: z.string().min(50, "Content must be at least 50 characters"),
})

export default function BlogAdminPage() {
  const router = useRouter()
  const testMode = useTestMode()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "Revenue Recovery",
    readTime: "5 min read",
    content: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const authSession = useAuthStore((state) => state.session)
  const setAuthSession = useAuthStore((state) => state.setSession)

  useEffect(() => {
    if (testMode) {
      const fakeSession = getFakeAuthSession()
      if (authSession) {
        setSession(authSession)
      } else if (fakeSession) {
        setSession({ user: { id: fakeSession.id, email: fakeSession.email, app_metadata: { role: fakeSession.role } } } as any)
      } else {
        const testSession = getTestSession()
        setSession(testSession)
        setAuthSession(testSession)
      }
      setLoading(false)

      fetch("/api/blog/posts")
        .then((response) => response.json())
        .then((data) => setPosts(data.posts ?? []))
        .catch(() => setPosts([]))
    } else {
      router.replace("/login")
    }
  }, [testMode, router, authSession, setAuthSession])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = postSchema.safeParse(formData)
    if (!validation.success) {
      const errors: Record<string, string> = {}
      validation.error.errors.forEach((error) => {
        const key = error.path?.[0]
        if (typeof key === "string") {
          errors[key] = error.message
        }
      })
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const slug = formData.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const newPost = {
      slug,
      ...formData,
      date: new Date().toISOString().split("T")[0],
      featured: false,
    }
    fetch("/api/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.post) {
          setPosts((current) => [data.post, ...current])
        }
      })
    setFormData({
      title: "",
      excerpt: "",
      category: "Revenue Recovery",
      readTime: "5 min read",
      content: "",
    })
    setShowForm(false)
  }

  const handleDelete = (slug: string) => {
    fetch(`/api/blog/posts?slug=${encodeURIComponent(slug)}`, { method: "DELETE" })
      .then(() => setPosts((current) => current.filter((post) => post.slug !== slug)))
      .catch(() => {})
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8 text-center">
        <p className="text-base text-[#3b5a82]">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8 text-center">
        <p className="text-base text-[#3b5a82]">Not authenticated</p>
      </div>
    )
  }

  const role = (session?.user?.app_metadata?.role ?? (getFakeAuthSession()?.role ?? "customer")) as string
  if (role !== "admin") {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8 text-center">
        <p className="text-base text-[#3b5a82]">You need an admin account to manage blog posts.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[#3b5a82] transition-colors hover:text-[#635bff]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#635bff]">
              Blog Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0a2540]">
              Manage Posts
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-[#635bff] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[#0a2540]">Create New Post</h2>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0a2540]">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#d7e5fc] px-4 py-2 text-[#0a2540] placeholder-[#8999b3] focus:border-[#635bff] focus:outline-none"
                  placeholder="Post title"
                />
                {formErrors.title ? (
                  <p className="mt-2 text-xs text-red-600">{formErrors.title}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a2540]">Excerpt</label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#d7e5fc] px-4 py-2 text-[#0a2540] placeholder-[#8999b3] focus:border-[#635bff] focus:outline-none"
                  placeholder="Short summary for listing"
                  rows={3}
                />
                {formErrors.excerpt ? (
                  <p className="mt-2 text-xs text-red-600">{formErrors.excerpt}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0a2540]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-[#d7e5fc] px-4 py-2 text-[#0a2540] focus:border-[#635bff] focus:outline-none"
                  >
                    <option>Revenue Recovery</option>
                    <option>Stripe Setup</option>
                    <option>Dunning</option>
                    <option>Klaviyo Integration</option>
                    <option>GHL Integration</option>
                    <option>Revenue Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0a2540]">Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-[#d7e5fc] px-4 py-2 text-[#0a2540] placeholder-[#8999b3] focus:border-[#635bff] focus:outline-none"
                    placeholder="e.g. 8 min read"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0a2540]\">Content</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#d7e5fc] px-4 py-2 font-mono text-sm text-[#0a2540] placeholder-[#8999b3] focus:border-[#635bff] focus:outline-none"
                  placeholder="Markdown content. Use ## for headings, **bold**, `code`, etc."
                  rows={12}
                />
                {formErrors.content ? (
                  <p className="mt-2 text-xs text-red-600">{formErrors.content}</p>
                ) : null}
                <p className="mt-2 text-xs text-[#3b5a82]">
                  Supports Markdown: ## headings, **bold**, `code`, - lists, 1. numbered
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="rounded-full bg-[#635bff] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-[#d7e5fc] px-6 py-2.5 text-sm font-semibold text-[#0a2540] transition-colors hover:bg-[#f8fbff]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-[#0a2540]">
            {posts.length} Post{posts.length !== 1 ? "s" : ""}
          </h3>

          {posts.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-[#f8fbff] p-8 text-center">
              <p className="text-[#3b5a82]">No posts yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-start justify-between rounded-2xl border border-[#d7e5fc] bg-white p-6"
                >
                  <div className="flex-1">
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h4 className="text-lg font-semibold text-[#0a2540] hover:text-[#635bff] transition-colors">
                        {post.title}
                      </h4>
                    </Link>
                    <p className="mt-1 text-sm text-[#3b5a82]">{post.excerpt}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="inline-block rounded-full bg-[#e3eaff] px-3 py-1 font-mono text-xs text-[#0a2540]">
                        {post.category}
                      </span>
                      <span className="text-xs text-[#3b5a82]">{post.date}</span>
                      <span className="text-xs text-[#3b5a82]">{post.readTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="ml-4 rounded-full p-2 text-[#8999b3] transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete post"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
