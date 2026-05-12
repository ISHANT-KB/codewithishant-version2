"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  opacity: number;
}

interface ParticlesProps {
  count?: number;
}

export function Particles({ count = 18 }: ParticlesProps) {
  // BUG FIX: useMemo with window access causes SSR/hydration mismatch.
  // We mount particles only after the component mounts on the client.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo<Particle[]>(() => {
    if (!mounted) return [];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * 10,
      drift: Math.random() * 70 - 35,
      opacity: Math.random() * 0.45 + 0.15,
    }));
  }, [count, mounted]);

  if (!mounted) return null;

  // BUG FIX: window.innerHeight accessed at render time inside `animate` prop
  // was unsafe for SSR. Captured once after mount instead.
  const travelHeight = window.innerHeight * 0.95;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/60 blur-[1.5px]"
          style={{
            left: `${p.x}%`,
            bottom: "-5%",
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -travelHeight],
            x: [0, p.drift],
            opacity: [0, p.opacity, p.opacity * 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
