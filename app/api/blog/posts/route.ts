import { NextResponse } from "next/server"
import { getTestMode } from "@/lib/test-auth"
import { deleteFakePost, getFakePosts, saveFakePost, updateFakePost } from "@/lib/fake-data"
import { requireAdmin } from "@/lib/api-auth"
import { createClient } from "@sanity/client"

// Initialize Sanity client for the API
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "webhookengineer",
  apiVersion: "2025-06-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// BUG 1 FIX: the public site (lib/sanity.ts) queries `_type == "blogPost"`,
// matching the actual schema in studio/schemas/blogPost.ts. This route was
// still reading/writing `_type == "post"`, a type nothing else queries, so
// posts created here were invisible on /blog and /blog/[slug]. Every query
// and mutation below now targets "blogPost" consistently.
const DOC_TYPE = "blogPost"

export async function GET() {
  if (getTestMode()) {
    return NextResponse.json({ posts: getFakePosts() })
  }

  try {
    const query = `*[_type == "${DOC_TYPE}"] | order(publishedAt desc){
      title,
      excerpt,
      category,
      readTime,
      featured,
      publishedAt,
      slug,
      content
    }`
    const posts = await sanityClient.fetch(query)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  // BUG 4 FIX: this endpoint previously had no auth check at all — anyone
  // who knew the URL could publish a post. Now it requires a verified
  // admin session before any write happens.
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  if (getTestMode()) {
    const body = await request.json()
    const post = saveFakePost({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      category: body.category,
      date: body.date ?? new Date().toISOString().split("T")[0],
      readTime: body.readTime,
      featured: body.featured ?? false,
      content: body.content,
    })
    return NextResponse.json({ post })
  }

  try {
    const body = await request.json()

    if (!process.env.SANITY_API_TOKEN) {
      console.error("❌ SANITY_API_TOKEN is missing!")
      return NextResponse.json(
        { error: "SANITY_API_TOKEN is not configured" },
        { status: 500 }
      )
    }

    const result = await sanityClient.create({
      _type: DOC_TYPE,
      title: body.title,
      slug: {
        _type: "slug",
        current: body.slug,
      },
      excerpt: body.excerpt || "",
      category: body.category || "Uncategorized",
      readTime: body.readTime || "5 min read",
      featured: body.featured ?? false,
      content: body.content || "",
      publishedAt: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    })

    console.log("✅ Post created successfully:", result._id)

    return NextResponse.json(
      {
        post: {
          slug: result.slug.current,
          title: result.title,
          excerpt: result.excerpt,
          category: result.category,
          date: result.publishedAt,
          readTime: result.readTime,
          featured: result.featured,
          content: result.content,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("❌ Error creating post:", error)
    return NextResponse.json(
      {
        error: "Failed to create post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// BUG 3 FIX: there was no update path at all — a published post could only
// be deleted and recreated. PUT edits a post in place, keyed by its
// existing slug, so the URL and publish date stay intact.
export async function PUT(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 })
  }

  const body = await request.json()

  if (getTestMode()) {
    const updated = updateFakePost(slug, {
      title: body.title,
      excerpt: body.excerpt,
      category: body.category,
      readTime: body.readTime,
      featured: body.featured,
      content: body.content,
    })
    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json({ post: updated })
  }

  try {
    if (!process.env.SANITY_API_TOKEN) {
      console.error("❌ SANITY_API_TOKEN is missing!")
      return NextResponse.json(
        { error: "SANITY_API_TOKEN is not configured" },
        { status: 500 }
      )
    }

    const idQuery = `*[_type == "${DOC_TYPE}" && slug.current == $slug][0]._id`
    const id = await sanityClient.fetch(idQuery, { slug })

    if (!id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const result = await sanityClient
      .patch(id)
      .set({
        title: body.title,
        excerpt: body.excerpt || "",
        category: body.category || "Uncategorized",
        readTime: body.readTime || "5 min read",
        featured: body.featured ?? false,
        content: body.content || "",
      })
      .commit()

    return NextResponse.json({
      post: {
        slug,
        title: result.title,
        excerpt: result.excerpt,
        category: result.category,
        date: result.publishedAt,
        readTime: result.readTime,
        featured: result.featured,
        content: result.content,
      },
    })
  } catch (error) {
    console.error("❌ Error updating post:", error)
    return NextResponse.json(
      {
        error: "Failed to update post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  if (getTestMode()) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 })
    }
    deleteFakePost(slug)
    return NextResponse.json({ ok: true })
  }

  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 })
    }

    if (!process.env.SANITY_API_TOKEN) {
      console.error("❌ SANITY_API_TOKEN is missing!")
      return NextResponse.json(
        { error: "SANITY_API_TOKEN is not configured" },
        { status: 500 }
      )
    }

    const query = `*[_type == "${DOC_TYPE}" && slug.current == $slug][0]._id`
    const id = await sanityClient.fetch(query, { slug })

    if (!id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    await sanityClient.delete(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("❌ Error deleting post:", error)
    return NextResponse.json(
      {
        error: "Failed to delete post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
