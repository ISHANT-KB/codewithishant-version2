"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL, ROUTES, STORAGE_KEYS } from "@/constants";

type DashboardStats = {
  notes: number | null;
  topics: number | null;
};

const adminSections = [
  {
    href: "/admin/notes",
    name: "Notes",
    eyebrow: "Content",
    description:
      "Create, edit, and delete notes while keeping topic assignment in view.",
    statKey: "notes" as const,
    cta: "Open notes",
  },
  {
    href: "/admin/topic",
    name: "Topics",
    eyebrow: "Structure",
    description:
      "Manage your topic tree and keep the public learning catalog organized.",
    statKey: "topics" as const,
    cta: "Open topics",
  },
  {
    href: "/admin/cheatsheet",
    name: "Cheatsheets",
    eyebrow: "Revision",
    description:
      "Build compact revision assets and quick-reference material for learners.",
    statKey: null,
    cta: "Open cheatsheets",
  },
  {
    href: "/admin/blogs",
    name: "Blogs",
    eyebrow: "Engagement",
    description:
      "Craft engaging blog posts to share insights, updates, and stories with your audience.",
    statKey: null,
    cta: "Open blogs",
  },
  {
  href: "/admin/audit",
  name: "Audit Log",
  eyebrow: "Security",
  description: "View all admin actions — who created, updated or deleted what.",
  statKey: null,
  cta: "View logs",
},
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ notes: null, topics: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)
      : null;

  useEffect(() => {
    if (!token) {
      window.location.href = ROUTES.ADMIN_LOGIN;
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const [notesRes, topicsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/notes`),
          fetch(`${API_BASE_URL}/topics`),
        ]);

        if (!notesRes.ok || !topicsRes.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const [notes, topics] = await Promise.all([
          notesRes.json() as Promise<Array<unknown>>,
          topicsRes.json() as Promise<Array<unknown>>,
        ]);

        setStats({
          notes: notes.length,
          topics: topics.length,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    window.location.href = ROUTES.ADMIN_LOGIN;
  };

  const statusLabel = loading ? "Refreshing workspace" : "Ready";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#f4f7fb_42%,#edf2f8_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-4xl border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(254,248,238,0.92)_36%,rgba(232,240,248,0.9)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
          <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
                Admin dashboard
              </p>
              <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Choose the workspace you want, then jump straight into managing content.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                This is now the central admin hub. Use it to open notes, topics,
                cheatsheets, and the rest of your upcoming admin tools from one place.
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
                <p className="mt-1 text-sm text-slate-500">{statusLabel}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Link
                  href="/admin/notes"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Open notes
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

        {(error || loading) && (
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Notes
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">
                {loading ? "--" : stats.notes ?? "--"}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Topics
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">
                {loading ? "--" : stats.topics ?? "--"}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(33,72,99,0.96))] p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                System
              </p>
              <p className="mt-3 text-3xl font-semibold">
                {loading ? "Syncing" : error ? "Needs attention" : "Healthy"}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {error || "Your core admin counts are available from the hub."}
              </p>
            </div>
          </section>
        )}

        {!error && !loading && (
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Total notes
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">
                {stats.notes}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Published and draft-ready note records in your library.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Total topics
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">
                {stats.topics}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Active topic destinations available for organization.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(33,72,99,0.96))] p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                Active mode
              </p>
              <p className="mt-3 text-3xl font-semibold">Navigation hub</p>
              <p className="mt-2 text-sm text-slate-300">
                Pick the workspace you need instead of landing inside one tool by default.
              </p>
            </div>
          </section>
        )}

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Admin sections
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Open the workspace you need
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              {adminSections.map((section) => {
                const statValue =
                  section.statKey === null ? "Soon" : stats[section.statKey];

                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="group rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          {section.eyebrow}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-slate-900">
                          {section.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {section.description}
                        </p>
                      </div>

                      <div className="flex min-w-28 flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          Status
                        </span>
                        <span className="text-2xl font-semibold text-slate-900">
                          {loading && section.statKey !== null ? "--" : statValue}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-slate-900 transition group-hover:translate-x-1">
                      {section.cta}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-4xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,246,250,0.96))] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-7">
            <div className="border-b border-slate-200 pb-5">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Quick actions
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Common next steps
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              <Link
                href="/admin/notes"
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-lg font-semibold text-slate-900">
                  Continue note publishing
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Jump back into the full note editor and library list.
                </p>
              </Link>

              <Link
                href="/admin/topic"
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-lg font-semibold text-slate-900">
                  Prepare topic management
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use the scaffolded topic workspace as the next admin module.
                </p>
              </Link>

              <Link
                href="/admin/cheatsheet"
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-lg font-semibold text-slate-900">
                  Prepare cheatsheet tools
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Land on a non-blank admin route while that editor gets built out.
                </p>
              </Link>

              <Link
                href="/admin/blogs"
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-lg font-semibold text-slate-900">
                  Prepare blog publishing
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Open the dedicated blog workspace instead of landing on a placeholder mismatch.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
