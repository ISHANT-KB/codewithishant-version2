"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminCheatsheetPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#f4f7fb_45%,#eef2f7_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-4xl border border-white/70 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(255,248,240,0.9)_38%,rgba(232,240,248,0.88)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.10)]">
          <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-10">
            <div className="max-w-3xl">
              <p className="mb-3 inline-flex rounded-full border border-emerald-300/70 bg-emerald-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-900">
                Cheatsheet workspace
              </p>
              <h1 className="max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Cheatsheets have a real admin destination now instead of an empty page.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                This route is ready to become your condensed revision editor for
                fast summaries, formulas, and quick-reference learning assets.
              </p>
            </div>

            <div className="flex flex-col gap-3 self-start lg:min-w-60">
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
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-4xl border border-white/70 bg-white/85 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-7">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Current role
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Ready for cheatsheet CRUD
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Use this route for concise content blocks, exam prep sheets, or
              condensed revision resources once the editor is added.
            </p>
          </div>

          <div className="rounded-4xl border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(242,246,250,0.96))] p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-7">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Suggested next step
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Add cheatsheet forms here
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This is the clean place to add creation, editing, and listing flows
              when you want to expand the admin suite beyond notes.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
