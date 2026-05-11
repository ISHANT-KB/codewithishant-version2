interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "Nothing here yet." }: EmptyStateProps) {
  return (
    <div className="border border-warm-border py-20 text-center text-[11px] tracking-[0.2em] uppercase text-ink-ghost">
      {message}
    </div>
  );
}
