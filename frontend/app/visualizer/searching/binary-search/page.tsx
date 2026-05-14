import BinarySearchVisualizer from "@/components/visualizer/searching/BinarySearchVisualizer";

export default function BinarySearchPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">Searching</p>
        <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">Binary Search</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
          Binary search works on sorted array. At each step it checks middle value and keeps only
          the half that can still contain target.
        </p>
      </div>

      <BinarySearchVisualizer />
    </div>
  );
}
