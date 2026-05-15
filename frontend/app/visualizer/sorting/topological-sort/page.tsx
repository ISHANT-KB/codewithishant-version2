import TopologicalSortVisualizer from "./TopologicalSortVisualizer";

export default function TopologicalSortPage() {
  return (
    <div className="min-h-screen bg-parchment">
      <header className="flex flex-wrap items-end justify-between gap-6 px-6 md:px-16 pt-16">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Graph Algorithms
          </p>
          <h1
            className="font-display text-[clamp(36px,5vw,64px)] font-bold text-ink
                         leading-none tracking-[-0.03em]"
          >
            Topological
            <br />
            <em className="text-gold not-italic">Sort</em>
          </h1>
        </div>
        <div
          className="mb-1.5 border border-warm-border px-4 py-2
                        text-[11px] tracking-[0.15em] text-ink-faint whitespace-nowrap"
        >
          DAG · DFS · O(V+E)
        </div>
      </header>

      <div className="mx-6 md:mx-16 mt-8 h-px bg-warm-border" />

      <div className="px-6 md:px-16 pb-20 pt-10">
        <p className="max-w-2xl text-sm leading-relaxed text-ink-muted mb-10">
          Topological sort orders the nodes of a directed acyclic graph such that
          for every edge u → v, node u comes before v. The visualizer uses DFS with
          cycle detection, highlighting the call stack, active edges, and finish times.
        </p>

        <TopologicalSortVisualizer />
      </div>
    </div>
  );
}