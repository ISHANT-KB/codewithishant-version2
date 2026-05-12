export function DotGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.10] pointer-events-none z-0 text-ink">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Fade the grid toward the edges for a vignette feel */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-(--color-paper,white) opacity-60" />
    </div>
  );
}
