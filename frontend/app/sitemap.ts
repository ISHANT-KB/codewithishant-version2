import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/api/blogs";

const BASE = "https://codewithishant.com";

// Static public routes
const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
  { url: `${BASE}/blogs`,             lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  { url: `${BASE}/notes`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/topics`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/cheatsheets`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  { url: `${BASE}/visualizer`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/security-policy`,   lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const blogs = await getBlogs();
    blogRoutes = blogs
      .filter((b) => b.published)
      .map((b) => ({
        url: `${BASE}/blogs/${b.slug}`,
        lastModified: new Date(b.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    // silently skip — sitemap still returns static routes
  }

  return [...STATIC_ROUTES, ...blogRoutes];
}

export const dynamicParams = false; // No dynamic params since we fetch all blogs for sitemap generation