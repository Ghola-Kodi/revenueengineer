"use client"

import { cn } from "@/lib/utils"

interface BlogFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function BlogFilter({ categories, activeCategory, onCategoryChange }: BlogFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      {categories.map((category) => (
        <button
          key={category}
          role="tab"
          aria-selected={activeCategory === category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
            activeCategory === category
              ? "border-[#635bff] bg-[#635bff]/10 text-[#635bff]"
              : "border-[#d6dfeb] bg-[#eef2f7] text-[#4b5f7e] hover:bg-[#deeaf5] hover:text-[#0a2540]"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
