import InsertionSortVisualizer from "./InsertionSortVisualizer";

export default function InsertionSortPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">Sorting</p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Insertion Sort</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
          Insertion sort builds the sorted array one element at a time by taking each element
          and inserting it into its correct position. Visualizer highlights the key being
          inserted and the sorted portion of the array.
        </p>
      </div>

      <InsertionSortVisualizer />
    </div>
  );
}