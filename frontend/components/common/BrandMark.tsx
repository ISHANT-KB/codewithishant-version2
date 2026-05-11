import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  href?: string;
}

export default function BrandMark({
  className,
  href = "/",
}: BrandMarkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-baseline gap-px font-[family:var(--font-display)] text-[22px] font-bold tracking-[-0.02em] text-[#1a1a18] transition hover:opacity-75",
        className,
      )}
    >
      <span>Ishant</span>
      <span className="text-[20px] font-normal italic text-[#c8a96e]">
        Learn
      </span>
    </Link>
  );
}
