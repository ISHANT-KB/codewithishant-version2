export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const ROUTES = {
  home: "/",
  notes: "/notes",
  topics: "/topics",
  visualizer: "/visualizer",
  admin: {
    dashboard: "/admin",
    notes: "/admin/notes",
    topics: "/admin/topic",
    login: "/admin/login",
  }
} as const;

export const STORAGE_KEYS = {
  ADMIN_TOKEN: "token",
} as const;

export const UI_TEXT = {
  EMPTY_STATE_DEFAULT: "Nothing here yet.",
} as const;

export const ALGO_CATEGORIES = {
  sorting: "sorting",
  searching: "searching",
  graph: "graph",    // future
  tree: "tree",      // future
} as const;

export const ALGO_TYPES = {
  bubble: "bubble",
  selection: "selection",
  insertion: "insertion",
  merge: "merge",
  quick: "quick",
} as const;
