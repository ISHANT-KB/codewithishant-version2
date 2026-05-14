import { API_BASE_URL } from "./client";

interface AdminLoginPayload {
  email: string;
  password: string;
}

interface AdminLoginResponse {
  access_token: string;
  token_type: string;
}

export async function adminLogin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Admin login failed");
  }

  return res.json() as Promise<AdminLoginResponse>;
}
