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

const DOC_TYPE = "blogPost"

// ✅ Add normalize function
function normalizePost(post: any): any {
  return {
    slug: post.slug?.current ?? post.slug ?? "",
    title: post.title ?? "Untitled",
    excerpt: post.excerpt ?? "",
    category: post.category ?? "Uncategorized",
    date: post.publishedAt ?? post.date ?? new Date().toISOString(),
    readTime: post.readTime ?? "5 min read",
    featured: post.featured ?? false,
    content: post.content ?? "",
  }
}

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
    
    // ✅ FIX: Normalize posts before returning
    const normalizedPosts = posts.map(normalizePost)
    
    return NextResponse.json({ posts: normalizedPosts })
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

    // ✅ FIX: Return normalized post
    return NextResponse.json(
      {
        post: normalizePost(result),
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

    // ✅ FIX: Return normalized post
    return NextResponse.json({
      post: {
        slug: slug,
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

  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 })
  }

  let deleted = false
  let deletedFrom = []

  // 1. Try to delete from fake data (if in test mode or as fallback)
  if (getTestMode()) {
    try {
      const fakePosts = getFakePosts()
      const exists = fakePosts.some(p => p.slug === slug)
      if (exists) {
        deleteFakePost(slug)
        deleted = true
        deletedFrom.push("fake-data")
        console.log(`✅ Deleted "${slug}" from fake data`)
      } else {
        console.log(`ℹ️ "${slug}" not found in fake data`)
      }
    } catch (error) {
      console.warn("⚠️ Error deleting from fake data:", error)
    }
  }

  // 2. Always try Sanity if token is available (even in test mode)
  if (!deleted || getTestMode()) {
    try {
      if (!process.env.SANITY_API_TOKEN) {
        console.warn("ℹ️ SANITY_API_TOKEN not configured, skipping Sanity delete")
      } else {
        const query = `*[_type == "${DOC_TYPE}" && slug.current == $slug][0]._id`
        const id = await sanityClient.fetch(query, { slug })

        if (id) {
          await sanityClient.delete(id)
          deleted = true
          deletedFrom.push("sanity")
          console.log(`✅ Deleted "${slug}" from Sanity`)
        } else {
          console.log(`ℹ️ "${slug}" not found in Sanity`)
        }
      }
    } catch (error) {
      console.error("❌ Error deleting from Sanity:", error)
    }
  }

  // 3. If still not deleted, try fake data one more time (fallback)
  if (!deleted) {
    try {
      const fakePosts = getFakePosts()
      const exists = fakePosts.some(p => p.slug === slug)
      if (exists) {
        deleteFakePost(slug)
        deleted = true
        deletedFrom.push("fake-data-fallback")
        console.log(`✅ Deleted "${slug}" from fake data (fallback)`)
      }
    } catch (error) {
      console.warn("⚠️ Error deleting from fake data (fallback):", error)
    }
  }

  if (!deleted) {
    console.log(`❌ Post "${slug}" not found in any data source`)
    return NextResponse.json(
      { 
        error: "Post not found",
        details: "The post was not found in Sanity or fake data"
      }, 
      { status: 404 }
    )
  }

  return NextResponse.json({ 
    ok: true,
    deletedFrom: deletedFrom,
    message: `Post "${slug}" deleted from: ${deletedFrom.join(", ")}`
  })
}
