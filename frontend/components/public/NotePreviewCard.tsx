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
      className="group relative block overflow-hidden bg-[#faf8f3] px-6 py-7 no-underline transition hover:bg-[#f5f1e8]"
    >
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#c8a96e] transition-all duration-300 group-hover:w-full" />

      <span className="mb-3 block text-[9px] tracking-[0.2em] text-[#c8a96e]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mb-3 pr-8 font-[family:var(--font-display)] text-[18px] font-bold tracking-[-0.01em] text-[#1a1a18] transition group-hover:text-[#8a6830]">
        {note.title}
      </h3>
      <div className="pr-8 text-[11px] leading-[1.7] tracking-[0.02em] text-[#9b9590]">
        <MarkdownRenderer content={note.content} className="[&_p]:m-0" />
      </div>
      <span className="absolute right-5 top-5 text-sm text-[#d8d3c8] transition group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-[#c8a96e]">
        ↗
      </span>
    </Link>
  );
}
