import { getTopics } from "@/lib/api";
import { Topic } from "@/types/topic";
import Eyebrow from "@/components/ui/Eyebrow";
// import SectionRule from "@/components/ui/SectionRule";
import EmptyState from "@/components/ui/EmptyState";
import TopicCard from "@/components/topics/TopicCard";

export default async function Home() {
  const topics: Topic[] = await getTopics();

  return (
    <div className="min-h-screen bg-parchment">

      {/* Hero */}
      <section className="relative overflow-hidden px-16 pt-20 pb-14 border-b border-warm-border">
        <span className="watermark hidden lg:block">LEARN</span>
        <Eyebrow>IshantLearn — Knowledge Base</Eyebrow>
        <h1 className="font-display text-[clamp(40px,6vw,72px)] font-bold text-ink
                       leading-[1.05] tracking-[-0.03em] max-w-xl animate-fade-up">
          Explore<br /><em className="text-gold not-italic">Topics</em>
        </h1>
        <p className="mt-5 text-[12px] text-ink-faint tracking-wider animate-fade-up delay-100">
          {topics.length} topic{topics.length !== 1 ? "s" : ""} available
        </p>
      </section>

      {/* Grid */}
      <section className="px-16 pt-14 pb-20">
        <div className="flex items-baseline gap-4 mb-9">
          <span className="text-[11px] tracking-[0.25em] uppercase text-ink-muted">All Topics</span>
          <span className="text-[11px] text-gold">×{topics.length}</span>
          <div className="flex-1 h-px bg-warm-border" />
        </div>

        {topics.length === 0 ? (
          <EmptyState message="No topics yet — check back soon." />
        ) : (
          <div className="grid auto-rows-fr bg-warm-border border border-warm-border gap-px
                          grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, i) => (
              <TopicCard key={topic.id} topic={topic} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}