import Eyebrow from "@/components/ui/Eyebrow";
import SectionRule from "@/components/ui/SectionRule";
import EmptyState from "@/components/ui/EmptyState";
import { getNotes } from "@/lib/api";
import NoteCard from "@/components/notes/NoteCard";
import { Note } from "@/types/note";

export default async function NotesPage() {
  let notes: Note[] = [];
  try {
    notes = await getNotes();
  } catch (error) {
    console.error("Failed to fetch notes:", error);
  }

  return (
    <div className="min-h-screen bg-parchment">
      <header className="flex flex-wrap items-end justify-between gap-6 px-16 pt-16">
        <div>
          <Eyebrow>IshantLearn — Index</Eyebrow>
          <h1
            className="font-display text-[clamp(36px,5vw,64px)] font-bold text-ink
                         leading-none tracking-[-0.03em] animate-fade-up"
          >
            All
            <br />
            <em className="text-gold not-italic">Notes</em>
          </h1>
        </div>
        <div
          className="mb-1.5 border border-warm-border px-4 py-2
                        text-[11px] tracking-[0.15em] text-ink-faint whitespace-nowrap
                        animate-fade-up delay-100"
        >
          {notes.length.toString().padStart(2, "0")} notes
        </div>
      </header>
      <SectionRule className="mx-16 mt-8" />
      <div className="px-16 pb-20">
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-l border-t border-warm-border mt-10">
            {notes.map((note, index) => (
              <NoteCard key={note.id} note={note} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState message="No notes yet." />
          </div>
        )}
      </div>
    </div>
  );
}
