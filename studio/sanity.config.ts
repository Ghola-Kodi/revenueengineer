import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { blogPost } from "./schemas/blogPost"

export default defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "your_project_id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  title: "RevEng Studio",
  apiVersion: "2025-06-01",
  basePath: "/studio",
  plugins: [deskTool()],
  schema: {
    types: [blogPost],
  },
})
