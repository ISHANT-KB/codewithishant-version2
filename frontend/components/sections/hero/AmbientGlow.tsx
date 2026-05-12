"use client";

import { motion } from "framer-motion";

export function AmbientGlow() {
  return (
    <motion.div
      className="absolute -left-12 top-1/2 -translate-y-1/2 w-[540px] h-[260px] rounded-full bg-gold/10 blur-[100px] pointer-events-none z-0"
      animate={{
        scale: [1, 1.35, 1],
        opacity: [0.22, 0.48, 0.22],
      }}
      transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
