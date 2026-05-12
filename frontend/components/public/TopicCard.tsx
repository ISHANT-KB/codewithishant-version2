import Link from "next/link";
import { Topic } from "@/types/topic";

interface TopicCardProps {
  index: number;
  topic: Topic;
}

export default function TopicCard({ index, topic }: TopicCardProps) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group relative block overflow-hidden bg-parchment px-7 py-8 no-underline transition hover:bg-parchment-hover"
    >
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />

      <div className="mb-4 text-[10px] tracking-[0.2em] text-gold">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h2 className="mb-3 font-(--font-display) text-[22px] leading-[1.2] tracking-[-0.01em] text-ink transition group-hover:text-gold-dark">
        {topic.name}
      </h2>
      <p className="pr-8 text-[11px] leading-[1.7] tracking-[0.02em] text-ink-faint">
        {topic.description || "No description available."}
      </p>
      <span className="absolute bottom-6 right-6 text-base text-ink-faint transition group-hover:translate-x-0.75 group-hover:-translate-y-0.75 group-hover:text-gold">
        ↗
      </span>
    </Link>
  );
}
