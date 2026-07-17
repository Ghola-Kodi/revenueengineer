import { NextResponse } from "next/server"
import { getTestMode } from "@/lib/test-auth"
import { deleteFakePost, getFakePosts, saveFakePost } from "@/lib/fake-data"
import { createClient } from "@sanity/client"

// Initialize Sanity client for the API (needs write access)
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "webhookengineer",
  apiVersion: "2025-06-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Required for writes!
})

export async function GET() {
  if (getTestMode()) {
    return NextResponse.json({ posts: getFakePosts() })
  }

  // Get real posts from Sanity
  try {
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
    console.error("Error fetching posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

  // Create a real post in Sanity
  try {
    const body = await request.json()
    
    // Create the post in Sanity
    const result = await sanityClient.create({
      _type: "post",
      title: body.title,
      slug: {
        _type: "slug",
        current: body.slug
      },
      excerpt: body.excerpt,
      category: body.category,
      readTime: body.readTime,
      featured: body.featured ?? false,
      content: body.content,
      publishedAt: body.date ?? new Date().toISOString(),
    })
    
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
    console.error("Error creating post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
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

  // Delete a real post from Sanity
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 })
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
    console.error("Error deleting post:", error)
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
