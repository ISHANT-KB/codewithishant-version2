import Link from "next/link";
import { Topic } from "@/types/topic";

interface TopicListRowProps {
  index: number;
  topic: Topic;
}

export default function TopicListRow({ index, topic }: TopicListRowProps) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group relative grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 overflow-hidden border-b border-warm-border py-7 no-underline transition sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:gap-6"
    >
      <div className="absolute inset-0 origin-left scale-x-0 bg-parchment-hover transition duration-300 group-hover:scale-x-100" />

      <span className="relative z-10 text-right text-[11px] tracking-widest text-gold">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative z-10 min-w-0">
        <div className="mb-1 truncate font-(--font-display) text-[20px] tracking-[-0.01em] text-ink transition group-hover:text-gold-dark">
          {topic.name}
        </div>
        <div className="truncate text-[11px] tracking-[0.03em] text-ink-faint">
          {topic.description || "No description available."}
        </div>
      </div>
      <span className="relative z-10 text-lg text-ink-faint transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold">
        ↗
      </span>
    </Link>
  );
}
