import Link from "next/link";
import { BlogListItem } from "@/types/blog";

interface Props {
  blog: BlogListItem;
  index: number;
}

const DELAYS = ["delay-50","delay-100","delay-150","delay-200","delay-250","delay-300"];

export default function BlogCard({ blog, index }: Props) {
  return (
    <Link
      href={`/blogs/${blog.slug}`}
      className={`card-cell group relative block p-7 animate-fade-up ${DELAYS[index] ?? ""}`}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
        {new Date(blog.created_at).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric",
        })}
      </p>
      <h3 className="mt-2 font-display text-xl text-ink tracking-[-0.01em] group-hover:text-gold-dark transition-colors duration-200">
        {blog.title}
      </h3>
      {blog.excerpt && (
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-ink-faint">
          {blog.excerpt}
        </p>
      )}
      <span className="absolute right-5 top-5 text-sm text-warm-border-dark transition-all duration-200 group-hover:-translate-y-0.75 group-hover:translate-x-0.75 group-hover:text-gold">
        ↗
      </span>
    </Link>
  );
}
