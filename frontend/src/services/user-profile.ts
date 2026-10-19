import { type UserProfile } from "@/types/user-profile";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export async function getProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user-profile/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Profile fetch failed: ${res.status}`);
  }

  return res.json();
}

export async function updateProfile(data: {
  skin_behavior?: string;
  sensitivity?: string;
  concerns?: string[];
  current_products?: string[];
}): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user-profile/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Profile update failed: ${res.status}`);
  }

  return res.json();
}
