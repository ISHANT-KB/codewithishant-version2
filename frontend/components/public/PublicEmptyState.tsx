import { cn } from "@/lib/utils";

interface PublicEmptyStateProps {
  message: string;
  className?: string;
}

export default function PublicEmptyState({
  message,
  className,
}: PublicEmptyStateProps) {
  return (
    <div
      className={cn(
        "border border-warm-border px-6 py-20 text-center text-[11px] uppercase tracking-[0.2em] text-ink-ghost",
        className,
      )}
    >
      {message}
    </div>
  );
}
