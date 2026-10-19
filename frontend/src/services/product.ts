const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export async function checkProduct(
  payload: { product_name: string; ingredients: string[]; skin_behavior: string; concerns: string[] }
) {
  const res = await fetch(`${API_BASE_URL}/product/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Product check failed: ${err}`);
  }

  return res.json();
}
