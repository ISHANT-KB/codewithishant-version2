import { algorithmRegistry, categories } from "@/lib/algorithms";
import { VisualizerCard } from "./_components/VisualizerCard";
import { Braces, Sparkles } from "lucide-react";

export default function VisualizerHomePage() {
  const algorithmsByCategory = categories.map((category) => ({
    ...category,
    algorithms: algorithmRegistry.filter((algorithm) => algorithm.category === category.id),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="border-b border-warm-border pb-10">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-parchment-active">
          <Braces className="h-6 w-6 text-gold-dark" />
        </div>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Algorithm Visualizer
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">
          Run classic algorithms step-by-step. Play automatically, pause, or move one operation at
          a time to see exact comparisons, swaps, and range updates.
        </p>
      </section>

      <div className="space-y-12 py-10">
        {algorithmsByCategory.map((category) => (
          <section key={category.id} className="space-y-5">
            {category.algorithms.length > 0 && (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl tracking-tight text-ink">{category.label}</h2>
                    <p className="mt-1 text-sm text-ink-muted">{category.description}</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                    {category.algorithms.length} visualizer
                  </span>
                </div>

                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.algorithms.map((algorithm) => (
                    <VisualizerCard key={algorithm.id} algorithm={algorithm} />
                  ))}
                </div>
              </>
            )}
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-warm-border bg-stone-50 p-7 text-center">
        <Sparkles className="mx-auto mb-3 h-5 w-5 text-gold-dark" />
        <h3 className="font-display text-2xl text-ink">More Visualizers Coming</h3>
        <p className="mt-2 text-sm text-ink-muted">
          Plan: graph traversal, dynamic programming, and tree balancing visualizers.
        </p>
      </section>
    </div>
  );
}
