import BubbleSortVisualizer from "./BubbleSortVisualizer";

export default function BubbleSortPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">Sorting</p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Bubble Sort</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
          Bubble sort repeatedly compares neighbors and swaps them when out of order. Largest
          value moves to the end on each pass.
        </p>
      </div>

      <BubbleSortVisualizer />
    </div>
  );
}
