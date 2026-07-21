import { createClient } from "@sanity/client"
import type { BlogPost } from "./types"

// Use webhookengineer as default dataset
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "webhookengineer"
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const useCdn = process.env.NODE_ENV === "false"

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
  console.error("❌ Sanity client not initialized. Check NEXT_PUBLIC_SANITY_PROJECT_ID")
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
  console.log("🔍 Fetching all blog posts from Sanity...")
  
  // PRIMARY: Sanity only - no test mode, no fallbacks
  if (sanityClient) {
    try {
      // ✅ FIXED: Changed from "post" to "blogPost"
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
      return []
    } catch (error) {
      console.error("❌ Error fetching posts from Sanity:", error)
      return []
    }
  }

  console.error("❌ Sanity client not available")
  return []
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  console.log(`🔍 Fetching post "${slug}" from Sanity...`)
  
  // PRIMARY: Sanity only - no test mode, no fallbacks
  if (sanityClient) {
    try {
      // ✅ FIXED: Changed from "post" to "blogPost"
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
      return null
    } catch (error) {
      console.error(`❌ Error fetching post "${slug}":`, error)
      return null
    }
  }

  console.error("❌ Sanity client not available")
  return null
}

export async function getBlogSlugs(): Promise<string[]> {
  console.log("🔍 Fetching all slugs from Sanity...")
  
  // PRIMARY: Sanity only - no test mode, no fallbacks
  if (sanityClient) {
    try {
      // ✅ FIXED: Changed from "post" to "blogPost"
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
      return []
    } catch (error) {
      console.error("❌ Error fetching slugs:", error)
      return []
    }
  }

  console.error("❌ Sanity client not available")
  return []
}
