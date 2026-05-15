import { getTopicFull } from "@/lib/api";
import { Note } from "@/types/note";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionDivider from "@/components/ui/SectionDivider";
import EmptyState from "@/components/ui/EmptyState";
import NoteCard from "@/components/features/notes/NoteCard";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getTopicFull(slug);
  const topic = data.topic;
  const notes: Note[] = data.notes;

  return (
    <div className="bg-parchment">
      <main className="px-6 py-14 md:px-16 md:py-14">

        {/* Topic header */}
        <Eyebrow>Topic</Eyebrow>
        <h1 className="font-display text-[clamp(32px,4vw,56px)] font-bold text-ink
                       leading-[1.05] tracking-[-0.03em] animate-fade-up">
          {topic.name}
        </h1>
        <p className="mt-3.5 text-[12px] text-ink-faint tracking-[0.04em] leading-relaxed
                      max-w-lg animate-fade-up delay-50">
          {topic.description || "No description available."}
        </p>

        <SectionDivider className="my-10" />

        {/* Notes */}
        <div className="flex items-baseline gap-4 mb-7">
          <h2 className="font-display text-[22px] font-bold text-ink tracking-[-0.02em]">
            Notes
          </h2>
          <span className="text-[10px] tracking-[0.15em] text-gold">×{notes.length}</span>
        </div>

        {notes.length === 0 ? (
          <EmptyState message="No notes yet." />
        ) : (
          <div className="grid bg-warm-border border border-warm-border gap-px
                          grid-cols-1 md:grid-cols-2">
            {notes.map((note, i) => (
              <NoteCard key={note.id} note={note} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
