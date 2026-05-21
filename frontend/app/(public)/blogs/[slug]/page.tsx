import { getBlog } from "@/lib/api/blogs";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default async function BlogDetailPage({ params }: Props) {
  let blog;
  try {
    blog = await getBlog(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-parchment">
      {/* Back */}
      <div className="border-b border-warm-border px-6 py-4 sm:px-10 md:px-16">
        <Link
          href="/blogs"
          className="text-[11px] uppercase tracking-[0.2em] text-ink-muted transition hover:text-ink"
        >
          ← All Posts
        </Link>
      </div>

      {/* Hero */}
      <header className="border-b border-warm-border px-6 py-14 sm:px-10 md:px-16">
        <p className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          {blog.title}
        </h1>
        {blog.excerpt && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
            {blog.excerpt}
          </p>
        )}
      </header>

      {/* Content */}
      <article className="mx-auto max-w-3xl px-6 py-14 sm:px-10 md:px-16">
        <div className="prose prose-stone max-w-none
                        prose-headings:font-display prose-headings:tracking-tight
                        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                        prose-p:text-ink-muted prose-p:leading-relaxed
                        prose-a:text-gold-dark prose-a:no-underline hover:prose-a:underline
                        prose-code:rounded prose-code:bg-warm-border/40 prose-code:px-1.5 prose-code:py-0.5
                        prose-pre:border prose-pre:border-warm-border prose-pre:bg-white/60">
          <MarkdownRenderer content={blog.content} />
        </div>

        {/* Footer nav */}
        <div className="mt-16 border-t border-warm-border pt-8">
          <Link
            href="/blogs"
            className="nb-top-fill relative overflow-hidden border border-ink px-6 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-parchment"
          >
            <span className="relative z-10">← Back to all posts</span>
          </Link>
        </div>
      </article>
    </div>
  );
}