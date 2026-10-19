import { type IngredientResult } from "@/types/ingredient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export type { IngredientResult };

export async function explainIngredient(payload: { ingredient_name: string }): Promise<IngredientResult> {
  const res = await fetch(`${API_BASE_URL}/ingredient/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ingredient explanation failed: ${err}`);
  }

  return res.json();
}
