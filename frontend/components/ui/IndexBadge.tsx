interface IndexBadgeProps {
  index: number;
  className?: string;
}

export default function IndexBadge({
  index,
  className = "",
}: IndexBadgeProps) {
  return (
    <span
      className={`text-[12px] tracking-[0.2em] text-gold opacity-80 ${className}`}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}