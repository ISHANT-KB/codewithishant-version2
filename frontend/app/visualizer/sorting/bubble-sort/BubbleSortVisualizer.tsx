"use client";

import { useEffect, useMemo, useState } from "react";

interface BubbleStep {
  values: number[];
  active: number[];
  sortedFrom: number;
  message: string;
}

const ITEM_COUNT = 20;
const PLAYBACK_MULTIPLIER = 0.5;

function makeRandomValues() {
  return Array.from({ length: ITEM_COUNT }, () => 8 + Math.floor(Math.random() * 84));
}

function buildBubbleSteps(initial: number[]): BubbleStep[] {
  const values = [...initial];
  const steps: BubbleStep[] = [
    { values: [...values], active: [], sortedFrom: values.length, message: "Initial array" },
  ];

  for (let end = values.length - 1; end > 0; end -= 1) {
    let swapped = false;
    for (let i = 0; i < end; i += 1) {
      steps.push({
        values: [...values],
        active: [i, i + 1],
        sortedFrom: end + 1,
        message: `Compare ${values[i]} and ${values[i + 1]}`,
      });

      if (values[i] > values[i + 1]) {
        [values[i], values[i + 1]] = [values[i + 1], values[i]];
        swapped = true;
        steps.push({
          values: [...values],
          active: [i, i + 1],
          sortedFrom: end + 1,
          message: `Swap ${values[i + 1]} and ${values[i]}`,
        });
      }
    }

    if (!swapped) {
      steps.push({
        values: [...values],
        active: [],
        sortedFrom: 0,
        message: "No swaps in pass, array already sorted",
      });
      break;
    }
  }

  steps.push({
    values: [...values],
    active: [],
    sortedFrom: 0,
    message: "Done",
  });
  return steps;
}

export default function BubbleSortVisualizer() {
  const [baseValues, setBaseValues] = useState<number[]>(() => makeRandomValues());
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(260);

  const steps = useMemo(() => buildBubbleSteps(baseValues), [baseValues]);
  const step = steps[stepIndex];
  const maxValue = Math.max(...step.values, 1);
  const atEnd = stepIndex >= steps.length - 1;
  const autoPlaying = playing && !atEnd;

  useEffect(() => {
    if (!autoPlaying) {
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, Math.max(30, Math.floor(speed * PLAYBACK_MULTIPLIER)));

    return () => window.clearTimeout(timer);
  }, [autoPlaying, speed]);

  function reset() {
    setPlaying(false);
    setStepIndex(0);
    setBaseValues(makeRandomValues());
  }

  function nextStep() {
    setPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
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
          onClick={nextStep}
          className="border border-warm-border-dark px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted hover:bg-parchment-hover"
        >
          Step
        </button>
        <button
          type="button"
          onClick={reset}
          className="border border-warm-border-dark px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink-muted hover:bg-parchment-hover"
        >
          New Data
        </button>
        <label className="ml-auto flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          Speed
          <input
            type="range"
            min={90}
            max={700}
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
          const inActive = step.active.includes(index);
          const isSorted = index >= step.sortedFrom;
          return (
            <div key={`${index}-${value}`} className="flex flex-col items-center justify-end">
              <div
                className={`w-full rounded-t-sm transition-all duration-200 ${
                  inActive ? "bg-gold-bright" : isSorted ? "bg-ink" : "bg-gold-dark/75"
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
