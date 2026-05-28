import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: "https://codewithishant.com/sitemap.xml",
  };
}

export const dynamicParams = false; // No dynamic params since we fetch all blogs for sitemap generation