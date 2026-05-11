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
        "min-h-screen bg-[#faf8f3] font-[family:var(--font-public-mono)] text-[#1a1a18]",
        className,
      )}
    >
      {children}
    </div>
  );
}
