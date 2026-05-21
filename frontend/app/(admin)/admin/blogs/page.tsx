"use client";

import { useEffect, useState } from "react";
import {
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/api/blogs";
import { BlogListItem } from "@/types/blog";
import Link from "next/link";

type Mode = "list" | "create" | "edit";

export default function AdminBlogsPage() {
  const [blogs, setBlogs]     = useState<BlogListItem[]>([]);
  const [mode, setMode]       = useState<Mode>("list");
  const [editing, setEditing] = useState<BlogListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");

  // form state
  const [title,     setTitle]     = useState("");
  const [excerpt,   setExcerpt]   = useState("");
  const [content,   setContent]   = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => { fetchBlogs(); }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      setBlogs(await getAllBlogsAdmin());
    } catch { setError("Failed to load blogs"); }
    finally  { setLoading(false); }
  }

  function openCreate() {
    setTitle(""); setExcerpt(""); setContent(""); setPublished(false);
    setEditing(null); setMode("create");
  }

  function openEdit(b: BlogListItem) {
    setTitle(b.title); setExcerpt(b.excerpt ?? "");
    setContent(""); // full content not in list — user re-enters or load full
    setPublished(b.published); setEditing(b); setMode("edit");
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) { setError("Title and content required"); return; }
    setSaving(true); setError("");
    try {
      if (mode === "create") {
        await createBlog({ title, excerpt, content, published });
      } else if (editing) {
        await updateBlog(editing.id, { title, excerpt, content, published });
      }
      await fetchBlogs();
      setMode("list");
    } catch (e) { setError(e instanceof Error ? e.message : "Failed to save"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(id);
      setBlogs(b => b.filter(x => x.id !== id));
    } catch { setError("Failed to delete"); }
  }

  async function handleTogglePublish(b: BlogListItem) {
    try {
      await updateBlog(b.id, { published: !b.published });
      await fetchBlogs();
    } catch { setError("Failed to update"); }
  }

  return (
    <main className="min-h-screen bg-parchment text-ink">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 md:px-16">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between border-b border-warm-border pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">Admin</p>
            <h1 className="mt-1 font-display text-4xl tracking-tight">Blog Posts</h1>
          </div>
          <div className="flex gap-3">
            {mode !== "list" ? (
              <button
                onClick={() => setMode("list")}
                className="border border-warm-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted transition hover:text-ink"
              >
                ← Back
              </button>
            ) : (
              <>
                <Link
                  href="/admin"
                  className="border border-warm-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted transition hover:text-ink"
                >
                  Dashboard
                </Link>
                <button
                  onClick={openCreate}
                  className="nb-top-fill relative overflow-hidden border border-ink px-5 py-2 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-parchment"
                >
                  <span className="relative z-10">+ New Post</span>
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <p className="mb-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* ── LIST ── */}
        {mode === "list" && (
          <>
            {loading ? (
              <p className="text-sm text-ink-muted">Loading…</p>
            ) : blogs.length === 0 ? (
              <div className="border border-warm-border p-12 text-center">
                <p className="font-display text-2xl text-ink">No posts yet</p>
                <p className="mt-2 text-sm text-ink-muted">Create your first blog post above.</p>
              </div>
            ) : (
              <div className="grid gap-px border border-warm-border bg-warm-border">
                {blogs.map((b) => (
                  <div key={b.id} className="flex items-center justify-between gap-4 bg-parchment px-6 py-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block h-2 w-2 rounded-full ${b.published ? "bg-emerald-500" : "bg-amber-400"}`} />
                        <h3 className="truncate font-display text-lg text-ink">{b.title}</h3>
                      </div>
                      <p className="mt-1 truncate text-[11px] text-ink-muted">
                        {b.excerpt ?? "No excerpt"} · {new Date(b.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleTogglePublish(b)}
                        className="border border-warm-border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-ink-muted transition hover:text-ink"
                      >
                        {b.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => openEdit(b)}
                        className="border border-warm-border px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-ink-muted transition hover:text-ink"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="border border-red-200 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-red-400 transition hover:border-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── CREATE / EDIT FORM ── */}
        {(mode === "create" || mode === "edit") && (
          <div className="border border-warm-border bg-white/60">
            <div className="border-b border-warm-border px-6 py-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">
                {mode === "create" ? "New post" : `Editing — ${editing?.title}`}
              </p>
            </div>

            <div className="flex flex-col gap-5 p-6 sm:p-8">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-muted">Title *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Post title…"
                  className="w-full border border-warm-border bg-parchment px-4 py-3 font-display text-xl text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-muted">Excerpt</label>
                <input
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Short summary shown on listing page…"
                  className="w-full border border-warm-border bg-parchment px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                  Content * <span className="normal-case text-ink-faint">(Markdown supported)</span>
                </label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your post in Markdown…"
                  rows={16}
                  className="w-full border border-warm-border bg-parchment px-4 py-3 font-mono text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Published toggle */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={e => setPublished(e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                <span className="text-sm text-ink">Publish immediately</span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 border-t border-warm-border pt-5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="nb-top-fill relative overflow-hidden border border-ink px-6 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-parchment disabled:opacity-50"
                >
                  <span className="relative z-10">{saving ? "Saving…" : mode === "create" ? "Create Post" : "Save Changes"}</span>
                </button>
                <button
                  onClick={() => setMode("list")}
                  className="border border-warm-border px-6 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ink-muted transition hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}