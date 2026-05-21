import { API_BASE_URL as API_BASE_URL_CONST } from "@/constants";
import { refreshToken } from "./auth";

export const API_BASE_URL = API_BASE_URL_CONST;

async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const res = await fetch(input, { ...init, credentials: "include" });

  if (res.status === 401) {
    // try silent refresh once
    const refreshed = await refreshToken();
    if (refreshed) {
      return fetch(input, { ...init, credentials: "include" });
    }
    // refresh failed → redirect to login
    window.location.href = "/admin/login";
  }

  return res;
}

export async function getJson<T = any>(
  path: string,
  errorMessage: string,
): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(errorMessage);
  return res.json() as Promise<T>;
}

export async function postJson<T = any>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).detail ?? "Request failed");
  }
  return res.json() as Promise<T>;
}
