"use client";

import { useEffect, useState } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";

interface AnimatedCounterProps {
  target: number;
  label: string;
}

export function AnimatedCounter({ target, label }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();

  useEffect(() => {
    if (!inView) return;

    const duration = 1500;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, target]);

  const plural = target !== 1 ? "s" : "";

  return (
    <span ref={ref}>
      {count} {label}{plural} available
    </span>
  );
}
