import { cn } from "@/lib/utils";
import { UI_TEXT } from "@/constants";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export default function EmptyState({
  message = UI_TEXT.EMPTY_STATE_DEFAULT,
  className,
}: EmptyStateProps) {
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
