import Link from "next/link";
import { Topic } from "@/types/topic";
import IndexBadge from "@/components/ui/IndexBadge";

interface Props {
  topic: Topic;
  index: number;
}

const DELAYS = ["delay-50","delay-100","delay-150","delay-200","delay-250","delay-300"];

export default function TopicCard({ topic, index }: Props) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className={`card-cell group block p-8 animate-fade-up ${DELAYS[index] ?? ""}`}
    >
      <IndexBadge index={index} />
      <h2 className="font-display text-[22px] font-bold text-ink tracking-[-0.01em]
                     mt-3 mb-3 group-hover:text-gold-dark transition-colors duration-200">
        {topic.name}
      </h2>
      <p className="text-[11px] text-ink-faint leading-relaxed tracking-[0.02em]">
        {topic.description || "No description available."}
      </p>
      <span className="absolute top-5 right-5 text-base text-warm-border-dark
                       group-hover:translate-x-[3px] group-hover:-translate-y-[3px]
                       group-hover:text-gold transition-all duration-200">
        ↗
      </span>
    </Link>
  );
}
