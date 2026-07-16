import { NextResponse } from "next/server"
import { getTestMode } from "../../../../lib/test-auth"
import { deleteFakePost, getFakePosts, saveFakePost } from "../../../../lib/fake-data"
import { createBlogPost, getAllBlogPosts } from "../../../../lib/sanity"

export async function GET() {
  if (getTestMode()) {
    return NextResponse.json({ posts: getFakePosts() })
  }

  const posts = await getAllBlogPosts()
  return NextResponse.json({ posts })
}

export async function POST(request: Request) {
  const body = await request.json()

  if (getTestMode()) {
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
    const post = await createBlogPost({
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      category: body.category,
      date: body.date,
      readTime: body.readTime,
      featured: body.featured ?? false,
      content: body.content,
    })
    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
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

  return NextResponse.json({ error: "Real backend unavailable in test mode only" }, { status: 501 })
}
