"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, MotionValue } from "framer-motion";

interface MouseParallax {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export function useMouseParallax(): MouseParallax {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 110, mass: 0.8 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      rawX.set(nx);
      rawY.set(ny);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [rawX, rawY]);

  return { x, y };
}
