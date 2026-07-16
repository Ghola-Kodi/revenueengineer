import * as SanityPkg from "@sanity/client"
// Support both named and default exports from different @sanity/client versions
const createClient: any = typeof SanityPkg === "function"
  ? SanityPkg
  : (SanityPkg as any).createClient ?? (SanityPkg as any).default ?? (SanityPkg as any)["module.exports"] ?? SanityPkg
import { blogPosts } from "./blog-data"
import { demoPostsData } from "./demo-posts"
import type { BlogPost } from "./types"

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? "production"
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? ""
const sanityToken = process.env.SANITY_API_TOKEN?.trim()
const useCdn = process.env.NODE_ENV === "production"

const sanityClient = projectId && projectId !== "" && projectId !== "your_project_id"
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2025-06-01",
      useCdn,
      token: sanityToken,
    })
  : null

export async function createBlogPost(post: any) {
  if (!sanityClient) {
    throw new Error("Sanity client is not configured")
  }

  const doc = {
    _type: "blogPost",
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    publishedAt: post.date ?? new Date().toISOString(),
    readTime: post.readTime,
    featured: post.featured ?? false,
    content: post.content,
    slug: {
      _type: "slug",
      current: post.slug,
    },
  }

  if (typeof sanityClient.createIfNotExists === "function") {
    return sanityClient.createIfNotExists({
      _id: `blogPost.${post.slug}`,
      ...doc,
    })
  }

  return sanityClient.create(doc)
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
  // Try to fetch from Sanity first
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
        return posts.map(normalizePost)
      }
    } catch (error) {
      console.warn("Sanity fetch failed, falling back to demo posts:", error)
    }
  }

  // Check localStorage for demo posts (blog admin)
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("demo_posts")
      if (stored) {
        const demoPosts = JSON.parse(stored)
        if (Array.isArray(demoPosts) && demoPosts.length > 0) {
          return demoPosts
        }
      }
    } catch (error) {
      console.warn("localStorage demo posts parse failed")
    }
  }

  // Fall back to demo posts or static data
  if (demoPostsData && demoPostsData.length > 0) {
    return demoPostsData
  }

  return blogPosts
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Try Sanity first
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
        return normalizePost(post)
      }
    } catch (error) {
      console.warn("Sanity fetch failed, falling back to demo posts:", error)
    }
  }

  // Check localStorage for demo posts
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("demo_posts")
      if (stored) {
        const demoPosts = JSON.parse(stored)
        const found = demoPosts.find((p: any) => p.slug === slug)
        if (found) return found
      }
    } catch (error) {
      console.warn("localStorage demo posts parse failed")
    }
  }

  // Fall back to demo posts or static data
  if (demoPostsData && demoPostsData.length > 0) {
    return demoPostsData.find((p) => p.slug === slug) ?? null
  }

  return blogPosts.find((post) => post.slug === slug) ?? null
}

export async function getBlogSlugs(): Promise<string[]> {
  // Try Sanity first
  if (sanityClient) {
    try {
      const query = `*[_type == "blogPost"]{slug}`
      const slugs = await sanityClient.fetch(query)
      if (Array.isArray(slugs) && slugs.length > 0) {
        return slugs
          .map((item) => item?.slug?.current ?? item?.slug ?? "")
          .filter(Boolean)
      }
    } catch (error) {
      console.warn("Sanity fetch failed, falling back to demo posts:", error)
    }
  }

  // Check localStorage for demo posts
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("demo_posts")
      if (stored) {
        const demoPosts = JSON.parse(stored)
        if (Array.isArray(demoPosts) && demoPosts.length > 0) {
          return demoPosts.map((p: any) => p.slug)
        }
      }
    } catch (error) {
      console.warn("localStorage demo posts parse failed")
    }
  }

  // Fall back to demo posts or static data
  if (demoPostsData && demoPostsData.length > 0) {
    return demoPostsData.map((p) => p.slug)
  }

  return blogPosts.map((post) => post.slug)
}
