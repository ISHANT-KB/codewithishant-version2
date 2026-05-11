import { getTopics } from "@/lib/api";
import { Topic } from "@/types/topic";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionRule from "@/components/ui/SectionRule";
import EmptyState from "@/components/ui/EmptyState";
import TopicRow from "@/components/topics/TopicRow";

export default async function TopicsPage() {
  const topics: Topic[] = await getTopics();

  return (
    <div className="min-h-screen bg-parchment">

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 px-16 pt-16">
        <div>
          <Eyebrow>IshantLearn — Index</Eyebrow>
          <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold text-ink
                         leading-none tracking-[-0.03em] animate-fade-up">
            All<br /><em className="text-gold not-italic">Topics</em>
          </h1>
        </div>
        <div className="mb-1.5 border border-warm-border px-4 py-2
                        text-[11px] tracking-[0.15em] text-ink-faint whitespace-nowrap
                        animate-fade-up delay-100">
          {String(topics.length).padStart(2, "0")} topics
        </div>
      </header>

      <SectionRule className="mx-16 mt-8" />

      {/* List */}
      <div className="px-16 pb-20">
        {topics.length === 0 ? (
          <EmptyState message="No topics yet." />
        ) : (
          topics.map((topic, i) => (
            <TopicRow key={topic.id} topic={topic} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
