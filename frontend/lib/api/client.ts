import { API_BASE_URL as API_BASE_URL_CONST } from "@/constants";
import { refreshToken } from "./auth";

export const API_BASE_URL = API_BASE_URL_CONST;

type ErrorResponse = {
  detail?: unknown;
};

function hasStringDetail(error: unknown): error is { detail: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "detail" in error &&
    typeof (error as ErrorResponse).detail === "string"
  );
}

function getErrorMessage(error: unknown): string {
  if (hasStringDetail(error)) {
    return error.detail;
  }

  return "Request failed";
}

function getCsrfToken(): string | null {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrf_token="))
      ?.split("=")[1] ?? null
  );
}

async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const csrfToken = getCsrfToken();

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
    ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
  };

  const res = await fetch(input, { ...init, headers, credentials: "include" });

  if (res.status === 401) {
    // try silent refresh once
    const refreshed = await refreshToken();
    if (refreshed) {
      // re-read — refresh endpoint issues a new csrf_token cookie
      const newCsrf = getCsrfToken();
      const retryHeaders: Record<string, string> = {
        ...(init.headers as Record<string, string>),
        ...(newCsrf ? { "x-csrf-token": newCsrf } : {}),
      };
      return fetch(input, {
        ...init,
        headers: retryHeaders,
        credentials: "include",
      });
    }
    // refresh failed → redirect to login
    window.location.href = "/admin/login";
  }

  return res;
}

export async function getJson<T = unknown>(
  path: string,
  errorMessage: string,
): Promise<T> {
  const res = await fetchWithAuth(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(errorMessage);
  return res.json() as Promise<T>;
}

export async function postJson<T = unknown>(
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
    throw new Error(getErrorMessage(err));
  }
  return res.json() as Promise<T>;
}
