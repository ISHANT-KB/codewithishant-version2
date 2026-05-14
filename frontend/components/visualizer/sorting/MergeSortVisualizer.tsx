"use client";

import { useEffect, useMemo, useState } from "react";

interface MergeStep {
  values: number[];
  activeRange: [number, number] | null;
  message: string;
}

const ITEM_COUNT = 18;
const PLAYBACK_MULTIPLIER = 0.5;

function makeRandomValues() {
  return Array.from({ length: ITEM_COUNT }, () => 10 + Math.floor(Math.random() * 75));
}

function buildMergeSteps(initial: number[]) {
  const values = [...initial];
  const steps: MergeStep[] = [
    { values: [...values], activeRange: null, message: "Initial array" },
  ];

  function merge(left: number, mid: number, right: number) {
    const leftSlice = values.slice(left, mid + 1);
    const rightSlice = values.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftSlice.length && j < rightSlice.length) {
      if (leftSlice[i] <= rightSlice[j]) {
        values[k] = leftSlice[i];
        i += 1;
      } else {
        values[k] = rightSlice[j];
        j += 1;
      }

      steps.push({
        values: [...values],
        activeRange: [left, right],
        message: `Merge range [${left}, ${right}]`,
      });
      k += 1;
    }

    while (i < leftSlice.length) {
      values[k] = leftSlice[i];
      i += 1;
      k += 1;
      steps.push({
        values: [...values],
        activeRange: [left, right],
        message: `Write remaining left side in [${left}, ${right}]`,
      });
    }

    while (j < rightSlice.length) {
      values[k] = rightSlice[j];
      j += 1;
      k += 1;
      steps.push({
        values: [...values],
        activeRange: [left, right],
        message: `Write remaining right side in [${left}, ${right}]`,
      });
    }
  }

  function sort(left: number, right: number) {
    if (left >= right) {
      return;
    }

    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, values.length - 1);
  steps.push({ values: [...values], activeRange: null, message: "Done" });
  return steps;
}

export default function MergeSortVisualizer() {
  const [baseValues, setBaseValues] = useState<number[]>(() => makeRandomValues());
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(320);

  const steps = useMemo(() => buildMergeSteps(baseValues), [baseValues]);
  const step = steps[stepIndex];
  const maxValue = Math.max(...step.values, 1);
  const atEnd = stepIndex >= steps.length - 1;
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
            setPlaying(false);
            setStepIndex(0);
            setBaseValues(makeRandomValues());
          }}
          className="border border-warm-border-dark px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted hover:bg-parchment-hover"
        >
          New Data
        </button>

        <label className="ml-auto flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          Speed
          <input
            type="range"
            min={100}
            max={800}
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
          />
        </label>
      </div>

      <div
        className="grid min-h-72 items-end gap-1 rounded-xl border border-warm-border bg-white p-3"
        style={{ gridTemplateColumns: `repeat(${step.values.length}, minmax(0, 1fr))` }}
      >
        {step.values.map((value, index) => {
          const isActive =
            step.activeRange !== null && index >= step.activeRange[0] && index <= step.activeRange[1];
          return (
            <div key={`${index}-${value}`} className="flex flex-col items-center justify-end">
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${
                  isActive ? "bg-gold-bright" : "bg-gold-dark/75"
                }`}
                style={{ height: `${Math.max(8, (value / maxValue) * 220)}px` }}
              />
              <span className="mt-1 text-[9px] text-ink-faint">{value}</span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-border pt-4">
        <p className="text-sm text-ink-muted">{step.message}</p>
        <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          Step {stepIndex + 1} / {steps.length}
        </p>
      </div>
    </section>
  );
}
