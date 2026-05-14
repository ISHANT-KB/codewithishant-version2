import { getNote, getTopics } from "@/lib/api";
import Sidebar from "@/components/layout/Sidebar";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionDivider from "@/components/ui/SectionDivider";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  const [note, topics] = await Promise.all([getNote(noteId), getTopics()]);


  return (
    <div className="flex min-h-screen bg-parchment">
      <Sidebar topics={topics} currentSlug={""} />

      <main className="flex-1 min-w-0 px-8 py-10 md:px-16 md:py-14">
        <Link 
          href="/notes"
          className="inline-flex items-center gap-2 text-[11px] text-ink-faint hover:text-gold transition-colors mb-8 group"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          Back to Index
        </Link>

        <header className="animate-fade-up">
          <Eyebrow>Note Entry</Eyebrow>
          <h1 className="font-display text-[clamp(32px,4vw,56px)] font-bold text-ink
                         leading-[1.1] tracking-[-0.03em] mt-2">
            {note.title}
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="px-2 py-1 bg-warm-border/30 border border-warm-border text-[10px] text-ink-faint tracking-wider uppercase">
              ID: {noteId.slice(0, 8)}
            </div>
          </div>

        </header>

        <SectionDivider className="my-10" />

        <article className="animate-fade-up delay-100 max-w-3xl">
          <MarkdownRenderer content={note.content} />
        </article>
      </main>
    </div>
  );
}
