"use client"

import { useState, useEffect, Suspense } from "react"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useTestMode, getTestSession } from "@/lib/test-auth"
import { useAuthStore } from "@/lib/auth-store"
import { createBrowserSupabaseClient } from "@/lib/supabase-client"
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react"
import Link from "next/link"
import { getFakeAuthSession } from "@/lib/fake-data"

const postSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.string().min(3),
  readTime: z.string().min(3),
  content: z.string().min(50, "Content must be at least 50 characters"),
})

const emptyForm = {
  title: "",
  excerpt: "",
  category: "Revenue Recovery",
  readTime: "5 min read",
  content: "",
  featured: false,
}

// Next.js requires any component calling useSearchParams() to be wrapped
// in a Suspense boundary, or static prerendering fails the build (this is
// what broke the Vercel build: "useSearchParams() should be wrapped in a
// suspense boundary"). The actual page component below reads
// useSearchParams() to support the dashboard's ?action=new link, so the
// default export just wraps it in Suspense instead of exporting it
// directly.
function BlogAdminContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const testMode = useTestMode()
  const [session, setSession] = useState<any>(null)
  const [realRole, setRealRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  // BUG 3 FIX: editingSlug tracks whether the form is creating a new post
  // (null) or editing an existing one (the post's slug). The slug never
  // changes on edit, so the post's URL and publish date stay stable.
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [actionError, setActionError] = useState<string | null>(null)

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
      return
    }

    let isMounted = true
    const resolveRealSession = async () => {
      const supabase = createBrowserSupabaseClient()
      let currentSession = authSession
      if (!currentSession) {
        const { data } = await supabase.auth.getSession()
        currentSession = data.session
        if (currentSession && isMounted) setAuthSession(currentSession)
      }
      if (!isMounted) return
      if (!currentSession) {
        router.replace("/login")
        setLoading(false)
        return
      }
      setSession(currentSession)

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentSession.user.id)
        .single()
      if (isMounted) {
        setRealRole(profile?.role ?? "customer")
        setLoading(false)
      }

      fetch("/api/blog/posts")
        .then((response) => response.json())
        .then((data) => setPosts(data.posts ?? []))
        .catch(() => setPosts([]))
    }
    resolveRealSession()
    return () => {
      isMounted = false
    }
  }, [testMode, router, authSession, setAuthSession])

  // BUG 4 FIX: the API route now verifies admin status server-side, so
  // every write needs to identify the caller. Test mode has no real
  // credential to send (see lib/api-auth.ts for why that's a separate,
  // demo-only path), so it sends the fake session's user id; production
  // sends the real Supabase access token, which the server verifies
  // against Supabase itself rather than trusting the header contents.
  const authHeaders = (): Record<string, string> => {
    if (testMode) {
      const fakeSession = getFakeAuthSession()
      return fakeSession ? { "x-test-user-id": fakeSession.id } : {}
    }
    return session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setFormErrors({})
    setEditingSlug(null)
    setShowForm(false)
  }

  const startCreate = () => {
    resetForm()
    setShowForm(true)
  }

  // Dashboard's "New Post" card links here with ?action=new so it lands
  // straight on the create form instead of just the manage list.
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      startCreate()
      router.replace("/blog-admin")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const startEdit = (post: any) => {
    setEditingSlug(post.slug)
    setFormData({
      title: post.title ?? "",
      excerpt: post.excerpt ?? "",
      category: post.category ?? "Revenue Recovery",
      readTime: post.readTime ?? "5 min read",
      content: post.content ?? "",
      featured: post.featured ?? false,
    })
    setFormErrors({})
    setActionError(null)
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActionError(null)

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

    if (editingSlug) {
      // Update existing post in place.
      fetch(`/api/blog/posts?slug=${encodeURIComponent(editingSlug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(formData),
      })
        .then(async (response) => {
          const data = await response.json()
          if (!response.ok) {
            setActionError(data.error ?? "Failed to update post")
            return
          }
          setPosts((current) =>
            current.map((post) => (post.slug === editingSlug ? { ...post, ...data.post, slug: editingSlug } : post))
          )
          resetForm()
        })
        .catch(() => setActionError("Failed to update post"))
      return
    }

    const slug = formData.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const newPost = {
      slug,
      ...formData,
      date: new Date().toISOString().split("T")[0],
    }
    fetch("/api/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(newPost),
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) {
          setActionError(data.error ?? "Failed to create post")
          return
        }
        if (data.post) {
          setPosts((current) => [data.post, ...current])
        }
        resetForm()
      })
      .catch(() => setActionError("Failed to create post"))
  }

  const handleDelete = (slug: string) => {
    setActionError(null)
    fetch(`/api/blog/posts?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          setActionError(data.error ?? "Failed to delete post")
          return
        }
        setPosts((current) => current.filter((post) => post.slug !== slug))
      })
      .catch(() => setActionError("Failed to delete post"))
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

  const role = testMode ? (getFakeAuthSession()?.role ?? "customer") : (realRole ?? "customer")
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
            onClick={() => (showForm ? resetForm() : startCreate())}
            className="inline-flex items-center gap-2 rounded-full bg-[#635bff] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </div>

        {actionError && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-3xl border border-[#d7e5fc] bg-white p-8 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[#0a2540]">
              {editingSlug ? "Edit Post" : "Create New Post"}
            </h2>

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
                <label className="block text-sm font-medium text-[#0a2540]">Content</label>
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-[#d7e5fc]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-[#0a2540]">
                  Feature on homepage
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="rounded-full bg-[#635bff] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {editingSlug ? "Save Changes" : "Publish"}
              </button>
              <button
                type="button"
                onClick={resetForm}
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
                      {post.featured && (
                        <span className="text-xs font-semibold text-[#635bff]">Featured</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-1">
                    <button
                      onClick={() => startEdit(post)}
                      className="rounded-full p-2 text-[#8999b3] transition-colors hover:bg-[#eef2ff] hover:text-[#635bff]"
                      title="Edit post"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="rounded-full p-2 text-[#8999b3] transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete post"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BlogAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8 text-center">
          <p className="text-base text-[#3b5a82]">Loading...</p>
        </div>
      }
    >
      <BlogAdminContent />
    </Suspense>
  )
}
