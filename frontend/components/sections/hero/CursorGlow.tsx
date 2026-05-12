"use client";

import { useEffect, useState } from "react";
import { MotionValue, motion, useTransform } from "framer-motion";

interface CursorGlowProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export function CursorGlow({ mouseX, mouseY }: CursorGlowProps) {
  // BUG FIX: Reading window.innerWidth/Height inside useTransform callbacks
  // is unsafe at render time during SSR. We capture dimensions after mount.
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // useTransform callbacks only fire on the client when motion values change,
  // but dims.w/h are captured via closure — safe after mount.
  const glowX = useTransform(mouseX, (v) => v * dims.w * 0.22);
  const glowY = useTransform(mouseY, (v) => v * dims.h * 0.22);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-gold/6 blur-[130px] pointer-events-none z-0"
      style={{ x: glowX, y: glowY, translateX: "-50%", translateY: "-50%" }}
    />
  );
}
