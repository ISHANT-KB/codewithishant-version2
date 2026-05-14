export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const ROUTES = {
  HOME: "/",
  NOTES: "/notes",
  TOPICS: "/topics",
  VISUALIZER: "/visualizer",
  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_NOTES: "/admin/notes",
  ADMIN_TOPIC: "/admin/topic",
  ADMIN_CHEATSHEET: "/admin/cheatsheet",
  ADMIN_BLOGS: "/admin/blogs",
} as const;

export const STORAGE_KEYS = {
  ADMIN_TOKEN: "token",
} as const;

export const UI_TEXT = {
  EMPTY_STATE_DEFAULT: "Nothing here yet.",
} as const;
