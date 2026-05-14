import { API_BASE_URL as API_BASE_URL_CONST } from "@/constants";

export const API_BASE_URL = API_BASE_URL_CONST;

export async function getJson<T = any>(
  path: string,
  errorMessage: string,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}
