const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE_URL}/health/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }

  return res.json();
}
