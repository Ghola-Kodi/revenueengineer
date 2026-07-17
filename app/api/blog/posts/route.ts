import { NextResponse } from "next/server"
import { getTestMode } from "@/lib/test-auth"
import { deleteFakePost, getFakePosts, saveFakePost } from "@/lib/fake-data"
import { createClient } from "@sanity/client"

// Initialize Sanity client for the API
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "webhookengineer",
  apiVersion: "2025-06-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function GET() {
  if (getTestMode()) {
    return NextResponse.json({ posts: getFakePosts() })
  }

  try {
    // Log what we're connecting to
    console.log("Connecting to Sanity:", {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasToken: !!process.env.SANITY_API_TOKEN,
    })

    const query = `*[_type == "post"] | order(publishedAt desc){
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
    // Log the full error
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch posts", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
    
    // Log what we're trying to create
    console.log("Creating post with:", {
      title: body.title,
      slug: body.slug,
      hasContent: !!body.content,
    })

    // Check if we have a token
    if (!process.env.SANITY_API_TOKEN) {
      console.error("❌ SANITY_API_TOKEN is missing!")
      return NextResponse.json(
        { error: "SANITY_API_TOKEN is not configured" },
        { status: 500 }
      )
    }

    // Create the post in Sanity
    const result = await sanityClient.create({
      _type: "post",
      title: body.title,
      slug: {
        _type: "slug",
        current: body.slug
      },
      excerpt: body.excerpt || "",
      category: body.category || "Uncategorized",
      readTime: body.readTime || "5 min read",
      featured: body.featured ?? false,
      content: body.content || "",
      publishedAt: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    })
    
    console.log("✅ Post created successfully:", result._id)
    
    return NextResponse.json({ 
      post: {
        slug: result.slug.current,
        title: result.title,
        excerpt: result.excerpt,
        category: result.category,
        date: result.publishedAt,
        readTime: result.readTime,
        featured: result.featured,
        content: result.content,
      }
    }, { status: 201 })
  } catch (error) {
    // Log the full error
    console.error("❌ Error creating post:", error)
    return NextResponse.json(
      { 
        error: "Failed to create post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
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

    // First find the post by slug
    const query = `*[_type == "post" && slug.current == $slug][0]._id`
    const id = await sanityClient.fetch(query, { slug })
    
    if (!id) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Delete the post
    await sanityClient.delete(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("❌ Error deleting post:", error)
    return NextResponse.json(
      { 
        error: "Failed to delete post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
