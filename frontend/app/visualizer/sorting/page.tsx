import { algorithmRegistry } from "@/lib/algorithms";
import { VisualizerCard } from "../_components/VisualizerCard";

export default function SortingVisualizersPage() {
  const algorithms = algorithmRegistry.filter((algorithm) => algorithm.category === "sorting");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-2 border-b border-warm-border pb-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">Visualizer</p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Sorting Algorithms</h1>
      </section>

      <section className="grid auto-rows-fr gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {algorithms.map((algorithm) => (
          <VisualizerCard key={algorithm.id} algorithm={algorithm} />
        ))}
      </section>
    </div>
  );
}
