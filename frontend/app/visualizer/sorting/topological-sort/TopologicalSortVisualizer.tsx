"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  PRESETS,
  WHITE,
  GRAY,
  BLACK,
  getSpeedMs,
} from "./constants";

type StepType =
  | "init"
  | "visit"
  | "edge"
  | "finish"
  | "done";

interface Step {
  type: StepType;
  u?: number;
  v?: number;
  color: number[];
  stack: number[];
  result: number[];
  finish: number[];
  activeEdge: [number, number] | null;
  doneNodes: Set<number>;
  msg: string;
  hasCycle?: boolean;
}

export default function TopologicalSortVisualizer() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);

  const preset = PRESETS[presetIndex];
  const V = preset.V;

  const nodeLabels = preset.nodes;

  const nodePos = useMemo(
    () => preset.pos.map(([x, y]) => ({ x, y })),
    [preset]
  );

  const adjList = useMemo(() => {
    const list: number[][] = Array.from(
      { length: V },
      () => []
    );

    for (const [u, v] of preset.edges) {
      list[u].push(v);
    }

    return list;
  }, [preset, V]);

  /* =========================================================
      STEP GENERATION
  ========================================================= */

  const steps = useMemo<Step[]>(() => {
    const color = Array(V).fill(WHITE);
    const finish = Array(V).fill(-1);

    const result: number[] = [];
    const steps_: Step[] = [];

    let time = 0;
    let hasCycle = false;

    const callStack: number[] = [];
    const doneNodes = new Set<number>();

    const pushStep = (step: Step) => {
      steps_.push({
        ...step,
        color: [...step.color],
        stack: [...step.stack],
        result: [...step.result],
        finish: [...step.finish],
        doneNodes: new Set(step.doneNodes),
      });
    };

    pushStep({
      type: "init",
      color,
      stack: [],
      result: [],
      finish,
      activeEdge: null,
      doneNodes,
      msg: "Ready — press PLAY or STEP",
    });

    function dfs(u: number) {
      if (hasCycle) return;

      color[u] = GRAY;
      callStack.push(u);

      pushStep({
        type: "visit",
        u,
        color,
        stack: callStack,
        result,
        finish,
        activeEdge: null,
        doneNodes,
        msg: `Entering ${nodeLabels[u]}`,
      });

      for (const v of adjList[u]) {
        if (hasCycle) return;

        pushStep({
          type: "edge",
          u,
          v,
          color,
          stack: callStack,
          result,
          finish,
          activeEdge: [u, v],
          doneNodes,
          msg: `Exploring edge ${nodeLabels[u]} → ${nodeLabels[v]}`,
        });

        if (color[v] === WHITE) {
          dfs(v);
        } else if (color[v] === GRAY) {
          hasCycle = true;

          pushStep({
            type: "done",
            color,
            stack: callStack,
            result: [],
            finish,
            activeEdge: [u, v],
            doneNodes,
            hasCycle: true,
            msg: `Cycle detected at ${nodeLabels[v]} — topological sort impossible`,
          });

          return;
        }
      }

      color[u] = BLACK;

      finish[u] = ++time;

      result.unshift(u);

      doneNodes.add(u);

      callStack.pop();

      pushStep({
        type: "finish",
        u,
        color,
        stack: callStack,
        result,
        finish,
        activeEdge: null,
        doneNodes,
        msg: `Finished ${nodeLabels[u]} · finish=${time}`,
      });
    }

    for (let i = 0; i < V; i++) {
      if (hasCycle) break;

      if (color[i] === WHITE) {
        dfs(i);
      }
    }

    if (!hasCycle) {
      pushStep({
        type: "done",
        color,
        stack: [],
        result,
        finish,
        activeEdge: null,
        doneNodes,
        hasCycle: false,
        msg: `Complete! Topological Order: ${result
          .map((i) => nodeLabels[i])
          .join(" → ")}`,
      });
    }

    return steps_;
  }, [V, nodeLabels, adjList]);

  const currentStep = steps[stepIndex] ?? steps[0];

  const atEnd = stepIndex >= steps.length - 1;

  /* =========================================================
      CANVAS
  ========================================================= */

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const drawArrow = useCallback(
    (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      color: string,
      width: number,
      radius: number
    ) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      const len = Math.sqrt(dx * dx + dy * dy);

      if (len < 2) return;

      const ux = dx / len;
      const uy = dy / len;

      const sx = p1.x + ux * radius;
      const sy = p1.y + uy * radius;

      const ex = p2.x - ux * radius;
      const ey = p2.y - uy * radius;

      ctx.beginPath();

      ctx.moveTo(sx, sy);

      ctx.lineTo(ex, ey);

      ctx.strokeStyle = color;
      ctx.lineWidth = width;

      ctx.stroke();

      const arrowLength = 10;

      const angle = Math.atan2(ey - sy, ex - sx);

      ctx.beginPath();

      ctx.moveTo(ex, ey);

      ctx.lineTo(
        ex - arrowLength * Math.cos(angle - 0.45),
        ey - arrowLength * Math.sin(angle - 0.45)
      );

      ctx.lineTo(
        ex - arrowLength * Math.cos(angle + 0.45),
        ey - arrowLength * Math.sin(angle + 0.45)
      );

      ctx.closePath();

      ctx.fillStyle = color;

      ctx.fill();
    },
    []
  );

  const drawGraph = useCallback(
    (state: Step) => {
      const canvas = canvasRef.current;
      const wrap = canvasWrapRef.current;

      if (!canvas || !wrap) return;

      const W = wrap.offsetWidth || 700;

      const scale = W / 720;

      const H = Math.max(340, 320 * scale);

      canvas.width = W;
      canvas.height = H;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);

      const PAD = 40;

      const nodes = nodePos.map((p) => ({
        x: Math.max(
          PAD,
          Math.min(p.x * scale, W - PAD)
        ),
        y: p.y * scale,
      }));

      /* ================= EDGES ================= */

      for (let u = 0; u < V; u++) {
        for (const v of adjList[u]) {
          const active =
            state.activeEdge &&
            state.activeEdge[0] === u &&
            state.activeEdge[1] === v;

          const done =
            state.doneNodes.has(u) &&
            state.doneNodes.has(v);

          drawArrow(
            nodes[u],
            nodes[v],
            active
              ? "#c8a264"
              : done
                ? "rgba(30,30,30,0.4)"
                : "#d8d3ca",
            active ? 2.5 : 1.3,
            24
          );
        }
      }

      /* ================= NODES ================= */

      for (let i = 0; i < V; i++) {
        const { x, y } = nodes[i];

        const radius = 24;

        let fill = "#faf9f7";
        let stroke = "#d6d1c7";
        let text = "#7b756d";

        if (state.color[i] === GRAY) {
          fill = "rgba(200,162,100,0.12)";
          stroke = "#c8a264";
          text = "#8b6914";
        }

        if (state.color[i] === BLACK) {
          fill = "rgba(30,30,30,0.08)";
          stroke = "#1e1e1e";
          text = "#1e1e1e";
        }

        ctx.shadowColor = stroke;
        ctx.shadowBlur =
          state.color[i] === WHITE ? 0 : 10;

        ctx.beginPath();

        ctx.arc(x, y, radius, 0, Math.PI * 2);

        ctx.fillStyle = fill;

        ctx.fill();

        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;

        ctx.stroke();

        ctx.shadowBlur = 0;

        const fontSize = Math.max(
          7,
          14 - nodeLabels[i].length * 0.6
        );

        ctx.fillStyle = text;

        ctx.font = `bold ${fontSize}px monospace`;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(nodeLabels[i], x, y);

        if (state.finish[i] > 0) {
          ctx.fillStyle = "rgba(0,0,0,0.45)";

          ctx.font = `10px monospace`;

          ctx.fillText(
            `f=${state.finish[i]}`,
            x,
            y + radius + 12
          );
        }
      }
    },
    [V, nodePos, nodeLabels, adjList, drawArrow]
  );

  useEffect(() => {
    drawGraph(currentStep);
  }, [currentStep, drawGraph]);

  useEffect(() => {
    const wrap = canvasWrapRef.current;

    if (!wrap) return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        drawGraph(currentStep);
      });
    });

    ro.observe(wrap);

    return () => ro.disconnect();
  }, [currentStep, drawGraph]);

  /* =========================================================
      PLAYBACK LOOP
  ========================================================= */

  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  const stepRef = useRef(stepIndex);
  const stepsRef = useRef(steps);

  const rafRef = useRef<number>(0);

  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    playingRef.current = playing;
    speedRef.current = speed;
    stepRef.current = stepIndex;
    stepsRef.current = steps;
  });

  useEffect(() => {
    if (!playing || atEnd) return;

    const loop = (time: number) => {
      if (!playingRef.current) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const interval = getSpeedMs(speedRef.current);

      const elapsed = time - lastTimeRef.current;

      if (elapsed >= interval) {
        lastTimeRef.current += interval;

        const next = stepRef.current + 1;

        if (next < stepsRef.current.length) {
          setStepIndex(next);
        } else {
          setPlaying(false);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);

      lastTimeRef.current = 0;
    };
  }, [playing, atEnd]);

  /* =========================================================
      HANDLERS
  ========================================================= */

  const loadPreset = useCallback((idx: number) => {
    setPresetIndex(idx);

    setStepIndex(0);

    setPlaying(false);
  }, []);

  const nextGraph = useCallback(() => {
    loadPreset((presetIndex + 1) % PRESETS.length);
  }, [presetIndex, loadPreset]);

  const reset = useCallback(() => {
    setPlaying(false);

    setStepIndex(0);
  }, []);

  const stepForward = useCallback(() => {
    setPlaying(false);

    setStepIndex((prev) =>
      Math.min(prev + 1, steps.length - 1)
    );
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

  /* =========================================================
      RENDER
  ========================================================= */

  return (
    <section className="space-y-6">
      {/* CONTROLS */}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={togglePlay}
          className="border border-black px-4 py-2 text-xs"
        >
          {playing && !atEnd
            ? "Pause"
            : "Play"}
        </button>

        <button
          onClick={stepForward}
          className="border px-4 py-2 text-xs"
        >
          Step
        </button>

        <button
          onClick={reset}
          className="border px-4 py-2 text-xs"
        >
          Reset
        </button>

        <button
          onClick={nextGraph}
          className="border px-4 py-2 text-xs"
        >
          Next Graph
        </button>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-xs">
            Speed
          </span>

          <input
            type="range"
            min={1}
            max={9}
            value={speed}
            onChange={(e) =>
              setSpeed(Number(e.target.value))
            }
          />
        </div>

        <select
          value={presetIndex}
          onChange={(e) =>
            loadPreset(Number(e.target.value))
          }
          className="border px-3 py-2 text-xs"
        >
          {PRESETS.map((p, i) => (
            <option key={i} value={i}>
              {p.label}
            </option>
          ))}
        </select>

        {currentStep.hasCycle && (
          <span className="text-red-500 text-xs font-semibold">
            ⚠ Cycle Detected
          </span>
        )}
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* GRAPH */}

        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="flex justify-between border-b px-4 py-3">
            <span className="text-xs uppercase">
              Graph
            </span>

            <span className="text-xs">
              V={V} · E={preset.edges.length}
            </span>
          </div>

          <div
            ref={canvasWrapRef}
            className="p-3"
          >
            <canvas
              ref={canvasRef}
              className="w-full block"
            />
          </div>
        </div>

        {/* SIDE PANEL */}

        <div className="space-y-4">
          {/* STACK */}

          <div className="rounded-xl border bg-white overflow-hidden">
            <div className="border-b px-4 py-3 text-xs uppercase">
              DFS Stack
            </div>

            <div className="p-3 min-h-30">
              {currentStep.stack.length === 0 ? (
                <div className="text-xs text-neutral-400">
                  Empty
                </div>
              ) : (
                <div className="space-y-2">
                  {currentStep.stack
                    .slice()
                    .reverse()
                    .map((u, idx) => (
                      <div
                        key={`${u}-${idx}`}
                        className={`rounded border px-3 py-2 text-xs flex justify-between ${
                          idx === 0
                            ? "bg-yellow-50 border-yellow-400"
                            : "bg-neutral-50"
                        }`}
                      >
                        <span>
                          {nodeLabels[u]}
                        </span>

                        <span>
                          {idx === 0
                            ? "ACTIVE"
                            : "WAITING"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* RESULT */}

          <div className="rounded-xl border bg-white overflow-hidden">
            <div className="border-b px-4 py-3 text-xs uppercase">
              Topological Order
            </div>

            <div className="p-3">
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  { length: V },
                  (_, pos) => {
                    const node =
                      currentStep.result[pos];

                    return (
                      <div
                        key={pos}
                        className={`w-10 h-10 rounded border flex items-center justify-center text-sm font-bold ${
                          node !== undefined
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-400"
                        }`}
                      >
                        {node !== undefined
                          ? nodeLabels[node]
                          : ""}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOG */}

      <div className="rounded-xl border bg-white px-4 py-3 text-sm">
        {currentStep.msg}
      </div>
    </section>
  );
}