"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Note } from "@/types/note";
import { Topic } from "@/types/topic";

const API_BASE_URL = "http://127.0.0.1:8000";

function truncateId(value: string) {
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}
function truncateContent(value: string, length = 200) {
  if (value.length <= length) return value;
  return `${value.slice(0, length)}...`;
}

export default function AdminNotesPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
    }
  }, [token]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
    setTopicId((prev) => prev || topics[0]?.id || "");
  };

  const fetchNotes = async () => {
    const res = await fetch(`${API_BASE_URL}/notes`);
    if (!res.ok) throw new Error("Failed to fetch notes");

    const data: Note[] = await res.json();
    setNotes(data);
  };

  const fetchTopics = async () => {
    const res = await fetch(`${API_BASE_URL}/topics`);
    if (!res.ok) throw new Error("Failed to fetch topics");

    const data: Topic[] = await res.json();
    setTopics(data);

    if (data.length > 0) {
      setTopicId((prev) => prev || data[0].id);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        await Promise.all([fetchNotes(), fetchTopics()]);
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

    if (!token) {
      setError("Please log in as admin first");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    if (!topicId) {
      setError("Please select a topic");
      return;
    }

    try {
      setIsSaving(true);

      const url = editingNote
        ? `${API_BASE_URL}/notes/${editingNote.id}`
        : `${API_BASE_URL}/notes`;

      const method = editingNote ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          topic_id: topicId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Operation failed");
      }

      setMessage(
        editingNote ? "Note updated successfully" : "Note created successfully",
      );
      resetForm();
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!token) return;

    const confirmed = window.confirm(
      "Delete this note permanently? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setMessage("");
      setError("");

      const res = await fetch(`${API_BASE_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Delete failed");
      }

      setMessage("Note deleted successfully");

      if (editingNote?.id === id) {
        resetForm();
      }

      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (note: Note) => {
    setMessage("");
    setError("");
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTopicId(note.topic_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  const currentTopic = topics.find((topic) => topic.id === topicId);
  const activeLabel = editingNote ? "Editing note" : "New note";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#f4f7fb_45%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-4xl border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(255,248,240,0.9)_38%,rgba(232,240,248,0.88)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
          <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
                Notes workspace
              </p>
              <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Publish, refine, and organize your notes without leaving the editor.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                This page now owns note management. Create, update, and clean up
                notes here while the main admin route acts as your central hub.
              </p>
            </div>

            <div className="flex flex-col gap-3 self-start lg:min-w-60">
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Session
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {token ? "Authenticated" : "Checking access"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Secure note management enabled.
                </p>
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

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Total notes
            </p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">
              {loading ? "--" : notes.length}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Everything currently published in your library.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Topics available
            </p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">
              {loading ? "--" : topics.length}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Category destinations ready for assignment.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(33,72,99,0.96))] p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
              Active mode
            </p>
            <p className="mt-3 text-3xl font-semibold">{activeLabel}</p>
            <p className="mt-2 text-sm text-slate-300">
              {editingNote
                ? "You are modifying an existing note."
                : "Use the editor to add a fresh note to any topic."}
            </p>
          </div>
        </section>

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

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Note editor
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {editingNote ? "Update your note" : "Create a polished new note"}
                </h2>
              </div>

              {editingNote && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Cancel editing
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Note title
                  </span>
                  <input
                    placeholder="Example: Binary Search in One Pass"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    Topic
                  </span>
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                  >
                    <option value="">Select a topic</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Content
                </span>
                <textarea
                  placeholder="Write the full note here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-70 rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
                />
              </label>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Draft summary
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {title.trim()
                        ? `"${title.trim()}" is ready for ${currentTopic?.name || "the selected topic"}.`
                        : "Add a title and choose a topic to shape the draft."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {title.trim().length} title chars
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                      {content.trim().length} content chars
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving || loading || topics.length === 0}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isSaving
                    ? "Saving..."
                    : editingNote
                      ? "Update note"
                      : "Create note"}
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

          <div className="rounded-4xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,246,249,0.96))] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-200 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  Library overview
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  All notes
                </h2>
              </div>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {notes.length} items
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
                  Loading notes...
                </div>
              ) : notes.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-8 text-center">
                  <p className="text-lg font-semibold text-slate-800">
                    No notes yet
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Your published notes will appear here once you create the first one.
                  </p>
                </div>
              ) : (
                notes.map((note) => {
                  const topic = topics.find((item) => item.id === note.topic_id);
                  const isCurrent = editingNote?.id === note.id;

                  return (
                    <article
                      key={note.id}
                      className={`rounded-[28px] border p-5 shadow-sm transition ${
                        isCurrent
                          ? "border-slate-900 bg-slate-900 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
                          : "border-slate-200 bg-white/95 hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                isCurrent
                                  ? "bg-white/10 text-slate-200"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {topic?.name || "Unassigned topic"}
                            </span>

                            {isCurrent && (
                              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                                Active draft
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-xl font-semibold">
                            {note.title}
                          </h3>
                        </div>

                        <span
                          className={`text-xs ${
                            isCurrent ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {truncateId(note.id)}
                        </span>
                      </div>

                      <p
                        className={`mt-3 text-sm leading-6 ${
                          isCurrent ? "text-slate-200" : "text-slate-600"
                        }`}
                      >
                        {truncateContent(note.content)}
                      </p>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span
                          className={`text-xs ${
                            isCurrent ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          Topic ID: {truncateId(note.topic_id)}
                        </span>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEdit(note)}
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
                            onClick={() => deleteNote(note.id)}
                            disabled={deletingId === note.id}
                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                              isCurrent
                                ? "bg-rose-500 text-white hover:bg-rose-400 disabled:bg-rose-300"
                                : "bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:bg-rose-100"
                            }`}
                          >
                            {deletingId === note.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
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
