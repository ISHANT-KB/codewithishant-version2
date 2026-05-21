import { API_BASE_URL } from "./client";
import { Blog, BlogListItem } from "@/types/blog";

// ── public ────────────────────────────────────────────────────────────────────

export async function getBlogs(): Promise<BlogListItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/blogs/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getBlog(slug: string): Promise<Blog> {
  const res = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Blog not found");
  return res.json();
}

// ── admin ─────────────────────────────────────────────────────────────────────

export async function getAllBlogsAdmin(): Promise<BlogListItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/blogs/admin/all`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function createBlog(data: {
  title: string;
  content: string;
  excerpt?: string;
  published: boolean;
}): Promise<Blog> {
  const res = await fetch(`${API_BASE_URL}/api/blogs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create blog");
  return res.json();
}

export async function updateBlog(
  id: string,
  data: Partial<{ title: string; content: string; excerpt: string; published: boolean }>
): Promise<Blog> {
  const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update blog");
  return res.json();
}

export async function deleteBlog(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete blog");
}