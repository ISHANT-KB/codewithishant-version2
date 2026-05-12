import { getTopics } from "@/lib/api";
import { Topic } from "@/types/topic";
import HeroSection from "@/components/sections/HeroSection";
import EmptyState from "@/components/ui/EmptyState";
import TopicCard from "@/components/topics/TopicCard";

export default async function Home() {
  const topics: Topic[] = await getTopics();

  return (
    <div className="min-h-screen bg-parchment">
      {/* Animated Hero */}
      <HeroSection
        eyebrow="IshantLearn — Knowledge Base"
        title={
          <>
            Explore
            <br />
            <em className="text-gold not-italic">Topics</em>
          </>
        }
        count={topics.length}
      />

      {/* Grid */}
      <section className="px-16 pt-14 pb-20">
        <div className="flex items-baseline gap-4 mb-9">
          <span className="text-[11px] tracking-[0.25em] uppercase text-ink-muted">
            All Topics
          </span>
          <span className="text-[11px] text-gold">×{topics.length}</span>
          <div className="flex-1 h-px bg-warm-border" />
        </div>

        {topics.length === 0 ? (
          <EmptyState message="No topics yet — check back soon." />
        ) : (
          <div
            className="grid auto-rows-fr bg-warm-border border border-warm-border gap-px
                       grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {topics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}