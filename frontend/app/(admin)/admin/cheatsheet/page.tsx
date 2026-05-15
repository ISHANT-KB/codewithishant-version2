"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cheatsheet } from "@/types/cheatsheet";
import { API_BASE_URL, ROUTES, STORAGE_KEYS } from "@/constants";

function truncateContent(value: string, length = 180) {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}...`;
}

const CATEGORY_SUGGESTIONS = [
  "Git", "Linux", "SQL", "Python", "JavaScript", "React",
  "TypeScript", "CSS", "Docker", "Bash", "Vim", "HTTP",
];

export default function AdminCheatsheetPage() {
  // Form state
  const [title, setTitle]           = useState("");
  const [slug, setSlug]             = useState("");
  const [category, setCategory]     = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent]       = useState("");

  // Page state
  const [cheatsheets, setCheatsheets] = useState<Cheatsheet[]>([]);
  const [loading, setLoading]   = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
      : null;

  useEffect(() => {
    if (!token) window.location.href = ROUTES.ADMIN_LOGIN;
  }, [token]);

  // Auto-generate slug from title when creating new
  useEffect(() => {
    if (!editingSlug) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      );
    }
  }, [title, editingSlug]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategory("");
    setDescription("");
    setContent("");
    setEditingSlug(null);
  };

  const fetchCheatsheets = async () => {
    const res = await fetch(`${API_BASE_URL}/cheatsheets`);
    if (!res.ok) throw new Error("Failed to fetch cheatsheets");
    const data: Cheatsheet[] = await res.json();
    setCheatsheets(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchCheatsheets();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (!token) { setError("Please log in as admin first"); return; }
    if (!title.trim())    { setError("Title is required"); return; }
    if (!slug.trim())     { setError("Slug is required"); return; }
    if (!category.trim()) { setError("Category is required"); return; }
    if (!content.trim())  { setError("Content is required"); return; }

    try {
      setIsSaving(true);
      const url    = editingSlug
        ? `${API_BASE_URL}/cheatsheets/${editingSlug}`
        : `${API_BASE_URL}/cheatsheets`;
      const method = editingSlug ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title:       title.trim(),
          slug:        slug.trim(),
          category:    category.trim(),
          description: description.trim() || null,
          content:     content.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Operation failed");
      }

      setMessage(editingSlug ? "Cheatsheet updated!" : "Cheatsheet created!");
      resetForm();
      await fetchCheatsheets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCheatsheet = async (slug: string) => {
    if (!token) return;
    if (!window.confirm("Delete this cheatsheet? This cannot be undone.")) return;

    try {
      setDeletingSlug(slug);
      setMessage("");
      setError("");

      const res = await fetch(`${API_BASE_URL}/cheatsheets/${slug}`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Delete failed");
      }

      setMessage("Cheatsheet deleted.");
      if (editingSlug === slug) resetForm();
      await fetchCheatsheets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingSlug(null);
    }
  };

  const startEdit = (sheet: Cheatsheet) => {
    setMessage("");
    setError("");
    setEditingSlug(sheet.slug);
    setTitle(sheet.title);
    setSlug(sheet.slug);
    setCategory(sheet.category);
    setDescription(sheet.description ?? "");
    setContent(sheet.content);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    window.location.href = ROUTES.ADMIN_LOGIN;
  };

  const activeLabel = editingSlug ? "Editing cheatsheet" : "New cheatsheet";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#f4f7fb_45%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* ── Header card ── */}
        <section className="overflow-hidden rounded-4xl border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(255,248,240,0.9)_38%,rgba(232,240,248,0.88)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
          <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-emerald-300/70 bg-emerald-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-900">
                Cheatsheet workspace
              </p>
              <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Build, edit, and publish quick-reference cheatsheets.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Write Markdown content, assign a category, and your cheatsheet
                goes live on the public <code className="text-xs bg-slate-100 px-1 rounded">/cheatsheets</code> page instantly.
              </p>
            </div>

            <div className="flex flex-col gap-3 self-start lg:min-w-60">
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Session</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {token ? "Authenticated" : "Checking access"}
                </p>
                <p className="mt-1 text-sm text-slate-500">Secure cheatsheet management.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats row ── */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Total cheatsheets</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{loading ? "--" : cheatsheets.length}</p>
            <p className="mt-2 text-sm text-slate-500">Published on the public index.</p>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Categories</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">
              {loading ? "--" : new Set(cheatsheets.map((c) => c.category)).size}
            </p>
            <p className="mt-2 text-sm text-slate-500">Unique topic groups covered.</p>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(33,72,99,0.96))] p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Active mode</p>
            <p className="mt-3 text-3xl font-semibold">{activeLabel}</p>
            <p className="mt-2 text-sm text-slate-300">
              {editingSlug ? "Modifying an existing cheatsheet." : "Use the editor to publish a fresh sheet."}
            </p>
          </div>
        </section>

        {/* ── Feedback banners ── */}
        {(error || message) && (
          <section className="space-y-3">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
                {message}
              </div>
            )}
          </section>
        )}

        {/* ── Editor + List ── */}
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">

          {/* Editor */}
          <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Cheatsheet editor</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {editingSlug ? "Update cheatsheet" : "Create a new cheatsheet"}
                </h2>
              </div>
              {editingSlug && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Cancel editing
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-5">
              {/* Title + Category row */}
              <div className="grid gap-5 lg:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Title</span>
                  <input
                    id="cs-title"
                    placeholder="e.g. Git Commands Reference"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">Category</span>
                  <input
                    id="cs-category"
                    list="category-suggestions"
                    placeholder="e.g. Git"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                  <datalist id="category-suggestions">
                    {CATEGORY_SUGGESTIONS.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </label>
              </div>

              {/* Slug (auto or manual) */}
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Slug <span className="text-slate-400 font-normal">(auto-generated, editable)</span>
                </span>
                <input
                  id="cs-slug"
                  placeholder="e.g. git-commands-reference"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </label>

              {/* Description */}
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Description <span className="text-slate-400 font-normal">(optional)</span>
                </span>
                <input
                  id="cs-description"
                  placeholder="One-line summary shown on listing page"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </label>

              {/* Content */}
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Content <span className="text-slate-400 font-normal">(Markdown)</span>
                </span>
                <textarea
                  id="cs-content"
                  placeholder={"## Basic Commands\n\n```bash\ngit init\ngit add .\ngit commit -m 'init'\n```"}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-72 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </label>

              {/* Preview summary */}
              <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Draft summary</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {title.trim()
                        ? `"${title.trim()}" → /${slug || "…"}`
                        : "Fill in a title to shape the draft."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {content.trim().length} chars
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {content.trim().split("\n").length} lines
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  id="cs-submit"
                  onClick={handleSubmit}
                  disabled={isSaving || loading}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSaving ? "Saving…" : editingSlug ? "Update cheatsheet" : "Create cheatsheet"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear form
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="rounded-4xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,246,249,0.96))] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Published sheets</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">All cheatsheets</h2>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {cheatsheets.length} items
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
                  Loading cheatsheets…
                </div>
              ) : cheatsheets.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
                  <p className="text-lg font-semibold text-slate-800">No cheatsheets yet</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Create your first one using the editor.
                  </p>
                </div>
              ) : (
                cheatsheets.map((sheet) => {
                  const isCurrent = editingSlug === sheet.slug;
                  return (
                    <article
                      key={sheet.id}
                      className={`rounded-[28px] border p-5 shadow-sm transition ${
                        isCurrent
                          ? "border-slate-900 bg-slate-900 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
                          : "border-slate-200 bg-white/95 hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                isCurrent
                                  ? "bg-white/10 text-slate-200"
                                  : "bg-emerald-100 text-emerald-900"
                              }`}
                            >
                              {sheet.category}
                            </span>
                            {isCurrent && (
                              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                                Active draft
                              </span>
                            )}
                          </div>
                          <h3 className="mt-3 text-xl font-semibold">{sheet.title}</h3>
                        </div>
                        <span className={`font-mono text-xs ${isCurrent ? "text-slate-300" : "text-slate-400"}`}>
                          /{sheet.slug}
                        </span>
                      </div>

                      <p className={`mt-3 text-sm leading-6 ${isCurrent ? "text-slate-200" : "text-slate-600"}`}>
                        {truncateContent(sheet.description || sheet.content)}
                      </p>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEdit(sheet)}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            isCurrent
                              ? "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCheatsheet(sheet.slug)}
                          disabled={deletingSlug === sheet.slug}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            isCurrent
                              ? "bg-rose-500 text-white hover:bg-rose-400 disabled:bg-rose-300"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:bg-rose-100"
                          }`}
                        >
                          {deletingSlug === sheet.slug ? "Deleting…" : "Delete"}
                        </button>
                        <Link
                          href={`/cheatsheets/${sheet.slug}`}
                          target="_blank"
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            isCurrent
                              ? "border border-white/20 bg-white/10 text-white hover:bg-white/15"
                              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          View ↗
                        </Link>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
