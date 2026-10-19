import { getHealth, type HealthResponse } from "./api";

export interface SessionResponse {
  session_id: string;
}

export async function getSession(): Promise<SessionResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/session/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Session check failed: ${res.status}`);
  }

  return res.json();
}
