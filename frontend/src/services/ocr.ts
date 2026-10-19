export type OcrResult =
  | { ok: true; productName: string | null; brand: string | null; ingredients: string[] }
  | { ok: false; reason: "service_not_connected" | "unreadable" };

export function isAvailable(): boolean {
  return false;
}

export async function readProductImage(_file: File): Promise<OcrResult> {
  return { ok: false, reason: "service_not_connected" };
}
