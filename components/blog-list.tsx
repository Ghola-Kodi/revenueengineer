"use client"

import { useMemo, useState } from "react"
import { BlogFilter } from "@/components/blog-filter"
import { BlogCard } from "@/components/blog-card"
import type { BlogPost } from "@/lib/types"

interface BlogListProps {
  posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = useMemo(() => {
    const unique = Array.from(new Set(posts.map((post) => post.category)))
    return ["All", ...unique]
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return posts
    return posts.filter((post) => post.category === activeCategory)
  }, [activeCategory, posts])

  return (
    <>
      <BlogFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            No articles found in this category yet. Check back soon.
          </p>
        </div>
      )}
    </>
  )
}
