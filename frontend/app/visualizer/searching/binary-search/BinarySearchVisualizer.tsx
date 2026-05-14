"use client";

import { useEffect, useMemo, useState } from "react";

interface BinaryStep {
  low: number;
  high: number;
  mid: number;
  found: boolean;
  done: boolean;
  message: string;
}

const ITEM_COUNT = 24;
const PLAYBACK_MULTIPLIER = 5;

function makeSortedValues() {
  const base = Array.from({ length: ITEM_COUNT }, () => 5 + Math.floor(Math.random() * 95));
  return base.sort((a, b) => a - b);
}

function buildBinarySteps(values: number[], target: number): BinaryStep[] {
  const steps: BinaryStep[] = [];
  let low = 0;
  let high = values.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midValue = values[mid];

    if (midValue === target) {
      steps.push({
        low,
        high,
        mid,
        found: true,
        done: true,
        message: `Found ${target} at index ${mid}`,
      });
      return steps;
    }

    if (midValue < target) {
      steps.push({
        low,
        high,
        mid,
        found: false,
        done: false,
        message: `${midValue} < ${target}, move right`,
      });
      low = mid + 1;
    } else {
      steps.push({
        low,
        high,
        mid,
        found: false,
        done: false,
        message: `${midValue} > ${target}, move left`,
      });
      high = mid - 1;
    }
  }

  steps.push({
    low,
    high,
    mid: -1,
    found: false,
    done: true,
    message: `${target} not present`,
  });
  return steps;
}

export default function BinarySearchVisualizer() {
  const [values, setValues] = useState<number[]>(() => makeSortedValues());
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const target = values[selectedTargetIndex] ?? values[0];
  const steps = useMemo(() => buildBinarySteps(values, target), [target, values]);
  const step = steps[stepIndex];
  const atEnd = step.done || stepIndex >= steps.length - 1;
  const autoPlaying = playing && !atEnd;

  useEffect(() => {
    if (!autoPlaying) {
      return;
    }
    const timer = window.setTimeout(
      () => setStepIndex((prev) => prev + 1),
      Math.max(30, Math.floor(speed * PLAYBACK_MULTIPLIER)),
    );
    return () => window.clearTimeout(timer);
  }, [autoPlaying, speed]);

  function chooseTarget(index: number) {
    setSelectedTargetIndex(index);
    setStepIndex(0);
    setPlaying(false);
  }

  function togglePlay() {
    if (autoPlaying) {
      setPlaying(false);
      return;
    }
    if (atEnd) {
      setStepIndex(0);
    }
    setPlaying(true);
  }

  return (
    <section className="space-y-6 rounded-2xl border border-warm-border bg-stone-50 p-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="nb-top-fill relative overflow-hidden border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-parchment"
        >
          <span className="relative z-10">{autoPlaying ? "Pause" : "Play"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
          }}
          className="border border-warm-border-dark px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted hover:bg-parchment-hover"
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => {
            const next = (selectedTargetIndex + 1) % values.length;
            chooseTarget(next);
          }}
          className="border border-warm-border-dark px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted hover:bg-parchment-hover"
        >
          Next Target
        </button>
        <button
          type="button"
          onClick={() => {
            setValues(makeSortedValues());
            chooseTarget(0);
          }}
          className="border border-warm-border-dark px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted hover:bg-parchment-hover"
        >
          New Array
        </button>

        <label className="ml-auto flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          Speed
          <input
            type="range"
            min={160}
            max={900}
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
        </label>
      </div>

      <div
        className="grid gap-2 rounded-xl border border-warm-border bg-white p-4"
        style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}
      >
        {values.map((value, index) => {
          const inRange = index >= step.low && index <= step.high;
          const isMid = index === step.mid;
          const isTarget = index === selectedTargetIndex;
          const isFound = step.found && isMid;
          const tone = isFound
            ? "border-ink bg-ink text-parchment"
            : isMid
              ? "border-gold-dark bg-gold-bright text-ink"
              : isTarget
                ? "border-gold-dark text-gold-dark"
                : inRange
                  ? "border-warm-border-dark text-ink"
                  : "border-warm-border text-ink-faint";

          return (
            <button
              key={`${index}-${value}`}
              type="button"
              className={`rounded-md border px-1 py-3 text-center text-xs transition-colors ${tone}`}
              onClick={() => chooseTarget(index)}
            >
              <div className="font-semibold">{value}</div>
              <div className="mt-1 text-[10px]">{index}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-border pt-4">
        <div>
          <p className="text-sm text-ink-muted">{step.message}</p>
          <p className="text-[11px] tracking-widest text-ink-faint">Target: {target}</p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          Step {stepIndex + 1} / {steps.length}
        </p>
      </div>
    </section>
  );
}
