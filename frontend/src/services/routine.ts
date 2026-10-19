import type { RoutineResult, StoredRoutine } from "@/types/routine";
import { STORAGE_KEYS, loadJSON, saveJSON } from "@/lib/storage";
import { uid } from "@/lib/format";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export async function generateRoutine(input: {
  skin_behavior: string;
  concerns: string[];
}): Promise<RoutineResult> {
  const res = await fetch(`${API_BASE_URL}/routine/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("routine-generation-failed");
  }

  return res.json();
}

export function getCurrentRoutine(): StoredRoutine | null {
  return loadJSON<StoredRoutine | null>(STORAGE_KEYS.routineCurrent, null);
}

export function setCurrentRoutine(routine: StoredRoutine): void {
  saveJSON(STORAGE_KEYS.routineCurrent, routine);
}

export function getRoutineHistory(): StoredRoutine[] {
  return loadJSON<StoredRoutine[]>(STORAGE_KEYS.routineHistory, []);
}

export function pushRoutineToHistory(routine: StoredRoutine): void {
  const history = getRoutineHistory();
  saveJSON(STORAGE_KEYS.routineHistory, [routine, ...history].slice(0, 20));
}

export function makeStoredRoutine(result: RoutineResult): StoredRoutine {
  return {
    ...result,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
}
