"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Topic } from "@/types/topic";
import { API_BASE_URL, ROUTES, STORAGE_KEYS } from "@/constants";

export default function AdminTopicPage() {
  const [topicName, setTopicName] = useState("");
  const [topicsList, setTopicsList] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
      : null;

  useEffect(() => {
    if (!token) {
      window.location.href = ROUTES.ADMIN_LOGIN;
    }
  }, [token]);

  const resetForm = () => {
    setTopicName("");
    setEditingTopic(null);
    setError(null);
  };

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/topics`);
      if (!response.ok) {
        throw new Error("Failed to fetch topics");
      }
      const data = await response.json();
      setTopicsList(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching topics";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialFetch = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/topics`);
        if (!response.ok) throw new Error("Failed to fetch topics");
        const data = await response.json();
        setTopicsList(data);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred while fetching topics";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    initialFetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!token) {
      setError("Unauthorized. Please log in.");
      return;
    }
    if (!topicName.trim()) {
      setError("Topic name cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);

      const url = editingTopic
        ? `${API_BASE_URL}/topics/${editingTopic.id}`
        : `${API_BASE_URL}/topics`;

      const method = editingTopic ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: topicName }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || "Operation failed");
      }

      setSuccessMsg(
        editingTopic
          ? `Topic "${topicName}" updated successfully.`
          : `Topic "${topicName}" created successfully.`
      );
      resetForm();
      await fetchTopics();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setTopicName(topic.name);
    setError(null);
    setSuccessMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (topicId: string, topicNameStr: string) => {
    if (!token) {
      setError("Unauthorized. Please log in.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${topicNameStr}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingTopicId(topicId);
      setError(null);
      setSuccessMsg(null);

      const response = await fetch(`${API_BASE_URL}/topics/${topicId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || "Failed to delete topic");
      }

      setSuccessMsg(`Topic "${topicNameStr}" deleted successfully.`);
      await fetchTopics();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setDeletingTopicId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    window.location.href = ROUTES.ADMIN_LOGIN;
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#f4f7fb_45%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* ── Header ── */}
        <section className="overflow-hidden rounded-4xl border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(255,248,240,0.9)_38%,rgba(232,240,248,0.88)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
          <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-sky-300/70 bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-900">
                Topic workspace
              </p>
              <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Manage your topics from one place.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Create, rename, and remove topics that organize your notes and
                learning content across the site.
              </p>
            </div>

            <div className="flex flex-col gap-3 self-start lg:min-w-60">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ← Back to dashboard
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
        </section>

        {/* ── Alerts ── */}
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-sm">
            <span className="text-lg">⚠</span>
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 transition hover:text-red-600"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800 shadow-sm">
            <span className="text-lg">✓</span>
            <p>{successMsg}</p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="ml-auto text-emerald-400 transition hover:text-emerald-600"
              aria-label="Dismiss success message"
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Main content: Form + List ── */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* ── Create / Edit Form ── */}
          <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                {editingTopic ? "Edit topic" : "New topic"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {editingTopic ? `Editing "${editingTopic.name}"` : "Create a topic"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <div>
                <label
                  htmlFor="topicName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Topic name
                </label>
                <input
                  id="topicName"
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. JavaScript, React, Data Structures"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-sky-600 bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : editingTopic
                      ? "Update topic"
                      : "Create topic"}
                </button>

                {editingTopic && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── Topics List ── */}
          <div className="rounded-4xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,246,250,0.96))] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Library
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                All topics{" "}
                <span className="text-lg font-normal text-slate-400">
                  ({topicsList.length})
                </span>
              </h2>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-sky-200 border-t-sky-600" />
                  <p className="text-sm text-slate-500">Loading topics...</p>
                </div>
              ) : topicsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 py-16 text-center">
                  <p className="text-3xl">📂</p>
                  <p className="text-sm font-medium text-slate-600">
                    No topics yet
                  </p>
                  <p className="text-xs text-slate-400">
                    Create your first topic using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {topicsList.map((topic) => (
                    <div
                      key={topic.id}
                      className={`group flex items-center justify-between gap-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${
                        deletingTopicId === topic.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-slate-900">
                          {topic.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          slug: {topic.slug}
                          {topic.id && (
                            <span className="ml-3">
                              id: {topic.id.length > 12
                                ? `${topic.id.slice(0, 12)}…`
                                : topic.id}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(topic)}
                          disabled={deletingTopicId === topic.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(topic.id, topic.name)}
                          disabled={deletingTopicId === topic.id}
                          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingTopicId === topic.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
