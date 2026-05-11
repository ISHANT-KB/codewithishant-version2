import Link from "next/link";
import { Topic } from "@/types/topic";

interface Props {
  topics: Topic[];
  currentSlug: string;
}

export default function Sidebar({ topics, currentSlug }: Props) {
  return (
    <aside className="w-64 shrink-0 sticky top-0 h-screen flex flex-col
                      bg-parchment border-r border-warm-border overflow-hidden">

      {/* Header */}
      <div className="relative px-6 pt-8 pb-5 border-b border-warm-border shrink-0
                      after:absolute after:-bottom-px after:left-6
                      after:w-10 after:h-0.5 after:bg-gold">
        <p className="text-[9px] tracking-[0.3em] uppercase text-gold mb-1.5">Index</p>
        <h2 className="font-display text-xl font-bold text-ink tracking-[-0.02em]">Topics</h2>
      </div>

      {/* List */}
      <ul className="flex-1 overflow-y-auto py-4">
        {topics.map((topic, i) => (
          <li key={topic.id}>
            <Link
              href={`/topics/${topic.slug}`}
              className={`sb-link ${currentSlug === topic.slug ? "active" : ""}`}
            >
              <span className="text-[9px] tracking-widest text-gold w-7 text-right shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{topic.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-warm-border shrink-0
                      text-[9px] tracking-[0.15em] uppercase text-ink-ghost">
        {topics.length} topics
      </div>
    </aside>
  );
}