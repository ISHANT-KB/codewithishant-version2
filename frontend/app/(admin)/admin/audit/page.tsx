"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/constants";

interface AuditEntry {
  id: number;
  admin_email: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  resource_type: string;
  resource_id: string | null;
  detail: string | null;
  created_at: string;
}

const ACTION_STYLES: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  UPDATE: "bg-amber-50  text-amber-700  border-amber-200",
  DELETE: "bg-red-50    text-red-600    border-red-200",
};
const LIMIT = 50;

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [page,    setPage]    = useState(0);

  async function fetchLogs(p: number) {
    try {
      setLoading(true); setError("");
      const res = await fetch(
        `${API_BASE_URL}/api/audit-logs/?skip=${p * LIMIT}&limit=${LIMIT}`,
        { credentials: "include", cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to load audit logs");
      setEntries(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  return (
    <main className="min-h-screen bg-parchment text-ink">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 md:px-16">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between border-b border-warm-border pb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">Admin</p>
            <h1 className="mt-1 font-display text-4xl tracking-tight">Audit Log</h1>
          </div>
          <Link
            href="/admin"
            className="border border-warm-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted transition hover:text-ink"
          >
            ← Dashboard
          </Link>
        </div>

        {error && (
          <p className="mb-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-ink-muted">Loading…</p>
        ) : entries.length === 0 ? (
          <div className="border border-warm-border p-12 text-center">
            <p className="font-display text-2xl text-ink">No activity yet</p>
            <p className="mt-2 text-sm text-ink-muted">
              Admin actions will appear here once recorded.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-px border border-warm-border bg-warm-border">
              {/* Table head */}
              <div className="grid grid-cols-[80px_90px_110px_1fr_160px] gap-4 bg-parchment px-6 py-3">
                {["Action","Resource","ID / slug","Detail","When"].map(h => (
                  <p key={h} className="text-[10px] uppercase tracking-[0.18em] text-ink-muted">{h}</p>
                ))}
              </div>

              {entries.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-[80px_90px_110px_1fr_160px] items-center gap-4 bg-parchment px-6 py-4"
                >
                  {/* Action badge */}
                  <span className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-wider ${ACTION_STYLES[e.action] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {e.action}
                  </span>

                  {/* Resource type */}
                  <p className="text-sm text-ink">{e.resource_type}</p>

                  {/* Resource ID */}
                  <p className="truncate font-mono text-[11px] text-ink-muted">
                    {e.resource_id ?? "—"}
                  </p>

                  {/* Detail */}
                  <p className="truncate text-sm text-ink">
                    {e.detail || <span className="text-ink-faint">—</span>}
                  </p>

                  {/* Timestamp */}
                  <p className="text-[11px] text-ink-muted">
                    {new Date(e.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="border border-warm-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted transition hover:text-ink disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="self-center text-[11px] text-ink-muted">
                Page {page + 1}
              </span>
              <button
                disabled={entries.length < LIMIT}
                onClick={() => setPage(p => p + 1)}
                className="border border-warm-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted transition hover:text-ink disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
