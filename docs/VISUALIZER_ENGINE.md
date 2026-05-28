# Visualizer Engine

This document defines the design and behavior of the interactive visualizer engine for CodeWithIshant v2.

## Goal

Create a reusable visualization core that can run algorithm steps, expose state transitions, and integrate cleanly with frontend rendering.

## Architecture

### Engine Responsibilities

- Accept algorithm input and configuration
- Produce deterministic state snapshots
- Support step-by-step progression
- Emit event callbacks for state changes
- Provide reset and replay functionality

### Engine Components

- `input`: algorithm parameters, initial array, node values
- `state`: current algorithm state, active indices, data structure contents
- `controls`: `play`, `pause`, `next`, `previous`, `reset`
- `metadata`: algorithm name, description, complexity notes

## Data Model

A visualizer run should expose:

- `steps[]`: ordered state snapshots
- `currentStep`: current index in the step sequence
- `highlight`: active elements for the current state
- `history`: past interactions or events

Example state shape:

```ts
interface VisualizerState {
  stepIndex: number;
  data: number[];
  pointers: Record<string, number>;
  message: string;
  activeItems: number[];
}
```

## Frontend Integration

- Use a dedicated visualizer page under `frontend/app/visualizer/`.
- Separate engine logic from rendering components.
- Render state snapshots using generic visualization components.
- Keep controls and state display in sync with engine updates.

## UI Controls

- `Play/Pause`: automatically step through snapshots.
- `Next`: advance one step.
- `Previous`: go back one step.
- `Reset`: restore initial state.
- `Speed`: optionally adjust playback speed.

## Algorithm Support

Start with a small set of well-defined examples:

- Sorting algorithms: bubble sort, selection sort, insertion sort
- Search algorithms: linear search, binary search
- Graph or tree traversal later as the engine matures

## Best Practices

- Keep algorithm logic separate from visualization state.
- Use plain state snapshots, not side-effects, for rendering.
- Support data-driven animations by deriving visuals from state.
- Provide clear labels for current step and active elements.

## Extensibility

- Add additional algorithm configurations without changing the core engine interface.
- Support multiple visualization modes (array, graph, tree) if needed.
- Add annotation or explanation text per step for learning context.
