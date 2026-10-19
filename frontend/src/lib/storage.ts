export const STORAGE_KEYS = {
  routineHistory: "skinsense.routine.history",
  routineCurrent: "skinsense.routine.current",
  routinePaused: "skinsense.routine.paused",
  routineHidden: "skinsense.routine.hidden",
  journal: "skinsense.journal",
  prefs: "skinsense.prefs",
  onboardingNotes: "skinsense.onboarding.notes",
  onboardingPrefs: "skinsense.onboarding.prefs",
  lastAnalysis: "skinsense.lastAnalysis",
} as const;

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

export function clearAllSkinSenseData(): void {
  Object.values(STORAGE_KEYS).forEach(removeKey);
}
