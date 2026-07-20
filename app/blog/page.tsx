import { createClient } from "@sanity/client"
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

// Log connection status
if (!sanityClient) {
  console.error("❌ [ERROR CODE: E001] Sanity client not initialized. Check NEXT_PUBLIC_SANITY_PROJECT_ID")
} else {
  console.log(`✅ Sanity client initialized: projectId=${projectId}, dataset=${dataset}`)
}

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
  console.log("🔍 [STATUS: FETCHING] getAllBlogPosts() called")
  
  // 1. PRIMARY: Try Sanity first
  if (sanityClient) {
    try {
      console.log("📡 [STATUS: QUERYING] Fetching posts from Sanity...")
      
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
        console.log(`✅ [SUCCESS: E000] Found ${posts.length} posts in Sanity`)
        return posts.map(normalizePost)
      }
      
      console.log(`ℹ️ [STATUS: EMPTY] No posts found in Sanity (query returned 0 results)`)
      
    } catch (error) {
      // Specific error codes for different failure types
      if (error instanceof Error) {
        if (error.message.includes("projectId")) {
          console.error(`❌ [ERROR CODE: E002] Invalid or missing projectId. Check NEXT_PUBLIC_SANITY_PROJECT_ID:`, error.message)
        } else if (error.message.includes("dataset")) {
          console.error(`❌ [ERROR CODE: E003] Invalid or missing dataset. Check NEXT_PUBLIC_SANITY_DATASET:`, error.message)
        } else if (error.message.includes("token") || error.message.includes("auth") || error.message.includes("401")) {
          console.error(`❌ [ERROR CODE: E004] Authentication failed. Check SANITY_API_TOKEN:`, error.message)
        } else if (error.message.includes("timeout") || error.message.includes("network")) {
          console.error(`❌ [ERROR CODE: E005] Network timeout. Check your internet connection:`, error.message)
        } else if (error.message.includes("CORS")) {
          console.error(`❌ [ERROR CODE: E006] CORS error. Add your domain to Sanity CORS origins:`, error.message)
        } else {
          console.error(`❌ [ERROR CODE: E007] Unknown Sanity error:`, error.message)
        }
      } else {
        console.error(`❌ [ERROR CODE: E008] Non-Error thrown:`, error)
      }
    }
  } else {
    console.error(`❌ [ERROR CODE: E001] Sanity client not available. Check your configuration.`)
  }

  // 2. FALLBACK: Try localStorage if Sanity has no posts
  console.log(`📦 [STATUS: FALLBACK] Trying localStorage...`)
  const localStoragePosts = getLocalStoragePosts()
  if (localStoragePosts) {
    console.log(`✅ [SUCCESS: E100] Using ${localStoragePosts.length} posts from localStorage`)
    return localStoragePosts
  }

  // 3. FINAL FALLBACK: Demo data
  if (demoPostsData && demoPostsData.length > 0) {
    console.log(`✅ [SUCCESS: E101] Using ${demoPostsData.length} demo posts (STATIC FALLBACK)`)
    return demoPostsData
  }

  console.log(`⚠️ [WARNING: E102] No data available from any source. Returning empty array.`)
  return blogPosts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`🔍 [STATUS: FETCHING] getBlogPostBySlug("${slug}") called`)
  
  // 1. PRIMARY: Try Sanity first
  if (sanityClient) {
    try {
      console.log(`📡 [STATUS: QUERYING] Fetching post "${slug}" from Sanity...`)
      
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
        console.log(`✅ [SUCCESS: E000] Found post "${slug}" in Sanity`)
        return normalizePost(post)
      }
      
      console.log(`ℹ️ [STATUS: NOT_FOUND] Post "${slug}" not found in Sanity`)
      
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ [ERROR CODE: E007] Error fetching post "${slug}" from Sanity:`, error.message)
      } else {
        console.error(`❌ [ERROR CODE: E008] Non-Error thrown:`, error)
      }
    }
  } else {
    console.error(`❌ [ERROR CODE: E001] Sanity client not available. Check your configuration.`)
  }

  // 2. FALLBACK: Try localStorage if Sanity doesn't have it
  console.log(`📦 [STATUS: FALLBACK] Trying localStorage for "${slug}"...`)
  const localStoragePosts = getLocalStoragePosts()
  if (localStoragePosts) {
    const found = localStoragePosts.find((p: any) => p.slug === slug)
    if (found) {
      console.log(`✅ [SUCCESS: E100] Found "${slug}" in localStorage`)
      return found
    }
  }

  // 3. FINAL FALLBACK: Demo data
  if (demoPostsData && demoPostsData.length > 0) {
    const found = demoPostsData.find((p) => p.slug === slug)
    if (found) {
      console.log(`✅ [SUCCESS: E101] Found "${slug}" in demo posts (STATIC FALLBACK)`)
      return found
    }
  }

  console.log(`❌ [ERROR CODE: E103] Post "${slug}" not found anywhere`)
  return null
}

export async function getBlogSlugs(): Promise<string[]> {
  console.log(`🔍 [STATUS: FETCHING] getBlogSlugs() called`)
  
  // 1. PRIMARY: Try Sanity first
  if (sanityClient) {
    try {
      console.log(`📡 [STATUS: QUERYING] Fetching slugs from Sanity...`)
      
      const query = `*[_type == "post"]{slug}`
      const slugs = await sanityClient.fetch(query)
      
      if (Array.isArray(slugs) && slugs.length > 0) {
        const result = slugs
          .map((item) => item?.slug?.current ?? item?.slug ?? "")
          .filter(Boolean)
        console.log(`✅ [SUCCESS: E000] Found ${result.length} slugs in Sanity`)
        return result
      }
      
      console.log(`ℹ️ [STATUS: EMPTY] No slugs found in Sanity`)
      
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ [ERROR CODE: E007] Error fetching slugs from Sanity:`, error.message)
      } else {
        console.error(`❌ [ERROR CODE: E008] Non-Error thrown:`, error)
      }
    }
  } else {
    console.error(`❌ [ERROR CODE: E001] Sanity client not available.`)
  }

  // 2. FALLBACK: Try localStorage if Sanity has no slugs
  console.log(`📦 [STATUS: FALLBACK] Trying localStorage for slugs...`)
  const localStoragePosts = getLocalStoragePosts()
  if (localStoragePosts) {
    const slugs = localStoragePosts.map((p: any) => p.slug).filter(Boolean)
    if (slugs.length > 0) {
      console.log(`✅ [SUCCESS: E100] Found ${slugs.length} slugs in localStorage`)
      return slugs
    }
  }

  // 3. FINAL FALLBACK: Demo data
  if (demoPostsData && demoPostsData.length > 0) {
    console.log(`✅ [SUCCESS: E101] Using ${demoPostsData.length} slugs from demo posts`)
    return demoPostsData.map((p) => p.slug)
  }

  console.log(`⚠️ [WARNING: E102] No slugs available. Returning empty array.`)
  return blogPosts.map((post) => post.slug)
}
