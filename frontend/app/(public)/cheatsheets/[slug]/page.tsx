import { getCheatsheet } from "@/lib/api";
import { Cheatsheet } from "@/types/cheatsheet";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionDivider from "@/components/ui/SectionDivider";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const sheet: Cheatsheet = await getCheatsheet(slug);
    return {
      title: `${sheet.title} — IshantLearn`,
      description:
        sheet.description ??
        `Quick-reference cheatsheet for ${sheet.category}.`,
    };
  } catch {
    return { title: "Cheatsheet — IshantLearn" };
  }
}

export default async function CheatsheetDetailPage({ params }: Props) {
  const { slug } = await params;
  const sheet: Cheatsheet = await getCheatsheet(slug);

  return (
    <div className="bg-parchment min-h-screen">
      <main className="px-6 py-10 md:px-16 md:py-14">
        {/* Back link */}
        <Link
          href="/cheatsheets"
          className="inline-flex items-center gap-2 text-[11px] text-ink-faint
                     hover:text-gold transition-colors mb-8 group"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          Back to Cheatsheets
        </Link>

        {/* Header */}
        <header className="animate-fade-up">
          <Eyebrow>IshantLearn — {sheet.category}</Eyebrow>
          <h1
            className="font-display text-[clamp(32px,4vw,56px)] font-bold text-ink
                       leading-[1.1] tracking-[-0.03em] mt-2"
          >
            {sheet.title}
          </h1>

          {sheet.description && (
            <p className="mt-4 max-w-2xl text-sm text-ink-muted leading-relaxed">
              {sheet.description}
            </p>
          )}

          {/* Category & slug badge row */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <span
              className="inline-block text-[10px] uppercase tracking-[0.22em] text-gold-dark
                         border border-gold/40 px-2.5 py-1"
            >
              {sheet.category}
            </span>
            <span
              className="px-2 py-1 bg-warm-border/30 border border-warm-border
                         text-[10px] text-ink-faint tracking-wider uppercase"
            >
              /{sheet.slug}
            </span>
          </div>
        </header>

        <SectionDivider className="my-10" />

        {/* Content */}
        <article className="animate-fade-up delay-100 max-w-3xl">
          <MarkdownRenderer content={sheet.content} />
        </article>
      </main>
    </div>
  );
}
