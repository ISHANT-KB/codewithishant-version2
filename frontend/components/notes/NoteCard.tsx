import Link from "next/link";
import { Note } from "@/types/note";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import IndexBadge from "@/components/ui/IndexBadge";

interface Props {
  note: Note;
  index: number;
}

const DELAYS = ["delay-50","delay-100","delay-150","delay-200","delay-250","delay-300"];

export default function NoteCard({ note, index }: Props) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className={`card-cell group relative block p-7 animate-fade-up ${DELAYS[index] ?? ""}`}
    >
      <IndexBadge index={index} />
      <h3 className="font-display text-lg font-bold text-ink tracking-[-0.01em]
                     mt-3 mb-3 group-hover:text-gold-dark transition-colors duration-200">
        {note.title}
      </h3>
      <div className="text-[11px] text-ink-faint leading-relaxed
                      line-clamp-3 tracking-[0.02em]">
        <MarkdownRenderer content={note.content} truncate={true} />
      </div>

      <span className="absolute top-5 right-5 text-sm text-warm-border-dark
                       group-hover:translate-x-[3px] group-hover:-translate-y-[3px]
                       group-hover:text-gold transition-all duration-200">
        ↗
      </span>
    </Link>
  );
}
