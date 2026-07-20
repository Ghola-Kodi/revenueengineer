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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  console.log("🔍 [STATUS: FETCHING] getAllBlogPosts() called")
  
  if (!sanityClient) {
    console.error(`❌ [ERROR CODE: E001] Sanity client not available.`)
    return []
  }
  
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
      console.log(`✅ [SUCCESS] Found ${posts.length} posts in Sanity`)
      return posts.map(normalizePost)
    }
    
    console.log(`ℹ️ [STATUS: EMPTY] No posts found in Sanity`)
    return []
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("projectId")) {
        console.error(`❌ [ERROR CODE: E002] Invalid projectId:`, error.message)
      } else if (error.message.includes("dataset")) {
        console.error(`❌ [ERROR CODE: E003] Invalid dataset:`, error.message)
      } else if (error.message.includes("token") || error.message.includes("auth") || error.message.includes("401")) {
        console.error(`❌ [ERROR CODE: E004] Authentication failed:`, error.message)
      } else if (error.message.includes("timeout") || error.message.includes("network")) {
        console.error(`❌ [ERROR CODE: E005] Network timeout:`, error.message)
      } else if (error.message.includes("CORS")) {
        console.error(`❌ [ERROR CODE: E006] CORS error:`, error.message)
      } else {
        console.error(`❌ [ERROR CODE: E007] Unknown Sanity error:`, error.message)
      }
    } else {
      console.error(`❌ [ERROR CODE: E008] Non-Error thrown:`, error)
    }
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`🔍 [STATUS: FETCHING] getBlogPostBySlug("${slug}") called`)
  
  if (!sanityClient) {
    console.error(`❌ [ERROR CODE: E001] Sanity client not available.`)
    return null
  }
  
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
      console.log(`✅ [SUCCESS] Found post "${slug}" in Sanity`)
      return normalizePost(post)
    }
    
    console.log(`ℹ️ [STATUS: NOT_FOUND] Post "${slug}" not found in Sanity`)
    return null
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ [ERROR CODE: E007] Error fetching post "${slug}":`, error.message)
    } else {
      console.error(`❌ [ERROR CODE: E008] Non-Error thrown:`, error)
    }
    return null
  }
}

export async function getBlogSlugs(): Promise<string[]> {
  console.log(`🔍 [STATUS: FETCHING] getBlogSlugs() called`)
  
  if (!sanityClient) {
    console.error(`❌ [ERROR CODE: E001] Sanity client not available.`)
    return []
  }
  
  try {
    console.log(`📡 [STATUS: QUERYING] Fetching slugs from Sanity...`)
    
    const query = `*[_type == "post"]{slug}`
    const slugs = await sanityClient.fetch(query)
    
    if (Array.isArray(slugs) && slugs.length > 0) {
      const result = slugs
        .map((item) => item?.slug?.current ?? item?.slug ?? "")
        .filter(Boolean)
      console.log(`✅ [SUCCESS] Found ${result.length} slugs in Sanity`)
      return result
    }
    
    console.log(`ℹ️ [STATUS: EMPTY] No slugs found in Sanity`)
    return []
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ [ERROR CODE: E007] Error fetching slugs:`, error.message)
    } else {
      console.error(`❌ [ERROR CODE: E008] Non-Error thrown:`, error)
    }
    return []
  }
}
