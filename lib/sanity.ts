import { createClient } from "@sanity/client"
import { blogPosts } from "./blog-data"
import { demoPostsData } from "./demo-posts"
import { getFakePosts } from "./fake-data"
import { getTestMode } from "./test-auth"
import type { BlogPost } from "./types"

// Use webhookengineer as default dataset
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "webhookengineer"
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const useCdn = process.env.NODE_ENV === "production"

// Initialize Sanity client only if we have a valid project ID
const sanityClient = projectId && projectId !== "" && projectId !== "your_project_id"
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-06-01",
      useCdn,
      token: process.env.SANITY_API_TOKEN,
    })
  : null

function normalizePost(post: any): BlogPost {
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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // BUG 5 FIX: this used to fall back to `localStorage.getItem("demo_posts")`,
  // a key nothing in the app ever wrote to — so posts created via
  // /blog-admin in test mode never showed up here, they'd silently fall
  // through to the static demo/blog-data arrays instead. Test mode now
  // reads directly from the same fake-data store the admin API
  // (app/api/blog/posts) reads and writes, so create/edit/delete in the
  // admin panel are immediately reflected on /blog.
  if (getTestMode()) {
    const fakePosts = getFakePosts()
    if (fakePosts.length > 0) {
      return fakePosts.map(normalizePost)
    }
    // Test mode with no fake posts yet still gets *something* to look at.
    return demoPostsData.length > 0 ? demoPostsData : blogPosts
  }

  // PRIMARY: Sanity
  if (sanityClient) {
    try {
      const query = `*[_type == "blogPost"] | order(publishedAt desc){
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

      if (Array.isArray(posts) && posts.length > 0) {
        console.log(`✅ Found ${posts.length} posts in Sanity`)
        return posts.map(normalizePost)
      }

      console.log("ℹ️ No posts found in Sanity")
    } catch (error) {
      console.warn("❌ Sanity fetch failed:", error)
    }
  }

  // FALLBACK: static demo data, then the hardcoded array
  if (demoPostsData && demoPostsData.length > 0) {
    console.log(`📄 Using ${demoPostsData.length} demo posts`)
    return demoPostsData
  }

  console.log("📄 Using static blog posts")
  return blogPosts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (getTestMode()) {
    const fakePosts = getFakePosts()
    const found = fakePosts.find((p) => p.slug === slug)
    if (found) return normalizePost(found)

    const demoFound = demoPostsData.find((p) => p.slug === slug)
    if (demoFound) return demoFound

    return blogPosts.find((post) => post.slug === slug) ?? null
  }

  // PRIMARY: Sanity
  if (sanityClient) {
    try {
      const query = `*[_type == "blogPost" && slug.current == $slug][0]{
        title,
        excerpt,
        category,
        readTime,
        featured,
        publishedAt,
        slug,
        content
      }`

      const post = await sanityClient.fetch(query, { slug })

      if (post) {
        console.log(`✅ Found post "${slug}" in Sanity`)
        return normalizePost(post)
      }

      console.log(`ℹ️ Post "${slug}" not found in Sanity`)
    } catch (error) {
      console.warn(`❌ Sanity fetch failed for "${slug}":`, error)
    }
  }

  // FALLBACK: static demo data, then the hardcoded array
  const demoFound = demoPostsData.find((p) => p.slug === slug)
  if (demoFound) {
    console.log(`📄 Found "${slug}" in demo posts`)
    return demoFound
  }

  console.log(`❌ Post "${slug}" not found anywhere`)
  return blogPosts.find((post) => post.slug === slug) ?? null
}

export async function getBlogSlugs(): Promise<string[]> {
  if (getTestMode()) {
    const fakePosts = getFakePosts()
    if (fakePosts.length > 0) {
      return fakePosts.map((p) => p.slug).filter(Boolean)
    }
    return (demoPostsData.length > 0 ? demoPostsData : blogPosts).map((p) => p.slug)
  }

  // PRIMARY: Sanity
  if (sanityClient) {
    try {
      const query = `*[_type == "blogPost"]{slug}`
      const slugs = await sanityClient.fetch(query)

      if (Array.isArray(slugs) && slugs.length > 0) {
        const result = slugs
          .map((item) => item?.slug?.current ?? item?.slug ?? "")
          .filter(Boolean)
        console.log(`✅ Found ${result.length} slugs in Sanity`)
        return result
      }

      console.log("ℹ️ No slugs found in Sanity")
    } catch (error) {
      console.warn("❌ Sanity fetch failed for slugs:", error)
    }
  }

  // FALLBACK: static demo data, then the hardcoded array
  if (demoPostsData && demoPostsData.length > 0) {
    console.log(`📄 Using ${demoPostsData.length} slugs from demo posts`)
    return demoPostsData.map((p) => p.slug)
  }

  console.log(`📄 Using ${blogPosts.length} slugs from static posts`)
  return blogPosts.map((post) => post.slug)
}
