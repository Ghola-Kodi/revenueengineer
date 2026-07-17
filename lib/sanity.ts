import { createClient } from "@sanity/client"
import { blogPosts } from "./blog-data"
import { demoPostsData } from "./demo-posts"
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

// Helper to get localStorage posts (only for fallback)
function getLocalStoragePosts(): BlogPost[] | null {
  if (typeof window === "undefined") return null
  
  try {
    const stored = localStorage.getItem("demo_posts")
    if (stored) {
      const posts = JSON.parse(stored)
      if (Array.isArray(posts) && posts.length > 0) {
        return posts
      }
    }
  } catch (error) {
    console.warn("localStorage demo posts parse failed")
  }
  return null
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // 1. PRIMARY: Try Sanity first
  if (sanityClient) {
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
      
      if (Array.isArray(posts) && posts.length > 0) {
        console.log(`✅ Found ${posts.length} posts in Sanity`)
        return posts.map(normalizePost)
      }
      
      console.log("ℹ️ No posts found in Sanity")
    } catch (error) {
      console.warn("❌ Sanity fetch failed:", error)
    }
  }

  // 2. FALLBACK: Try localStorage if Sanity has no posts
  const localStoragePosts = getLocalStoragePosts()
  if (localStoragePosts) {
    console.log(`📦 Using ${localStoragePosts.length} posts from localStorage`)
    return localStoragePosts
  }

  // 3. FINAL FALLBACK: Demo data
  if (demoPostsData && demoPostsData.length > 0) {
    console.log(`📄 Using ${demoPostsData.length} demo posts`)
    return demoPostsData
  }

  console.log("📄 Using static blog posts")
  return blogPosts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // 1. PRIMARY: Try Sanity first
  if (sanityClient) {
    try {
      const query = `*[_type == "post" && slug.current == $slug][0]{
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

  // 2. FALLBACK: Try localStorage if Sanity doesn't have it
  const localStoragePosts = getLocalStoragePosts()
  if (localStoragePosts) {
    const found = localStoragePosts.find((p: any) => p.slug === slug)
    if (found) {
      console.log(`📦 Found "${slug}" in localStorage`)
      return found
    }
  }

  // 3. FINAL FALLBACK: Demo data
  if (demoPostsData && demoPostsData.length > 0) {
    const found = demoPostsData.find((p) => p.slug === slug)
    if (found) {
      console.log(`📄 Found "${slug}" in demo posts`)
      return found
    }
  }

  console.log(`❌ Post "${slug}" not found anywhere`)
  return blogPosts.find((post) => post.slug === slug) ?? null
}

export async function getBlogSlugs(): Promise<string[]> {
  // 1. PRIMARY: Try Sanity first
  if (sanityClient) {
    try {
      const query = `*[_type == "post"]{slug}`
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

  // 2. FALLBACK: Try localStorage if Sanity has no slugs
  const localStoragePosts = getLocalStoragePosts()
  if (localStoragePosts) {
    const slugs = localStoragePosts.map((p: any) => p.slug).filter(Boolean)
    if (slugs.length > 0) {
      console.log(`📦 Found ${slugs.length} slugs in localStorage`)
      return slugs
    }
  }

  // 3. FINAL FALLBACK: Demo data
  if (demoPostsData && demoPostsData.length > 0) {
    console.log(`📄 Using ${demoPostsData.length} slugs from demo posts`)
    return demoPostsData.map((p) => p.slug)
  }

  console.log(`📄 Using ${blogPosts.length} slugs from static posts`)
  return blogPosts.map((post) => post.slug)
}
