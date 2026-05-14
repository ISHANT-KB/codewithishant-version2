"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  memo,
} from "react";

import {
  ITEM_COUNT,
  MIN_SPEED,
  MAX_SPEED,
  DEFAULT_SPEED,
  MAX_BAR_HEIGHT,
  MIN_BAR_HEIGHT,
  makeRandomValues,
} from "./constants";

interface MergeStep {
  values: number[];
  activeRange: [number, number] | null;
  message: string;
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
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, values.length - 1);
  steps.push({ values: [...values], activeRange: null, message: "Done" });
  return steps;
}

interface BarProps {
  value: number;
  height: number;
  isActive: boolean;
}

const Bar = memo(function Bar({ value, height, isActive }: BarProps) {
  return (
    <div className="flex flex-col items-center justify-end contain-layout">
      <div
        className={`w-full rounded-t-sm will-change-[height] ${
          isActive ? "bg-gold-bright" : "bg-gold-dark/75"
        }`}
        style={{
          height: `${height}px`,
          transition:
            "height 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 100ms ease",
        }}
      />
      <span className="mt-1 text-[9px] text-ink-faint tabular-nums">{value}</span>
    </div>
  );
});

export default function MergeSortVisualizer() {
  const [baseValues, setBaseValues] = useState<number[]>(makeRandomValues);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  const steps = useMemo(() => buildMergeSteps(baseValues), [baseValues]);
  const step = steps[stepIndex];
  const maxValue = useMemo(() => Math.max(...step.values, 1), [step.values]);
  const atEnd = stepIndex >= steps.length - 1;

  const heights = useMemo(
    () =>
      step.values.map((v) =>
        Math.max(MIN_BAR_HEIGHT, (v / maxValue) * MAX_BAR_HEIGHT)
      ),
    [step.values, maxValue]
  );

  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const stepIndexRef = useRef(stepIndex);
  const stepsRef = useRef(steps);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    playingRef.current = playing;
    speedRef.current = speed;
    stepIndexRef.current = stepIndex;
    stepsRef.current = steps;
  });

  useEffect(() => {
    if (!playing || atEnd) return;

    const loop = (timestamp: number) => {
      if (!playingRef.current) return;

      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= speedRef.current) {
        lastTimeRef.current = timestamp;
        const next = stepIndexRef.current + 1;
        if (next < stepsRef.current.length) {
          setStepIndex(next);
        } else {
          setPlaying(false);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [playing, atEnd]);

  const reset = useCallback(() => {
    setPlaying(false);
    setStepIndex(0);
    setBaseValues(makeRandomValues());
  }, []);

  const nextStep = useCallback(() => {
    setPlaying(false);
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const togglePlay = useCallback(() => {
    setPlaying((prev) => {
      if (prev) return false;
      if (stepIndex >= steps.length - 1) {
        setStepIndex(0);
      }
      return true;
    });
  }, [stepIndex, steps.length]);

  const speedTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const handleSpeedChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      if (speedTimeoutRef.current) clearTimeout(speedTimeoutRef.current);
      speedTimeoutRef.current = setTimeout(() => setSpeed(val), 16);
    },
    []
  );

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <section className="space-y-6 rounded-2xl border border-warm-border bg-stone-50 p-6 contain-layout">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="nb-top-fill relative overflow-hidden border border-ink px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-parchment"
        >
          <span className="relative z-10">
            {playing && !atEnd ? "Pause" : "Play"}
          </span>
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
            min={MIN_SPEED}
            max={MAX_SPEED}
            defaultValue={speed}
            onChange={handleSpeedChange}
            className="accent-gold-bright"
          />
        </label>
      </div>

      <div
        className="grid min-h-72 items-end gap-1 rounded-xl border border-warm-border bg-white p-3 contain-layout"
        style={{
          gridTemplateColumns: `repeat(${ITEM_COUNT}, minmax(0, 1fr))`,
        }}
      >
        {step.values.map((value, index) => {
          const isActive =
            step.activeRange !== null &&
            index >= step.activeRange[0] &&
            index <= step.activeRange[1];
          return (
            <Bar
              key={index}
              value={value}
              height={heights[index]}
              isActive={isActive}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-warm-border pt-4">
        <p className="text-sm text-ink-muted">{step.message}</p>
        <p className="text-[11px] uppercase tracking-[0.12em] text-ink-faint tabular-nums">
          Step {stepIndex + 1} / {steps.length}
        </p>
      </div>
    </section>
  );
}