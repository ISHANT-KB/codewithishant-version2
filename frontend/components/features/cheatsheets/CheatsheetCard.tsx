import Link from "next/link";
import { Cheatsheet } from "@/types/cheatsheet";

interface Props {
  cheatsheet: Cheatsheet;
  index: number;
}

const DELAYS = ["delay-50", "delay-100", "delay-150", "delay-200", "delay-250", "delay-300"];

export default function CheatsheetCard({ cheatsheet, index }: Props) {
  return (
    <Link
      href={`/cheatsheets/${cheatsheet.slug}`}
      className={`card-cell group block p-8 animate-fade-up ${DELAYS[index] ?? ""}`}
    >
      {/* Category badge */}
      <span className="inline-block text-[10px] uppercase tracking-[0.22em] text-gold-dark
                       border border-gold/40 px-2.5 py-1 mb-4">
        {cheatsheet.category}
      </span>

      <h2 className="font-display text-[22px] font-bold text-ink tracking-[-0.01em]
                     mb-3 group-hover:text-gold-dark transition-colors duration-200">
        {cheatsheet.title}
      </h2>

      <p className="text-[11px] text-ink-faint leading-relaxed tracking-[0.02em] line-clamp-3">
        {cheatsheet.description || "Quick-reference cheatsheet — open to explore."}
      </p>

      {/* Arrow */}
      <span className="absolute top-5 right-5 text-base text-warm-border-dark
                       group-hover:translate-x-0.75 group-hover:-translate-y-0.75
                       group-hover:text-gold transition-all duration-200">
        ↗
      </span>

      {/* Gold underline */}
      <div className="mt-6 h-px w-8 bg-gold opacity-40 group-hover:opacity-100
                      group-hover:w-16 transition-all duration-300" />
    </Link>
  );
}
