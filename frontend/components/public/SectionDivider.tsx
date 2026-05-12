import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  accentWidthClassName?: string;
}

export default function SectionDivider({
  className,
  accentWidthClassName = "w-20",
}: SectionDividerProps) {
  return (
    <div className={cn("relative h-px bg-warm-border", className)}>
      <div
        className={cn(
          "absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-gold",
          accentWidthClassName,
        )}
      />
    </div>
  );
}
