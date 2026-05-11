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
      className="group relative block overflow-hidden bg-[#faf8f3] px-7 py-8 no-underline transition hover:bg-[#f5f1e8]"
    >
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#c8a96e] transition-all duration-300 group-hover:w-full" />

      <div className="mb-4 text-[10px] tracking-[0.2em] text-[#c8a96e]">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h2 className="mb-3 font-[family:var(--font-display)] text-[22px] font-bold leading-[1.2] tracking-[-0.01em] text-[#1a1a18] transition group-hover:text-[#8a6830]">
        {topic.name}
      </h2>
      <p className="pr-8 text-[11px] leading-[1.7] tracking-[0.02em] text-[#9b9590]">
        {topic.description || "No description available."}
      </p>
      <span className="absolute bottom-6 right-6 text-base text-[#d8d3c8] transition group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-[#c8a96e]">
        ↗
      </span>
    </Link>
  );
}
