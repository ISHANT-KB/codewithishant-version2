import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PublicShellProps {
  children: ReactNode;
  className?: string;
}

export default function PublicShell({
  children,
  className,
}: PublicShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-parchment font-(--font-public-mono) text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}
