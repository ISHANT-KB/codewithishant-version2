import MergeSortVisualizer from "@/components/visualizer/sorting/MergeSortVisualizer";

export default function MergeSortPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">Sorting</p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Merge Sort</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
          Merge sort splits array into halves, sorts each half, then merges both sorted halves.
          Visualizer highlights active range being merged.
        </p>
      </div>

      <MergeSortVisualizer />
    </div>
  );
}
