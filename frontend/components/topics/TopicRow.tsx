import Link from "next/link";
import { Topic } from "@/types/topic";

interface Props {
  topic: Topic;
  index: number;
}

const DELAYS = ["delay-50","delay-100","delay-150","delay-200","delay-250","delay-300"];

export default function TopicRow({ topic, index }: Props) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className={`row-link group grid items-center gap-6 py-7
                  border-b border-warm-border animate-fade-up
                  ${DELAYS[index] ?? ""}
                  `}
      style={{ gridTemplateColumns: "48px 1fr auto" }}
    >
      <span className="text-[11px] tracking-widest text-gold text-right z-10">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 z-10">
        <div className="font-display text-xl font-bold text-ink tracking-[-0.01em]
                        mb-1 truncate group-hover:text-gold-dark transition-colors duration-200">
          {topic.name}
        </div>
        <div className="text-[11px] text-ink-faint tracking-[0.03em] truncate">
          {topic.description || "No description available."}
        </div>
      </div>

      <span className="text-lg text-warm-border-dark shrink-0 z-10
                       group-hover:translate-x-1 group-hover:-translate-y-1
                       group-hover:text-gold transition-all duration-200">
        ↗
      </span>
    </Link>
  );
}
