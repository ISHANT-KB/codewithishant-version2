"use client";

import { useEffect } from "react";
import { motion, useAnimation, useTransform } from "framer-motion";
import Eyebrow from "@/components/ui/Eyebrow";

import { useMouseParallax } from "@/hooks/useMouseParallax";
import { AnimatedCounter } from "./hero/AnimatedCounter";
import { Particles } from "./hero/Particles";
import { FloatingOrbs } from "./hero/FloatingOrbs";
import { CursorGlow } from "./hero/CursorGlow";
import { DotGrid } from "./hero/DotGrid";
import { AmbientGlow } from "./hero/AmbientGlow";
import {
  containerVariants,
  fadeInVariants,
  itemVariants,
  watermarkVariants,
} from "./hero/variants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface HeroSectionProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  count?: number;
  countLabel?: string;
  watermark?: string;
  shimmer?: boolean;
  particleCount?: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HeroSection({
  eyebrow,
  title,
  subtitle,
  count,
  countLabel = "topic",
  watermark = "LEARN",
  shimmer = true,
  particleCount = 18,
}: HeroSectionProps) {
  const controls = useAnimation();
  const { x: mouseX, y: mouseY } = useMouseParallax();

  // 3D tilt — these are correctly placed in the component body
  const rotateX = useTransform(mouseY, (v) => v * -6);
  const rotateY = useTransform(mouseX, (v) => v * 6);

  // BUG FIX: Watermark parallax transforms were previously called inside JSX
  // (inside the style prop directly), which violates React's Rules of Hooks.
  // They must be called unconditionally at the top level of the component.
  const watermarkX = useTransform(mouseX, (v) => v * -12);
  const watermarkY = useTransform(mouseY, (v) => v * -12);

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <section
      className="relative overflow-hidden px-16 pt-20 pb-16 border-b border-warm-border"
      style={{ perspective: "1200px" }}
    >
      {/* Shimmer keyframes — injected once */}
      {shimmer && (
        <style>{`
          @keyframes textShimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          .shimmer-wrap .text-gold {
            background: linear-gradient(
              90deg,
              currentColor 0%,
              rgba(255, 255, 255, 0.80) 48%,
              currentColor 100%
            );
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: textShimmer 3.8s linear infinite;
          }
        `}</style>
      )}

      {/* ── Background layers ── */}
      <DotGrid />
      <Particles count={particleCount} />
      <FloatingOrbs mouseX={mouseX} mouseY={mouseY} />
      <CursorGlow mouseX={mouseX} mouseY={mouseY} />

      {/* ── Watermark ──
          BUG FIX: useTransform is now called above (watermarkX / watermarkY)
          instead of inline in this style prop — the old code broke Rules of Hooks. */}
      <motion.span
        className="watermark hidden lg:block text-ink z-0 select-none pointer-events-none"
        style={{ x: watermarkX, y: watermarkY }}
        variants={watermarkVariants}
        initial="hidden"
        animate={controls}
      >
        {watermark}
      </motion.span>

      {/* ── Levitating content with 3-D tilt ── */}
      <motion.div
        className="relative z-10"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </motion.div>

          {/* Title */}
          <div className="relative inline-block">
            <AmbientGlow />
            <motion.h1
              variants={itemVariants}
              className={[
                "font-display text-[clamp(40px,6vw,72px)] font-bold text-ink",
                "leading-[1.05] tracking-[-0.03em] max-w-xl mt-4",
                shimmer ? "shimmer-wrap" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {title}
            </motion.h1>
          </div>

          {/* Animated underline */}
          <motion.div
            className="h-0.5 bg-gold mt-6 origin-left rounded-full"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.95, ease: [0.215, 0.61, 0.355, 1] }}
            style={{ width: "80px" }}
          />

          {/* Subtitle / Counter */}
          {(subtitle || typeof count === "number") && (
            <motion.p
              variants={fadeInVariants}
              className="mt-5 text-[12px] text-ink-faint tracking-wider"
            >
              {subtitle}
              {typeof count === "number" && (
                <>
                  {subtitle && " · "}
                  <AnimatedCounter target={count} label={countLabel} />
                </>
              )}
            </motion.p>
          )}
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
      >
        <span className="text-[10px] tracking-[0.22em] uppercase text-ink-muted">
          Scroll
        </span>
        <motion.div
          className="w-px h-6 bg-ink-muted/40 rounded-full"
          animate={{ scaleY: [1, 0.35, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
