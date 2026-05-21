// Cookies set by server (httpOnly) — frontend never touches tokens directly

import { API_BASE_URL } from "./client";

interface AdminLoginPayload {
  email: string;
  password: string;
}

function getLoginErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof error.detail === "string"
  ) {
    return error.detail;
  }

  return "Login failed";
}

export async function adminLogin(payload: AdminLoginPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ← send/receive httpOnly cookies
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(getLoginErrorMessage(err));
  }
}

export async function refreshToken(): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
