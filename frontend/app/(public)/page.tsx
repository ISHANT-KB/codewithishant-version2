import Link from "next/link";
import HeroSection from "@/components/sections/HeroSection";
import EmptyState from "@/components/ui/EmptyState";
import TopicCard from "@/components/features/topics/TopicCard";
import { algorithmRegistry } from "@/lib/algorithms";
import { getTopics } from "@/lib/api";
import { Topic } from "@/types/topic";

export default async function Home() {
  const topics: Topic[] = await getTopics();
  const featuredVisualizers = algorithmRegistry.slice(0, 3);

  return (
    <div className="min-h-screen bg-parchment">
      <HeroSection
        eyebrow="IshantLearn - Knowledge Base"
        title={
          <>
            Explore
            <br />
            <em className="text-gold not-italic">Topics</em>
          </>
        }
        count={topics.length}
      />

      <section className="px-6 pb-16 pt-12 sm:px-10 md:px-16">
        <div className="mb-9 flex items-baseline gap-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">All Topics</span>
          <span className="text-[11px] text-gold">x{topics.length}</span>
          <div className="h-px flex-1 bg-warm-border" />
        </div>

        {topics.length === 0 ? (
          <EmptyState message="No topics yet - check back soon." />
        ) : (
          <div className="grid auto-rows-fr grid-cols-1 gap-px border border-warm-border bg-warm-border md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <TopicCard key={topic.id} topic={topic} index={index} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-warm-border px-6 pb-20 pt-12 sm:px-10 md:px-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-muted">Visualizer Lab</p>
            <h2 className="mt-2 font-display text-4xl tracking-tight text-ink">Learn by Seeing</h2>
          </div>
          <Link
            href="/visualizer"
            className="nb-top-fill relative overflow-hidden border border-ink px-6 py-2 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-parchment"
          >
            <span className="relative z-10">Open Visualizers</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-px border border-warm-border bg-warm-border md:grid-cols-3">
          {featuredVisualizers.map((algorithm) => (
            <Link key={algorithm.id} href={algorithm.route} className="card-cell p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold-dark">{algorithm.complexity}</p>
              <h3 className="mt-3 font-display text-3xl text-ink">{algorithm.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{algorithm.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
