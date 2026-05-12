"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

interface FloatingOrbsProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function FloatingOrbs({ mouseX, mouseY }: FloatingOrbsProps) {
  // These useTransform calls are correctly in the component body (not in JSX)
  const orb1X = useTransform(mouseX, (v) => v * 45);
  const orb1Y = useTransform(mouseY, (v) => v * 45);
  const orb2X = useTransform(mouseX, (v) => v * -28);
  const orb2Y = useTransform(mouseY, (v) => v * -28);
  const orb3X = useTransform(mouseX, (v) => v * 16);
  const orb3Y = useTransform(mouseY, (v) => v * 16);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gold orb — top right */}
      <motion.div
        className="absolute -top-24 -right-24 w-[560px] h-[560px] rounded-full bg-gold/10 blur-[120px]"
        style={{ x: orb1X, y: orb1Y }}
        animate={{
          scale: [1, 1.14, 0.94, 1],
          rotate: [0, 12, -8, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Warm amber orb — bottom left */}
      <motion.div
        className="absolute -bottom-44 -left-44 w-[480px] h-[480px] rounded-full bg-amber-200/10 blur-[100px]"
        style={{ x: orb2X, y: orb2Y }}
        animate={{
          scale: [1, 0.9, 1.1, 1],
          rotate: [0, -10, 9, 0],
        }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Center subtle orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-warm-border/35 blur-[90px]"
        style={{ x: orb3X, y: orb3Y }}
        animate={{
          scale: [1, 1.28, 1],
          opacity: [0.18, 0.42, 0.18],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
