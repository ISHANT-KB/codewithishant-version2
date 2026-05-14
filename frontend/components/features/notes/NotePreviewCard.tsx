import Link from "next/link";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { Note } from "@/types/note";

interface NotePreviewCardProps {
  index: number;
  note: Note;
}

export default function NotePreviewCard({ index, note }: NotePreviewCardProps) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="group relative block overflow-hidden bg-parchment px-6 py-7 no-underline transition hover:bg-parchment-hover"
    >
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />

      <span className="mb-3 block text-[12px] tracking-[0.2em] text-gold">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mb-3 pr-8 font-(--font-display) text-[18px] tracking-[-0.01em] text-ink transition group-hover:text-gold-dark">
        {note.title}
      </h3>
      <div className="pr-8 text-[11px] leading-[1.7] tracking-[0.02em] text-ink-faint">
        <MarkdownRenderer content={note.content} className="[&_p]:m-0" />
      </div>
      <span className="absolute right-5 top-5 text-sm text-warm-border-dark transition group-hover:translate-x-0.75 group-hover:-translate-y-0.75 group-hover:text-gold">
        ↗
      </span>
    </Link>
  );
}
