import Link from "next/link";
import { ArrowRight, ChartColumnIncreasing, Search } from "lucide-react";
import { AlgorithmMeta } from "@/lib/algorithms";

interface VisualizerCardProps {
  algorithm: AlgorithmMeta;
}

export function VisualizerCard({ algorithm }: VisualizerCardProps) {
  const icon =
    algorithm.category === "sorting" ? (
      <ChartColumnIncreasing className="h-5 w-5 text-gold-dark" />
    ) : (
      <Search className="h-5 w-5 text-gold-dark" />
    );

  return (
    <Link
      href={algorithm.route}
      className="card-cell group block border border-warm-border p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-parchment-active">
          {icon}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          {algorithm.complexity}
        </span>
      </div>

      <h3 className="font-display text-2xl tracking-tight text-ink">{algorithm.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{algorithm.summary}</p>

      <div className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-gold-dark transition-transform duration-200 group-hover:translate-x-1">
        Open Visualizer
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
