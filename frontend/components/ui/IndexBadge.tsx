interface IndexBadgeProps {
  index: number;
}

export default function IndexBadge({ index }: IndexBadgeProps) {
  return (
    <span className="text-[9px] tracking-[0.2em] text-gold opacity-80">
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}
