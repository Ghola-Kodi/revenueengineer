export const blogPost = {
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Short summary for listing pages.",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Revenue Recovery", value: "Revenue Recovery" },
          { title: "Stripe Setup", value: "Stripe Setup" },
          { title: "Dunning", value: "Dunning" },
          { title: "Klaviyo Integration", value: "Klaviyo Integration" },
          { title: "GHL Integration", value: "GHL Integration" },
          { title: "Revenue Engineering", value: "Revenue Engineering" },
        ],
      },
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "readTime",
      title: "Read Time",
      type: "string",
      description: "Estimated reading time, e.g. 8 min read.",
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
    },
    {
      name: "content",
      title: "Content",
      type: "text",
      description: "Plain text content for the blog post.",
      rows: 20,
    },
  ],
}
