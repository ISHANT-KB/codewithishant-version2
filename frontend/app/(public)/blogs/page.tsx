import Link from "next/link";
import { getBlogs } from "@/lib/api/blogs";
import { BlogListItem } from "@/types/blog";
import EmptyState from "@/components/ui/EmptyState";

export default async function BlogsPage() {
  const blogs: BlogListItem[] = await getBlogs();

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <section className="border-b border-warm-border px-6 py-14 sm:px-10 md:px-16">
        <p className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">Writing</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight text-ink sm:text-6xl">
          Blog
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
          Articles, announcements, and long-form notes on learning, code, and everything in between.
        </p>
      </section>

      {/* List */}
      <section className="px-6 py-12 sm:px-10 md:px-16">
        <div className="mb-8 flex items-baseline gap-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">All Posts</span>
          <span className="text-[11px] text-gold">x{blogs.length}</span>
          <div className="h-px flex-1 bg-warm-border" />
        </div>

        {blogs.length === 0 ? (
          <EmptyState message="No posts yet — check back soon." />
        ) : (
          <div className="grid gap-px border border-warm-border bg-warm-border">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.slug}`}
                className="card-cell group relative block bg-parchment p-7 transition-colors hover:bg-white/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                      {new Date(blog.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-ink transition-colors group-hover:text-gold-dark">
                      {blog.title}
                    </h2>
                    {blog.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-lg text-warm-border-dark transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold">
                    ↗
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
