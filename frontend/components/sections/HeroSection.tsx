"use client";

import Eyebrow from "@/components/ui/Eyebrow";
import { AnimatedCounter } from "./hero/AnimatedCounter";

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

export default function HeroSection({
  eyebrow,
  title,
  subtitle,
  count,
  countLabel = "topic",
  watermark = "LEARN",
  shimmer = true,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-16 pt-20 pb-16 border-b border-warm-border bg-linear-to-b from-stone-100 to-stone-50">
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroGlowPulse {
          0%, 100% { opacity: 0.14; transform: scale(1); }
          50% { opacity: 0.24; transform: scale(1.05); }
        }
        @keyframes heroLineGrow {
          from { transform: scaleX(0); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-enter {
          animation: heroFadeUp 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .hero-glow {
          animation: heroGlowPulse 8s ease-in-out infinite;
        }
        .hero-line {
          transform-origin: left;
          animation: heroLineGrow 700ms ease-out 260ms both;
        }
        .shimmer-wrap .text-gold {
          background: linear-gradient(
            90deg,
            currentColor 0%,
            rgba(255, 255, 255, 0.8) 48%,
            currentColor 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: textShimmer 3.8s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-glow absolute -top-20 right-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
      </div>

      <span className="watermark hidden lg:block text-ink/5 z-0 select-none pointer-events-none absolute right-10 top-8 text-8xl font-bold tracking-tight">
        {watermark}
      </span>

      <div className="relative z-10 max-w-4xl hero-enter">
        <Eyebrow>{eyebrow}</Eyebrow>

        <h1
          className={[
            "font-display text-[clamp(40px,6vw,72px)] font-bold text-ink",
            "leading-[1.05] tracking-[-0.03em] max-w-xl mt-4",
            shimmer ? "shimmer-wrap" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {title}
        </h1>

        <div className="hero-line h-0.5 bg-gold mt-6 rounded-full w-20" />

        {(subtitle || typeof count === "number") && (
          <p className="mt-5 text-[12px] text-ink-faint tracking-wider">
            {subtitle}
            {typeof count === "number" && (
              <>
                {subtitle && " - "}
                <AnimatedCounter target={count} label={countLabel} />
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
