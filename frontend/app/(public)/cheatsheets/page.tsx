import { getCheatsheets } from "@/lib/api";
import { Cheatsheet } from "@/types/cheatsheet";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionDivider from "@/components/ui/SectionDivider";
import EmptyState from "@/components/ui/EmptyState";
import CheatsheetCard from "@/components/features/cheatsheets/CheatsheetCard";

export const metadata = {
  title: "Cheatsheets — IshantLearn",
  description:
    "Quick-reference cheatsheets for Git, Linux, SQL, React, and more. Built for fast revision.",
};

export default async function CheatsheetsPage() {
  let cheatsheets: Cheatsheet[] = [];
  try {
    cheatsheets = await getCheatsheets();
  } catch (error) {
    console.error("Failed to fetch cheatsheets:", error);
  }

  // Collect unique categories for the filter strip
  const categories = Array.from(new Set(cheatsheets.map((c) => c.category)));

  return (
    <div className="min-h-screen bg-parchment">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 px-6 md:px-16 pt-16">
        <div>
          <Eyebrow>IshantLearn — Revision</Eyebrow>
          <h1
            className="font-display text-[clamp(36px,5vw,64px)] font-bold text-ink
                       leading-none tracking-[-0.03em] animate-fade-up"
          >
            Cheat
            <br />
            <em className="text-gold not-italic">Sheets</em>
          </h1>
        </div>
        <div
          className="mb-1.5 border border-warm-border px-4 py-2
                     text-[11px] tracking-[0.15em] text-ink-faint whitespace-nowrap
                     animate-fade-up delay-100"
        >
          {String(cheatsheets.length).padStart(2, "0")} sheets
        </div>
      </header>

      <SectionDivider className="mx-6 md:mx-16 mt-8" />

      {/* Category strip */}
      {categories.length > 0 && (
        <div className="px-6 md:px-16 mt-6 flex flex-wrap gap-2 animate-fade-up delay-150">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-[10px] uppercase tracking-[0.2em] border border-warm-border
                         px-3 py-1 text-ink-muted"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="px-6 md:px-16 pb-20 mt-10">
        {cheatsheets.length === 0 ? (
          <EmptyState message="No cheatsheets yet — check back soon." />
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px
                       border border-warm-border bg-warm-border"
          >
            {cheatsheets.map((sheet, index) => (
              <CheatsheetCard key={sheet.id} cheatsheet={sheet} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
